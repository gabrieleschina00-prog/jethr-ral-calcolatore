/**
 * Casi di riferimento calcolati a mano (vedi commenti) per tre RAL che attraversano fasce
 * diverse della catena di calcolo:
 * - 25.000€: dentro la fascia 15-28k della detrazione lavoro dipendente, dentro la fascia
 *   0-32k dell'ulteriore detrazione del cuneo fiscale, sotto la soglia di esenzione comunale;
 * - 40.000€: dentro la fascia 28-50k IRPEF, ulteriore detrazione in fase di decrescita
 *   (32-40k), sopra la soglia comunale;
 * - 60.000€: aliquota IRPEF massima, nessuna detrazione lavoro dipendente, nessun cuneo
 *   fiscale (RC oltre 50.000/40.000).
 *
 * La tolleranza di 2 decimali assorbe solo gli arrotondamenti in virgola mobile: i valori
 * attesi sono calcolati a mano con le stesse formule documentate in constants.ts.
 */
import { describe, expect, it } from 'vitest'
import { calculateNetSalary } from './taxEngine'

describe('calculateNetSalary', () => {
  it('RAL 25.000€', () => {
    const r = calculateNetSalary(25_000)

    expect(r.contributiInps).toBeCloseTo(2297.5, 2)
    expect(r.imponibileFiscale).toBeCloseTo(22_702.5, 2)
    expect(r.irpefLorda).toBeCloseTo(5221.575, 2)
    expect(r.detrazioneLavoroDipendente).toBeCloseTo(2394.925, 2)
    expect(r.sommaIntegrativa).toBe(0)
    expect(r.ulterioreDetrazione).toBe(1000)
    expect(r.irpefNetta).toBeCloseTo(1826.65, 2)
    expect(r.addizionaleRegionale).toBeCloseTo(306.1995, 2)
    expect(r.addizionaleComunale).toBe(0)
    expect(r.nettoAnnuo).toBeCloseTo(20_569.65, 1)
    expect(r.nettoMensile).toBeCloseTo(1582.28, 1)
  })

  it('RAL 40.000€', () => {
    const r = calculateNetSalary(40_000)

    expect(r.contributiInps).toBeCloseTo(3676, 2)
    expect(r.imponibileFiscale).toBeCloseTo(36_324, 2)
    expect(r.irpefLorda).toBeCloseTo(9186.92, 2)
    expect(r.detrazioneLavoroDipendente).toBeCloseTo(1187.33, 1)
    expect(r.sommaIntegrativa).toBe(0)
    expect(r.ulterioreDetrazione).toBeCloseTo(459.5, 1)
    expect(r.irpefNetta).toBeCloseTo(7540.09, 1)
    expect(r.addizionaleRegionale).toBeCloseTo(533.07, 1)
    expect(r.addizionaleComunale).toBeCloseTo(290.592, 2)
    expect(r.nettoAnnuo).toBeCloseTo(27_960.24, 1)
    expect(r.nettoMensile).toBeCloseTo(2150.79, 1)
  })

  it('RAL 60.000€ — fascia massima, nessuna detrazione né cuneo fiscale', () => {
    const r = calculateNetSalary(60_000)

    expect(r.contributiInps).toBeCloseTo(5514, 2)
    expect(r.imponibileFiscale).toBeCloseTo(54_486, 2)
    expect(r.irpefLorda).toBeCloseTo(15_628.98, 2)
    expect(r.detrazioneLavoroDipendente).toBe(0)
    expect(r.sommaIntegrativa).toBe(0)
    expect(r.ulterioreDetrazione).toBe(0)
    expect(r.irpefNetta).toBeCloseTo(15_628.98, 2)
    expect(r.addizionaleRegionale).toBeCloseTo(845.91, 1)
    expect(r.addizionaleComunale).toBeCloseTo(435.888, 2)
    expect(r.nettoAnnuo).toBeCloseTo(37_575.22, 1)
    expect(r.nettoMensile).toBeCloseTo(2890.4, 1)
  })

  it('la somma degli step ricostruisce esattamente il netto annuo', () => {
    for (const ral of [18_000, 25_000, 32_500, 40_000, 60_000, 90_000]) {
      const r = calculateNetSalary(ral)
      const ultimo = r.steps.at(-1)!
      expect(ultimo.id).toBe('netto')
      expect(ultimo.runningTotal).toBeCloseTo(r.nettoAnnuo, 6)
    }
  })

  it('con 14 mensilità il netto annuo resta invariato ma il mensile cambia', () => {
    const con13 = calculateNetSalary(30_000, 13)
    const con14 = calculateNetSalary(30_000, 14)

    expect(con14.nettoAnnuo).toBeCloseTo(con13.nettoAnnuo, 6)
    expect(con14.nettoMensile).toBeCloseTo(con13.nettoAnnuo / 14, 6)
    expect(con14.nettoMensile).toBeLessThan(con13.nettoMensile)
  })

  it('gestisce RAL non valide senza generare NaN', () => {
    expect(calculateNetSalary(0).nettoAnnuo).toBe(0)
    expect(calculateNetSalary(-100).nettoAnnuo).toBe(0)
    expect(Number.isNaN(calculateNetSalary(NaN).nettoAnnuo)).toBe(false)
  })
})
