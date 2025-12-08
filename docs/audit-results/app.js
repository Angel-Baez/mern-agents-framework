// Constantes
const GITHUB_API = 'https://api.github.com';
const REPO_OWNER = 'Angel-Baez';
const REPO_NAME = 'mern-agents-framework';
const EPIC_NUMBER = 7;

const AGENTS = [
  'orchestrator', 'backend-architect', 'frontend-architect',
  'data-engineer', 'solution-architect', 'security-guardian',
  'test-engineer', 'qa-lead', 'code-reviewer',
  'documentation-engineer', 'ai-integration-engineer',
  'observability-engineer', 'product-manager',
  'release-manager', 'devops-engineer'
];

// Estado global
let allCases = [];
let filteredCases = [];
let currentPage = 1;
const casesPerPage = 10;
let sortColumn = 'number';
let sortDirection = 'asc';

// Chart instances
let pieChart, agentChart, envChart, trendChart;

// Funciones de utilidad
function hasLabel(issue, labelName) {
  return issue.labels.some(label => label.name === labelName);
}

function getAgent(issue) {
  const agentLabel = issue.labels.find(label => label.name.startsWith('agent:'));
  return agentLabel ? agentLabel.name.replace('agent:', '') : 'unknown';
}

function getEnvironment(issue) {
  const envLabel = issue.labels.find(label => label.name.startsWith('env:'));
  if (envLabel) {
    const env = envLabel.name.replace('env:', '');
    return env === 'vscode' ? 'VSCode' : env === 'github' ? 'GitHub' : env;
  }
  return 'unknown';
}

function getResult(issue) {
  if (hasLabel(issue, 'case-success')) return 'success';
  if (hasLabel(issue, 'case-violation-major')) return 'major';
  if (hasLabel(issue, 'case-violation-minor')) return 'minor';
  return 'unknown';
}

function getResultEmoji(result) {
  switch (result) {
    case 'success': return '✅';
    case 'major': return '❌';
    case 'minor': return '⚠️';
    default: return '❓';
  }
}

function getResultBadge(result) {
  const emoji = getResultEmoji(result);
  const classes = {
    'success': 'badge-success',
    'major': 'badge-danger',
    'minor': 'badge-warning'
  };
  const labels = {
    'success': 'Éxito',
    'major': 'Violación Mayor',
    'minor': 'Violación Menor'
  };
  return `<span class="badge ${classes[result] || ''}">${emoji} ${labels[result] || 'Desconocido'}</span>`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function showLoading() {
  document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loading').classList.add('hidden');
}

function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  const errorText = document.getElementById('errorText');
  errorText.textContent = message;
  errorDiv.classList.remove('hidden');
}

function hideError() {
  document.getElementById('errorMessage').classList.add('hidden');
}

