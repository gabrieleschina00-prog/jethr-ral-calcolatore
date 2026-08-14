/**
 * Motore di calcolo RAL -> netto. Funzione pura, nessuna dipendenza da React o dal DOM:
 * dato un numero (la RAL) ritorna un oggetto con ogni passaggio intermedio nominato.
 *
 * La catena di calcolo segue l'ordine:
 * RAL -> contributi INPS -> imponibile fiscale -> IRPEF a scaglioni -> detrazioni da lavoro
 * dipendente -> addizionale regionale Lombardia -> addizionale comunale Milano -> netto.
 *
 * Il "reddito complessivo" (RC) usato dalle norme fiscali per individuare detrazioni e
 * scaglioni è qui approssimato all'imponibile fiscale, dato che nel prototipo la RAL è
 * l'unica fonte di reddito e non ci sono altri oneri deducibili
 */

import {
  ADDIZIONALE_COMUNALE_MILANO,
  CUNEO_FISCALE,
  DETRAZIONE_LAVORO_DIPENDENTE,
  INPS_ALIQUOTA_DIPENDENTE,
  MENSILITA_DEFAULT,
  SCAGLIONI_ADDIZIONALE_REGIONALE_LOMBARDIA,
  SCAGLIONI_IRPEF,
  type Mensilita,
} from './constants'
import type { CalculationResult, CalculationStep } from '../types'

/** Applica uno schema di scaglioni marginali (come l'IRPEF): ogni aliquota si paga solo
 * sulla porzione di base compresa nel proprio scaglione, non sull'intera base. */
function applicaScaglioniMarginali(base: number, scaglioni: readonly { fino: number; aliquota: number }[]): number {
  let imposta = 0
  let sogliaPrecedente = 0

  for (const { fino, aliquota } of scaglioni) {
    if (base <= sogliaPrecedente) break
    const porzioneInScaglione = Math.min(base, fino) - sogliaPrecedente
    imposta += porzioneInScaglione * aliquota
    sogliaPrecedente = fino
  }

  return imposta
}

/** Detrazione da lavoro dipendente (art. 13 c.1 TUIR) — vedi commenti in constants.ts. */
function calcolaDetrazioneLavoroDipendente(redditoComplessivo: number): number {
  const d = DETRAZIONE_LAVORO_DIPENDENTE
  let base: number

  if (redditoComplessivo <= d.sogliaBassa) {
    base = d.importoFisso
  } else if (redditoComplessivo <= d.sogliaMedia) {
    base = d.baseMedia + d.coefficienteMedia * ((d.sogliaMedia - redditoComplessivo) / (d.sogliaMedia - d.sogliaBassa))
  } else if (redditoComplessivo <= d.sogliaAlta) {
    base = d.baseAlta * ((d.sogliaAlta - redditoComplessivo) / (d.sogliaAlta - d.sogliaMedia))
  } else {
    base = 0
  }

  const haBonus = redditoComplessivo > d.bonusAggiuntivo.min && redditoComplessivo <= d.bonusAggiuntivo.max
  return Math.max(0, base) + (haBonus ? d.bonusAggiuntivo.importo : 0)
}

/** Somma integrativa non imponibile del cuneo fiscale, per RC fino a 20.000€.
 * Percentuale unica (non marginale) individuata dallo scaglione in cui rientra il reddito. */
function calcolaSommaIntegrativa(redditoLavoroDipendente: number): number {
  const { sogliaMassima, scaglioni } = CUNEO_FISCALE.sommaIntegrativa
  if (redditoLavoroDipendente <= 0 || redditoLavoroDipendente > sogliaMassima) return 0

  const scaglione = scaglioni.find((s) => redditoLavoroDipendente <= s.fino)
  return scaglione ? redditoLavoroDipendente * scaglione.percentuale : 0
}

/** Ulteriore detrazione IRPEF del cuneo fiscale, per RC tra 20.000€ e 40.000€. */
function calcolaUlterioreDetrazione(redditoComplessivo: number): number {
  const { sogliaMinima, fascia, sogliaMassima } = CUNEO_FISCALE.ulterioreDetrazione
  if (redditoComplessivo <= sogliaMinima || redditoComplessivo > sogliaMassima) return 0
  if (redditoComplessivo <= fascia.fino) return fascia.importo

  return fascia.importo * ((sogliaMassima - redditoComplessivo) / (sogliaMassima - fascia.fino))
}

