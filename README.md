# Skill Evaluator

A modern, AI-powered application designed to analyze resumes and professional profiles against target roles. The application leverages Google's Gemini AI to provide detailed scoring, feedback, and actionable insights.


## 🌟 Features

-   **AI-Powered Analysis**: Utilizes Google Gemini to parse and evaluate resume content against specific job roles.
-   **Multi-Input Support**: Accepts both PDF uploads and manual text entries for analysis.
-   **Detailed Scoring**: Provides a score out of 100 with a breakdown of strengths, weaknesses, and a "face-off" comparison against an ideal candidate.
-   **User Dashboard**: Track previous analyses, view improvements over time, and manage profile settings.
-   **Secure Authentication**: robust user registration and login using JWT tokens.
-   **Modern UI**: A sleek, dark-themed React interface built with Vite and Tailwind CSS.
-   **History Tracking**: Saves every analysis to track progress and improvements.

## 🛠 Tech Stack

### Backend
-   **Framework**: FastAPI (Python)
-   **Database**: SQLite (via SQLAlchemy)
-   **AI Model**: Google Generative AI (Gemini Pro)
-   **Authentication**: OAuth2 with Password (JWT)
-   **PDF Processing**: pypdf

### Frontend
-   **Framework**: React (Vite)
-   **Styling**: Tailwind CSS
-   **Charts**: Recharts / ApexCharts
-   **Icons**: Lucide React
-   **HTTP Client**: Axios

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   Python 3.9+
-   Node.js 16+
-   A Google Gemini API Key

### 📦 Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    
    # Windows
    venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables:**
    Create a `.env` file in the `backend` directory and add your secret keys:
    ```env
    GOOGLE_API_KEY=your_gemini_api_key_here
    SECRET_KEY=your_generated_secret_key
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    ```

5.  **Run the Server:**
    ```bash
    uvicorn main:app --reload
    ```
    The backend will be available at `http://localhost:8000`.

### 💻 Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173`.

## 📖 Usage

1.  **Register/Login**: Create an account to start tracking your evaluations.
2.  **Dashboard**: View your recent activity and start a new analysis.
3.  **Analyze**:
    *   **Upload PDF**: Upload your resume directly.
    *   **Manual Entry**: Paste your details or fill in the form manually.
    *   **Set Target**: Define the role you are aiming for (e.g., "Senior Frontend Engineer").
4.  **View Results**: Get instant feedback, including a score, missed keywords, and a strategic improvement plan.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.