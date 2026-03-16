# SPHN AI Detection Service

Demo-mode AI microservice for traffic violation image analysis.

## Features (Simulated)
- **Helmet Detection** — Detects if helmet is worn
- **Number Plate OCR** — Generates Indian-format plates
- **Vehicle Classification** — Identifies bike, car, truck, etc.
- **Violation Tagging** — Auto-tags detected violations

## Upgrading to Real Models

Replace the simulation functions in `app.py` with:
- **YOLOv8** for object detection (helmets, vehicles)
- **EasyOCR** or **PaddleOCR** for number plate reading
- **Custom CNN** for vehicle classification

## Running

```bash
pip install -r requirements.txt
python app.py
```

Service runs on `http://localhost:5001`.
