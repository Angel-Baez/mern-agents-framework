# 📊 Scripts de Auditoría - MERN Agents Framework

Este directorio contiene herramientas para visualizar y analizar los resultados de las auditorías de 100 usos de los agentes del framework.

## 📁 Estructura

```
scripts/
├── audit-analyzer.js           # Análisis de datos de auditoría
├── generate-audit-report.js    # Generación de reportes markdown
├── audit-dashboard.html        # Dashboard visual interactivo
├── audit-config.json           # Configuración de agentes y umbrales
└── README.md                   # Este archivo
```

## 🚀 Instalación

```bash
# Instalar dependencias desde la raíz del proyecto
npm install
```

## 📋 Uso

### 1. Análisis de Auditoría

El script `audit-analyzer.js` parsea issues de GitHub y extrae métricas de las tablas markdown.

```bash
# Analizar la última auditoría (requiere GH_ACCESS_TOKEN)
GH_ACCESS_TOKEN=your_token node scripts/audit-analyzer.js --latest

# Analizar auditoría específica
GH_ACCESS_TOKEN=your_token node scripts/audit-analyzer.js --issue 123

# Analizar desde archivo local
node scripts/audit-analyzer.js --file sample-audit.json

# Guardar resultado en archivo
node scripts/audit-analyzer.js --latest --output results.json
```

**Opciones:**

- `--latest`: Analiza el issue de auditoría más reciente
- `--issue <number>`: Analiza un issue específico por número
- `--file <path>`: Carga datos de un archivo JSON local
- `--output <path>`: Guarda resultados en el archivo especificado
- `--help`: Muestra ayuda

### 2. Generación de Reportes

El script `generate-audit-report.js` toma los datos analizados y genera:

- Reporte markdown formateado
- Badge SVG de calidad
- Actualización del historial

```bash
# Generar reporte desde el último análisis
node scripts/generate-audit-report.js

# Generar desde archivo específico
node scripts/generate-audit-report.js --input analysis.json

# Especificar directorio de salida
node scripts/generate-audit-report.js --output-dir ./reports
```

**Archivos generados:**

- `docs/audit-results/latest-report.md` - Reporte markdown
- `docs/audit-results/badges/quality-badge.svg` - Badge de calidad
- `docs/audit-results/audit-history.json` - Historial actualizado

### 3. Dashboard Visual

El archivo `audit-dashboard.html` es un dashboard interactivo que funciona 100% en el navegador.

```bash
# Abrir dashboard
open scripts/audit-dashboard.html

# O en Linux
xdg-open scripts/audit-dashboard.html
```

**Características:**

- 📊 5 tipos de gráficos (gauge, barras, pie, línea, comparación)
- 🌙 Dark mode
- 🔍 Filtros por entorno, umbral y búsqueda
- 📱 Diseño responsive
- 📥 Exportación a PDF
- 📂 Carga de datos JSON

### 4. Scripts NPM

```bash
# Ejecutar análisis
npm run audit:analyze

# Generar reporte
npm run audit:report

# Análisis completo (analyze + report)
npm run audit:full
```

## ⚙️ Configuración

El archivo `audit-config.json` contiene:

### Agentes

```json
{
  "agents": [
    {
      "id": "orchestrator",
      "name": "Orchestrator",
      "role": "router",
      "forbiddenTools": ["read_file", "write_file", ...],
      "forbiddenActions": ["implementar código", ...]
    }
  ]
}
```

### Tipos de Violación

```json
{
  "violationTypes": [
    {
      "id": "implemented_code",
      "name": "Router ejecutó código",
      "severity": "high"
    }
  ]
}
```

### Umbrales de Calidad

```json
{
  "qualityThresholds": {
    "A+": { "minSuccessRate": 100, "maxViolations": 0 },
    "A": { "minSuccessRate": 97, "maxViolations": 3 },
    "B": { "minSuccessRate": 90, "maxViolations": 10 },
    "C": { "minSuccessRate": 80, "maxViolations": 20 },
    "D": { "minSuccessRate": 0, "maxViolations": 100 }
  }
}
```

## 📊 Métricas Calculadas

El analyzer calcula las siguientes métricas:

| Métrica                  | Descripción               |
| ------------------------ | ------------------------- |
| Tasa de éxito global     | % de usos sin violaciones |
| Tasa de éxito por agente | % de éxito individual     |
| Comparación de entornos  | VSCode vs GitHub          |
| Tipos de violación       | Distribución de errores   |
| Ranking de agentes       | Top 5 y Bottom 5          |
| Evolución temporal       | Tendencia histórica       |

## 📈 Formato de Salida JSON

```json
{
  "metadata": {
    "auditId": "audit-001",
    "date": "2024-12-05",
    "environment": "github",
    "totalUses": 100,
    "totalViolations": 3
  },
  "globalMetrics": {
    "successRate": 97.0,
    "grade": "A",
    "gradeDescription": "Ajuste menor"
  },
  "agentMetrics": [...],
  "environmentComparison": {...},
  "violationBreakdown": {...},
  "topAgents": [...],
  "bottomAgents": [...]
}
```

## 🔄 GitHub Action

El workflow `.github/workflows/audit-report.yml` automatiza el proceso:

1. **Trigger**: Cuando se cierra un issue con label `audit`
2. **Parsea** el issue cerrado
3. **Ejecuta** el analyzer
4. **Genera** dashboard actualizado
5. **Commitea** resultados a `docs/audit-results/`
6. **Comenta** en el issue con resumen

## 🛠️ Variables de Entorno

| Variable          | Descripción                  | Requerido            |
| ----------------- | ---------------------------- | -------------------- |
| `GH_ACCESS_TOKEN` | Token de acceso a GitHub API | Para análisis remoto |

## 📝 Ejemplo de Flujo Completo

```bash
# 1. Configurar token
export GH_ACCESS_TOKEN=ghp_xxxxxxxxxxxx

# 2. Analizar última auditoría
node scripts/audit-analyzer.js --latest

# 3. Generar reporte
node scripts/generate-audit-report.js

# 4. Ver resultados
cat docs/audit-results/latest-report.md
open docs/audit-results/badges/quality-badge.svg

# 5. Abrir dashboard
open scripts/audit-dashboard.html
```

## 🐛 Troubleshooting

### Error: "No GH_ACCESS_TOKEN found"

```bash
# Solución: Configurar variable de entorno
export GH_ACCESS_TOKEN=tu_token_aqui
```

### Error: "Input file not found"

```bash
# Solución: Ejecutar primero el analyzer
node scripts/audit-analyzer.js --latest
```

### Dashboard no carga datos

1. Hacer clic en "🔄 Cargar Datos"
2. Pegar el JSON de `docs/audit-results/latest-analysis.json`
3. O cargar archivo directamente

## 📄 Licencia

MIT License - Ver [LICENSE](../LICENSE) para más detalles.

---

**⭐ Si este framework te resulta útil, considera darle una estrella en GitHub ⭐**
