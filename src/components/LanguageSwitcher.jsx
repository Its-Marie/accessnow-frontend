import i18n from "i18next"

const LANGS = [
  { code: "de", label: "DE" },
  { code: "en", label: "EN" },
]

export function LanguageSwitcher() {
  const current = (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2)

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      {LANGS.map((l) => {
        const active = current === l.code

        return (
          <button
            key={l.code}
            type="button"
            className={`lang-toggle__btn ${active ? "is-active" : ""}`}
            onClick={() => i18n.changeLanguage(l.code)}
            aria-pressed={active}
          >
            {l.label}
          </button>
        )
      })}
    </div>
  )
}