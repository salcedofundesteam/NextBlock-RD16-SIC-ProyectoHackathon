import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split


class RealEstateSmartPredictor:
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=200,
            max_depth=10,
            min_samples_split=5,
            random_state=42,
            n_jobs=-1,
        )
        self.label_encoder = LabelEncoder()

        # Solo features relevantes para CRECIMIENTO
        self.features = [
            "Growth_2023",
            "Growth_2024",
            "Growth_2025",
            "Vacancy_Rate_2023",
            "Population_2023",
            "Growth_Momentum",
            "Growth_Stability",
        ]

    def prepare_data(self, df):
        # Precio actual
        df["Current_Price"] = df.get("2025-01-31", df.iloc[:, 5])

        # Momentum: ¿El crecimiento está acelerando?
        df["Growth_Momentum"] = (df["Growth_2024"] + df["Growth_2025"]) / 2 - (
            df["Growth_2022"] + df["Growth_2023"]
        ) / 2

        # Estabilidad: ¿El crecimiento es consistente?
        df["Growth_Stability"] = 1 - df[
            ["Growth_2023", "Growth_2024", "Growth_2025"]
        ].std(axis=1)

        return df[
            ["RegionName", "City", "State", "Current_Price"] + self.features
        ].copy()

    def _classify_potential(self, row):
        """
        Clasificacion balanceada basada en CRECIMIENTO:

        ALTO POTENCIAL: Top 15-20% del mercado
        ESTABLE: Crecimiento moderado/normal (60-70%)
        BAJO POTENCIAL: Estancado o problemático (15-20%)
        """
        # Crecimiento promedio reciente
        avg_growth = (row["Growth_2024"] + row["Growth_2025"]) / 2

        # ALTO POTENCIAL (criterios más realistas)
        if (
            avg_growth > 0.025  # >2.5% promedio (realista)
            and row["Growth_2025"] > 0.015  # Creciendo ahora >1.5%
            and row["Vacancy_Rate_2023"] < 0.12  # Mercado razonable
            and row["Growth_Momentum"] > -0.01  # No desacelerando fuerte
        ):
            return "Alto Potencial"

        # BAJO POTENCIAL (solo casos problemáticos)
        if (
            row["Growth_2025"] < -0.005  # Declinando >0.5%
            or avg_growth < 0.005  # Casi sin crecimiento
            or row["Vacancy_Rate_2023"] > 0.18  # Vacancia muy alta
            or (
                row["Growth_Momentum"] < -0.02 and avg_growth < 0.015
            )  # Desacelerando mucho
        ):
            return "Bajo Potencial"

        return "Estable"

    def train(self, df):
        """Entrenamiento optimizado"""
        print("🔄 Preparando datos...")
        df_clean = self.prepare_data(df)
        df_clean["Target"] = df_clean.apply(self._classify_potential, axis=1)

        print(f"\n📊 Total propiedades: {len(df_clean)}")
        print(df_clean["Target"].value_counts().to_string())

        X = df_clean[self.features]
        y = self.label_encoder.fit_transform(df_clean["Target"])

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        self.model.fit(X_train, y_train)
        score = self.model.score(X_test, y_test)

        print(f"\n✅ Precisión del modelo: {score*100:.1f}%")

        # Top 3 features
        importance = pd.DataFrame(
            {"Feature": self.features, "Importancia": self.model.feature_importances_}
        ).nlargest(3, "Importancia")

        print(f"\n🎯 Top 3 Predictores:")
        for _, row in importance.iterrows():
            print(f"   {row['Feature']}: {row['Importancia']:.1%}")

        return df_clean

    def predict(self, csv_path="texas_master_data.csv"):
        """Predicción optimizada"""
        df = pd.read_csv(csv_path)
        df_clean = self.train(df)

        X = df_clean[self.features]
        predictions = self.label_encoder.inverse_transform(self.model.predict(X))
        confidence = np.max(self.model.predict_proba(X), axis=1)

        # Resultados finales
        results = pd.DataFrame(
            {
                "NombreRegion": df_clean["RegionName"],
                "Ciudad": df_clean["City"],
                "Estado": df_clean["State"],
                "Precio_Actual": df_clean["Current_Price"].round(0).astype(int),
                "Clasificacion": predictions,
                "Confianza_%": (confidence * 100).round(1),
                "Datos_Clave": (
                    "Crecimiento24: "
                    + (df_clean["Growth_2024"] * 100).round(1).astype(str)
                    + "% | "
                    + "Crecimiento25: "
                    + (df_clean["Growth_2025"] * 100).round(1).astype(str)
                    + "% | "
                    + "Vacancia: "
                    + (df_clean["Vacancy_Rate_2023"] * 100).round(1).astype(str)
                    + "% | "
                    + "Impulso: "
                    + (df_clean["Growth_Momentum"] * 100).round(1).astype(str)
                    + "%"
                ),
            }
        )

        # Ordenar: Alto Potencial primero, luego por confianza
        order = {"Alto Potencial": 1, "Estable": 2, "Bajo Potencial": 3}
        results["_sort"] = results["Clasificacion"].map(order)
        results = results.sort_values(["_sort", "Confianza_%"], ascending=[True, False])
        results = results.drop("_sort", axis=1).reset_index(drop=True)

        return results
