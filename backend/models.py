from datetime import datetime
from typing import List, Optional
from uuid import UUID, uuid4
from sqlmodel import Field, Relationship, SQLModel, Enum, Column
import enum

class Priority(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class TodoTagLink(SQLModel, table=True):
    todo_id: Optional[UUID] = Field(default=None, foreign_key="todo.id", primary_key=True)
    tag_id: Optional[UUID] = Field(default=None, foreign_key="tag.id", primary_key=True)

class Tag(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(index=True, unique=True)
    
    todos: List["Todo"] = Relationship(back_populates="tags", link_model=TodoTagLink)

class TodoBase(SQLModel):
    description: str
    is_completed: bool = False
    priority: Priority = Priority.MEDIUM

class Todo(TodoBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    tags: List[Tag] = Relationship(back_populates="todos", link_model=TodoTagLink)

class TodoCreate(TodoBase):
    tag_names: Optional[List[str]] = []

class TodoUpdate(SQLModel):
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    priority: Optional[Priority] = None
    tag_names: Optional[List[str]] = None
