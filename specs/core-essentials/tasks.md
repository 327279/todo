# Tasks: Core Essentials (Phase I)

**Input**: Design documents from `/specs/core-essentials/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup

- [x] T001 Create `src/` directory at repository root
- [x] T002 Create `src/app.py` wrapper

## Phase 2: Foundational

- [x] T003 Define `Task` data structure and Global `tasks` list in `src/app.py`
- [x] T004 Implement `clear_screen()` and `display_header()` utilities in `src/app.py`

## Phase 3: User Story 1 - Task Management Basics (Priority: P1) 🎯 MVP

- [x] T005 [P] [US1] Implement `view_tasks()` function in `src/app.py`
- [x] T006 [P] [US1] Implement `add_task()` function in `src/app.py`
- [x] T007 [US1] Implement main menu loop to link View and Add

## Phase 4: User Story 2 - Task Lifecycle (Priority: P2)

- [x] T008 [P] [US2] Implement `complete_task()` function in `src/app.py`
- [x] T009 [P] [US2] Implement `update_task()` function in `src/app.py`
- [x] T010 [P] [US2] Implement `delete_task()` function in `src/app.py`
- [x] T011 [US2] Link Complete, Update, and Delete to the main menu

## Phase 5: Polish

- [x] T012 Add simple error handling for invalid menu choices and non-existent IDs
- [x] T013 Final verification of all user stories via manual walkthrough
