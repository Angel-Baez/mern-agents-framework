# =============================================================================
# MERN Agents Framework - Init Script for Windows PowerShell
# =============================================================================
# Script para inicializar los agentes de GitHub Copilot en un proyecto MERN
# 
# Uso:
#   irm https://raw.githubusercontent.com/Angel-Baez/mern-agents-framework/main/init-agents.ps1 | iex
#   
#   O localmente:
#   .\init-agents.ps1 [-Template <template>]
#
# Templates disponibles:
#   - pwa-offline
#   - saas-platform
#   - ecommerce
#   - admin-dashboard
# =============================================================================

param(
    [string]$Template = ""
)

# Configuración
$RepoUrl = "https://raw.githubusercontent.com/Angel-Baez/mern-agents-framework/main"
$AgentsDir = ".github\copilot\agents"
$AgentsDirAlt = ".github\agents"

# =============================================================================
# FUNCIONES DE UTILIDAD
# =============================================================================

function Write-Banner {
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║           🤖 MERN Agents Framework Installer                      ║" -ForegroundColor Cyan
    Write-Host "║     Framework de agentes para MERN + Next.js + TypeScript         ║" -ForegroundColor Cyan
    Write-Host "╚═══════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Step {
    param([string]$Message)
    Write-Host "➤ $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Test-Requirements {
    Write-Step "Verificando requisitos..."
    
    # Verificar que estamos en un directorio de proyecto
    if (-not (Test-Path "package.json")) {
        Write-Error "No se encontró package.json en el directorio actual"
        Write-Warning "Ejecuta este script desde la raíz de tu proyecto MERN/Next.js"
        exit 1
    }
    
    Write-Success "package.json encontrado"
}

# =============================================================================
# RECOLECCIÓN DE INFORMACIÓN DEL PROYECTO
# =============================================================================

function Get-ProjectInfo {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Magenta
    Write-Host "                    CONFIGURACIÓN DEL PROYECTO" -ForegroundColor Magenta
    Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Magenta
    Write-Host ""
    
    # Nombre del proyecto (default: nombre del directorio)
    $DefaultName = Split-Path -Leaf (Get-Location)
    $ProjectName = Read-Host "Nombre del proyecto [$DefaultName]"
    if ([string]::IsNullOrWhiteSpace($ProjectName)) { $ProjectName = $DefaultName }
    
    # Descripción
    $ProjectDescription = Read-Host "Descripción del proyecto"
    if ([string]::IsNullOrWhiteSpace($ProjectDescription)) { 
        $ProjectDescription = "Proyecto MERN Stack con Next.js y TypeScript" 
    }
    
    # Repositorio
    $DefaultRepo = "usuario/$ProjectName"
    $ProjectRepo = Read-Host "Repositorio GitHub [$DefaultRepo]"
    if ([string]::IsNullOrWhiteSpace($ProjectRepo)) { $ProjectRepo = $DefaultRepo }
    
    # Tipo de proyecto
    Write-Host ""
    Write-Host "Tipo de proyecto:"
    Write-Host "  1) web-app (Aplicación web estándar)"
    Write-Host "  2) pwa (Progressive Web App)"
    Write-Host "  3) saas (Software as a Service)"
    Write-Host "  4) ecommerce (Tienda online)"
    Write-Host "  5) admin-dashboard (Panel administrativo)"
    $ProjectTypeChoice = Read-Host "Selecciona [1-5, default: 1]"
    
    $ProjectType = switch ($ProjectTypeChoice) {
        "2" { "pwa" }
        "3" { "saas" }
        "4" { "ecommerce" }
        "5" { "admin-dashboard" }
        default { "web-app" }
    }
    
    # Features
    Write-Host ""
    Write-Host "Selecciona las features a habilitar:" -ForegroundColor Cyan
    
    $AuthChoice = Read-Host "¿Autenticación de usuarios? [Y/n]"
    $FeatAuth = if ($AuthChoice -match "^[Nn]$") { "false" } else { "true" }
    
    $PwaChoice = Read-Host "¿PWA con soporte offline? [y/N]"
    $FeatPwa = if ($PwaChoice -match "^[Yy]$") { "true" } else { "false" }
    
    $PaymentsChoice = Read-Host "¿Integración de pagos? [y/N]"
    $FeatPayments = if ($PaymentsChoice -match "^[Yy]$") { "true" } else { "false" }
    
    $AiChoice = Read-Host "¿Integración con IA (OpenAI/Anthropic/etc)? [y/N]"
    $FeatAi = if ($AiChoice -match "^[Yy]$") { "true" } else { "false" }
    
    # Provider de pagos si está habilitado
    $PaymentProvider = ""
    if ($FeatPayments -eq "true") {
        Write-Host ""
        Write-Host "Provider de pagos:"
        Write-Host "  1) stripe"
        Write-Host "  2) mercadopago"
        Write-Host "  3) paypal"
        $PaymentChoice = Read-Host "Selecciona [1-3, default: 1]"
        
        $PaymentProvider = switch ($PaymentChoice) {
            "2" { "mercadopago" }
            "3" { "paypal" }
            default { "stripe" }
        }
    }
    
    # Provider de IA si está habilitado
    $AiProvider = ""
    if ($FeatAi -eq "true") {
        Write-Host ""
        Write-Host "Provider de IA:"
        Write-Host "  1) openai"
        Write-Host "  2) anthropic"
        Write-Host "  3) google"
        $AiProviderChoice = Read-Host "Selecciona [1-3, default: 1]"
        
        $AiProvider = switch ($AiProviderChoice) {
            "2" { "anthropic" }
            "3" { "google" }
            default { "openai" }
        }
    }
    
    # Entidades del dominio
    Write-Host ""
    $Entities = Read-Host "Entidades principales del dominio (separadas por coma) [User,Product]"
    if ([string]::IsNullOrWhiteSpace($Entities)) { $Entities = "User,Product" }
    
    return @{
        Name = $ProjectName
        Description = $ProjectDescription
        Repo = $ProjectRepo
        Type = $ProjectType
        FeatAuth = $FeatAuth
        FeatPwa = $FeatPwa
        FeatPayments = $FeatPayments
        FeatAi = $FeatAi
        PaymentProvider = $PaymentProvider
        AiProvider = $AiProvider
        Entities = $Entities
    }
}

