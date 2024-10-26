import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import App from './app'
const indexToRender = document.getElementById('root') ?? new HTMLElement()

ReactDOM.createRoot(indexToRender).render(
  <>
    <App />
  </>
)
