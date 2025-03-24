import React from 'react';
import JSONLogicBuilder from './components/JSONLogicBuilder';
import './styles.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>JSONLogic Builder</h1>
        <p>Create and test JSONLogic expressions with an interactive builder</p>
      </header>
      <main className="app-content">
        <JSONLogicBuilder />
      </main>
      <footer className="app-footer">
        <p>Built with <a href="https://jsonlogic.com" target="_blank" rel="noopener noreferrer">JSONLogic</a> and React</p>
      </footer>
    </div>
  );
}

export default App;