# =============================================================================
# CREACIÓN DE ESTRUCTURA
# =============================================================================

function New-DirectoryStructure {
    Write-Step "Creando estructura de directorios..."
    
    # Crear directorios principales
    New-Item -ItemType Directory -Force -Path "$AgentsDir\_core" | Out-Null
    New-Item -ItemType Directory -Force -Path $AgentsDirAlt | Out-Null
    
    Write-Success "Directorios creados: $AgentsDir y $AgentsDirAlt"
}

function Get-CoreFiles {
    Write-Step "Descargando archivos core..."
    
    $coreFiles = @(
        "_framework-context.md",
        "_shared-solid-principles.md",
        "_shared-data-modeling.md",
        "_shared-workflows.md",
        "_conflict-resolution.md"
    )
    
    foreach ($file in $coreFiles) {
        try {
            Invoke-WebRequest -Uri "$RepoUrl/_core/$file" -OutFile "$AgentsDir\_core\$file" -UseBasicParsing
            Write-Success "  $file"
        } catch {
            Write-Warning "No se pudo descargar $file, creando placeholder..."
            Set-Content -Path "$AgentsDir\_core\$file" -Value "# $file - Placeholder"
        }
    }
}

function Get-Agents {
    Write-Step "Descargando agentes..."
    
    $agents = @(
        "orchestrator.md",
        "product-manager.md",
        "solution-architect.md",
        "backend-architect.md",
        "frontend-architect.md",
        "data-engineer.md",
        "security-guardian.md",
        "test-engineer.md",
        "qa-lead.md",
        "devops-engineer.md",
        "observability-engineer.md",
        "ai-integration-engineer.md",
        "documentation-engineer.md",
        "release-manager.md",
        "code-reviewer.md"
    )
    
    foreach ($agent in $agents) {
        try {
            Invoke-WebRequest -Uri "$RepoUrl/agents/$agent" -OutFile "$AgentsDir\$agent" -UseBasicParsing
            Write-Success "  $agent"
        } catch {
            Write-Warning "No se pudo descargar $agent"
        }
    }
}

function Get-Template {
    param([string]$TemplateName)
    
    if (-not [string]::IsNullOrWhiteSpace($TemplateName)) {
        Write-Step "Descargando template: $TemplateName..."
        
        switch ($TemplateName) {
            "pwa-offline" {
                try {
                    Invoke-WebRequest -Uri "$RepoUrl/templates/pwa-offline/pwa-specialist.md" -OutFile "$AgentsDir\pwa-specialist.md" -UseBasicParsing
                    Write-Success "  pwa-specialist.md"
                } catch {
                    Write-Warning "No se pudo descargar pwa-specialist.md"
                }
            }
            "saas-platform" {
                try {
                    Invoke-WebRequest -Uri "$RepoUrl/templates/saas-platform/saas-architect.md" -OutFile "$AgentsDir\saas-architect.md" -UseBasicParsing
                    Write-Success "  saas-architect.md"
                } catch {
                    Write-Warning "No se pudo descargar saas-architect.md"
                }
            }
            "ecommerce" {
                try {
                    Invoke-WebRequest -Uri "$RepoUrl/templates/ecommerce/payments-specialist.md" -OutFile "$AgentsDir\payments-specialist.md" -UseBasicParsing
                    Write-Success "  payments-specialist.md"
                } catch {
                    Write-Warning "No se pudo descargar payments-specialist.md"
                }
            }
        }
    }
}

