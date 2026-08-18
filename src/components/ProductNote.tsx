import './ProductNote.css'

/** La nota di trasparenza del prototipo: chiusa per default, un solo click la apre tutta. */
export function ProductNote() {
  return (
    <details className="product-note">
      <summary className="product-note__summary">Note</summary>
      <ul className="product-note__list">
        <li>
          <strong>Profilo:</strong> tempo indeterminato, full-time, residenza Milano (Lombardia).
        </li>
        <li>
          <strong>Calcolo IRPEF &amp; INPS:</strong> basato sulle aliquote e sugli scaglioni vigenti (cuneo fiscale
          2026 incluso).
          <span className="product-note__fonti">
            Fonti:{' '}
            <a
              href="https://www.agenziaentrate.gov.it/portale/documents/20143/8410823/Circolare+lavoro+dipendente+LB2025+DD+IRPEF+n.+4+del+16+maggio+2025.pdf/36979eaa-9fc5-a4ec-a7aa-136497c53f91"
              target="_blank"
              rel="noopener noreferrer"
            >
              Agenzia delle Entrate, circolare n. 4/E
            </a>{' '}
            e{' '}
            <a
              href="https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2026.01.circolare-numero-6-del-30-01-2026_15151.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              circolare INPS n. 6/2026
            </a>
            .
          </span>
        </li>
        <li>
          <strong>Reddito complessivo (RC):</strong> le soglie del cuneo fiscale si riferiscono al RC, non alla RAL.
          Nel prototipo è approssimato a RAL meno i contributi INPS a carico del lavoratore.
        </li>
        <li>
          <strong>Esclusioni volontarie:</strong> niente carichi di famiglia, bonus rimpatriati o TFR in busta paga.
        </li>
        <li>
          <strong>Mensilità:</strong> selezionabili tra 12, 13 e 14.
        </li>
      </ul>
    </details>
  )
}
