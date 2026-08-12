import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/sofia-sans-condensed'
import '@fontsource-variable/manrope'
import BreakfastApp from './BreakfastApp.jsx'
import { captureReferralAttribution } from '../attribution.js'
import '../styles.css'
import './breakfast.css'

const attribution = captureReferralAttribution()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BreakfastApp attribution={attribution} />
  </React.StrictMode>,
)
