import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sprout, CloudRain, Thermometer, Droplets, FlaskConical, MapPin, Calendar, Layers, Leaf, TrendingUp } from 'lucide-react';
import CropChart from './components/CropChart';

function App() {
  const [formData, setFormData] = useState({
    crop: 'rice',
    state: 'Assam',
    season: 'Kharif',
    area: '',
    fertilizer: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });

  const [metadata, setMetadata] = useState({
    crops: [],
    states: [],
    seasons: []
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch metadata from backend
    const fetchMetadata = async () => {
      try {
        const response = await axios.get('http://localhost:3000/metadata');
        setMetadata(response.data);
      } catch (err) {
        console.error('Error fetching metadata:', err);
        // Fallback or handle error
      }
    };
    fetchMetadata();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.post('https://yeild-new.onrender.com//predict', formData);
      setPrediction(response.data.prediction);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to predict yield. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1><Sprout size={48} style={{ verticalAlign: 'middle', marginRight: '10px' }} /> Crop Yield Predictor</h1>
        <p className="description">Powered by Machine Learning to optimize your harvest</p>
      </header>

      <div className="grid">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label><MapPin size={18} inline /> State</label>
              <select name="state" value={formData.state} onChange={handleChange} required>
                {metadata.states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
                {metadata.states.length === 0 && <option value="Assam">Assam</option>}
              </select>
            </div>

            <div className="form-group">
              <label><Leaf size={18} inline /> Crop</label>
              <select name="crop" value={formData.crop} onChange={handleChange} required>
                {metadata.crops.map(crop => (
                  <option key={crop} value={crop}>{crop.charAt(0).toUpperCase() + crop.slice(1)}</option>
                ))}
                {metadata.crops.length === 0 && <option value="rice">Rice</option>}
              </select>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0' }}>
              <div className="form-group">
                <label><Calendar size={18} inline /> Season</label>
                <select name="season" value={formData.season} onChange={handleChange} required>
                  {metadata.seasons.map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                  {metadata.seasons.length === 0 && <option value="Kharif">Kharif</option>}
                </select>
              </div>
              <div className="form-group">
                <label><Layers size={18} inline /> Area (Hectares)</label>
                <input type="number" name="area" value={formData.area} onChange={handleChange} placeholder="e.g. 100" required />
              </div>
            </div>

            <div className="form-group">
              <label><FlaskConical size={18} inline /> Fertilizer (kg)</label>
              <input type="number" step="0.1" name="fertilizer" value={formData.fertilizer} onChange={handleChange} placeholder="e.g. 50000" required />
            </div>

            <h3 style={{ margin: '1rem 0' }}><FlaskConical size={20} inline /> Soil Nutrients</h3>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label>N</label>
                <input type="number" name="nitrogen" value={formData.nitrogen} onChange={handleChange} placeholder="N" required />
              </div>
              <div className="form-group">
                <label>P</label>
                <input type="number" name="phosphorus" value={formData.phosphorus} onChange={handleChange} placeholder="P" required />
              </div>
              <div className="form-group">
                <label>K</label>
                <input type="number" name="potassium" value={formData.potassium} onChange={handleChange} placeholder="K" required />
              </div>
            </div>

            <h3 style={{ margin: '1rem 0' }}><Thermometer size={20} inline /> Environmental Factors</h3>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label>Temp (°C)</label>
                <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} placeholder="25.5" required />
              </div>
              <div className="form-group">
                <label>Humidity (%)</label>
                <input type="number" step="0.1" name="humidity" value={formData.humidity} onChange={handleChange} placeholder="80" required />
              </div>
              <div className="form-group">
                <label>pH Level</label>
                <input type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} placeholder="6.5" required />
              </div>
              <div className="form-group">
                <label><CloudRain size={18} inline /> Rainfall (mm)</label>
                <input type="number" step="0.1" name="rainfall" value={formData.rainfall} onChange={handleChange} placeholder="200" required />
              </div>
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? <div className="loading-spinner"></div> : <><TrendingUp size={20} /> Predict Yield</>}
            </button>
          </form>
        </div>

        <div className="result-side">
          {error && <div className="error-message">{error}</div>}
          
          {prediction !== null && (
            <div className="card result-card">
              <h2>Analysis Results</h2>
              <div className="prediction-value">{prediction.toFixed(2)}</div>
              <div className="prediction-unit">Predicted Production units per hectare</div>
              
              <div className="chart-container" style={{ height: 'auto', minHeight: '550px' }}>
                <CropChart 
                  prediction={prediction} 
                  cropName={formData.crop} 
                  inputStats={formData}
                  optimalStats={metadata.crop_stats?.[formData.crop.toLowerCase().trim()]}
                />
              </div>
            </div>
          )}

          {!prediction && !loading && !error && (
            <div className="card result-card" style={{ opacity: 0.6 }}>
              <TrendingUp size={64} color="#ccc" />
              <h3>Ready to Analyze</h3>
              <p>Enter your farm data to see the predicted yield and visualization.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
