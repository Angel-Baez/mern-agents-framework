#!/usr/bin/env node

/**
 * Generate Audit Report Script
 * 
 * Takes analyzed audit data and generates formatted markdown reports,
 * ASCII charts, quality badges, and updates the audit history.
 * 
 * Usage:
 *   node scripts/generate-audit-report.js                    # Generate from latest analysis
 *   node scripts/generate-audit-report.js --input data.json  # Generate from specific file
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG_PATH = path.join(__dirname, 'audit-config.json');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    input: null,
    outputDir: null,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--input':
        options.input = args[++i];
        break;
      case '--output-dir':
        options.outputDir = args[++i];
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
    }
  }

  return options;
}

/**
 * Display help message
 */
function showHelp() {
  console.log(`
📝 Generate Audit Report - MERN Agents Framework

Usage:
  node scripts/generate-audit-report.js [options]

Options:
  --input <path>       Input JSON file with analysis data
  --output-dir <path>  Output directory for reports
  --help, -h           Show this help message

Examples:
  node scripts/generate-audit-report.js
  node scripts/generate-audit-report.js --input analysis.json
`);
}

/**
 * Generate ASCII progress bar
 */
function generateProgressBar(percentage, width = 20) {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `[${bar}] ${percentage.toFixed(1)}%`;
}

/**
 * Generate ASCII bar chart for agents
 */
function generateASCIIBarChart(agents, maxWidth = 30) {
  const lines = [];
  const maxNameLength = Math.max(...agents.map(a => a.displayName?.length || a.name.length));
  
  for (const agent of agents) {
    const name = (agent.displayName || agent.name).padEnd(maxNameLength);
    const barWidth = Math.round((agent.successRate / 100) * maxWidth);
    const bar = '█'.repeat(barWidth);
    const icon = agent.successRate >= 90 ? '✅' : agent.successRate >= 70 ? '⚠️' : '❌';
    lines.push(`${name} │ ${bar.padEnd(maxWidth)} ${agent.successRate.toFixed(1)}% ${icon}`);
  }
  
  return lines.join('\n');
}

/**
 * Generate SVG quality badge
 */
