import { Link, useNavigate } from "react-router-dom"
import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { LanguageSwitcher } from "./LanguageSwitcher"
import "./Header.css"

export default function Header() {
  const { t } = useTranslation("common")
  const navigate = useNavigate()

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"))

  useEffect(() => {
    function syncAuth() {
      setIsLoggedIn(!!localStorage.getItem("token"))
    }
    window.addEventListener("storage", syncAuth)
    window.addEventListener("auth-change", syncAuth)
    return () => {
      window.removeEventListener("storage", syncAuth)
      window.removeEventListener("auth-change", syncAuth)
    }
  }, [])

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsLoggedIn(false) 
    navigate("/login")
  }

  return (
    <header className="an-header">
      <div className="an-container">
        <h1 className="brand">
          <Link 
            to="/" 
            className="brand-link"
            aria-label={t("header.home")}
          >
            {t("header.brand")}
          </Link>
        </h1>

        <div className="nav-right">
          <nav className="nav-links" aria-label="Primary">
            <Link to="/help">{t("header.help")}</Link>
            {isLoggedIn ? (
              <button 
                type="button"
                onClick={logout} 
                className="nav-link-button"
                >
                {t("header.logout")}
              </button>
            ) : (
              <Link to="/login">{t("header.login")}</Link>
            )}
          </nav>

          <LanguageSwitcher />

          {!isLoggedIn && (
            <Link to="/registration" className="nav-cta">
              {t("header.signup")}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
