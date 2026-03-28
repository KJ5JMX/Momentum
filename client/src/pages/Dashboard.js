import { useState } from "react";
import { useEffect } from "react";

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
      .then((data) => {
        console.log(data);
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
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#333",
            color: "white",
            padding: "20px 30px",
            borderRadius: "10px",
            textAlign: "center",
            zIndex: 10,
          }}
        >
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
  const today = new Date().toISOString().split("T")[0];
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  function fetchEntries(habitId) {
    const token = localStorage.getItem("token");
    fetch(`http://127.0.0.1:5000/entries/habit/${habitId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
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
    fetch("http://127.0.0.1:5000/habits/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setHabits(data.habits);
        data.habits.forEach((habit) => fetchEntries(habit.id));
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
  }
  function handleUpdate() {
    const token = localStorage.getItem("token");
    fetch(`http://127.0.0.1:5000/habits/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: editedName, category: editedCategory }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchHabits();
        setEditingId(null);
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
    fetch(`http://127.0.0.1:5000/entries/`, {
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
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
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

  function handleDelete(id) {
    const token = localStorage.getItem("token");
    fetch(`http://127.0.0.1:5000/habits/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchHabits();
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
  }, []);

  return (
    <>
      {error && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#333",
            color: "white",
            padding: "20px 30px",
            borderRadius: "10px",
            textAlign: "center",
            zIndex: 10,
          }}
        >
          <p>{error}</p>
          <button onClick={() => setError(null)}>OK</button>
        </div>
      )}

      <div className="main-content">
        <h1>My Habits</h1>

        <button
          onClick={() => {
            setCreating(true);
            setSelectedHabit(null);
          }}
        >
          + Create Habit
        </button>
        <ul>
          {habits.map((habit) => (
            <li
              key={habit.id}
              onClick={() => {
                setSelectedHabit(habit);
                setCreating(false);
              }}
            >
              {habit.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="detail-panel">
        {creating ? (
          <CreateHabit fetchHabits={fetchHabits} setCreating={setCreating} />
        ) : selectedHabit ? (
          <>
            {editingId === selectedHabit.id ? (
              <>
                <input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <select
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="Health">Health</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Hobby">Hobby</option>
                </select>
                <button onClick={() => handleUpdate()}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h2>{selectedHabit.name}</h2>
                <p>Category: {selectedHabit.category}</p>
                <button onClick={() => handleEdit(selectedHabit)}>Edit</button>
                <button onClick={() => handleDelete(selectedHabit.id)}>
                  Delete
                </button>
                <button onClick={() => handleComplete(selectedHabit.id)}>
                  Complete
                </button>
                {entries[selectedHabit.id]?.some((e) => e.date === today) && (
                  <p>Completed today!</p>
                )}
                <h3>Description</h3>
                <p>{selectedHabit.description || "No description provided."}</p>
                <h3>Schedule</h3>
                <p>{selectedHabit.schedule || "No schedule provided."}</p>
                <h3>History</h3>
                {entries[selectedHabit.id] &&
                  entries[selectedHabit.id].map((entry) => (
                    <p key={entry.id}>{entry.date}</p>
                  ))}
              </>
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
