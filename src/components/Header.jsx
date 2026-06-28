import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { IconWheelchair, IconMenu2 } from "@tabler/icons-react"
import { LanguageSwitcher } from "./LanguageSwitcher"
import "./Header.css"

export default function Header() {
  const { t } = useTranslation("common")
  const navigate = useNavigate()
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)
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
    <>
      <a href="#main-content" className="skip-link">{t("header.skipLink")}</a>
      <header className="an-header" role="banner">

        {/* Logo */}
        <Link to="/" className="an-logo" aria-label={t("header.home")}>
          <span className="an-logo__icon" aria-hidden="true">
            <IconWheelchair size={16} />
          </span>
          <span className="an-logo__text">{t("header.brand")}</span>
        </Link>

        {/* Nav */}
        <nav className="an-nav" aria-label={t("header.navLabel")}>
          <Link
            to="/help"
            className="an-nav__link"
            aria-current={location.pathname === "/help" ? "page" : undefined}
          >
            {t("header.help")}
          </Link>
          {isLoggedIn ? (
            <button type="button" className="an-nav__link an-nav__btn" onClick={logout}>
              {t("header.logout")}
            </button>
          ) : (
            <Link
              to="/login"
              className="an-nav__link"
              aria-current={location.pathname === "/login" ? "page" : undefined}
            >
              {t("header.login")}
            </Link>
          )}
        </nav>

        {/* Right side: language switcher + CTA + hamburger */}
        <div className="an-header__right">
          <LanguageSwitcher />

          {!isLoggedIn && (
            <button
              type="button"
              className="an-cta"
              aria-label={t("header.ctaAriaLabel")}
              onClick={() => navigate("/registration")}
            >
              {t("header.cta")}
            </button>
          )}

          <button
            type="button"
            className="an-hamburger"
            aria-label={menuOpen ? t("header.menuClose") : t("header.menuOpen")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(prev => !prev)}
          >
            <IconMenu2 size={22} aria-hidden="true" />
          </button>
        </div>

      </header>
    </>
  )
}
