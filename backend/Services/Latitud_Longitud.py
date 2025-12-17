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

    # Leer CSV original
    df = pd.read_csv(input_csv_path)

    # Inicializar buscador ZIP USA
    nomi = pgeocode.Nominatim("us")

    # Funciones para obtener latitud y longitud
    def obtener_lat(zip_code):
        info = nomi.query_postal_code(str(zip_code))
        return info.latitude if info is not None else None

    def obtener_lon(zip_code):
        info = nomi.query_postal_code(str(zip_code))
        return info.longitude if info is not None else None

    df["Latitude"] = df["RegionName"].apply(obtener_lat)
    df["Longitude"] = df["RegionName"].apply(obtener_lon)

    df.to_csv(output_csv_path, index=False)

    print(f"Archivo generado correctamente en:\n{output_csv_path}")


if __name__ == "__main__":
    agregar_lat_long()
