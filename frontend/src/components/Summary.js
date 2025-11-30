import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Summary() {
  const [totalPerCategory, setTotalPerCategory] = useState([]);
  const [dailyBreakdown, setDailyBreakdown] = useState([]);

  const API_BASE = "http://127.0.0.1:8000/api/summary";

  // Load summary when page loads
  useEffect(() => {
    fetchTotalPerCategory();
    fetchDailyBreakdown();
  }, []);

  const fetchTotalPerCategory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/total-per-category`);
      setTotalPerCategory(res.data);
    } catch (err) {
      console.error("Error loading total per category:", err);
    }
  };

  const fetchDailyBreakdown = async () => {
    try {
      const res = await axios.get(`${API_BASE}/daily-breakdown`);
      setDailyBreakdown(res.data);
    } catch (err) {
      console.error("Error loading daily breakdown:", err);
    }
  };

  return (
    <>
      <header>
        <h1>Summary Reports</h1>
        <nav>
          <ul>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/time-entries">Time Entries</Link></li>
            <li><Link to="/summary">Summary</Link></li>
          </ul>
        </nav>
      </header>

      {/* Total Per Category */}
      <section>
        <h2>Total Time Per Category</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Minutes</th>
              <th>Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {totalPerCategory.map((row, i) => (
              <tr key={i}>
                <td>{row.category}</td>
                <td>{row.total_minutes}</td>
                <td>{row.total_hours}</td>
              </tr>
            ))}
            {totalPerCategory.length === 0 && (
              <tr><td colSpan="3">No data</td></tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Daily Breakdown */}
      <section>
        <h2>Daily Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Total Minutes</th>
              <th>Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {dailyBreakdown.map((row, i) => (
              <tr key={i}>
                <td>{row.date}</td>
                <td>{row.category}</td>
                <td>{row.total_minutes}</td>
                <td>{row.total_hours}</td>
              </tr>
            ))}
            {dailyBreakdown.length === 0 && (
              <tr><td colSpan="4">No data</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <footer>
        <p>© 2025 TimeTracker</p>
      </footer>
    </>
  );
}

export default Summary;
