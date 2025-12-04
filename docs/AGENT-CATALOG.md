# 📚 Catálogo de Agentes

Este documento describe en detalle cada agente disponible en el MERN Agents Framework, sus capacidades, cuándo usarlos y ejemplos de invocación.

## Tabla de Contenidos

- [Agentes Core](#agentes-core)
  - [Orchestrator](#-orchestrator)
  - [Product Manager](#-product-manager)
  - [Solution Architect](#-solution-architect)
- [Agentes de Desarrollo](#agentes-de-desarrollo)
  - [Backend Architect](#-backend-architect)
  - [Frontend Architect](#-frontend-architect)
  - [Data Engineer](#-data-engineer)
- [Agentes de Calidad y Seguridad](#agentes-de-calidad-y-seguridad)
  - [Security Guardian](#-security-guardian)
  - [Test Engineer](#-test-engineer)
  - [QA Lead](#-qa-lead)
  - [Code Reviewer](#-code-reviewer)
- [Agentes de Operaciones](#agentes-de-operaciones)
  - [DevOps Engineer](#-devops-engineer)
  - [Observability Engineer](#-observability-engineer)
  - [Release Manager](#-release-manager)
- [Agentes Especializados](#agentes-especializados)
  - [AI Integration Engineer](#-ai-integration-engineer)
  - [Documentation Engineer](#-documentation-engineer)
- [Templates Especializados](#templates-especializados)
  - [PWA Specialist](#-pwa-specialist)
  - [SaaS Architect](#-saas-architect)
  - [Payments Specialist](#-payments-specialist)

---

## Agentes Core

### 🎯 Orchestrator

**ID:** `orchestrator`

**Rol:** Punto de entrada principal del framework. Analiza solicitudes y coordina la asignación a los agentes apropiados.

**Cuándo usarlo:**
- Como primera opción para cualquier solicitud
- Cuando no estás seguro de qué agente necesitas
- Para tareas que requieren múltiples agentes

**Capacidades:**
| Capacidad | Descripción |
|-----------|-------------|
| Análisis de solicitudes | Interpreta requisitos y los categoriza |
| Asignación de agentes | Determina el agente más apropiado |
| Coordinación | Orquesta tareas complejas multi-agente |
| Contexto | Mantiene contexto entre interacciones |

**Ejemplos de invocación:**

```
@orchestrator Necesito implementar un sistema de autenticación con Google OAuth

@orchestrator Hay un bug en el checkout, los usuarios no pueden completar la compra

@orchestrator Quiero agregar capacidades offline a mi app

@orchestrator Prepara el release v2.0.0
```

**Handoffs típicos:**
- `@backend-architect` - Para diseño de APIs y servicios
- `@frontend-architect` - Para componentes y UI
- `@security-guardian` - Para revisiones de seguridad
- `@devops-engineer` - Para CI/CD y deployment

---

### 📋 Product Manager

**ID:** `product-manager`

**Rol:** Define requisitos de producto, crea user stories y establece criterios de aceptación.

**Cuándo usarlo:**
- Definir nuevas funcionalidades
- Crear user stories y épicas
- Establecer KPIs y métricas de éxito
- Priorizar backlog

**Capacidades:**
| Capacidad | Descripción |
|-----------|-------------|
| User Stories | Formato "Como... quiero... para..." |
| Criterios META | Medible, Específico, Temporal, Alcanzable |
| KPIs | Definición de métricas de éxito |
| Roadmap | Planificación de features |

**Ejemplos de invocación:**

```
@product-manager Crea user stories para el módulo de inventario

@product-manager Define criterios de aceptación para la funcionalidad de búsqueda

@product-manager ¿Cuáles KPIs debemos trackear para el módulo de ventas?

@product-manager Prioriza estas features: [lista de features]
```

**Output típico:**

```markdown
## User Story: Gestión de Inventario

**Como** gerente de almacén
**Quiero** ver el stock actual de todos los productos
**Para** poder tomar decisiones de reabastecimiento

### Criterios de Aceptación (META)
- [ ] Muestra lista paginada de productos (20/página)
- [ ] Incluye filtro por categoría y estado de stock
- [ ] Alerta visual cuando stock < mínimo configurado
- [ ] Tiempo de carga < 2 segundos
```

---

### 🏛️ Solution Architect

**ID:** `solution-architect`

**Rol:** Diseña la arquitectura general del sistema, toma decisiones técnicas y documenta ADRs.

**Cuándo usarlo:**
- Decisiones arquitectónicas importantes
- Evaluación de tecnologías
- Diseño de sistemas distribuidos
- Documentación de ADRs

**Capacidades:**
| Capacidad | Descripción |
|-----------|-------------|
| ADRs | Architecture Decision Records |
| Diagramas C4 | Contexto, Contenedores, Componentes, Código |
| Trade-off Analysis | Evaluación de pros/cons |
| Tech Evaluation | Comparación de tecnologías |

**Ejemplos de invocación:**

```
@solution-architect Diseña la arquitectura para soportar 10,000 usuarios concurrentes

@solution-architect Crea un ADR para la decisión de usar MongoDB vs PostgreSQL

@solution-architect ¿Deberíamos usar microservicios o monolito para esta app?

@solution-architect Diagrama C4 para el sistema de pagos
```

---

## Agentes de Desarrollo

### ⚙️ Backend Architect

**ID:** `backend-architect`

**Rol:** Diseña e implementa la capa backend incluyendo API Routes, servicios, repositorios y lógica de negocio.

**Cuándo usarlo:**
- Diseño de endpoints API
- Implementación de servicios
- Lógica de negocio compleja
- Integración con MongoDB

**Capacidades:**
| Capacidad | Descripción |
|-----------|-------------|
| API Design | RESTful APIs con Next.js API Routes |
| Clean Architecture | Services, Repositories, DTOs |
| SOLID | Aplicación de principios SOLID |
| MongoDB | Queries, índices, agregaciones |

**Ejemplos de invocación:**

```
@backend-architect Diseña el endpoint para CRUD de productos

@backend-architect Implementa el servicio de sincronización offline

@backend-architect Crea el repositorio de usuarios con paginación

@backend-architect Optimiza esta query de MongoDB: [query]
```

**Patrones implementados:**
- Repository Pattern
- Service Layer
- DTO Pattern
- Dependency Injection

---

### 🎨 Frontend Architect

**ID:** `frontend-architect`

**Rol:** Diseña e implementa componentes React, gestión de estado y UI/UX accesible.

**Cuándo usarlo:**
- Crear componentes React
- Diseño de UI accesible
- Gestión de estado con Zustand
- Integración con Tailwind

**Capacidades:**
| Capacidad | Descripción |
|-----------|-------------|
| React Components | Server/Client Components |
| Accessibility | WCAG 2.1 AA compliance |
| State Management | Zustand patterns |
| Tailwind | Utility-first CSS |

**Ejemplos de invocación:**

```
@frontend-architect Crea un componente de tabla con sorting y paginación

@frontend-architect Diseña un formulario accesible para registro de productos

@frontend-architect Implementa el store de Zustand para el carrito de compras

@frontend-architect Revisa la accesibilidad de este componente: [código]
```

**Estándares implementados:**
- WCAG 2.1 AA
- Semantic HTML
- Keyboard Navigation
- Screen Reader Support

---

### 🗃️ Data Engineer

**ID:** `data-engineer`

**Rol:** Diseña esquemas de base de datos, optimiza queries y gestiona migraciones.

**Cuándo usarlo:**
- Diseño de esquemas MongoDB
- Creación de índices
- Pipelines de agregación
- Migraciones de datos

**Capacidades:**
| Capacidad | Descripción |
|-----------|-------------|
| Schema Design | Mongoose schemas optimizados |
| Indexing | Índices compuestos y parciales |
| Aggregation | Pipelines complejos |
| Migration | Scripts de migración |

**Ejemplos de invocación:**

```
@data-engineer Diseña el esquema para la entidad Producto con soporte offline

@data-engineer Crea índices para optimizar búsquedas por categoría y precio

@data-engineer Pipeline de agregación para reporte de ventas mensuales

@data-engineer Script de migración para añadir campo syncStatus a productos
```

---

## Agentes de Calidad y Seguridad

### 🛡️ Security Guardian

**ID:** `security-guardian`

**Rol:** Audita código y configuración para vulnerabilidades de seguridad, implementa best practices.

**Cuándo usarlo:**
- Revisión de seguridad de código
- Implementación de autenticación
- Validación de inputs
- Configuración de CSP/CORS

**Capacidades:**
| Capacidad | Descripción |
|-----------|-------------|
| OWASP Top 10 | Protección contra vulnerabilidades comunes |
| Input Validation | Zod schemas |
| Rate Limiting | Protección contra abuse |
| Auth | NextAuth.js secure config |

**Ejemplos de invocación:**

```
@security-guardian Revisa la seguridad de este endpoint de login

@security-guardian Implementa rate limiting para las APIs públicas

@security-guardian Audita las dependencias en busca de vulnerabilidades

@security-guardian Configura CSP headers para producción
```

---

### 🧪 Test Engineer

**ID:** `test-engineer`

**Rol:** Diseña e implementa estrategia de testing, escribe tests unitarios, de integración y E2E.

**Cuándo usarlo:**
- Escribir tests unitarios
- Tests de integración
- Tests E2E con Playwright
- Mocking de servicios

**Capacidades:**
| Capacidad | Descripción |
|-----------|-------------|
| Unit Tests | Jest/Vitest |
| Component Tests | React Testing Library |
| E2E Tests | Playwright |
| Mocking | MSW, jest.mock |

**Ejemplos de invocación:**

```
@test-engineer Escribe tests unitarios para ProductService

@test-engineer Crea tests de integración para el endpoint de checkout

@test-engineer Test E2E para el flujo completo de compra

@test-engineer Configura mocks para las APIs externas
```

---

### ✅ QA Lead

**ID:** `qa-lead`

**Rol:** Define estrategia de QA, crea checklists de release y gestiona bugs.

**Cuándo usarlo:**
- Definir estrategia de testing
- Checklists pre-release
- Priorización de bugs
- Criterios de calidad

**Capacidades:**
| Capacidad | Descripción |
|-----------|-------------|
| Test Strategy | Pirámide de testing |
| Release Checklist | Validaciones pre-deploy |
| Bug Triage | Priorización y clasificación |
| Quality Gates | Criterios mínimos |

**Ejemplos de invocación:**

```
@qa-lead Define la estrategia de testing para el módulo de pagos

@qa-lead Crea checklist de validación para release v1.2.0

@qa-lead Prioriza estos bugs reportados: [lista]

@qa-lead ¿Estamos listos para ir a producción?
```

---

### 👀 Code Reviewer

**ID:** `code-reviewer`

**Rol:** Revisa código para calidad, consistencia y mejores prácticas.

**Cuándo usarlo:**
- Review de PRs
- Sugerencias de mejora
- Consistencia de código
- Detección de code smells

**Capacidades:**
| Capacidad | Descripción |
|-----------|-------------|
| Code Review | Análisis de calidad |
| TypeScript | Typing y best practices |
| Patterns | Detección de anti-patterns |
| Suggestions | Mejoras concretas |

**Ejemplos de invocación:**

```
@code-reviewer Revisa este componente: [código]

@code-reviewer Analiza este PR en busca de mejoras

@code-reviewer ¿Este código sigue los patrones del proyecto?

@code-reviewer Encuentra code smells en src/components/
```

---

## Agentes de Operaciones

### 🚀 DevOps Engineer

**ID:** `devops-engineer`

**Rol:** Configura CI/CD, gestiona deployments y optimiza infraestructura.

**Cuándo usarlo:**
- Configuración de GitHub Actions
- Deployment a Vercel
- Variables de entorno
- Optimización de builds

**Capacidades:**
| Capacidad | Descripción |
|-----------|-------------|
| CI/CD | GitHub Actions workflows |
| Vercel | Configuración y deployment |
| Environment | Gestión de variables |
| Docker | Containerización |

**Ejemplos de invocación:**

```
@devops-engineer Crea workflow de CI para PRs

@devops-engineer Configura preview deployments en Vercel

@devops-engineer Optimiza el tiempo de build de Next.js

@devops-engineer Gestiona secrets para producción
```

---

### 📊 Observability Engineer

**ID:** `observability-engineer`

**Rol:** Implementa monitoreo, logging y métricas de rendimiento.

**Cuándo usarlo:**
- Configurar Lighthouse CI
- Monitoreo de Core Web Vitals
- Logging estructurado
- Alertas de rendimiento

**Capacidades:**
| Capacidad | Descripción |
|-----------|-------------|
| Lighthouse | Performance audits |
| Web Vitals | LCP, FID, CLS |
| Logging | Structured logging |
| Monitoring | Error tracking |

**Ejemplos de invocación:**

```
@observability-engineer Configura Lighthouse CI en el pipeline

@observability-engineer Implementa tracking de Core Web Vitals

@observability-engineer Configura logging estructurado con Pino

@observability-engineer Crea dashboard de métricas de rendimiento
```

---

### 📦 Release Manager

**ID:** `release-manager`

**Rol:** Gestiona versiones, changelogs y proceso de release.

**Cuándo usarlo:**
- Preparar releases
- Generar changelogs
- Tagging de versiones
- GitHub Releases

**Capacidades:**
| Capacidad | Descripción |
|-----------|-------------|
| SemVer | Versionado semántico |
| Changelog | Generación automática |
| Tags | Git tagging |
| Release Notes | GitHub Releases |

**Ejemplos de invocación:**

```
@release-manager Prepara el release v1.2.0

@release-manager Genera changelog desde v1.1.0

@release-manager ¿Qué tipo de bump necesita este cambio?

@release-manager Crea release notes para GitHub
```

---

## Agentes Especializados

### 🤖 AI Integration Engineer

**ID:** `ai-integration-engineer`

**Rol:** Integra servicios de IA como OpenAI, Anthropic, Gemini.

**Cuándo usarlo:**
- Integración con OpenAI
- Diseño de prompts
- Streaming responses
- Fallback strategies

**Capacidades:**
| Capacidad | Descripción |
|-----------|-------------|
| OpenAI | GPT integration |
| Prompts | Prompt engineering |
| Streaming | SSE/WebSocket |
| Fallbacks | Multi-provider |

**Ejemplos de invocación:**

```
@ai-integration-engineer Integra OpenAI para generación de descripciones de productos

@ai-integration-engineer Diseña el prompt para el chatbot de soporte

@ai-integration-engineer Implementa streaming de respuestas

@ai-integration-engineer Configura fallback a Anthropic si OpenAI falla
```

---

### 📝 Documentation Engineer

**ID:** `documentation-engineer`

**Rol:** Crea y mantiene documentación técnica y de usuario.

**Cuándo usarlo:**
- Documentación de API
- README y guías
- JSDoc/TSDoc
- Onboarding docs

**Capacidades:**
| Capacidad | Descripción |
|-----------|-------------|
| OpenAPI | Swagger docs |
| Markdown | Technical writing |
| TSDoc | Code documentation |
| Guides | User guides |

**Ejemplos de invocación:**

```
@documentation-engineer Documenta la API de productos con OpenAPI

@documentation-engineer Actualiza el README con instrucciones de instalación

@documentation-engineer Agrega JSDoc a los servicios de src/core/

@documentation-engineer Crea guía de onboarding para nuevos desarrolladores
```

---

## Templates Especializados

### 📱 PWA Specialist

**ID:** `pwa-specialist` (en `templates/pwa-offline/`)

**Rol:** Implementa capacidades PWA, Service Workers y sincronización offline.

**Cuándo usarlo:**
- Apps offline-first
- Service Workers
- IndexedDB
- Background Sync

**Ejemplos de invocación:**

```
@pwa-specialist Configura Service Worker para cache de assets

@pwa-specialist Implementa sincronización en background

@pwa-specialist Configura IndexedDB para almacenamiento offline

@pwa-specialist Crea el manifest.json para instalación
```

---

### 🏢 SaaS Architect

**ID:** `saas-architect` (en `templates/saas-platform/`)

**Rol:** Diseña arquitectura multi-tenant, billing y subscriptions.

**Cuándo usarlo:**
- Multi-tenancy
- Billing con Stripe
- Feature flags por plan
- Tenant isolation

**Ejemplos de invocación:**

```
@saas-architect Diseña el modelo de multi-tenancy

@saas-architect Implementa billing con Stripe

@saas-architect Configura feature flags por plan de suscripción

@saas-architect Crea middleware de tenant resolution
```

---

### 💳 Payments Specialist

**ID:** `payments-specialist` (en `templates/ecommerce/`)

**Rol:** Implementa integración con proveedores de pago.

**Cuándo usarlo:**
- Stripe integration
- MercadoPago
- Webhooks de pago
- Checkout flows

**Ejemplos de invocación:**

```
@payments-specialist Integra Stripe Checkout

@payments-specialist Configura webhooks de pago

@payments-specialist Implementa MercadoPago para LATAM

@payments-specialist Manejo de refunds y disputas
```

---

## Matriz de Decisión de Agentes

| Si necesitas... | Usa este agente |
|-----------------|-----------------|
| No sé qué agente usar | @orchestrator |
| Definir requisitos/user stories | @product-manager |
| Decisiones de arquitectura | @solution-architect |
| Endpoints y lógica backend | @backend-architect |
| Componentes React y UI | @frontend-architect |
| Esquemas de BD y queries | @data-engineer |
| Revisión de seguridad | @security-guardian |
| Escribir tests | @test-engineer |
| Estrategia de QA | @qa-lead |
| CI/CD y deployment | @devops-engineer |
| Monitoreo y métricas | @observability-engineer |
| Integrar IA | @ai-integration-engineer |
| Documentación | @documentation-engineer |
| Releases y versiones | @release-manager |
| Code review | @code-reviewer |
| PWA y offline | @pwa-specialist |
| SaaS multi-tenant | @saas-architect |
| Pagos online | @payments-specialist |

---

¿Tienes dudas sobre qué agente usar? ¡Empieza siempre con `@orchestrator`!
