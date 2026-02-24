import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { LanguageSwitcher } from "./LanguageSwitcher"
import "./Header.css"

export default function Header() {
  const { t } = useTranslation("common")

  return (
    <header className="an-header">
      <div className="an-container">
        <h1 className="brand">
          <Link to="/" className="brand-link">
            {t("header.brand")}
          </Link>
        </h1>

        <div className="nav-right">
          <nav className="nav-links" aria-label="Primary">
            <Link to="/help">{t("header.help")}</Link>
            <Link to="/login">{t("header.login")}</Link>
          </nav>

          <LanguageSwitcher />

          <Link to="/registration" className="nav-cta">
            {t("header.signup")}
          </Link>
        </div>
      </div>
    </header>
  )
}