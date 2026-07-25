import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CatalogProvider } from './context/CatalogProvider';
import RootRedirect from './pages/RootRedirect';
import DeityPage from './pages/DeityPage';
import BhajanPage from './pages/BhajanPage';
import NoPage from './pages/NoPage';

// Routes are relative to the deployment subpath. In the GitHub Pages build,
// process.env.PUBLIC_URL is "/bhajan-pedia"; in dev it's "" (served at root).
function App() {
  return (
    <CatalogProvider>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/:deitySlug" element={<DeityPage />} />
          <Route path="/:deitySlug/:bhajanRef" element={<BhajanPage />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </CatalogProvider>
  );
}

export default App;
