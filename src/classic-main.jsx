import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/cormorant-garamond'
import '@fontsource-variable/manrope'
import ClassicApp from './ClassicApp.jsx'
import './classic.css'

createRoot(document.getElementById('classic-root')).render(
  <React.StrictMode>
    <ClassicApp />
  </React.StrictMode>,
)
