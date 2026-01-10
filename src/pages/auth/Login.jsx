import { Link, useLocation } from "react-router-dom"
import React, { useState } from "react";
import "./Login.css";
import { API_BASE } from '../../config/api';

export default function Login() {
  const location = useLocation();
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [formValues, setFormValues] = useState({ email: "", password: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: "Signing you in..." });

    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const msg = err.description || err.message || "Login failed. Check your credentials.";
        setStatus({ state: "error", message: msg });
        return;
      }

      const data = await response.json();
      setStatus({ state: "success", message: data.message || "Signed in successfully." });
      try {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }

        const sessionId = data.sessionId || data.session;
        if (sessionId) {
          localStorage.setItem("sessionId", sessionId);
        }
      } catch (storageError) {
        console.warn("Unable to persist auth state", storageError);
      }
    } catch (error) {
      setStatus({ state: "error", message: "Network error. Please try again." });
    }
  }

  function handleChange(e) {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <main className="login-page" aria-labelledby="login-title">
      <section className="login-hero" aria-label="Welcome message">
        <p className="eyebrow">AccessNow+</p>
        <h1 id="login-title">Sign in</h1>
        <p className="lede">
          Clear typography, strong contrast, and keyboard-first flows help everyone get in fast.
        </p>
        <ul className="hero-highlights">
          <li>WCAG AA color contrast</li>
          <li>Visible focus states</li>
          <li>Reduced motion friendly</li>
        </ul>
      </section>

      <section className="login-card" aria-label="Sign-in form">
        <div className="login-header">
          <p className="eyebrow">Welcome back</p>
          <h2>Access your account</h2>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="email">
              Email address <span aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              placeholder="you@example.com"
              aria-describedby="email-help"
              value={formValues.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">
              Password <span aria-hidden="true">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              value={formValues.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-footer">
            <button type="submit" disabled={status.state === "loading"}>
              {status.state === "loading" ? "Signing in..." : "Continue"}
            </button>
            <Link to="/registration" className="ghost-button">
              Create account
            </Link>
          </div>
        </form>

        <div className="login-links" aria-label="Helpful links">
          <Link to="/" className="link-inline">
            Back to home
          </Link>
          <span aria-hidden="true">•</span>
          <Link to="/registration" className="link-inline">
            Need an account?
          </Link>
        </div>

        <p className="route-hint" aria-live="polite">
          Current route: {location.pathname}
        </p>

        <div
          className={`login-status ${status.state}`}
          role="status"
          aria-live="polite"
        >
          {status.message}
        </div>
      </section>
    </main>
  );
}
