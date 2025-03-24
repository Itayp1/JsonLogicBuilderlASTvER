import React from 'react';

const TestArea = ({ 
  testData, 
  setTestData, 
  evaluateExpression, 
  testResult, 
  usedVariables 
}) => {
  const handleFormatTestData = () => {
    try {
      const parsed = JSON.parse(testData);
      setTestData(JSON.stringify(parsed, null, 2));
      alert("Test data formatted");
    } catch (error) {
      alert("Invalid JSON: The test data is not valid JSON");
    }
  };
  
  const handleTestDataChange = (e) => {
    setTestData(e.target.value);
  };

  return (
    <div className="test-area">
      <div className="test-data-section">
        <div className="section-header">
          <h2>Test Data</h2>
          <button 
            className="action-button secondary-button"
            onClick={handleFormatTestData}
            title="Format JSON"
          >
            Format
          </button>
        </div>
        <div className="test-data-content">
          <textarea 
            className="test-data-textarea"
            value={testData}
            onChange={handleTestDataChange}
          />
          <div className="test-actions">
            <button 
              className="action-button primary-button"
              onClick={evaluateExpression}
            >
              Evaluate Logic
            </button>
          </div>
        </div>
      </div>

      <div className="result-section">
        <h2 className="section-header">Result</h2>
        <div className="result-content">
          <div className="result-display">
            <div className="result-label">Evaluation result:</div>
            <div className="result-value">
              {testResult === true && (
                <span className="result-true">true</span>
              )}
              {testResult === false && (
                <span className="result-false">false</span>
              )}
              {testResult !== true && testResult !== false && (
                <span className="result-other">
                  {testResult === null ? "null" : 
                   testResult === undefined ? "undefined" : 
                   typeof testResult === 'object' ? JSON.stringify(testResult) : 
                   String(testResult)}
                </span>
              )}
            </div>
            <div className="result-explanation">
              {testResult === true && "Logic evaluates to true with the current test data"}
              {testResult === false && "Logic evaluates to false with the current test data"}
              {testResult !== true && testResult !== false && 
               `Logic evaluates to ${testResult === null ? "null" : 
                                    testResult === undefined ? "undefined" : 
                                    typeof testResult === 'object' ? "object" : 
                                    typeof testResult}`}
            </div>
          </div>
          
          {usedVariables.length > 0 && (
            <div className="variables-used">
              <div className="variables-header">Variables Used:</div>
              <div className="variables-list">
                {usedVariables.map((variable, index) => (
                  <div key={index} className="variable-badge">
                    {variable.name}
                    <span className="variable-value">= {JSON.stringify(variable.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="documentation-section">
        <h2 className="section-header">Help & Documentation</h2>
        <div className="documentation-content">
          <a 
            href="https://jsonlogic.com/operations.html"
            target="_blank"
            rel="noopener noreferrer"
            className="documentation-link"
          >
            JSONLogic Documentation - View all available operations
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestArea;