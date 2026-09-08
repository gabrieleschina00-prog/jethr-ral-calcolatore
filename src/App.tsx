import { useEffect, useMemo, useState } from 'react'
import { calculateNetSalary } from './calculation/taxEngine'
import { MENSILITA_DEFAULT, MENSILITA_OPZIONI, type Mensilita } from './calculation/constants'
import { BreakfastIndex } from './components/BreakfastIndex'
import { CompareRal } from './components/CompareRal'
import { DataCards } from './components/DataCards'
import { ExploreButton } from './components/ExploreButton'
import { IconLinkButton } from './components/IconLinkButton'
import { LanguageToggle } from './components/LanguageToggle'
import { ProductNote } from './components/ProductNote'
import { RegionalNote } from './components/RegionalNote'
import { ResultPanel } from './components/ResultPanel'
import { SalaryInput } from './components/SalaryInput'
import { SegmentedToggle } from './components/SegmentedToggle'
import { ShareButton } from './components/ShareButton'
import { ThemeToggle } from './components/ThemeToggle'
import { WaterfallChart } from './components/WaterfallChart'
import { useLanguage } from './i18n/useLanguage'
import { useTheme } from './useTheme'
import './App.css'

const RAL_INIZIALE = 25_000
const BREAKDOWN_SECTION_ID = 'breakdown-section'
// Su mobile "Esplora il breakdown" scrolla qui invece che alla sezione grafico: il pannello
// del netto resta in cima allo schermo, con il percorso di calcolo che parte subito sotto.
const RESULT_SECTION_ID = 'result-section'

/** Legge RAL, mensilità e confronto da un link condiviso (vedi ShareButton), se presenti
 * e validi — così aprire un link copiato ricrea la stessa simulazione. Chiamata una sola
 * volta, allo stato iniziale: cambi successivi ai parametri in URL non vengono più letti. */
function leggiStatoIniziale(): { ral: number; mensilita: Mensilita; ralConfronto: number | null } {
  const parametri = new URLSearchParams(window.location.search)

  const ralParam = Number(parametri.get('ral'))
  const ral = Number.isFinite(ralParam) && ralParam > 0 ? ralParam : RAL_INIZIALE

  const mParam = Number(parametri.get('m')) as Mensilita
  const mensilita = MENSILITA_OPZIONI.includes(mParam) ? mParam : MENSILITA_DEFAULT

  const compareParam = Number(parametri.get('compare'))
  const ralConfronto = Number.isFinite(compareParam) && compareParam > 0 ? compareParam : null

  return { ral, mensilita, ralConfronto }
}

