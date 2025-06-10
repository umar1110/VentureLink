import pickle
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load the pre-trained model
with open('rf_success_model_balanced.pkl', 'rb') as f:
    model = pickle.load(f)

# Route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    # Parse the incoming JSON request
    data = request.get_json()

    # Extract features from the incoming data (make sure this matches your model's features)
    features = np.array([data['features']])

    # Predict using the loaded model
    prediction = model.predict(features)

    # Return the result as JSON
    return jsonify({'prediction': prediction.tolist()})

# Test Route
@app.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Test route is working!'})

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=8000)


