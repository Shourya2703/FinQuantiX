import joblib
data = joblib.load('model.joblib')
model = data['model']
print("Intercept:", model.intercept_)
print("Coefficients:", model.coef_)
