import type { Translations } from '../i18n/translations'
import './ProductNote.css'

interface ProductNoteProps {
  t: Translations['productNote']
}

/** La nota di trasparenza del prototipo: chiusa per default, un solo click la apre tutta.
 * I nomi ufficiali delle circolari citate come fonte restano in italiano in entrambe le
 * lingue, come si farebbe con il titolo di un documento ufficiale straniero. */
export function ProductNote({ t }: ProductNoteProps) {
  return (
    <details className="product-note">
      <summary className="product-note__summary">{t.summary}</summary>
      <ul className="product-note__list">
        {t.items.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong> {item.body}
            {item.source && (
              <span className="product-note__fonti">
                {t.sourcesLabel}:{' '}
                {item.source.map((s, si, arr) => (
                  <span key={s.url}>
                    {si > 0 && (si === arr.length - 1 ? ` ${t.and} ` : ', ')}
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  </span>
                ))}
                .
              </span>
            )}
          </li>
        ))}
      </ul>
      <span className="product-note__updated">{t.updated}</span>
    </details>
  )
}
