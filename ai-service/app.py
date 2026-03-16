from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import string
import time

app = Flask(__name__)
CORS(app)

# Simulated AI Detection Service
# In production, replace with real models:
#   - YOLOv8 for helmet/vehicle detection
#   - EasyOCR or PaddleOCR for number plate reading
#   - Custom CNN for vehicle classification

INDIAN_STATE_CODES = [
    'MH', 'DL', 'KA', 'TN', 'AP', 'TS', 'UP', 'RJ', 'GJ', 'WB',
    'MP', 'KL', 'PB', 'HR', 'BR', 'OR', 'JH', 'CG', 'UK', 'HP'
]

VEHICLE_TYPES = ['bike', 'car', 'truck', 'auto_rickshaw', 'bus', 'scooter']

VIOLATION_TYPES = [
    'no_helmet', 'signal_jump', 'wrong_parking', 'overspeeding',
    'wrong_side', 'no_seatbelt', 'overloading', 'using_phone'
]


def generate_number_plate():
    """Generate a realistic Indian number plate."""
    state = random.choice(INDIAN_STATE_CODES)
    district = str(random.randint(1, 50)).zfill(2)
    series = random.choice(string.ascii_uppercase) + random.choice(string.ascii_uppercase)
    number = str(random.randint(1000, 9999))
    return f"{state}{district}{series}{number}"


def simulate_helmet_detection():
    """Simulate helmet detection with weighted probability."""
    # 60% chance no helmet detected (since violations are being reported)
    return random.random() > 0.6


def simulate_vehicle_classification():
    """Simulate vehicle type detection."""
    weights = [0.35, 0.30, 0.10, 0.10, 0.05, 0.10]
    return random.choices(VEHICLE_TYPES, weights=weights, k=1)[0]


def simulate_violation_detection(vehicle_type):
    """Simulate detecting violations based on vehicle type."""
    violations = []

    if vehicle_type in ['bike', 'scooter']:
        if random.random() > 0.4:
            violations.append('no_helmet')
    elif vehicle_type in ['car', 'truck', 'bus']:
        if random.random() > 0.6:
            violations.append('no_seatbelt')

    # Random additional violations
    if random.random() > 0.7:
        extra = random.choice(['signal_jump', 'wrong_parking', 'overspeeding', 'wrong_side'])
        if extra not in violations:
            violations.append(extra)

    return violations if violations else [random.choice(VIOLATION_TYPES)]


@app.route('/analyze', methods=['POST'])
def analyze_image():
    """
    Analyze an uploaded image for traffic violations.
    
    In production, this would:
    1. Load the image from the provided URL/path
    2. Run YOLOv8 for object detection (helmets, vehicles)
    3. Run OCR on detected number plates
    4. Classify vehicle types
    5. Tag violations based on detections
    
    Currently returns simulated but realistic results.
    """
    # Simulate processing time
    time.sleep(random.uniform(0.5, 1.5))

    vehicle_type = simulate_vehicle_classification()
    helmet_detected = simulate_helmet_detection()
    number_plate = generate_number_plate()
    violations = simulate_violation_detection(vehicle_type)
    confidence = round(random.uniform(0.72, 0.98), 2)

    result = {
        'helmetDetected': helmet_detected,
        'numberPlate': number_plate,
        'vehicleType': vehicle_type,
        'violations': violations,
        'confidence': confidence,
        'processingTime': round(random.uniform(0.5, 1.5), 2),
        'modelVersion': '1.0.0-demo'
    }

    return jsonify(result)


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'OK',
        'service': 'SPHN AI Detection Service',
        'version': '1.0.0-demo',
        'models': {
            'helmet_detection': 'simulated',
            'plate_recognition': 'simulated',
            'vehicle_classification': 'simulated'
        }
    })


if __name__ == '__main__':
    print("=" * 50)
    print("SPHN AI Detection Service (Demo Mode)")
    print("=" * 50)
    print("Running on http://localhost:5001")
    print("Endpoints:")
    print("  POST /analyze  - Analyze image for violations")
    print("  GET  /health   - Service health check")
    print("=" * 50)
    app.run(host='0.0.0.0', port=5001, debug=True)
