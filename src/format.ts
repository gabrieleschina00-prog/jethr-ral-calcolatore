// Helper di formattazione condivisi — nessuna logica di calcolo qui, solo presentazione.

const euroInteroFormatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const euroDecimaleFormatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

const migliaiaFormatter = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 0 })

export function formatEuro(value: number): string {
  return euroInteroFormatter.format(Math.round(value))
}

export function formatEuroDecimale(value: number): string {
  return euroDecimaleFormatter.format(value)
}

/** Formatta un numero con i separatori delle migliaia italiani, senza simbolo di valuta —
 * usato nel campo di input della RAL. */
export function formatMigliaia(value: number): string {
  return migliaiaFormatter.format(value)
}

/** Converte il testo digitato nell'input RAL in un numero, ignorando separatori e simboli. */
export function parseImportoDigitato(testo: string): number {
  const pulito = testo.replace(/[^\d]/g, '')
  return pulito ? Number(pulito) : 0
}
