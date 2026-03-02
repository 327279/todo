# Spec: Advanced Analytics & Collaboration (Phase IV)

## Overview
Phase IV evolves the Todo system from a personal productivity tool into a data-driven, collaborative workspace. It introduces task relationships, performance metrics, and multi-user foundations.

## User Stories

### US1: Task Dependencies
**As a power user, I want to link tasks together so that I can see what is blocking my progress.**
- Add `parent_id` and `blocked_by` fields to the `Todo` model.
- Visual indicators in the UI for "Blocked" tasks.

### US2: Productivity Analytics
**As a user, I want to see charts of my completion rates so that I can optimize my workflow.**
- Dashboard view with "Velocity" (tasks completed per day).
- "Burn-down" chart for the current week.
- Category breakdown based on tags.

### US3: Collaborative Workflows (Foundations)
**As a team member, I want to assign tasks to others (simulated) so that we can work together.**
- Add `assignee` field.
- Basic "Activity Feed" showing when tasks were created, completed, or refined by AI.

## Technical Requirements

### Backend
- **Database Migrations**: Add `parent_id`, `assignee`, and `status_history`.
- **Analytics Service**: New routes for `/analytics/summary` and `/analytics/trends`.

### Frontend
- **Dashboard Page**: New `/dashboard` route using `recharts` for visualization.
- **Improved TodoItem**: Accordion style to show sub-tasks and dependencies.

### AI Integration
- **AI Project Manager**: A new AI mode that analyzes your completion patterns and suggests which tasks to prioritize or delegate.

## Acceptance Criteria
- [ ] Users can create a "Sub-task" linked to a parent.
- [ ] A chart displays completion trends for the last 7 days.
- [ ] AI can suggest a "Weekly Focus" based on overdue and high-priority tasks.
