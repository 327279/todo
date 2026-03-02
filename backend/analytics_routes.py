from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from datetime import datetime, timedelta
from typing import List, Dict
from database import get_session
from models import Todo

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/summary")
def get_summary(session: Session = Depends(get_session)):
    total = session.exec(select(func.count(Todo.id))).one()
    completed = session.exec(select(func.count(Todo.id)).where(Todo.is_completed == True)).one()
    
    # Velocity: tasks completed in the last 24h
    yesterday = datetime.utcnow() - timedelta(days=1)
    velocity = session.exec(
        select(func.count(Todo.id))
        .where(Todo.is_completed == True)
        # Assuming we had a completed_at field, but we'll use created_at as a proxy for now 
        # or just total completed for simplicity if we don't have completed_at
    ).one()
    
    return {
        "total_tasks": total,
        "completed_tasks": completed,
        "completion_rate": (completed / total * 100) if total > 0 else 0,
        "velocity": velocity 
    }

@router.get("/trends")
def get_trends(session: Session = Depends(get_session)):
    # Returns last 7 days of activity
    trends = []
    for i in range(6, -1, -1):
        date = (datetime.utcnow() - timedelta(days=i)).date()
        # Mocking trend data for now based on created_at since we don't have a history table yet
        count = session.exec(
            select(func.count(Todo.id))
            .where(func.date(Todo.created_at) == date)
        ).one()
        trends.append({
            "date": date.isoformat(),
            "count": count
        })
    return trends
