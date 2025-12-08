# Sistema Híbrido de Auditoría - Guía de Usuario

Este documento explica cómo usar el nuevo sistema híbrido de auditoría para el seguimiento del comportamiento de agentes a través de 100 casos de uso.

## Descripción General

El sistema híbrido de auditoría consiste en:

- **Epic #7**: Dashboard ejecutivo con métricas agregadas
- **Sub-issues individuales**: Un issue por caso de auditoría
- **Etiquetas automatizadas**: Para filtrado y categorización
- **Workflow de auto-actualización**: GitHub Action que actualiza el Epic #7 automáticamente

## Primeros Pasos

### 1. Configurar Etiquetas (Configuración Única)

Ejecuta el script de creación de etiquetas para configurar todas las etiquetas requeridas:

```bash
./scripts/create-audit-labels.sh Angel-Baez mern-agents-framework
```

Esto crea etiquetas para:

- **Resultados**: `case-success`, `case-violation-major`, `case-violation-minor`
- **Agentes**: `agent:orchestrator`, `agent:backend-architect`, etc.
- **Entornos**: `env:vscode`, `env:github-copilot`
- **Tipos de violación**: `violation:scope`, `violation:protocol`, `violation:tools`, `violation:handoff`
- **Estado**: `needs-review`, `validated`, `disputed`

### 2. Crear Casos de Auditoría

Para documentar un nuevo caso de auditoría:

1. Ve a: https://github.com/Angel-Baez/mern-agents-framework/issues/new/choose
2. Selecciona "Caso de Auditoría Individual"
3. Completa el formulario:
   - **Epic Padre**: `#7`
   - **Número de Caso**: Número secuencial (1-100)
   - **Agente**: Qué agente fue probado
   - **Entorno**: VSCode Chat o GitHub Copilot Chat
   - **Resultado**: Éxito, Violación Menor o Violación Mayor
   - **Solicitud**: Qué pidió el usuario
   - **Observación**: Qué sucedió
   - **Violaciones**: Marca las violaciones aplicables
   - **Severidad**: Nivel de impacto
   - **Contexto**: Detalles adicionales
   - **Acción Correctiva**: Cómo prevenir este problema
4. Agrega las etiquetas apropiadas:
   - `audit` (requerida)
   - `case-success`, `case-violation-major`, o `case-violation-minor`
   - `agent:*` para el agente probado
   - `env:*` para el entorno
   - Cualquier etiqueta relevante `violation:*`

### 3. Ver el Dashboard del Epic

El Epic #7 agrega automáticamente todos los sub-issues y muestra:

- Métricas globales (tasa de éxito, conteo de violaciones)
- Rendimiento por agente
- Rendimiento por entorno
- Lista de todos los sub-issues categorizados por resultado

Ver en: https://github.com/Angel-Baez/mern-agents-framework/issues/7

### 4. Filtrar y Buscar

Usa la búsqueda de issues de GitHub con etiquetas:

```bash
# Ver todos los casos exitosos
gh issue list --label case-success

# Ver el rendimiento del orchestrator
gh issue list --label agent:orchestrator

# Ver violaciones en VSCode
gh issue list --label env:vscode,case-violation-major

# Ver violaciones de scope
gh issue list --label violation:scope
```

## Actualizaciones Automáticas

El Epic #7 se actualiza automáticamente mediante GitHub Actions cuando:

- Se abre un nuevo issue de caso de auditoría
- Se cierra un issue
- Se agregan o eliminan etiquetas
- Se edita un issue

El workflow ejecuta `scripts/update-epic.js` que:

1. Obtiene todos los issues con la etiqueta `audit`
2. Calcula métricas (tasa de éxito, violaciones, etc.)
3. Agrupa issues por agente y entorno
4. Actualiza el Epic #7 con las nuevas métricas

## Sistema de Clasificación

Basado en el total de violaciones:

