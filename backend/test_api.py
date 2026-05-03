import requests

url = "http://127.0.0.1:8000/what-if"
data1 = {
    "age": 30, "income": 50000, "employment_type": "Employed",
    "credit_history": 700, "existing_loans": 2, "debt_to_income_ratio": 0.3,
    "loan_amount": 10000, "loan_term": 36
}
data2 = {
    "age": 45, "income": 150000, "employment_type": "Employed",
    "credit_history": 820, "existing_loans": 0, "debt_to_income_ratio": 0.1,
    "loan_amount": 5000, "loan_term": 12
}

r1 = requests.post(url, json=data1)
r2 = requests.post(url, json=data2)

print("r1:", r1.json().get('risk_probability'))
print("r2:", r2.json().get('risk_probability'))
