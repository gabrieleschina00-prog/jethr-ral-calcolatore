import type { Translations } from '../i18n/translations'
import type { Theme } from '../useTheme'
import './ThemeToggle.css'

interface ThemeToggleProps {
  theme: Theme
  onToggle: () => void
  t: Translations['theme']
}

export function ThemeToggle({ theme, onToggle, t }: ThemeToggleProps) {
  const isDark = theme === 'dark'
  const label = isDark ? t.toLight : t.toDark

  return (
    <button type="button" className="theme-toggle" onClick={onToggle} aria-label={label} title={label}>
      <span aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
    </button>
  )
}
