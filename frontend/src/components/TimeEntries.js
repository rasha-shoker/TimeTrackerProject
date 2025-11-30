import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function TimeEntries() {
  const [categories, setCategories] = useState([]);
  const [entries, setEntries] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  const [editingId, setEditingId] = useState(null);

  const API_BASE = "http://127.0.0.1:8000/api";


  useEffect(() => {
    fetchCategories();
    fetchEntries();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`${API_BASE}/time-entries`);
      setEntries(res.data);
    } catch (error) {
      console.error("Error loading time entries:", error);
    }
  };

  const resetForm = () => {
    setCategoryId("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setNotes("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId || !date || !startTime || !endTime) {
      alert("Please fill category, date, start and end time.");
      return;
    }

    const payload = {
      category_id: categoryId,
      date: date,
      start_time: startTime,
      end_time: endTime,
      notes: notes,
    };

    try {
      if (editingId) {
        // UPDATE
        await axios.put(`${API_BASE}/time-entries/${editingId}`, payload);
      } else {
        // CREATE
        await axios.post(`${API_BASE}/time-entries`, payload);
      }

      resetForm();
      fetchEntries();
    } catch (error) {
      console.error("Error saving time entry:", error);
      alert("Error saving time entry. Check console.");
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setCategoryId(entry.category_id);
    setDate(entry.date);
    setStartTime(entry.start_time);
    setEndTime(entry.end_time);
    setNotes(entry.notes || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      await axios.delete(`${API_BASE}/time-entries/${id}`);
      fetchEntries();
    } catch (error) {
      console.error("Error deleting time entry:", error);
    }
  };


  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : id;
  };

  return (
    <>
      {/* HEADER */}
      <header>
        <h1>Time Entries</h1>

        <nav>
          <ul>
            <li>
              <Link to="/categories">Categories</Link>
            </li>
            <li>
              <Link to="/time-entries">Time Entries</Link>
            </li>
            <li>
              <Link to="/summary">Summary</Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* ADD / EDIT FORM */}
      <section id="add-time-entry">
        <h2>{editingId ? "Edit Time Entry" : "Add New Time Entry"}</h2>

        <form onSubmit={handleSubmit}>
          <label>Category:</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(parseInt(e.target.value))}
          >
            <option value="">-- Select category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label>Start time:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <label>End time:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />

          <label>Notes (optional):</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write notes..."
          />

          <button type="submit">
            {editingId ? "Update Entry" : "Add Entry"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </form>
      </section>

      {/* LIST OF ENTRIES */}
      <section id="entries-list">
        <h2>Logged Entries</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Notes</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.id}</td>
                <td>
                  {entry.category
                    ? entry.category.name
                    : getCategoryName(entry.category_id)}
                </td>
                <td>{entry.date}</td>
                <td>{entry.start_time}</td>
                <td>{entry.end_time}</td>
                <td>{entry.notes}</td>
                <td>
                  <button type="button" onClick={() => handleEdit(entry)}>
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDelete(entry.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {entries.length === 0 && (
              <tr>
                <td colSpan="8">No time entries yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <footer className="footer">
        <p>© 2025 TimeTracker</p>
      </footer>
    </>
  );
}

export default TimeEntries;
