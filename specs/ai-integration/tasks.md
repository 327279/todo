# Tasks: AI Integration (Phase III)

## Phase 1: Infrastructure
- [x] T001 [P] Install `google-generativeai` in backend venv
- [x] T002 Configure `.env` with `GEMINI_API_KEY`
- [x] T003 Create `backend/ai_service.py` with base configuration

## Phase 2: Backend AI Features
- [x] T004 Implement `magic_parse` logic (Extraction prompt)
- [x] T005 Implement `chat_with_tasks` logic (RAG-lite on local database)
- [x] T006 Expose AI endpoints in `backend/main.py`

## Phase 3: Frontend AI Experience
- [x] T007 Implement "Magic Input" mode in `TodoForm.tsx`
- [x] T008 Add `AIChatSidebar.tsx` component
- [x] T009 Link frontend to AI endpoints in `frontend/lib/api.ts`
- [x] T010 Add "AI Suggest" button to automatically refine existing tasks

## Phase 4: Verification
- [x] T011 Verify natural language parsing for 5 edge cases
- [x] T012 Verify chat context accuracy
- [x] T013 Final E2E walkthrough of AI features
