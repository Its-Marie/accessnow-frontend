import { Link, useLocation } from 'react-router-dom';
import React, {useState} from 'react';
import "./Registration.css";
import { API_BASE } from '../../config/api';

export default function Registration() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState({state:"idle", message:""});
  
  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (formData.password!==formData.confirmPassword) {
      setStatus({state:"error", message:"Passwords do not match"});
      return;
    }

    setStatus({state:"loading", message:"Registering..."});

    const {name, email, password } = formData;
    try {
      const response = await fetch(`${API_BASE}/api/users`, {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, email, password}),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        setStatus({
          state:"error", 
          message: err.message || 'Registration failed'
        });
        return;
      }
       

      setStatus({state:"success", message:"Registration successful!"});
    } catch (error) {
      setStatus({
        state:"error", 
        message: error.message || 'An unexpected error occurred'
      });
    }
  }
  return (
    <>
      <h1>Registration</h1>
      <h2>{location.pathname}</h2>
      
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={status.state === "loading"}>
          {status.state === "loading" ? "Registering..." : "Register"}
        </button>
      </form>
      {status.state === "error" && <p className="error-message">{status.message}</p>}
      {status.state === "success" && <p className="success-message">{status.message}</p>}

      <Link to="/">Home</Link>
      <br />
      <Link to="/login">Login</Link>
      <br />
      <Link to="/preferences">Preferences</Link>
    </>
  );
}

