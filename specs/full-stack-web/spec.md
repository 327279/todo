# Feature Specification: Full-Stack Web App (Phase II)

**Feature Branch**: `002-full-stack-web`  
**Created**: 2026-01-05  
**Status**: Draft  
**Input**: Evolution of Todo Phase II: Next.js, FastAPI, SQLModel, Neon DB. Core + Intermediate features.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Web Management (Priority: P1)
As a user, I want to manage my tasks through a modern web interface so that I can access them easily.

**Acceptance Scenarios**:
1. **Given** the web app is running, **When** I add a task via the UI, **Then** it should be persisted in the database and appear in the list.
2. **Given** a task in the list, **When** I click "Complete", **Then** the UI should update immediately to show it as finished.

---

### User Story 2 - Organization (Priority: P2)
As a user with many tasks, I want to assign priorities and tags to my tasks so I can organize my work effectively.

**Acceptance Scenarios**:
1. **Given** I am creating a task, **When** I select "High" priority and add a "Work" tag, **Then** the task should display these attributes in the list.
2. **Given** a list of tasks, **When** I filter by the "Work" tag, **Then** only tasks with that tag should be displayed.

---

### User Story 3 - Search & Sort (Priority: P3)
As a user, I want to search for specific tasks and sort them by date or priority.

**Acceptance Scenarios**:
1. **Given** a list with "Buy milk" and "Call doctor", **When** I search for "milk", **Then** only "Buy milk" should appear.
2. **Given** tasks with different priorities, **When** I sort by priority, **Then** High priority tasks should appear at the top.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST provide a REST API built with FastAPI.
- **FR-002**: System MUST provide a responsive frontend built with Next.js.
- **FR-003**: System MUST persist data in a Neon Serverless Database using SQLModel.
- **FR-004**: System MUST support all Phase I features (Add, Delete, Update, View, Mark Complete).
- **FR-005**: System MUST support assigning a Priority (Low, Medium, High).
- **FR-006**: System MUST support assigning multiple Tags to a task.
- **FR-007**: System MUST support searching tasks by keyword in the description.
- **FR-008**: System MUST support filtering tasks by status, priority, or tag.
- **FR-009**: System MUST support sorting tasks by priority or creation date.

### Key Entities
- **Task**: 
    - `id`: UUID (Primary Key)
    - `description`: String
    - `is_completed`: Boolean
    - `priority`: Enum (Low, Medium, High)
    - `created_at`: Datetime
- **Tag**:
    - `id`: UUID
    - `name`: String
- **TaskTag**: (Many-to-Many relationship table)

## Success Criteria *(mandatory)*
- **SC-001**: API endpoints respond in < 200ms.
- **SC-002**: Frontend UI is responsive and visually appealing (Panaversity theme).
- **SC-003**: All data persists across application restarts.
