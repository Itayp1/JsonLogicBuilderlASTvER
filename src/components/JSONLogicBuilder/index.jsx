import React, { useState, useCallback, useEffect } from 'react';
import OperationsSidebar from './OperationsSidebar';
import BuilderArea from './BuilderArea';
import TestArea from './TestArea';
import AddCustomOperationDialog from './AddCustomOperationDialog';
import { categories, defaultOperations } from '../../lib/operations';
import { jsonLogic, extractVariables } from '../../lib/jsonLogic';
import { DndContext, DragOverlay } from '@dnd-kit/core';

const JSONLogicBuilder = () => {
  // State for the current JSONLogic expression
  const [expression, setExpression] = useState({ "==": [1, 1] });
  
  // State for custom operations
  const [operations, setOperations] = useState(categories);
  
  // State for the test data and results
  const [testData, setTestData] = useState('{\n  "user": {\n    "name": "John",\n    "age": 30\n  },\n  "items": [1, 2, 3, 4]\n}');
  const [testResult, setTestResult] = useState(null);
  
  // State for UI controls
  const [isAddCustomOperationOpen, setIsAddCustomOperationOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // State for drag and drop
  const [activeDragId, setActiveDragId] = useState(null);
  const [activeDragData, setActiveDragData] = useState(null);
  
  // Extract variables used in the expression
  const usedVariables = extractVariables(expression).map(name => {
    try {
      const data = JSON.parse(testData);
      return { name, value: jsonLogic.apply({ "var": name }, data) };
    } catch (e) {
      return { name, value: null };
    }
  });

  // Function to update the JSONLogic expression
  const updateExpression = useCallback((newExpression) => {
    setExpression(newExpression);
  }, []);

  // Function to reset the builder
  const resetBuilder = useCallback(() => {
    setExpression({ "==": [1, 1] });
  }, []);

  // Function to add a template expression
  const addTemplate = useCallback(() => {
    setExpression({
      "or": [
        { "==": [{ "var": "user.age" }, 30] },
        { ">=": [{ "var": "items.length" }, 3] }
      ]
    });
  }, []);

  // Function to evaluate the expression with the test data
  const evaluateExpression = useCallback(() => {
    try {
      const data = JSON.parse(testData);
      const result = jsonLogic.apply(expression, data);
      setTestResult(result);
    } catch (e) {
      setTestResult(`Error: ${e.message}`);
    }
  }, [expression, testData]);

  // Effect to evaluate expression when it changes
  useEffect(() => {
    evaluateExpression();
  }, [expression, evaluateExpression]);

  // Function to add a custom operation
  const addCustomOperation = useCallback((operation) => {
    // First, check if the operation already exists
    const operationExists = defaultOperations.some(op => op.id === operation.id);
    
    if (operationExists) {
      alert(`Operation with ID "${operation.id}" already exists.`);
      return;
    }
    
    // Add the operation to the appropriate category
    const newOperations = [...operations];
    const categoryIndex = newOperations.findIndex(cat => cat.name.toLowerCase() === operation.category);
    
    if (categoryIndex !== -1) {
      newOperations[categoryIndex].operations.push(operation);
    } else {
      // Create a new category if it doesn't exist
      newOperations.push({
        name: operation.category.charAt(0).toUpperCase() + operation.category.slice(1),
        operations: [operation]
      });
    }
    
    // Add the operation implementation to jsonLogic
    if (operation.implementation) {
      jsonLogic.add_operation(operation.id, operation.implementation);
    }
    
    setOperations(newOperations);
    setIsAddCustomOperationOpen(false);
  }, [operations]);

  // Handle drag start
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveDragId(active.id);
    setActiveDragData(active.data.current);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setActiveDragId(null);
    setActiveDragData(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="json-logic-builder">
        <div className="builder-sidebar">
          <OperationsSidebar
            operations={operations}
            onAddCustomOperation={() => setIsAddCustomOperationOpen(true)}
          />
        </div>
        
        <div className="builder-main">
          <div className="builder-header">
            <h2>JSONLogic Expression Builder</h2>
            <div className="builder-controls">
              <button onClick={resetBuilder}>Reset</button>
              <button onClick={addTemplate}>Add Template</button>
              <button onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? 'Expand All' : 'Collapse All'}
              </button>
            </div>
          </div>
          
          <div className="builder-content">
            <BuilderArea
              expression={expression}
              updateExpression={updateExpression}
              resetBuilder={resetBuilder}
              isCollapsedGlobal={isCollapsed}
            />
            
            <TestArea
              testData={testData}
              setTestData={setTestData}
              evaluateExpression={evaluateExpression}
              testResult={testResult}
              usedVariables={usedVariables}
            />
          </div>
        </div>
        
        <DragOverlay>
          {activeDragId ? (
            <div className="dragging-operation">
              {activeDragData?.operation?.id || 'Operation'}
            </div>
          ) : null}
        </DragOverlay>
        
        <AddCustomOperationDialog
          isOpen={isAddCustomOperationOpen}
          onClose={() => setIsAddCustomOperationOpen(false)}
          onAdd={addCustomOperation}
        />
      </div>
    </DndContext>
  );
};

export default JSONLogicBuilder;