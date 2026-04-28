from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from ml_model import model_instance

app = FastAPI(title="Credit Risk Predictor API")

prediction_history = []

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL
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

@app.post("/predict")
def predict_risk(application: LoanApplication):
    # Map employment type to one-hot encoding
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
        'emp_employed': emp_employed,
        'emp_self_employed': emp_self_employed,
        'emp_unemployed': emp_unemployed
    }
    
    try:
        result = model_instance.predict_and_explain(input_data)
        
        # Save to history (keep last 50)
        prediction_history.insert(0, {"input": input_data, "result": result})
        if len(prediction_history) > 50:
            prediction_history.pop()
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/what-if")
def what_if_predict(application: LoanApplication):
    # Same as predict but explicitly named for what-if scenarios
    # Note: What-if predictions are usually NOT saved to history, or saved separately.
    # We will just run the model directly.
    # We reuse the same logic as predict but don't save to history list.
    
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

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Credit Risk Predictor API is running."}
