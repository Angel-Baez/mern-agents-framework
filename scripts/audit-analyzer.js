#!/usr/bin/env node

/**
 * Audit Analyzer Script
 * 
 * Analyzes GitHub audit issues to extract metrics and generate statistics
 * about agent performance during the 100-use audits.
 * 
 * Usage:
 *   node scripts/audit-analyzer.js --latest           # Analyze latest audit
 *   node scripts/audit-analyzer.js --issue 123        # Analyze specific issue
 *   node scripts/audit-analyzer.js --file data.json   # Analyze from local file
 */

const fs = require('fs');
const path = require('path');

// Lazy load Octokit to avoid requiring it when not needed
let Octokit = null;
function getOctokit(token) {
  if (!Octokit) {
    Octokit = require('@octokit/rest').Octokit;
  }
  return new Octokit({ auth: token });
}

// Configuration
const CONFIG_PATH = path.join(__dirname, 'audit-config.json');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    latest: false,
    issue: null,
    file: null,
    output: null,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--latest':
        options.latest = true;
        break;
      case '--issue':
        options.issue = parseInt(args[++i], 10);
        break;
      case '--file':
        options.file = args[++i];
        break;
      case '--output':
        options.output = args[++i];
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
📊 Audit Analyzer - MERN Agents Framework

Usage:
  node scripts/audit-analyzer.js [options]

Options:
  --latest          Analyze the most recent audit issue
  --issue <number>  Analyze a specific issue by number
  --file <path>     Load audit data from a local JSON file
  --output <path>   Output file path (default: stdout)
  --help, -h        Show this help message

Examples:
  node scripts/audit-analyzer.js --latest
  node scripts/audit-analyzer.js --issue 42
  node scripts/audit-analyzer.js --file sample-audit.json --output results.json

Environment Variables:
  GITHUB_TOKEN      GitHub personal access token (required for API access)
