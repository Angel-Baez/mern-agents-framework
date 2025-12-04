#!/bin/bash

# =============================================================================
# MERN Agents Framework - Init Script
# =============================================================================
# Script para inicializar los agentes de GitHub Copilot en un proyecto MERN
# 
# Uso:
#   curl -fsSL https://raw.githubusercontent.com/Angel-Baez/mern-agents-framework/main/init-agents.sh | bash
#   
#   O localmente:
#   ./init-agents.sh [--template=<template>]
#
# Templates disponibles:
#   - pwa-offline
#   - saas-platform
#   - ecommerce
#   - admin-dashboard
# =============================================================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuración
REPO_URL="https://raw.githubusercontent.com/Angel-Baez/mern-agents-framework/main"
AGENTS_DIR_STANDARD=".github/agents"
AGENTS_DIR_COMPAT=".github/copilot/agents"

# =============================================================================
# FUNCIONES DE UTILIDAD
# =============================================================================

print_banner() {
    echo ""
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}           ${PURPLE}🤖 MERN Agents Framework Installer${NC}                     ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}     ${YELLOW}Framework de agentes para MERN + Next.js + TypeScript${NC}        ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_step() {
    echo -e "${BLUE}➤${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

check_requirements() {
    print_step "Verificando requisitos..."
    
    # Verificar que estamos en un directorio de proyecto
    if [ ! -f "package.json" ]; then
        print_error "No se encontró package.json en el directorio actual"
        print_warning "Ejecuta este script desde la raíz de tu proyecto MERN/Next.js"
        exit 1
    fi
    
    print_success "package.json encontrado"
    
    # Verificar curl o wget
    if command -v curl &> /dev/null; then
        DOWNLOAD_CMD="curl -fsSL"
    elif command -v wget &> /dev/null; then
        DOWNLOAD_CMD="wget -qO-"
    else
        print_error "Se requiere curl o wget para descargar los archivos"
        exit 1
    fi
    
    print_success "Herramienta de descarga disponible"
}

# =============================================================================
# RECOLECCIÓN DE INFORMACIÓN DEL PROYECTO
# =============================================================================

collect_project_info() {
    echo ""
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════════${NC}"
    echo -e "${PURPLE}                    CONFIGURACIÓN DEL PROYECTO${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════════${NC}"
    echo ""
    
    # Nombre del proyecto (default: nombre del directorio)
    DEFAULT_NAME=$(basename "$(pwd)")
    read -p "Nombre del proyecto [$DEFAULT_NAME]: " PROJECT_NAME
    PROJECT_NAME=${PROJECT_NAME:-$DEFAULT_NAME}
    
    # Descripción
    read -p "Descripción del proyecto: " PROJECT_DESCRIPTION
    PROJECT_DESCRIPTION=${PROJECT_DESCRIPTION:-"Proyecto MERN Stack con Next.js y TypeScript"}
    
    # Repositorio
    DEFAULT_REPO="usuario/$PROJECT_NAME"
    read -p "Repositorio GitHub [$DEFAULT_REPO]: " PROJECT_REPO
    PROJECT_REPO=${PROJECT_REPO:-$DEFAULT_REPO}
    
    # Tipo de proyecto
    echo ""
    echo "Tipo de proyecto:"
    echo "  1) web-app (Aplicación web estándar)"
    echo "  2) pwa (Progressive Web App)"
    echo "  3) saas (Software as a Service)"
    echo "  4) ecommerce (Tienda online)"
    echo "  5) admin-dashboard (Panel administrativo)"
    read -p "Selecciona [1-5, default: 1]: " PROJECT_TYPE_CHOICE
    
    case $PROJECT_TYPE_CHOICE in
        2) PROJECT_TYPE="pwa" ;;
        3) PROJECT_TYPE="saas" ;;
        4) PROJECT_TYPE="ecommerce" ;;
        5) PROJECT_TYPE="admin-dashboard" ;;
        *) PROJECT_TYPE="web-app" ;;
    esac
    
    # Features
    echo ""
    echo -e "${CYAN}Selecciona las features a habilitar:${NC}"
    
    read -p "¿Autenticación de usuarios? [Y/n]: " AUTH_CHOICE
    FEAT_AUTH=$([[ "$AUTH_CHOICE" =~ ^[Nn]$ ]] && echo "false" || echo "true")
    
    read -p "¿PWA con soporte offline? [y/N]: " PWA_CHOICE
    FEAT_PWA=$([[ "$PWA_CHOICE" =~ ^[Yy]$ ]] && echo "true" || echo "false")
    
    read -p "¿Integración de pagos? [y/N]: " PAYMENTS_CHOICE
    FEAT_PAYMENTS=$([[ "$PAYMENTS_CHOICE" =~ ^[Yy]$ ]] && echo "true" || echo "false")
    
    read -p "¿Integración con IA (OpenAI/Anthropic/etc)? [y/N]: " AI_CHOICE
    FEAT_AI=$([[ "$AI_CHOICE" =~ ^[Yy]$ ]] && echo "true" || echo "false")
    
    # Provider de pagos si está habilitado
    if [ "$FEAT_PAYMENTS" = "true" ]; then
        echo ""
        echo "Provider de pagos:"
        echo "  1) stripe"
        echo "  2) mercadopago"
        echo "  3) paypal"
        read -p "Selecciona [1-3, default: 1]: " PAYMENT_CHOICE
        
        case $PAYMENT_CHOICE in
            2) PAYMENT_PROVIDER="mercadopago" ;;
            3) PAYMENT_PROVIDER="paypal" ;;
            *) PAYMENT_PROVIDER="stripe" ;;
        esac
    else
        PAYMENT_PROVIDER=""
    fi
    
    # Provider de IA si está habilitado
    if [ "$FEAT_AI" = "true" ]; then
        echo ""
        echo "Provider de IA:"
        echo "  1) openai"
        echo "  2) anthropic"
        echo "  3) google"
        read -p "Selecciona [1-3, default: 1]: " AI_PROVIDER_CHOICE
        
        case $AI_PROVIDER_CHOICE in
            2) AI_PROVIDER="anthropic" ;;
            3) AI_PROVIDER="google" ;;
            *) AI_PROVIDER="openai" ;;
        esac
    else
        AI_PROVIDER=""
    fi
    
    # Entidades del dominio
    echo ""
    read -p "Entidades principales del dominio (separadas por coma) [User,Product]: " ENTITIES
    ENTITIES=${ENTITIES:-"User,Product"}
}

