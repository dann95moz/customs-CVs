# 📋 Reglas de Creación y Personalización de CV (rules.md)

Este documento define las directrices estrictas de estilo, formato, contenido y optimización ATS que la IA (o el redactor) **debe cumplir rigurosamente** al generar cualquier versión personalizada del currículum.

---

## 1. 🚫 Qué NO Hacer (Límites y Restricciones)

- **Sin datos personales sensibles ni discriminatorios:**
  - ❌ NO incluir fotografía (a menos que se aplique en un país/industria donde sea legal y explícitamente requerido).
  - ❌ NO incluir fecha de nacimiento, edad, estado civil, género, nacionalidad o religión.
  - ❌ NO incluir número de documento de identidad (DNI, Cédula, RUT, Pasaporte, SSN).
  - ❌ NO incluir dirección postal completa (calle, número, código postal). Solo Ciudad, País.
- **Sin clichés vacíos de valor:**
  - ❌ Evitar adjetivos genéricos no sustentados: *"trabajador apasionado"*, *"orientado a resultados"*, *"pensador fuera de la caja"*, *"buen jugador de equipo"*.
  - ❌ Sustituir todo adjetivo por hechos, datos y resultados concretos.
- **Sin descripciones pasivas de tareas:**
  - ❌ NO usar listas de tareas rutinarias ("Responsable de atender llamadas", "Encargado de programar en Python").
- **Sin elementos gráficos que rompan el ATS:**
  - ❌ NO utilizar tablas complejas anidadas, columnas múltiples difíciles de parsear, cuadros de texto flotantes, barras de progreso de habilidades (ej. *"Python 80%"* no significa nada para un reclutador o ATS) ni iconos como reemplazo de texto.
- **Sin información redundante:**
  - ❌ NO incluir la frase *"Referencias disponibles a solicitud"*.
  - ❌ NO listar colegios secundarios si ya se tiene educación universitaria/superior.
- **Sin inventar información:**
  - ❌ NO usar información que no se encuentre en los archivos proporcionados.
  - ❌ NO crear información falsa de métricas o tecnologías no mencionadas en master-data.md.

---

## 2. ✅ Qué SÍ Hacer (Estándares Obligatorios)

### A. Estructura y Extensión
- **Extensión:**
  - **1 página:** Para profesionales Junior / Mid (menos de 5 años de experiencia) o transiciones de carrera.
  - **Máximo 2 páginas:** Para perfiles Senior, Lead, Tech Leads o Managers (+5-8 años de experiencia relevante).
- **Jerarquía y Secciones:**
  1. **Encabezado:** Nombre completo + Título del rol objetivo + Datos de contacto esenciales.
  2. **Resumen Profesional (Executive Summary):** 3-4 líneas de alto impacto adaptadas al rol.
  3. **Habilidades Técnicas / Core Competencies:** Agrupadas por categoría y priorizadas según la oferta.
  4. **Experiencia Profesional:** En orden cronológico inverso.
  5. **Proyectos Destacados (Opcional si la experiencia es amplia, Clave para Juniors/Mid):** Con métricas y enlaces.
  6. **Educación y Certificaciones:** Con año de obtención y entidad emisora.
  7. **Idiomas:** Con nivel estandarizado (MCER: B2, C1, C2, Nativo).

### B. Fórmula de Logros e Impacto (Formato STAR / Google XYZ)
Cada viñeta (*bullet point*) de experiencia laboral debe redactarse utilizando la **Fórmula Google XYZ** o estructura **STAR/CAR**:

$$\text{"Desarrollar [X] medido por [Y] haciendo [Z]"}$$

- **Verbo de acción inicial** (en infinitivo).
- **Contexto/Reto:** El problema u oportunidad abordada.
- **Acción:** La tecnología, técnica o estrategia implementada.
- **Métrica Cuantitativa:** El impacto medible generado (% de aumento de conversión, reducción de costos en USD, horas ahorradas por semana, % de reducción de latencia, usuarios impactados).
- **Información adicional** Preguntar al usuario si hay algo que haya falta agregar como experiencia o certificados para le cargo
**Ejemplos:**
- 🔴 *Débil:* "Desarrollé APIs para el sistema de pagos."
- 🟢 *Fuerte:* "Diseñé e implementé múltiples microservicios RESTful con Node.js y Redis, procesando más de 1.5M de transacciones mensuales y reduciendo la latencia de respuesta en un 38%."

### C. Verbos de Acción Potentes|
Usar verbos precisos según el tipo de contribución:
- **Liderazgo / Gestión:** *Liderar, coordinar, capacitar, estandarizar, orquestar, dirigir.*
- **Desarrollo / Innovación:** *Arquitectar, diseñar, automatizar, implementar, refactorizar, desplegar.*
- **Optimización / Rendimiento:** *Reducir, acelerar, optimizar, maximizar, escalar, depurar.*
- **Negocio / Impacto:** *Incrementar, generar, negociar, ahorrar, captar, consolidar.*

---

## 3. 🎯 Optimización para ATS (Applicant Tracking Systems)

- **Densidad Inteligente de Palabras Clave:**
  - Extraer las tecnologías, metodologías (Scrum, CI/CD, TDD) y habilidades duras explicitadas en `target-job.md`.
  - Integrar de forma natural y contextual estas palabras clave en el resumen, las viñetas de experiencia y la sección de habilidades.
- **Compatibilidad de Títulos:**
  - Si el título en la oferta es *"Fullstack Developer"* y tu experiencia previa fue *"Software Engineer II"*, alinear el subtítulo del resumen hacia *"Fullstack Software Engineer"* manteniendo la veracidad del historial.
- **Formato de Fechas Consistente:**
  - Usar formato estándar: `Mes AAAA – Mes AAAA` (ej. `Ene 2022 – Presente` o `03/2021 – 11/2023`).

---

## 4. 🌐 Tono, Lenguaje y Presentación

- **Tono:** Profesional, directo, seguro, asertivo y libre de autoelogios subjetivos.
- **Consistencia Lingüística:**
  - Mantener un único idioma por versión (si la oferta está en inglés, el CV se genera 100% en inglés con terminología técnica estándar).
  - En español: usar terminología técnica ampliamente aceptada en la industria (ej. *Frontend, Backend, Deploy, Cloud, Pipeline, Pull Requests*).
- **Escaneabilidad Visual:**
  - Uso estratégico de negritas (`**palabra clave**` o `**métrica**`) para guiar la lectura del reclutador en los primeros 6 segundos de escaneo.
  - Máximo 3 a 5 viñetas por puesto de trabajo.

  ## 5. Inclusión de archivos
  - **Archivos a incluir y tener en cuenta:**
    - `master-data.md`: Información general del usuario.
    - `target-job.md`: Información específica del puesto objetivo.
    - `rules.md`: Reglas generales para la creación del CV.
    - `templates/cv-template.md`: Plantilla base para la creación del CV.
    - `certificates/*.md`: Certificaciones del usuario.
