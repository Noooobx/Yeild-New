import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import os

# Set plotting style
plt.style.use('ggplot')
sns.set_palette("viridis")

def generate_plots():
    print("Loading and preprocessing data...")
    df_yield = pd.read_csv('../crop_yield.csv')
    df_rec = pd.read_csv('../Crop_recommendation.csv')

    df_yield['Crop'] = df_yield['Crop'].str.lower().str.strip()
    df_yield['State'] = df_yield['State'].str.strip()
    df_yield['Season'] = df_yield['Season'].str.strip()
    df_rec['label'] = df_rec['label'].str.lower().str.strip()

    crop_stats = df_rec.groupby('label').agg({
        'N': 'mean', 'P': 'mean', 'K': 'mean',
        'temperature': 'mean', 'humidity': 'mean',
        'ph': 'mean', 'rainfall': 'mean'
    }).reset_index()

    df_final = pd.merge(df_yield, crop_stats, left_on='Crop', right_on='label')
    df_final.dropna(inplace=True)

    features = ['Crop', 'State', 'Season', 'Area', 'N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall', 'Fertilizer']
    target = 'Yield'

    X = df_final[features]
    y = df_final[target]

    # Label Encoding
    le_crop = LabelEncoder()
    le_state = LabelEncoder()
    le_season = LabelEncoder()

    X = X.copy()
    X['Crop'] = le_crop.fit_transform(X['Crop'])
    X['State'] = le_state.fit_transform(X['State'])
    X['Season'] = le_season.fit_transform(X['Season'])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training model...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Predictions for plotting
    y_pred = model.predict(X_test)

    # Create directory for plots within artifacts
    plot_dir = '/home/nandakishor/.gemini/antigravity/brain/d93490ed-5bb8-4814-a787-fbb79b78df24/plots'
    if not os.path.exists(plot_dir):
        os.makedirs(plot_dir)

    # 1. Predicted vs Actual Scatter Plot
    print("Generating Predicted vs Actual Scatter Plot...")
    plt.figure(figsize=(10, 6))
    plt.scatter(y_test, y_pred, alpha=0.5, color='teal')
    plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
    plt.xlabel('Actual Yield')
    plt.ylabel('Predicted Yield')
    plt.title('Predicted vs Actual Crop Yield')
    plt.tight_layout()
    plt.savefig(os.path.join(plot_dir, 'predicted_vs_actual.png'), dpi=300)
    plt.close()

    # 2. Feature Importance Graph
    print("Generating Feature Importance Graph...")
    importances = model.feature_importances_
    plt.figure(figsize=(12, 8))
    feat_importances = pd.Series(importances, index=features)
    feat_importances.sort_values().plot(kind='barh', color='mediumseagreen')
    plt.xlabel('Importance Score')
    plt.title('Feature Importance for Crop Yield Prediction')
    plt.tight_layout()
    plt.savefig(os.path.join(plot_dir, 'feature_importance.png'), dpi=300)
    plt.close()

    # 3. Error Distribution Plot (Residuals)
    print("Generating Error Distribution Plot...")
    residuals = y_test - y_pred
    plt.figure(figsize=(10, 6))
    sns.histplot(residuals, kde=True, color='indianred')
    plt.axvline(x=0, color='black', linestyle='--')
    plt.xlabel('Residual (Actual - Predicted)')
    plt.title('Error Distribution / Residuals')
    plt.tight_layout()
    plt.savefig(os.path.join(plot_dir, 'error_distribution.png'), dpi=300)
    plt.close()

    print(f"All plots saved to: {plot_dir}")

if __name__ == "__main__":
    generate_plots()
