import os
import google.generativeai as genai
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

try:
    models = genai.list_models()
    for m in models:
        print(m.name)
except Exception as e:
    print(f"Error: {e}")