`);
}

/**
 * Fetch audit issues from GitHub API
 */
async function fetchAuditIssues(octokit, options = {}) {
  const { owner, repo, auditLabels, auditTitlePrefix } = config.github;
  
  try {
    const response = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      labels: auditLabels.join(','),
      state: options.state || 'all',
      per_page: 100,
      sort: 'created',
      direction: 'desc'
    });

    // Filter by title prefix
    return response.data.filter(issue => 
      issue.title.includes(auditTitlePrefix) || issue.title.toLowerCase().includes('auditoría')
    );
  } catch (error) {
    console.error('Error fetching issues:', error.message);
    return [];
  }
}

/**
 * Parse markdown table from issue body
 */
function parseMarkdownTable(text, tableName) {
  if (!text) return [];
  
  // Find tables by looking for markdown table patterns
  const tableRegex = /\|[^\n]+\|\s*\n\|[-:\s|]+\|\s*\n((?:\|[^\n]+\|\s*\n?)*)/g;
  const tables = [];
  let match;

  while ((match = tableRegex.exec(text)) !== null) {
    const rows = match[1].trim().split('\n').filter(row => row.trim());
    const parsedRows = rows.map(row => {
      const cells = row.split('|').slice(1, -1).map(cell => cell.trim());
      return cells;
    });
    tables.push(parsedRows);
  }

  return tables;
}

/**
 * Parse audit table (100 uses)
 */
function parseAuditTable(text) {
  const uses = [];
  const validAgentIds = config.agents.map(a => a.id);
  
  // Pattern: | Uso | Agente | Resultado | Observación |
  const rowPattern = /\|\s*(\d+)\s*\|\s*([^|]*)\s*\|\s*([✓✗×✔]|[^|]*)\s*\|\s*([^|]*)\s*\|/g;
  let match;

  while ((match = rowPattern.exec(text)) !== null) {
    const [, useNum, agent, result, observation] = match;
    const agentName = agent.trim().toLowerCase().replace(/\s+/g, '-');
    const isSuccess = result.includes('✓') || result.includes('✔') || result.toLowerCase().includes('ok');
    
    // Validate agent name against configured agents
    if (agentName && agentName !== '' && agentName !== '...' && validAgentIds.includes(agentName)) {
      uses.push({
        use: parseInt(useNum, 10),
        agent: agentName,
        success: isSuccess,
        observation: observation.trim()
      });
    }
  }

  return uses;
}

/**
 * Parse agent breakdown table
 */
function parseAgentBreakdown(text) {
  const agents = [];
  
  // Pattern: | Agente | Usos | Fallas | % Éxito |
  const rowPattern = /\|\s*([a-z-]+)\s*\|\s*(\d+)?\s*(?:usos?)?\s*\|\s*(\d+)?\s*(?:fallas?)?\s*\|\s*(\d+(?:\.\d+)?)?%?\s*\|/gi;
  let match;

  while ((match = rowPattern.exec(text)) !== null) {
    const [, agent, uses, failures, successRate] = match;
    const agentName = agent.trim().toLowerCase().replace(/\s+/g, '-');
    
    if (agentName && config.agents.some(a => a.id === agentName)) {
      agents.push({
        agent: agentName,
        uses: parseInt(uses, 10) || 0,
        failures: parseInt(failures, 10) || 0,
        successRate: parseFloat(successRate) || (uses > 0 ? ((uses - (failures || 0)) / uses * 100) : 100)
      });
    }
  }

  return agents;
}

/**
 * Extract environment from issue body
 */
function extractEnvironment(text) {
  if (!text) return 'unknown';
  
  const lowerText = text.toLowerCase();
  if (lowerText.includes('[x] vscode') || lowerText.includes('vscode chat')) {
    return 'vscode';
  }
  if (lowerText.includes('[x] github') || lowerText.includes('github copilot chat')) {
    return 'github';
  }
  return 'unknown';
}

/**
 * Extract total violations from issue body
 */
function extractTotalViolations(text) {
  if (!text) return 0;
  
  // Look for "Total de Violaciones" field
  const match = text.match(/total\s*(?:de)?\s*violaciones[:\s]*(\d+)/i);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Extract violation types from issue body
 */
function extractViolationTypes(text) {
  if (!text) return [];
  
  const violations = [];
  const violationPatterns = [
    { pattern: /\[x\]\s*uso\s*de\s*herramientas\s*prohibidas/i, type: 'used_prohibited_tools' },
    { pattern: /\[x\]\s*router\s*ejecut[óo]\s*herramientas/i, type: 'implemented_code' },
    { pattern: /\[x\]\s*no\s*hizo\s*handoff/i, type: 'no_handoff' },
    { pattern: /\[x\]\s*implementaci[óo]n\s*fuera\s*de\s*scope/i, type: 'out_of_scope' },
    { pattern: /\[x\]\s*inici[óo]\s*mcp\s*server/i, type: 'started_mcp_server' },
    { pattern: /\[x\]\s*ignor[óo]\s*metadata/i, type: 'ignored_metadata' },
    { pattern: /\[x\]\s*fall[óo]\s*verificaciones/i, type: 'failed_verification' }
  ];

  for (const { pattern, type } of violationPatterns) {
    if (pattern.test(text)) {
      violations.push(type);
    }
  }

  return violations;
}

/**
 * Calculate quality grade based on success rate
 */
function calculateGrade(successRate, violations) {
  const thresholds = config.qualityThresholds;
  
  for (const [grade, threshold] of Object.entries(thresholds)) {
    if (successRate >= threshold.minSuccessRate && violations <= threshold.maxViolations) {
      return {
        grade,
        ...threshold
      };
    }
  }
  
  return {
    grade: 'D',
    ...thresholds.D
  };
}

/**
 * Parse a single audit issue
 */
function parseAuditIssue(issue) {
  const body = issue.body || '';
  
  // Parse audit table
  const auditUses = parseAuditTable(body);
  
  // Parse agent breakdown
  let agentBreakdown = parseAgentBreakdown(body);
  
  // If no breakdown found, calculate from audit uses
  if (agentBreakdown.length === 0 && auditUses.length > 0) {
    const agentStats = {};
    for (const use of auditUses) {
      if (!agentStats[use.agent]) {
        agentStats[use.agent] = { uses: 0, failures: 0 };
      }
      agentStats[use.agent].uses++;
      if (!use.success) {
        agentStats[use.agent].failures++;
      }
    }
    
    agentBreakdown = Object.entries(agentStats).map(([agent, stats]) => ({
      agent,
      uses: stats.uses,
      failures: stats.failures,
      successRate: ((stats.uses - stats.failures) / stats.uses * 100).toFixed(1)
    }));
  }

  // Extract metadata
  const environment = extractEnvironment(body);
  const totalViolations = extractTotalViolations(body) || auditUses.filter(u => !u.success).length;
  const violationTypes = extractViolationTypes(body);
  const totalUses = auditUses.length || 100;
  const successRate = ((totalUses - totalViolations) / totalUses * 100);

  return {
    issueNumber: issue.number,
    title: issue.title,
    createdAt: issue.created_at,
    closedAt: issue.closed_at,
    state: issue.state,
    environment,
    totalUses,
    totalViolations,
    successRate: parseFloat(successRate.toFixed(2)),
    violationTypes,
    auditUses,
    agentBreakdown
  };
}

/**
 * Aggregate metrics from multiple audits
 */
function aggregateMetrics(audits) {
  if (audits.length === 0) {
    return null;
  }

  // Use latest audit as primary
  const latest = audits[0];
  
  // Calculate agent metrics
  const agentMetrics = config.agents.map(agentConfig => {
    const agentData = latest.agentBreakdown.find(a => a.agent === agentConfig.id);
    const violationsForAgent = latest.auditUses
      .filter(u => u.agent === agentConfig.id && !u.success)
      .map(u => u.observation);
    
    return {
      name: agentConfig.id,
      displayName: agentConfig.name,
      role: agentConfig.role,
      uses: agentData?.uses || 0,
      violations: agentData?.failures || 0,
      successRate: parseFloat(agentData?.successRate) || 100,
      violationDetails: violationsForAgent
    };
  }).filter(a => a.uses > 0);

  // Sort by success rate
  const sortedBySuccess = [...agentMetrics].sort((a, b) => b.successRate - a.successRate);
  const topAgents = sortedBySuccess.slice(0, 5);
  const bottomAgents = sortedBySuccess.slice(-5).reverse();

  // Environment comparison
  const environmentComparison = {};
  for (const env of config.environments) {
    const envAudits = audits.filter(a => a.environment === env.id);
    if (envAudits.length > 0) {
      const totalUses = envAudits.reduce((sum, a) => sum + a.totalUses, 0);
      const totalViolations = envAudits.reduce((sum, a) => sum + a.totalViolations, 0);
      environmentComparison[env.id] = {
        name: env.name,
        uses: totalUses,
        violations: totalViolations,
        successRate: parseFloat(((totalUses - totalViolations) / totalUses * 100).toFixed(2))
      };
    }
  }

  // Violation breakdown
  const violationBreakdown = {};
  for (const vType of config.violationTypes) {
    violationBreakdown[vType.id] = 0;
  }
  
  for (const use of latest.auditUses) {
    if (!use.success) {
      // Try to categorize violation based on observation
      const observation = use.observation.toLowerCase();
      if (observation.includes('herramienta') || observation.includes('tool')) {
        violationBreakdown.used_prohibited_tools++;
      } else if (observation.includes('implementó') || observation.includes('código')) {
        violationBreakdown.implemented_code++;
      } else if (observation.includes('handoff')) {
        violationBreakdown.no_handoff++;
      } else if (observation.includes('scope') || observation.includes('fuera')) {
        violationBreakdown.out_of_scope++;
      } else {
        violationBreakdown.ignored_metadata++;
      }
    }
  }

  // Calculate grade
  const gradeInfo = calculateGrade(latest.successRate, latest.totalViolations);

  // Timeline data for historical analysis
  const timeline = audits.map(audit => ({
    date: audit.createdAt,
    successRate: audit.successRate,
    violations: audit.totalViolations,
    environment: audit.environment
  })).reverse();

  return {
    metadata: {
      auditId: `audit-${latest.issueNumber}`,
      issueNumber: latest.issueNumber,
      date: latest.createdAt.split('T')[0],
      closedAt: latest.closedAt,
      environment: latest.environment,
      totalUses: latest.totalUses,
      totalViolations: latest.totalViolations,
      generatedAt: new Date().toISOString()
    },
    globalMetrics: {
      successRate: latest.successRate,
      violationRate: parseFloat((100 - latest.successRate).toFixed(2)),
      grade: gradeInfo.grade,
      gradeDescription: gradeInfo.description,
      gradeColor: gradeInfo.color,
      badgeColor: gradeInfo.badgeColor
    },
    agentMetrics,
    environmentComparison,
    violationBreakdown,
    topAgents: topAgents.map(a => ({
      name: a.name,
      displayName: a.displayName,
      successRate: a.successRate,
      uses: a.uses
    })),
    bottomAgents: bottomAgents.map(a => ({
      name: a.name,
      displayName: a.displayName,
      successRate: a.successRate,
      uses: a.uses,
      violations: a.violations
    })),
    timeline,
    rawAuditData: latest.auditUses
  };
}

/**
 * Load sample data for testing
 */
function loadSampleData() {
  return {
    number: 1,
    title: '[AUDITORÍA] Ciclo de 100 usos - Fecha: 2024-12-05',
    created_at: new Date().toISOString(),
    closed_at: null,
    state: 'open',
    body: `
