import os
import google.generativeai as genai
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model_name = 'gemini-flash-latest'
print(f"Testing model: {model_name}")

try:
    model = genai.GenerativeModel(model_name)
    response = model.generate_content("Say hello!")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