function New-ProjectContext {
    param([hashtable]$ProjectInfo)
    
    Write-Step "Generando project-context.yml..."
    
    # Generar lista de entidades en formato YAML
    $entitiesYaml = ""
    $entityArray = $ProjectInfo.Entities -split ","
    foreach ($entity in $entityArray) {
        $entity = $entity.Trim()
        $entitiesYaml += @"

    - name: "$entity"
      description: "Entidad $entity del sistema"
"@
    }
    
    $currentDate = Get-Date -Format "yyyy-MM-dd"
    
    $contextContent = @"
# =============================================================================
# PROJECT CONTEXT - $($ProjectInfo.Name)
# =============================================================================
# Generado automáticamente por MERN Agents Framework
# Fecha: $currentDate
# =============================================================================

project:
  name: "$($ProjectInfo.Name)"
  description: "$($ProjectInfo.Description)"
  repository: "$($ProjectInfo.Repo)"
  type: "$($ProjectInfo.Type)"
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
  authentication: $($ProjectInfo.FeatAuth)
  auth_provider: "next-auth"
  offline_first: $($ProjectInfo.FeatPwa)
  pwa: $($ProjectInfo.FeatPwa)
  payments: $($ProjectInfo.FeatPayments)
  payment_provider: "$($ProjectInfo.PaymentProvider)"
  ai_integration: $($ProjectInfo.FeatAi)
  ai_provider: "$($ProjectInfo.AiProvider)"

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
  entities:$entitiesYaml

  main_flows:
    - name: "user-authentication"
      description: "Flujo de autenticación de usuarios"

conventions:
  component_naming: "PascalCase"
  file_naming: "kebab-case"
  function_naming: "camelCase"
  commit_convention: "conventional"
"@
    
    Set-Content -Path "$AgentsDir\project-context.yml" -Value $contextContent
    Write-Success "project-context.yml generado"
}

# =============================================================================
# RESUMEN FINAL
# =============================================================================

function Write-Summary {
    param([hashtable]$ProjectInfo)
    
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "                    ✓ INSTALACIÓN COMPLETADA" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "Proyecto configurado: $($ProjectInfo.Name)" -ForegroundColor Cyan
    Write-Host "Tipo: $($ProjectInfo.Type)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Archivos creados:"
    Write-Host "  $AgentsDir\" -ForegroundColor Blue
    Write-Host "    ├── _core\             (Contexto compartido)"
    Write-Host "    ├── project-context.yml (Configuración del proyecto)"
    Write-Host "    └── *.md               (Agentes especializados)"
    Write-Host ""
    Write-Host "Próximos pasos:" -ForegroundColor Yellow
    Write-Host "  1. Revisa y personaliza $AgentsDir\project-context.yml"
    Write-Host "  2. Usa los agentes en GitHub Copilot Chat:"
    Write-Host ""
    Write-Host "     @orchestrator" -ForegroundColor Magenta -NoNewline
    Write-Host " ¿Cómo empiezo a desarrollar mi aplicación?"
    Write-Host ""
    Write-Host "  3. Consulta la documentación: " -NoNewline
    Write-Host "https://github.com/Angel-Baez/mern-agents-framework" -ForegroundColor Cyan
    Write-Host ""
}

# =============================================================================
# MAIN
# =============================================================================

function Main {
    Write-Banner
    Test-Requirements
    
    $projectInfo = Get-ProjectInfo
    
    Write-Host ""
    New-DirectoryStructure
    Get-CoreFiles
    Get-Agents
    
    # Descargar template si se especificó o si el tipo lo requiere
    if (-not [string]::IsNullOrWhiteSpace($Template)) {
        Get-Template -TemplateName $Template
    } elseif ($projectInfo.Type -eq "pwa" -or $projectInfo.FeatPwa -eq "true") {
        Get-Template -TemplateName "pwa-offline"
    } elseif ($projectInfo.Type -eq "saas") {
        Get-Template -TemplateName "saas-platform"
    } elseif ($projectInfo.Type -eq "ecommerce" -or $projectInfo.FeatPayments -eq "true") {
        Get-Template -TemplateName "ecommerce"
    }
    
    New-ProjectContext -ProjectInfo $projectInfo
    Write-Summary -ProjectInfo $projectInfo
}

Main
