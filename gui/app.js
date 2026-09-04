// Minimal practical application logic for Cp vs T platform
let allMaterials = [];
let selectedMaterialIds = new Set([1, 2, 3]); // default Al, Cu, Fe
let chartInstance = null;
let currentTGrid = [];
let currentDatasets = [];

const colorPalette = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
];

let currentInteractionMode = 'pan'; // 'pan' or 'zoom'

// Custom crosshair vertical guideline plugin for data tips
const crosshairPlugin = {
  id: 'crosshair',
  afterDraw: (chart) => {
    if (chart.tooltip?._active?.length) {
      const activePoint = chart.tooltip._active[0];
      const ctx = chart.ctx;
      const x = activePoint.element.x;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;

      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#6e7781';
      ctx.stroke();
      ctx.restore();
    }
  }
};

async function initApp() {
  try {
    const res = await fetch('../data/materials_data.json');
    allMaterials = await res.json();
  } catch (e) {
    console.warn('Fetch failed, checking inline materialsData', e);
    if (typeof inlineMaterials !== 'undefined') allMaterials = inlineMaterials;
  }
  populateCategories();
  renderMaterialList();
  bindEvents();
  updatePlot();
}

function populateCategories() {
  const select = document.getElementById('categorySelect');
  const cats = Array.from(new Set(allMaterials.map(m => m.category))).sort();
  select.innerHTML = '<option value=ALL>-- All Categories (' + allMaterials.length + ') --</option>';
  cats.forEach(c => {
    const count = allMaterials.filter(m => m.category === c).length;
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c + ' (' + count + ')';
    select.appendChild(opt);
  });
}

