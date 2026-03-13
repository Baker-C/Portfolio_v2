import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { ResponsiveThemeStyles } from './components/ResponsiveThemeStyles/ResponsiveThemeStyles';
import './index.css';
import App from './App.tsx';

// Inject Google Fonts from theme (easy to edit in theme/fonts.ts)
const fontQuery = theme.fonts.googleFonts
  .map((family) => `family=${encodeURIComponent(family)}`)
  .join('&');
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;
document.head.appendChild(link);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <ResponsiveThemeStyles />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
