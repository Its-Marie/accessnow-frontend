import { useTranslation } from "react-i18next"
import { IconChevronRight } from "@tabler/icons-react"
import "./FeatureCard.css"

export default function FeatureCard({ icon: Icon, iconColor, containerBg, title, description, linkColor, learnMoreAriaLabel }) {
  const { t } = useTranslation("common")

  return (
    <article className="feature-card" role="article">
      <div className="feature-card__icon" style={{ background: containerBg }} aria-hidden="true">
        <Icon size={20} color={iconColor} aria-hidden="true" />
      </div>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__desc">{description}</p>
      <a
        href="#"
        className="feature-card__link"
        style={{ color: linkColor }}
        aria-label={learnMoreAriaLabel}
      >
        {t("home.features.learnMore")}
        <IconChevronRight size={12} aria-hidden="true" />
      </a>
    </article>
  )
}