# =============================================================================
# CREACIÓN DE ESTRUCTURA
# =============================================================================

create_directory_structure() {
    print_step "Creando estructura de directorios..."
    
    # Crear directorios principales para ambas ubicaciones
    mkdir -p "$AGENTS_DIR_STANDARD/_core"
    mkdir -p "$AGENTS_DIR_COMPAT/_core"
    
    print_success "Directorios creados: $AGENTS_DIR_STANDARD y $AGENTS_DIR_COMPAT"
}

download_core_files() {
    print_step "Descargando archivos core..."
    
    local core_files=(
        "_framework-context.md"
        "_shared-solid-principles.md"
        "_shared-data-modeling.md"
        "_shared-workflows.md"
        "_conflict-resolution.md"
    )
    
    for file in "${core_files[@]}"; do
        # Descargar a ubicación estándar
        $DOWNLOAD_CMD "$REPO_URL/_core/$file" > "$AGENTS_DIR_STANDARD/_core/$file" 2>/dev/null || {
            print_warning "No se pudo descargar $file, creando placeholder..."
            echo "# $file - Placeholder" > "$AGENTS_DIR_STANDARD/_core/$file"
        }
        # Copiar a ubicación alternativa (compatibilidad)
        cp "$AGENTS_DIR_STANDARD/_core/$file" "$AGENTS_DIR_COMPAT/_core/$file"
        print_success "  $file"
    done
}

