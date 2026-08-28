---
trigger: always_on
---

1. Principios de diseño
SOLID
S — Single Responsibility: cada componente, hook o función hace una sola cosa. Si un componente maneja fetching, lógica de negocio y presentación a la vez, sepáralo en hook + componente contenedor + componente de UI.
O — Open/Closed: prefiere composición y props/slots sobre modificar código existente. Extiende comportamiento vía props, render props o composición de componentes, no añadiendo flags booleanos que ramifiquen la lógica interna indefinidamente.
L — Liskov Substitution: si se definen variantes de un componente (ej. Button, IconButton), deben ser intercambiables sin romper el contrato de props ni el comportamiento esperado por quien los consume.
I — Interface Segregation: no fuerces a un componente a recibir props que no usa. Divide interfaces grandes en tipos más pequeños y específicos.
D — Dependency Inversion: los componentes de UI no deben depender directamente de implementaciones concretas (fetch, SDKs, storage). Inyecta dependencias vía props, contexto o hooks abstraídos (ej. useAuthService() en vez de llamar a un SDK directamente dentro del componente).
DRY (Don't Repeat Yourself)
Antes de escribir código nuevo, busca si ya existe una utilidad, hook o componente que resuelva el problema.
Extrae lógica repetida (validaciones, formateo, llamadas a API) a hooks (useX) o funciones puras en utils/ o lib/.
No dupliques tipos: reutiliza o compone tipos con Pick, Omit, Partial, etc., en vez de redefinir estructuras similares.
Excepción válida: duplicar 2-3 líneas simples es preferible a crear una abstracción prematura que acople módulos que deberían evolucionar por separado (evita el "DRY prematuro").
KISS y YAGNI
Prefiere la solución más simple que resuelva el problema actual.
No añadas configuración, props opcionales o capas de abstracción para casos de uso hipotéticos que no se han pedido.
TypeScript estricto: nunca uses any. Si el tipo es genuinamente desconocido, usa unknown y haz narrowing explícito.
Componentes funcionales con hooks; nada de class components salvo que el proyecto ya los use extensivamente.
Props tipadas con interface (no type) salvo para uniones, intersecciones o tipos utilitarios.
Nombrado:
Componentes: PascalCase.
Hooks: useCamelCase.
Funciones/variables: camelCase.
Constantes globales: UPPER_SNAKE_CASE.
Un componente por archivo, nombre de archivo = nombre del componente.
Evita prop drilling: si una prop atraviesa más de 2-3 niveles, usa Context o un state manager (Zustand, Redux, Jotai — el que ya use el proyecto).
Manejo de estado: estado local con useState/useReducer; estado derivado nunca se guarda en estado, se calcula en el render o con useMemo.
Efectos secundarios (useEffect) solo para sincronización con sistemas externos, nunca para calcular estado derivado o encadenar setStates.
eparación clara por capas:
components/ — UI pura, sin lógica de negocio ni fetching.
hooks/ — lógica reutilizable y stateful.
services/ o api/ — llamadas a APIs externas, aisladas del resto.
utils/ o lib/ — funciones puras sin efectos secundarios.
types/ — tipos e interfaces compartidos.
Los componentes de presentación no importan directamente de services/; reciben datos vía props o hooks.
Evita archivos "god object" (utils.ts con 500 líneas de todo). Divide por dominio.
Cada función pública/exportada debe ser fácil de testear de forma aislada (inputs claros, sin dependencias ocultas de globals o singletons).
Nombres descriptivos > comentarios. Solo comenta el "por qué", nunca el "qué" (el código ya dice qué hace).
Maneja errores explícitamente: no dejes promesas sin .catch/try-catch, ni ignores errores de tipado con // @ts-ignore sin justificación.
Accesibilidad (a11y): usa elementos semánticos, atributos aria-* cuando corresponda, y asegúrate de que todo sea navegable por teclado.
Rendimiento: memoiza (useMemo, useCallback, React.memo) solo cuando hay una razón medible, no por defecto en todo.
Antes de generar código, identifica si ya existe una abstracción similar en el proyecto (componente, hook, util) y reutilízala.
Al proponer una solución, explica brevemente qué principio(s) de arriba aplica y por qué (una línea, no un ensayo).
Si una petición del usuario entra en conflicto con estos principios (ej. "mete todo en un solo componente gigante"), adviértelo brevemente y ofrece la alternativa recomendada, pero respeta la decisión final del usuario si insiste.
Nunca sacrifiques legibilidad por "cleverness". Código simple y explícito

código denso e ingenioso.

Si generas o modificas múltiples archivos, mantenlos consistentes entre sí (mismos imports, convenciones de nombrado, estilo).
Los archivos de estilo deben tener centralizados los colores y dimensiones (tamaños, bordes, espaciados) de forma que sean escalables y reutilizables, ya sea en tokens de diseño o en los temas de MUI


Todo el texto hardcoded debe estar en inglés