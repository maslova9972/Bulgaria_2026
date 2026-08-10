import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/sofia-sans-condensed'
import '@fontsource-variable/manrope'
import App from './App.jsx'
import { captureReferralAttribution } from './attribution.js'
import './styles.css'

const attribution = captureReferralAttribution()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App attribution={attribution} />
  </React.StrictMode>,
)
