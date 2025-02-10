
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Swal from "sweetalert2";

const App = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // DummyJSON returns an object with a "users" array
      const response = await axios.get("https://dummyjson.com/users");
      setUsers(response.data.users);
    } catch (error) {
      Swal.fire("Error", "Unable to fetch users", "error");
    }
  };

  // Yup validation schema for the user form
  const userSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    department: Yup.string().required("Department is required"),
  });

  // Handle form submission via Formik
  const handleSubmit = async (values, { resetForm }) => {
    if (editingUser) {
      try {
        const response = await axios.put(
          `https://dummyjson.com/users/${editingUser.id}`,
          {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            company: { department: values.department },
          }
        );
        setUsers(
          users.map((user) =>
            user.id === editingUser.id ? response.data : user
          )
        );
        setEditingUser(null);
        Swal.fire("Success", "User updated successfully", "success");
        resetForm();
      } catch (error) {
        Swal.fire("Error", "Failed to update user", "error");
      }
    } else {
      try {
        const response = await axios.post("https://dummyjson.com/users/add", {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          company: { department: values.department },
        });
        setUsers([...users, response.data]);
        Swal.fire("Success", "User added successfully", "success");
        resetForm();
      } catch (error) {
        Swal.fire("Error", "Failed to add user", "error");
      }
    }
  };

  // Prepare form data for editing a user
  const startEditUser = async (user) => {
    const result = await Swal.fire({
      title: `Are you sure you want to edit ${user.firstName} ${user.lastName}?`,
      text: "You are about to edit this user's information.",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, edit it!",
    });

    if (result.isConfirmed) {
      setEditingUser(user);
      Swal.fire("Ready!", "You can now edit the user's details.", "success");
    }
  };

  const deleteUser = async (id, user) => {
    const result = await Swal.fire({
      title: `Do you want to delete the user ${user.firstName} ${user.lastName}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://dummyjson.com/users/${id}`);
        setUsers(users.filter((user) => user.id !== id));
        Swal.fire("Deleted!", "The user has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete user", "error");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">User Management</h2>
      <Formik
        enableReinitialize
        initialValues={{
          firstName: editingUser ? editingUser.firstName : "",
          lastName: editingUser ? editingUser.lastName : "",
          email: editingUser ? editingUser.email : "",
          department:
            editingUser && editingUser.company && editingUser.company.department
              ? editingUser.company.department
              : "",
        }}
        validationSchema={userSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <Field
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Enter first name"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <Field
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Enter last name"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="department" className="form-label">
                      Department
                    </label>
                    <Field
                      id="department"
                      name="department"
                      type="text"
                      placeholder="Enter department"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="department"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>
                <div className="mt-3 text-end">
                  <button
                    type="submit"
                    className={`btn ${editingUser ? "btn-warning" : "btn-primary"}`}
                    disabled={isSubmitting}
                  >
                    {editingUser ? "Update User" : "Add User"}
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <div className="mt-5">
        {users.length > 0 ? (
          <table className="table table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.company && user.company.department
                      ? user.company.department
                      : "N/A"}
                  </td>
                  <td>
                    <button
                      onClick={() => startEditUser(user)}
                      className="btn btn-sm btn-info me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user.id, user)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center mt-5">
            <h4>No users found. Please add users.</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;











