# 🚀 Guía de Inicio Rápido

Esta guía te ayudará a configurar el **MERN Agents Framework** en tu proyecto en menos de 5 minutos.

## Requisitos Previos

- Proyecto Next.js 14+ con TypeScript
- GitHub Copilot habilitado en tu repositorio
- Git configurado

## Instalación Rápida

### Linux/macOS

```bash
curl -sSL https://raw.githubusercontent.com/Angel-Baez/mern-agents-framework/main/init-agents.sh | bash
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/Angel-Baez/mern-agents-framework/main/init-agents.ps1 | iex
```

### Instalación Manual

```bash
# Clonar el repositorio
git clone https://github.com/Angel-Baez/mern-agents-framework.git temp-agents

# Crear estructura de directorios
mkdir -p .github/agents/_core .github/agents/agents

# Copiar archivos necesarios
cp -r temp-agents/_core/* .github/agents/_core/
cp -r temp-agents/agents/* .github/agents/agents/
cp temp-agents/project-context.yml .github/agents/

# Limpiar
rm -rf temp-agents
```

## Configuración del Proyecto

### 1. Editar `project-context.yml`

Abre `.github/agents/project-context.yml` y configura tu proyecto:

```yaml
project:
  name: "mi-aplicacion"
  description: "Descripción de mi aplicación"
  repository: "https://github.com/usuario/mi-aplicacion"
  type: "webapp"  # webapp, saas, ecommerce, pwa, admin

stack:
  framework: "next.js"
  version: "14.x"
  typescript: true
  styling: "tailwind"
  state_management: "zustand"
  backend: "api-routes"
  database: "mongodb"
  orm: "mongoose"
  deployment: "vercel"

features:
  authentication:
    enabled: true
    provider: "next-auth"
  offline_first:
    enabled: false
  pwa:
    enabled: false
  payments:
    enabled: false
  ai_integration:
    enabled: false

quality_targets:
  lighthouse:
    performance: 90
    accessibility: 100
  test_coverage:
    unit: 80
    integration: 70
```

### 2. Agregar Entidades del Dominio

Define las entidades principales de tu aplicación:

```yaml
domain:
  entities:
    - name: "User"
      description: "Usuario del sistema"
      fields:
        - "id: string"
        - "email: string"
        - "name: string"
        - "role: UserRole"
    
    - name: "Product"
      description: "Producto del catálogo"
      fields:
        - "id: string"
        - "name: string"
        - "price: number"
        - "category: Category"
```

## Uso de los Agentes

### Invocar al Orchestrator

El orchestrator es el punto de entrada principal. Úsalo para cualquier solicitud:

```
@orchestrator Necesito implementar autenticación con Google OAuth
```

El orchestrator analizará tu solicitud y te dirigirá al agente apropiado.

### Invocar Agentes Directamente

Si sabes qué agente necesitas, puedes invocarlo directamente:

```
@backend-architect Diseña el esquema de la API REST para gestión de usuarios

@frontend-architect Crea un componente de formulario accesible para registro

@security-guardian Revisa la implementación de autenticación
```

## Ejemplos de Uso

### Crear una Nueva Feature

```
@orchestrator Quiero implementar un sistema de notificaciones push
```

El orchestrator:
1. Analizará el requisito
2. Consultará tu `project-context.yml`
3. Creará un plan de trabajo
4. Te dirigirá a los agentes necesarios (frontend-architect, backend-architect, pwa-specialist)

### Resolver un Bug

```
@orchestrator Los usuarios reportan que no pueden cerrar sesión en Safari
```

### Refactorizar Código

```
@code-reviewer Analiza src/components/UserForm.tsx y sugiere mejoras
```

### Preparar un Release

```
@release-manager Prepara el release v1.2.0 con los cambios desde v1.1.0
```

## Estructura de Directorios Resultante

```
tu-proyecto/
├── .github/
│   └── agents/
│       ├── _core/
│       │   ├── _framework-context.md
│       │   ├── _shared-solid-principles.md
│       │   ├── _shared-data-modeling.md
│       │   ├── _shared-workflows.md
│       │   └── _conflict-resolution.md
│       ├── agents/
│       │   ├── orchestrator.md
│       │   ├── backend-architect.md
│       │   ├── frontend-architect.md
│       │   └── ... (otros agentes)
│       └── project-context.yml
├── src/
│   └── ... (tu código)
└── package.json
```

## Verificar Instalación

Verifica que los agentes están correctamente instalados:

```bash
ls -la .github/agents/
# Deberías ver:
# - _core/
# - agents/
# - project-context.yml
```

## Próximos Pasos

1. 📖 Lee el [Catálogo de Agentes](./AGENT-CATALOG.md) para conocer las capacidades de cada uno
2. 🎨 Aprende a [Personalizar Agentes](./CUSTOMIZATION.md) para tu proyecto
3. 🔧 Consulta [Troubleshooting](./TROUBLESHOOTING.md) si tienes problemas

## Soporte

- 📚 [Documentación completa](https://github.com/Angel-Baez/mern-agents-framework)
- 🐛 [Reportar un bug](https://github.com/Angel-Baez/mern-agents-framework/issues)
- 💡 [Solicitar una feature](https://github.com/Angel-Baez/mern-agents-framework/discussions)

---

¿Listo para empezar? ¡Invoca a `@orchestrator` con tu primera solicitud!
