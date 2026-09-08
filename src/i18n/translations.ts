// Dizionari di traduzione — nessuna libreria di i18n: un oggetto tipizzato per lingua,
// nello stesso spirito "zero dipendenze" del resto del progetto (vedi useTheme.ts per
// il pattern di persistenza/rilevamento già usato per il tema).
//
// Il motore di calcolo (calculation/) resta sempre in italiano: i suoi id (`step.id`)
// sono chiavi stabili, non testo da mostrare. Il testo mostrato in UI vive solo qui.

export type Lang = 'it' | 'en'

export type StepId = 'ral' | 'inps' | 'irpef' | 'addizionaleRegionale' | 'addizionaleComunale' | 'cuneoFiscale' | 'netto'

/** Un pezzo di testo semplice, o una parola/frase da mostrare in grassetto — usato per le
 * note dove serve enfatizzare solo alcune parole senza ricorrere a HTML grezzo. Con
 * `accent: true` l'enfasi passa dal colore inchiostro all'ambra del brand (stesso peso). */
export type RichSegment = string | { b: string; accent?: boolean }

export interface Translations {
  header: {
    titlePrefix: string
    titleEmphasis: string
    titleEmoji: string
    subtitle: string
  }
  salaryInput: {
    label: string
    sliderAriaLabel: string
  }
  mensilita: {
    label: string
    ariaLabel: string
  }
  compare: {
    cta: string
    label: string
    remove: string
    stepDown: string
    stepUp: string
    monthlyLabel: string
    yearlyLabel: string
    delta: (formattedDiff: string, formattedPct: string) => string
  }
  explore: {
    cta: string
  }
  result: {
    eyebrow: string
    monthly: string
    yearly: string
    footnote: (n: number) => string
  }
  share: {
    ariaLabel: string
    copiedLabel: string
  }
  breakfast: {
    toggleLabel: string
    ariaLabel: string
    month: string
    year: string
    perMonth: string
    perYear: string
    source: (price: string) => string
  }
  waterfall: {
    sectionTitle: string
    focusAriaLabel: string
    focusCurrent: string
    focusCompare: string
    legend: { deductions: string; reliefs: string }
    infoAriaLabel: (label: string) => string
    closeLabel: string
    detailTitle: string
    brackets: {
      title: string
      upTo: (amount: string) => string
      over: (amount: string) => string
      between: (from: string, to: string) => string
      taxedPortion: string
    }
    details: {
      imponibileFiscale: string
      irpefLorda: string
      detrazioneLavoroDipendente: string
      ulterioreDetrazione: string
      redditoComplessivo: string
      nettoMensile: (mensilita: number) => string
    }
    steps: Record<StepId, { label: string; short: string; long: string }>
  }
  dataCards: {
    title: string
    brackets: [string, string, string]
    inps: { label: string; caption: string }
    local: { label: string; value: string; caption: string }
  }
  regionalNote: {
    title: string
    intro: RichSegment[]
    rates: RichSegment[]
    estimate: RichSegment[]
    sourcesLabel: string
    and: string
  }
  productNote: {
    summary: string
    items: { title: string; body: string; source?: { label: string; url: string }[] }[]
    sourcesLabel: string
    and: string
    updated: string
  }
  theme: {
    toLight: string
    toDark: string
  }
  language: {
    switchLabel: string
  }
  social: {
    label: string
  }
}

const it: Translations = {
  header: {
    titlePrefix: 'Tutto molto bello.',
    titleEmphasis: 'Ma, quant’è?',
    titleEmoji: '🤌🏻',
    subtitle: 'Inserisci la RAL e guarda lo stipendio netto aggiornarsi.',
  },
  salaryInput: {
    label: 'Retribuzione Annua Lorda (RAL)',
    sliderAriaLabel: 'Stipendio lordo annuo, esplorazione rapida',
  },
  mensilita: {
    label: 'Mensilità',
    ariaLabel: 'Numero di mensilità',
  },
  compare: {
    cta: 'Confronta con →',
    label: 'RAL di confronto',
    remove: 'Rimuovi confronto',
    stepDown: 'Diminuisci di 500€',
    stepUp: 'Aumenta di 500€',
    monthlyLabel: 'Netto mensile',
    yearlyLabel: 'Netto annuo',
    delta: (formattedDiff, formattedPct) => `${formattedDiff} (${formattedPct})`,
  },
  explore: {
    cta: 'Esplora il breakdown ↓',
  },
  result: {
    eyebrow: 'Stipendio netto',
    monthly: 'Netto mensile',
    yearly: 'Netto annuo',
    footnote: (n) => `su ${n} mensilità`,
  },
  share: {
    ariaLabel: 'Copia il link di questa simulazione',
    copiedLabel: 'Link copiato!',
  },
  breakfast: {
    toggleLabel: 'Colazioni',
    ariaLabel: "Colazioni al mese o all'anno",
    month: 'Mese',
    year: 'Anno',
    perMonth: 'al mese',
    perYear: "all'anno",
    source: (price) => `~${price} a colazione, cornetto e cappuccino al banco.`,
  },
  waterfall: {
    sectionTitle: 'Dalla RAL al netto, passo dopo passo',
    focusAriaLabel: 'Quale RAL mostrare nel percorso di calcolo',
    focusCurrent: 'RAL attuale',
    focusCompare: 'RAL di confronto',
    legend: { deductions: 'Trattenute', reliefs: 'Sgravi' },
    infoAriaLabel: (label) => `Spiegazione: ${label}`,
    closeLabel: 'Chiudi',
    detailTitle: 'Dettaglio',
    brackets: {
      title: 'Scomposizione a scaglioni',
      upTo: (amount) => `Fino a ${amount}`,
      over: (amount) => `Oltre ${amount}`,
      between: (from, to) => `Da ${from} a ${to}`,
      taxedPortion: 'Imposta su questo scaglione',
    },
    details: {
      imponibileFiscale: 'Imponibile fiscale',
      irpefLorda: 'IRPEF lorda',
      detrazioneLavoroDipendente: 'Detrazione lavoro dipendente',
      ulterioreDetrazione: 'Ulteriore detrazione (cuneo fiscale)',
      redditoComplessivo: 'Reddito complessivo (RC)',
      nettoMensile: (mensilita) => `Netto mensile (÷ ${mensilita})`,
    },
    steps: {
      ral: {
        label: 'RAL',
        short: 'Retribuzione annua lorda, il punto di partenza di tutto il calcolo.',
        long: 'La Retribuzione Annua Lorda è l’importo concordato con il datore di lavoro prima di qualunque trattenuta contributiva o fiscale: da qui parte l’intero percorso verso il netto.',
      },
      inps: {
        label: 'Contributi INPS',
        short: "9,19% della RAL, più l'1% aggiuntivo IVS oltre 56.224€, trattenuti a favore del fondo pensione.",
        long: 'La quota di contributi previdenziali a carico del lavoratore (IVS, Fondo Pensioni Lavoratori Dipendenti) versata all’INPS. Oltre la soglia di retribuzione pensionabile (56.224€ per il 2026) si applica un ulteriore 1% sulla quota eccedente.',
      },
      irpef: {
        label: 'IRPEF netta',
        short: 'Imposta nazionale sul reddito, già al netto delle detrazioni da lavoro dipendente e del cuneo fiscale.',
        long: 'L’imposta sul reddito delle persone fisiche si calcola a scaglioni marginali sull’imponibile fiscale (RAL meno contributi INPS): ogni aliquota si applica solo alla porzione di reddito che rientra nel proprio scaglione, non all’intero importo. Dall’imposta lorda si sottraggono poi la detrazione da lavoro dipendente e l’eventuale ulteriore detrazione del cuneo fiscale.',
      },
      addizionaleRegionale: {
        label: 'Addizionale regionale (Lombardia)',
        short: 'Imposta regionale a scaglioni sull’imponibile fiscale.',
        long: 'Imposta dovuta alla Regione Lombardia, calcolata a scaglioni marginali sullo stesso imponibile fiscale usato per l’IRPEF nazionale.',
      },
      addizionaleComunale: {
        label: 'Addizionale comunale (Milano)',
        short: 'Aliquota unica 0,80% se l’imponibile supera 23.000€.',
        long: 'A differenza dell’IRPEF e dell’addizionale regionale, questa non è a scaglioni marginali: se l’imponibile fiscale supera la soglia di esenzione di 23.000€, l’aliquota dello 0,80% si applica sull’intero imponibile.',
      },
      cuneoFiscale: {
        label: 'Sgravio cuneo fiscale',
        short: 'Somma integrativa non imponibile, aggiunta direttamente al netto (solo per redditi fino a 20.000€).',
        long: 'Per redditi complessivi fino a 20.000€, una somma integrativa non imponibile viene aggiunta direttamente al netto in busta paga (non riduce l’IRPEF). Per redditi tra 20.000€ e 40.000€ si applica invece un’ulteriore detrazione IRPEF, già inclusa nel calcolo della voce “IRPEF netta”.',
      },
      netto: {
        label: 'Netto annuo',
        short: 'Quanto resta in tasca dopo tutte le trattenute.',
        long: 'Il risultato finale: RAL meno tutte le trattenute contributive e fiscali, più l’eventuale sgravio del cuneo fiscale. Diviso per il numero di mensilità scelto, dà il netto mensile.',
      },
    },
  },
  dataCards: {
    title: 'I numeri alla base del calcolo',
    brackets: ['1° scaglione IRPEF', '2° scaglione IRPEF', '3° scaglione IRPEF'],
    inps: { label: 'Contributi INPS', caption: 'a carico del dipendente' },
    local: { label: 'Regola locale', value: 'Milano', caption: 'Regione Lombardia' },
  },
  regionalNote: {
    title: 'E se non abiti a Milano?',
    intro: [
      'Contributi INPS, scaglioni IRPEF nazionali e cuneo fiscale sono ',
      { b: 'identici' },
      ' in tutta Italia: la ',
      { b: 'gran parte' },
      ' di questo calcolo ',
      { b: 'non cambia', accent: true },
      ' in base a dove vivi.',
    ],
    rates: [
      'A cambiare sono solo due voci, fissate da regione e comune: ',
      { b: 'l’addizionale regionale' },
      ' (dall’1,23% al 3,33% a seconda della regione) e ',
      { b: 'l’addizionale comunale' },
      ' (fino allo 0,80%, 0,90% solo per Roma). La Lombardia è vicina al minimo regionale; l’addizionale comunale di Milano (0,80%) è già al tetto ordinario di legge.',
    ],
    estimate: [
      'Su un imponibile fiscale di 30.000€, lo scarto tra l’aliquota regionale più bassa e quella più alta vale da solo circa ',
      { b: '630€ l’anno (~53€/mese)' },
      '; sommando il margine sull’addizionale comunale si arriva a uno scarto potenziale di circa ',
      { b: '900€ l’anno (~75€/mese)' },
      ' rispetto a questo calcolo, in più o in meno a seconda della zona.',
    ],
    sourcesLabel: 'Fonti',
    and: 'e',
  },
  productNote: {
    summary: 'Note',
    items: [
      {
        title: 'Profilo',
        body: 'tempo indeterminato, full-time, residenza Milano (Lombardia).',
      },
      {
        title: 'Calcolo IRPEF & INPS',
        body: 'basato sulle aliquote e sugli scaglioni vigenti (cuneo fiscale 2026 incluso).',
        source: [
          {
            label: 'Agenzia delle Entrate, circolare n. 4/E',
            url: 'https://www.agenziaentrate.gov.it/portale/documents/20143/8410823/Circolare+lavoro+dipendente+LB2025+DD+IRPEF+n.+4+del+16+maggio+2025.pdf/36979eaa-9fc5-a4ec-a7aa-136497c53f91',
          },
          {
            label: 'circolare INPS n. 6/2026',
            url: 'https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2026.01.circolare-numero-6-del-30-01-2026_15151.html',
          },
        ],
      },
      {
        title: 'Reddito complessivo (RC)',
        body: 'le soglie del cuneo fiscale si riferiscono al RC, non alla RAL. Nel prototipo è approssimato a RAL meno i contributi INPS a carico del lavoratore.',
      },
      {
        title: 'Tipo di contratto',
        body: 'assume un contratto ordinario. Con l’apprendistato l’INPS a carico del lavoratore scende al 5,84% (invece del 9,19%), a vantaggio del netto.',
        source: [{ label: 'D.Lgs. 81/2015, art. 47', url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2015-06-15;81' }],
      },
      {
        title: 'Esclusioni volontarie',
        body: 'niente carichi di famiglia, bonus rimpatriati, TFR in busta paga, massimale contributivo INPS o trattamento integrativo (ex bonus Renzi).',
      },
      {
        title: 'Mensilità',
        body: 'selezionabili tra 12, 13 e 14.',
      },
    ],
    sourcesLabel: 'Fonti',
    and: 'e',
    updated: 'Aggiornato al 08/09/2026',
  },
  theme: {
    toLight: 'Passa al tema chiaro',
    toDark: 'Passa al tema scuro',
  },
  language: {
    switchLabel: 'Switch to English',
  },
  social: {
    label: 'Made by Gabriele Schina',
  },
}

const en: Translations = {
  header: {
    titlePrefix: 'All very nice.',
    titleEmphasis: 'But, how much?',
    titleEmoji: '🤌🏻',
    subtitle: 'Enter your gross salary and watch your net pay update.',
  },
  salaryInput: {
    label: 'Gross annual salary',
    sliderAriaLabel: 'Gross annual salary, quick exploration',
  },
  mensilita: {
    label: 'Payments/year',
    ariaLabel: 'Number of yearly payments',
  },
  compare: {
    cta: 'Compare with →',
    label: 'Comparison salary',
    remove: 'Remove comparison',
    stepDown: 'Decrease by €500',
    stepUp: 'Increase by €500',
    monthlyLabel: 'Net monthly',
    yearlyLabel: 'Net yearly',
    delta: (formattedDiff, formattedPct) => `${formattedDiff} (${formattedPct})`,
  },
  explore: {
    cta: 'Explore the breakdown ↓',
  },
  result: {
    eyebrow: 'Net salary',
    monthly: 'Net monthly',
    yearly: 'Net yearly',
    footnote: (n) => `across ${n} payments/year`,
  },
  share: {
    ariaLabel: 'Copy the link to this simulation',
    copiedLabel: 'Link copied!',
  },
  breakfast: {
    toggleLabel: 'Breakfasts',
    ariaLabel: 'Breakfasts per month or per year',
    month: 'Month',
    year: 'Year',
    perMonth: 'per month',
    perYear: 'per year',
    source: (price) => `~${price} per breakfast, croissant and cappuccino at the counter.`,
  },
  waterfall: {
    sectionTitle: 'From gross to net, step by step',
    focusAriaLabel: 'Which gross salary to show in the calculation path',
    focusCurrent: 'Current',
    focusCompare: 'Comparison',
    legend: { deductions: 'Deductions', reliefs: 'Reliefs' },
    infoAriaLabel: (label) => `Explanation: ${label}`,
    closeLabel: 'Close',
    detailTitle: 'Detail',
    brackets: {
      title: 'Bracket breakdown',
      upTo: (amount) => `Up to ${amount}`,
      over: (amount) => `Over ${amount}`,
      between: (from, to) => `From ${from} to ${to}`,
      taxedPortion: 'Tax on this bracket',
    },
    details: {
      imponibileFiscale: 'Taxable income',
      irpefLorda: 'Gross income tax',
      detrazioneLavoroDipendente: 'Employment tax credit',
      ulterioreDetrazione: 'Extra deduction (tax wedge)',
      redditoComplessivo: 'Total income',
      nettoMensile: (mensilita) => `Net monthly (÷ ${mensilita})`,
    },
    steps: {
      ral: {
        label: 'Gross salary',
        short: 'Your gross annual salary, the starting point of the whole calculation.',
        long: 'The gross annual salary is the amount agreed with the employer before any social security or tax withholding: the whole path to net pay starts here.',
      },
      inps: {
        label: 'Social security (INPS)',
        short: "9.19% of gross salary, plus an extra 1% above €56,224, withheld for the pension fund.",
        long: 'The employee-side social security contribution (pension fund) paid to INPS. Above the pensionable-earnings threshold (€56,224 for 2026), an extra 1% applies to the portion above it.',
      },
      irpef: {
        label: 'Net income tax',
        short: 'National income tax, already net of the employment tax credit and the tax wedge relief.',
        long: 'Italian personal income tax is calculated on marginal brackets applied to taxable income (gross salary minus social security contributions): each rate applies only to the portion of income within its own bracket, not to the whole amount. The employment tax credit and, where applicable, the extra tax-wedge deduction are then subtracted from the gross tax.',
      },
      addizionaleRegionale: {
        label: 'Regional surtax (Lombardy)',
        short: 'Regional tax on marginal brackets applied to taxable income.',
        long: 'Tax owed to the Lombardy region, calculated on marginal brackets applied to the same taxable income used for national income tax.',
      },
      addizionaleComunale: {
        label: 'Municipal surtax (Milan)',
        short: 'Flat 0.80% rate if taxable income exceeds €23,000.',
        long: 'Unlike national and regional income tax, this is not calculated on marginal brackets: once taxable income exceeds the €23,000 exemption threshold, the 0.80% rate applies to the entire taxable income.',
      },
      cuneoFiscale: {
        label: 'Tax wedge relief',
        short: 'Tax-free top-up added directly to net pay (only for incomes up to €20,000).',
        long: 'For total income up to €20,000, a tax-free top-up is added directly to net pay (it does not reduce income tax). For income between €20,000 and €40,000, an extra income-tax deduction applies instead, already included in the "Net income tax" figure above.',
      },
      netto: {
        label: 'Net yearly salary',
        short: 'What is left after all withholdings.',
        long: 'The final result: gross salary minus all social security and tax withholdings, plus any tax wedge relief. Divided by the chosen number of yearly payments, it gives the net monthly salary.',
      },
    },
  },
  dataCards: {
    title: 'The numbers behind the calculation',
    brackets: ['1st income tax bracket', '2nd income tax bracket', '3rd income tax bracket'],
    inps: { label: 'Social security (INPS)', caption: 'employee share' },
    local: { label: 'Local rule', value: 'Milan', caption: 'Lombardy region' },
  },
  regionalNote: {
    title: 'Not living in Milan?',
    intro: [
      'Social security contributions, national income tax brackets and the tax wedge relief are ',
      { b: 'identical' },
      ' across Italy: ',
      { b: 'most' },
      ' of this calculation ',
      { b: 'does not change', accent: true },
      ' based on where you live.',
    ],
    rates: [
      'Only two items change, set by region and municipality: ',
      { b: 'the regional surtax' },
      ' (from 1.23% to 3.33% depending on the region) and ',
      { b: 'the municipal surtax' },
      ' (up to 0.80%, 0.90% only for Rome). Lombardy sits near the regional floor; Milan’s municipal surtax (0.80%) is already at the ordinary statutory cap.',
    ],
    estimate: [
      'On a taxable income of €30,000, the gap between the lowest and highest regional rate alone is worth around ',
      { b: '€630/year (~€53/month)' },
      '; adding the municipal surtax margin brings the potential swing to around ',
      { b: '€900/year (~€75/month)' },
      ' relative to this calculation, in either direction depending on the area.',
    ],
    sourcesLabel: 'Sources',
    and: 'and',
  },
  productNote: {
    summary: 'Notes',
    items: [
      {
        title: 'Profile',
        body: 'permanent contract, full-time, resident in Milan (Lombardy).',
      },
      {
        title: 'Income tax & social security',
        body: 'based on the rates and brackets in force (2026 tax wedge relief included).',
        source: [
          {
            label: 'Agenzia delle Entrate, circolare n. 4/E',
            url: 'https://www.agenziaentrate.gov.it/portale/documents/20143/8410823/Circolare+lavoro+dipendente+LB2025+DD+IRPEF+n.+4+del+16+maggio+2025.pdf/36979eaa-9fc5-a4ec-a7aa-136497c53f91',
          },
          {
            label: 'circolare INPS n. 6/2026',
            url: 'https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2026.01.circolare-numero-6-del-30-01-2026_15151.html',
          },
        ],
      },
      {
        title: 'Total income',
        body: 'the tax wedge relief thresholds refer to total income, not gross salary. In this prototype it is approximated as gross salary minus the employee-side social security contributions.',
      },
      {
        title: 'Contract type',
        body: 'assumes an ordinary contract. With an apprenticeship, the employee-side INPS rate drops to 5.84% (instead of 9.19%), boosting net pay.',
        source: [{ label: 'D.Lgs. 81/2015, art. 47', url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2015-06-15;81' }],
      },
      {
        title: 'Deliberate exclusions',
        body: 'no dependent family members, repatriation bonus, TFR in the paycheck, INPS contribution cap, or old "bonus Renzi" integrative relief.',
      },
      {
        title: 'Payments per year',
        body: 'selectable between 12, 13 and 14.',
      },
    ],
    sourcesLabel: 'Sources',
    and: 'and',
    updated: 'Updated on Sep 8, 2026',
  },
  theme: {
    toLight: 'Switch to light theme',
    toDark: 'Switch to dark theme',
  },
  language: {
    switchLabel: 'Passa in italiano',
  },
  social: {
    label: 'Made by Gabriele Schina',
  },
}

export const translations: Record<Lang, Translations> = { it, en }
