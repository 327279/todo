import os
import json
from typing import List, Optional
import google.generativeai as genai
from models import Priority, TodoCreate
from dotenv import load_dotenv

# Load .env from the same directory as this file
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Using gemini-flash-latest for stability
MODEL_NAME = 'gemini-flash-latest'

def _clean_json_response(text: str) -> str:
    """Extracts JSON from common AI markdown wrappers."""
    text = text.strip()
    if "```json" in text:
        text = text.split("```json")[-1].split("```")[0]
    elif "```" in text:
        text = text.split("```")[-1].split("```")[0]
    return text.strip()

async def magic_parse(text: str) -> TodoCreate:
    prompt = f"""
    Extract task details from the following natural language input:
    "{text}"

    Return ONLY a JSON object with the following fields:
    - description: The core task description.
    - priority: One of "Low", "Medium", "High" (default to "Medium" if not clear).
    - tag_names: A list of relevant tags extracted or inferred.
    - due_date: ISO date string if mentioned, else null.

    Example: "Buy milk tomorrow morning high priority"
    Result: {{"description": "Buy milk tomorrow morning", "priority": "High", "tag_names": ["shopping", "groceries"], "due_date": "2024-03-21T09:00:00"}}
    """
    
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)
        content = _clean_json_response(response.text)
        data = json.loads(content)
        # Ensure due_date is handled
        if "due_date" not in data:
            data["due_date"] = None
        return TodoCreate(**data)
    except Exception as e:
        print(f"Error in magic_parse: {e}")
        # Fallback to basic creation
        return TodoCreate(description=text, priority=Priority.MEDIUM, tag_names=[], due_date=None)

async def chat_with_tasks(query: str, tasks: List[dict]) -> str:
    tasks_context = json.dumps(tasks, indent=2)
    prompt = f"""
    You are an AI Todo Assistant. Below is the user's current task list:
    {tasks_context}

    User Question: "{query}"

    Provide a concise, helpful answer based ONLY on the provided tasks. 
    If they ask to do something (like add a task), explain that you can answer questions about existing tasks, but they should use the "Magic Add" feature to create new ones.
    """
    
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error in chat_with_tasks: {e}")
        return "I'm sorry, I'm having trouble thinking right now. Please try again later."

async def suggest_refinement(task_data: dict) -> dict:
    """Suggests an improved description and tags for a task."""
    prompt = f"""
    Refine the following task to make it more professional and actionable.
    Task: "{task_data['description']}"
    Current Priority: {task_data['priority']}
    Current Tags: {task_data.get('tags', [])}

    Return ONLY a JSON object with:
    - description: The refined description.
    - priority: Recommended priority (Low, Medium, High).
    - tag_names: A list of relevant tags.

    Example: "buy eggs"
    Result: {{"description": "Purchase organic eggs for the week", "priority": "Medium", "tag_names": ["shopping", "groceries"]}}
    """
    
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)
        content = _clean_json_response(response.text)
        return json.loads(content)
    except Exception as e:
        print(f"Error in suggest_refinement: {e}")
        return {
            "description": task_data["description"],
            "priority": task_data["priority"],
            "tag_names": task_data.get("tags", [])
        }