function renderMaterialList() {
  const listDiv = document.getElementById('materialList');
  const search = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categorySelect').value;
  listDiv.innerHTML = '';

  const filtered = allMaterials.filter(m => {
    const matchCat = (category === 'ALL' || m.category === category);
    const matchSearch = m.name.toLowerCase().includes(search) || m.formula.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  filtered.forEach(m => {
    const item = document.createElement('div');
    item.className = 'material-item';
    const checked = selectedMaterialIds.has(m.id) ? 'checked' : '';
    item.innerHTML = '<input type=checkbox data-id=' + m.id + ' ' + checked + '> <span><b>' + m.name + '</b> (' + m.formula + ') - <small style=color:#666;>' + m.category + '</small></span>';
    item.querySelector('input').addEventListener('change', (e) => {
      if (e.target.checked) {
        selectedMaterialIds.add(m.id);
      } else {
        selectedMaterialIds.delete(m.id);
      }
      updatePlot();
    });
    listDiv.appendChild(item);
  });
}

function updatePlot() {
  const TminInput = parseFloat(document.getElementById('tMinInput').value) || 298.15;
  const TmaxInput = parseFloat(document.getElementById('tMaxInput').value) || 1200;
  const Tstep = parseFloat(document.getElementById('tStepInput').value) || 10;
  const unitRadio = document.querySelector('input[name=unit]:checked');
  const unit = unitRadio ? unitRadio.value : 'molar';

  const T_grid = [];
  for (let T = TminInput; T <= TmaxInput; T += Tstep) {
    T_grid.push(Math.round(T * 10) / 10);
  }
  currentTGrid = T_grid;

  const datasets = [];
  let colorIdx = 0;

  selectedMaterialIds.forEach(id => {
    const mat = allMaterials.find(m => m.id === id);
    if (!mat) return;
    const color = colorPalette[colorIdx % colorPalette.length];
    colorIdx++;

    const dataPoints = [];

    T_grid.forEach(T => {
      const t = T / 1000.0;
      const Cp_mol = mat.A + mat.B * t + mat.C * Math.pow(t, 2) + mat.D * Math.pow(t, 3) + mat.E / Math.pow(t, 2);
      const val = (unit === 'molar') ? Cp_mol : (Cp_mol / mat.molarMass) * 1000.0;
      dataPoints.push(Math.round(val * 100) / 100);
    });

    datasets.push({
      label: mat.name + ' (' + mat.formula + ')',
      data: dataPoints,
      borderColor: color,
      backgroundColor: color,
      fill: false,
      pointRadius: 1,
      borderWidth: 2
    });
  });
  currentDatasets = datasets;

  const warnBox = document.getElementById('warningBox');
  if (warnBox) {
    warnBox.style.display = 'none';
  }

  renderChart(T_grid, datasets, unit);
}

function updateCursorHud(event, chart, unit) {
  const hud = document.getElementById('cursorHud');
  if (!hud || !chart || !chart.scales || !chart.scales.x) return;

  const rect = chart.canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const chartArea = chart.chartArea;
  if (!chartArea || mouseX < chartArea.left || mouseX > chartArea.right || mouseY < chartArea.top || mouseY > chartArea.bottom) {
    resetCursorHud();
    return;
  }

  const exactT = chart.scales.x.getValueForPixel(mouseX);
  if (exactT === null || isNaN(exactT)) {
    resetCursorHud();
    return;
  }

  const unitStr = (unit === 'molar') ? 'J/(mol·K)' : 'J/(kg·K)';
  const t_val = exactT / 1000.0;

  let html = '<span class="hud-temp-badge">T = ' + exactT.toFixed(1) + ' K</span>';

  let count = 0;
  selectedMaterialIds.forEach(id => {
    const mat = allMaterials.find(m => m.id === id);
    if (!mat) return;
    count++;

    const cp_mol = mat.A + mat.B * t_val + mat.C * Math.pow(t_val, 2) + mat.D * Math.pow(t_val, 3) + mat.E / Math.pow(t_val, 2);
    const cp_val = (unit === 'molar') ? cp_mol : (cp_mol / mat.molarMass) * 1000.0;
    const inRange = (exactT >= mat.Tmin && exactT <= mat.Tmax);
    const color = colorPalette[(mat.id - 1) % colorPalette.length];

    html += '<span class="hud-material-chip">' +
      '<span class="chip-dot" style="background-color:' + color + '"></span>' +
      '<strong>' + mat.name + ' (' + mat.formula + '):</strong> ' +
      '<span class="chip-val">' + cp_val.toFixed(2) + ' ' + unitStr + '</span>' +
      '</span>';
  });

  if (count === 0) {
    html += '<span class="hud-placeholder">Select materials to view live cursor data tips</span>';
  }

  hud.innerHTML = html;
}

function resetCursorHud() {
  const hud = document.getElementById('cursorHud');
  if (hud) {
    hud.innerHTML = '<span class="hud-placeholder">🎯 Move cursor over plot for live temperature & Cp data tips | Scroll wheel to zoom</span>';
  }
}

function renderChart(labels, datasets, unit) {
  const ctx = document.getElementById('cpChart').getContext('2d');
  const yLabel = (unit === 'molar') ? 'Specific Heat Capacity Cp [J/(mol·K)]' : 'Specific Heat Capacity Cp [J/(kg·K)]';

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
    },
    plugins: [crosshairPlugin],
    options: {
      responsive: true,
      animation: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 12,
            font: { size: 12 }
          }
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          titleColor: '#1f2328',
          bodyColor: '#24292f',
          borderColor: '#d0d7de',
          borderWidth: 1,
          padding: 8,
          boxPadding: 4,
          usePointStyle: true,
          callbacks: {
            title: function(items) {
              if (!items.length) return '';
              return 'Temperature: ' + items[0].label + ' K';
            },
            label: function(context) {
              const unitStr = (unit === 'molar') ? 'J/(mol·K)' : 'J/(kg·K)';
              const ds = context.dataset;
              const val = context.parsed.y;
              return ' ' + ds.label + ': ' + val.toFixed(2) + ' ' + unitStr;
            }
          }
        },
        zoom: {
          pan: {
            enabled: (currentInteractionMode === 'pan'),
            mode: 'xy',
            threshold: 5
          },
          zoom: {
            wheel: {
              enabled: true,
              speed: 0.08
            },
            pinch: {
              enabled: true
            },
            drag: {
              enabled: (currentInteractionMode === 'zoom'),
              backgroundColor: 'rgba(3, 102, 214, 0.15)',
              borderColor: '#0366d6',
              borderWidth: 1
            },
            mode: 'xy'
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Temperature T [K]', font: { weight: 'bold' } },
          grid: { color: '#e1e4e8' }
        },
        y: {
          title: { display: true, text: yLabel, font: { weight: 'bold' } },
          grid: { color: '#e1e4e8' }
        }
      }
    }
  });

  const canvas = document.getElementById('cpChart');
  canvas.onmousemove = function(e) {
    updateCursorHud(e, chartInstance, unit);
  };
  canvas.onmouseleave = function() {
    resetCursorHud();
  };
}

