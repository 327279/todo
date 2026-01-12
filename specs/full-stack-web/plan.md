# Implementation Plan: Full-Stack Web App (Phase II)

**Branch**: `002-full-stack-web` | **Date**: 2026-01-05 | **Spec**: [specs/full-stack-web/spec.md](file:///c:/Users/ARComputers/OneDrive/Desktop/todo/specs/full-stack-web/spec.md)
**Input**: Full-Stack Web App Specification.

## Summary
Migration of the Todo application from a simple console script to a modern full-stack application. We will use FastAPI for a robust backend and Next.js for a premium frontend experience. Data will be persisted in a Neon Serverless PostgreSQL database using SQLModel as our ORM.

## Technical Context
**Language/Version**: Python 3.13 (Backend), Node.js (Frontend)  
**Primary Dependencies**: FastAPI, SQLModel, Uvicorn (Backend); Next.js, Tailwind CSS, Lucide React (Frontend)  
**Storage**: Neon Serverless Database (PostgreSQL)  
**Testing**: Manual + API docs verification  
**Target Platform**: Web Browser  
**Project Type**: Multi-project (Backend/Frontend)  
**Performance Goals**: API response < 200ms, frontend load < 1s.

## Project Structure

```text
backend/
├── main.py          # FastAPI entry point
├── models.py        # SQLModel entities
├── database.py      # Connection logic
└── routes.py        # API endpoints

frontend/
├── app/             # Next.js App Router
├── components/      # UI components
└── lib/             # API client and logic
```

## Constitution Check
| Principle | Pass? | Notes |
|-----------|-------|-------|
| SDD-Mandatory | ✅ | Spec and Plan preceding implementation. |
| Reusable Intelligence | ✅ | Continuing PHR records. |
| AI-Native Architecture | ✅ | REST API is standard for AI integration. |
| Tech Stack Context | ✅ | Using Panaversity-aligned stack (FastAPI, Next.js). |

## Proposed Implementation Detail

### Backend (FastAPI + SQLModel)
- Define `Todo` and `Tag` models with many-to-many relationship using a link table `TodoTag`.
- Initialize database engine pointing to Neon DB URL (via `.env`).
- Implement CRUD endpoints:
    - `POST /todos`: Create task
    - `GET /todos`: List tasks (with search/filter query params)
    - `PUT /todos/{id}`: Update task or toggle completion
    - `DELETE /todos/{id}`: Remove task

### Frontend (Next.js)
- Use a dark, premium aesthetic consistent with Panaversity/Vibe coding.
- Main dashboard showing the todo list with a sidebar or top bar for filters.
- Modal or inline form for adding/editing tasks.
- Real-time updates via optimistic UI patterns or simple state refreshes.
