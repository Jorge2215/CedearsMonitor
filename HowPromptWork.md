## Orquestacion de un Prompt

[1] Prompt inicial (Product Owner narrativo: Team Leader)
    └─> "Quiero agregar búsqueda en el dropdown de Cedears"

[2] Copilot (Orquestador)
    └─> Decide qué modelo usar según la tarea

[3] Frontend Agent (GPT)
    └─> Genera el componente React con dropdown + búsqueda
    └─> Rápido, directo, scaffolding ágil

[4] Data Agent (Gemini)
    └─> Revisa estructura de datos
    └─> Implementa exportación CSV/Excel
    └─> Usa ventana de 1M tokens para analizar múltiples archivos

[5] Analytics Agent (Gemini)
    └─> Agrega indicadores técnicos (SMA, EMA)
    └─> Integra cálculos en el gráfico

[6] Testing Agent (Claude)
    └─> Explica casos de prueba
    └─> Documenta errores y soluciones con estilo pedagógico

[7] DevOps Agent (GPT)
    └─> Configura pipeline en Azure
    └─> YAML para despliegue automático

[8] Docs Agent (Claude)
    └─> Genera README y guías claras
    └─> Traduce lo técnico en narrativas comprensibles

[9] Despliegue final (Copilot + Azure)
    └─> Orquesta todo y asegura coherencia
