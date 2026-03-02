from fastapi import APIRouter, Depends, Query, Body
from sqlmodel import Session, select
from typing import List, Optional
from database import get_session
from models import Todo, TodoCreate
from ai_service import magic_parse, chat_with_tasks, suggest_refinement

router = APIRouter(prefix="/ai", tags=["ai"])

@router.api_route("/magic-parse", methods=["GET", "POST"], response_model=TodoCreate)
async def api_magic_parse(text: Optional[str] = Query(None), payload: Optional[dict] = Body(None)):
    # Support text from query param or body
    parse_text = text or (payload.get("text") if payload else None)
    if not parse_text:
        return {"error": "No text provided"}
    return await magic_parse(parse_text)

@router.post("/chat")
async def api_chat(query: str = Query(...), session: Session = Depends(get_session)):
    # Fetch all tasks to provide as context
    statement = select(Todo)
    todos = session.exec(statement).all()
    
    # Convert to simple dicts for the AI
    tasks_data = [
        {
            "description": t.description,
            "is_completed": t.is_completed,
            "priority": t.priority,
            "tags": [tag.name for tag in t.tags]
        }
        for t in todos
    ]
    
    response = await chat_with_tasks(query, tasks_data)
    return {"response": response}

@router.post("/suggest/{todo_id}")
async def api_suggest(todo_id: str, session: Session = Depends(get_session)):
    todo = session.get(Todo, todo_id)
    if not todo:
        return {"error": "Todo not found"}
    
    task_data = {
        "description": todo.description,
        "priority": todo.priority,
        "tags": [tag.name for tag in todo.tags]
    }
    
    suggestion = await suggest_refinement(task_data)
    return suggestion
