# 📊 Reporte de Auditoría #1

**Fecha:** 2025-12-06  
**Entorno:** GitHub Copilot Chat  
**Total de usos:** 10  
**Violaciones:** 2  
**Generado:** 6/12/2025, 1:46:37

---

## 🥉 Calificación Global: C (80% éxito)

Revisión necesaria - Mejorar varios agentes

### Métricas Principales

```
Tasa de Éxito: [████████████████░░░░] 80.0%
Violaciones:   2/10 (20%)
Objetivo:      0 violaciones
```

- ✅ **Tasa de éxito:** 80%
- ❌ **Violaciones:** 2/10 (20%)
- 🎯 **Objetivo:** 0 violaciones

---

## 👥 Agentes Evaluados

### Tabla de Resultados

| Agente | Rol | Usos | Violaciones | % Éxito | Estado |
|--------|-----|------|-------------|---------|--------|
| Orchestrator | router | 3 | 1 | 66.7% | ❌ |
| Backend Architect | implementer | 2 | 0 | 100.0% | ✅ |
| Frontend Architect | implementer | 2 | 1 | 50.0% | ❌ |
| Data Engineer | implementer | 1 | 0 | 100.0% | ✅ |
| Security Guardian | reviewer | 1 | 0 | 100.0% | ✅ |
| Test Engineer | implementer | 1 | 0 | 100.0% | ✅ |

### Gráfico de Rendimiento

```
Backend Architect  │ ██████████████████████████████ 100.0% ✅
Data Engineer      │ ██████████████████████████████ 100.0% ✅
Security Guardian  │ ██████████████████████████████ 100.0% ✅
Test Engineer      │ ██████████████████████████████ 100.0% ✅
Orchestrator       │ ████████████████████           66.7% ❌
Frontend Architect │ ███████████████                50.0% ❌
```

---

## 🏆 Ranking de Agentes

### Top 5 (Mejor Rendimiento)

1. **Backend Architect** - 100.0% éxito (2 usos)
2. **Data Engineer** - 100.0% éxito (1 usos)
3. **Security Guardian** - 100.0% éxito (1 usos)
4. **Test Engineer** - 100.0% éxito (1 usos)
5. **Orchestrator** - 66.7% éxito (3 usos)

### Bottom 5 (Necesitan Mejora)

1. **Frontend Architect** - 50.0% éxito (1 violaciones)
2. **Orchestrator** - 66.7% éxito (1 violaciones)
3. **Test Engineer** - 100.0% éxito (0 violaciones)
4. **Security Guardian** - 100.0% éxito (0 violaciones)
5. **Data Engineer** - 100.0% éxito (0 violaciones)

---

## 🖥️ Comparación por Entorno

### GitHub Copilot Chat
- **Usos:** 10
- **Violaciones:** 2
- **Tasa de éxito:** 80%

---

## ❌ Tipos de Violación

1. **Router ejecutó herramientas/código** (2 casos)
   _Un agente tipo router implementó código cuando solo debería coordinar_

---

## 📋 Recomendaciones

### Frontend Architect
- **Problema:** 1 violación(es) en 2 usos
- **Acciones sugeridas:**
  - Reforzar meta-instrucciones específicas del rol
  - Agregar más ejemplos negativos basados en violaciones detectadas
  - Revisar lista de herramientas prohibidas: N/A

### Orchestrator
- **Problema:** 1 violación(es) en 3 usos
- **Acciones sugeridas:**
  - Reforzar meta-instrucciones específicas del rol
  - Agregar más ejemplos negativos basados en violaciones detectadas
  - Revisar lista de herramientas prohibidas: read_file, write_file, edit_file, create_file, run_command, execute_code

---

## 🏷️ Badge de Calidad

![Quality Badge](https://img.shields.io/badge/Quality-C%20(80%25)-orange)

### Badge Local

```html
<img src="badges/quality-badge.svg" alt="Quality: C (80%)">
```

---

## 📈 Historial

Ver [audit-history.json](./audit-history.json) para el historial completo de auditorías.

---

_Reporte generado automáticamente por [MERN Agents Framework](https://github.com/Angel-Baez/mern-agents-framework)_
