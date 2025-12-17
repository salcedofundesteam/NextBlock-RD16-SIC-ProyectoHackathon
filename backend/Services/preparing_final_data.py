import csv
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

CSV_INPUT_PATH = BASE_DIR / ".." / "IA" / "resultados_prediccion_con_geo.csv"
JSON_OUTPUT_PATH = BASE_DIR / ".." / "final_data.json"


# transformar de .csv a json
def convert_csv_to_json(input_path, output_path):
    data = []

    if not input_path.exists():
        print(f"Error: CSV input file not found at {input_path}")
        return

    with open(input_path, mode="r", newline="", encoding="utf-8") as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            data.append(row)

    with open(output_path, mode="w", encoding="utf-8") as json_file:
        json.dump(data, json_file, indent=4)


convert_csv_to_json(CSV_INPUT_PATH, JSON_OUTPUT_PATH)


def getData():
    if not JSON_OUTPUT_PATH.exists():
        print(f"Error: JSON output file not found at {JSON_OUTPUT_PATH}")
        return []

    with open(JSON_OUTPUT_PATH, "r", encoding="utf-8") as file:
        data = json.load(file)
        return data
