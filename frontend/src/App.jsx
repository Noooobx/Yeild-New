import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sprout, CloudRain, Thermometer, Droplets, FlaskConical, MapPin, Calendar, Layers, Leaf, TrendingUp, Info } from 'lucide-react';
import CropChart from './components/CropChart';
import Navbar from './components/Navbar';

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
    seasons: [],
    loading: true,
    error: null
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMetadata = async () => {
    setMetadata(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await axios.get('http://127.0.0.1:3000/metadata');
      console.log('Metadata fetched successfully:', response.data);
      setMetadata({
        ...response.data,
        loading: false,
        error: null
      });
    } catch (err) {
      console.error('Error fetching metadata:', err);
      setMetadata(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to load app metadata. Please check the backend.' 
      }));
    }
  };

  useEffect(() => {
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
      const response = await axios.post('http://127.0.0.1:3000/predict', formData);
      setPrediction(response.data.prediction);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to predict yield. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      
      <div className="container">
        {metadata.error && (
          <div className="error-box" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{metadata.error}</span>
            <button onClick={fetchMetadata} className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Retry</button>
          </div>
        )}

        <div className="app-grid">
          {/* Left Column: Form */}
          <div className="card">
            <h2>Provide Information</h2>
            <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>Enter your farm details to get an accurate yield prediction.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label><MapPin size={14} style={{ marginRight: '4px' }} /> State</label>
                  <select name="state" value={formData.state} onChange={handleChange} required disabled={metadata.loading}>
                    {metadata.loading ? <option>Loading...</option> : null}
                    {metadata.states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                    {!metadata.loading && metadata.states.length === 0 && <option value="Assam">Assam (Fallback)</option>}
                  </select>
                </div>

                <div className="form-group">
                  <label><Leaf size={14} style={{ marginRight: '4px' }} /> Crop</label>
                  <select name="crop" value={formData.crop} onChange={handleChange} required disabled={metadata.loading}>
                    {metadata.loading ? <option>Loading...</option> : null}
                    {metadata.crops.map(crop => (
                      <option key={crop} value={crop}>{crop.charAt(0).toUpperCase() + crop.slice(1)}</option>
                    ))}
                    {!metadata.loading && metadata.crops.length === 0 && <option value="rice">Rice (Fallback)</option>}
                  </select>
                </div>
              </div>

              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label><Calendar size={14} style={{ marginRight: '4px' }} /> Season</label>
                  <select name="season" value={formData.season} onChange={handleChange} required disabled={metadata.loading}>
                    {metadata.loading ? <option>Loading...</option> : null}
                    {metadata.seasons.map(season => (
                      <option key={season} value={season}>{season}</option>
                    ))}
                    {!metadata.loading && metadata.seasons.length === 0 && <option value="Kharif">Kharif (Fallback)</option>}
                  </select>
                </div>
                <div className="form-group">
                  <label><Layers size={14} style={{ marginRight: '4px' }} /> Area (Hectares)</label>
                  <input type="number" name="area" value={formData.area} onChange={handleChange} placeholder="e.g. 100" required />
                </div>
              </div>

              <div className="form-group">
                <label><FlaskConical size={14} style={{ marginRight: '4px' }} /> Fertilizer (kg)</label>
                <input type="number" step="0.1" name="fertilizer" value={formData.fertilizer} onChange={handleChange} placeholder="e.g. 50000" required />
              </div>

              <h3>Soil Nutrients</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div className="form-group">
                  <label>Nitrogen (N)</label>
                  <input type="number" name="nitrogen" value={formData.nitrogen} onChange={handleChange} placeholder="N" required />
                </div>
                <div className="form-group">
                  <label>Phosphorous (P)</label>
                  <input type="number" name="phosphorus" value={formData.phosphorus} onChange={handleChange} placeholder="P" required />
                </div>
                <div className="form-group">
                  <label>Potassium (K)</label>
                  <input type="number" name="potassium" value={formData.potassium} onChange={handleChange} placeholder="K" required />
                </div>
              </div>

              <h3>Environmental Factors</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div className="form-group">
                  <label><Thermometer size={14} style={{ marginRight: '4px' }} /> Temp (°C)</label>
                  <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} placeholder="25.5" required />
                </div>
                <div className="form-group">
                  <label><Droplets size={14} style={{ marginRight: '4px' }} /> Humidity (%)</label>
                  <input type="number" step="0.1" name="humidity" value={formData.humidity} onChange={handleChange} placeholder="80" required />
                </div>
                <div className="form-group">
                  <label>pH Level</label>
                  <input type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} placeholder="6.5" required />
                </div>
                <div className="form-group">
                  <label><CloudRain size={14} style={{ marginRight: '4px' }} /> Rainfall (mm)</label>
                  <input type="number" step="0.1" name="rainfall" value={formData.rainfall} onChange={handleChange} placeholder="200" required />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1.5rem' }}>
                {loading ? <div className="loading-spinner"></div> : <><TrendingUp size={20} /> Analyze and Predict</>}
              </button>
            </form>
          </div>

          {/* Right Column: Results or Info */}
          <div className="info-sidebar">
            {error && <div className="error-box">{error}</div>}
            
            {prediction !== null ? (
              <div className="card">
                <h2>Analysis Results</h2>
                <div className="result-display">
                  <div className="prediction-box">
                    <div className="prediction-val">{prediction.toFixed(2)}</div>
                    <div className="prediction-meta">Predicted Yield (Units/Hectare)</div>
                  </div>
                  
                  <div className="chart-container" style={{ height: 'auto', minHeight: '400px' }}>
                    <CropChart 
                      prediction={prediction} 
                      cropName={formData.crop} 
                      inputStats={formData}
                      optimalStats={metadata.crop_stats?.[formData.crop.toLowerCase().trim()]}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="card">
                <h2>How to Use FarmDirect?</h2>
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div className="info-item">
                    <div className="info-icon"><Layers size={24} /></div>
                    <div className="info-content">
                      <h4>Input Soil Data</h4>
                      <p>Enter your soil's Nitrogen, Potassium, and Phosphorous levels along with climate conditions.</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon"><Leaf size={24} /></div>
                    <div className="info-content">
                      <h4>Specify Crop & State</h4>
                      <p>Select the type of crop you are growing and your location for better accuracy.</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon"><TrendingUp size={24} /></div>
                    <div className="info-content">
                      <h4>Get Prediction</h4>
                      <p>Click "Analyze" to see predicted yield and compare soil stats with optimal levels.</p>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#f0fdf4', borderRadius: '1rem', border: '1px solid #dcfce7' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#166534', fontStyle: 'italic' }}>
                    "Optimizing your farm data leads to higher yields and more sustainable agricultural practices."
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
