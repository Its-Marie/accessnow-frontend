import i18n from "i18next"
import { useTranslation } from "react-i18next"

const LANGS = [
  { code: "de", label: "DE", fullName: "Deutsch" },
  { code: "en", label: "EN", fullName: "English" },
]

export function LanguageSwitcher() {
  const { t } = useTranslation("common")
  const current = (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2)

  return (
    <div className="lang-toggle" role="group" aria-label={t("header.languageGroup")}>
      {LANGS.map((l) => {
        const active = current === l.code

        return (
          <button
            key={l.code}
            type="button"
            className={`lang-toggle__btn ${active ? "is-active" : ""}`}
            onClick={() => i18n.changeLanguage(l.code)}
            aria-label={l.fullName}
            aria-pressed={active}
          >
            {l.label}
          </button>
        )
      })}
    </div>
  )
}