import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'leaflet/dist/leaflet.css'
import './i18n'

if (import.meta.env.DEV) {
  Promise.all([
    import('react'),
    import('react-dom'),
    import('@axe-core/react'),
  ]).then(([React, ReactDOM, axe]) => {
    axe.default(React, ReactDOM, 1000, {
      runOnly: {
        type: 'tags',
        values: ['wcag2aaa', 'wcag2aa', 'wcag2a', 'best-practice'],
      },
    })
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
