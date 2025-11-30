import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const API_URL = "http://127.0.0.1:8000/api/categories";



  
  // Load categories when page starts
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  // Add or Update Category
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      if (editingId) {
        // UPDATE
        await axios.put(`${API_URL}/${editingId}`, { name });
      } else {
        // CREATE
        await axios.post(API_URL, { name });
      }

      setName("");
      setEditingId(null);
      fetchCategories();

    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEdit = (category) => {
    setName(category.name);
    setEditingId(category.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <>
      <header>
        <h1>Manage Categories</h1>

        <nav>
          <ul>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/time-entries">Time Entries</Link></li>
            <li><Link to="/summary">Summary</Link></li>
          </ul>
        </nav>
      </header>

      {/* Add or Edit Form */}
      <section id="add-category">
        <h2>{editingId ? "Edit Category" : "Add New Category"}</h2>

        <form onSubmit={handleSubmit}>
          <label>Category Name:</label>
          <input
            type="text"
            value={name}
            placeholder="Enter category"
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">
            {editingId ? "Update Category" : "Add Category"}
          </button>
        </form>
      </section>

      {/* Categories List */}
      <section id="categories-list">
        <h2>Available Categories</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.name}</td>
                <td>
                  <button type="button" onClick={() => handleEdit(cat)}>
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan="4">No categories found.</td>
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

export default Categories;
