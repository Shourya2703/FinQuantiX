import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import shap
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score, roc_curve
import os
import logging
import joblib
import json

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class CreditRiskModel:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.explainer = None
        self.metrics = {}
        self.feature_names = [
            'age', 'income', 'credit_history', 'existing_loans', 
            'debt_to_income_ratio', 'loan_amount', 'loan_term',
            'emp_employed', 'emp_self_employed', 'emp_unemployed',
            'loan_income_ratio', 'risk_index'
        ]

    def _load_and_preprocess_data(self, file_path="lending_club_sample.csv"):
        if not os.path.exists(file_path):
            df = pd.DataFrame(index=range(10000))
        else:
            df = pd.read_csv(file_path, nrows=10000)

        np.random.seed(42)
        df['income'] = np.random.normal(60000, 25000, len(df)).clip(10000, 250000)
        df['loan_amount'] = np.random.normal(15000, 10000, len(df)).clip(1000, 60000)
        df['debt_to_income_ratio'] = np.random.uniform(0.05, 0.7, len(df))
        df['age'] = np.random.randint(18, 75, size=len(df))
        df['credit_history'] = np.random.randint(400, 850, size=len(df))
        df['existing_loans'] = np.random.randint(0, 12, size=len(df))
        df['loan_term'] = np.random.choice([12, 24, 36, 60, 72, 84], size=len(df))
        
        emp_choices = ['Employed', 'Self-Employed', 'Unemployed']
        emp_types = np.random.choice(emp_choices, size=len(df), p=[0.7, 0.2, 0.1])
        df['emp_employed'] = (emp_types == 'Employed').astype(int)
        df['emp_self_employed'] = (emp_types == 'Self-Employed').astype(int)
        df['emp_unemployed'] = (emp_types == 'Unemployed').astype(int)

        df['loan_income_ratio'] = df['loan_amount'] / (df['income'] + 1)
        df['risk_index'] = df['debt_to_income_ratio'] * (1000 - df['credit_history'])
        
        score = (
            (df['debt_to_income_ratio'] * 35) + 
            (df['loan_income_ratio'] * 60) + 
            ((850 - df['credit_history']) / 8.0) +
            (df['existing_loans'] * 2.5) -
            (df['age'] / 15.0) +
            (df['emp_unemployed'] * 45) +
            (df['emp_self_employed'] * 12)
        )
        
        score += np.where(df['loan_income_ratio'] > 0.8, 150, 0)
        
        score = (score - score.mean()) / score.std()
        prob = 1 / (1 + np.exp(-(score * 2.0)))
        df['loan_status'] = (prob > 0.5).astype(int)

        return df[self.feature_names], df['loan_status']

    def train(self, model_path="model.joblib", metrics_path="metrics.json", background_path="background.csv"):
        if os.path.exists(model_path):
            data = joblib.load(model_path)
            self.model = data['model']
            self.scaler = data['scaler']
            with open(metrics_path, 'r') as f: self.metrics = json.load(f)
            X, _ = self._load_and_preprocess_data()
            self.explainer = shap.LinearExplainer(self.model, self.scaler.transform(X.sample(100, random_state=42)))
            return
            
        logger.info("Initializing FinQuantiX Analytical Engine...")
        X, y = self._load_and_preprocess_data()
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        self.model = LogisticRegression(C=1.0, max_iter=2000)
        self.model.fit(X_train_scaled, y_train)
        
        y_prob = self.model.predict_proba(X_test_scaled)[:, 1]
        fpr, tpr, _ = roc_curve(y_test, y_prob)
        
        indices = np.linspace(0, len(fpr) - 1, 50).astype(int)
        roc_points = [{"fpr": float(fpr[i]), "tpr": float(tpr[i])} for i in indices]
        
        self.metrics = {
            "accuracy": float(accuracy_score(y_test, self.model.predict(X_test_scaled))),
            "roc_auc": float(roc_auc_score(y_test, y_prob)),
            "roc_curve": roc_points
        }
        
        self.explainer = shap.LinearExplainer(self.model, X_train_scaled)
        joblib.dump({'model': self.model, 'scaler': self.scaler}, model_path)
        with open(metrics_path, 'w') as f: json.dump(self.metrics, f)

    def get_feature_importance(self):
        if self.model is None: return []
        importances = np.abs(self.model.coef_[0])
        importance_list = []
        for name, imp in zip(self.feature_names, importances):
            importance_list.append({"feature": name, "importance": float(imp)})
        importance_list.sort(key=lambda x: x['importance'], reverse=True)
        return importance_list

    def predict_and_explain(self, input_data: dict, enable_explainability: bool = True):
        try:
            income = float(input_data.get('income', input_data.get('annualIncome', 0.0)))
            loan_amount = float(input_data.get('loan_amount', input_data.get('loanAmount', 0.0)))
            credit_score = float(input_data.get('credit_history', input_data.get('creditScore', 0.0)))
            dti = float(input_data.get('debt_to_income_ratio', input_data.get('dti', 0.0)))
            age = float(input_data.get('age', 30))
            loans = float(input_data.get('existing_loans', 0.0))
            term = float(input_data.get('loan_term', 36))
            
            emp_type = input_data.get('employment_type', input_data.get('employmentType', 'Employed'))
            
            processed = {
                'age': age, 'income': income, 'credit_history': credit_score, 
                'existing_loans': loans, 'debt_to_income_ratio': dti, 
                'loan_amount': loan_amount, 'loan_term': term,
                'emp_employed': 1.0 if emp_type == 'Employed' else 0.0,
                'emp_self_employed': 1.0 if emp_type == 'Self-Employed' else 0.0,
                'emp_unemployed': 1.0 if emp_type == 'Unemployed' else 0.0,
                'loan_income_ratio': loan_amount / (income + 1),
                'risk_index': dti * (1000 - credit_score)
            }
                        
            df_raw = pd.DataFrame([processed])[self.feature_names]
            df_scaled = self.scaler.transform(df_raw)
            prob = self.model.predict_proba(df_scaled)[0][1]
            
            explanation = []
            nl_explanations = []
            if enable_explainability:
                shap_values = self.explainer.shap_values(df_scaled)[0]
                for f, v, s in zip(self.feature_names, df_raw.iloc[0], shap_values):
                    explanation.append({"feature": f, "value": float(v), "contribution": float(s)})
                
                explanation.sort(key=lambda x: abs(x['contribution']), reverse=True)
                top = explanation[:5]
                
                names = {
                    "credit_history": "credit score", "debt_to_income_ratio": "DTI", 
                    "income": "income", "loan_amount": "loan amount", 
                    "loan_income_ratio": "loan-to-income ratio", "risk_index": "Risk index", 
                    "emp_unemployed": "Unemployment status", "emp_self_employed": "Self-employment status",
                    "emp_employed": "Employment status"
                }
                for item in top:
                    if abs(item['contribution']) < 0.01: continue
                    verb = "increased" if item['contribution'] > 0 else "reduced"
                    fname = names.get(item['feature'], item['feature'])
                    impact = min(100, abs(item['contribution']) * 15) 
                    nl_explanations.append(f"{fname.capitalize()} {verb} risk by {impact:.1f}%.")

            risk_level = "Low" if prob < 0.3 else "Medium" if prob < 0.7 else "High"
            confidence = abs(prob - 0.5) * 2
            
            return {
                "status": "success", "risk_probability": float(prob), "risk_level": risk_level,
                "confidence": float(confidence),
                "approved": bool(prob < 0.5), "explanation": explanation[:5],
                "top_positive_contributors": [x for x in explanation if x['contribution'] > 0][:3],
                "top_negative_contributors": [x for x in explanation if x['contribution'] < 0][:3],
                "natural_language_explanation": nl_explanations[:4], "base_value": float(self.explainer.expected_value)
            }
        except Exception as e:
            return {"error": str(e), "status": "failed"}

model_instance = CreditRiskModel()
model_instance.train()
