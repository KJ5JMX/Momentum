# Momentum

A habit and streak reinforcement app that helps users build consistency by tracking habits over time. Instead of treating habits like simple tasks, Momentum focuses on behavioral reinforcement through streak tracking and long-term progress visualization.

## Tech Stack

- **Backend:** Flask, SQLAlchemy, Flask-Migrate, Flask-JWT-Extended
- **Frontend:** React, React Router
- **Database:** SQLite

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

## API Endpoints

### Auth
- `POST /auth/register` — Create a new account
- `POST /auth/login` — Log in and receive a JWT token

### Habits (requires JWT)
- `POST /habits/` — Create a habit
- `GET /habits/` — Get all habits for the logged-in user
- `PUT /habits/<id>` — Update a habit
- `DELETE /habits/<id>` — Delete a habit

### Habit Entries (requires JWT)
- `POST /entries/` — Log a habit completion for a date
- `GET /entries/<id>` — Get a specific habit entry

## Current Status

- [x] User signup and login with JWT authentication
- [x] Full CRUD for habits
- [x] Habit entry logging
- [x] Database models and migrations
- [ ] React login and signup pages
- [ ] Dashboard
- [ ] Streak calculation
- [ ] Badge/milestone system
