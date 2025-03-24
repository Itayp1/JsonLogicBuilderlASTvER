import React from 'react';
import JSONLogicBuilder from './components/JSONLogicBuilder';
import './styles.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Visual JSONLogic Builder</h1>
        <p>Create and test JSONLogic expressions with an intuitive visual interface</p>
      </header>
      <main className="app-content">
        <JSONLogicBuilder />
      </main>
      <footer className="app-footer">
        <p>Built with React and json-logic-js</p>
      </footer>
    </div>
  );
}

export default App;