function generateQualityBadge(grade, successRate, badgeColor) {
  const text = `Quality-${grade} (${successRate}%)`;
  const textWidth = text.length * 7;
  const labelWidth = 50;
  const totalWidth = labelWidth + textWidth + 20;
  
  // Color mapping for badge colors
  const colorMap = {
    brightgreen: '#4c1',
    green: '#97CA00',
    yellow: '#dfb317',
    orange: '#fe7d37',
    red: '#e05d44'
  };
  const fillColor = colorMap[badgeColor] || '#e05d44';
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
  <linearGradient id="smooth" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="round">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#round)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${textWidth + 20}" height="20" fill="${fillColor}"/>
    <rect width="${totalWidth}" height="20" fill="url(#smooth)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="${labelWidth / 2}" y="15" fill="#010101" fill-opacity=".3">Quality</text>
    <text x="${labelWidth / 2}" y="14">Quality</text>
    <text x="${labelWidth + (textWidth + 20) / 2}" y="15" fill="#010101" fill-opacity=".3">${grade} (${successRate}%)</text>
    <text x="${labelWidth + (textWidth + 20) / 2}" y="14">${grade} (${successRate}%)</text>
  </g>
</svg>`;
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(data) {
  const { metadata, globalMetrics, agentMetrics, environmentComparison, violationBreakdown, topAgents, bottomAgents } = data;
  
  const gradeEmoji = {
    'A+': '🏆',
    'A': '🥇',
    'B': '🥈',
    'C': '🥉',
    'D': '📉'
  };

  const report = `# 📊 Reporte de Auditoría #${metadata.issueNumber}

**Fecha:** ${metadata.date}  
**Entorno:** ${config.environments.find(e => e.id === metadata.environment)?.name || metadata.environment}  
**Total de usos:** ${metadata.totalUses}  
**Violaciones:** ${metadata.totalViolations}  
**Generado:** ${new Date(metadata.generatedAt).toLocaleString('es-ES')}

---

## ${gradeEmoji[globalMetrics.grade] || '📊'} Calificación Global: ${globalMetrics.grade} (${globalMetrics.successRate}% éxito)

${globalMetrics.gradeDescription}

### Métricas Principales

\`\`\`
Tasa de Éxito: ${generateProgressBar(globalMetrics.successRate)}
Violaciones:   ${metadata.totalViolations}/${metadata.totalUses} (${globalMetrics.violationRate}%)
Objetivo:      0 violaciones
\`\`\`

- ✅ **Tasa de éxito:** ${globalMetrics.successRate}%
- ❌ **Violaciones:** ${metadata.totalViolations}/${metadata.totalUses} (${globalMetrics.violationRate}%)
- 🎯 **Objetivo:** 0 violaciones

---

## 👥 Agentes Evaluados

### Tabla de Resultados

| Agente | Rol | Usos | Violaciones | % Éxito | Estado |
|--------|-----|------|-------------|---------|--------|
${agentMetrics.map(agent => {
  const icon = agent.successRate >= 100 ? '✅' : agent.successRate >= 90 ? '⚠️' : '❌';
  return `| ${agent.displayName || agent.name} | ${agent.role} | ${agent.uses} | ${agent.violations} | ${agent.successRate.toFixed(1)}% | ${icon} |`;
}).join('\n')}

### Gráfico de Rendimiento

\`\`\`
${generateASCIIBarChart(agentMetrics.sort((a, b) => b.successRate - a.successRate))}
\`\`\`

---

## 🏆 Ranking de Agentes

### Top 5 (Mejor Rendimiento)

${topAgents.map((agent, i) => `${i + 1}. **${agent.displayName || agent.name}** - ${agent.successRate.toFixed(1)}% éxito (${agent.uses} usos)`).join('\n')}

### Bottom 5 (Necesitan Mejora)

${bottomAgents.map((agent, i) => `${i + 1}. **${agent.displayName || agent.name}** - ${agent.successRate.toFixed(1)}% éxito (${agent.violations} violaciones)`).join('\n')}

---

## 🖥️ Comparación por Entorno

${Object.entries(environmentComparison).length > 0 ? 
  Object.entries(environmentComparison).map(([env, data]) => 
    `### ${data.name}\n- **Usos:** ${data.uses}\n- **Violaciones:** ${data.violations}\n- **Tasa de éxito:** ${data.successRate}%`
  ).join('\n\n') : 
  '_No hay datos comparativos de entornos disponibles_'
}

---

## ❌ Tipos de Violación

${Object.entries(violationBreakdown).filter(([, count]) => count > 0).length > 0 ?
  Object.entries(violationBreakdown)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([type, count], i) => {
      const violationType = config.violationTypes.find(v => v.id === type);
      return `${i + 1}. **${violationType?.name || type}** (${count} casos)\n   _${violationType?.description || ''}_`;
    }).join('\n\n') :
  '✅ No se detectaron violaciones categorizadas'
}

---

## 📋 Recomendaciones

${bottomAgents.filter(a => a.successRate < 100).map(agent => {
  const agentConfig = config.agents.find(a => a.id === agent.name);
  return `### ${agent.displayName || agent.name}
- **Problema:** ${agent.violations} violación(es) en ${agent.uses} usos
- **Acciones sugeridas:**
  - Reforzar meta-instrucciones específicas del rol
  - Agregar más ejemplos negativos basados en violaciones detectadas
  - Revisar lista de herramientas prohibidas: ${agentConfig?.forbiddenTools?.join(', ') || 'N/A'}`;
}).join('\n\n') || '✅ Todos los agentes funcionan correctamente'}

---

## 🏷️ Badge de Calidad

