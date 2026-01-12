from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from typing import List, Optional
from uuid import UUID
from .database import get_session
from .models import Todo, Tag, TodoCreate, TodoUpdate, TodoTagLink

router = APIRouter(prefix="/todos", tags=["todos"])

def get_or_create_tags(session: Session, tag_names: List[str]) -> List[Tag]:
    tags = []
    for name in tag_names:
        statement = select(Tag).where(Tag.name == name)
        tag = session.exec(statement).first()
        if not tag:
            tag = Tag(name=name)
            session.add(tag)
        tags.append(tag)
    return tags

@router.post("/", response_model=Todo)
def create_todo(todo_in: TodoCreate, session: Session = Depends(get_session)):
    db_todo = Todo.model_validate(todo_in)
    if todo_in.tag_names:
        db_todo.tags = get_or_create_tags(session, todo_in.tag_names)
    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)
    return db_todo

@router.get("/", response_model=List[Todo])
def read_todos(
    offset: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    priority: Optional[str] = None,
    is_completed: Optional[bool] = None,
    session: Session = Depends(get_session)
):
    statement = select(Todo)
    if search:
        statement = statement.where(Todo.description.contains(search))
    if priority:
        statement = statement.where(Todo.priority == priority)
    if is_completed is not None:
        statement = statement.where(Todo.is_completed == is_completed)
    
    todos = session.exec(statement.offset(offset).limit(limit)).all()
    return todos

@router.get("/{todo_id}", response_model=Todo)
def read_todo(todo_id: UUID, session: Session = Depends(get_session)):
    todo = session.get(Todo, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@router.patch("/{todo_id}", response_model=Todo)
def update_todo(todo_id: UUID, todo_in: TodoUpdate, session: Session = Depends(get_session)):
    db_todo = session.get(Todo, todo_id)
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todo_data = todo_in.model_dump(exclude_unset=True)
    for key, value in todo_data.items():
        if key != "tag_names":
            setattr(db_todo, key, value)
    
    if todo_in.tag_names is not None:
        db_todo.tags = get_or_create_tags(session, todo_in.tag_names)
        
    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)
    return db_todo

@router.delete("/{todo_id}")
def delete_todo(todo_id: UUID, session: Session = Depends(get_session)):
    todo = session.get(Todo, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    session.delete(todo)
    session.commit()
    return {"ok": True}
