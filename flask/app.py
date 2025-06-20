import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
import joblib
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:4000", "http://localhost:5173"]}})

# Load the newly saved model
# Get the directory where the current script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Build the full path to the model file
model_path = os.path.join(BASE_DIR, 'rf_success_model_balanced.pkl')

# Load the model
model = joblib.load(model_path)
@app.route('/predict', methods=['POST'])
def predict():
    # Parse the incoming JSON request
    data = request.get_json()

    # Extract features from the request
    features = data.get('features')
    
    if not features:
        return jsonify({'error': 'No features provided in the request body'}), 400

    # Extract column names from the keys of the 'features' dictionary
    column_names = list(features.keys())

    # Convert the features dictionary to a DataFrame
    features_df = pd.DataFrame([features], columns=column_names)

    # Ensure the number of features is correct (match with training data columns)
    expected_feature_count = len(column_names)  # This should match the number of features the model was trained on
    if features_df.shape[1] != expected_feature_count:
        return jsonify({'error': f'Expected {expected_feature_count} features, but got {features_df.shape[1]}'}), 400

    # Predict probabilities using the model
    prob_success = model.predict_proba(features_df)[:, 1]  # Get the probability for class 1 (success)
    pred_class = int(prob_success >= 0.4)  # Set threshold for success (e.g., 0.4)

    # Return the result as JSON with probability and predicted class
    return jsonify({
        'prediction': pred_class,
        'success_probability': prob_success.tolist()
    })

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=8000)
