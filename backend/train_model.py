import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Load datasets
def train():
    print("Loading datasets...")
    # Dataset 1: Crop Yield in Indian States
    # Columns: Crop,Crop_Year,Season,State,Area,Production,Annual_Rainfall,Fertilizer,Pesticide,Yield
    df_yield = pd.read_csv('../crop_yield.csv')
    
    # Dataset 2: Crop Recommendation
    # Columns: N,P,K,temperature,humidity,ph,rainfall,label
    df_rec = pd.read_csv('../Crop_recommendation.csv')

    print("Cleaning and Preprocessing...")
    # Normalize crop names and other categorical columns
    df_yield['Crop'] = df_yield['Crop'].str.lower().str.strip()
    df_yield['State'] = df_yield['State'].str.strip()
    df_yield['Season'] = df_yield['Season'].str.strip()
    
    df_rec['label'] = df_rec['label'].str.lower().str.strip()

    # Get common crops
    common_crops = list(set(df_yield['Crop']) & set(df_rec['label']))
    print(f"Common crops found: {common_crops}")

    # For each crop, we calculate average soil/weather parameters from df_rec
    crop_stats = df_rec.groupby('label').agg({
        'N': 'mean',
        'P': 'mean',
        'K': 'mean',
        'temperature': 'mean',
        'humidity': 'mean',
        'ph': 'mean',
        'rainfall': 'mean'
    }).reset_index()

    # Merge stats into df_yield
    df_final = pd.merge(df_yield, crop_stats, left_on='Crop', right_on='label')
    
    # Drop rows with missing values
    df_final.dropna(inplace=True)

    # Features: Crop, State, Season, Area, N, P, K, temperature, humidity, ph, rainfall
    # Target: Yield
    
    features = ['Crop', 'State', 'Season', 'Area', 'N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall', 'Fertilizer']
    target = 'Yield'

    X = df_final[features]
    y = df_final[target]

    # Label Encoding for categorical features
    le_crop = LabelEncoder()
    le_state = LabelEncoder()
    le_season = LabelEncoder()

    X['Crop'] = le_crop.fit_transform(X['Crop'])
    X['State'] = le_state.fit_transform(X['State'])
    X['Season'] = le_season.fit_transform(X['Season'])

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Random Forest model...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    print(f"MAE: {mean_absolute_error(y_test, y_pred)}")
    print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred))}")
    print(f"R2 Score: {r2_score(y_test, y_pred)}")

    # Save model and encoders
    if not os.path.exists('models'):
        os.makedirs('models')
    
    joblib.dump(model, 'models/crop_yield_model.pkl')
    joblib.dump(le_crop, 'models/le_crop.pkl')
    joblib.dump(le_state, 'models/le_state.pkl')
    joblib.dump(le_season, 'models/le_season.pkl')
    
    # Save feature names for reference
    joblib.dump(features, 'models/features.pkl')

    print("Model and encoders saved to models/")

if __name__ == "__main__":
    train()
