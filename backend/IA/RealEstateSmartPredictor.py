import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split


class RealEstateSmartPredictor:
    def __init__(self):
        # Random Forest
        self.model = RandomForestClassifier(
            n_estimators=300,
            max_depth=12,
            min_samples_split=4,
            random_state=42,
            n_jobs=-1,
            class_weight="balanced",
        )
        self.label_encoder = LabelEncoder()

        self.features = [
            "Growth_2024",
            "Growth_2025",
            "Growth_Trend_3Y",
            "Vacancy_Rate_2023",
            "Affordability_Ratio_2023",
            "Growth_Momentum",
            "Market_Stability",
        ]

    def prepare_data(self, df):
        data = df.copy()

        # Precio Actual
        data["Current_Price"] = data["2025-01-31"]

        # Momentum (Aceleración del crecimiento)
        recent_growth = (data["Growth_2024"] + data["Growth_2025"]) / 2
        past_growth = (data["Growth_2022"] + data["Growth_2023"]) / 2
        data["Growth_Momentum"] = recent_growth - past_growth

        # Tendencia a Largo Plazo (3 Años)
        data["Growth_Trend_3Y"] = data[
            ["Growth_2023", "Growth_2024", "Growth_2025"]
        ].mean(axis=1)

        # Estabilidad del Mercado
        volatility = data[
            ["Growth_2021", "Growth_2022", "Growth_2023", "Growth_2024"]
        ].std(axis=1)
        data["Market_Stability"] = 1 / (volatility + 0.001)

        for col in self.features:
            if col in data.columns:
                data[col] = data[col].fillna(data[col].median())

        return data

    def _generate_smart_target(self, df):
        # Calcular Investment Score (0 a 100)
        def normalize(series):
            return (series - series.min()) / (series.max() - series.min())

        inv_vacancy = 1 - normalize(df["Vacancy_Rate_2023"])
        inv_affordability = 1 - normalize(df["Affordability_Ratio_2023"])
        score_growth = normalize(df["Growth_2025"])
        score_momentum = normalize(df["Growth_Momentum"])

        final_score = (
            (score_growth * 0.40)
            + (score_momentum * 0.20)
            + (inv_affordability * 0.20)
            + (inv_vacancy * 0.20)
        )

        p80 = final_score.quantile(0.80)
        p30 = final_score.quantile(0.30)

        def classify(score):
            if score >= p80:
                return "Alto Potencial"
            if score <= p30:
                return "Bajo Potencial"
            return "Estable"

        return final_score.apply(classify)

    def train(self, df):
        print("Preparando datos y generando ranking estadístico...")

        df_clean = self.prepare_data(df)

        df_clean["Target"] = self._generate_smart_target(df_clean)

        print(f"\nDistribución de Clases (Basada en Percentiles del Mercado):")
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

        print(f"\nModelo ajustado a la lógica de mercado. Precisión: {score*100:.1f}%")

        importance = pd.DataFrame(
            {"Feature": self.features, "Importancia": self.model.feature_importances_}
        ).sort_values("Importancia", ascending=False)

        print(f"\n🎯 Factores más determinantes hoy:")
        print(importance.head(3).to_string(index=False))

        return df_clean

    def predict(self, csv_path="texas_master_data.csv"):
        df = pd.read_csv(csv_path)

        df_processed = self.train(df)

        X = df_processed[self.features]

        # Predicciones
        predictions = self.label_encoder.inverse_transform(self.model.predict(X))
        probabilities = self.model.predict_proba(X)
        confidence = np.max(probabilities, axis=1)

        # Construcción del DataFrame de Resultados
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

        sort_map = {"Alto Potencial": 0, "Estable": 1, "Bajo Potencial": 2}
        results["_sort_helper"] = results["Clasificacion"].map(sort_map)

        results = results.sort_values(
            ["_sort_helper", "Confianza_%"], ascending=[True, False]
        )

        results = results.drop("_sort_helper", axis=1).reset_index(drop=True)

        return results