// Fetch audit issues
async function fetchAuditIssues() {
  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=audit&state=all&per_page=100`
    );
    
    if (!response.ok) {
      throw new Error(`Error al cargar datos: ${response.status} ${response.statusText}`);
    }
    
    const issues = await response.json();
    
    // Filtrar sub-issues (excluir epic #7)
    return issues.filter(issue => issue.number !== EPIC_NUMBER);
  } catch (error) {
    console.error('Error fetching audit issues:', error);
    throw error;
  }
}

// Render metrics
function renderMetrics() {
  const total = allCases.length;
  const successes = allCases.filter(c => getResult(c) === 'success').length;
  const majorViolations = allCases.filter(c => getResult(c) === 'major').length;
  const minorViolations = allCases.filter(c => getResult(c) === 'minor').length;
  const totalViolations = majorViolations + minorViolations;
  const successRate = total > 0 ? ((successes / total) * 100).toFixed(1) : 0;
  const violationRate = total > 0 ? ((totalViolations / total) * 100).toFixed(1) : 0;
  
  // Clasificación
  let classification = '';
  if (successRate >= 100) classification = 'A+ Perfecto';
  else if (successRate >= 97) classification = 'A - Ajuste menor';
  else if (successRate >= 90) classification = 'B - Ajuste moderado';
  else if (successRate >= 80) classification = 'C - Revisión necesaria';
  else classification = 'D - Revisión profunda';
  
  document.getElementById('totalCases').textContent = total;
  document.getElementById('totalProgress').textContent = `${total}/100`;
  document.getElementById('successCases').textContent = successes;
  document.getElementById('successRate').textContent = `${successRate}%`;
  document.getElementById('violationCases').textContent = totalViolations;
  document.getElementById('violationRate').textContent = `${violationRate}%`;
  document.getElementById('overallRate').textContent = `${successRate}%`;
  document.getElementById('classification').textContent = classification;
}

// Render pie chart
function renderPieChart() {
  const ctx = document.getElementById('pieChart').getContext('2d');
  
  if (pieChart) pieChart.destroy();
  
  const successes = allCases.filter(c => getResult(c) === 'success').length;
  const majorViolations = allCases.filter(c => getResult(c) === 'major').length;
  const minorViolations = allCases.filter(c => getResult(c) === 'minor').length;
  
  pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Éxitos', 'Violaciones Mayores', 'Violaciones Menores'],
      datasets: [{
        data: [successes, majorViolations, minorViolations],
        backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// Render agent chart
function renderAgentChart() {
  const ctx = document.getElementById('agentChart').getContext('2d');
  
  if (agentChart) agentChart.destroy();
  
  // Agrupar por agente
  const agentData = {};
  allCases.forEach(issue => {
    const agent = getAgent(issue);
    const result = getResult(issue);
    
    if (!agentData[agent]) {
      agentData[agent] = { success: 0, major: 0, minor: 0 };
    }
    
    if (result === 'success') agentData[agent].success++;
    else if (result === 'major') agentData[agent].major++;
    else if (result === 'minor') agentData[agent].minor++;
  });
  
  // Calcular totales y filtrar agentes con al menos 1 caso
  const agentTotals = {};
  const agentsWithCases = Object.keys(agentData).filter(agent => {
    const total = agentData[agent].success + agentData[agent].major + agentData[agent].minor;
    agentTotals[agent] = total;
    return total > 0;
  });
  
  // Ordenar por total de casos usando totales pre-calculados
  agentsWithCases.sort((a, b) => agentTotals[b] - agentTotals[a]);
  
  const labels = agentsWithCases;
  const successData = labels.map(agent => agentData[agent].success);
  const majorData = labels.map(agent => agentData[agent].major);
  const minorData = labels.map(agent => agentData[agent].minor);
  
  agentChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Éxitos',
          data: successData,
          backgroundColor: '#10b981'
        },
        {
          label: 'Violaciones Mayores',
          data: majorData,
          backgroundColor: '#ef4444'
        },
        {
          label: 'Violaciones Menores',
          data: minorData,
          backgroundColor: '#f59e0b'
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          stacked: true,
          ticks: {
            stepSize: 1
          }
        },
        y: {
          stacked: true
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 10,
            font: {
              size: 11
            }
          }
        }
      }
    }
  });
}

// Render environment chart
function renderEnvChart() {
  const ctx = document.getElementById('envChart').getContext('2d');
  
  if (envChart) envChart.destroy();
  
  // Agrupar por entorno
  const envData = {};
  allCases.forEach(issue => {
    const env = getEnvironment(issue);
    const result = getResult(issue);
    
    if (!envData[env]) {
      envData[env] = { success: 0, violations: 0 };
    }
    
    if (result === 'success') envData[env].success++;
    else envData[env].violations++;
  });
  
  const labels = Object.keys(envData);
  const successData = labels.map(env => envData[env].success);
  const violationData = labels.map(env => envData[env].violations);
  
  envChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Éxitos',
          data: successData,
          backgroundColor: '#10b981'
        },
        {
          label: 'Violaciones',
          data: violationData,
          backgroundColor: '#ef4444'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 12
            }
          }
        }
      }
    }
  });
}

// Render trend chart
function renderTrendChart() {
  const ctx = document.getElementById('trendChart').getContext('2d');
  
  if (trendChart) trendChart.destroy();
  
  // Ordenar por fecha
  const sortedCases = [...allCases].sort((a, b) => 
    new Date(a.created_at) - new Date(b.created_at)
  );
  
  // Calcular tasa de éxito acumulada
  const trendData = [];
  let cumulativeSuccesses = 0;
  let cumulativeTotal = 0;
  
  sortedCases.forEach(issue => {
    cumulativeTotal++;
    if (getResult(issue) === 'success') {
      cumulativeSuccesses++;
    }
    
    const successRate = (cumulativeSuccesses / cumulativeTotal) * 100;
    trendData.push({
      date: formatDate(issue.created_at),
      rate: successRate.toFixed(1)
    });
  });
  
  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: trendData.map(d => d.date),
      datasets: [
        {
          label: 'Tasa de Éxito Acumulada (%)',
          data: trendData.map(d => d.rate),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Objetivo (100%)',
          data: Array(trendData.length).fill(100),
          borderColor: '#10b981',
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 12
            }
          }
        }
      }
    }
  });
}

// Render all charts
function renderCharts() {
  renderPieChart();
  renderAgentChart();
  renderEnvChart();
  renderTrendChart();
}

// Filter cases
function filterCases() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const agentFilter = document.getElementById('agentFilter').value;
  const envFilter = document.getElementById('envFilter').value;
  const resultFilter = document.getElementById('resultFilter').value;
  
  filteredCases = allCases.filter(issue => {
    const matchesSearch = !searchTerm || 
      issue.title.toLowerCase().includes(searchTerm) ||
      issue.number.toString().includes(searchTerm);
    
    const matchesAgent = !agentFilter || getAgent(issue) === agentFilter;
    const matchesEnv = !envFilter || getEnvironment(issue) === envFilter;
    const matchesResult = !resultFilter || getResult(issue) === resultFilter;
    
    return matchesSearch && matchesAgent && matchesEnv && matchesResult;
  });
  
  currentPage = 1;
  renderTable();
  renderPagination();
}

// Sort cases
function sortCases(column) {
  if (sortColumn === column) {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn = column;
    sortDirection = 'asc';
  }
  
  filteredCases.sort((a, b) => {
    let aValue, bValue;
    
    switch (column) {
      case 'number':
        aValue = a.number;
        bValue = b.number;
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'agent':
        aValue = getAgent(a);
        bValue = getAgent(b);
        break;
      case 'env':
        aValue = getEnvironment(a);
        bValue = getEnvironment(b);
        break;
      case 'result':
        aValue = getResult(a);
        bValue = getResult(b);
        break;
      case 'date':
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  renderTable();
  updateSortIndicators();
}

// Update sort indicators
function updateSortIndicators() {
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.classList.remove('asc', 'desc');
    if (th.dataset.sort === sortColumn) {
      th.classList.add(sortDirection);
    }
  });
}

// Render table
function renderTable() {
  const tbody = document.getElementById('tableBody');
  const start = (currentPage - 1) * casesPerPage;
  const end = start + casesPerPage;
  const pageCases = filteredCases.slice(start, end);
  
  if (pageCases.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--color-text-secondary);">No se encontraron casos que coincidan con los filtros.</td></tr>';
    return;
  }
  
  tbody.innerHTML = pageCases.map(issue => `
    <tr data-url="${issue.html_url}">
      <td>${issue.number}</td>
      <td>${issue.title}</td>
      <td>${getAgent(issue)}</td>
      <td>${getEnvironment(issue)}</td>
      <td>${getResultBadge(getResult(issue))}</td>
      <td>${formatDate(issue.created_at)}</td>
    </tr>
  `).join('');
  
  // Add click handlers
  tbody.querySelectorAll('tr').forEach(tr => {
    tr.addEventListener('click', () => {
      window.open(tr.dataset.url, '_blank');
    });
  });
}

// Render pagination
function renderPagination() {
  const pagination = document.getElementById('pagination');
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);
  
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  
  let html = '';
  
  // Previous button
  html += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">← Anterior</button>`;
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += '<span style="padding: 0 0.5rem;">...</span>';
    }
  }
  
  // Next button
  html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Siguiente →</button>`;
  
  pagination.innerHTML = html;
}

// Change page
function changePage(page) {
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);
  if (page < 1 || page > totalPages) return;
  
  currentPage = page;
  renderTable();
  renderPagination();
  
  // Scroll to table
  document.getElementById('casesTable').scrollIntoView({ behavior: 'smooth' });
}

// Populate filters
function populateFilters() {
  // Agent filter
  const agentFilter = document.getElementById('agentFilter');
  const agents = [...new Set(allCases.map(getAgent))].sort();
  agents.forEach(agent => {
    const option = document.createElement('option');
    option.value = agent;
    option.textContent = agent;
    agentFilter.appendChild(option);
  });
  
  // Environment filter
  const envFilter = document.getElementById('envFilter');
  const envs = [...new Set(allCases.map(getEnvironment))].sort();
  envs.forEach(env => {
    const option = document.createElement('option');
    option.value = env;
    option.textContent = env;
    envFilter.appendChild(option);
  });
}

// Update last update time
function updateLastUpdate() {
  const now = new Date();
  document.getElementById('lastUpdate').textContent = now.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Export to PDF
async function exportToPDF() {
  try {
    const element = document.getElementById('mainContent');
    const opt = {
      margin: 10,
      filename: `audit-dashboard-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('Error exporting PDF:', error);
    showError('Error al exportar PDF. Por favor, intente de nuevo.');
  }
}

