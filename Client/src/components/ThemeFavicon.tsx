import { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeFavicon = () => {
  const { actualTheme } = useTheme();

  useEffect(() => {
    const updateFavicon = () => {
      // Remove existing favicon links
      const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
      existingFavicons.forEach(favicon => favicon.remove());

      // Create new favicon based on theme
      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/svg+xml';
      
      const svgContent = actualTheme === 'dark' 
        ? createDarkFavicon() 
        : createLightFavicon();
      
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      favicon.href = URL.createObjectURL(blob);
      
      document.head.appendChild(favicon);

      // Also create apple-touch-icon
      const appleFavicon = document.createElement('link');
      appleFavicon.rel = 'apple-touch-icon';
      appleFavicon.href = favicon.href;
      document.head.appendChild(appleFavicon);
    };

    updateFavicon();
  }, [actualTheme]);

  return null; // This component doesn't render anything
};

const createDarkFavicon = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E64373" />
      <stop offset="100%" stop-color="#644EC9" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Rounded square container with brand gradient -->
  <rect width="32" height="32" rx="8" fill="url(#brandGradient)" filter="url(#shadow)"/>
  
  <!-- Code icon path (simplified version of Lucide Code icon) -->
  <path d="M10 12L6 16L10 20M22 12L26 16L22 20M18 8L14 24" 
        stroke="white" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        fill="none"/>
</svg>
`;

const createLightFavicon = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E64373" />
      <stop offset="100%" stop-color="#644EC9" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Rounded square container with brand gradient -->
  <rect width="32" height="32" rx="8" fill="url(#brandGradient)" filter="url(#shadow)"/>
  
  <!-- Code icon path (simplified version of Lucide Code icon) -->
  <path d="M10 12L6 16L10 20M22 12L26 16L22 20M18 8L14 24" 
        stroke="white" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        fill="none"/>
</svg>
`; 