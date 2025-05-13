import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createClient } from '@supabase/supabase-js'
import { Database } from './lib/database.types'

// Initialize Supabase client
export const supabase = createClient<Database>(
  'https://khgjxfoprydjwqzpkxue.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoZ2p4Zm9wcnlkandxenBreHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NTMwMTEsImV4cCI6MjA2MTEyOTAxMX0.Wd9JpPXkMUMoHjEBYTUgADDzOHLOUj_Nx_hLMWTYyQE'
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
