#!/bin/bash

# Script para crear labels de auditoría en GitHub
# Uso: ./scripts/create-audit-labels.sh Angel-Baez mern-agents-framework

OWNER=$1
REPO=$2

if [ -z "$OWNER" ] || [ -z "$REPO" ]; then
    echo "Usage: $0 <owner> <repo>"
    exit 1
fi

echo "Creating audit labels in $OWNER/$REPO..."

# Función para crear label
create_label() {
    local name=$1
    local color=$2
    local description=$3
    
    gh label create "$name" \
        --color "$color" \
        --description "$description" \
        --repo "$OWNER/$REPO" \
        --force 2>/dev/null
}

# Labels de resultado
create_label "case-success" "0E8A16" "Caso de auditoría exitoso"
create_label "case-violation-major" "D93F0B" "Violación mayor de scope o límites"
create_label "case-violation-minor" "FBCA04" "Violación menor de protocolo"

# Labels de agentes
create_label "agent:orchestrator" "1D76DB" "Caso del agente orchestrator"
create_label "agent:backend-architect" "0052CC" "Caso del agente backend-architect"
create_label "agent:frontend-architect" "006B75" "Caso del agente frontend-architect"
create_label "agent:data-engineer" "5319E7" "Caso del agente data-engineer"
create_label "agent:solution-architect" "BFD4F2" "Caso del agente solution-architect"
create_label "agent:security-guardian" "B60205" "Caso del agente security-guardian"
create_label "agent:test-engineer" "C2E0C6" "Caso del agente test-engineer"
create_label "agent:qa-lead" "C5DEF5" "Caso del agente qa-lead"
create_label "agent:code-reviewer" "E99695" "Caso del agente code-reviewer"
create_label "agent:documentation-engineer" "FEF2C0" "Caso del agente documentation-engineer"
create_label "agent:ai-integration-engineer" "BFDADC" "Caso del agente ai-integration-engineer"
create_label "agent:observability-engineer" "D4C5F9" "Caso del agente observability-engineer"
create_label "agent:product-manager" "F9D0C4" "Caso del agente product-manager"
create_label "agent:release-manager" "C5DEF5" "Caso del agente release-manager"
create_label "agent:devops-engineer" "D93F0B" "Caso del agente devops-engineer"

# Labels de entorno
create_label "env:vscode" "5319E7" "Ejecutado en VSCode Chat"
create_label "env:github-copilot" "0366D6" "Ejecutado en GitHub Copilot Chat"

# Labels de tipo de violación
create_label "violation:scope" "D93F0B" "Violación de scope (modificó código fuera de su área)"
create_label "violation:protocol" "FBCA04" "Violación de protocolo (no siguió verificaciones)"
create_label "violation:tools" "B60205" "Uso de herramientas prohibidas"
create_label "violation:handoff" "D93F0B" "No hizo handoff cuando debía"

# Labels de estado
create_label "needs-review" "FBCA04" "Caso necesita revisión"
create_label "validated" "0E8A16" "Caso validado y confirmado"
create_label "disputed" "D93F0B" "Caso en disputa o requiere aclaración"

# Label padre
create_label "audit" "0052CC" "Issue relacionado con auditoría de agentes"

echo "✅ Labels created successfully!"
echo ""
echo "Usage examples:"
echo "  gh issue list --label 'case-violation-major'"
echo "  gh issue list --label 'agent:orchestrator,case-success'"
echo "  gh issue list --label 'env:vscode,violation:protocol'"
