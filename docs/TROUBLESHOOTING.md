# 🔧 Guía de Troubleshooting

Esta guía contiene soluciones a los problemas más comunes al usar el MERN Agents Framework.

## Tabla de Contenidos

- [Problemas de Instalación](#problemas-de-instalación)
- [Problemas con Agentes](#problemas-con-agentes)
- [Problemas de Configuración](#problemas-de-configuración)
- [Problemas de Rendimiento](#problemas-de-rendimiento)
- [Errores Comunes](#errores-comunes)
- [FAQs](#faqs)

---

## Problemas de Instalación

### El script de instalación falla

**Síntoma:** El script `init-agents.sh` o `init-agents.ps1` no se ejecuta correctamente.

**Soluciones:**

1. **Permisos insuficientes (Linux/macOS)**
   ```bash
   # Dar permisos de ejecución
   chmod +x init-agents.sh
   ./init-agents.sh
   ```

2. **PowerShell bloqueado (Windows)**
   ```powershell
   # Ejecutar como administrador
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ./init-agents.ps1
   ```

3. **No existe package.json**
   ```bash
   # Asegúrate de estar en la raíz del proyecto
   npm init -y
   # Luego ejecuta el script
   ```

4. **Problemas de red**
   ```bash
   # Usa instalación manual
   git clone https://github.com/Angel-Baez/mern-agents-framework.git temp-agents
   mkdir -p .github/agents
   cp -r temp-agents/_core temp-agents/agents temp-agents/project-context.yml .github/agents/
   rm -rf temp-agents
   ```

---

### Los agentes no aparecen en GitHub Copilot

**Síntoma:** Después de instalar, no puedes invocar agentes con `@nombre-agente`.

**Soluciones:**

1. **Verificar estructura de directorios**
   ```bash
   # La estructura debe ser:
   ls -la .github/agents/
   # Deberías ver:
   # _core/
   # agents/
   # project-context.yml
   ```

2. **Verificar que Copilot está habilitado**
   - Ve a Settings → Copilot en tu repositorio
   - Asegúrate de que "GitHub Copilot" está activado
   - Verifica que tienes acceso a Copilot Chat

3. **Refrescar el chat de Copilot**
   - Cierra y vuelve a abrir VS Code
   - O usa Cmd/Ctrl + Shift + P → "Reload Window"

4. **Verificar ubicación de archivos**
   ```bash
   # Los archivos deben estar en .github/agents/
   # NO en .github/copilot/agents/ (ubicación legacy)
   ```

---

## Problemas con Agentes

### El agente no entiende el contexto del proyecto

**Síntoma:** El agente da respuestas genéricas que no consideran tu stack o configuración.

**Soluciones:**

1. **Verificar project-context.yml**
   ```yaml
   # Asegúrate de que está correctamente configurado:
   project:
     name: "tu-proyecto"
     description: "Descripción clara"
   
   stack:
     framework: "next.js"
     version: "14.x"
     # ... resto de configuración
   ```

2. **Incluir contexto en la solicitud**
   ```
   @backend-architect Considerando que usamos MongoDB con Mongoose 
   y Next.js 14 API Routes, diseña el endpoint para...
   ```

3. **Verificar referencias en el agente**
   - Los agentes deben tener referencia a `_core/_framework-context.md`
   - Verifica que el archivo existe y tiene contenido

---

### El agente hace cosas fuera de su responsabilidad

**Síntoma:** Por ejemplo, `@backend-architect` empieza a diseñar componentes de UI.

**Soluciones:**

1. **Ser específico en la solicitud**
   ```
   @backend-architect Solo diseña la API, NO la interfaz de usuario.
   Quiero el endpoint para crear productos.
   ```

2. **Usar el agente correcto**
   ```
   # Si necesitas UI:
   @frontend-architect Crea el componente de formulario
   
   # Si necesitas API:
   @backend-architect Diseña el endpoint
   ```

3. **Verificar límites de responsabilidad**
   - Revisa la sección "LÍMITES DE RESPONSABILIDAD" del agente
   - Puede que necesite ajustes en tu proyecto

---

### Los handoffs entre agentes no funcionan bien

**Síntoma:** Cuando un agente sugiere ir a otro, se pierde el contexto.

**Soluciones:**

1. **Incluir contexto explícito en el handoff**
   ```
   @frontend-architect Basándote en la API diseñada anteriormente 
   (POST /api/products con campos name, price, category), 
   crea el formulario de creación de productos.
   ```

2. **Copiar información relevante**
   - Copia los schemas/interfaces del agente anterior
   - Incluye decisiones tomadas previamente

3. **Usar el orchestrator**
   ```
   @orchestrator Continúa con el paso de frontend para la feature 
   de productos que diseñamos con backend-architect
   ```

---

## Problemas de Configuración

### Conflictos entre agentes y configuración

**Síntoma:** Los agentes sugieren tecnologías diferentes a las configuradas.

**Soluciones:**

1. **Priorizar project-context.yml**
   ```
   @backend-architect Siguiendo la configuración del proyecto 
   (MongoDB, NO PostgreSQL), diseña el modelo de datos.
   ```

2. **Actualizar configuración**
   ```yaml
   # Si cambiaste de tecnología, actualiza project-context.yml
   stack:
     database: "postgresql"  # Cambiado de mongodb
     orm: "prisma"           # Cambiado de mongoose
   ```

3. **Revisar _framework-context.md**
   - Si hay conflicto, el archivo `_core/_framework-context.md` tiene precedencia
   - Modifícalo si tu proyecto difiere del stack estándar

---

### Variables de entorno no reconocidas

**Síntoma:** Los agentes generan código con variables de entorno incorrectas.

**Soluciones:**

1. **Documentar variables en el contexto**
   ```yaml
   # En project-context.yml, agrega:
   environment:
     variables:
       - name: "DATABASE_URL"
         description: "MongoDB connection string"
       - name: "NEXTAUTH_SECRET"
         description: "NextAuth.js secret"
   ```

2. **Mencionar en la solicitud**
   ```
   @backend-architect Usa la variable MONGODB_URI (no DATABASE_URL) 
   para la conexión a la base de datos.
   ```

---

## Problemas de Rendimiento

### Respuestas muy lentas

**Síntoma:** Los agentes tardan mucho en responder.

**Soluciones:**

1. **Reducir contexto**
   - No pegues archivos enteros, solo las partes relevantes
   - Usa referencias a archivos en lugar de contenido completo

2. **Solicitudes más específicas**
   ```
   # En lugar de:
   @backend-architect Diseña todo el backend de la aplicación
   
   # Usa:
   @backend-architect Diseña el endpoint POST /api/users para crear usuarios
   ```

3. **Dividir tareas grandes**
   - Usa `@orchestrator` para crear un plan
   - Ejecuta cada paso por separado

---

### Respuestas incompletas o cortadas

**Síntoma:** El agente no termina de escribir el código o la respuesta.

**Soluciones:**

1. **Pedir continuación**
   ```
   Continúa desde donde te quedaste
   ```

2. **Pedir por partes**
   ```
   @backend-architect Primero, muéstrame solo la interfaz del servicio.
   
   # Después:
   @backend-architect Ahora implementa el servicio.
   ```

3. **Especificar qué necesitas**
   ```
   @backend-architect Solo necesito:
   1. La interfaz TypeScript
   2. El esquema de Mongoose
   Sin implementación completa por ahora.
   ```

---

## Errores Comunes

### "El agente X no existe"

**Causa:** El archivo del agente no está en la ubicación correcta.

**Solución:**
```bash
# Verificar estructura
ls -la .github/agents/agents/

# Debe contener archivos como:
# orchestrator.md
# backend-architect.md
# frontend-architect.md
# etc.
```

---

### Código generado no compila

**Causa:** El agente no tiene el contexto completo de tu proyecto.

**Solución:**
1. Incluir imports y tipos necesarios en la solicitud
2. Especificar versiones de librerías
3. Proporcionar interfaces/tipos existentes

```
@backend-architect Genera el servicio usando estos tipos:

interface Product {
  id: string;
  name: string;
  price: number;
}

Usa Mongoose 8.x y la estructura de proyecto en src/core/
```

---

### Sugerencias inconsistentes entre sesiones

**Causa:** Cada sesión de chat es independiente.

**Solución:**
1. Mantener contexto en la misma conversación
2. Documentar decisiones en el proyecto
3. Referenciar decisiones anteriores explícitamente

```
@orchestrator En la sesión anterior decidimos usar Zustand 
para estado y Zod para validación. Continúa con esas decisiones.
```

---

## FAQs

### ¿Puedo usar los agentes con otro framework que no sea Next.js?

**Respuesta:** El framework está optimizado para Next.js + MongoDB, pero puedes:
1. Modificar `_core/_framework-context.md` para tu stack
2. Actualizar ejemplos de código en los agentes
3. Ajustar `project-context.yml` con tu configuración

---

### ¿Los agentes funcionan offline?

**Respuesta:** No, los agentes requieren conexión a GitHub Copilot que es un servicio en la nube.

---

### ¿Puedo crear mis propios agentes?

**Respuesta:** ¡Sí! Consulta la [Guía de Personalización](./CUSTOMIZATION.md) para aprender a crear agentes personalizados.

---

### ¿Los agentes pueden modificar archivos automáticamente?

**Respuesta:** Los agentes solo sugieren código y cambios. Tú decides qué aplicar. Para aplicar sugerencias:
1. Copia el código sugerido
2. Usa las acciones de Copilot como "Insert at Cursor"
3. O pide crear un diff/patch

---

### ¿Cómo actualizo los agentes a una nueva versión?

**Respuesta:**
```bash
# Opción 1: Reinstalar
rm -rf .github/agents
curl -sSL https://raw.githubusercontent.com/Angel-Baez/mern-agents-framework/main/init-agents.sh | bash

# Opción 2: Manual (preservando project-context.yml)
cp .github/agents/project-context.yml /tmp/
rm -rf .github/agents
# ... reinstalar ...
cp /tmp/project-context.yml .github/agents/
```

---

### ¿Puedo usar los agentes en múltiples repositorios?

**Respuesta:** Sí, cada repositorio necesita su propia instalación:
1. Ejecuta el script de instalación en cada repo
2. Personaliza `project-context.yml` para cada proyecto
3. Los agentes base son los mismos, el contexto cambia

---

## ¿Necesitas más ayuda?

- 📚 [Documentación completa](https://github.com/Angel-Baez/mern-agents-framework)
- 🐛 [Reportar un bug](https://github.com/Angel-Baez/mern-agents-framework/issues/new?template=bug_report.md)
- 💡 [Solicitar una feature](https://github.com/Angel-Baez/mern-agents-framework/issues/new?template=feature_request.md)
- 💬 [Discusiones de la comunidad](https://github.com/Angel-Baez/mern-agents-framework/discussions)

---

*Última actualización: Diciembre 2024*
