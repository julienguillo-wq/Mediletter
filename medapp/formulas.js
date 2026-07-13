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
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = F;
  if (typeof window !== 'undefined') window.MEDAPP_FORMULAS = F;
})();
