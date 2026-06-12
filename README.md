# TaskFlow // Personal Task Manager

TaskFlow is a modern, full-stack Personal Task Manager (a glorified to-do list) built as a complete developer exercise. It provides a highly visual, responsive dashboard where users can create, view, edit, toggle, reorder (via drag-and-drop), and delete tasks. The interface features a dark/light mode toggle, dynamic stat cards, overdue task indicators (active tasks with due dates in the past), search filtering by title, and persistence across server restarts using a backend JSON file.

🌐 Live Demo
Frontend: https://task-manager-azure-gamma-63.vercel.app
Backend API:https://task-manager-5c9w.onrender.com

## Tech Stack

*   **Frontend**: React (Functional components with Hooks)
    *   *Why*: Allows modular, scalable UI components and react state matching backend responses seamlessly.
*   **Styling**: Tailwind CSS (version 3)
    *   *Why*: Promotes fast, inline responsive designs with customizable themes, glassmorphism filters, and smooth micro-animations.
*   **Backend**: Node.js with Express
    *   *Why*: Lightweight and highly modular server environment ideal for building JSON REST APIs.
*   **Logging**: Morgan
    *   *Why*: Formats server console logs nicely to inspect requests during local development.
*   **Persistence**: JSON File Storage (`tasks.json`)
    *   *Why*: Keeps persistence extremely simple and portable without requiring database engine configuration on the reviewer's machine.

---

## Folder Structure

```text
/
├── backend/
│   ├── data/
│   │   └── tasks.json      # Auto-created database file
│   ├── package.json        # Backend configuration & scripts
│   └── server.js           # Express API server entrypoint
├── frontend/
│   ├── dist/               # Production build folder (compiled via Vite)
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── FilterBar.jsx # Title search and status filter buttons
│   │   │   ├── TaskForm.jsx  # Task creation and editing input fields
│   │   │   ├── TaskItem.jsx  # Single task card with actions & drag handlers
│   │   │   └── TaskStats.jsx # Dynamic counts of active, completed, overdue, total
│   │   ├── App.jsx         # App state manager, API calls, and layout
│   │   ├── index.css       # Tailwind directives & CSS variables
│   │   └── main.jsx        # React DOM entrypoint
│   ├── index.html          # Shell template with title and emoji favicon
│   ├── postcss.config.js   # PostCSS configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── package.json        # Frontend configuration & scripts
└── README.md               # Project documentation (this file)
```

---

## How to Run Locally

Follow these exact commands. This guide assumes you have **Node.js** (v20+ or v22+) installed on your machine.

### 1. Run the Backend Server
Open a terminal in the project root directory and run:
```bash
cd backend
npm install
npm start
```
The server will boot on `http://localhost:5000`.

### 2. Run the Frontend Development Server
Open a second terminal in the project root directory and run:
```bash
cd frontend
npm install
npm run dev
```
The client will start and provide a link to view the app, usually `http://localhost:5173`. Open this URL in your web browser.

---

## API Documentation

All requests and responses use the `application/json` content type.

### 1. Get All Tasks
*   **Method**: `GET`
*   **Path**: `/api/tasks`
*   **Request Body**: *None*
*   **Response Shape**: `Array<Task>`
```json
[
  {
    "id": "a8bd6de3-a6b5-47bb-8b57-95ed518592f1",
    "title": "Verify Project Setup",
    "description": "Create backend, write tests, and verify endpoints.",
    "dueDate": "2026-06-15",
    "completed": true,
    "createdAt": "2026-06-10T05:32:29.148Z"
  }
]
```

### 2. Create New Task
*   **Method**: `POST`
*   **Path**: `/api/tasks`
*   **Request Body**:
```json
{
  "title": "Build Frontend Dashboard",     // Required (String)
  "description": "Create dashboard layout", // Optional (String)
  "dueDate": "2026-06-20"                   // Optional (String YYYY-MM-DD or null)
}
```
*   **Response Shape**: `Task` (Returns the created object including default fields)
```json
{
  "id": "f89d3de4-a2b1-49bb-9c23-88ed528592f2",
  "title": "Build Frontend Dashboard",
  "description": "Create dashboard layout",
  "dueDate": "2026-06-20",
  "completed": false,
  "createdAt": "2026-06-10T05:38:00.000Z"
}
```

### 3. Update/Edit Task
*   **Method**: `PUT`
*   **Path**: `/api/tasks/:id`
*   **Request Body**: (Provide any fields you want to update)
```json
{
  "title": "Build Frontend Dashboard (Updated)",
  "completed": true
}
```
*   **Response Shape**: `Task` (Returns the updated task object)

### 4. Delete Task
*   **Method**: `DELETE`
*   **Path**: `/api/tasks/:id`
*   **Response Shape**:
```json
{
  "message": "Task deleted successfully",
  "id": "f89d3de4-a2b1-49bb-9c23-88ed528592f2"
}
```

### 5. Reorder Tasks
*   **Method**: `PUT`
*   **Path**: `/api/tasks/reorder`
*   **Request Body**:
```json
{
  "taskIds": ["id-1", "id-2", "id-3"] // Ordered array of task IDs (Array<String>)
}
```
*   **Response Shape**: `Array<Task>` (Returns the newly ordered list of tasks)

---

## Next Steps & Future Enhancements

Due to the scoped nature of this project, certain capabilities were deferred. If expanded, we would build:
1.  **User Authentication & Accounts**: Currently assumes a single user with no sign-in. We would add JWT or session-based authentication to support multiple user spaces.
2.  **Category & Tags**: Allowing tasks to be categorized (e.g., Work, Personal, Shopping) with color-coded labels.
3.  **Task Reminders & Notifications**: Browser push notifications or email alerts when tasks approach their due date.
4.  **Subtask Checklists**: Support for dividing complex tasks into smaller nested subtasks.
5.  **SQL Database storage**: Migrating from JSON file storage to SQLite or PostgreSQL to support queries, indexes, and high-concurrency connections.
