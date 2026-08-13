import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/sofia-sans-condensed'
import '@fontsource-variable/manrope'
import LegalApp from './LegalApp.jsx'
import '../styles.css'
import './legal.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LegalApp />
  </React.StrictMode>,
)
