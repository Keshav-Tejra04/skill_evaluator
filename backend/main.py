from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
import json
import io
import pypdf

import models, schemas, database, auth
from services import gemini_service

# Init DB
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow ALL origins for dev simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Auth Routes ---
@app.post("/register", response_model=schemas.Token)
def register(user_data: schemas.UserCreate, db: Session = Depends(database.get_db)):
    # Check existing
    db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create User
    hashed_pwd = auth.get_password_hash(user_data.password)
    new_user = models.User(email=user_data.email, hashed_password=hashed_pwd)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Login immediately (Return Token)
    access_token = auth.create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/login", response_model=schemas.Token)
def login(form_data: schemas.UserCreate, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.email).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# --- Analysis Route ---
@app.post("/analyze", response_model=schemas.AnalysisResponse)
async def analyze_profile(
    target_role: str = Form(...),
    manual_data: str = Form(None), # JSON string
    file: UploadFile = File(None),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Universal Analysis Endpoint.
    Accepts EITHER a file OR manual_data JSON string.
    """
    
    # 1. Parse Input
    profile_text = ""
    if manual_data:
        try:
            # If manual data is provided, use it formatted as text
            data_dict = json.loads(manual_data)
            profile_text = f"Manual Entry Form:\nTarget Role: {data_dict.get('target_role')}\nSkills: {data_dict.get('skills')}\nExp: {data_dict.get('experience')}\nProjects: {data_dict.get('projects')}\nCustom Universal Field: {data_dict.get('custom_field')}"
        except:
            raise HTTPException(status_code=400, detail="Invalid JSON in manual_data")
    elif file:
        content = await file.read()
        try:
            # Try to parse as PDF
            pdf_file = io.BytesIO(content)
            reader = pypdf.PdfReader(pdf_file)
            profile_text = ""
            for page in reader.pages:
                profile_text += page.extract_text() + "\n"
        except Exception as e:
            print(f"PDF Parse Error: {e}")
            # Fallback to UTF-8 decode (maybe it was a txt file?)
            try:
                profile_text = content.decode("utf-8")
            except:
                raise HTTPException(status_code=400, detail="Could not parse file. Please upload a valid PDF or Text file.")
    else:
        raise HTTPException(status_code=400, detail="Either file or manual_data is required")

    # 2. Check History for Growth
    last_entry = db.query(models.ResumeEntry).filter(models.ResumeEntry.user_id == current_user.id).order_by(models.ResumeEntry.created_at.desc()).first()
    
    history_context = "This is the user's FIRST submission. Roast them freshly."
    if last_entry:
        days_gap = (datetime.utcnow() - last_entry.created_at).days
        prev_score = last_entry.score or 0
        history_context = f"User submitted previously {days_gap} days ago. Previous Score: {prev_score}/100. Compare this new submission to see if they improved or wasted time."

    # 3. Call AI
    try:
        ai_result = gemini_service.analyze_profile_with_ai(target_role, profile_text, history_context)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Analysis Failure: {str(e)}")
    
    # 4. Save to DB
    new_entry = models.ResumeEntry(
        user_id=current_user.id,
        raw_text=profile_text,
        analysis_json=json.dumps(ai_result),
        score=ai_result.get("score", 0)
    )
    db.add(new_entry)
    db.commit()
    
    return ai_result

@app.get("/")
def read_root():
    return {"status": "Skill Evaluator Backend is Running"}
