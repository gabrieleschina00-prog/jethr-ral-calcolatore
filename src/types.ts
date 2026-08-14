// Tipi condivisi tra il motore di calcolo (calculation/) e l'interfaccia (components/).
// Nessuna logica qui: solo la forma dei dati che circolano tra i due layer.

/** Una singola voce del percorso RAL -> netto, usata sia dal pannello dettagli sia dal waterfall chart. */
export interface CalculationStep {
  /** Chiave stabile per key React / lookup, es. "inps", "irpefNetta". */
  id: string
  /** Etichetta mostrata in UI, es. "Contributi INPS". */
  label: string
  /** Breve spiegazione del perché questa voce esiste / come è calcolata. */
  description: string
  /**
   * Categoria fissa della voce, indipendente dal fatto che valga zero per questa RAL
   * (es. l'addizionale comunale resta una "trattenuta" anche quando è zero sotto soglia).
   * "totale" = RAL/netto, ancorati a zero; "trattenuta"/"sgravio" = variazioni intermedie.
   */
  kind: 'totale' | 'trattenuta' | 'sgravio'
  /**
   * Variazione rispetto al valore precedente nella catena.
   * Negativo per le trattenute (IRPEF, addizionali, INPS), positivo per le voci
   * che aumentano il netto (es. la somma integrativa del cuneo fiscale).
   */
  delta: number
  /** Valore cumulativo dopo l'applicazione di questa voce (usato per il waterfall). */
  runningTotal: number
}

/** Risultato completo del calcolo per una data RAL: ogni valore intermedio, nominato. */
export interface CalculationResult {
  ral: number
  mensilita: number

  contributiInps: number
  imponibileFiscale: number

  irpefLorda: number
  detrazioneLavoroDipendente: number
  sommaIntegrativa: number
  ulterioreDetrazione: number
  irpefNetta: number

  addizionaleRegionale: number
  addizionaleComunale: number

  caricoFiscaleTotale: number
  nettoAnnuo: number
  nettoMensile: number

  /** Percorso passo-passo pronto per il pannello dettagli e il waterfall chart. */
  steps: CalculationStep[]
}
