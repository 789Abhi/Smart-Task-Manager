# Smart Task Manager

A small, production-minded task management feature built with **React + Vite + Tailwind CSS v3**.

---

## Setup & Run

**Prerequisites:** Node.js ≥ 18

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Start the dev server
npm run dev
# → Opens at http://localhost:5173

# 3. Build for production
npm run build
```

---

## Running Tests

```bash
# Run all tests once
npm test

# Watch mode (re-runs on file change)
npm run test:watch

# With coverage report
npm run test:coverage
```

**Result:** 3 test files · 46 tests · all passing ✅

---

## Assumptions Made

- **Feature scope:** A task manager with 3 workflow stages (Todo → In Progress → Done) was chosen as the feature. This scope is completable in 2–3 hours, is inherently testable, and demonstrates all evaluation criteria.
- **No backend:** Data is persisted to **localStorage** per-browser. This is documented as a known limitation (see below). In a production system this would be replaced with an API.
- **JSX over TSX:** The task allows React/TypeScript but `.jsx` (JavaScript) was chosen for development velocity and clean syntax. The same patterns (custom hooks, pure utils, component props) would apply identically with TypeScript.
- **Fixed statuses:** Statuses are `todo`, `in-progress`, `done`. Custom user-defined statuses were considered out of scope.
- **Overdue definition:** A task is overdue if it has a due date in the past AND its status is not `done`.
- **Bidirectional card movement:** Tasks can be moved to any status (not just forwards) via a dedicated "Move to…" menu.

---

## Key Technical Decisions

| Decision | Rationale |
|---|---|
| **Custom `useTasks` hook** | Centralises all task state and mutations. Keeps components thin and logic independently testable. |
| **Pure utility functions in `taskHelpers.js`** | Zero side effects → fast, reliable unit tests with no mocking required. |
| **LocalStorage abstraction (`storage.js`)** | Isolated module makes it trivial to swap for an API/fetch call without touching hook logic. |
| **Performance optimizations (`React.memo`, `useMemo`, `useCallback`)** | `displayTasks` and metrics are memoised with `useMemo`. `TaskCard`, `KanbanColumn`, `FilterBar`, and `EmptyState` are wrapped in `React.memo`, with stable handler references passed down via `useCallback` to prevent unnecessary re-renders. |
| **Color coding & UX accessibility** | Done status is represented in emerald green, while Low priority is styled in sky blue (High: rose, Medium: amber) to eliminate color confusion between status and priority. |
| **Mobile-responsive design** | On mobile screens, the board provides interactive tab navigation for columns, touch-friendly controls, and an adaptable modal. |
| **Tailwind v3 styling & Inter typography** | Clean utility-first design with crisp typography, distinctive borders, and internal column scrolling (`maxHeight: 65vh`) for consistent card containers. |

---

## Project Structure

```
src/
├── components/
│   ├── TaskBoard.jsx      # 3-column kanban layout
│   ├── TaskCard.jsx       # Individual task with actions
│   ├── TaskForm.jsx       # Add/edit modal form
│   ├── FilterBar.jsx      # Status + priority filters
│   ├── ConfirmDialog.jsx  # Delete confirmation modal
│   └── EmptyState.jsx     # Empty column placeholder
├── hooks/
│   └── useTasks.js        # All task state & mutations
├── utils/
│   ├── taskHelpers.js     # Pure functions (filter, sort, validate, …)
│   └── storage.js         # LocalStorage read/write
├── constants/
│   └── taskConstants.js   # STATUSES, PRIORITIES enums
└── __tests__/
    ├── taskHelpers.test.js
    ├── useTasks.test.js
    └── TaskCard.test.jsx
```

---

## Limitations & Improvements with More Time

- **Backend persistence:** Replace localStorage with a REST or GraphQL API so tasks sync across devices and users.
- **User authentication:** Multi-user support with task ownership.
- **TypeScript:** Adding TS would provide compile-time safety for task shapes and prop types.
- **Drag-and-drop:** Use `@dnd-kit/core` to allow dragging cards between columns.
- **Optimistic updates:** If connected to an API, show immediate UI feedback while the request is in-flight.
- **Due date reminders:** Browser Notification API or email reminders for upcoming due dates.
- **Undo delete:** A toast with an "Undo" action instead of a hard delete confirmation.
- **Accessibility audit:** Full keyboard navigation and screen reader testing with axe-core.
