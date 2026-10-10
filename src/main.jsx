import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { LibraryProvider } from './hooks/useLibrary.jsx'
import './index.css'

// HashRouter works on any static host (GitHub Pages etc.) without server config.
createRoot(document.getElementById('root')).render(
  <HashRouter><LibraryProvider><App /></LibraryProvider></HashRouter>
)
