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
const percentualeFormatter = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 2 })
const percentualeUnaDecimaleFormatter = new Intl.NumberFormat('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export function formatEuro(value: number): string {
  return euroInteroFormatter.format(Math.round(value))
}

export function formatEuroDecimale(value: number): string {
  return euroDecimaleFormatter.format(value)
}

/** Formatta una variazione (delta) in euro con il segno esplicito — usato dal confronto tra
 * due RAL, mai dal motore di calcolo. */
export function formatEuroConSegno(value: number): string {
  const segno = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${segno}${formatEuro(Math.abs(value))}`
}

/** Percentuale con segno esplicito e una sola decimale — usata dal confronto tra due RAL. */
export function formatPercentualeConSegno(value: number): string {
  const segno = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${segno}${percentualeUnaDecimaleFormatter.format(Math.abs(value))}%`
}

/** Formatta un'aliquota (0.0119 -> "1,19%") per la scomposizione a scaglioni nel waterfall. */
export function formatAliquota(value: number): string {
  return `${percentualeFormatter.format(value * 100)}%`
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
