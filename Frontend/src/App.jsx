import React, { useState, useEffect } from "react";

const App = () => {
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const API_URL = import.meta.env.VITE_REACT_LOCAL_HOST;
  ;

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/form`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}/form`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const FormHandler = async (e) => {
    e.preventDefault();
    if (!Username || !Email) {
      alert("Please fill out both fields.");
      return;
    }

    try {
      let response;
      if (editingUser) {
        response = await fetch(`${API_URL}/form/${editingUser._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Username, Email }),
        });
      } else {
        response = await fetch(`${API_URL}/form`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Username, Email }),
        });
      }

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      fetchUsers();
      setUsername("");
      setEmail("");
      setEditingUser(null);
    } catch (error) {
      console.error("Error in FormHandler:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${API_URL}/form/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  const editUser = (user) => {
    setEditingUser(user);
    setUsername(user.Username || user.username);
    setEmail(user.Email || user.email);
  };

  return (
    <div>
      <h2>{editingUser ? "Update User" : "Student Information"}</h2>
      <form onSubmit={FormHandler}>
        <input type="text" placeholder="Username" value={Username} onChange={(e) => setUsername(e.target.value)} />
        <input type="text" placeholder="Email" value={Email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">{editingUser ? "Update" : "Submit"}</button>
        <button type="button" onClick={() => { setUsername(""); setEmail(""); setEditingUser(null); }}>
          Clear Form
        </button>
      </form>

      <h3>All Users</h3>
      {users.length > 0 ? (
        users.map((user, index) => (
          <div key={index} style={{ padding: "10px", border: "1px solid black", marginBottom: "10px" }}>
            <p><strong>Username:</strong> {user.Username || user.username}</p>
            <p><strong>Email:</strong> {user.Email || user.email}</p>
            <button onClick={() => editUser(user)}>Edit</button>
            <button onClick={() => deleteUser(user._id)}>Delete</button>
            <hr />
          </div>
        ))
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default App;
