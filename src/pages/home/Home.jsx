import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import "./Home.css"

export default function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation("common")

  function handlePlanRoute(e) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const start = formData.get("start")
    const destination = formData.get("destination")

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
              <div className="form-field">
                <label htmlFor="start">{t("home.form.startLabel")}</label>
                <input
                  id="start"
                  name="start"
                  type="text"
                  placeholder={t("home.form.startPlaceholder")}
                  autoComplete="street-address"
                  aria-describedby="start-help"
                  required
                />
                <p id="start-help" className="field-help">
                  {t("home.form.startHelp")}
                </p>
              </div>

              <div className="form-field">
                <label htmlFor="destination">{t("home.form.destinationLabel")}</label>
                <input
                  id="destination"
                  name="destination"
                  type="text"
                  placeholder={t("home.form.destinationPlaceholder")}
                  autoComplete="street-address"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit">{t("home.form.submit")}</button>
                <Link to="/login" className="ghost-button">
                  {t("home.form.loginTrips")}
                </Link>
              </div>
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