# Calcolatore RAL → netto — note di progetto & FAQ

Riferimento interno per rispondere a domande (LinkedIn, JetHR, recruiter, curiosi) dopo
il lancio. Aggiornato all'8 settembre 2026.

---

## 1. Cos'è

Prototipo web che, partendo dalla **RAL** (Retribuzione Annua Lorda), proietta in tempo
reale lo **stipendio netto** mensile e annuo e mostra, voce per voce, dove finisce ogni
euro: contributi INPS → IRPEF a scaglioni → detrazioni da lavoro dipendente → cuneo
fiscale → addizionale regionale → addizionale comunale → netto.

Nato come hiring task per il ruolo **AI Product Builder @ Jet HR**. Candidatura non
andata a buon fine; il prototipo è comunque messo online come pezzo di portfolio.

- **Live:** deploy Vercel (`calcolatore-ral-preview.vercel.app`), short link `lnkd.in/eBhq_8Dc`.
- **Repo:** questo. Codice scritto con Claude Code; scelte di prodotto (cosa costruire,
  come scomporlo, filtro sulle fonti, cosa semplificare) dell'autore.

## 2. Caso standard modellato

| Assunzione | Valore |
|---|---|
| Contratto | Tempo indeterminato, full-time |
| Residenza e sede di lavoro | Milano (Lombardia) |
| Reddito | La RAL è l'unica fonte; nessun altro reddito né onere deducibile |
| Mensilità | 12 / 13 / 14 selezionabili (default 13). TFR sempre escluso (accantonato) |
| Reddito complessivo (RC) | Approssimato a RAL − contributi INPS a carico del lavoratore |

**Escluso volontariamente** (dichiarato nelle note del tool): carichi di famiglia, bonus
rimpatriati / impatriati, TFR in busta paga, massimale contributivo INPS (122.295 €/2026),
trattamento integrativo ex "bonus Renzi". Contratto assunto ordinario: con
l'apprendistato l'INPS a carico del lavoratore scende dal 9,19% al 5,84%.

## 3. Numeri e fonti (anno d'imposta 2026)

Tutte in `src/calculation/constants.ts`, citate voce per voce. Verificate su fonti
primarie il 13/08/2026, **riverificate l'08/09/2026: nessuna variazione**.

| Voce | Valore | Fonte primaria |
|---|---|---|
| INPS dipendente (IVS, FPLD) | 9,19% | Circolare INPS n. 6 del 30/01/2026 |
| Aliquota aggiuntiva IVS 1% | oltre 56.224 €/anno | Circolare INPS n. 6/2026 (art. 3-ter L. 438/1992) |
| Scaglioni IRPEF | 23% / 33% / 43% (28k / 50k) | L. 199/2025 (Legge di Bilancio 2026), GU n. 301 del 30/12/2025 — 2ª aliquota 35→33% resa strutturale |
| Detrazione lavoro dipendente | art. 13 c.1 TUIR | importi da L. 207/2024, confermati da L. 199/2025 |
| Cuneo fiscale 2026 | somma integrativa ≤20k RC / ulteriore detrazione 20–40k RC | Circolare Ag. Entrate n. 4/E del 16/05/2025 (art. 1 c. 4-9 L. 207/2024) |
| Addizionale regionale Lombardia | 4 scaglioni 1,23%–1,73% | pagina Regione Lombardia; sistema a scaglioni prorogato al 2028 da L. 199/2025 |
| Addizionale comunale Milano | 0,80% sull'intero imponibile oltre 23.000 € di esenzione | Comune di Milano; nessuna nuova delibera per il 2026 (vige quella 2025) |
| Prezzo colazione (solo "indice cornetto") | 3,00 € tondi | Osservatorio Federconsumatori, media nazionale 3,07 € 2024 — non è una fonte fiscale |

Link diretti a Dipartimento delle Finanze (addizionali) e alle circolari sono nel tool
(sezione "Note" e "E se non abiti a Milano?") e nel `README.md`.

## 4. Il claim "3–4%" del post

Vedi `docs/linkedin-post.md` § "Claim da presidiare". In breve: solo addizionale
regionale + comunale dipendono dal luogo; lo scarto max regione↔regione ≈ 630 €/anno, con
la comunale ≈ 900 €/anno su un imponibile di 30k → nell'ordine del 3–4% del netto.

## 5. Scelte tecniche

- **Stack:** Vite + React 19 + TypeScript, **zero dipendenze runtime** oltre a React.
  Nessuna libreria di i18n, di stato, di grafici, di animazione — tutto a mano.
- **Motore di calcolo** (`src/calculation/`): funzione pura, nessun riferimento a
  React/DOM. Test a mano in `taxEngine.test.ts` (casi 25k / 40k / 60k / 70k calcolati a
  penna + invarianti: somma degli step = netto, 14 mensilità, RAL non valide).
- **UI** (`src/components/`): legge solo dati già calcolati, zero logica fiscale.
- **Waterfall chart:** SVG/DOM a mano, palette validata per contrasto e daltonismo con lo
  script della skill dataviz.
