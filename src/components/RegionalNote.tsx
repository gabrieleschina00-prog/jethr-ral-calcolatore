import type { RichSegment, Translations } from '../i18n/translations'
import './RegionalNote.css'

interface RegionalNoteProps {
  t: Translations['regionalNote']
}

function RichText({ segments }: { segments: RichSegment[] }) {
  return (
    <>
      {segments.map((seg, i) =>
        typeof seg === 'string' ? (
          seg
        ) : (
          <strong key={i} className={seg.accent ? 'regional-note__em-accent' : undefined}>
            {seg.b}
          </strong>
        ),
      )}
    </>
  )
}

/** Il calcolo è tarato su Milano: questa nota isola cosa cambierebbe altrove, con le
 * aliquote ufficiali (min/max nazionali) come riferimento, non un'approssimazione a
 * memoria — vedi le fonti in fondo. La stima finale (l'unica con numeri concreti) ha un
 * trattamento visivo distinto: è la riga che risponde davvero a "quanto cambia". */
export function RegionalNote({ t }: RegionalNoteProps) {
  return (
    <div className="regional-note">
      <span className="regional-note__title">{t.title}</span>
      <p className="regional-note__text">
        <RichText segments={t.intro} />
      </p>
      <p className="regional-note__text">
        <RichText segments={t.rates} />
      </p>
      <p className="regional-note__estimate">
        <RichText segments={t.estimate} />
      </p>
      <p className="regional-note__sources">
        {t.sourcesLabel}:{' '}
        <a
          href="https://www.finanze.gov.it/it/fiscalita/fiscalita-regionale-e-locale/Addizionale-regionale-allIRPEF/disciplina-del-tributo/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dipartimento delle Finanze — addizionale regionale
        </a>{' '}
        {t.and}{' '}
        <a
          href="https://www.finanze.gov.it/it/fiscalita/fiscalita-regionale-e-locale/Addizionale-comunale-allIRPEF/disciplina-del-tributo/"
          target="_blank"
          rel="noopener noreferrer"
        >
          addizionale comunale
        </a>
        .
      </p>
    </div>
  )
}
