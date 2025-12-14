import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split


class RealEstateSmartPredictor:
    def __init__(self):
        # Mantenemos el Random Forest, pero ahora aprenderá patrones más complejos
        self.model = RandomForestClassifier(
            n_estimators=300,  # Aumentado para más precisión
            max_depth=12,
            min_samples_split=4,
            random_state=42,
            n_jobs=-1,
            class_weight="balanced",  # Importante para detectar las "joyas" escasas
        )
        self.label_encoder = LabelEncoder()

        # Features ampliados y mejorados basados en tu dataset completo
        self.features = [
            "Growth_2024",
            "Growth_2025",
            "Growth_Trend_3Y",  # Tendencia a 3 años
            "Vacancy_Rate_2023",
            "Affordability_Ratio_2023",  # ¡CRUCIAL! (Precio vs Ingreso)
            "Growth_Momentum",  # Aceleración
            "Market_Stability",  # Volatilidad inversa
        ]

    def prepare_data(self, df):
        """
        Prepara los datos y genera métricas financieras avanzadas.
        """
        # Evitar modificar el original
        data = df.copy()

        # 1. Precio Actual (Usamos la columna más reciente disponible)
        data["Current_Price"] = data["2025-01-31"]

        # 2. Momentum (Aceleración del crecimiento)
        # Compara (2024+2025) vs (2022+2023)
        recent_growth = (data["Growth_2024"] + data["Growth_2025"]) / 2
        past_growth = (data["Growth_2022"] + data["Growth_2023"]) / 2
        data["Growth_Momentum"] = recent_growth - past_growth

        # 3. Tendencia a Largo Plazo (3 Años)
        data["Growth_Trend_3Y"] = data[
            ["Growth_2023", "Growth_2024", "Growth_2025"]
        ].mean(axis=1)

        # 4. Estabilidad del Mercado (Inverso de la desviación estándar)
        # Mercados con crecimiento constante son mejores que los volátiles
        volatility = data[
            ["Growth_2021", "Growth_2022", "Growth_2023", "Growth_2024"]
        ].std(axis=1)
        data["Market_Stability"] = 1 / (volatility + 0.001)  # Evitar división por cero

        # Limpieza básica de NaNs en las features que usaremos
        for col in self.features:
            if col in data.columns:
                data[col] = data[col].fillna(data[col].median())

        return data

    def _generate_smart_target(self, df):
        """
        GENERA LA CLASIFICACIÓN PERFECTA BASADA EN ESTADÍSTICA (PERCENTILES),
        NO EN NÚMEROS FIJOS.
        """
        # Calcular un 'Investment Score' (0 a 100)
        # Pesos: Crecimiento (40%), Momentum (20%), Asequibilidad (20%), Vacancia (20%)

        # Normalización simple para poder sumar peras con manzanas
        def normalize(series):
            return (series - series.min()) / (series.max() - series.min())

        # Invertir vacancia y asequibilidad (menor es mejor)
        inv_vacancy = 1 - normalize(df["Vacancy_Rate_2023"])
        inv_affordability = 1 - normalize(df["Affordability_Ratio_2023"])
        score_growth = normalize(df["Growth_2025"])
        score_momentum = normalize(df["Growth_Momentum"])

        # Fórmula Maestra de Calidad
        final_score = (
            (score_growth * 0.40)
            + (score_momentum * 0.20)
            + (inv_affordability * 0.20)
            + (inv_vacancy * 0.20)
        )

        # Usamos PERCENTILES para definir las clases.
        # Esto asegura que siempre detectemos el Top 20% del mercado, esté como esté la economía.
        p80 = final_score.quantile(0.80)  # Top 20%
        p30 = final_score.quantile(0.30)  # Bottom 30%

        def classify(score):
            if score >= p80:
                return "Alto Potencial"
            if score <= p30:
                return "Bajo Potencial"
            return "Estable"

        return final_score.apply(classify)

    def train(self, df):
        """Entrenamiento optimizado con lógica de percentiles"""
        print("🔄 Preparando datos y generando ranking estadístico...")

        df_clean = self.prepare_data(df)

        # AQUÍ ESTÁ LA MAGIA: Generamos el Target dinámicamente basado en la calidad relativa
        df_clean["Target"] = self._generate_smart_target(df_clean)

        print(f"\n📊 Distribución de Clases (Basada en Percentiles del Mercado):")
        print(
            df_clean["Target"]
            .value_counts(normalize=True)
            .mul(100)
            .round(1)
            .astype(str)
            + "%"
        )

        X = df_clean[self.features]
        y = self.label_encoder.fit_transform(df_clean["Target"])

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        self.model.fit(X_train, y_train)
        score = self.model.score(X_test, y_test)

        print(
            f"\n✅ Modelo ajustado a la lógica de mercado. Precisión: {score*100:.1f}%"
        )

        # Feature Importance para que veas qué está moviendo el mercado
        importance = pd.DataFrame(
            {"Feature": self.features, "Importancia": self.model.feature_importances_}
        ).sort_values("Importancia", ascending=False)

        print(f"\n🎯 Factores más determinantes hoy:")
        print(importance.head(3).to_string(index=False))

        return df_clean

    def predict(self, csv_path="texas_master_data.csv"):
        """Predicción y generación de formato idéntico al solicitado"""
        df = pd.read_csv(csv_path)

        # Entrenamos con los mismos datos (o podrías cargar un modelo guardado)
        # Nota: En producción, idealmente separarías train de predict,
        # pero aquí seguimos tu flujo para mantener la estructura.
        df_processed = self.train(df)

        X = df_processed[self.features]

        # Predicciones
        predictions = self.label_encoder.inverse_transform(self.model.predict(X))
        probabilities = self.model.predict_proba(X)
        confidence = np.max(probabilities, axis=1)

        # Construcción del DataFrame de Resultados (Formato IDÉNTICO al original)
        results = pd.DataFrame(
            {
                "RegionName": df_processed["RegionName"],
                "Ciudad": df_processed["City"],
                "Estado": df_processed["State"],
                "Precio_Actual": df_processed["Current_Price"].round(0).astype(int),
                "Clasificacion": predictions,
                "Confianza_%": (confidence * 100).round(1),
                "Crecimiento_2025_%": (df_processed["Growth_2025"] * 100).round(1),
                "Asequibilidad": df_processed["Affordability_Ratio_2023"].round(1),
                "Vacancia_%": (df_processed["Vacancy_Rate_2023"] * 100).round(1),
                "Impulso_Mercado_%": (df_processed["Growth_Momentum"] * 100).round(1),
            }
        )

        # Lógica de Ordenamiento: Alto Potencial arriba, luego por confianza
        # Usamos un mapa personalizado para forzar el orden específico
        sort_map = {"Alto Potencial": 0, "Estable": 1, "Bajo Potencial": 2}
        results["_sort_helper"] = results["Clasificacion"].map(sort_map)

        results = results.sort_values(
            ["_sort_helper", "Confianza_%"], ascending=[True, False]
        )

        # Limpieza final
        results = results.drop("_sort_helper", axis=1).reset_index(drop=True)

        return results
