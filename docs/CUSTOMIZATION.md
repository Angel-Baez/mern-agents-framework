# 🎨 Guía de Personalización de Agentes

Esta guía explica cómo adaptar los agentes del MERN Agents Framework a las necesidades específicas de tu proyecto.

## Tabla de Contenidos

- [Niveles de Personalización](#niveles-de-personalización)
- [Personalizar project-context.yml](#personalizar-project-contextyml)
- [Modificar Agentes Existentes](#modificar-agentes-existentes)
- [Crear Nuevos Agentes](#crear-nuevos-agentes)
- [Agregar Templates Especializados](#agregar-templates-especializados)
- [Mejores Prácticas](#mejores-prácticas)

---

## Niveles de Personalización

El framework ofrece tres niveles de personalización:

| Nivel | Complejidad | Uso Recomendado |
|-------|-------------|-----------------|
| **1. Contexto** | Baja | Configurar `project-context.yml` con datos de tu proyecto |
| **2. Extensión** | Media | Agregar secciones o ejemplos a agentes existentes |
| **3. Creación** | Alta | Crear nuevos agentes especializados para tu dominio |

---

## Personalizar project-context.yml

### Sección `project`

```yaml
project:
  name: "mi-aplicacion"
  description: "Sistema de gestión de inventario con capacidades offline"
  repository: "https://github.com/empresa/mi-aplicacion"
  type: "pwa-inventory"  # Tipos: webapp, saas, ecommerce, pwa, admin
  version: "1.0.0"
  
  # Agregar información adicional del equipo
  team:
    lead: "@usuario-github"
    developers:
      - "@dev1"
      - "@dev2"
    reviewers:
      - "@senior-dev"
```

### Sección `stack`

```yaml
stack:
  framework: "next.js"
  version: "14.x"
  typescript: true
  styling: "tailwind"
  state_management: "zustand"  # Opciones: zustand, redux, jotai, recoil
  backend: "api-routes"
  database: "mongodb"
  orm: "mongoose"
  deployment: "vercel"
  
  # Agregar herramientas adicionales específicas
  additional:
    email: "resend"
    queue: "bull"
    cache: "redis"
    search: "algolia"
    storage: "cloudinary"
    monitoring: "sentry"
```

### Sección `features`

```yaml
features:
  authentication:
    enabled: true
    provider: "next-auth"
    strategies:
      - "credentials"
      - "google"
      - "microsoft"
    session_strategy: "jwt"
    mfa: false  # Multi-factor authentication
    
  offline_first:
    enabled: true
    sync_strategy: "background-sync"
    conflict_resolution: "last-write-wins"  # o "server-wins", "manual"
    storage: "indexeddb"
    max_offline_days: 30
    
  pwa:
    enabled: true
    service_worker: true
    manifest: true
    push_notifications: true
    cache_strategy: "stale-while-revalidate"
    
  payments:
    enabled: true
    provider: "stripe"
    secondary_provider: "mercadopago"  # Para LATAM
    webhooks: true
    
  ai_integration:
    enabled: true
    provider: "openai"
    model: "gpt-4-turbo"
    use_cases:
      - "content_generation"
      - "code_assistance"
      - "data_analysis"
    fallback_provider: "anthropic"
```

### Sección `domain`

```yaml
domain:
  entities:
    - name: "Product"
      description: "Producto del inventario con soporte offline"
      fields:
        - "id: string"
        - "sku: string"
        - "name: string"
        - "description: string"
        - "category: Category"
        - "price: number"
        - "quantity: number"
        - "syncStatus: 'pending' | 'synced' | 'error'"
      
      # Agregar relaciones
      relations:
        - type: "belongs_to"
          entity: "Category"
        - type: "has_many"
          entity: "Movement"
      
      # Agregar validaciones
      validations:
        - field: "sku"
          rules: ["required", "unique", "alphanumeric"]
        - field: "price"
          rules: ["required", "positive"]
  
  main_flows:
    - name: "Registro de Producto"
      description: "Flujo completo de creación de producto"
      steps:
        - "Escanear código de barras"
        - "Validar SKU único"
        - "Completar información"
        - "Guardar en IndexedDB"
        - "Sincronizar cuando online"
      
      # Agregar actores y excepciones
      actors:
        - "staff"
        - "manager"
      exceptions:
        - "SKU duplicado"
        - "Sin conexión prolongada"
```

### Sección `quality_targets`

```yaml
quality_targets:
  lighthouse:
    performance: 90
    accessibility: 100
    best_practices: 100
    seo: 90
    pwa: 100
    
  test_coverage:
    unit: 80
    integration: 70
    e2e: 50
    mutation: 60  # Si usas mutation testing
    
  core_web_vitals:
    lcp: 2.5  # Largest Contentful Paint (segundos)
    fid: 100  # First Input Delay (ms)
    cls: 0.1  # Cumulative Layout Shift
    
  # Agregar métricas de código
  code_quality:
    max_complexity: 10
    max_file_lines: 300
    max_function_lines: 50
```

---

## Modificar Agentes Existentes

### Agregar Secciones Personalizadas

Puedes agregar secciones específicas de tu proyecto a cualquier agente:

```markdown
<!-- En .github/agents/agents/backend-architect.md -->

## 📋 Patrones Específicos del Proyecto

### Nomenclatura de Servicios
En este proyecto seguimos la convención:
- Servicios: `{Entity}Service.ts`
- Repositorios: `{Entity}Repository.ts`
- DTOs: `{Entity}DTO.ts`

### Ejemplo de Servicio con Sync
\```typescript
// src/core/application/services/ProductService.ts
export class ProductService {
  constructor(
    private readonly repository: ProductRepository,
    private readonly syncQueue: SyncQueue
  ) {}

  async create(dto: CreateProductDTO): Promise<Product> {
    const product = await this.repository.create(dto);
    await this.syncQueue.enqueue('product:create', product);
    return product;
  }
}
\```
```

### Ajustar Límites de Responsabilidad

Modifica la sección de límites según tus necesidades:

```markdown
## ⚠️ LÍMITES DE RESPONSABILIDAD

### ✅ LO QUE DEBES HACER
1. Diseñar APIs RESTful con Next.js API Routes
2. Implementar lógica de sincronización offline (específico de este proyecto)
3. Crear services y repositories siguiendo Clean Architecture
4. Configurar índices MongoDB para queries frecuentes

### ❌ LO QUE NO DEBES HACER
1. NO modificar componentes de UI (delega a @frontend-architect)
2. NO implementar Service Workers (delega a @pwa-specialist)
3. NO gestionar pipelines CI/CD (delega a @devops-engineer)
```

### Agregar Handoffs Personalizados

```markdown
## 🔄 Handoff a Otros Agentes

| Situación | Agente | Contexto a Pasar |
|-----------|--------|------------------|
| Sincronización PWA | @pwa-specialist | Esquema de datos, conflictos identificados |
| Dashboard analytics | @observability-engineer | Métricas requeridas, KPIs del negocio |
| Integración IA | @ai-integration-engineer | Casos de uso, datos disponibles |
| **Revisión de seguridad (custom)** | @security-guardian | Endpoints creados, datos sensibles |
```

---

## Crear Nuevos Agentes

### Estructura Base de un Agente

```markdown
---
name: "nombre-del-agente"
id: "nombre-del-agente"
visibility: "internal"
title: "Título del Agente"
description: "Descripción breve del rol y responsabilidades"
keywords:
  - "keyword1"
  - "keyword2"
entrypoint: "true"  # o "false" si no es punto de entrada directo
version: "1.0.0"
---

# 🎯 Nombre del Agente

## 📖 Contexto
Lee siempre estos archivos para entender el contexto:
- `_core/_framework-context.md` - Stack tecnológico y arquitectura
- `project-context.yml` - Configuración específica del proyecto

## 🎭 Tu Rol

Eres el **Nombre del Rol** del proyecto. Tu responsabilidad principal es:

1. Primera responsabilidad
2. Segunda responsabilidad
3. Tercera responsabilidad

## ⚠️ LÍMITES DE RESPONSABILIDAD

### ✅ LO QUE DEBES HACER
1. Tarea específica 1
2. Tarea específica 2

### ❌ LO QUE NO DEBES HACER
1. Tarea que NO debes hacer 1
2. Tarea que NO debes hacer 2

## 🔄 Handoff a Otros Agentes

| Situación | Agente | Contexto |
|-----------|--------|----------|
| Situación 1 | @agente1 | Qué pasar |
| Situación 2 | @agente2 | Qué pasar |

## 💻 Ejemplos de Código

### Ejemplo 1: Descripción
\```typescript
// Código de ejemplo
\```

## ✅ Checklist del Agente

- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

## 🔗 Cómo Invocar Otro Agente

\```
@otro-agente [descripción de la tarea]
\```
```

### Ejemplo: Agente de Localización

```markdown
---
name: "localization-engineer"
id: "localization-engineer"
visibility: "internal"
title: "Ingeniero de Localización"
description: "Experto en internacionalización (i18n) y localización (l10n) de aplicaciones Next.js"
keywords:
  - "i18n"
  - "l10n"
  - "traducción"
  - "next-intl"
entrypoint: "true"
version: "1.0.0"
---

# 🌍 Localization Engineer

## 📖 Contexto
Lee siempre estos archivos:
- `_core/_framework-context.md`
- `project-context.yml`

## 🎭 Tu Rol

Eres el **Ingeniero de Localización** del proyecto. Tu responsabilidad es:

1. Configurar next-intl para internacionalización
2. Diseñar estructura de archivos de traducción
3. Implementar detección de idioma y routing
4. Asegurar formato correcto de fechas, números y monedas
5. Mantener consistencia en traducciones

## ⚠️ LÍMITES DE RESPONSABILIDAD

### ✅ LO QUE DEBES HACER
1. Configurar middleware de i18n
2. Crear archivos de mensajes por idioma
3. Implementar componentes de cambio de idioma
4. Formatear datos según locale (fechas, números, monedas)

### ❌ LO QUE NO DEBES HACER
1. NO diseñar UI de componentes (delega a @frontend-architect)
2. NO modificar lógica de negocio backend
3. NO gestionar traducciones de contenido dinámico (eso es CMS)

## 💻 Ejemplos de Código

### Configuración de next-intl
\```typescript
// src/i18n.ts
import { getRequestConfig } from 'next-intl/server';

export const locales = ['es', 'en', 'pt'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}));
\```

### Archivo de mensajes
\```json
// src/messages/es.json
{
  "common": {
    "loading": "Cargando...",
    "save": "Guardar",
    "cancel": "Cancelar"
  },
  "products": {
    "title": "Productos",
    "add": "Agregar Producto",
    "price": "Precio: {price, number, currency}"
  }
}
\```

## ✅ Checklist del Agente

- [ ] next-intl instalado y configurado
- [ ] Middleware de locale creado
- [ ] Archivos de mensajes estructurados
- [ ] Componente LanguageSwitcher implementado
- [ ] Formateo de fechas/números configurado
- [ ] Rutas localizadas funcionando
```

---

## Agregar Templates Especializados

### Estructura de un Template

```
templates/
└── mi-template/
    ├── context-extension.md   # Extensiones al project-context
    └── mi-specialist.md       # Agente especializado
```

### Ejemplo: Template para App Médica

```yaml
# templates/healthcare/context-extension.md
---
name: "Healthcare Context Extension"
description: "Configuración adicional para aplicaciones de salud"
---

# Healthcare Context Extension

Agrega estas secciones a tu `project-context.yml`:

\```yaml
healthcare:
  compliance:
    hipaa: true
    gdpr: true
    
  data_retention:
    medical_records: "7 years"
    audit_logs: "10 years"
    
  encryption:
    at_rest: true
    in_transit: true
    algorithm: "AES-256"
    
  audit:
    enabled: true
    events:
      - "patient_record_access"
      - "prescription_created"
      - "appointment_scheduled"
\```
```

```markdown
# templates/healthcare/hipaa-compliance.md
---
name: "hipaa-compliance"
id: "hipaa-compliance"
visibility: "internal"
title: "HIPAA Compliance Specialist"
description: "Experto en cumplimiento HIPAA para aplicaciones de salud"
---

# 🏥 HIPAA Compliance Specialist

## 🎭 Tu Rol

Eres el **Especialista en Cumplimiento HIPAA**. Tu responsabilidad es:

1. Asegurar que el código cumple con regulaciones HIPAA
2. Implementar controles de acceso a PHI (Protected Health Information)
3. Configurar audit logging para accesos a datos médicos
4. Revisar encriptación de datos sensibles

## ⚠️ LÍMITES DE RESPONSABILIDAD

### ✅ LO QUE DEBES HACER
1. Revisar acceso a datos de pacientes
2. Implementar logging de auditoría
3. Verificar encriptación de PHI
4. Documentar controles de seguridad

### ❌ LO QUE NO DEBES HACER
1. NO diseñar UI de formularios médicos
2. NO implementar lógica de negocio clínica
3. NO gestionar integraciones con sistemas externos

## 💻 Ejemplos de Código

### Middleware de Auditoría HIPAA
\```typescript
// src/middleware/hipaaAudit.ts
import { NextRequest, NextResponse } from 'next/server';
import { auditLog } from '@/lib/audit';

export async function hipaaAuditMiddleware(
  request: NextRequest,
  userId: string
) {
  const sensitiveRoutes = ['/api/patients', '/api/records'];
  
  if (sensitiveRoutes.some(route => request.url.includes(route))) {
    await auditLog({
      event: 'PHI_ACCESS',
      userId,
      resource: request.url,
      action: request.method,
      timestamp: new Date().toISOString(),
      ipAddress: request.ip,
    });
  }
  
  return NextResponse.next();
}
\```
```

---

## Mejores Prácticas

### 1. Mantén la Consistencia

- Usa el mismo formato de frontmatter en todos los agentes
- Mantén la estructura de secciones consistente
- Usa los mismos emojis para identificar secciones similares

### 2. Documenta los Handoffs

Siempre especifica claramente:
- **Cuándo** hacer handoff
- **A quién** pasar la tarea
- **Qué contexto** incluir

### 3. Ejemplos Relevantes

- Incluye ejemplos de código específicos de tu stack
- Usa TypeScript real, no pseudocódigo
- Muestra imports y dependencias

### 4. Actualiza Regularmente

- Revisa los agentes cuando cambie el stack
- Actualiza ejemplos cuando cambien patrones
- Mantén `project-context.yml` sincronizado con el código real

### 5. Versionado

- Usa el campo `version` en el frontmatter
- Documenta cambios significativos en los agentes
- Considera crear un CHANGELOG para los agentes

---

## Recursos Adicionales

- [Catálogo de Agentes](./AGENT-CATALOG.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Ejemplos de Proyectos](../examples/)

---

¿Necesitas ayuda con la personalización? Abre un [issue](https://github.com/Angel-Baez/mern-agents-framework/issues) o una [discusión](https://github.com/Angel-Baez/mern-agents-framework/discussions).