export default function App() {
  const [statoIniziale] = useState(leggiStatoIniziale)
  const [ral, setRal] = useState(statoIniziale.ral)
  const [mensilita, setMensilita] = useState<Mensilita>(statoIniziale.mensilita)
  const [ralConfronto, setRalConfronto] = useState<number | null>(statoIniziale.ralConfronto)
  // true = il waterfall sotto mostra la scomposizione della RAL di confronto invece di
  // quella attuale — scelto col toggle sopra il grafico (visibile solo col confronto
  // attivo). Si disattiva da sé se il confronto viene rimosso.
  const [esploraConfronto, setEsploraConfronto] = useState(false)
  const { theme, toggle: toggleTheme } = useTheme()
  const { lang, t, toggle: toggleLanguage } = useLanguage()

  useEffect(() => {
    if (ralConfronto === null) setEsploraConfronto(false)
  }, [ralConfronto])

  // Il risultato è sempre live: nessun pulsante "Calcola" da premere, ogni modifica
  // alla RAL o alla mensilità aggiorna subito il netto. Il confronto (se attivo) è un
  // secondo calcolo indipendente, con la stessa mensilità del profilo principale.
  const result = useMemo(() => calculateNetSalary(ral, mensilita), [ral, mensilita])
  const compareResult = useMemo(
    () => (ralConfronto !== null ? calculateNetSalary(ralConfronto, mensilita) : null),
    [ralConfronto, mensilita],
  )
  const waterfallResult = esploraConfronto && compareResult ? compareResult : result

  return (
    <div className="page">
      <header className="page__header">
        <div className="page__header-text">
          <h1 className="page__title">
            <span className="page__title-line">{t.header.titlePrefix}</span>
            <span className="page__title-line">
              <span className="page__title-emphasis">{t.header.titleEmphasis}</span> {t.header.titleEmoji}
            </span>
          </h1>
          <p className="page__subtitle">{t.header.subtitle}</p>
        </div>
        <div className="page__header-actions">
          <LanguageToggle lang={lang} switchLabel={t.language.switchLabel} onToggle={toggleLanguage} />
          <ThemeToggle theme={theme} onToggle={toggleTheme} t={t.theme} />
        </div>
      </header>

      <main className="calculator">
        <section className="calculator__panel calculator__panel--input" aria-label={t.salaryInput.label}>
          <SalaryInput
            value={ral}
            onChange={setRal}
            label={t.salaryInput.label}
            sliderAriaLabel={t.salaryInput.sliderAriaLabel}
            stepDownLabel={t.compare.stepDown}
            stepUpLabel={t.compare.stepUp}
          />

          <div className="mensilita-field">
            <span className="mensilita-field__label">{t.mensilita.label}</span>
            <SegmentedToggle
              ariaLabel={t.mensilita.ariaLabel}
              value={String(mensilita)}
              onChange={(v) => setMensilita(Number(v) as Mensilita)}
              options={MENSILITA_OPZIONI.map((m) => ({ value: String(m), label: String(m) }))}
            />
          </div>

          <CompareRal value={ralConfronto} onChange={setRalConfronto} baseRal={ral} t={t.compare} />

          <ExploreButton
            targetId={BREAKDOWN_SECTION_ID}
            mobileTargetId={RESULT_SECTION_ID}
            label={t.explore.cta}
          />
        </section>

        <section
          id={RESULT_SECTION_ID}
          className="calculator__panel calculator__panel--result"
          aria-label={t.result.eyebrow}
        >
          <span className="result-eyebrow">{t.result.eyebrow}</span>
          <div className="result-split">
            <ResultPanel result={result} compareResult={compareResult} t={t.result} compareT={t.compare} />
            <BreakfastIndex result={result} compareResult={compareResult} t={t.breakfast} />
          </div>
          <ShareButton
            className="result-share"
            ral={ral}
            mensilita={mensilita}
            ralConfronto={ralConfronto}
            t={t.share}
          />
        </section>

        <section
          id={BREAKDOWN_SECTION_ID}
          className="calculator__panel calculator__panel--wide"
          aria-label={t.waterfall.sectionTitle}
        >
          <div className="calculator__section-heading">
            <h2 className="calculator__section-title">{t.waterfall.sectionTitle}</h2>
            {compareResult && (
              <SegmentedToggle
                ariaLabel={t.waterfall.focusAriaLabel}
                value={esploraConfronto ? 'confronto' : 'attuale'}
                onChange={(v) => setEsploraConfronto(v === 'confronto')}
                options={[
                  { value: 'attuale', label: t.waterfall.focusCurrent },
                  { value: 'confronto', label: t.waterfall.focusCompare },
                ]}
              />
            )}
          </div>
          <WaterfallChart result={waterfallResult} t={t.waterfall} />
        </section>

        <section className="calculator__panel calculator__panel--wide" aria-label={t.dataCards.title}>
          <DataCards t={t.dataCards} bracketsT={t.waterfall.brackets} />
          <RegionalNote t={t.regionalNote} />
        </section>
      </main>

      <footer className="page__footer">
        <ProductNote t={t.productNote} />

        <div className="page__social">
          <span className="page__social-label">{t.social.label}</span>
          <div className="page__social-links">
            <IconLinkButton href="https://www.linkedin.com/in/gabriele-schina" label="LinkedIn">
              in
            </IconLinkButton>
            <IconLinkButton href="https://gabrischina10.github.io/webpage/" label="Portfolio">
              🌐
            </IconLinkButton>
          </div>
        </div>
      </footer>
    </div>
  )
}
