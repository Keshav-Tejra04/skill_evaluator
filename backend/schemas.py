from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

# Auth Schemas
class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    age: Optional[int] = None
    current_status: Optional[str] = None
    target_role: Optional[str] = None

    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    age: Optional[int] = None
    current_status: Optional[str] = None
    target_role: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Analysis Schemas
class ManualEntry(BaseModel):
    target_role: str
    skills: Optional[str] = None
    experience: Optional[str] = None
    projects: Optional[str] = None
    custom_field: Optional[str] = None # For "Universal" support

class AnalysisRequest(BaseModel):
    manual_data: Optional[ManualEntry] = None
    # resume_file support handled via UploadFile in main.py, but this model can be used for pure JSON requests

class AnalysisResponse(BaseModel):
    # Mirroring the frontend structure exactly
    score: int
    score_status: str # "Log Kya Kahenge?"
    alert_title: str
    alert_message: str
    
    radar_data: List[Dict[str, Any]] # subject, A, B, fullMark
    
    comparison_metrics: List[Dict[str, Any]] # label, you, sharma, icon_name, status
    
    feedback_cards: List[Dict[str, Any]] # title, score, insight, type
    
    growth_verdict: Optional[str] = None # "You improved by 0% in 10 days"
