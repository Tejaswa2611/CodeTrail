// Production debugging helper
export const debugProduction = () => {
  if (import.meta.env.PROD) {
    console.log('🔍 Production Debug Info:');
    console.log('- Current URL:', window.location.href);
    console.log('- API URL:', import.meta.env.VITE_API_URL);
    console.log('- User Agent:', navigator.userAgent);
    console.log('- Cookies:', document.cookie);
    console.log('- Local Storage Keys:', Object.keys(localStorage));
    console.log('- Session Storage Keys:', Object.keys(sessionStorage));
  }
};

// Call this when the app starts
if (import.meta.env.PROD) {
  debugProduction();
}
