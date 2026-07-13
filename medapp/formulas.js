/**
 * Formules natives réécrites (phase C) — utilisées par le moteur de rendu ET
 * vérifiées au harnais (pipeline/verify_native.js) contre le JS medicalcul original.
 *
 * Chaque entrée : { out: '<champ de sortie du JS original>', fn: (v) => nombre }
 * où v = { <variable>: valeur } (radios/selects/nombres = valeur numérique ;
 * cases à cocher = 1 si cochée, 0 sinon).
 *
 * RÈGLE : une formule n'est activée en prod que si verify_native l'a validée
 * (identique au JS original sur 100 vecteurs) -> statut CALCULE_VERIFIE.
 */
(function () {
  const F = {
    // Index ROX = (SpO2/FiO2) / FR
    roxindex: {
      out: 'Resultat',
      fn: v => (v.vSaO2 / (v.vFiO2 / 100)) / v.vFR,
    },
    // Delta PP = 100 * (PPmax - PPmin) / ((PPmax + PPmin)/2)
    deltapp: {
      out: 'Resultat',
      fn: v => {
        const PPmax = v.vPSMax - v.vPDMax, PPmin = v.vPSMin - v.vPDMin;
        return 100 * (PPmax - PPmin) / ((PPmax + PPmin) / 2);
      },
    },
    // Score d'Apfel (NVPO) = somme de 4 items binaires (sortie: Score)
    apfel: {
      out: 'Score',
      fn: v => (v.vItem0 ? 1 : 0) + (v.vItem1 ? 1 : 0) + (v.vItem2 ? 1 : 0) + (v.vItem3 ? 1 : 0),
    },
    // Aldrete = somme vItem1..vItem5 (vItem6 = score modifié, exclu du score de base)
    aldrete: {
      out: 'Resultat',
      fn: v => (v.vItem1 || 0) + (v.vItem2 || 0) + (v.vItem3 || 0) + (v.vItem4 || 0) + (v.vItem5 || 0),
    },
    // Score HOPE (arrêt hypothermique) — probabilité de survie (%)
    hope: {
      out: 'Resultat',
      fn: v => {
        const vSexe = v.vHomme ? 1 : 0;
        const vMeca = v.vAsphPos ? 1 : 0;
        let vTemp = v.vTemp;
        if (v.vTempUnit == 1) vTemp = (vTemp - 32) / 1.8;
        const H = 2.44 - (0.0191 * v.vAge) - (1.55 * vSexe) - (1.95 * vMeca)
          - (0.573 * Math.log2(v.vDuree)) + (0.937 * vTemp)
          - (0.0247 * vTemp * vTemp) - (2.07 * Math.log2(v.vKplus));
        return Math.round(Math.exp(H) / (1 + Math.exp(H)) * 1000) / 10;
      },
    },
    // APACHE II — score (vItem1..13 + points rénaux doublés si IRA + (15 - GCS))
    apache2: {
      out: 'Resultat',
      fn: v => {
        let Res = 0;
        for (let i = 1; i < 14; i++) Res += (v['vItem' + i] || 0);
        if (v.vIRA) Res += (v.vItem10 || 0);
        Res += 15 - v.vGCS;
        return Res;
      },
    },
    // ---- Cardio (lot C2) ----
    pam: { out: 'Resultat', fn: v => Math.floor((v.vPAS + 2 * v.vPAD) / 3 + 0.5) },
    chevillebrasidx: { out: 'Resultat', fn: v => v.vPASC / v.vPASB },
    chads2: { out: 'Resultat', fn: v => v.vItemC + v.vItemH + v.vItemA + v.vItemD + 2 * v.vItemS },
    cha2ds2va: { out: 'Resultat', fn: v => v.vItemC + v.vItemH + 2 * v.vItemA2 + v.vItemD + 2 * v.vItemS + v.vItemV + v.vItemA },
    cha2ds2vasc: {
      out: 'Resultat',
      fn: v => {
        let r = v.vItemC + v.vItemH + 2 * v.vItemA2 + v.vItemD + 2 * v.vItemS + v.vItemV + v.vItemA;
        if ((v.vItemA2 || v.vItemA) && v.vItemSc) r += 1;
        return r;
      },
    },
    hasbled: { out: 'Resultat', fn: v => v.vItemH + v.vItemA1 + v.vItemA2 + v.vItemS + v.vItemB + v.vItemL + v.vItemE + v.vItemD1 + v.vItemD2 },
    timinst: { out: 'Resultat', fn: v => v.vItem1 + v.vItem2 + v.vItem3 + v.vItem4 + v.vItem5 + v.vItem6 + v.vItem7 },
    villalta: { out: 'Resultat', fn: v => { let r = 0; for (let i = 1; i < 12; i++) r += (v['vItem' + i] || 0); return r; } },
    stesmith3v: { out: 'Resultat', fn: v => Math.round((v.vSTE60 * 1.196 + v.vQTc * 0.059 - v.vRV4 * 0.326) * 100) / 100 },
    stesmith4v: { out: 'Resultat', fn: v => Math.round((v.vQTc * 0.052 - v.vQRSV2 * 0.151 - v.vRV4 * 0.268 + v.vSTE60 * 1.062) * 100) / 100 },
    // ---- Néphro (lot C3) — vCrUnit/vUreeUnit… = facteur de conversion d'unité (input) ----
    cockcroft: { out: 'Resultat', fn: v => ((140 - v.vAge) * v.vPoids * (v.vFemme ? 1.04 : 1.23)) / (v.vCreat * v.vCrUnit) },
    schwartz: { out: 'Resultat', fn: v => (v.vAge * v.vTaille) / (v.vCreat * v.vCrUnit) }, // vAge = constante K (radio)
    uvsurp: { out: 'Resultat', fn: v => ((v.vCreatU * v.vCrUnitU * 1000) * v.vVolume) / ((v.vCreatP * v.vCrUnitP) * (v.vDuree * 60)) },
    fractexcret_na: { out: 'Resultat', fn: v => 100 * (v.vCreatP * v.vVarU) / (v.vVarP * v.vCreatU) },
    fractexcret_uree: { out: 'Resultat', fn: v => 100 * (v.vCreatP * v.vVarU) / (v.vVarP * v.vCreatU) },
    fractexcret_au: { out: 'Resultat', fn: v => 100 * (v.vCreatP * v.vVarU) / (v.vVarP * v.vCreatU) },
    diurese_horaire: { out: 'Resultat', fn: v => (v.vDiur / v.vPoids) / (v.vDurH + v.vDurM / 60) },
    osmourine: { out: 'Resultat', fn: v => 2 * v.vNa + 2 * v.vK + v.vGly * v.vGlyUnit + v.vUree * v.vUreeUnit },
    idx_excretion_uree: { out: 'Resultat', fn: v => Math.round(1000 * (v.vUree * v.vUreeUnit) * (v.vDiurese * v.vDiureseUnit) / v.vPoids) / 1000 },
    // ---- Pneumo + Neuro (lot C4) ----
    pafio2: { out: 'Resultat', fn: v => v.vPaO2 * v.vPaUnit * 100 / v.vFiO2 },
    winter: { out: 'Resultat', fn: v => v.vHCO3 * 1.5 + 8 },
    // cases = binaire (1/0) ; les points PESI sont codés ici (valeurs source 10,30,10,10,20,30,20,20,60,20)
    pesi: { out: 'Resultat', fn: v => v.vAge + 10 * v.vItem0 + 30 * v.vItem1 + 10 * v.vItem2 + 10 * v.vItem3 + 20 * v.vItem4 + 30 * v.vItem5 + 20 * v.vItem6 + 20 * v.vItem7 + 60 * v.vItem8 + 20 * v.vItem9 },
    crbu65: { out: 'ResCRBU', fn: v => v.vItem0 + v.vItem1 + v.vItem2 + v.vItem3 + v.vItem4 }, // CRB-65 (avec âge)
    nihss: { out: 'Resultat', fn: v => Object.values(v).reduce((a, b) => a + (Number(b) || 0), 0) },
    // ---- Général (lot C5) ----
    bmi: { out: 'Resultat', fn: v => v.vPoids / Math.pow(v.vTaille / 100, 2) },
    surfacecorpo: { out: 'Resultat', fn: v => { const P = v.vPoids * 1000, T = v.vTaille; return 0.0003207 * Math.pow(P, (0.7285 - (0.0188 * Math.log(P) / Math.log(10)))) * Math.pow(T, 0.3); } },
    kcorrigee: { out: 'Resultat', fn: v => Math.round(10 * (v.vK - 6 * (7.4 - v.vPH))) / 10 },
    homa_ir: { out: 'Resultat', fn: v => Math.round(100 * (v.vGly * v.vGlyUnit) * v.vInsu / 22.5) / 100 },
    fib4: { out: 'Resultat', fn: v => Math.round((v.vAge * v.vASAT) / (v.vPlq * Math.sqrt(v.vALAT)) * 1000) / 1000 },
    apri: { out: 'Resultat', fn: v => { let ref = v.vASATRef; if (ref < 1) ref = 40; return (v.vASAT * 100 / ref) / v.vPlq; } },
    corr_gb_pl: { out: 'Resultat', fn: v => Math.round(((v.vLeucoLCR * v.vLeucoLCRUnit) - (((v.vLeucoSNG * v.vLeucoSNGUnit) * (v.vHemaLCR * v.vHemaLCRUnit)) / ((v.vHemaSNG * v.vHemaSNGUnit) * 1000000))) * 10) / 10 },
    harveybradshaw: { out: 'Resultat', fn: v => Math.floor(v.vNSel) + (v.vItem || 0) + v.vItem1 + v.vItem2 + v.vItem3 + v.vItemC0 + v.vItemC1 + v.vItemC2 + v.vItemC3 + v.vItemC4 + v.vItemC5 + v.vItemC6 + v.vItemC7 },
    ranson: { out: 'Resultat', fn: v => Object.values(v).reduce((a, b) => a + (Number(b) || 0), 0) },
    lille: { out: 'Resultat', fn: v => { const IR = (v.vCreat * v.vCrUnit) > 115 ? 1 : 0; const R = 3.19 - 0.101 * v.vAge + 0.147 * v.vAlb + 0.0165 * (v.vBili0 - v.vBili7) - 0.206 * IR - 0.0065 * v.vBili0 - 0.0096 * v.vTP; return Math.exp(-R) / (1 + Math.exp(-R)); } },
    nafld: { out: 'Resultat', fn: v => { const BMI = v.vPoids / Math.pow(v.vTaille / 100, 2); const r = -1.675 + 0.037 * v.vAge + 0.094 * BMI + 1.13 * (v.vDiab ? 1 : 0) + 0.99 * v.vASAT / v.vALAT - 0.013 * v.vPlaq - 0.066 * v.vAlb; return Math.round(r * 1000) / 1000; } },
    def_eaulibre: { out: 'Resultat', fn: v => v.vPoids * v.vItem1 * ((v.vNa / 140) - 1) },
    albcrp: { out: 'Resultat', fn: v => v.vAlb + (v.vCRP / 25) },
    trouanioniqueu: { out: 'Resultat', fn: v => v.vNa + v.vK - v.vCl },
    mgap: { out: 'Resultat', fn: v => v.vGCS + v.vItem1 + v.vItem2 + v.vItem3 },
    fructo_hba1c: { out: 'Resultat', fn: v => v.vFructo ? (0.017 * v.vSrc + 1.61) : ((v.vSrc - 1.61) / 0.017) },
    // ---- Général (lot C6) ----
    albi: { out: 'Resultat', fn: v => Math.round(((Math.log10(v.vBili * v.vBiliUnit) * 0.66) + ((v.vAlb * v.vAlbUnit) * -0.085)) * 100) / 100 },
    das28: { out: 'Resultat', fn: v => { let r = 0.56 * Math.sqrt(v.vNAD) + 0.28 * Math.sqrt(v.vNAG) + 0.014 * v.vEGP; r += v.vVS ? (0.7 * Math.log(v.vVSCRP)) : (0.36 * Math.log(v.vVSCRP + 1) + 0.96); return r; } },
    dlqi: { out: 'Resultat', fn: v => { let r = v.vItem7a; if (r === 0) r = v.vItem7b; for (let i = 1; i < 11; i++) if (i !== 7) r += v['vItem' + i]; return r; } },
    epices: { out: 'Resultat', fn: v => { let r = 75.14; for (let i = 1; i < 12; i++) r += v['vItem' + i]; return r; } },
    higham: { out: 'Resultat', fn: v => v.vVar1 + 5 * v.vVar2 + 10 * v.vVar3 + 20 * v.vVar4 + v.vVarC1 + 5 * v.vVarC2 },
    n4tscore: { out: 'Resultat', fn: v => Object.values(v).reduce((a, b) => a + (Number(b) || 0), 0) },
    nrs2002: { out: 'Resultat', fn: v => { const e1 = v.vItemA1 + v.vItemA2 + v.vItemA3 + v.vItemA4; return e1 > 0 ? (v.vItemB1 + v.vItemB2 + v.vItemB3) : 0; } },
    meds: { out: 'Resultat', fn: v => 6 * v.vItemMT + 3 * (v.vItemFR + v.vItemCS + v.vItemPlq + v.vItemGB + v.vItemAge) + 2 * (v.vItemPN + v.vItemMDR + v.vItemFS) },
    sdai: { out: 'Resultat', fn: v => (v.vNAD > 28 || v.vNAG > 28) ? NaN : (v.vNAD + v.vNAG + v.vEGP + v.vEGM + v.vCRP / 10) },
    packyear: { out: 'Resultat', fn: v => { const fm = [1 / 20, 4 / 20, 2 / 20, 4 / 20, 2.5 / 20, 2 / 175, 2 / 7, 0.1786]; return Math.round(v.vConso * v.vAnnees * fm[v.vTabac] * 10) / 10; } },
    pasi: { out: 'Resultat', fn: v => 0.1 * (v.vItem1a + v.vItem1b + v.vItem1c) * v.vItem1d + 0.2 * (v.vItem2a + v.vItem2b + v.vItem2c) * v.vItem2d + 0.3 * (v.vItem3a + v.vItem3b + v.vItem3c) * v.vItem3d + 0.4 * (v.vItem4a + v.vItem4b + v.vItem4c) * v.vItem4d },
    absi: { out: 'Resultat', fn: v => { let r = v.vFemme ? 1 : 0; r += v.vAge + v.vSurface + (v.vDeg3 ? 1 : 0); const K = v.vBP1 + v.vBP2 + v.vBP3 + v.vBP4; if (K > 1) r += 1; return r; } },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = F;
  if (typeof window !== 'undefined') window.MEDAPP_FORMULAS = F;
})();
