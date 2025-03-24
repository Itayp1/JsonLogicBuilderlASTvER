import React from 'react';

const TestArea = ({
  testData,
  setTestData,
  evaluateExpression,
  testResult,
  usedVariables
}) => {
  return (
    <div className="test-area">
      <div className="test-header">
        <h3>Test Data</h3>
        <button
          className="evaluate-button"
          onClick={evaluateExpression}
        >
          Evaluate
        </button>
      </div>
      
      <div className="test-input">
        <textarea
          value={testData}
          onChange={(e) => setTestData(e.target.value)}
          placeholder="Enter JSON test data here..."
          className="test-data-input"
        />
      </div>
      
      <div className="variables-section">
        <h4>Variables Used in Expression:</h4>
        <div className="variables-list">
          {usedVariables.length > 0 ? (
            usedVariables.map((variable, index) => (
              <div key={index} className="variable-item">
                <span className="variable-name">{variable.name}:</span>
                <span className="variable-value">
                  {variable.value !== null
                    ? typeof variable.value === 'object'
                      ? JSON.stringify(variable.value)
                      : String(variable.value)
                    : 'undefined'}
                </span>
              </div>
            ))
          ) : (
            <p className="no-variables">No variables used in the current expression.</p>
          )}
        </div>
      </div>
      
      <div className="result-section">
        <h4>Result:</h4>
        <div className="result-display">
          {testResult !== null ? (
            typeof testResult === 'object' ? (
              <pre>{JSON.stringify(testResult, null, 2)}</pre>
            ) : (
              <span>{String(testResult)}</span>
            )
          ) : (
            <span className="no-result">No result yet. Click "Evaluate" to test your expression.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestArea;