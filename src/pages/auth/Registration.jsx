import { Link, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import "./Registration.css";
import { API_BASE } from '../../config/api';

export default function Registration() {
  const [step, setStep] = useState(1);
  const location = useLocation();
  const { t } = useTranslation("common");

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

  const [status, setStatus] = useState({ state: "idle", message: "" });

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
    setStatus({ state: "idle", message: "" });

    if (!formData.name.trim()) {
      setStatus({ state: "error", message: t("errors.nameRequired") });
      return false;
    }

    if (!formData.email.trim()) {
      setStatus({ state: "error", message: t("errors.emailRequired") });
      return false;
    }

    if (!formData.password) {
      setStatus({ state: "error", message: t("errors.passwordRequired") });
      return false;
    }

    if (formData.password.length < 8) {
      setStatus({ state: "error", message: t("errors.passwordMin") });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus({ state: "error", message: t("errors.passwordsMismatch") });
      return false;
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setStatus({ state: "loading", message: t("registration.loading") });

    const { name, email, password, needs } = formData;

    try {
      const response = await fetch(`${API_BASE}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, needs }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        setStatus({
          state: "error",
          message: err.description || err.message || t("errors.registrationFailed")
        });
        return;
      }

      setStatus({ state: "success", message: t("registration.success") });
    } catch (error) {
      setStatus({
        state: "error",
        message: error.message || t("errors.unexpected")
      });
    }
  }

  return (
    <>
      <h1>{t("registration.title")}</h1>

      <h2 aria-live="polite">
        {t("registration.stepLabel", { step, total: 2 })}
      </h2>

      <p>{location.pathname}</p>

      <form onSubmit={handleSubmit} className="registration-form">
        {step === 1 && (
          <>
            <div className="form-group">
              <label htmlFor="name">{t("registration.name")}</label>
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
              <label htmlFor="email">{t("registration.email")}</label>
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
              <label htmlFor="password">{t("registration.password")}</label>
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
              <label htmlFor="confirmPassword">{t("registration.confirmPassword")}</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                aria-label={t("registration.ariaContinue", { next: step + 1, total: 2 })}
                onClick={() => {
                  if (!validateStep1()) return;
                  setStep(2);
                }}
              >
                {t("registration.continue")}
              </button>
              <Link
                to="/"
                className="secondary-btn"
                aria-label={t("header.home")}
              >
                {t("header.home")}
              </Link>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <fieldset>
              <legend>{t("registration.preferencesLegend")}</legend>
              <h2>{t("registration.displayedOnMap")}</h2>

              <label>
                <input
                  type="checkbox"
                  name="needs.elevators"
                  checked={formData.needs.elevators}
                  onChange={handleChange}
                />
                {t("registration.elevators")}
              </label>

              <label>
                <input
                  type="checkbox"
                  name="needs.toilets"
                  checked={formData.needs.toilets}
                  onChange={handleChange}
                />
                {t("registration.toilets")}
              </label>

              <label>
                <input
                  type="checkbox"
                  name="needs.accessible_parking"
                  checked={formData.needs.accessible_parking}
                  onChange={handleChange}
                />
                {t("registration.accessibleParking")}
              </label>

              <div>
                <p>{t("registration.themeTitle")}</p>

                <label>
                  <input
                    type="radio"
                    name="needs.theme"
                    value="system"
                    checked={formData.needs.theme === "system"}
                    onChange={handleChange}
                  />
                  {t("registration.themeSystem")}
                </label>

                <label>
                  <input
                    type="radio"
                    name="needs.theme"
                    value="light"
                    checked={formData.needs.theme === "light"}
                    onChange={handleChange}
                  />
                  {t("registration.themeLight")}
                </label>

                <label>
                  <input
                    type="radio"
                    name="needs.theme"
                    value="dark"
                    checked={formData.needs.theme === "dark"}
                    onChange={handleChange}
                  />
                  {t("registration.themeDark")}
                </label>
              </div>
            </fieldset>

            <button type="submit" disabled={status.state === "loading"}>
              {status.state === "loading"
                ? t("registration.loading")
                : t("registration.createAccount")}
            </button>

            <button
              type="button"
              aria-label={t("registration.ariaBack", { step: 1, total: 2 })}
              onClick={() => {
                setStatus({ state: "idle", message: "" });
                setStep(1);
              }}
            >
              {t("registration.back")}
            </button>
          </>
        )}
      </form>

      {status.state === "error" && <p className="error-message">{status.message}</p>}
      {status.state === "success" && <p className="success-message">{status.message}</p>}
    </>
  );
}