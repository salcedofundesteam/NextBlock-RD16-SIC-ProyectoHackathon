from RealEstateSmartPredictor import RealEstateSmartPredictor
import pandas as pd

predictor = RealEstateSmartPredictor()


resultados = predictor.predict()

# Guardar resultados en CSV
df = pd.DataFrame(resultados)
df.to_csv("resultados_prediccion.csv", index=False)
