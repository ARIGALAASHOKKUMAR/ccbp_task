import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UsersList.css";
import Swal from "sweetalert2";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:5000/users");
    setUsers(response.data);
  };

  const addUser = async () => {
    const response = await axios.post("http://localhost:5000/users", {
      name,
      email,
      dateOfBirth,
    });
    setUsers([...users, response.data]);
    setName("");
    setEmail("");
    setDateOfBirth("");
  };

  const updateUser = async () => {
    const response = await axios.put(
      `http://localhost:5000/users/${editingUser._id}`,
      {
        name,
        email,
        dateOfBirth,
      }
    );
    setUsers(
      users.map((user) => (user._id === editingUser._id ? response.data : user))
    );
    setEditingUser(null);
    setName("");
    setEmail("");
    setDateOfBirth("");
  };

  const deleteUser = async (id, user) => {
    const result = await Swal.fire({
      title: `Do you want delete the user ${user.name}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await axios.delete(`http://localhost:5000/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      Swal.fire("Deleted!", "The user has been deleted.", "success");
    }
  };

  const startEditUser = async (user) => {
    const result = await Swal.fire({
      title: `Are you sure want edit ${user.name}?`,
      text: "You are about to edit this user's information.",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, edit it!",
    });

    if (result.isConfirmed) {
      setEditingUser(user);
      setName(user.name);
      setEmail(user.email);
      setDateOfBirth(user.dateOfBirth.split("T")[0]); // Format date for input
      Swal.fire("Ready!", "You can now edit the user's details.", "success");
    }
  };

  return (
    <div className="app">
      <h2 className="text-center">User Management</h2>
      <div className="form-container">
        <input
          type="text"
          placeholder="Name"
          className="capital"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="date"
          placeholder="Date of Birth"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
        {editingUser ? (
          <button onClick={updateUser} className="btn btn-update">
            Update User
          </button>
        ) : (
          <button onClick={addUser} className="btn btn-add">
            Add User
          </button>
        )}
      </div>
      {users.length>0?(<table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{new Date(user.dateOfBirth).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => startEditUser(user)}
                  className="btn btn-primary"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteUser(user._id, user)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>):<h1 className="text-center">No users Found Please add users</h1>}
      
    </div>
  );
};

export default UsersList;
