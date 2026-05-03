import joblib
import pandas as pd
data = joblib.load('model.joblib')
scaler = data['scaler']

test_data = {
    'age': 30, 'income': 50000, 'credit_history': 700, 
    'existing_loans': 2, 'debt_to_income_ratio': 0.3, 
    'loan_amount': 10000, 'loan_term': 36,
    'emp_employed': 1.0, 'emp_self_employed': 0.0, 'emp_unemployed': 0.0,
    'loan_income_ratio': 10000 / 50001,
    'risk_index': 0.3 * (1000 - 700)
}
features = [
    'age', 'income', 'credit_history', 'existing_loans', 
    'debt_to_income_ratio', 'loan_amount', 'loan_term',
    'emp_employed', 'emp_self_employed', 'emp_unemployed',
    'loan_income_ratio', 'risk_index'
]
df = pd.DataFrame([test_data])[features]
scaled = scaler.transform(df)
print("Scaled features:")
for f, v in zip(features, scaled[0]):
    print(f"{f}: {v}")

print("Score:", data['model'].decision_function(scaled))
