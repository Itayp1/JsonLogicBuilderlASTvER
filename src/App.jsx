import React from 'react';
import JSONLogicBuilder from './components/JSONLogicBuilder';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">JSONLogic Builder</h1>
      </header>
      <JSONLogicBuilder />
    </div>
  );
}

export default App;