from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    resumes = relationship("ResumeEntry", back_populates="owner")

class ResumeEntry(Base):
    __tablename__ = "resume_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Input Data
    raw_text = Column(Text, nullable=True) # Text from PDF
    form_data = Column(Text, nullable=True) # JSON string of manual form data
    
    # Output Data
    analysis_json = Column(Text) # The full JSON response from Gemini
    
    # Meta
    score = Column(Integer) # Extracted score for easy querying
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="resumes")
