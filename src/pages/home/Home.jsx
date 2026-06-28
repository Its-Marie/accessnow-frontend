import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  IconWheelchair,
  IconArrowsExchange2,
  IconRoute,
  IconCurrentLocation,
  IconMapPin,
  IconFlag,
} from "@tabler/icons-react"
import "./Home.css"

const CHIPS = [
  { id: "wheelchair", labelKey: "home.form.chips.wheelchair", Icon: IconWheelchair },
  { id: "noStairs",   labelKey: "home.form.chips.noStairs",   Icon: null },
  { id: "stroller",   labelKey: "home.form.chips.stroller",   Icon: null },
  { id: "slowPace",   labelKey: "home.form.chips.slowPace",   Icon: null },
]

export default function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation("common")

  const [start, setStart] = useState("")
  const [destination, setDestination] = useState("")
  const [activeChips, setActiveChips] = useState({
    wheelchair: false,
    noStairs: false,
    stroller: false,
    slowPace: false,
  })

  function toggleChip(id) {
    setActiveChips(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function swapInputs() {
    setStart(destination)
    setDestination(start)
  }

  function handlePlanRoute(e) {
    e.preventDefault()
    navigate(
      `/map?start=${encodeURIComponent(start)}&destination=${encodeURIComponent(destination)}`
    )
  }

  function handleHeroImageError(event) {
    event.currentTarget.src = "/assets/hero-accessible-city-fallback.svg"
    event.currentTarget.alt = t("home.hero.imageFallbackAlt")
  }

  return (
    <>
      <main id="main-content" className="landing" aria-labelledby="landing-title">
        <section className="landing-hero">
          <div className="hero-copy">
            <p className="eyebrow" aria-label="AccessNow Plus">{t("home.eyebrow")}</p>
            <h1 id="landing-title">{t("home.title")}</h1>
            <p className="lede">{t("home.lede")}</p>

            <form
              className="route-form"
              onSubmit={handlePlanRoute}
              aria-label={t("home.form.ariaLabel")}
            >
              {/* Mobility profile chips */}
              <div className="chips-block">
                <p id="chips-label" className="form-chips-label">
                  {t("home.form.mobilityProfile")}
                </p>
                <div
                  className="form-chips"
                  role="group"
                  aria-labelledby="chips-label"
                >
                  {CHIPS.map(({ id, labelKey, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      role="button"
                      className={`chip${activeChips[id] ? " chip--active" : ""}`}
                      aria-pressed={activeChips[id]}
                      onClick={() => toggleChip(id)}
                    >
                      {Icon && <Icon size={14} aria-hidden="true" />}
                      {t(labelKey)}
                    </button>
                  ))}
                </div>
              </div>

              {/* From */}
              <div className="form-field">
                <label htmlFor="start" className="input-label">
                  {t("home.form.fromLabel")}
                </label>
                <div className="input-wrapper">
                  <IconMapPin size={16} className="input-icon input-icon--pin" aria-hidden="true" />
                  <input
                    id="start"
                    name="start"
                    type="text"
                    value={start}
                    onChange={e => setStart(e.target.value)}
                    placeholder={t("home.form.startPlaceholder")}
                    autoComplete="street-address"
                    required
                  />
                  <button
                    type="button"
                    className="gps-btn"
                    aria-label={t("home.form.gpsLabel")}
                  >
                    <IconCurrentLocation size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Swap */}
              <div className="swap-row">
                <div className="swap-line" aria-hidden="true" />
                <button
                  type="button"
                  className="swap-btn"
                  aria-label={t("home.form.swapLabel")}
                  onClick={swapInputs}
                >
                  <IconArrowsExchange2 size={14} aria-hidden="true" />
                </button>
              </div>

              {/* To */}
              <div className="form-field">
                <label htmlFor="destination" className="input-label">
                  {t("home.form.toLabel")}
                </label>
                <div className="input-wrapper">
                  <IconFlag size={16} className="input-icon input-icon--flag" aria-hidden="true" />
                  <input
                    id="destination"
                    name="destination"
                    type="text"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    placeholder={t("home.form.destinationPlaceholder")}
                    autoComplete="street-address"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="btn-primary">
                <IconRoute size={16} aria-hidden="true" />
                {t("home.form.submit")}
              </button>

              {/* Secondary link */}
              <Link to="/login" className="login-link">
                {t("home.form.loginTrips")}
              </Link>
            </form>

            <div className="hero-footnote">{t("home.wcag")}</div>
          </div>

          <figure className="hero-visual">
            <div className="visual-frame">
              <img
                className="hero-image"
                src="/assets/hero-accessible-city.jpg.png"
                alt={t("home.hero.imageAlt")}
                loading="lazy"
                onError={handleHeroImageError}
              />
            </div>
            <figcaption className="visually-hidden">
              {t("home.hero.figcaption")}
            </figcaption>
          </figure>
        </section>

        <section className="feature-grid" aria-label={t("home.highlights.ariaLabel")}>
          <article className="feature-card">
            <p className="eyebrow">{t("home.highlights.easy.eyebrow")}</p>
            <h2>{t("home.highlights.easy.title")}</h2>
            <p>{t("home.highlights.easy.text")}</p>
          </article>

          <article className="feature-card">
            <p className="eyebrow">{t("home.highlights.flex.eyebrow")}</p>
            <h2>{t("home.highlights.flex.title")}</h2>
            <p>{t("home.highlights.flex.text")}</p>
          </article>

          <article className="feature-card feature-card--steps">
            <p className="eyebrow">{t("home.highlights.steps.eyebrow")}</p>
            <h2>{t("home.highlights.steps.title")}</h2>
            <ol className="feature-steps">
              <li>{t("home.highlights.steps.items.0")}</li>
              <li>{t("home.highlights.steps.items.1")}</li>
              <li>{t("home.highlights.steps.items.2")}</li>
            </ol>
          </article>
        </section>
      </main>
    </>
  )
}
