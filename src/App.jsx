import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProjectsPage from './pages/ProjectsPage';
import config from './config';

const App = () => {
  // Apply global styles based on config
  React.useEffect(() => {
    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty('--primary-color', config.colors.primary);
    document.documentElement.style.setProperty('--secondary-color', config.colors.secondary);
    document.documentElement.style.setProperty('--accent-color', config.colors.accent);
    document.documentElement.style.setProperty('--text-color', config.colors.text);
    document.documentElement.style.setProperty('--bg-color', config.colors.background);
    
    // Update document title
    document.title = `${config.title} - ${config.organization}`;
    
    // Add favicon
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = config.favicon || '/favicon.ico';
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;