![Quality Badge](https://img.shields.io/badge/Quality-${globalMetrics.grade}%20(${globalMetrics.successRate}%25)-${globalMetrics.badgeColor})

### Badge Local

\`\`\`html
<img src="badges/quality-badge.svg" alt="Quality: ${globalMetrics.grade} (${globalMetrics.successRate}%)">
\`\`\`

---

## 📈 Historial

Ver [audit-history.json](./audit-history.json) para el historial completo de auditorías.

---

_Reporte generado automáticamente por [MERN Agents Framework](https://github.com/Angel-Baez/mern-agents-framework)_
`;

  return report;
}

/**
 * Update audit history
 */
function updateAuditHistory(data, historyPath) {
  let history = { audits: [] };
  
  try {
    if (fs.existsSync(historyPath)) {
      history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    }
  } catch {
    // Start fresh if file is corrupted
  }

  // Add new entry
  const entry = {
    auditId: data.metadata.auditId,
    issueNumber: data.metadata.issueNumber,
    date: data.metadata.date,
    environment: data.metadata.environment,
    successRate: data.globalMetrics.successRate,
    violations: data.metadata.totalViolations,
    grade: data.globalMetrics.grade,
    totalUses: data.metadata.totalUses
  };

  // Remove duplicate if exists
  history.audits = history.audits.filter(a => a.auditId !== entry.auditId);
  
  // Add to beginning
  history.audits.unshift(entry);
  
  // Keep last 50 audits
  history.audits = history.audits.slice(0, 50);
  
  // Update summary
  history.summary = {
    totalAudits: history.audits.length,
    averageSuccessRate: parseFloat((history.audits.reduce((sum, a) => sum + a.successRate, 0) / history.audits.length).toFixed(2)),
    lastUpdated: new Date().toISOString()
  };

  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  return history;
}

/**
 * Main function
 */
async function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  // Determine input file
  const inputPath = options.input || path.join(__dirname, '..', config.output.reportsDir, 'latest-analysis.json');
  
  // Check if input exists
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Input file not found: ${inputPath}`);
    console.log('💡 Run audit-analyzer.js first to generate analysis data');
    process.exit(1);
  }

  // Load analysis data
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  console.log(`📂 Loaded analysis data from ${inputPath}`);

  // Determine output directory
  const outputDir = options.outputDir || path.join(__dirname, '..', config.output.reportsDir);
  fs.mkdirSync(path.join(outputDir, 'badges'), { recursive: true });

  // Generate markdown report
  const markdownReport = generateMarkdownReport(data);
  const reportPath = path.join(outputDir, 'latest-report.md');
  fs.writeFileSync(reportPath, markdownReport);
  console.log(`✅ Markdown report saved to ${reportPath}`);

  // Generate quality badge
  const badge = generateQualityBadge(
    data.globalMetrics.grade,
    data.globalMetrics.successRate,
    data.globalMetrics.badgeColor
  );
  const badgePath = path.join(outputDir, 'badges', 'quality-badge.svg');
  fs.writeFileSync(badgePath, badge);
  console.log(`✅ Quality badge saved to ${badgePath}`);

  // Update audit history
  const historyPath = path.join(outputDir, 'audit-history.json');
  const history = updateAuditHistory(data, historyPath);
  console.log(`✅ Audit history updated at ${historyPath}`);
  console.log(`   Total audits in history: ${history.summary.totalAudits}`);
  console.log(`   Average success rate: ${history.summary.averageSuccessRate}%`);

  // Summary
  console.log('\n📊 Report Summary:');
  console.log(`   Grade: ${data.globalMetrics.grade}`);
  console.log(`   Success Rate: ${data.globalMetrics.successRate}%`);
  console.log(`   Violations: ${data.metadata.totalViolations}`);
  console.log(`   ${data.globalMetrics.gradeDescription}`);

  return {
    reportPath,
    badgePath,
    historyPath,
    data
  };
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

// Export for use as module
module.exports = {
  generateMarkdownReport,
  generateQualityBadge,
  generateProgressBar,
  generateASCIIBarChart,
  updateAuditHistory
};