// Initialize app
async function init() {
  showLoading();
  try {
    allCases = await fetchAuditIssues();
    filteredCases = allCases;
    
    if (allCases.length === 0) {
      hideLoading();
      showError('No se encontraron casos de auditoría. Asegúrese de que los issues tienen la etiqueta "audit".');
      return;
    }
    
    renderMetrics();
    renderCharts();
    renderTable();
    renderPagination();
    populateFilters();
    updateLastUpdate();
  } catch (error) {
    console.error('Error initializing dashboard:', error);
    showError('Error al cargar los datos: ' + error.message);
  } finally {
    hideLoading();
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  init();
  
  // Refresh button
  document.getElementById('refreshBtn').addEventListener('click', () => {
    location.reload();
  });
  
  // Export button
  document.getElementById('exportBtn').addEventListener('click', exportToPDF);
  
  // Search input
  document.getElementById('searchInput').addEventListener('input', filterCases);
  
  // Filter selects
  document.getElementById('agentFilter').addEventListener('change', filterCases);
  document.getElementById('envFilter').addEventListener('change', filterCases);
  document.getElementById('resultFilter').addEventListener('change', filterCases);
  
  // Sort headers
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      sortCases(th.dataset.sort);
    });
  });
  
  // Close error button
  document.getElementById('closeError').addEventListener('click', hideError);
});
