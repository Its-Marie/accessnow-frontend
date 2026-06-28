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
  IconElevator,
  IconEye,
  IconBabyCarriage,
} from "@tabler/icons-react"
import FeatureCard from "../../components/FeatureCard"
import "./Home.css"

const FEATURES = [
  {
    id: "stepFree",
    icon: IconWheelchair,
    iconColor: "#0f6e56",
    containerBg: "#e6f4ef",
    titleKey: "home.features.stepFree.title",
    descriptionKey: "home.features.stepFree.description",
    linkColor: "#0f6e56",
  },
  {
    id: "elevator",
    icon: IconElevator,
    iconColor: "#854f0b",
    containerBg: "#fff4e6",
    titleKey: "home.features.elevator.title",
    descriptionKey: "home.features.elevator.description",
    linkColor: "#854f0b",
  },
  {
    id: "navigation",
    icon: IconEye,
    iconColor: "#185fa5",
    containerBg: "#e6f1fb",
    titleKey: "home.features.navigation.title",
    descriptionKey: "home.features.navigation.description",
    linkColor: "#185fa5",
  },
  {
    id: "journey",
    icon: IconBabyCarriage,
    iconColor: "#993556",
    containerBg: "#fbeaf0",
    titleKey: "home.features.journey.title",
    descriptionKey: "home.features.journey.description",
    linkColor: "#993556",
  },
]

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
        <section className="hero">
          <div className="hero-left">
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

          <div className="hero-right">
            <img
              src="/assets/hero-accessible-city.jpg.png"
              alt={t("home.hero.imageAlt")}
              loading="lazy"
              onError={handleHeroImageError}
            />
          </div>
        </section>

        <section className="features-section" aria-labelledby="features-title">
          <h2 id="features-title" className="features-title">
            {t("home.features.sectionTitle")}
          </h2>
          <div className="features-grid">
            {FEATURES.map(({ id, icon, iconColor, containerBg, titleKey, descriptionKey, linkColor }) => (
              <FeatureCard
                key={id}
                icon={icon}
                iconColor={iconColor}
                containerBg={containerBg}
                title={t(titleKey)}
                description={t(descriptionKey)}
                linkColor={linkColor}
                learnMoreAriaLabel={t("home.features.learnMoreAbout", { title: t(titleKey) })}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