function bindEvents() {
  document.getElementById('searchInput').addEventListener('input', renderMaterialList);
  document.getElementById('categorySelect').addEventListener('change', renderMaterialList);
  document.getElementById('tMinInput').addEventListener('change', updatePlot);
  document.getElementById('tMaxInput').addEventListener('change', updatePlot);
  document.getElementById('tStepInput').addEventListener('change', updatePlot);
  document.querySelectorAll('input[name=unit]').forEach(r => r.addEventListener('change', updatePlot));

  // Interactive zoom & pan toolbar controls
  document.getElementById('panModeBtn')?.addEventListener('click', () => {
    currentInteractionMode = 'pan';
    document.getElementById('panModeBtn').classList.add('active');
    document.getElementById('zoomModeBtn').classList.remove('active');
    if (chartInstance && chartInstance.options.plugins && chartInstance.options.plugins.zoom) {
      chartInstance.options.plugins.zoom.pan.enabled = true;
      chartInstance.options.plugins.zoom.zoom.drag.enabled = false;
      chartInstance.update('none');
    }
  });

  document.getElementById('zoomModeBtn')?.addEventListener('click', () => {
    currentInteractionMode = 'zoom';
    document.getElementById('zoomModeBtn').classList.add('active');
    document.getElementById('panModeBtn').classList.remove('active');
    if (chartInstance && chartInstance.options.plugins && chartInstance.options.plugins.zoom) {
      chartInstance.options.plugins.zoom.pan.enabled = false;
      chartInstance.options.plugins.zoom.zoom.drag.enabled = true;
      chartInstance.update('none');
    }
  });

  document.getElementById('zoomInBtn')?.addEventListener('click', () => {
    if (chartInstance && typeof chartInstance.zoom === 'function') {
      chartInstance.zoom(1.2);
    }
  });

  document.getElementById('zoomOutBtn')?.addEventListener('click', () => {
    if (chartInstance && typeof chartInstance.zoom === 'function') {
      chartInstance.zoom(0.8);
    }
  });

  document.getElementById('resetZoomBtn')?.addEventListener('click', () => {
    if (chartInstance && typeof chartInstance.resetZoom === 'function') {
      chartInstance.resetZoom();
    }
  });

  document.getElementById('clearBtn').addEventListener('click', () => {
    selectedMaterialIds.clear();
    renderMaterialList();
    updatePlot();
  });

  document.getElementById('exportCsvBtn').addEventListener('click', () => {
    const unit = document.querySelector('input[name=unit]:checked')?.value || 'molar';
    const csvContent = AnalysisTools.generateCSV(currentTGrid, currentDatasets, unit);
    AnalysisTools.downloadFile(csvContent, 'Cp_vs_T_data_export.csv', 'text/csv;charset=utf-8;');
  });

  document.getElementById('exportPngBtn').addEventListener('click', () => {
    const canvas = document.getElementById('cpChart');
    const imageURI = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = imageURI;
    a.download = 'Cp_vs_T_Plot.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}

window.addEventListener('DOMContentLoaded', initApp);
