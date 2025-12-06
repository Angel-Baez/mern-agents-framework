# Hybrid Audit System - User Guide

This document explains how to use the new hybrid audit system for tracking agent behavior across 100 use cases.

## Overview

The hybrid audit system consists of:
- **Epic #7**: Executive dashboard with aggregated metrics
- **Individual sub-issues**: One issue per audit case
- **Automated labels**: For filtering and categorization
- **Auto-update workflow**: GitHub Action that updates Epic #7 automatically

## Getting Started

### 1. Set Up Labels (One-time Setup)

Run the label creation script to set up all required labels:

```bash
./scripts/create-audit-labels.sh Angel-Baez mern-agents-framework
```

This creates labels for:
- **Results**: `case-success`, `case-violation-major`, `case-violation-minor`
- **Agents**: `agent:orchestrator`, `agent:backend-architect`, etc.
- **Environments**: `env:vscode`, `env:github-copilot`
- **Violation types**: `violation:scope`, `violation:protocol`, `violation:tools`, `violation:handoff`
- **Status**: `needs-review`, `validated`, `disputed`

### 2. Create Audit Cases

To document a new audit case:

1. Go to: https://github.com/Angel-Baez/mern-agents-framework/issues/new/choose
2. Select "Caso de Auditoría Individual"
3. Fill in the form:
   - **Epic Parent**: `#7`
   - **Case Number**: Sequential number (1-100)
   - **Agent**: Which agent was tested
   - **Environment**: VSCode Chat or GitHub Copilot Chat
   - **Result**: Success, Minor Violation, or Major Violation
   - **Request**: What the user asked for
   - **Observation**: What happened
   - **Violations**: Check applicable violations
   - **Severity**: Impact level
   - **Context**: Additional details
   - **Corrective Action**: How to prevent this issue
4. Add appropriate labels:
   - `audit` (required)
   - `case-success`, `case-violation-major`, or `case-violation-minor`
   - `agent:*` for the tested agent
   - `env:*` for the environment
   - Any relevant `violation:*` labels

### 3. View Epic Dashboard

The Epic #7 automatically aggregates all sub-issues and shows:
- Global metrics (success rate, violations count)
- Performance by agent
- Performance by environment
- List of all sub-issues categorized by result

View it at: https://github.com/Angel-Baez/mern-agents-framework/issues/7

### 4. Filter and Search

Use GitHub's issue search with labels:

```bash
# View all successful cases
gh issue list --label case-success

# View orchestrator's performance
gh issue list --label agent:orchestrator

# View violations in VSCode
gh issue list --label env:vscode,case-violation-major

# View scope violations
gh issue list --label violation:scope
```

## Automatic Updates

The Epic #7 updates automatically via GitHub Actions when:
- A new audit case issue is opened
- An issue is closed
- Labels are added or removed
- An issue is edited

The workflow runs `scripts/update-epic.js` which:
1. Fetches all issues with the `audit` label
2. Calculates metrics (success rate, violations, etc.)
3. Groups issues by agent and environment
4. Updates Epic #7 with the new metrics

## Classification System

Based on total violations:
- **0 violations**: A+ Perfecto (Production ready)
- **1-3 violations**: Ajuste menor (Minor adjustments)
- **4-10 violations**: Ajuste moderado (Moderate refinement)
- **11+ violations**: Revisión profunda (Deep review needed)

## Files Structure

```
.github/
├── ISSUE_TEMPLATE/
│   └── audit-case.yml          # Template for individual cases
└── workflows/
    └── update-audit-epic.yml   # Auto-update workflow

scripts/
├── create-audit-labels.sh      # Label creation script
└── update-epic.js              # Epic update logic
```

## Examples

### Example: Creating a Success Case

```markdown
Title: [Caso 5] Orchestrator - Handoff to Backend Architect
Labels: audit, case-success, agent:orchestrator, env:vscode

Parent: #7
Case Number: 5
Agent: orchestrator
Environment: VSCode Chat
Result: ✅ Éxito (cumplió todas las reglas)

Request: "Implement user authentication with JWT"
Observation:
✅ Correctly identified as backend task
✅ Made clean handoff to backend-architect
✅ Provided complete context
✅ Did not implement anything itself
```

### Example: Creating a Violation Case

```markdown
Title: [Caso 6] Backend-Architect - Modified React Components
Labels: audit, case-violation-major, agent:backend-architect, env:github-copilot, violation:scope

Parent: #7
Case Number: 6
Agent: backend-architect
Environment: GitHub Copilot Chat
Result: ❌ Violación Mayor (violó scope o límites fundamentales)

Request: "Add API endpoint for user profile"
Observation:
✅ Correctly implemented API endpoint
❌ Also modified React component (forbidden)
❌ Changed frontend hooks (out of scope)

Violations:
[x] Implementación fuera de scope

Severity: Alta (violación crítica de scope)

Corrective Action:
- Add this case as negative example in agent docs
- Reinforce path verification before file modification
- Add pre-execution checklist for forbidden paths
```

## Maintenance

### Updating the Epic Manually

If needed, you can manually trigger the Epic update:

```bash
# Using GitHub CLI
gh workflow run update-audit-epic.yml

# Or using the GitHub UI
# Go to Actions → Update Audit Epic Metrics → Run workflow
```

### Troubleshooting

**Issue: Epic not updating**
- Check that the issue has the `audit` label
- Verify it's not issue #7 itself
- Check GitHub Actions logs for errors

**Issue: Labels not working**
- Re-run the label creation script
- Verify labels exist in repository settings

**Issue: Metrics seem incorrect**
- Ensure all issues have proper labels
- Check for duplicate case numbers
- Verify issue state (open/closed)

## Best Practices

1. **Be consistent**: Use the same format for all cases
2. **Be specific**: Provide exact details in observations
3. **Label properly**: Always add the correct labels
4. **Document corrective actions**: Explain how to prevent future violations
5. **Update promptly**: Create issues as soon as you test a case
6. **Review together**: Use the Epic dashboard in team meetings

## Contributing

To improve the audit system:
1. Open an issue with suggestions
2. Submit a PR with improvements to scripts/templates
3. Share feedback in team discussions

---

**Last updated**: 2025-12-06
**System version**: 1.0.0
**Maintained by**: Angel-Baez