- **0 violaciones**: A+ Perfecto (Listo para producción)
- **1-3 violaciones**: Ajuste menor (Ajustes menores)
- **4-10 violaciones**: Ajuste moderado (Refinamiento moderado)
- **11+ violaciones**: Revisión profunda (Revisión profunda necesaria)

## Estructura de Archivos

```
.github/
├── ISSUE_TEMPLATE/
│   └── audit-case.yml          # Plantilla para casos individuales
└── workflows/
    └── update-audit-epic.yml   # Workflow de auto-actualización

scripts/
├── create-audit-labels.sh      # Script de creación de etiquetas
└── update-epic.js              # Lógica de actualización del Epic
```

## Ejemplos

### Ejemplo: Crear un Caso de Éxito

```markdown
Título: [Caso 5] Orchestrator - Handoff a Backend Architect
Etiquetas: audit, case-success, agent:orchestrator, env:vscode

Padre: #7
Número de Caso: 5
Agente: orchestrator
Entorno: VSCode Chat
Resultado: ✅ Éxito (cumplió todas las reglas)

Solicitud: "Implementar autenticación de usuario con JWT"
Observación:
✅ Identificó correctamente como tarea de backend
✅ Hizo handoff limpio a backend-architect
✅ Proporcionó contexto completo
✅ No implementó nada por sí mismo
```

### Ejemplo: Crear un Caso de Violación

```markdown
Título: [Caso 6] Backend-Architect - Modificó Componentes React
Etiquetas: audit, case-violation-major, agent:backend-architect, env:github-copilot, violation:scope

Padre: #7
Número de Caso: 6
Agente: backend-architect
Entorno: GitHub Copilot Chat
Resultado: ❌ Violación Mayor (violó scope o límites fundamentales)

Solicitud: "Agregar endpoint de API para perfil de usuario"
Observación:
✅ Implementó correctamente el endpoint de API
❌ También modificó componente React (prohibido)
❌ Cambió hooks de frontend (fuera de scope)

Violaciones:
[x] Implementación fuera de scope

Severidad: Alta (violación crítica de scope)

Acción Correctiva:

- Agregar este caso como ejemplo negativo en docs del agente
- Reforzar verificación de ruta antes de modificar archivos
- Agregar checklist de pre-ejecución para rutas prohibidas
```

## Mantenimiento

### Actualizar el Epic Manualmente

Si es necesario, puedes activar manualmente la actualización del Epic:

```bash
# Usando GitHub CLI
gh workflow run update-audit-epic.yml

# O usando la UI de GitHub
# Ve a Actions → Update Audit Epic Metrics → Run workflow
```

### Solución de Problemas

**Problema: El Epic no se actualiza**

- Verifica que el issue tenga la etiqueta `audit`
- Confirma que no sea el issue #7 mismo
- Revisa los logs de GitHub Actions por errores

**Problema: Las etiquetas no funcionan**

- Vuelve a ejecutar el script de creación de etiquetas
- Verifica que las etiquetas existan en la configuración del repositorio

**Problema: Las métricas parecen incorrectas**

- Asegúrate de que todos los issues tengan etiquetas adecuadas
- Busca números de caso duplicados
- Verifica el estado del issue (abierto/cerrado)

## Mejores Prácticas

1. **Sé consistente**: Usa el mismo formato para todos los casos
2. **Sé específico**: Proporciona detalles exactos en las observaciones
3. **Etiqueta correctamente**: Siempre agrega las etiquetas correctas
4. **Documenta acciones correctivas**: Explica cómo prevenir futuras violaciones
5. **Actualiza rápidamente**: Crea issues tan pronto pruebes un caso
6. **Revisa en equipo**: Usa el dashboard del Epic en reuniones de equipo

## Contribuir

Para mejorar el sistema de auditoría:

1. Abre un issue con sugerencias
2. Envía un PR con mejoras a scripts/plantillas
3. Comparte retroalimentación en discusiones del equipo

---

**Última actualización**: 2025-12-06
**Versión del sistema**: 1.0.0
**Mantenido por**: Angel-Baez
