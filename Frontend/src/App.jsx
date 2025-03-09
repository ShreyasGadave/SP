import React, { useState, useEffect } from "react";

const App = () => {
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [img, setImg] = useState(null); // Store file, not value

  const API_URL = import.meta.env.VITE_REACT_LOCAL_HOST;

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/form`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
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
      alert("Please fill out all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("Username", Username);
    formData.append("Email", Email);
    if (img) formData.append("img", img); // Append image only if selected

    try {
      let response;
      if (editingUser) {
        response = await fetch(`${API_URL}/form/${editingUser._id}`, {
          method: "PUT",
          body: formData, // Send formData (not JSON)
        });
      } else {
        response = await fetch(`${API_URL}/form`, {
          method: "POST",
          body: formData, // Send formData (not JSON)
        });
      }

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      fetchUsers();
      setUsername("");
      setEmail("");
      setImg(null);
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
      <form onSubmit={FormHandler} encType="multipart/form-data">
        <input type="file" accept="image/*" onChange={(e) => setImg(e.target.files[0])} />
        <input type="text" placeholder="Username" value={Username} onChange={(e) => setUsername(e.target.value)} />
        <input type="text" placeholder="Email" value={Email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">{editingUser ? "Update" : "Submit"}</button>
        <button type="button" onClick={() => { setUsername(""); setEmail(""); setImg(null); setEditingUser(null); }}>
          Clear Form
        </button>
      </form>

      <h3>All Users</h3>
      {users.length > 0 ? (
        users.map((user, index) => (
          <div key={index} style={{ padding: "10px", border: "1px solid black", marginBottom: "10px" }}>
            <p><strong>Username:</strong> {user.Username || user.username}</p>
            <p><strong>Email:</strong> {user.Email || user.email}</p>
            {user.img && <img src={`${API_URL}/${user.img}`} alt="User" width="100" />} {/* Display image */}
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
