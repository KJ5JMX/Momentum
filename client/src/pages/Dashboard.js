import { useState } from "react";
import { useEffect } from "react";

function CreateHabit({ fetchHabits }) {
  const [habitName, setHabitName] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:5000/habits/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: habitName, category }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchHabits();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Create Habit</button>
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
      .catch((error) => console.error("Error:", error));
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
      });
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      <CreateHabit fetchHabits={fetchHabits} />
      <ul>
        {habits.map((habit) => (
          <li key={habit.id}>
            {entries[habit.id] &&
              entries[habit.id].map((entry) => (
                <span key={entry.id}>{entry.date}</span>
              ))}
            {editingId === habit.id ? (
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
                {habit.name} - {habit.category}
                <button onClick={() => handleEdit(habit)}>Edit</button>
                <button onClick={() => handleDelete(habit.id)}>Delete</button>
                <button onClick={() => handleComplete(habit.id)}>
                  {entries[habit.id]?.some((e) => e.date === today) && (
                    <span>Completed today!</span>
                  )}
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DashboardPage;
