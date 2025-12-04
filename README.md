# 🤖 MERN Agents Framework

<div align="center">

**Framework de agentes de GitHub Copilot para proyectos MERN Stack + Next.js + TypeScript**

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green.svg)](https://www.mongodb.com/)

</div>

---

## 🚀 Quick Start

### 1. Instalación vía CLI (npx) — La forma moderna y recomendada

Ideal para proyectos nuevos o cuando quieres la experiencia completa del instalador interactivo.

```bash
npx create-mern-agents
```

Este comando:
- ✅ Detecta tu proyecto
- ✅ Descarga automáticamente los agentes
- ✅ Aplica templates (PWA, SaaS, ecommerce, admin dashboard)
- ✅ Genera el archivo `project-context.yml`
- ✅ Configura `.github/copilot/agents/`
- ✅ Muestra un asistente interactivo

**Funciona en:**
- 🐧 Linux
- 🍎 macOS
- 🪟 Windows (PowerShell y Git Bash)

### 2. Instalación Automática (mediante Scripts)

```bash
# Linux/macOS
curl -fsSL https://raw.githubusercontent.com/Angel-Baez/mern-agents-framework/main/init-agents.sh | bash

# Windows PowerShell
irm https://raw.githubusercontent.com/Angel-Baez/mern-agents-framework/main/init-agents.ps1 | iex
```

### 3. Instalación Manual

```bash
# Clonar el repositorio
git clone https://github.com/Angel-Baez/mern-agents-framework.git

# Copiar agentes a tu proyecto
cp -r mern-agents-framework/agents/ tu-proyecto/.github/copilot/agents/
cp -r mern-agents-framework/_core/ tu-proyecto/.github/copilot/agents/_core/
cp mern-agents-framework/project-context.yml tu-proyecto/.github/copilot/agents/

# Editar project-context.yml con los datos de tu proyecto
```

---

## 📋 Catálogo de Agentes

| Agente | ID | Descripción | Cuándo Usarlo |
|--------|-----|-------------|---------------|
| **🎯 Orchestrator** | `orchestrator` | Punto de entrada principal. Analiza solicitudes y recomienda el agente especializado apropiado | Siempre que no sepas qué agente usar |
| **📝 Product Manager** | `product-manager` | User stories, criterios de aceptación META, KPIs y roadmap | Definir features, priorización, requisitos de negocio |
| **🏗️ Solution Architect** | `solution-architect` | ADRs, diagramas C4, evaluación de tecnologías | Decisiones arquitectónicas, trade-offs técnicos |
| **⚙️ Backend Architect** | `backend-architect` | API Routes Next.js, MongoDB, Services/Repositories, SOLID | Endpoints, lógica de negocio, integraciones |
| **🎨 Frontend Architect** | `frontend-architect` | Componentes React, Tailwind, accesibilidad WCAG 2.1 AA | UI/UX, componentes, estado, estilos |
| **📊 Data Engineer** | `data-engineer` | Esquemas Mongoose, migraciones, índices, agregaciones | Modelado de datos, queries, performance BD |
| **🔒 Security Guardian** | `security-guardian` | OWASP Top 10, validación Zod, rate limiting, CSP | Autenticación, autorización, vulnerabilidades |
| **🧪 Test Engineer** | `test-engineer` | Jest/Vitest, React Testing Library, mocks, E2E | Tests unitarios, integración, E2E |
| **✅ QA Lead** | `qa-lead` | Estrategia QA, checklists de release, gestión de bugs | Calidad, testing manual, releases |
| **🚢 DevOps Engineer** | `devops-engineer` | GitHub Actions, Vercel, workflows CI/CD | Deployment, pipelines, infraestructura |
| **📈 Observability Engineer** | `observability-engineer` | Lighthouse, Core Web Vitals, logging estructurado | Métricas, monitoreo, performance |
| **🤖 AI Integration Engineer** | `ai-integration-engineer` | OpenAI/Gemini/Anthropic, prompts, fallbacks | Integración IA, chatbots, prompts |
| **📚 Documentation Engineer** | `documentation-engineer` | API docs OpenAPI, README, guías de onboarding | Documentación técnica, APIs, guías |
| **📦 Release Manager** | `release-manager` | SemVer, changelogs, tags, GitHub Releases | Versionado, releases, notas de versión |
| **👁️ Code Reviewer** | `code-reviewer` | Estándares TypeScript, checklists de review, feedback | Code review, mejores prácticas |

---

## 💬 Cómo Usar los Agentes

### Invocar al Orchestrator (Recomendado)

```
@orchestrator Necesito crear un sistema de autenticación con JWT y refresh tokens
```

El Orchestrator analizará tu solicitud y te recomendará el agente especializado más apropiado.

### Invocar Agentes Directamente

```
@backend-architect Diseña los endpoints para gestión de usuarios con CRUD completo

@frontend-architect Crea un componente de formulario de login con validación

@security-guardian Revisa la implementación de autenticación

@test-engineer Genera tests para el servicio de autenticación
```

### Flujo de Trabajo Típico

```mermaid
graph LR
    A[@orchestrator] --> B[@product-manager]
    B --> C[@solution-architect]
    C --> D[@backend-architect]
    C --> E[@frontend-architect]
    D --> F[@data-engineer]
    D --> G[@security-guardian]
    E --> H[@test-engineer]
    H --> I[@qa-lead]
    I --> J[@release-manager]
```

---

## 📁 Estructura de Proyecto Recomendada

```
tu-proyecto/
├── .github/
│   └── copilot/
│       └── agents/
│           ├── _core/                    # Contexto compartido
│           │   ├── _framework-context.md
│           │   ├── _shared-solid-principles.md
│           │   ├── _shared-data-modeling.md
│           │   ├── _shared-workflows.md
│           │   └── _conflict-resolution.md
│           ├── orchestrator.md
│           ├── product-manager.md
│           ├── solution-architect.md
│           ├── backend-architect.md
│           ├── frontend-architect.md
│           ├── data-engineer.md
│           ├── security-guardian.md
│           ├── test-engineer.md
│           ├── qa-lead.md
│           ├── devops-engineer.md
│           ├── observability-engineer.md
│           ├── ai-integration-engineer.md
│           ├── documentation-engineer.md
│           ├── release-manager.md
│           ├── code-reviewer.md
│           └── project-context.yml
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── api/                          # API Routes
│   │   ├── (auth)/                       # Grupo de rutas autenticación
│   │   └── (dashboard)/                  # Grupo de rutas dashboard
│   ├── components/
│   │   ├── ui/                           # Componentes base
│   │   └── features/                     # Componentes de features
│   ├── core/
│   │   ├── domain/                       # Entidades y value objects
│   │   ├── services/                     # Lógica de negocio
│   │   └── repositories/                 # Acceso a datos
│   ├── lib/                              # Utilidades y helpers
│   └── types/                            # Tipos TypeScript
├── public/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

---

## 🎯 Templates Especializados

El framework incluye templates para casos de uso comunes:

| Template | Descripción | Agentes Adicionales |
|----------|-------------|---------------------|
| **pwa-offline** | PWA con soporte offline, Service Worker, IndexedDB | `pwa-specialist` |
| **saas-platform** | Multi-tenancy, billing, subscriptions | `saas-architect` |
| **ecommerce** | Checkout, payments (Stripe/MercadoPago), inventario | `payments-specialist` |
| **admin-dashboard** | CRUD avanzado, reportes, roles y permisos | - |

### Activar un Template

```bash
# Durante la instalación
./init-agents.sh --template=pwa-offline

# O manualmente
cp templates/pwa-offline/* .github/copilot/agents/
```

---

## 📖 Documentación

- [🚀 Quick Start](docs/QUICKSTART.md) - Guía de inicio rápido
- [🎨 Customization](docs/CUSTOMIZATION.md) - Cómo personalizar agentes
- [📋 Agent Catalog](docs/AGENT-CATALOG.md) - Descripción detallada de cada agente
- [🔧 Troubleshooting](docs/TROUBLESHOOTING.md) - Problemas comunes y soluciones

---

## 🔧 Configuración del Proyecto

El archivo `project-context.yml` define el contexto específico de tu proyecto:

```yaml
project:
  name: mi-proyecto
  description: Descripción de mi proyecto
  repository: usuario/mi-proyecto
  type: web-app

stack:
  framework: next.js
  version: "14"
  typescript: true
  styling: tailwind
  state_management: zustand
  backend: next-api-routes
  database: mongodb
  orm: mongoose
  deployment: vercel

features:
  authentication: true
  offline_first: false
  pwa: false
  payments: false
  ai_integration: false

quality_targets:
  lighthouse_performance: 90
  lighthouse_accessibility: 100
  test_coverage: 80

domain:
  entities:
    - User
    - Product
  main_flows:
    - user-registration
    - product-management
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la [MIT License](LICENSE).

---

## 🙏 Créditos

- Basado en los agentes de [GondolApp](https://github.com/Angel-Baez/gondolapp-beta)
- Diseñado para el ecosistema MERN Stack + Next.js + TypeScript

---

<div align="center">

**⭐ Si este framework te resulta útil, considera darle una estrella en GitHub ⭐**

</div>
