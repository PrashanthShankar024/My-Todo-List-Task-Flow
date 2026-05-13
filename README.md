# TaskFlow • Modern To-Do

A polished JavaScript-based to-do list app with user login, task filtering, persistent local storage, and a clean modern UI.

## Features

- Login and registration screen with a demo account flow
- User-specific task storage using `localStorage`
- Add tasks with title, optional description, and optional due date/time
- Toggle task completion and delete tasks
- View tasks in three filters: All, Pending, Completed
- Live task counters for total, pending, and completed tasks
- Auto-login when returning to the app
- Responsive modern UI using CSS gradients and glassmorphism styling

## Files

- `index.html` — app structure, authentication screen, main task UI, and Font Awesome integration
- `style.css` — visual styling for login screen and task dashboard
- `script.js` — app logic for login, registration, task CRUD, views, and local persistence

## How to run

1. Open `index.html` in your browser.
2. Create an account or use any username/password combination to sign in.
3. Add tasks using the title field, plus optional notes and due date.
4. Switch between All, Pending, and Completed views.
5. Task data is saved in browser `localStorage` per user.

## Notes

- This app is front-end only and stores user data locally in the browser.
- The login system is a demo implementation; passwords are stored in `localStorage` and are not secure.
- To reset the app state, clear your browser local storage for this site.

## Improvements you can make

- Add password hashing or connect to a real backend
- Enable task editing
- Add search and sorting
- Add notifications for overdue tasks
- Improve mobile responsiveness further
