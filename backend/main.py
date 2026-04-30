from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from ml_model import model_instance
import requests
import random
import os

RESEND_API_KEY = "re_HEsog1YF_EXEaA6AL8v7GnJ94wRodsm69" 

app = FastAPI(title="Credit Risk Predictor API")

prediction_history = []
otp_store = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoanApplication(BaseModel):
    age: int = Field(..., ge=18, le=100, description="Age of the applicant")
    income: float = Field(..., ge=0, description="Annual income")
    employment_type: str = Field(..., description="Employment type (Employed, Self-Employed, Unemployed)")
    credit_history: int = Field(..., ge=300, le=850, description="Credit score")
    existing_loans: int = Field(..., ge=0, description="Number of existing loans")
    debt_to_income_ratio: float = Field(..., ge=0.0, le=1.0, description="Debt to Income ratio (0.0 to 1.0)")
    loan_amount: float = Field(..., ge=100, description="Requested loan amount")
    loan_term: int = Field(..., gt=0, description="Loan term in months")

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

user_store = {} # Simulated DB: {email: {first_name, last_name, password}}

@app.post("/predict")
def predict_risk(application: LoanApplication):
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
        
        prediction_history.insert(0, {"input": input_data, "result": result})
        if len(prediction_history) > 50:
            prediction_history.pop()
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/what-if")
def what_if_predict(application: LoanApplication):
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
        return model_instance.predict_and_explain(input_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
def get_history():
    return prediction_history

@app.get("/metrics")
def get_metrics():
    return model_instance.metrics

@app.get("/feature-importance")
def get_feature_importance():
    return {"global_feature_importance": model_instance.get_feature_importance()}

def send_email_otp(email: str, otp: str):
    if RESEND_API_KEY == "re_123456789":
        print(f"\n[WARNING] RESEND_API_KEY not configured. OTP for {email}: {otp}\n")
        return False
        
    try:
        url = "https://api.resend.com/emails"
        headers = {
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json"
        }
        html_content = f"""
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 40px; background-color: #020617; color: #f8fafc; border-radius: 24px; border: 1px solid #1e293b;">
            <h1 style="color: #6366f1; text-align: center; margin-bottom: 24px;">FinQuantiX</h1>
            <p style="font-size: 16px; line-height: 24px;">Hello,</p>
            <p style="font-size: 16px; line-height: 24px;">Your secure one-time password (OTP) for accessing the Credit Risk Engine is:</p>
            <div style="background: #0f172a; padding: 24px; border-radius: 16px; text-align: center; margin: 32px 0; border: 1px solid #334155;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #ffffff;">{otp}</span>
            </div>
            <p style="font-size: 14px; color: #94a3b8;">This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #1e293b; margin: 32px 0;">
            <p style="font-size: 12px; color: #64748b; text-align: center;">&copy; 2026 FinQuantiX AI Systems. Confidential &amp; Secure.</p>
        </div>
        """
        
        data = {
            "from": "FinQuantiX <onboarding@resend.dev>",
            "to": [email],
            "subject": f"{otp} is your FinQuantiX verification code",
            "html": html_content
        }
        
        response = requests.post(url, headers=headers, json=data)
        return response.status_code == 200 or response.status_code == 201
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

@app.post("/auth/signup")
def signup(req: UserSignupRequest):
    if req.email in user_store:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Store user data temporarily (verified after OTP)
    user_store[req.email] = {
        "first_name": req.first_name,
        "last_name": req.last_name,
        "password": req.password,
        "verified": False
    }
    return {"status": "success", "message": "User registered. Please verify OTP."}

@app.post("/auth/login")
def login(req: UserLoginRequest):
    if req.email not in user_store:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "success", "message": "Proceed to OTP verification."}

@app.post("/auth/send-otp")
def send_otp(req: EmailRequest):
    otp = "".join([str(random.randint(0, 9)) for _ in range(6)])
    otp_store[req.email] = otp
    
    success = send_email_otp(req.email, otp)
    
    return {
        "status": "success" if success else "simulated", 
        "message": "OTP sent successfully" if success else "OTP generated (see terminal for demo)"
    }

@app.post("/auth/verify-otp")
def verify_otp(req: OTPRequest):
    stored_otp = otp_store.get(req.email)
    if stored_otp and req.otp == stored_otp:
        del otp_store[req.email]
        
        # Mark user as verified if they were in signup flow
        if req.email in user_store:
            user_store[req.email]["verified"] = True
            
        return {
            "status": "success", 
            "token": "fake-jwt-token",
            "user": user_store.get(req.email, {"email": req.email})
        }
    raise HTTPException(status_code=400, detail="Invalid or expired OTP")

@app.get("/")
def root_check():
    return {"status": "ok", "message": "Credit Risk Predictor API is running."}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
