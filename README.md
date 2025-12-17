# NextBlock

Este directorio contiene el backend del proyecto **NextBlock**, una aplicación inteligente para el análisis y predicción de inversiones inmobiliarias.

## 1. Descripción General del Proyecto

El backend está desarrollado en **Python** y tiene como objetivo principal procesar datos inmobiliarios, aplicar modelos de Machine Learning para identificar oportunidades de inversión y exponer estos resultados a través de una API REST.

### Funcionalidades Clave:
- **Inteligencia Artificial (IA)**: Utiliza un modelo `RandomForestClassifier` para clasificar propiedades en categorías como "Barata - Alto Potencial", "Cara - Sobrevalorada" o "Regular - Estable".
- **Servicios de Datos**: Procesa archivos CSV masivos (`texas_master_data.csv`), enriquece la data con información geoespacial (Latitud/Longitud) y transforma los resultados a formato JSON.
- **API REST**: Expone los datos procesados para que el frontend pueda consumirlos fácilmente.

### Relación Backend-Frontend:
El backend actúa como la capa de lógica y datos. El frontend consume la data final a través del endpoint `/api/all`, recibiendo un JSON estructuras con las predicciones, confianza del modelo y coordenadas geográficas para su visualización en mapas.

### Estructura de Módulos:
- **`AI/`**: Contiene la lógica del modelo de Machine Learning (`RealEstateSmartPredictor.py`) y los datasets de entrada/salida.
- **`Services/`**: Maneja la transformación de datos y utilidades, como la geocodificación (`Latitud_Longitud.py`) y la conversión a JSON (`preparing_final_data.py`).

---

## 2. Tecnologías Utilizadas

El proyecto utiliza un stack moderno de Python para Data Science y Web Development.

### Core
- **Python**: 3.x

### Framework Web
- **FastAPI**: Para la creación de la API REST de alto rendimiento.
- **Uvicorn**: Servidor ASGI para ejecutar la aplicación.

### Data Science & AI
- **Pandas**: Manipulación y limpieza de datos estructurados.
- **NumPy**: Operaciones numéricas eficientes.
- **Scikit-learn**: Implementación del modelo `RandomForestClassifier`, `LabelEncoder` y división de datos (`train_test_split`).

### Utilidades
- **pgeocode**: Para obtener coordenadas (latitud/longitud) a partir de códigos postales.
- **CSV & JSON**: Módulos nativos para manejo de archivos.

---

## 3. Análisis de Endpoints

La API cuenta con los siguientes endpoints definidos en `main.py`.

| Método | Endpoint | Descripción | Parámetros | Respuesta | Dependencias |URL
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Endpoint raíz para verificar el estado de la API. | Ninguno | `{"message": "This is the root"}` | Ninguna | http://127.0.0.1:8000/

| `GET` | `/api/all` | Devuelve todos los datos de predicción inmobiliaria con geolocalización. | Ninguno | JSON Array con objetos de propiedades (Ver ejemplo abajo) | `getData()` de `Services` | http://127.0.0.1:8000/api/all

### Ejemplo de Respuesta (`/api/all`)
```json
[
  {
    "RegionName": "77001",
    "City": "Houston",
    "State": "TX",
    "Current_Price": 250000,
    "Affordability_Ratio_2023": 4.5,
    "Clasificacion_IA": "Barata - Alto Potencial",
    "Confianza": 85.5,
    "Datos_Clave": "Growth24: 3.2% | Vacancy: 5.1%",
    "Latitude": 29.7604,
    "Longitude": -95.3698
  },
  ...
]
```

---

## 4. Instrucciones para Levantar la API

Sigue estos pasos para configurar y ejecutar el backend en tu entorno local.

### Prerrequisitos
Tener Python instalado (versión 3.8 o superior recomendada).

### 1. Crear y Activar Entorno Virtual

**Windows:**
```bash
python -m venv venv
.\venv\Scripts\activate
```

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar Dependencias
Como no existe un archivo `requirements.txt` explícito, instala las librerías detectadas manualmente:

```bash
pip install fastapi uvicorn pandas numpy scikit-learn pgeocode
```

*(Opcional) Si deseas generar un archivo de requerimientos para el futuro:*
```bash
pip freeze > requirements.txt
```

### 3. Ejecutar el Servidor

**Modo Desarrollo (con recarga automática):**
```bash
uvicorn main:app --reload
```

**Modo Producción (Ejecución simple):**
```bash
uvicorn main:app
```

El servidor iniciará por defecto en `http://127.0.0.1:8000`.

---

## 5. Notas Adicionales y Flujo de Datos

### Flujo de Ejecución del Proyecto
Para actualizar los datos y las predicciones, el flujo lógico es:

1.  **Entrenamiento y Predicción**: Ejecutar `AI/RealEstateSmartPredictor.py`.
    -   Lee `texas_master_data.csv`.
    -   Entrena el modelo y genera predicciones.
    -   Guarda `Resultados_Prediccion.csv`.
2.  **Geolocalización**: Ejecutar `Services/Latitud_Longitud.py`.
    -   Lee `Resultados_Prediccion.csv`.
    -   Agrega columnas de Latitud/Longitud usando códigos postales.
    -   Guarda `Resultados_Prediccion_con_Geo.csv`.
3.  **Preparación Final**: (Automático al llamar a la API) `Services/preparing_final_data.py`.
    -   Convierte el CSV geo-enriquecido a `final_data.json`.
    -   La API lee este JSON para responder al frontend.

### Recomendaciones
- **Dependencias**: Se recomienda crear un archivo `requirements.txt` oficial para facilitar la instalación en otros entornos.
- **Rutas**: El código actual utiliza rutas relativas (`..`) que dependen de la estructura de carpetas `IA` y `Services`. Mantener esta estructura es crucial para el funcionamiento.
