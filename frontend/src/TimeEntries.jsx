import { useEffect, useState } from "react";
import axios from "axios";

function TimeEntries() {
  const [entries, setEntries] = useState([]);

  const API_URL = "http://127.0.0.1:8000/api/time-entries";

  const fetchEntries = async () => {
    try {
      const res = await axios.get(API_URL);
      setEntries(res.data);
    } catch (error) {
      console.error("Error loading time entries:", error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Time Entries</h1>

      {entries.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        <ul>
          {entries.map((entry) => (
            <li key={entry.id}>
              <strong>{entry.date}</strong> — {entry.start_time} to {entry.end_time}
              <br />
              Category: {entry.category?.name}
              <br />
              Notes: {entry.notes}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TimeEntries;
