from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from ml_model import model_instance
import requests
import random
import os
import jwt
import datetime
from typing import Optional

# Configuration
RESEND_API_KEY = "re_HEsog1YF_EXEaA6AL8v7GnJ94wRodsm69"
JWT_SECRET = "finquantix-super-secret-key-2026"
JWT_ALGORITHM = "HS256"

app = FastAPI(title="Credit Risk Predictor API")
security = HTTPBearer()

# In-memory stores
user_store = {} # {email: {first_name, last_name, password, verified}}
otp_store = {} # {email: otp}
prediction_history = {} # {email: [predictions]}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class LoanApplication(BaseModel):
    age: int = Field(..., ge=18, le=100)
    income: float = Field(..., ge=0)
    employment_type: str
    credit_history: int = Field(..., ge=300, le=850)
    existing_loans: int = Field(..., ge=0)
    debt_to_income_ratio: float = Field(..., ge=0.0, le=1.0)
    loan_amount: float = Field(..., ge=100)
    loan_term: int = Field(..., gt=0)

class EmailRequest(BaseModel):
    email: str

class OTPRequest(BaseModel):
    email: str
    otp: str

class UserSignupRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str

class UserLoginRequest(BaseModel):
    email: str

# --- Auth Helpers ---
def create_access_token(email: str):
    expire = datetime.datetime.utcnow() + datetime.timedelta(days=7)
    to_encode = {"sub": email, "exp": expire}
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_current_user(auth: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(auth.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# --- Endpoints ---
@app.post("/predict")
def predict_risk(application: LoanApplication, user_email: str = Depends(get_current_user)):
    emp_employed = 1 if application.employment_type == 'Employed' else 0
    emp_self_employed = 1 if application.employment_type == 'Self-Employed' else 0
    emp_unemployed = 1 if application.employment_type == 'Unemployed' else 0

    if application.employment_type not in ['Employed', 'Self-Employed', 'Unemployed']:
        raise HTTPException(status_code=400, detail="Invalid employment_type")

    input_data = {
        'age': application.age,
        'income': application.income,
        'credit_history': application.credit_history,
        'existing_loans': application.existing_loans,
        'debt_to_income_ratio': application.debt_to_income_ratio,
        'loan_amount': application.loan_amount,
        'loan_term': application.loan_term,
        'employment_type': application.employment_type,
        'emp_employed': emp_employed,
        'emp_self_employed': emp_self_employed,
        'emp_unemployed': emp_unemployed
    }
    
    try:
        result = model_instance.predict_and_explain(input_data)
        
        # Save to user-specific history
        if user_email not in prediction_history:
            prediction_history[user_email] = []
        
        prediction_record = {
            "input": input_data,
            "result": result,
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
        prediction_history[user_email].insert(0, prediction_record)
        
        if len(prediction_history[user_email]) > 50:
            prediction_history[user_email].pop()
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/what-if")
def what_if_predict(application: LoanApplication):
    # What-if remains public as it's a playground, but could be restricted if needed
    emp_employed = 1 if application.employment_type == 'Employed' else 0
    emp_self_employed = 1 if application.employment_type == 'Self-Employed' else 0
    emp_unemployed = 1 if application.employment_type == 'Unemployed' else 0

    input_data = {
        'age': application.age,
        'income': application.income,
        'credit_history': application.credit_history,
        'existing_loans': application.existing_loans,
        'debt_to_income_ratio': application.debt_to_income_ratio,
        'loan_amount': application.loan_amount,
        'loan_term': application.loan_term,
        'employment_type': application.employment_type,
        'emp_employed': emp_employed,
        'emp_self_employed': emp_self_employed,
        'emp_unemployed': emp_unemployed
    }
    return model_instance.predict_and_explain(input_data)

@app.get("/history")
def get_history(user_email: str = Depends(get_current_user)):
    return prediction_history.get(user_email, [])

@app.get("/metrics")
def get_metrics():
    return model_instance.metrics

@app.get("/feature-importance")
def get_feature_importance():
    return {"global_feature_importance": model_instance.get_feature_importance()}

# --- Auth ---
def send_email_otp(email: str, otp: str):
    print(f"--- Attempting to send OTP to {email} ---")
    try:
        url = "https://api.resend.com/emails"
        headers = {"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json"}
        html_content = f"""
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 40px; background-color: #020617; color: #f8fafc; border-radius: 24px; border: 1px solid #1e293b;">
            <h1 style="color: #00E7FF; text-align: center;">FinQuantiX</h1>
            <p>Your verification code is:</p>
            <div style="background: #0f172a; padding: 24px; border-radius: 16px; text-align: center; border: 1px solid #334155;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #ffffff;">{otp}</span>
            </div>
        </div>
        """
        data = {"from": "FinQuantiX <onboarding@resend.dev>", "to": [email], "subject": f"{otp} verification code", "html": html_content}
        response = requests.post(url, headers=headers, json=data, timeout=5)
        print(f"Resend Response: {response.status_code} - {response.text}")
        return response.status_code in [200, 201]
    except Exception as e:
        print(f"Resend Error: {e}")
        return False

@app.post("/auth/signup")
def signup(req: UserSignupRequest):
    if req.email in user_store:
        raise HTTPException(status_code=400, detail="User already exists")
    user_store[req.email] = {"first_name": req.first_name, "last_name": req.last_name, "password": req.password, "verified": False}
    return {"status": "success"}

@app.post("/auth/login")
def login(req: UserLoginRequest):
    if req.email not in user_store:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "success"}

from fastapi import BackgroundTasks

@app.post("/auth/send-otp")
def send_otp(req: EmailRequest, background_tasks: BackgroundTasks):
    otp = "".join([str(random.randint(0, 9)) for _ in range(6)])
    otp_store[req.email] = otp
    
    # Send email in background to prevent frontend hang
    background_tasks.add_task(send_email_otp, req.email, otp)
    
    print(f"OTP generated for {req.email}: {otp}") 
    return {"status": "success", "message": "OTP processing"}

@app.post("/auth/verify-otp")
def verify_otp(req: OTPRequest):
    if otp_store.get(req.email) == req.otp:
        del otp_store[req.email]
        if req.email in user_store:
            user_store[req.email]["verified"] = True
        
        token = create_access_token(req.email)
        return {
            "status": "success", 
            "token": token,
            "user": user_store.get(req.email, {"email": req.email})
        }
    raise HTTPException(status_code=400, detail="Invalid OTP")

@app.get("/health")
def health_check():
    return {"status": "healthy"}
