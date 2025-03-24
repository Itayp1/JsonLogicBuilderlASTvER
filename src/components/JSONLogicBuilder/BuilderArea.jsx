import React, { useRef, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import OperationNode from './OperationNode';

// Default template example
const DEFAULT_TEMPLATE = {
  "or": [
    {
      ">": [
        { "+": [1, { "var": "myVariable" }] },
        5
      ]
    }
  ]
};

const BuilderArea = ({ expression, updateExpression, resetBuilder }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const jsonRef = useRef(null);

  const { setNodeRef } = useDroppable({
    id: 'builder-root',
    data: {
      acceptsOperation: true,
      isRoot: true
    }
  });

  const handleExpandAll = () => {
    setIsCollapsed(false);
    alert("All operations expanded");
  };

  const handleCollapseAll = () => {
    setIsCollapsed(true);
    alert("All operations collapsed");
  };

  const handleCopyJSON = () => {
    const jsonString = JSON.stringify(expression, null, 2);
    navigator.clipboard.writeText(jsonString);
    alert("JSON copied to clipboard");
  };

  const handleFormatJSON = () => {
    // Already formatted with 2-space indentation
    alert("JSON already formatted");
  };

  const handleAddTemplate = () => {
    updateExpression(DEFAULT_TEMPLATE);
    alert("Template added: Default template has been applied to the builder");
  };

  const handleClearBuilder = () => {
    updateExpression({});
    alert("Builder cleared: All operations have been removed from the builder");
  };

  // Find root operation (first key in the object)
  const rootOperation = Object.keys(expression)[0];
  const rootValue = expression[rootOperation];

  const isEmpty = !rootOperation;

  return (
    <div className="builder-area">
      <div className="builder-section">
        <div className="section-header">
          <h2>Builder</h2>
          <div className="builder-controls">
            <button 
              className="action-button secondary-button"
              onClick={handleAddTemplate}
              title="Add Template"
            >
              Add Template
            </button>
            <button 
              className="action-button secondary-button"
              onClick={handleClearBuilder}
              title="Clear Builder"
            >
              Clear
            </button>
            <button 
              className="action-button secondary-button"
              onClick={handleExpandAll}
              title="Expand All"
            >
              Expand All
            </button>
            <button 
              className="action-button secondary-button"
              onClick={handleCollapseAll}
              title="Collapse All"
            >
              Collapse All
            </button>
          </div>
        </div>

        <div className="builder-content">
          <div className="builder-info">
            Drag operations from the sidebar and drop them here. Nest operations by dragging inside other operations.
          </div>

          <div ref={setNodeRef} className={`builder-drop-area ${isEmpty ? 'empty-builder' : ''}`}>
            {rootOperation ? (
              <OperationNode
                operation={rootOperation}
                value={rootValue}
                path={[rootOperation]}
                updateExpression={updateExpression}
                expression={expression}
                isRoot={true}
                isCollapsedGlobal={isCollapsed}
                allowRootDelete={true}
              />
            ) : (
              <div className="empty-builder-message">
                <p>Drop an operation here to start building your logic</p>
                <button onClick={handleAddTemplate} className="action-button primary-button">
                  Add Template
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="json-output-section">
        <div className="section-header">
          <h2>JSON Output</h2>
          <div className="json-controls">
            <button 
              className="action-button secondary-button"
              onClick={handleCopyJSON}
              title="Copy JSON"
            >
              Copy
            </button>
            <button 
              className="action-button secondary-button"
              onClick={handleFormatJSON}
              title="Format JSON"
            >
              Format
            </button>
          </div>
        </div>
        <div className="json-content">
          <pre ref={jsonRef} className="json-display">
            {JSON.stringify(expression, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default BuilderArea;