# 📊 Auditoría de 100 Usos – Framework de 15 Agentes

## Entorno de Prueba
- [x] GitHub Copilot Chat

## ❌ Tipos de Violaciones Detectadas
- [x] Router ejecutó herramientas/código
- [x] Implementación fuera de scope

## 📄 Tabla de Auditoría (100 usos)

| Uso | Agente | Resultado | Observación |
|-----|--------|-----------|-------------|
| 1   | orchestrator | ✓ | Handoff correcto a frontend-architect |
| 2   | backend-architect | ✓ | Endpoint creado correctamente |
| 3   | frontend-architect | ✓ | Componente implementado |
| 4   | orchestrator | ✗ | Implementó código en lugar de hacer handoff |
| 5   | data-engineer | ✓ | Esquema diseñado correctamente |
| 6   | security-guardian | ✓ | Revisión de seguridad completada |
| 7   | test-engineer | ✓ | Tests unitarios creados |
| 8   | backend-architect | ✓ | API REST implementada |
| 9   | orchestrator | ✓ | Derivación correcta |
| 10  | frontend-architect | ✗ | Implementó lógica de backend |

### Total de Violaciones
2

### Desglose por Agente

| Agente | Usos | Fallas | % Éxito |
|--------|------|--------|---------|
| orchestrator | 3 | 1 | 66.7% |
| backend-architect | 2 | 0 | 100% |
| frontend-architect | 2 | 1 | 50% |
| data-engineer | 1 | 0 | 100% |
| security-guardian | 1 | 0 | 100% |
| test-engineer | 1 | 0 | 100% |
`
  };
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

  let audits = [];

  // Load data from file if specified
  if (options.file) {
    try {
      const fileData = JSON.parse(fs.readFileSync(options.file, 'utf8'));
      if (Array.isArray(fileData)) {
        audits = fileData.map(parseAuditIssue);
      } else {
        audits = [parseAuditIssue(fileData)];
      }
      console.log(`📂 Loaded ${audits.length} audit(s) from file`);
    } catch (error) {
      console.error('Error loading file:', error.message);
      process.exit(1);
    }
  }
  // Fetch from GitHub API
  else if (process.env.GITHUB_TOKEN) {
    try {
      const octokit = getOctokit(process.env.GITHUB_TOKEN);
      
      const issues = await fetchAuditIssues(octokit);
      
      if (options.issue) {
        const targetIssue = issues.find(i => i.number === options.issue);
        if (targetIssue) {
          audits = [parseAuditIssue(targetIssue)];
        } else {
          console.error(`Issue #${options.issue} not found`);
          process.exit(1);
        }
      } else if (options.latest) {
        if (issues.length > 0) {
          audits = [parseAuditIssue(issues[0])];
        }
      } else {
        audits = issues.map(parseAuditIssue);
      }
      
      console.log(`🔍 Found ${audits.length} audit issue(s)`);
    } catch (error) {
      console.error('Error connecting to GitHub API:', error.message);
      console.log('💡 Using sample data for demonstration');
      audits = [parseAuditIssue(loadSampleData())];
    }
  }
  // Use sample data
  else {
    console.log('⚠️  No GITHUB_TOKEN found, using sample data for demonstration');
    audits = [parseAuditIssue(loadSampleData())];
  }

  if (audits.length === 0) {
    console.log('No audit data found');
    process.exit(0);
  }

  // Aggregate metrics
  const result = aggregateMetrics(audits);

  // Output result
  const output = JSON.stringify(result, null, 2);
  
  if (options.output) {
    fs.writeFileSync(options.output, output);
    console.log(`✅ Results saved to ${options.output}`);
  } else {
    console.log('\n📊 Audit Analysis Results:\n');
    console.log(output);
  }

  // Also save to default location
  const defaultOutput = path.join(__dirname, '..', config.output.reportsDir, 'latest-analysis.json');
  try {
    fs.mkdirSync(path.dirname(defaultOutput), { recursive: true });
    fs.writeFileSync(defaultOutput, output);
    console.log(`\n💾 Analysis also saved to ${defaultOutput}`);
  } catch {
    // Ignore errors for default output
  }

  return result;
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

// Export for use as module
module.exports = {
  parseAuditIssue,
  aggregateMetrics,
  calculateGrade,
  parseMarkdownTable,
  parseAuditTable,
  parseAgentBreakdown
};
