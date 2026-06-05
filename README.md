````markdown
# TaskFlow - Smart To-Do Management System

A modern and responsive To-Do Management System built with React, TypeScript, Vite, and Supabase. The application allows users to create, manage, update, and track tasks efficiently while receiving automated email reminders for upcoming deadlines.

---

## 🚀 Features

### ✅ Task Management (CRUD Operations)
- Create new tasks
- View all tasks
- Update existing tasks
- Delete tasks
- Mark tasks as completed

### 📧 Email Reminder System
- Schedule reminders for tasks
- Automatic email notifications before deadlines
- Prevents missing important tasks

### 🎯 Priority Management
- High Priority
- Medium Priority
- Low Priority

### 📊 Dashboard Analytics
- Total Tasks
- Pending Tasks
- Completed Tasks
- Today's Tasks

### 🔍 Search & Filter
- Search tasks by title
- Search tasks by description
- Filter by status
- Filter by priority

### 🌙 Dark & Light Mode
- Modern UI
- Theme switching support
- Fully responsive design

### 📈 Progress Tracking
- Completion percentage
- Visual progress indicators

---

# 🛠️ Tech Stack

## Frontend
- React.js
- TypeScript
- Vite
- Tailwind CSS

## Backend & Database
- Supabase

## Email Service
- EmailJS

## State Management
- React Hooks

---

# 📂 Project Structure

```text
src
│
├── components
│   ├── Navbar.tsx
│   ├── TaskCard.tsx
│   ├── TaskForm.tsx
│   └── ReminderModal.tsx
│
├── hooks
│   └── useTasks.ts
│
├── integrations
│   └── supabase
│
├── lib
│   ├── taskService.ts
│   ├── emailService.ts
│   └── supabase.ts
│
├── routes
│   ├── index.tsx
│   ├── tasks.tsx
│   └── reminders.tsx
│
├── styles.css
├── router.tsx
└── routeTree.gen.ts
```

---

# 🗄️ Database Schema

## Tasks Table

| Column | Type |
|----------|----------|
| id | UUID |
| title | TEXT |
| description | TEXT |
| due_date | TIMESTAMP |
| reminder_time | TIMESTAMP |
| priority | TEXT |
| status | TEXT |
| created_at | TIMESTAMP |

### SQL Schema

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP,
    reminder_time TIMESTAMP,
    priority TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/taskflow.git
```

```bash
cd taskflow
```

---

## Install Dependencies

```bash
npm install
```

or

```bash
bun install
```

---

## Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## Start Development Server

```bash
npm run dev
```

or

```bash
bun run dev
```

---

# 📧 Email Reminder Workflow

1. User creates a task.
2. User sets reminder date and time.
3. Task is stored in Supabase.
4. System checks pending reminders.
5. EmailJS sends notification email.
6. User receives reminder before deadline.

---

# 🎨 UI Features

### Dashboard Cards

- Total Tasks
- Pending Tasks
- Completed Tasks
- Due Today

### Task Status

- Pending
- In Progress
- Completed

### Priority Badges

| Priority | Color |
|-----------|---------|
| Low | Green |
| Medium | Orange |
| High | Red |

---

# 📸 Screens

### Dashboard
- Statistics Cards
- Search Bar
- Filters
- Progress Section

### Task Form
- Task Title
- Description
- Due Date
- Reminder Date
- Priority Selection

### Reminder Management
- Upcoming Reminders
- Sent Reminders
- Pending Reminders

---

# 🔐 Future Enhancements

- User Authentication
- Google Login
- SMS Notifications
- AI Task Suggestions
- Calendar Integration
- Recurring Tasks
- Team Collaboration
- Mobile Application

---

# 📈 Learning Outcomes

This project demonstrates:

- React Component Architecture
- CRUD Operations
- TypeScript Development
- Database Integration
- Email Automation
- State Management
- API Integration
- Responsive UI Design

---

# 👨‍💻 Author

Developed as a modern productivity and task management solution using React, TypeScript, Supabase, and EmailJS.

---
