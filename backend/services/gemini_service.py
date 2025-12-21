import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
from prompts import SYSTEM_PROMPT

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-flash-latest')

def analyze_profile_with_ai(target_role: str, profile_text: str, history_context: str = "First time submission."):
    """
    Sends a single-shot prompt to Gemini to analyze the profile and return structured JSON.
    """
    # Construct the filled prompt using simple replacement to avoid formatting errors with JSON braces
    prompt = SYSTEM_PROMPT.replace("{target_role}", target_role).replace("{profile_data}", profile_text).replace("{history_context}", history_context)

    # Generate content
    response = model.generate_content(prompt)
    text_response = response.text

    # Clean up code blocks if Gemini wraps in ```json ... ```
    clean_json = text_response.replace("```json", "").replace("```", "").strip()
    
    # Parse to ensure validity
    try:
        data = json.loads(clean_json)
        return data
    except json.JSONDecodeError as e:
        raise ValueError(f"AI returned invalid JSON: {e}")
