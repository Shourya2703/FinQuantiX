from ml_model import model_instance

try:
    res = model_instance.predict_and_explain({
        "age": 30, "income": 60000, "credit_history": 720, "existing_loans": 1,
        "debt_to_income_ratio": 0.3, "loan_amount": 20000, "loan_term": 36,
        "emp_employed": 1, "emp_self_employed": 0, "emp_unemployed": 0
    })
    print("Success:", res)
except Exception as e:
    import traceback
    traceback.print_exc()
