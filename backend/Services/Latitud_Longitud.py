import pandas as pd
import pgeocode
import os


def agregar_lat_long():
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # Construir rutas relativas
    input_csv_path = os.path.join(base_dir, "..", "IA", "resultados_prediccion.csv")
    output_csv_path = os.path.join(
        base_dir, "..", "IA", "resultados_prediccion_con_geo.csv"
    )

    input_csv_path = os.path.normpath(input_csv_path)
    output_csv_path = os.path.normpath(output_csv_path)

    print("Leyendo archivo:", input_csv_path)
    df = pd.read_csv(input_csv_path)

    # Asegurar ZIP como string de 5 dígitos (ej: 06010)
    df["RegionName"] = (
        df["RegionName"]
        .astype(str)
        .str.strip()
        .str.replace(r"\.0$", "", regex=True)
        .str.zfill(5)
    )

    nomi = pgeocode.Nominatim("us")

    # Calcular solo para ZIPs únicos
    zips_unicos = df["RegionName"].dropna().unique()
    print("ZIPs únicos:", len(zips_unicos))

    geo = nomi.query_postal_code(pd.Series(zips_unicos))
    # geo es un DataFrame con columnas latitude/longitude
    geo = geo[["postal_code", "latitude", "longitude"]].set_index("postal_code")

    # Mapear de vuelta al DF
    df["Latitude"] = df["RegionName"].map(geo["latitude"])
    df["Longitude"] = df["RegionName"].map(geo["longitude"])

    df.to_csv(output_csv_path, index=False)
    print(f"Archivo generado correctamente en:\n{output_csv_path}")


agregar_lat_long()
