from flask import Flask, request, jsonify
from flask_cors import CORS
import GWL_Predictor as model

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    # Validate input
    if not data or 'lat' not in data or 'lon' not in data or 'state' not in data:
        return jsonify({"error": "Missing required parameters"}), 400
    
    try:
        latitude = float(data['lat'])
        longitude = float(data['lon'])
        state = str(data['state'])
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid parameter format"}), 400
    
    try:
        depth, category = model.predict_groundwater_level(latitude, longitude, state)
        return jsonify({
            "prediction": {
                "value": depth,
                "category": category,
                "unit": "meters below ground",
                "state": state
            }
        })
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)