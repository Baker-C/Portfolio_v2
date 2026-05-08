import Layout from './_Layout';
import ResumePage from './pages/ResumePage';

function App() {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const basePath = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const rootPaths = new Set([basePath || '/', `${basePath}/`]);
  const resumePaths = new Set([
    `${basePath}/resume`.replace(/\/{2,}/g, '/'),
    `${basePath}/resume/`.replace(/\/{2,}/g, '/'),
  ]);
  const portfolioPaths = new Set([
    `${basePath}/portfolio`.replace(/\/{2,}/g, '/'),
    `${basePath}/portfolio/`.replace(/\/{2,}/g, '/'),
  ]);

  if (rootPaths.has(window.location.pathname) || resumePaths.has(window.location.pathname)) {
    return <ResumePage />;
  }

  if (portfolioPaths.has(window.location.pathname)) {
    return <Layout />;
  }

  return <ResumePage />;
}

export default App;
