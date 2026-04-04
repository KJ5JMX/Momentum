import { useState } from "react";
import { useEffect } from "react";
import {
  FiZap,
  FiTrendingUp,
  FiSun,
  FiStar,
  FiShield,
  FiAward,
  FiGift,
} from "react-icons/fi";

function CreateHabit({ fetchHabits, setCreating }) {
  const [habitName, setHabitName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!habitName) {
      setError("Please enter a habit name");
      return;
    }

    if (!category) {
      setError("Please select a category");
      return;
    }

    setError(null);

    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:5000/habits/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: habitName,
        category,
        description,
        schedule,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchHabits();
        setHabitName("");
        setCategory("");
        setDescription("");
        setSchedule("");
        setCreating(false);
      })

      .catch((error) => {
        console.error("Error:", error);
        setError("An error occurred. Please try again.");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Habit</h2>
      {error && (
        <div className="error-modal">
          <p>{error}</p>
          <button onClick={() => setError("")}>OK</button>
        </div>
      )}

      <input
        type="text"
        placeholder="What's your new habit?"
        value={habitName}
        onChange={(e) => setHabitName(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        <option value="Health">Health</option>
        <option value="Productivity">Productivity</option>
        <option value="Hobby">Hobby</option>
      </select>

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select value={schedule} onChange={(e) => setSchedule(e.target.value)}>
        <option value="">Select Schedule</option>
        <option value="Daily">Daily</option>
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
        <option value="Yearly">Yearly</option>
      </select>

      <button type="submit">Create Habit</button>
      <button type="button" onClick={() => setCreating(false)}>
        Cancel
      </button>
    </form>
  );
}

function DashboardPage() {
  const [habits, setHabits] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [entries, setEntries] = useState({});
  const [editedDescription, setEditedDescription] = useState("");
  const [editedSchedule, setEditedSchedule] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  function authFetch(url, options) {
    return fetch(url, options).then((response) => {
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      return response.json();
    });
  }

  function fetchEntries(habitId) {
    const token = localStorage.getItem("token");
    authFetch(`http://127.0.0.1:5000/entries/habit/${habitId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => {
        setEntries((prevEntries) => ({
          ...prevEntries,
          [habitId]: data.entries,
        }));
      })
      .catch((error) => console.error("Error:", error));
  }

  function fetchHabits() {
    const token = localStorage.getItem("token");
    authFetch(
      `http://127.0.0.1:5000/habits/?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((data) => {
        setHabits(data.habits);
        setTotalPages(data.pages);
        (data.habits || []).forEach((habit) => fetchEntries(habit.id));
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(
          "An error occurred while getting your habits. Please try again.",
        );
      });
  }

  function handleEdit(habit) {
    setEditingId(habit.id);
    setEditedName(habit.name);
    setEditedCategory(habit.category);
    setEditedDescription(habit.description);
    setEditedSchedule(habit.schedule);
  }
  function handleUpdate() {
    const token = localStorage.getItem("token");
    authFetch(`http://127.0.0.1:5000/habits/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: editedName,
        category: editedCategory,
        description: editedDescription,
        schedule: editedSchedule,
      }),
    })
      .then(() => {
        fetchHabits();
        setEditingId(null);
        setSelectedHabit({
          ...selectedHabit,
          name: editedName,
          category: editedCategory,
          description: editedDescription,
          schedule: editedSchedule,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(
          "An error occurred while updating the habit. Please try again.",
        );
      });
  }

  function handleComplete(id) {
    const token = localStorage.getItem("token");
    if (entries[id]?.some((e) => e.date === today)) {
      setError("You've already completed this habit today!");
      return;
    }
    authFetch(`http://127.0.0.1:5000/entries/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        habit_id: id,
        date: new Date().toISOString().split("T")[0],
      }),
    })
      .then(() => {
        fetchHabits();
        fetchEntries(id);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(
          "An error occurred while completing the habit. Please try again.",
        );
      });
  }

  function getStreak(habitId) {
    const habitEntries = entries[habitId] || [];
    const dates = habitEntries.map((e) => e.date).sort();
    if (dates.length === 0) return 0;
    let streak = 1;
    for (let i = dates.length - 1; i > 0; i--) {
      const curr = new Date(dates[i]);
      const prev = new Date(dates[i - 1]);
      const diff = (curr - prev) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  function getBadges(habitId) {
    const streak = getStreak(habitId);
    const total = (entries[habitId] || []).length;
    const badges = [];
    if (total >= 1) badges.push({ name: "First Day", icon: <FiZap /> });
    if (streak >= 7) badges.push({ name: "1 Week", icon: <FiTrendingUp /> });
    if (streak >= 14) badges.push({ name: "2 Weeks", icon: <FiSun /> });
    if (streak >= 30) badges.push({ name: "1 Month", icon: <FiStar /> });
    if (streak >= 90) badges.push({ name: "3 Months", icon: <FiShield /> });
    if (streak >= 180) badges.push({ name: "6 Months", icon: <FiAward /> });
    if (streak >= 365) badges.push({ name: "1 Year", icon: <FiGift /> });

    return badges;
  }

  function handleDelete(id) {
    const token = localStorage.getItem("token");
    authFetch(`http://127.0.0.1:5000/habits/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        fetchHabits();
        setSelectedHabit(null);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(
          "An error occurred while deleting the habit. Please try again.",
        );
      });
  }

  useEffect(() => {
    fetchHabits();
  }, [page]);

  return (
    <>
      {error && (
        <div className="error-modal">
          <p>{error}</p>
          <button onClick={() => setError(null)}>OK</button>
        </div>
      )}

      <div
        className="main-content"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedHabit(null);
            setCreating(false);
          }
        }}
      >
        <div className="panel-header">
          <h1>My Habits</h1>

          <button
            onClick={() => {
              setCreating(true);
              setSelectedHabit(null);
            }}
          >
            + Create Habit
          </button>
        </div>
        <ul>
          {habits.map((habit) => (
            <li
              key={habit.id}
              className={selectedHabit?.id === habit.id ? "selected" : ""}
              onClick={() => {
                setSelectedHabit(habit);
                setCreating(false);
              }}
            >
              {habit.name}
            </li>
          ))}
        </ul>
        <div className="pagination-controls">
          {page > 1 && (
            <button onClick={() => setPage(page - 1)}>Previous</button>
          )}
          <span>
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <button onClick={() => setPage(page + 1)}>Next</button>
          )}
        </div>
      </div>
      <div className="detail-panel">
        {creating ? (
          <CreateHabit fetchHabits={fetchHabits} setCreating={setCreating} />
        ) : selectedHabit ? (
          <>
            {editingId === selectedHabit.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate();
                }}
              >
                <h2>Edit Habit</h2>
                <h3>Name</h3>
                <input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <h3>Category</h3>

                <select
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="Health">Health</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Hobby">Hobby</option>
                </select>
                <h3>Description</h3>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Description (optional)"
                />
                <h3>Schedule</h3>
                <select
                  value={editedSchedule}
                  onChange={(e) => setEditedSchedule(e.target.value)}
                >
                  <option value="">Select Schedule</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <div className="detail-view">
                <div className="panel-header">
                  <h2>{selectedHabit.name}</h2>
                  <button onClick={() => handleEdit(selectedHabit)}>
                    Edit
                  </button>
                </div>
                <p>Category: {selectedHabit.category}</p>
                <h3>Description</h3>
                <p>{selectedHabit.description || "No description provided."}</p>
                <h3>Schedule</h3>
                <p>{selectedHabit.schedule || "No schedule provided."}</p>
                <div className="completed-today-wrapper">
                  {entries[selectedHabit.id]?.some((e) => e.date === today) && (
                    <p className="completed-today">Completed today!</p>
                  )}
                </div>

                <button
                  className="complete-btn"
                  onClick={() => handleComplete(selectedHabit.id)}
                >
                  Complete
                </button>

                <h3>This Week</h3>
                <div className="streak-grid">
                  {(() => {
                    const now = new Date();
                    const sunday = new Date(now);
                    sunday.setDate(now.getDate() - now.getDay());
                    const days = ["S", "M", "T", "W", "T", "F", "S"];
                    return days.map((day, i) => {
                      const d = new Date(sunday);
                      d.setDate(sunday.getDate() + i);
                      const dateStr = d.toISOString().split("T")[0];
                      const completed = entries[selectedHabit.id]?.some(
                        (e) => e.date === dateStr,
                      );
                      return (
                        <div
                          key={i}
                          className={`streak-day ${completed ? "completed" : ""}`}
                        >
                          {day}
                        </div>
                      );
                    });
                  })()}
                </div>
                <h3>Current Streak</h3>
                <p>{getStreak(selectedHabit.id)} days</p>

                <h3>Badges</h3>
                <div className="badge-grid">
                  {getBadges(selectedHabit.id).map((badge) => (
                    <div key={badge.name} className="badge">
                      {badge.icon} {badge.name}
                    </div>
                  ))}
                  {getBadges(selectedHabit.id).length === 0 && (
                    <p>Complete your first day to earn a badge!</p>
                  )}
                </div>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(selectedHabit.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </>
        ) : (
          <p>Select a habit to see details</p>
        )}
      </div>
    </>
  );
}

export default DashboardPage;
