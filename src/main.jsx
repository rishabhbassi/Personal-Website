import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import HeroDrafts from './components/HeroDrafts.jsx'

const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
const [hashRoute, hashAnchor] = window.location.hash
  .replace(/^#\/?/, '')
  .split('#')
const hashPreviewAnchor =
  hashAnchor ||
  (/^draft-(full|center|masthead|masthead-bleed|masthead-blend|blend)$/.test(
    hashRoute,
  )
    ? hashRoute
    : '')
const isHeroDrafts =
  pathname === '/hero-drafts' ||
  hashRoute === 'hero-drafts' ||
  (pathname === '/' && hashPreviewAnchor !== '')

if (isHeroDrafts) {
  document.documentElement.classList.add('hero-drafts-route')
  document.title = 'Hero drafts — Rishabh Bassi'
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isHeroDrafts ? <HeroDrafts /> : <App />}
  </StrictMode>,
)
