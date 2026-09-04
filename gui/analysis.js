// Analytical and Export Tools for Cp Platform
const AnalysisTools = {
  // Analytical thermal absorption integral: integral of Cp dT from T1 to T2 [J/mol]
  integrateCp: function(mat, T1, T2) {
    const t1 = T1 / 1000.0;
    const t2 = T2 / 1000.0;
    // Indefinite integral: H_rel(t) = 1000 * [ A*t + B*t^2/2 + C*t^3/3 + D*t^4/4 - E/t ]
    const H = (t) => 1000.0 * (mat.A * t + (mat.B * Math.pow(t, 2)) / 2.0 + (mat.C * Math.pow(t, 3)) / 3.0 + (mat.D * Math.pow(t, 4)) / 4.0 - mat.E / t);
    const deltaH_molar = H(t2) - H(t1);
    const deltaH_specific = (deltaH_molar / mat.molarMass) * 1000.0; // J/kg
    return { deltaH_molar: deltaH_molar, deltaH_specific: deltaH_specific };
  },

  // Numerical derivative dCp/dT at temperature T [J/(mol*K^2)]
  derivativeCp: function(mat, T) {
    const t = T / 1000.0;
    // dCp/dt = B + 2*C*t + 3*D*t^2 - 2*E/t^3
    // dCp/dT = (dCp/dt) * (dt/dT) = (dCp/dt) / 1000
    const dCp_dt = mat.B + 2.0 * mat.C * t + 3.0 * mat.D * Math.pow(t, 2) - (2.0 * mat.E) / Math.pow(t, 3);
    const dCp_dT_molar = dCp_dt / 1000.0;
    const dCp_dT_specific = (dCp_dT_molar / mat.molarMass) * 1000.0;
    return { dCp_dT_molar: dCp_dT_molar, dCp_dT_specific: dCp_dT_specific };
  },

  // Rank database materials by Cp at temperature T
  rankMaterials: function(materials, T, unit, topN, ascending) {
    const scored = materials.map(m => {
      const t = T / 1000.0;
      const cp_mol = m.A + m.B * t + m.C * Math.pow(t, 2) + m.D * Math.pow(t, 3) + m.E / Math.pow(t, 2);
      const cp_val = (unit === 'molar') ? cp_mol : (cp_mol / m.molarMass) * 1000.0;
      return { material: m, cpValue: cp_val, inRange: (T >= m.Tmin && T <= m.Tmax) };
    });
    scored.sort((a, b) => ascending ? a.cpValue - b.cpValue : b.cpValue - a.cpValue);
    return scored.slice(0, topN || 10);
  },

  // Generate CSV text for plotted datasets
  generateCSV: function(T_grid, datasets, unit) {
    const unitStr = (unit === 'molar') ? 'J/(mol*K)' : 'J/(kg*K)';
    let csv = 'Temperature_K';
    datasets.forEach(ds => {
      csv += ',' + ds.label.replace(//g, '"') + ' [' + unitStr + ']';
    });
    csv += '\r\n';

    for (let i = 0; i < T_grid.length; i++) {
      let row = T_grid[i];
      for (let j = 0; j < datasets.length; j++) {
        row += ',' + datasets[j].data[i];
      }
      csv += row + '\r\n';
    }
    return csv;
  },

  // Trigger file download in browser
  downloadFile: function(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnalysisTools;
}
