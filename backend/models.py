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
    
    # Profile Fields
    age = Column(Integer, nullable=True) 
    current_status = Column(String, nullable=True) # e.g. "Student", "Professional", "Unemployed"
    target_role = Column(String, nullable=True) # Default target role

    entries = relationship("ResumeEntry", back_populates="user")

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
    
    # Snapshot of user state at time of analysis
    age_at_time = Column(Integer, nullable=True)
    status_at_time = Column(String, nullable=True)

    user = relationship("User", back_populates="entries")
