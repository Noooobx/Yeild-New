from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load model and encoders
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'models')
model = None
le_crop = None
le_state = None
le_season = None
features = None

def load_resources():
    global model, le_crop, le_state, le_season, features
    try:
        model = joblib.load(os.path.join(MODEL_DIR, 'crop_yield_model.pkl'))
        le_crop = joblib.load(os.path.join(MODEL_DIR, 'le_crop.pkl'))
        le_state = joblib.load(os.path.join(MODEL_DIR, 'le_state.pkl'))
        le_season = joblib.load(os.path.join(MODEL_DIR, 'le_season.pkl'))
        features = joblib.load(os.path.join(MODEL_DIR, 'features.pkl'))
        print("Model and resources loaded successfully.")
    except Exception as e:
        print(f"Error loading model resources: {e}")

@app.route('/')
def home():
    return jsonify({'status': 'ok', 'message': 'Crop Yield Prediction API is running'})

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        load_resources()
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500

    try:
        data = request.json
        
        # Prepare input data for prediction
        input_data = pd.DataFrame([{
            'Crop': data['crop'].lower().strip(),
            'State': data['state'].strip(),
            'Season': data['season'].strip(),
            'Area': float(data['area']),
            'N': float(data['nitrogen']),
            'P': float(data['phosphorus']),
            'K': float(data['potassium']),
            'temperature': float(data['temperature']),
            'humidity': float(data['humidity']),
            'ph': float(data['ph']),
            'rainfall': float(data['rainfall']),
            'Fertilizer': float(data['fertilizer'])
        }])

        # Handle label encoding
        try:
            input_data['Crop'] = le_crop.transform(input_data['Crop'])
            input_data['State'] = le_state.transform(input_data['State'])
            input_data['Season'] = le_season.transform(input_data['Season'])
        except ValueError as e:
            return jsonify({'error': f"Invalid categorical input: {str(e)}"}), 400

        # Predict
        prediction = model.predict(input_data[features])
        
        return jsonify({
            'prediction': prediction[0],
            'unit': 'Yield (Production/Area)'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/metadata', methods=['GET'])
def metadata():
    if le_crop is None:
        load_resources()
    
    # Load recommendation values for comparison
    df_rec = pd.read_csv(os.path.join(BASE_DIR, '..', 'Crop_recommendation.csv'))
    df_rec['label'] = df_rec['label'].str.lower().str.strip()
    
    crop_stats = df_rec.groupby('label').agg({
        'N': 'mean',
        'P': 'mean',
        'K': 'mean',
        'ph': 'mean'
    }).to_dict('index')

    return jsonify({
        'crops': sorted(le_crop.classes_.tolist()),
        'states': sorted(le_state.classes_.tolist()),
        'seasons': sorted(le_season.classes_.tolist()),
        'crop_stats': crop_stats
    })

if __name__ == '__main__':
    load_resources()
    port = int(os.environ.get('PORT', 3000))
    app.run(debug=False, host='0.0.0.0', port=port)
