from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import ground_water_level_prediction as model

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return jsonify({})

    data = request.get_json()

    # Extract input features
    state = data['state']
    district = data['district']
    station = data['station']
    year = int(data['year'])
    month = int(data['month'])

    try:
        # Make the prediction
        prediction = model.GWL_Predictor(state, district, station, year, month)
        
        # Check if prediction is None or not a number
        if prediction is None or not isinstance(prediction, (int, float)):
            return jsonify({"error": "Invalid prediction result"}), 400
        
        return jsonify({"prediction": float(prediction)})
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)