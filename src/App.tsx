import { useMemo, useState } from 'react'
import { calculateNetSalary } from './calculation/taxEngine'
import { MENSILITA_DEFAULT, MENSILITA_OPZIONI, type Mensilita } from './calculation/constants'
import { BreakfastIndex } from './components/BreakfastIndex'
import { ExploreButton } from './components/ExploreButton'
import { ProductNote } from './components/ProductNote'
import { ResultPanel } from './components/ResultPanel'
import { SalaryInput } from './components/SalaryInput'
import { SegmentedToggle } from './components/SegmentedToggle'
import { ThemeToggle } from './components/ThemeToggle'
import { WaterfallChart } from './components/WaterfallChart'
import { useTheme } from './useTheme'
import './App.css'

const RAL_INIZIALE = 25_000
const BREAKDOWN_SECTION_ID = 'breakdown-section'

export default function App() {
  const [ral, setRal] = useState(RAL_INIZIALE)
  const [mensilita, setMensilita] = useState<Mensilita>(MENSILITA_DEFAULT)
  const { theme, toggle: toggleTheme } = useTheme()

  // Il risultato è sempre live: nessun pulsante "Calcola" da premere, ogni modifica
  // alla RAL o alla mensilità aggiorna subito il netto.
  const result = useMemo(() => calculateNetSalary(ral, mensilita), [ral, mensilita])

  return (
    <div className="page">
      <header className="page__header">
        <div className="page__header-text">
          <p className="page__eyebrow">Assignment — Gabriele Schina × JetHR</p>
          <h1 className="page__title">Quanto resta davvero della tua RAL?</h1>
          <p className="page__subtitle">
            Inserisci la RAL, scopri il netto e capisci dove va a finire ogni singolo euro della tua busta paga.
          </p>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <main className="calculator">
        <section className="calculator__panel calculator__panel--input" aria-label="Dati in ingresso">
          <SalaryInput value={ral} onChange={setRal} />

          <div className="mensilita-field">
            <span className="mensilita-field__label">Mensilità</span>
            <SegmentedToggle
              ariaLabel="Numero di mensilità"
              value={String(mensilita)}
              onChange={(v) => setMensilita(Number(v) as Mensilita)}
              options={MENSILITA_OPZIONI.map((m) => ({ value: String(m), label: String(m) }))}
            />
          </div>

          <ExploreButton targetId={BREAKDOWN_SECTION_ID} />
        </section>

        <section className="calculator__panel calculator__panel--result" aria-label="Risultato">
          <span className="result-eyebrow">Stipendio netto</span>
          <div className="result-split">
            <ResultPanel result={result} />
            <BreakfastIndex result={result} />
          </div>
        </section>

        <section
          id={BREAKDOWN_SECTION_ID}
          className="calculator__panel calculator__panel--wide"
          aria-label="Percorso di calcolo"
        >
          <h2 className="calculator__section-title">Dalla RAL al netto, passo dopo passo</h2>
          <WaterfallChart result={result} />
        </section>
      </main>

      <footer className="page__footer">
        <ProductNote />
      </footer>
    </div>
  )
}
