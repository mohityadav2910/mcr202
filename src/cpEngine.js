/**
 * cpEngine.js - Thermodynamic calculation engine for NIST Shomate equation
 */
const CpEngine = {
  evaluate: function(material, T_grid) {
    const points = [];
    let hasWarning = false;
    for (let i = 0; i < T_grid.length; i++) {
      const T = T_grid[i];
      const t = T / 1000.0;
      const Cp_molar = material.A + material.B * t + material.C * Math.pow(t, 2) + material.D * Math.pow(t, 3) + material.E / Math.pow(t, 2);
      const Cp_specific = (Cp_molar / material.molarMass) * 1000.0;
      const inRange = (T >= material.Tmin && T <= material.Tmax);
      if (!inRange) hasWarning = true;
      points.push({
        T: T,
        Cp_molar: Cp_molar,
        Cp_specific: Cp_specific,
        inRange: inRange
      });
    }
    return { material: material, points: points, hasWarning: hasWarning };
  },
  generateGrid: function(Tmin, Tmax, step) {
    const grid = [];
    for (let T = Tmin; T <= Tmax; T += step) {
      grid.push(Math.round(T * 10) / 10);
    }
    return grid;
  }
};
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CpEngine;
}
