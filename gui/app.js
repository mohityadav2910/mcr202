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
  const warningMsgs = [];
  let colorIdx = 0;

  selectedMaterialIds.forEach(id => {
    const mat = allMaterials.find(m => m.id === id);
    if (!mat) return;
    const color = colorPalette[colorIdx % colorPalette.length];
    colorIdx++;

    const dataPoints = [];
    let hasExtrap = false;

    T_grid.forEach(T => {
      const t = T / 1000.0;
      const Cp_mol = mat.A + mat.B * t + mat.C * Math.pow(t, 2) + mat.D * Math.pow(t, 3) + mat.E / Math.pow(t, 2);
      const val = (unit === 'molar') ? Cp_mol : (Cp_mol / mat.molarMass) * 1000.0;
      dataPoints.push(Math.round(val * 100) / 100);
      if (T < mat.Tmin || T > mat.Tmax) hasExtrap = true;
    });

    if (hasExtrap) {
      warningMsgs.push(mat.name + ' (' + mat.formula + '): valid range is [' + mat.Tmin + ' - ' + mat.Tmax + ' K]. Current plot [' + TminInput + ' - ' + TmaxInput + ' K] includes extrapolation.');
    }

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
  if (warningMsgs.length > 0) {
    warnBox.style.display = 'block';
    warnBox.innerHTML = '<b>Temperature Range Warning:</b><br>' + warningMsgs.join('<br>');
  } else {
    warnBox.style.display = 'none';
  }

  renderChart(T_grid, datasets, unit);
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
    options: {
      responsive: true,
      animation: false,
      interaction: {
        mode: 'index',
        intersect: false
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
}

function bindEvents() {
  document.getElementById('searchInput').addEventListener('input', renderMaterialList);
  document.getElementById('categorySelect').addEventListener('change', renderMaterialList);
  document.getElementById('tMinInput').addEventListener('change', updatePlot);
  document.getElementById('tMaxInput').addEventListener('change', updatePlot);
  document.getElementById('tStepInput').addEventListener('change', updatePlot);
  document.querySelectorAll('input[name=unit]').forEach(r => r.addEventListener('change', updatePlot));

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
