# Momentum

A habit and streak reinforcement app that helps users build consistency by tracking habits over time. Instead of treating habits like simple tasks, Momentum focuses on behavioral reinforcement through streak tracking and long-term progress visualization.

## Tech Stack

- **Backend:** Flask, SQLAlchemy, Flask-Migrate, Flask-JWT-Extended, Flask-CORS
- **Frontend:** React, React Router, React Icons
- **Database:** PostgreSQL
- **Auth:** JWT (JSON Web Tokens)

## Setup

### Backend

```bash
cd server
python -m venv venv
source venv/bin/activate
pip install flask flask-cors flask-migrate flask-jwt-extended flask-sqlalchemy
flask db upgrade
flask run
```

The API will be running at `http://127.0.0.1:5000`.

### Frontend

```bash
cd client
npm install
npm start
```

The app will be running at `http://localhost:3000`.

## Features

- User signup and login with JWT authentication
- Create habits with name, category, description, and schedule (daily/weekly/monthly/yearly)
- Edit and delete habits with full form support
- Mark habits as completed for the day with visual confirmation
- View completion history per habit
- 3-panel dashboard layout: sidebar navigation, habit list, and detail panel
- Create and edit habit forms open in the detail panel
- Error handling with modal popups across all forms and API calls
- Input validation for empty fields, duplicate usernames, and invalid credentials
- Streak tracking with visual 7-day grid (Sunday-Saturday)
- Badge system for milestones (First Day, 1 Week, 2 Weeks, 1 Month, 3 Months, 6 Months, 1 Year)
- Paginated habit list with Next/Previous navigation
- Automatic redirect to login on JWT expiration
- Clean, responsive UI with consistent styling

## Live Demo

[https://thenobodyprojects.com](https://thenobodyprojects.com)

## API Endpoints

### Auth

- `POST /auth/register` — Create a new account (username, email, password)
- `POST /auth/login` — Log in and receive a JWT token

### Habits (requires JWT)

- `POST /habits/` — Create a habit (name, category, description, schedule)
- `GET /habits/` — Get all habits for the logged-in user
- `PUT /habits/<id>` — Update a habit (name, category, description, schedule)
- `DELETE /habits/<id>` — Delete a habit

### Habit Entries (requires JWT)

- `POST /entries/` — Log a habit completion for a date
- `GET /entries/habit/<habit_id>` — Get all entries for a specific habit

## Project Structure

```
Momentum/
├── client/                 # React frontend
│   └── src/
│       ├── assets/         # Logo and images
│       ├── components/     # Reusable components (Navbar)
│       ├── pages/          # Page components (Dashboard, Login, Signup)
│       ├── App.js          # Route configuration
│       └── App.css         # Global styles
├── server/                 # Flask backend
│   ├── app.py              # App initialization and configuration
│   ├── models.py           # Database models (User, Habit, HabitEntry)
│   ├── auth_routes.py      # Authentication endpoints
│   ├── habit_routes.py     # Habit CRUD endpoints
│   ├── entry_routes.py     # Habit entry endpoints
│   └── config.py           # App configuration
└── README.md
```