export function calculateNetSalary(ral: number, mensilita: Mensilita = MENSILITA_DEFAULT): CalculationResult {
  const ralValida = Number.isFinite(ral) && ral > 0 ? ral : 0

  const contributiInps = ralValida * INPS_ALIQUOTA_DIPENDENTE
  const imponibileFiscale = ralValida - contributiInps

  // Nel nostro caso (unica fonte di reddito, nessun onere deducibile) reddito complessivo
  // e imponibile fiscale coincidono: usiamo lo stesso valore per detrazioni e scaglioni.
  const redditoComplessivo = imponibileFiscale

  const irpefLorda = applicaScaglioniMarginali(imponibileFiscale, SCAGLIONI_IRPEF)
  const detrazioneLavoroDipendente = calcolaDetrazioneLavoroDipendente(redditoComplessivo)
  const sommaIntegrativa = calcolaSommaIntegrativa(redditoComplessivo)
  const ulterioreDetrazione = calcolaUlterioreDetrazione(redditoComplessivo)

  const irpefNetta = Math.max(0, irpefLorda - detrazioneLavoroDipendente - ulterioreDetrazione)

  const addizionaleRegionale = applicaScaglioniMarginali(imponibileFiscale, SCAGLIONI_ADDIZIONALE_REGIONALE_LOMBARDIA)

  const addizionaleComunale =
    imponibileFiscale > ADDIZIONALE_COMUNALE_MILANO.sogliaEsenzione
      ? imponibileFiscale * ADDIZIONALE_COMUNALE_MILANO.aliquota
      : 0

  const caricoFiscaleTotale = irpefNetta + addizionaleRegionale + addizionaleComunale

  const nettoAnnuo = ralValida - contributiInps - caricoFiscaleTotale + sommaIntegrativa
  const nettoMensile = nettoAnnuo / mensilita

  const steps = costruisciStep({
    ral: ralValida,
    contributiInps,
    irpefNetta,
    addizionaleRegionale,
    addizionaleComunale,
    sommaIntegrativa,
    nettoAnnuo,
  })

  return {
    ral: ralValida,
    mensilita,
    contributiInps,
    imponibileFiscale,
    irpefLorda,
    detrazioneLavoroDipendente,
    sommaIntegrativa,
    ulterioreDetrazione,
    irpefNetta,
    addizionaleRegionale,
    addizionaleComunale,
    caricoFiscaleTotale,
    nettoAnnuo,
    nettoMensile,
    steps,
  }
}

/** Costruisce la sequenza di step "che muovono cassa" da RAL a netto, per il waterfall
 * chart e per la prima riga di lettura del pannello dettagli. Le sole voci che qui non
 * compaiono come step a sé (IRPEF lorda, detrazioni) sono componenti interne dell'IRPEF
 * netta e restano comunque leggibili come campi separati in CalculationResult. */
function costruisciStep(v: {
  ral: number
  contributiInps: number
  irpefNetta: number
  addizionaleRegionale: number
  addizionaleComunale: number
  sommaIntegrativa: number
  nettoAnnuo: number
}): CalculationStep[] {
  let corrente = v.ral
  const step = (
    id: string,
    label: string,
    description: string,
    kind: CalculationStep['kind'],
    delta: number,
  ): CalculationStep => {
    corrente += delta
    return { id, label, description, kind, delta, runningTotal: corrente }
  }

  return [
    { id: 'ral', label: 'RAL', description: 'Retribuzione annua lorda di partenza.', kind: 'totale', delta: v.ral, runningTotal: v.ral },
    step('inps', 'Contributi INPS', "9,19% della RAL, trattenuti a favore del fondo pensione.", 'trattenuta', -v.contributiInps),
    step('irpef', 'IRPEF netta', 'Imposta nazionale sul reddito, già al netto delle detrazioni da lavoro dipendente e del cuneo fiscale.', 'trattenuta', -v.irpefNetta),
    step('addizionaleRegionale', 'Addizionale regionale (Lombardia)', 'Imposta regionale a scaglioni sull’imponibile fiscale.', 'trattenuta', -v.addizionaleRegionale),
    step('addizionaleComunale', 'Addizionale comunale (Milano)', 'Aliquota unica 0,80% se l’imponibile supera 23.000€.', 'trattenuta', -v.addizionaleComunale),
    step('cuneoFiscale', 'Sgravio cuneo fiscale', 'Somma integrativa non imponibile, aggiunta direttamente al netto (solo per redditi fino a 20.000€).', 'sgravio', v.sommaIntegrativa),
    { id: 'netto', label: 'Netto annuo', description: 'Quanto resta in tasca dopo tutte le trattenute.', kind: 'totale', delta: v.nettoAnnuo, runningTotal: v.nettoAnnuo },
  ]
}
