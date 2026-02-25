import { Link, useLocation } from 'react-router-dom';
import React, {useState} from 'react';
import "./Registration.css";
import { API_BASE } from '../../config/api';

export default function Registration() {
  const [step, setStep] = useState(1);
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    needs: {
      elevators: false,
      toilets: false,
      accessible_parking: false,
      theme: 'system'
    }
  });
  const [status, setStatus] = useState({state:"idle", message:""});
  
  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    const path = name.split(".");

    setFormData(prev => {
      const next = { ...prev };

      if (path.length === 1) {
        next[path[0]] = newValue;
        return next;
      }

      let obj = next;
      for (let i = 0; i < path.length - 1; i++) {
        obj[path[i]] = { ...obj[path[i]] };
        obj = obj[path[i]];
      }

      obj[path[path.length - 1]] = newValue;
      return next;
    });
  }

  function validateStep1() {
    setStatus({ state:"idle", message:"" })

    if (!formData.name.trim()) {
      setStatus({ state: "error", message: "Name is required" });
      return false;
    }

    if (!formData.email.trim()) {
      setStatus({ state: "error", message: "Email is required" });
      return false;
    }

    if (!formData.password) {
      setStatus({ state: "error", message: "Password is required" });
      return false;
    }

    if (formData.password.length < 8) {
      setStatus({ state: "error", message: "Password must be at least 8 characters" });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus({ state: "error", message: "Passwords do not match" });
      return false;
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    setStatus({state:"loading", message:"Registering..."});

    const {name, email, password, needs } = formData;
    try {
      const response = await fetch(`${API_BASE}/api/users`, {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, email, password, needs}),
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
      <h2 aria-live="polite">
        Step {step} of 2
      </h2>
      <p>{location.pathname}</p>
      
      <form onSubmit={handleSubmit} className="registration-form">

        {step === 1 && (
          <>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name"
                value={formData.name}
                onChange={handleChange}
                required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email"
                value={formData.email}
                onChange={handleChange}
                required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password"
                value={formData.password}
                onChange={handleChange}
                required />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input type="password" id="confirmPassword" name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required />
            </div>

            <button
              type="button"
              aria-label={`Continue registration to step ${step +1 } of two`}
              onClick={() => {
                if (!validateStep1()) return;
                setStep(2);
              }}
            >
              Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <fieldset>
              <legend>Accessibility Preferences</legend>

              <label>
                <input
                  type="checkbox"
                  name="needs.elevators"
                  checked={formData.needs.elevators}
                  onChange={handleChange}
                />
                Elevator access
              </label>

              <label>
                <input
                  type="checkbox"
                  name="needs.toilets"
                  checked={formData.needs.toilets}
                  onChange={handleChange}
                />
                Public toilets
              </label>

              <label>
                <input
                  type="checkbox"
                  name="needs.accessible_parking"
                  checked={formData.needs.accessible_parking}
                  onChange={handleChange}
                />
                Accessible parking
              </label>

              <div>
                <p>Theme</p>
                <label>
                  <input
                    type="radio"
                    name="needs.theme"
                    value="system"
                    checked={formData.needs.theme === "system"}
                    onChange={handleChange}
                  />
                  Automatic
                </label>

                <label>
                  <input
                    type="radio"
                    name="needs.theme"
                    value="light"
                    checked={formData.needs.theme === "light"}
                    onChange={handleChange}
                  />
                  Light
                </label>

                <label>
                  <input
                    type="radio"
                    name="needs.theme"
                    value="dark"
                    checked={formData.needs.theme === "dark"}
                    onChange={handleChange}
                  />
                  Dark
                </label>
              </div>
            </fieldset>

            <button type="submit" disabled={status.state === "loading"}>
              {status.state === "loading" ? "Registering..." : "Create Account"}
            </button>

            <button 
              type="button" 
              aria-label="Go back to step 1 of 2"
              onClick={() => {
                setStatus({ state:"idle", message:""});
                setStep(1)
              }}
              >
              Back
            </button>
          </>
        )}

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

