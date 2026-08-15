/**
 * Costanti fiscali e contributive — anno d'imposta 2026.
 *
 * Ogni valore qui dentro è stato verificato tramite ricerca su fonti ufficiali o di settore
 * (non recuperato a memoria) in data 13/08/2026. Le fonti sono citate voce per voce.
 *
 * Semplificazioni deliberate del prototipo (vedi anche AssumptionsNote in UI):
 * - si ignora il massimale contributivo INPS (122.295 €/anno per il 2026): rilevante solo
 *   per lavoratori nel sistema contributivo puro (iscritti dal 1996 in poi), quindi
 *   dipendente da un dato anagrafico fuori scope per un caso standard;
 * - si esclude il vecchio "trattamento integrativo" (ex bonus Renzi, fino a 1.200 €,
 *   soggetto a test di capienza IRPEF): le fonti secondarie consultate non descrivono
 *   in modo univoco la sua interazione con la somma integrativa/ulteriore detrazione
 *   introdotta dal 2025 per le stesse fasce di reddito, quindi si preferisce dichiarare
 *   l'esclusione piuttosto che implementare una regola incerta.
 */

/** Aliquota contributi INPS (IVS, Fondo Pensioni Lavoratori Dipendenti) a carico del lavoratore.
 * Fonte: Circolare INPS n. 6 del 30/01/2026, coerente con Circolare INPS n. 108/2025. */
export const INPS_ALIQUOTA_DIPENDENTE = 0.0919

/** Aliquota aggiuntiva IVS (art. 3-ter L. 438/1992) sulla quota di RAL che eccede il primo
 * scaglione di retribuzione pensionabile — si applica a tutti i lavoratori dipendenti,
 * indipendentemente dal sistema contributivo/retributivo.
 * Fonte: Circolare INPS n. 6 del 30/01/2026, primo scaglione fissato a 56.224 €/anno. */
export const INPS_ALIQUOTA_AGGIUNTIVA_IVS = 0.01
export const INPS_SOGLIA_AGGIUNTIVA_IVS = 56_224

/** Scaglioni IRPEF nazionali 2026, marginali (ogni aliquota si applica solo alla porzione
 * di reddito compresa nello scaglione).
 * Fonte: L. 199/2025 (Legge di Bilancio 2026), G.U. n. 301 del 30/12/2025 — seconda aliquota
 * ridotta da 35% a 33% e resa strutturale. */
export const SCAGLIONI_IRPEF = [
  { fino: 28_000, aliquota: 0.23 },
  { fino: 50_000, aliquota: 0.33 },
  { fino: Infinity, aliquota: 0.43 },
] as const

/** Detrazione da lavoro dipendente (art. 13, comma 1, TUIR).
 * Fonte: importi aggiornati da L. 207/2024, confermati strutturali da L. 199/2025. */
export const DETRAZIONE_LAVORO_DIPENDENTE = {
  sogliaBassa: 15_000,
  importoFisso: 1_955,
  sogliaMedia: 28_000,
  baseMedia: 1_910,
  coefficienteMedia: 1_190,
  sogliaAlta: 50_000,
  baseAlta: 1_910,
  /** Bonus aggiuntivo per redditi compresi in questa fascia (estremi esclusi/inclusi come da norma). */
  bonusAggiuntivo: { min: 25_000, max: 35_000, importo: 65 },
} as const

/**
 * "Cuneo fiscale" strutturale (art. 1, commi 4-9, L. 207/2024, confermato invariato per il
 * 2026 dalla L. 199/2025, illustrato dalla Circolare Agenzia delle Entrate n. 4/E del 16/05/2025).
 *
 * Due strumenti alternativi in base al reddito complessivo (RC):
 * - RC <= 20.000: somma integrativa NON imponibile, aggiunta direttamente al netto in busta
 *   paga (non riduce l'IRPEF), calcolata come percentuale del reddito da lavoro dipendente;
 * - 20.000 < RC <= 40.000: ulteriore detrazione dall'IRPEF lorda, fissa fino a 32.000 e poi
 *   decrescente linearmente fino ad azzerarsi a 40.000.
 */
export const CUNEO_FISCALE = {
  sommaIntegrativa: {
    sogliaMassima: 20_000,
    scaglioni: [
      { fino: 8_500, percentuale: 0.071 },
      { fino: 15_000, percentuale: 0.053 },
      { fino: 20_000, percentuale: 0.048 },
    ],
  },
  ulterioreDetrazione: {
    sogliaMinima: 20_000,
    fascia: { fino: 32_000, importo: 1_000 },
    sogliaMassima: 40_000,
  },
} as const

/** Addizionale regionale IRPEF Lombardia, a scaglioni marginali sull'imponibile fiscale.
 * Fonte: pagina ufficiale Regione Lombardia; sistema a 4 scaglioni prorogato fino al 2028
 * dalla L. 199/2025. */
export const SCAGLIONI_ADDIZIONALE_REGIONALE_LOMBARDIA = [
  { fino: 15_000, aliquota: 0.0123 },
  { fino: 28_000, aliquota: 0.0158 },
  { fino: 50_000, aliquota: 0.0172 },
  { fino: Infinity, aliquota: 0.0173 },
] as const

/** Addizionale comunale IRPEF Milano: aliquota unica sull'INTERO imponibile (non solo
 * sull'eccedenza) una volta superata la soglia di esenzione, diversamente dagli scaglioni
 * IRPEF/regionali, che sono marginali.
 * Fonte: Comune di Milano; nessuna nuova delibera pubblicata per il 2026, resta vigente
 * l'aliquota deliberata per il 2025. */
export const ADDIZIONALE_COMUNALE_MILANO = {
  sogliaEsenzione: 23_000,
  aliquota: 0.008,
} as const

/** Mensilità selezionabili per convertire il netto annuo in netto mensile: 12 (riferimento
 * generico), 13 (la stragrande maggioranza dei CCNL italiani) o 14 (es. commercio,
 * credito/bancari). TFR sempre escluso, perché accantonato e non liquidato mensilmente in
 * nessuno dei tre casi. */
export const MENSILITA_OPZIONI = [12, 13, 14] as const
export type Mensilita = (typeof MENSILITA_OPZIONI)[number]
export const MENSILITA_DEFAULT: Mensilita = 13

/** Prezzo medio di una colazione al bar (cappuccino + cornetto al banco), usato solo per il
 * tocco ironico "Indice Cornetto & Cappuccino" — non è una fonte fiscale, serve solo a dare
 * un senso di scala al risultato, quindi si usa la media nazionale come proxy per Milano.
 * Fonte: Osservatorio Nazionale Federconsumatori, media nazionale 3,07€ nel 2024 (da 2,95€
 * nel 2022), riportato da Puntarella Rossa:
 * https://www.puntarellarossa.it/2024/02/14/colazione-al-bar-sempre-piu-cara-cornetto-e-cappuccino-oltre-3-euro-ma-non-e-solo-una-questione-di-prezzi/ */
export const PREZZO_COLAZIONE_MILANO = 3.0
