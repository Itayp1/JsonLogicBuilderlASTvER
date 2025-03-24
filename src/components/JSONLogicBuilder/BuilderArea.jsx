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
    alert("Default template has been applied to the builder");
  };

  const handleClearBuilder = () => {
    updateExpression({});
    alert("All operations have been removed from the builder");
  };

  // Find root operation (first key in the object)
  const rootOperation = Object.keys(expression)[0];
  const rootValue = expression[rootOperation];

  const isEmpty = !rootOperation;

  return (
    <div className="builder-area">
      <div className="section-header">
        <h2>Builder</h2>
        <div className="builder-controls">
          <button onClick={handleAddTemplate} className="action-button secondary-button" title="Add Template">
            Add Template
          </button>
          <button onClick={handleClearBuilder} className="action-button secondary-button" title="Clear Builder">
            Clear
          </button>
          <button onClick={handleExpandAll} className="action-button secondary-button" title="Expand All">
            Expand All
          </button>
          <button onClick={handleCollapseAll} className="action-button secondary-button" title="Collapse All">
            Collapse All
          </button>
        </div>
      </div>

      <div className="builder-instruction">
        Drag operations from the sidebar and drop them here. Nest operations by dragging inside other operations.
      </div>

      <div 
        ref={setNodeRef} 
        className={isEmpty ? 'dropzone' : 'operation-container'}
      >
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
          <div className="empty-builder">
            <p>Drop an operation here to start building your logic</p>
            <button onClick={handleAddTemplate} className="action-button primary-button">
              Add Template
            </button>
          </div>
        )}
      </div>

      <div className="json-output">
        <div className="json-header">
          <h3>JSON Output</h3>
          <div className="json-controls">
            <button onClick={handleCopyJSON} className="action-button secondary-button" title="Copy JSON">
              Copy
            </button>
            <button onClick={handleFormatJSON} className="action-button secondary-button" title="Format JSON">
              Format
            </button>
          </div>
        </div>
        <pre ref={jsonRef} className="json-code">
          {JSON.stringify(expression, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default BuilderArea;