- **Temi:** chiaro/scuro seguono il sistema (`prefers-color-scheme`), override esplicito
  persistito; script pre-paint in `index.html` per evitare il flash.
- **Lingua:** IT/EN. Vedi § 6.
- **Deploy:** Vercel.

## 6. Comportamenti recenti (rilascio 08/09/2026)

- **Lingua automatica:** all'avvio la UI parte in **IT o EN in base alla lingua del
  dispositivo** (`navigator.languages`; qualsiasi `it*` → italiano, altrimenti inglese).
  La scelta automatica **non** viene salvata: ogni visita ri-rileva la lingua di sistema
  finché l'utente non forza una lingua col pulsante in header (quella sì persistita).
  Stesso principio del pulsante tema. `<html lang>` è impostato prima del paint.
- **Mobile — netto sempre in vista:** su schermi ≤860px il pannello del netto va in cima
  e resta **agganciato al bordo alto** (sticky) mentre si scorre input, grafico e note.
  Premere +/−, trascinare lo slider o digitare nel campo aggiorna un numero già visibile,
  senza rincorrerlo con lo scroll e senza salti di pagina. Sotto i 560px i due netti
  (mensile / annuo) si affiancano per tenere l'header basso.
- **Mobile — tap +/−:** bersagli portati a 44px, `touch-action: manipulation` (niente
  zoom da doppio tap né ritardo di 300ms).
- **Card "Regola locale / Milano":** su mobile (≤520px) occupa tutta la riga in
  orizzontale (etichetta a sinistra, "Milano" a destra, "Regione Lombardia" sotto), invece
  di restare mezza e spaiata sull'ultima riga della griglia.
- **"non cambia"** nella nota "E se non abiti a Milano?" è evidenziato in **oro** (stessa
  enfasi grassetto delle altre parole marcate) per far risaltare il messaggio: la gran
  parte del calcolo non dipende da dove vivi.
- **"Indice cornetto & cappuccino":** la riga fonte non cita più "media Milano" — resta
  solo `~3,00 € a colazione`. La costante è stata rinominata `PREZZO_COLAZIONE`.

## 7. FAQ

**È affidabile per decidere se accettare un'offerta?**
È un prototipo didattico/illustrativo, non un cedolino. Dà una stima ragionevole per il
caso standard (indeterminato, full-time, Milano, nessuna agevolazione). Per numeri
vincolanti serve una busta paga reale / un consulente.

**Perché Milano come riferimento?**
Serviva un caso concreto e completo (regione + comune con aliquote reali). La nota
dedicata isola cosa cambia altrove: pochissimo, ~3–4% sul netto (§ 4).

**E l'apprendistato / gli under 30 / i rimpatriati?**
Fuori dal caso standard e dichiarati come esclusioni nelle note. L'apprendistato è
menzionato con il numero (INPS lavoratore 5,84% invece di 9,19%) e la fonte (D.Lgs.
81/2015 art. 47), ma non è implementato come opzione.

**Il "reddito complessivo" del cuneo fiscale è approssimato: quanto pesa?**
Le soglie del cuneo (20k / 32k / 40k) si riferiscono al RC, qui approssimato a
RAL − INPS. Nel caso standard (RAL unica fonte, nessun onere deducibile) RC e imponibile
fiscale coincidono, quindi l'approssimazione è esatta; si scosterebbe solo con altri
redditi o oneri, che sono fuori scope.

**Perché il netto quasi non cambia tra 33% e 43% per redditi medi?**
Gli scaglioni sono marginali: l'aliquota alta colpisce solo la porzione di reddito dentro
quello scaglione, non tutto. Il waterfall lo mostra scaglione per scaglione.

**Perché la seconda aliquota è 33% e non 35%?**
La Legge di Bilancio 2026 (L. 199/2025) ha ridotto la seconda aliquota da 35% a 33% e
l'ha resa strutturale (modifica diretta all'art. 11 TUIR).

**È stato fatto con l'AI?**
Sì, il codice è scritto con Claude Code. Le decisioni di prodotto — cosa costruire, come
scomporlo, quali fonti usare, cosa semplificare e come — sono dell'autore.

**Aggiornamenti fiscali?**
Le costanti sono in un unico file con fonte per voce. Quando cambiano aliquote/scaglioni
si aggiorna lì e i test vanno rifatti sui nuovi valori attesi.

## 8. Da tenere d'occhio (non bloccanti)

- **URL nei meta OG** (`index.html`) e nel `README` puntano a
  `calcolatore-ral-preview.vercel.app`: verificare che sia l'URL definitivo di produzione
  prima/ dopo il giro di condivisione.
- **Addizionale comunale Milano:** circola l'ipotesi di alzare la soglia di esenzione e
  portare l'aliquota massima a 0,90% per i redditi alti — non ancora deliberata. Se passa,
  aggiornare `ADDIZIONALE_COMUNALE_MILANO`.
- **Circolare INPS n. 6/2026:** il permalink INPS a volte risponde con errore di
  certificato ai fetch automatici; la pagina è raggiungibile da browser.
