# Dashboard de Auditoría - Documentación

## Descripción

Dashboard interactivo que visualiza las métricas de auditoría de los 100 casos del framework de 15 agentes, consumiendo datos en tiempo real desde la GitHub API.

## Archivos

- **dashboard.html** - Estructura HTML principal del dashboard
- **styles.css** - Estilos CSS con diseño responsive y moderno
- **app.js** - Lógica JavaScript para consumir API y renderizar gráficos

## Características

### 1. Datos en Tiempo Real
- ✅ Consume GitHub REST API para obtener issues con label `audit`
- ✅ Excluye el Epic #7 de los cálculos
- ✅ Se actualiza cada vez que se recarga la página

### 2. Métricas Globales
- Total de casos completados (X/100)
- Cantidad de éxitos
- Cantidad de violaciones (mayores + menores)
- Tasa de éxito porcentual
- Clasificación de calidad (A+, A, B, C, D)

### 3. Gráficos Interactivos (Chart.js)

#### Gráfico 1: Distribución de Resultados (Dona)
- Muestra la proporción de éxitos, violaciones mayores y violaciones menores
- Colores: Verde (éxitos), Rojo (violaciones mayores), Amarillo (violaciones menores)

#### Gráfico 2: Rendimiento por Agente (Barras Horizontales)
- Muestra casos por cada agente que tiene al menos 1 caso
- Barras apiladas por tipo de resultado
- Ordenado por cantidad total de casos (descendente)

#### Gráfico 3: Rendimiento por Entorno (Barras)
- Compara VSCode vs GitHub Copilot Chat
- Éxitos vs Violaciones por entorno

#### Gráfico 4: Tendencia de Éxito (Línea)
- Muestra la tasa de éxito acumulada a lo largo del tiempo
- Línea objetivo en 100% para comparación
- Ordenado cronológicamente por fecha de creación

### 4. Tabla de Casos Filtrable y Ordenable

**Características:**
- ✅ Búsqueda por texto (título o número de caso)
- ✅ Filtro por agente (dropdown)
- ✅ Filtro por entorno (dropdown)
- ✅ Filtro por resultado (éxito/violación mayor/violación menor)
- ✅ Ordenamiento por columna (click en header)
- ✅ Paginación (10 casos por página)
- ✅ Click en fila abre el issue en GitHub en nueva pestaña

**Columnas:**
- # (Número de issue)
- Título
- Agente
- Entorno
- Resultado (con badge de color)
- Fecha de creación

### 5. Exportar a PDF
- ✅ Botón para exportar el dashboard completo a PDF
- ✅ Usa html2pdf.js para generar el documento
- ✅ Incluye métricas, gráficos y tabla

### 6. Diseño Responsive
- ✅ Mobile-first design
- ✅ Adaptable a tablet y desktop
- ✅ Grid layout flexible
- ✅ Media queries para diferentes tamaños de pantalla

## Uso

### Acceso Local
1. Abrir `dashboard.html` en un navegador moderno
2. Los datos se cargarán automáticamente desde GitHub

### Acceso en GitHub Pages
URL: `https://angel-baez.github.io/mern-agents-framework/audit-results/dashboard.html`

### Actualizar Datos
- Click en el botón "🔄 Actualizar"
- O recargar la página (F5)

## Configuración de la API

El dashboard consume la API pública de GitHub sin autenticación:

```javascript
const GITHUB_API = 'https://api.github.com';
const REPO_OWNER = 'Angel-Baez';
const REPO_NAME = 'mern-agents-framework';
const EPIC_NUMBER = 7;
```

**Límites de Rate:**
- Sin autenticación: 60 requests/hora por IP
- Con autenticación: 5000 requests/hora

## Estructura de Labels

El dashboard identifica casos basándose en labels de GitHub:

### Labels de Resultado
- `case-success` - Caso exitoso (✅)
- `case-violation-major` - Violación mayor (❌)
- `case-violation-minor` - Violación menor (⚠️)

### Labels de Agente
- `agent:orchestrator`
- `agent:backend-architect`
- `agent:frontend-architect`
- (etc. para los 15 agentes)

### Labels de Entorno
- `env:vscode` - VSCode Chat
- `env:github` - GitHub Copilot Chat

## Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Grid, Flexbox, Variables CSS, Animations
- **JavaScript (Vanilla)** - Sin frameworks
- **Chart.js v4.4.0** - Gráficos interactivos
- **html2pdf.js v0.10.1** - Exportación a PDF
- **GitHub REST API** - Fuente de datos

## Compatibilidad

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

## Manejo de Errores

- ✅ Mensaje de error si falla la API
- ✅ Spinner de carga durante fetch
- ✅ Mensaje si no hay casos disponibles
- ✅ Botón para cerrar mensajes de error

## Desarrollo Local

```bash
# Servir con Python
cd docs/audit-results
python3 -m http.server 8000

# Abrir en navegador
# http://localhost:8000/dashboard.html
```

## Mantenimiento

### Agregar Nuevo Agente
Actualizar el array `AGENTS` en `app.js`:
```javascript
const AGENTS = [
  'orchestrator',
  // ... agentes existentes
  'nuevo-agente'
];
```

### Modificar Colores
Actualizar variables CSS en `styles.css`:
```css
:root {
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #6366f1;
  --color-primary: #3b82f6;
}
```

### Cambiar Clasificación
Actualizar función `renderMetrics()` en `app.js`:
```javascript
let classification = '';
if (successRate >= 100) classification = 'A+ Perfecto';
else if (successRate >= 97) classification = 'A - Ajuste menor';
// etc.
```

## Soporte

Para reportar problemas o sugerir mejoras, crear un issue en:
https://github.com/Angel-Baez/mern-agents-framework/issues