download_agents() {
    print_step "Descargando agentes..."
    
    local agents=(
        "orchestrator.md"
        "product-manager.md"
        "solution-architect.md"
        "backend-architect.md"
        "frontend-architect.md"
        "data-engineer.md"
        "security-guardian.md"
        "test-engineer.md"
        "qa-lead.md"
        "devops-engineer.md"
        "observability-engineer.md"
        "ai-integration-engineer.md"
        "documentation-engineer.md"
        "release-manager.md"
        "code-reviewer.md"
    )
    
    for agent in "${agents[@]}"; do
        # Descargar a ubicación estándar
        $DOWNLOAD_CMD "$REPO_URL/agents/$agent" > "$AGENTS_DIR_STANDARD/$agent" 2>/dev/null || {
            print_warning "No se pudo descargar $agent"
        }
        # Copiar a ubicación alternativa (compatibilidad)
        cp "$AGENTS_DIR_STANDARD/$agent" "$AGENTS_DIR_COMPAT/$agent" 2>/dev/null || true
        print_success "  $agent"
    done
}

download_template() {
    local template=$1
    
    if [ -n "$template" ]; then
        print_step "Descargando template: $template..."
        
        # Crear directorio templates en ambas ubicaciones
        mkdir -p "$AGENTS_DIR_STANDARD/templates"
        mkdir -p "$AGENTS_DIR_COMPAT/templates"
        
        case $template in
            "pwa-offline")
                $DOWNLOAD_CMD "$REPO_URL/templates/pwa-offline/pwa-specialist.md" > "$AGENTS_DIR_STANDARD/templates/pwa-specialist.md" 2>/dev/null
                cp "$AGENTS_DIR_STANDARD/templates/pwa-specialist.md" "$AGENTS_DIR_COMPAT/templates/pwa-specialist.md" 2>/dev/null || true
                print_success "  templates/pwa-specialist.md"
                ;;
            "saas-platform")
                $DOWNLOAD_CMD "$REPO_URL/templates/saas-platform/saas-architect.md" > "$AGENTS_DIR_STANDARD/templates/saas-architect.md" 2>/dev/null
                cp "$AGENTS_DIR_STANDARD/templates/saas-architect.md" "$AGENTS_DIR_COMPAT/templates/saas-architect.md" 2>/dev/null || true
                print_success "  templates/saas-architect.md"
                ;;
            "ecommerce")
                $DOWNLOAD_CMD "$REPO_URL/templates/ecommerce/payments-specialist.md" > "$AGENTS_DIR_STANDARD/templates/payments-specialist.md" 2>/dev/null
                cp "$AGENTS_DIR_STANDARD/templates/payments-specialist.md" "$AGENTS_DIR_COMPAT/templates/payments-specialist.md" 2>/dev/null || true
                print_success "  templates/payments-specialist.md"
                ;;
        esac
    fi
}

generate_project_context() {
    print_step "Generando project-context.yml..."
    
    # Generar lista de entidades en formato YAML
    local entities_yaml=""
    IFS=',' read -ra ENTITY_ARRAY <<< "$ENTITIES"
    for entity in "${ENTITY_ARRAY[@]}"; do
        entity=$(echo "$entity" | xargs)  # Trim whitespace
        entities_yaml="${entities_yaml}
    - name: \"$entity\"
      description: \"Entidad $entity del sistema\""
    done
    
    # Crear project-context.yml en ubicación estándar
    cat > "$AGENTS_DIR_STANDARD/project-context.yml" << EOF
# =============================================================================
# PROJECT CONTEXT - $PROJECT_NAME
# =============================================================================
# Generado automáticamente por MERN Agents Framework
# Fecha: $(date +"%Y-%m-%d")
# =============================================================================

project:
  name: "$PROJECT_NAME"
  description: "$PROJECT_DESCRIPTION"
  repository: "$PROJECT_REPO"
  type: "$PROJECT_TYPE"
  version: "0.1.0"

stack:
  framework: "next.js"
  framework_version: "14"
  typescript: true
  styling: "tailwind"
  ui_library: "shadcn-ui"
  state_management: "zustand"
  form_handling: "react-hook-form"
  backend: "next-api-routes"
  api_style: "rest"
  database: "mongodb"
  orm: "mongoose"
  deployment: "vercel"

features:
  authentication: $FEAT_AUTH
  auth_provider: "next-auth"
  offline_first: $FEAT_PWA
  pwa: $FEAT_PWA
  payments: $FEAT_PAYMENTS
  payment_provider: "$PAYMENT_PROVIDER"
  ai_integration: $FEAT_AI
  ai_provider: "$AI_PROVIDER"

architecture:
  pattern: "clean-architecture"
  layers:
    domain: "src/core/domain"
    services: "src/core/services"
    repositories: "src/core/repositories"
    api: "src/app/api"
    components: "src/components"
  testing_strategy: "pyramid"
  test_framework: "vitest"
  e2e_framework: "playwright"
  ci_cd: "github-actions"

quality_targets:
  lighthouse_performance: 90
  lighthouse_accessibility: 100
  test_coverage: 80

domain:
  entities:$entities_yaml

  main_flows:
    - name: "user-authentication"
      description: "Flujo de autenticación de usuarios"

conventions:
  component_naming: "PascalCase"
  file_naming: "kebab-case"
  function_naming: "camelCase"
  commit_convention: "conventional"
EOF
    
    # Copiar a ubicación alternativa (compatibilidad)
    cp "$AGENTS_DIR_STANDARD/project-context.yml" "$AGENTS_DIR_COMPAT/project-context.yml"
    
    print_success "project-context.yml generado en ambas ubicaciones"
}

