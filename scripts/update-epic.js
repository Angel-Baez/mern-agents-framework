#!/usr/bin/env node

const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = 'Angel-Baez';
const repo = 'mern-agents-framework';
const epicNumber = 7;

async function updateEpic() {
  try {
    // Obtener todos los sub-issues de auditoría
    const { data: allIssues } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      labels: 'audit',
      state: 'all',
      per_page: 100
    });

    // Filtrar sub-issues (excluir el epic)
    const subIssues = allIssues.filter(issue => issue.number !== epicNumber);

    // Calcular métricas
    const total = subIssues.length;
    const successes = subIssues.filter(i =>
      i.labels.some(l => l.name === 'case-success')
    ).length;
    const majorViolations = subIssues.filter(i =>
      i.labels.some(l => l.name === 'case-violation-major')
    ).length;
    const minorViolations = subIssues.filter(i =>
      i.labels.some(l => l.name === 'case-violation-minor')
    ).length;
    const successRate = total > 0 ? ((successes / total) * 100).toFixed(1) : 0;

    // Métricas por agente
    const agentStats = {};
    const agentLabels = [
      'orchestrator', 'backend-architect', 'frontend-architect',
      'data-engineer', 'solution-architect', 'security-guardian',
      'test-engineer', 'qa-lead', 'code-reviewer',
      'documentation-engineer', 'ai-integration-engineer',
      'observability-engineer', 'product-manager',
      'release-manager', 'devops-engineer'
    ];

    agentLabels.forEach(agent => {
      const agentIssues = subIssues.filter(i =>
        i.labels.some(l => l.name === `agent:${agent}`)
      );
      const agentSuccesses = agentIssues.filter(i =>
        i.labels.some(l => l.name === 'case-success')
      ).length;

      if (agentIssues.length > 0) {
        agentStats[agent] = {
          total: agentIssues.length,
          successes: agentSuccesses,
          violations: agentIssues.length - agentSuccesses,
          rate: ((agentSuccesses / agentIssues.length) * 100).toFixed(0)
        };
      }
    });

    // Métricas por entorno
    const vscodeIssues = subIssues.filter(i =>
      i.labels.some(l => l.name === 'env:vscode')
    );
    const githubIssues = subIssues.filter(i =>
      i.labels.some(l => l.name === 'env:github-copilot')
    );

    const vscodeViolations = vscodeIssues.filter(i =>
      i.labels.some(l => l.name.includes('violation'))
    ).length;
    const githubViolations = githubIssues.filter(i =>
      i.labels.some(l => l.name.includes('violation'))
    ).length;

    // Generar tabla de agentes
    let agentTable = '| Agente | Casos | Éxitos | Violaciones | % Éxito |\n';
    agentTable += '|--------|-------|--------|-------------|---------|\\n';

    Object.entries(agentStats)
      .sort((a, b) => b[1].rate - a[1].rate)
      .forEach(([agent, stats]) => {
        const emoji = stats.rate == 100 ? '🏆' : stats.rate >= 50 ? '⚠️' : '❌';
        agentTable += `| ${agent} | ${stats.total} | ${stats.successes} | ${stats.violations} | ${stats.rate}% ${emoji} |\\n`;
      });

    // Agrupar sub-issues por resultado
    const successIssues = subIssues.filter(i =>
      i.labels.some(l => l.name === 'case-success')
    );
    const majorIssues = subIssues.filter(i =>
      i.labels.some(l => l.name === 'case-violation-major')
    );
    const minorIssues = subIssues.filter(i =>
      i.labels.some(l => l.name === 'case-violation-minor')
    );

    // Generar listas de sub-issues
    let successList = successIssues.map(i =>
      `- #${i.number} - ${i.title}`
    ).join('\\n');

    let majorList = majorIssues.map(i =>
      `- #${i.number} - ${i.title}`
    ).join('\\n');

    let minorList = minorIssues.map(i =>
      `- #${i.number} - ${i.title}`
    ).join('\\n');

    // Generar clasificación
    let classification = '';
    const totalViolations = majorViolations + minorViolations;
    if (totalViolations === 0) {
      classification = '- [x] 0 fallos – A+ Perfecto\\n- [ ] 1-3 fallos – Ajuste menor\\n- [ ] 4-10 fallos – Ajuste moderado\\n- [ ] 11+ fallos – Revisión profunda';
    } else if (totalViolations <= 3) {
      classification = '- [ ] 0 fallos – A+ Perfecto\\n- [x] 1-3 fallos – Ajuste menor (estamos aquí)\\n- [ ] 4-10 fallos – Ajuste moderado\\n- [ ] 11+ fallos – Revisión profunda';
    } else if (totalViolations <= 10) {
      classification = '- [ ] 0 fallos – A+ Perfecto\\n- [ ] 1-3 fallos – Ajuste menor\\n- [x] 4-10 fallos – Ajuste moderado (estamos aquí)\\n- [ ] 11+ fallos – Revisión profunda';
    } else {
      classification = '- [ ] 0 fallos – A+ Perfecto\\n- [ ] 1-3 fallos – Ajuste menor\\n- [ ] 4-10 fallos – Ajuste moderado\\n- [x] 11+ fallos – Revisión profunda (estamos aquí)';
    }

    // Calcular porcentajes y tasas
    const vscodeSuccessRate = vscodeIssues.length > 0 ? (((vscodeIssues.length - vscodeViolations) / vscodeIssues.length) * 100).toFixed(0) : 0;
    const githubSuccessRate = githubIssues.length > 0 ? (((githubIssues.length - githubViolations) / githubIssues.length) * 100).toFixed(0) : 0;
    const progressPercent = ((total / 100) * 100).toFixed(0);
    const majorViolationsPercent = total > 0 ? ((majorViolations / total) * 100).toFixed(0) : 0;
    const minorViolationsPercent = total > 0 ? ((minorViolations / total) * 100).toFixed(0) : 0;

    const classificationText = totalViolations === 0 ? 'A+ Perfecto' : totalViolations <= 3 ? 'Ajuste menor' : totalViolations <= 10 ? 'Ajuste moderado' : 'Revisión profunda';

    // Construir el body actualizado del Epic
    const epicBody = `# 📊 [EPIC] Auditoría de 100 Usos - Framework de 15 Agentes

Ciclo: 2025-12-06
Objetivo: 0 violaciones en 100 usos reales
Progreso: ${total}/100 casos (${progressPercent}%)

---

## 📈 Métricas Globales

| Métrica | Valor | Porcentaje |
|---------|-------|------------|
| Casos completados | ${total}/100 | ${progressPercent}% |
| Éxitos totales | ${successes} | ${successRate}% |
| Violaciones mayores | ${majorViolations} | ${majorViolationsPercent}% |
| Violaciones menores | ${minorViolations} | ${minorViolationsPercent}% |
| Tasa de cumplimiento perfecto | ${successRate}% | - |

---

## 🤖 Rendimiento por Agente

${agentTable}

---

## 💻 Rendimiento por Entorno

| Entorno | Casos | Violaciones | % Éxito |
|---------|-------|-------------|---------|
| VSCode | ${vscodeIssues.length} | ${vscodeViolations} | ${vscodeSuccessRate}% |
| GitHub Copilot Chat | ${githubIssues.length} | ${githubViolations} | ${githubSuccessRate}% |

---

## 📋 Sub-issues (Casos Individuales)

### ✅ Casos Exitosos (${successIssues.length})
${successList || '_Ninguno aún_'}

### ❌ Violaciones Mayores (${majorIssues.length})
${majorList || '_Ninguna aún_'}

### ⚠️ Violaciones Menores (${minorIssues.length})
${minorList || '_Ninguna aún_'}

---

## 🎯 Resultado Actual

Clasificación: ${classificationText}

${classification}

---

## 📊 Dashboard Interactivo

[Ver Dashboard Completo →](../../docs/audit-results/dashboard.html)

El dashboard incluye:
- Gráficos de tendencias
- Filtros por agente/entorno
- Desglose de tipos de violación
- Exportación a PDF

---

## 🏷️ Cómo Contribuir

Para agregar un nuevo caso de auditoría:
1. Crear nuevo issue con template \`audit-case.yml\`
2. Etiquetar con \`audit\` y agregar al milestone correspondiente
3. Agregar labels específicos: \`agent:*\`, \`env:*\`, \`case-*\`
4. Este Epic se actualizará automáticamente

---

Última actualización: ${new Date().toISOString().split('T')[0]} (automática vía GitHub Actions)`;

    // Actualizar el Epic #7
    await octokit.rest.issues.update({
      owner,
      repo,
      issue_number: epicNumber,
      body: epicBody
    });

    console.log(`✅ Epic #${epicNumber} updated successfully!`);
    console.log(`📊 Metrics: ${total} cases, ${successes} successes, ${successRate}% success rate`);
  } catch (error) {
    console.error('❌ Error updating epic:', error.message);
    process.exit(1);
  }
}

updateEpic();
