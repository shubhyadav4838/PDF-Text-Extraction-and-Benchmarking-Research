import React from 'react';
import Dashboard from './pages/Dashboard';
// Ensure Tailwind directives are included in index.css and it is imported in main.jsx
// import './App.css'; 

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Dashboard />
    </div>
  );
}

export default App;