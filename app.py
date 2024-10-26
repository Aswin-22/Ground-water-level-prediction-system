from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import GWL_Predictor as model  # Import your model for groundwater level prediction

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return jsonify({})

    data = request.get_json()  # For debugging purposes

    # Extract latitude and longitude and convert to float
    try:
        latitude = float(data['lat'])
        longitude = float(data['lon'])
    except ValueError as ve:
        return jsonify({"error": "Invalid latitude or longitude format"}), 400

    try:
        # Make the prediction using the second model
        prediction = model.predict_groundwater_Level(latitude, longitude)


        # Ensure prediction is a tuple with a float and a string
        if isinstance(prediction, tuple) and len(prediction) == 2:
            return jsonify({
                "prediction": {
                    "value": prediction[0]  
                }
            })
        else:
            return jsonify({"error": "Invalid prediction format"}), 500
    except Exception as e:
        print(f"Error in prediction with latitude/longitude: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Add CORS headers to every response
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == '__main__':
    app.run(debug=True)
