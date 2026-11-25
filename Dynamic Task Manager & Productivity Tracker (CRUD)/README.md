# Dynamic Task Manager & Productivity Tracker (CRUD)

A browser-only task manager for Task 2 of the Datheon Full-Stack Web Development Internship. Tasks stay in `localStorage`, so a reload keeps them.

## Run it

No install and no server. Open `index.html` in a browser.

From this folder you can also run:

```bash
python -m http.server 5501
```

Then open `http://127.0.0.1:5501`.

## What it does

- Create, edit, and delete tasks
- Categories: Work, Personal, Study
- Optional due date, with overdue styling
- Mark complete, with a short transition
- Filter by All, Active, and Completed
- Search by title
- Drag the handle to reorder
- `saveToLocalStorage()` and `loadFromLocalStorage()` persist the `tasks` array

## Stack

HTML, CSS, and JavaScript (ES6+). DOM updates, the `localStorage` API, and CSS transitions. No backend.
