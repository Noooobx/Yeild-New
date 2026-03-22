import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CropChart = ({ prediction, cropName, inputStats, optimalStats }) => {
  const yieldData = {
    labels: [cropName, 'Average'],
    datasets: [
      {
        label: 'Predicted Yield (Production/Area)',
        data: [prediction, prediction * 0.8],
        backgroundColor: ['rgba(46, 125, 50, 0.6)', 'rgba(129, 199, 132, 0.6)'],
        borderColor: ['rgba(46, 125, 50, 1)', 'rgba(129, 199, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const nutrientData = optimalStats ? {
    labels: ['Nitrogen (N)', 'Phosphorus (P)', 'Potassium (K)', 'pH Level'],
    datasets: [
      {
        label: 'Your Input',
        data: [inputStats.nitrogen, inputStats.phosphorus, inputStats.potassium, inputStats.ph],
        backgroundColor: 'rgba(255, 179, 0, 0.6)',
      },
      {
        label: 'Optimal Level',
        data: [optimalStats.N, optimalStats.P, optimalStats.K, optimalStats.ph],
        backgroundColor: 'rgba(46, 125, 50, 0.6)',
      }
    ]
  } : null;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: '250px', marginBottom: '2rem' }}>
        <Bar 
          data={yieldData} 
          options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: { title: { display: true, text: 'Yield Comparison' } }
          }} 
        />
      </div>
      {nutrientData && (
        <div style={{ height: '250px' }}>
          <Bar 
            data={nutrientData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: { title: { display: true, text: 'Nutrient Analysis' } }
            }} 
          />
        </div>
      )}
    </div>
  );
};

export default CropChart;
