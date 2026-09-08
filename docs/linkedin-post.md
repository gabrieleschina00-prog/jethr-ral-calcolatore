# Post LinkedIn — lancio del calcolatore RAL → netto

Testo pubblicato (o in pubblicazione) su LinkedIn, salvato qui come riferimento.
Data: 8 settembre 2026. Live link nel post: `https://lnkd.in/eBhq_8Dc`
(redirect verso il deploy Vercel del prototipo).

---

## Versione IT

> 🤌🏻 ENGLISH VERSION below
>
> Ciao network di LinkedIn! :))
> Volevo condividere con voi questo piccolo calcolatore che ho costruito per una hiring task da AI Product Builder in Jet HR (spoiler: sono stato scartato :c).
>
> Obiettivo: costruire un prototipo per simulare in tempo reale la proiezione della retribuzione netta partendo dalla RAL, mostrando voce per voce dove va a finire ogni singolo euro tra INPS, IRPEF e addizionali.
>
> Per il prodotto sono partito da un caso standard: dipendente a tempo indeterminato, full-time, residenza e lavoro a Milano, nessuna agevolazione particolare (per tutte le altre assunzioni date uno sguardo alle note direttamente nel tool).
>
> La cosa interessante? Anche prendendo un caso base, testando la variazione di altre variabili (e.g. addizionali tra diverse città: Roma, Taranto, ecc.), all'atto pratico lo scostamento finale sul netto è minimo (circa il 3-4%).
>
> Adesso che finalmente anche in Italia sempre più annunci mostrano la RAL (thx God <3), ho pensato potesse essere utile condividerlo per chiunque voglia capire al volo se un'offerta rispecchia davvero le aspettative:)
>
> Se anche tu ti sei trovat* davanti a una RAL pensando: "tutto molto bello, ma alla fine quanto mi resta in tasca?", ti invito a darci un'occhiata! :P
>
> Ciaooo <3
> 🤌🏻 Live link: https://lnkd.in/eBhq_8Dc

## Versione EN

> 🇬🇧 ENGLISH VERSION
> Hellooo LinkedIn Network! :))
>
> I just wanted to share a little tool I built for an AI Product Builder hiring task @Jet HR (spoiler: I got rejected :c).
> It's a live prototype that turns gross salary into actual net salary in Italy, breaking down taxes and social security step by step.
>
> For any of my international friends planning to move to Italy for the great food, wine, lifestyle, the italian dolce vita concept, and wondering: "cool salary on paper, but how much is actually landing in my bank account?", this one's for you!
>
> Enjoy<3
> 🤌🏻 Live link: https://lnkd.in/eBhq_8Dc

---

## Claim da presidiare nelle risposte

Il post fa una sola affermazione quantitativa: **cambiare città (quindi le addizionali
regionale + comunale) sposta il netto finale solo di circa il 3–4%.**

Backing, dalla nota "E se non abiti a Milano?" nel tool (`RegionalNote`), su un
imponibile fiscale di 30.000 €:

- solo due voci dipendono dal luogo: **addizionale regionale** (1,23%–3,33% a seconda
  della regione) e **addizionale comunale** (fino a 0,80%, 0,90% solo Roma);
- INPS, scaglioni IRPEF nazionali e cuneo fiscale sono identici in tutta Italia;
- scarto tra aliquota regionale minima e massima ≈ **630 €/anno (~53 €/mese)**;
- aggiungendo il margine sull'addizionale comunale ≈ **900 €/anno (~75 €/mese)**;
- su un netto annuo nell'ordine dei ~22–24k € questo vale grosso modo **3–4%**, in più
  o in meno a seconda della zona.

Fonti citate nel tool: [Dipartimento delle Finanze — addizionale regionale](https://www.finanze.gov.it/it/fiscalita/fiscalita-regionale-e-locale/Addizionale-regionale-allIRPEF/disciplina-del-tributo/)
e [addizionale comunale](https://www.finanze.gov.it/it/fiscalita/fiscalita-regionale-e-locale/Addizionale-comunale-allIRPEF/disciplina-del-tributo/).
