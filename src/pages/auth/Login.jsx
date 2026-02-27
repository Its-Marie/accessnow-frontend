import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Login.css";
import { API_BASE } from '../../config/api';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [formValues, setFormValues] = useState({ email: "", password: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: t("login.status.signingYouIn") });

    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formValues.email,
          password: formValues.password,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg =
          err.description ||
          err.message ||
          t("login.errors.invalidCredentials");
        setStatus({ state: "error", message: msg });
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-change"));

      setStatus({
        state: "success",
        message: data.message || t("login.status.signedInSuccessfully"),
      });

      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      setStatus({ state: "error", message: t("login.errors.network") });
    }
  }

  function handleChange(e) {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <main className="login-page" aria-labelledby="login-title">
      <section className="login-hero" aria-label={t("login.aria.welcomeMessage")}>
        <p className="eyebrow">{t("login.eyebrow")}</p>
        <h1 id="login-title">{t("login.title")}</h1>

        <p className="lede">{t("login.lede")}</p>

        <ul className="hero-highlights" aria-label={t("login.aria.highlights")}>
          <li>{t("login.highlights.contrast")}</li>
          <li>{t("login.highlights.focus")}</li>
          <li>{t("login.highlights.motion")}</li>
        </ul>
      </section>

      <section className="login-card" aria-label={t("login.aria.signInForm")}>
        <div className="login-header">
          <p className="eyebrow">{t("login.cardEyebrow")}</p>
          <h2>{t("login.cardTitle")}</h2>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="email">
              {t("login.emailLabel")} <span aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              placeholder={t("login.emailPlaceholder")}
              aria-describedby="email-help"
              value={formValues.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">
              {t("login.passwordLabel")} <span aria-hidden="true">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder={t("login.passwordPlaceholder")}
              value={formValues.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-footer">
            <button type="submit" disabled={status.state === "loading"}>
              {status.state === "loading"
                ? t("login.actions.signingIn")
                : t("login.actions.continue")}
            </button>

            <Link to="/registration" className="ghost-button">
              {t("login.actions.createAccount")}
            </Link>
          </div>
        </form>

        <div className="login-links" aria-label={t("login.aria.helpfulLinks")}>
          <Link to="/" className="link-inline">
            {t("login.links.backToHome")}
          </Link>
          <span aria-hidden="true">•</span>
          <Link to="/registration" className="link-inline">
            {t("login.links.needAccount")}
          </Link>
        </div>

        <div className={`login-status ${status.state}`} role="status" aria-live="polite">
          {status.message}
        </div>
      </section>
    </main>
  );
}