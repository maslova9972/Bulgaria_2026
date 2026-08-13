import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/sofia-sans-condensed'
import '@fontsource-variable/manrope'
import BreakfastApp from './BreakfastApp.jsx'
import PrivacyPreferences from '../PrivacyPreferences.jsx'
import '../styles.css'
import './breakfast.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrivacyPreferences>
      {(attribution) => <BreakfastApp attribution={attribution} />}
    </PrivacyPreferences>
  </React.StrictMode>,
)
