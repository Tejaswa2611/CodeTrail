import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './utils/debugProduction'

// Environment variables check
console.log('🔍 Environment Check:');
console.log('- API URL:', import.meta.env.VITE_API_URL);
console.log('- Mode:', import.meta.env.MODE);
console.log('- Dev Mode:', import.meta.env.DEV);
console.log('- Prod Mode:', import.meta.env.PROD);

createRoot(document.getElementById("root")!).render(<App />);
