import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import shap
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score, roc_curve
class CreditRiskModel:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.explainer = None
        self.metrics = {}
        self.feature_names = [
            'age', 'income', 'credit_history', 'existing_loans', 
            'debt_to_income_ratio', 'loan_amount', 'loan_term',
            'emp_employed', 'emp_self_employed', 'emp_unemployed'
        ]

    def _generate_dummy_data(self, n_samples=1000):
        np.random.seed(42)
        age = np.random.randint(18, 70, n_samples)
        income = np.random.randint(20000, 150000, n_samples)
        credit_history = np.random.randint(300, 850, n_samples)
        existing_loans = np.random.randint(0, 5, n_samples)
        debt_to_income_ratio = np.random.uniform(0.1, 0.8, n_samples)
        loan_amount = np.random.randint(1000, 50000, n_samples)
        loan_term = np.random.choice([12, 24, 36, 48, 60], n_samples)
        
        # One-hot encoding simulation for employment_type
        emp = np.random.choice(['Employed', 'Self-Employed', 'Unemployed'], n_samples, p=[0.6, 0.2, 0.2])
        emp_employed = (emp == 'Employed').astype(int)
        emp_self_employed = (emp == 'Self-Employed').astype(int)
        emp_unemployed = (emp == 'Unemployed').astype(int)

        X = pd.DataFrame({
            'age': age,
            'income': income,
            'credit_history': credit_history,
            'existing_loans': existing_loans,
            'debt_to_income_ratio': debt_to_income_ratio,
            'loan_amount': loan_amount,
            'loan_term': loan_term,
            'emp_employed': emp_employed,
            'emp_self_employed': emp_self_employed,
            'emp_unemployed': emp_unemployed
        })

        # Generate a target variable (1 = Risk/Deny, 0 = No Risk/Approve)
        # Higher risk if low credit history, high debt-to-income, high loan amount relative to income
        risk_score = (
            -0.02 * credit_history + 
            5.0 * debt_to_income_ratio + 
            0.0001 * loan_amount - 
            0.00005 * income + 
            1.5 * emp_unemployed +
            np.random.normal(0, 2, n_samples)
        )
        # Threshold to get approx 20% default rate
        y = (risk_score > np.percentile(risk_score, 80)).astype(int)
        
        return X, y

    def train(self):
        X, y = self._generate_dummy_data()
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        self.model.fit(X_train, y_train)
        
        # Calculate metrics
        y_pred = self.model.predict(X_test)
        y_prob = self.model.predict_proba(X_test)[:, 1]
        
        fpr, tpr, thresholds = roc_curve(y_test, y_prob)
        # downsample for UI
        idx = np.round(np.linspace(0, len(fpr) - 1, 50)).astype(int)
        
        self.metrics = {
            "accuracy": float(accuracy_score(y_test, y_pred)),
            "roc_auc": float(roc_auc_score(y_test, y_prob)),
            "roc_curve": [{"fpr": float(fpr[i]), "tpr": float(tpr[i])} for i in idx]
        }
        
        # Initialize SHAP explainer
        self.explainer = shap.TreeExplainer(self.model)

    def get_feature_importance(self):
        importances = self.model.feature_importances_
        fi = []
        for name, imp in zip(self.feature_names, importances):
            fi.append({"feature": name, "importance": float(imp)})
        fi.sort(key=lambda x: x['importance'], reverse=True)
        return fi
        
    def predict_and_explain(self, input_data: dict):
        # Prepare input df
        df = pd.DataFrame([input_data])
        
        # Ensure order matches training
        df = df[self.feature_names]
        
        # Predict probability of risk (Class 1)
        prob = self.model.predict_proba(df)[0][1]
        
        # Generate SHAP values
        shap_values = self.explainer.shap_values(df)
        
        # shap_values might be a list (for classification) or an array
        if isinstance(shap_values, list):
            sv = shap_values[1][0]
        else:
            # If shape is (n_samples, n_features, n_classes)
            if len(shap_values.shape) == 3:
                sv = shap_values[0, :, 1]
            else:
                sv = shap_values[0]
            
        # Format explanation
        explanation = []
        for feature, val, sh in zip(self.feature_names, df.iloc[0], sv):
            explanation.append({
                "feature": feature,
                "value": float(val),
                "contribution": float(sh)
            })
            
        # Sort by absolute contribution for the raw list
        explanation.sort(key=lambda x: abs(x['contribution']), reverse=True)
        
        # Identify top positive and negative contributors
        positive_contributors = sorted([x for x in explanation if x['contribution'] > 0], key=lambda x: x['contribution'], reverse=True)
        negative_contributors = sorted([x for x in explanation if x['contribution'] < 0], key=lambda x: x['contribution'])
        
        # Natural language generation
        nl_explanations = []
        
        feature_friendly_names = {
            "credit_history": "credit score",
            "debt_to_income_ratio": "debt-to-income ratio",
            "income": "annual income",
            "loan_amount": "loan amount",
            "age": "age",
            "existing_loans": "number of existing loans",
            "loan_term": "loan term",
            "emp_employed": "employment status",
            "emp_unemployed": "unemployment status",
            "emp_self_employed": "self-employment status"
        }
        
        for item in positive_contributors[:2]:
            fname = feature_friendly_names.get(item['feature'], item['feature'])
            pct = abs(item['contribution']) * 100
            nl_explanations.append(f"High risk factor: {fname} increased risk probability by {pct:.1f}%.")
            
        for item in negative_contributors[:2]:
            fname = feature_friendly_names.get(item['feature'], item['feature'])
            pct = abs(item['contribution']) * 100
            nl_explanations.append(f"Low risk factor: {fname} reduced risk probability by {pct:.1f}%.")
        
        base_val = self.explainer.expected_value
        if isinstance(base_val, (list, np.ndarray)):
            base_val = base_val[1]
            
        risk_level = "Low"
        if prob > 0.4:
            risk_level = "Medium"
        if prob > 0.7:
            risk_level = "High"
            
        confidence = abs(prob - 0.5) * 2  # 0 to 1 scale
            
        return {
            "risk_probability": float(prob),
            "risk_level": risk_level,
            "confidence": float(confidence),
            "approved": bool(prob < 0.5),
            "explanation": explanation,
            "top_positive_contributors": positive_contributors[:3],
            "top_negative_contributors": negative_contributors[:3],
            "natural_language_explanation": nl_explanations,
            "base_value": float(base_val)
        }

model_instance = CreditRiskModel()
model_instance.train()
