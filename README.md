# RAL → Netto - Calcolatore

Prototipo realizzato per la prova tecnica @Jet HR.

Calcola in tempo reale il netto mensile e annuale partendo dalla RAL per un dipendente a tempo indeterminato a Milano.

Tutta la logica di calcolo è scritta in `src/calculation/`.

## 🔗 Fonti & Regole di Calcolo (Anno d'imposta 2026)

| #   | Voce / Passaggio                          | Fonte & Riferimento                                                                                                                                                                                          |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Contributi INPS (9,19%)                    | [Circolare INPS n. 6 (30/01/2026)](https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2026.01.circolare-numero-6-del-30-01-2026_15151.html)       |
| 2   | IRPEF lorda (Scaglioni 23/33/43%)          | [Legge di Bilancio 2026 (L. 199/2025 - G.U. n. 301)](https://www.gazzettaufficiale.it/eli/id/2025/12/30/25G00212/SG)                                                                                       |
| 3   | Detrazione Lavoro Dipendente               | [Art. 13 c.1 TUIR (aggiornato L. 207/2024 e L. 199/2025)](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917)                                     |
| 4   | Cuneo Fiscale 2026                         | [Circolare Ag. Entrate n. 4/E (Art. 1 commi 4-9 L. 207/2024)](https://www.agenziaentrate.gov.it/portale/documents/20143/8410823/Circolare+lavoro+dipendente+LB2025+DD+IRPEF+n.+4+del+16+maggio+2025.pdf/36979eaa-9fc5-a4ec-a7aa-136497c53f91) |
| 5   | Addizionale Regionale (Lombardia)          | [Regione Lombardia - Addizionale IRPEF](https://www.regione.lombardia.it/bollo-auto-e-tributi-regionali/red-addizionale-regionale-irpef)                                                                   |
| 6   | Addizionale Comunale (Milano - 0.80%)      | [Comune di Milano - Tributi](https://www.comune.milano.it/aree-tematiche/tributi/addizionale-comunale-irpef)                                                                                                |

## 📝 Semplificazioni

- Tempo indeterminato, full-time, residenza a Milano.
- Nessun carico di famiglia, nessuna agevolazione particolare (under 30, bonus rimpatriati, ecc.).
- Esclusi bonus vari, welfare e TFR (accantonato).

## 🏗️ Struttura essenziale

- `src/calculation/`: Motore fiscale (`taxEngine.ts`), costanti con fonti (`constants.ts`) e test (`taxEngine.test.ts`).
- `src/components/`: Interfaccia utente (leggono i dati già calcolati, zero logica fiscale).
- `src/App.tsx`: Gestione dello stato e del layout.

---

Creato interamente con Claude Code: il codice è stato scritto con AI, ma le decisioni: cosa costruire, come scomporlo, filtro per fonti, cosa semplificare e come, sono mie.

Grazie mille per quest'opportunità! E' stato bello divertente<3
