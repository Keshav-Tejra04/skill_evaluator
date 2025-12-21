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

# --- Profile Routes ---
@app.get("/profile", response_model=schemas.User)
def get_profile(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.put("/profile", response_model=schemas.User)
def update_profile(
    profile_data: schemas.ProfileUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if profile_data.age is not None:
        user.age = profile_data.age
    if profile_data.current_status is not None:
        user.current_status = profile_data.current_status
    if profile_data.target_role is not None:
        user.target_role = profile_data.target_role
    
    db.commit()
    db.refresh(user)
    return user

# --- Analysis Route ---
@app.post("/analyze", response_model=schemas.AnalysisResponse)
async def analyze_profile(
    target_role: str = Form(...),
    manual_data: str = Form(None), # JSON string
    file: UploadFile = File(None),
    age: int = Form(None),
    current_status: str = Form(None),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Universal Analysis Endpoint.
    Accepts EITHER a file OR manual_data JSON string.
    """
    
    # 0. Update User Profile if provided
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if age:
        user.age = age
    if current_status:
        user.current_status = current_status
    if target_role:
        user.target_role = target_role # Update default role
    db.commit()

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

    # 2. History Context (Simplified, no date judgment)
    last_entry = db.query(models.ResumeEntry).filter(models.ResumeEntry.user_id == current_user.id).order_by(models.ResumeEntry.created_at.desc()).first()
    
    history_context = "First submission."
    if last_entry:
        prev_score = last_entry.score or 0
        history_context = f"Previous Score: {prev_score}/100. (User is retrying/improving)."

    # 3. Call AI
    # Use defaults if not provided in form (fallback to profile)
    final_age = age if age else (user.age or "Unknown")
    final_status = current_status if current_status else (user.current_status or "Unknown")

    try:
        ai_result = gemini_service.analyze_profile_with_ai(target_role, profile_text, str(final_age), final_status, history_context)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Analysis Failure: {str(e)}")
    
    # 4. Save to DB
    new_entry = models.ResumeEntry(
        user_id=current_user.id,
        raw_text=profile_text,
        analysis_json=json.dumps(ai_result),
        score=ai_result.get("score", 0),
        age_at_time=final_age if isinstance(final_age, int) else None,
        status_at_time=final_status
    )
    db.add(new_entry)
    db.commit()
    
    return ai_result

@app.post("/analyze/rerun", response_model=schemas.AnalysisResponse)
def rerun_analysis(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    # 1. Fetch Latest Resume Entry
    last_entry = db.query(models.ResumeEntry).filter(models.ResumeEntry.user_id == current_user.id).order_by(models.ResumeEntry.created_at.desc()).first()
    
    if not last_entry:
        raise HTTPException(status_code=400, detail="No previous analysis found. Please run a new analysis first.")

    # 2. Get User Profile Data (New Data)
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    final_age = user.age or "Unknown"
    final_status = user.current_status or "Unknown"
    target_role = user.target_role or "General"

    # 3. Call AI
    try:
        # Use previous raw text + new context
        ai_result = gemini_service.analyze_profile_with_ai(target_role, last_entry.raw_text, str(final_age), final_status, "Re-run of previous profile with updated context.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Re-Run Failure: {str(e)}")

    # 4. Save as NEW Entry (to keep history)
    new_entry = models.ResumeEntry(
        user_id=current_user.id,
        raw_text=last_entry.raw_text,
        analysis_json=json.dumps(ai_result),
        score=ai_result.get("score", 0),
        age_at_time=user.age,
        status_at_time=user.current_status
    )
    db.add(new_entry)
    db.commit()

    return ai_result

@app.get("/analysis/latest", response_model=schemas.AnalysisResponse)
def get_latest_analysis(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Retrieve the most recent analysis for the current user.
    """
    last_entry = db.query(models.ResumeEntry).filter(models.ResumeEntry.user_id == current_user.id).order_by(models.ResumeEntry.created_at.desc()).first()
    
    if not last_entry:
        raise HTTPException(status_code=404, detail="No analysis found")
        
    return json.loads(last_entry.analysis_json)

@app.get("/")
def read_root():
    return {"status": "Skill Evaluator Backend is Running"}
