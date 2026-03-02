# Implementation Plan: AI Integration (Phase III)

## Architecture Overview
We will introduce an `ai_service.py` in the backend and a dedicated `AIProvider` in the frontend to handle all agentic workflows.

### Backend Bridge
- **Provider**: Use `google-generativeai` (Gemini) or `openai` SDK.
- **Service Layer**: `backend/ai_service.py` will handle prompt engineering, schema validation, and context management.
- **Endpoints**:
  - `POST /ai/magic-parse`: String -> Structured JSON.
  - `POST /ai/chat`: User Message + Tasks context -> Response.

### Frontend UI/UX
- **Magic Input**: A toggle or special prefix (`/`) in the `TodoForm` to trigger AI parsing.
- **Chat Interface**: A floating drawer or sidebar using `framer-motion` for premium feel.
- **Visual Cues**: Shimmer effects or AI "Sparkles" when processing.

## Tech Stack
- **Backend**: `google-generativeai` (for Gemini 1.5 Flash - fast and cost-effective).
- **Frontend**: `lucide-react` for icons, `framer-motion` for animations.

## Security & Config
- `GEMINI_API_KEY` in `.env`.
- Rate limiting on AI endpoints to prevent abuse.

## Migration
- No database migrations required (existing models support tags and priority).
- Optional: Add `ai_summary` field to `Task` if needed later.
