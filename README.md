# FinQuantiX: Next-Gen Credit Risk AI Dashboard 🚀

**Live Demo:** [[https://finquantixx.vercel.app](https://finquantixx.vercel.app](https://fin-quanti-x.vercel.app/)

FinQuantiX is a state-of-the-art, full-stack Credit Risk Prediction platform designed for modern financial analysts. It combines advanced Machine Learning (XGBoost) with Model Explainability (SHAP) to provide transparent, data-driven loan approval decisions.



## ✨ Key Features

- **🛡️ Secure Authentication**: JWT-based session management with OTP verification for maximum data privacy.
- **🧠 AI-Powered Risk Scoring**: High-precision XGBoost model trained on complex financial datasets.
- **🔍 Model Explainability (SHAP)**: Understand exactly *why* a decision was made with interactive feature importance charts.
- **⚡ "What-If" Analysis**: Real-time simulation tool to see how changing variables (like income or debt) affects risk scores.
- **📊 Interactive Dashboard**: Cinematic data visualizations using Recharts and Tailwind CSS.
- **📱 Fully Responsive**: Seamless experience across mobile, tablet, and desktop.

## 🛠️ Technology Stack

### Backend (Python)
- **FastAPI**: High-performance asynchronous API framework.
- **Scikit-Learn & XGBoost**: Core machine learning pipeline.
- **SHAP**: Game-theory based model interpretation.
- **PyJWT**: Secure token-based authentication.

### Frontend (TypeScript)
- **Next.js 15+**: App Router architecture for speed and SEO.
- **Tailwind CSS**: Modern, premium styling with a "Neon Blue" aesthetic.
- **Lucide React**: Beautiful, consistent iconography.
- **Recharts**: Dynamic, responsive data visualizations.

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Shourya2703/FinQuantiX.git
cd FinQuantiX
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Deployment

- **Frontend**: Optimized for [Vercel](https://vercel.com). Set `NEXT_PUBLIC_API_URL` to your backend endpoint.
- **Backend**: Ready for [Render](https://render.com) or Railway. Includes `requirements.txt` and production-ready `uvicorn` config.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the future of Fintech.