# =============================================================================
# RESUMEN FINAL
# =============================================================================

print_summary() {
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}                    ✓ INSTALACIÓN COMPLETADA${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "Proyecto configurado: ${CYAN}$PROJECT_NAME${NC}"
    echo -e "Tipo: ${CYAN}$PROJECT_TYPE${NC}"
    echo ""
    echo "Archivos creados:"
    echo -e "  ${BLUE}$AGENTS_DIR_STANDARD/${NC} (Ubicación estándar)"
    echo "    ├── _core/             (Contexto compartido)"
    echo "    ├── templates/         (Agentes especializados - si aplica)"
    echo "    ├── project-context.yml (Configuración del proyecto)"
    echo "    └── *.md               (Agentes)"
    echo ""
    echo -e "  ${BLUE}$AGENTS_DIR_COMPAT/${NC} (Ubicación alternativa - compatibilidad)"
    echo "    ├── _core/             (Contexto compartido)"
    echo "    ├── templates/         (Agentes especializados - si aplica)"
    echo "    ├── project-context.yml (Configuración del proyecto)"
    echo "    └── *.md               (Agentes)"
    echo ""
    echo -e "${YELLOW}Próximos pasos:${NC}"
    echo "  1. Revisa y personaliza $AGENTS_DIR_STANDARD/project-context.yml"
    echo "  2. Usa los agentes en GitHub Copilot Chat:"
    echo ""
    echo -e "     ${PURPLE}@orchestrator${NC} ¿Cómo empiezo a desarrollar mi aplicación?"
    echo ""
    echo -e "  3. Consulta la documentación: ${CYAN}https://github.com/Angel-Baez/mern-agents-framework${NC}"
    echo ""
}

# =============================================================================
# MAIN
# =============================================================================

main() {
    local TEMPLATE=""
    
    # Parse arguments
    for arg in "$@"; do
        case $arg in
            --template=*)
                TEMPLATE="${arg#*=}"
                ;;
        esac
    done
    
    print_banner
    check_requirements
    collect_project_info
    
    echo ""
    create_directory_structure
    download_core_files
    download_agents
    
    # Descargar template si se especificó o si el tipo lo requiere
    if [ -n "$TEMPLATE" ]; then
        download_template "$TEMPLATE"
    elif [ "$PROJECT_TYPE" = "pwa" ] || [ "$FEAT_PWA" = "true" ]; then
        download_template "pwa-offline"
    elif [ "$PROJECT_TYPE" = "saas" ]; then
        download_template "saas-platform"
    elif [ "$PROJECT_TYPE" = "ecommerce" ] || [ "$FEAT_PAYMENTS" = "true" ]; then
        download_template "ecommerce"
    fi
    
    generate_project_context
    print_summary
}

main "$@"
