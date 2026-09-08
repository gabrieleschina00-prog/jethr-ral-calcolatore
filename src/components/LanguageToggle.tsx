import type { Lang } from '../i18n/translations'
import './LanguageToggle.css'

interface LanguageToggleProps {
  lang: Lang
  switchLabel: string
  onToggle: () => void
}

export function LanguageToggle({ lang, switchLabel, onToggle }: LanguageToggleProps) {
  const target = lang === 'it' ? 'EN' : 'IT'

  return (
    <button type="button" className="language-toggle" onClick={onToggle} aria-label={switchLabel} title={switchLabel}>
      {target}
    </button>
  )
}
