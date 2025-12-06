import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split


class RealEstateSmartPredictor:
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=200,  # Número de árboles
            max_depth=10,  # Profundidad para evitar sobreajuste
            random_state=42,
            n_jobs=-1,  # Usar todos los procesadores
        )
        self.label_encoder = LabelEncoder()

        # Definimos las columnas que el modelo usará para "pensar"
        # Usamos los datos más recientes y relevantes de tu dataset
        self.features = [
            "Growth_2023",
            "Growth_2024",
            "Growth_2025",
            "Median_Income_2023",
            "Vacant_Homes_2023",
            "Population_2023",
            "Affordability_Ratio_2023",
            "Vacancy_Rate_2023",
            "Current_Price",
        ]

    def prepare_data(self, df):
        """Limpieza y preparación de datos"""
        df = df.copy()

        # 1. Mapear el precio actual (usando la columna más reciente disponible en tu data)
        if "2025-01-31" in df.columns:
            df["Current_Price"] = df["2025-01-31"]
        else:
            df["Current_Price"] = df.iloc[:, 5]  # Fallback a alguna columna de precio

        # 3. Calcular métricas derivadas útiles para el modelo
        # Relación Precio/Ingreso (si no existe, la calculamos)
        if (
            "Affordability_Ratio_2023" not in df.columns
            or df["Affordability_Ratio_2023"].isnull().all()
        ):
            df["Affordability_Ratio_2023"] = df["Current_Price"] / (
                df["Median_Income_2023"] + 1
            )

        return df

    def _generate_training_labels(self, row):
        """
        Esta función actúa como el 'Maestro'. Genera las etiquetas de verdad
        basándose en reglas financieras estrictas para que el modelo aprenda.
        """
        # Criterios para "Barata - Alto Potencial"
        # 1. Asequibilidad baja (Ratio < 5 es excelente)
        # 2. Crecimiento positivo reciente
        # 3. Vacancia baja (< 8%)
        if (
            row["Affordability_Ratio_2023"] < 5.5
            and row["Growth_2024"] > 0.02
            and row["Vacancy_Rate_2023"] < 0.10
        ):
            return "Barata - Alto Potencial"

        # Criterios para "Cara - Sobrevalorada"
        # 1. Muy cara para los ingresos locales (Ratio > 7)
        # 2. O Vacancia muy alta (> 12% indica abandono o especulación)
        elif row["Affordability_Ratio_2023"] > 7.0 or row["Vacancy_Rate_2023"] > 0.15:
            return "Cara - Sobrevalorada"

        else:
            return "Regular - Estable"

    def train(self, df):
        """Entrena el modelo con tu dataset"""
        print("--- Iniciando Entrenamiento del Modelo ---")
        df_clean = self.prepare_data(df)

        df_clean["Target"] = df_clean.apply(self._generate_training_labels, axis=1)

        X = df_clean[self.features]
        y = self.label_encoder.fit_transform(df_clean["Target"])

        # Split para validar
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        self.model.fit(X_train, y_train)

        score = self.model.score(X_test, y_test)
        print(f"Modelo entrenado con éxito. Precisión estimada: {score*100:.2f}%")

    def predict(self):
        df = pd.read_csv("texas_master_data.csv")
        self.train(df)
        """Retorna el DataFrame con la clasificación y confianza"""
        df_clean = self.prepare_data(df)
        X = df_clean[self.features]

        # Predicción de clase
        predictions = self.model.predict(X)
        decoded_predictions = self.label_encoder.inverse_transform(predictions)

        # Probabilidad (Confianza del modelo)
        probs = self.model.predict_proba(X)
        confidence = np.max(probs, axis=1)

        # Crear DataFrame de resultados limpios
        results = df_clean[
            ["RegionName", "City", "State", "Current_Price", "Affordability_Ratio_2023"]
        ].copy()
        results["Clasificacion_IA"] = decoded_predictions
        results["Confianza"] = (confidence * 100).round(2)

        # Añadir justificación simple (Datos clave)
        results["Datos_Clave"] = (
            "Growth24: "
            + (df_clean["Growth_2024"] * 100).round(1).astype(str)
            + "% | "
            + "Vacancy: "
            + (df_clean["Vacancy_Rate_2023"] * 100).round(1).astype(str)
            + "%"
        )

        return results
