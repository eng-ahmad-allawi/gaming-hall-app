import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RateProvider } from './context/RateContext'

// For debugging
console.log('Starting application...');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RateProvider>
      <App />
    </RateProvider>
  </React.StrictMode>
)
