# Crop Yield Prediction System

A full-stack application to predict crop yield using a Random Forest machine learning model trained on Indian agricultural data.

## Project Structure

- `/backend`: Flask API and Machine Learning model
- `/frontend`: React.js frontend with Chart.js visualization

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install flask pandas scikit-learn joblib flask-cors
   ```
4. Train the model (if not already trained):
   ```bash
   python train_model.py
   ```
5. Run the API:
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:5000`.

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## Features

- Predict crop yield based on soil (N, P, K, pH) and environmental factors (Temperature, Humidity, Rainfall).
- Visual comparison of predicted yield using Chart.js.
- Modern, responsive agricultural theme.
- Error handling and loading states.
