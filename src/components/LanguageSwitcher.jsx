import i18n from "i18next"

const LANGS = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
]

export function LanguageSwitcher() {
  const current = i18n.resolvedLanguage || i18n.language

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {LANGS.map((l) => {
        const active = current?.startsWith(l.code)

        return (
          <button
            key={l.code}
            type="button"
            onClick={() => i18n.changeLanguage(l.code)}
            aria-pressed={active}
            style={{
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.35)",
              background: "transparent",
              color: "inherit",
              cursor: "pointer",
              fontWeight: active ? 700 : 400,
              opacity: active ? 1 : 0.8,
            }}
          >
            {l.label}
          </button>
        )
      })}
    </div>
  )
}