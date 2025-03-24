import React, { useState, useCallback, useEffect } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import OperationsSidebar from './OperationsSidebar';
import BuilderArea from './BuilderArea';
import TestArea from './TestArea';
import AddCustomOperationDialog from './AddCustomOperationDialog';
import { categories, defaultOperations } from '../../lib/operations';
import jsonLogic from 'json-logic-js';
import _ from 'lodash';

// Default template example
const DEFAULT_EXPRESSION = {
  "or": [
    {
      ">": [
        { "+": [1, { "var": "myVariable" }] },
        5
      ]
    }
  ]
};

const DEFAULT_TEST_DATA = {
  "myVariable": 10
};

const JSONLogicBuilder = () => {
  const [activeId, setActiveId] = useState(null);
  const [draggingOperation, setDraggingOperation] = useState(null);
  const [expression, setExpression] = useState(DEFAULT_EXPRESSION);
  const [testData, setTestData] = useState(JSON.stringify(DEFAULT_TEST_DATA, null, 2));
  const [testResult, setTestResult] = useState(null);
  const [isAddCustomOperationOpen, setIsAddCustomOperationOpen] = useState(false);
  const [operations, setOperations] = useState(categories);
  const [usedVariables, setUsedVariables] = useState([]);
  
  // Function to update expression with a new node
  const updateExpression = useCallback((newExpression) => {
    setExpression(newExpression);
  }, []);

  // Set up drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handle drag start
  const handleDragStart = useCallback((event) => {
    const { active } = event;
    setActiveId(active.id);

    // Find the operation being dragged
    for (const category of operations) {
      const operation = category.operations.find(op => op.id === active.id);
      if (operation) {
        setDraggingOperation(operation);
        break;
      }
    }
  }, [operations]);

  // Handle drag over
  const handleDragOver = useCallback((event) => {
    const { active, over } = event;
    
    // If we're not over anything, don't do anything
    if (!over) return;
    
    // Get the data associated with the current drag target
    const overData = over.data.current;
    
    // Only handle if the target accepts operation drops
    if (overData && overData.acceptsOperation) {
      // This will show a visual indicator
    }
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    // Reset the active drag state
    setActiveId(null);
    setDraggingOperation(null);
    
    // If we're not dragging an operation or not over a drop target, do nothing
    if (!draggingOperation || !over) return;
    
    // Get data associated with the drop target
    const overData = over.data.current;
    
    // Only handle if the target accepts operation drops
    if (overData && overData.acceptsOperation) {
      // We need to get a copy of the current expression to modify
      const newExpression = _.cloneDeep(expression);
      
      // If it's the root builder area
      if (overData.isRoot && Object.keys(newExpression).length === 0) {
        // Create a new operation at the root level
        const opId = draggingOperation.id;
        
        // Different operations get different default values
        let defaultValue;
        
        // Default values based on the operation type
        if (["and", "or"].includes(opId)) {
          defaultValue = []; // Empty array for logical operators
        } else if (["if", ">", ">=", "<", "<=", "==", "===", "!=", "!=="].includes(opId)) {
          defaultValue = ["", ""]; // Two empty strings for comparison operators
        } else if (["+", "-", "*", "/", "%"].includes(opId)) {
          defaultValue = [0, 0]; // Two zeros for arithmetic operators
        } else if (["var", "missing", "cat"].includes(opId)) {
          defaultValue = ""; // Empty string for operations that work with strings
        } else {
          defaultValue = ""; // Default empty string for other operations
        }
        
        // Set the new operation in the expression
        newExpression[opId] = defaultValue;
        
        updateExpression(newExpression);
        alert(`Operation added: Added "${opId}" operation as root`);
      } 
      // If we're dropping into a path in the expression
      else if (overData.path) {
        const path = overData.path;
        let current = newExpression;
        
        // Navigate to the parent object
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]];
        }
        
        // Get the last part of the path (the key or index)
        const lastKey = path[path.length - 1];
        
        // If the current part is an array (like in "or" or "and" operators)
        if (Array.isArray(current[lastKey])) {
          const opId = draggingOperation.id;
          
          // Get the array
          const array = current[lastKey];
          
          // Same default value logic as above
          let defaultValue;
          
          if (["and", "or"].includes(opId)) {
            defaultValue = [];
          } else if (["if", ">", ">=", "<", "<=", "==", "===", "!=", "!=="].includes(opId)) {
            defaultValue = ["", ""];
          } else if (["+", "-", "*", "/", "%"].includes(opId)) {
            defaultValue = [0, 0];
          } else if (["var", "missing", "cat"].includes(opId)) {
            defaultValue = "";
          } else {
            defaultValue = "";
          }
          
          // Add the new operation to the array
          array.push({ [opId]: defaultValue });
          
          updateExpression(newExpression);
          alert(`Operation added: Added "${opId}" operation to the expression`);
        }
      }
    }
  }, [draggingOperation, expression, updateExpression]);

  // Function to reset the builder
  const resetBuilder = useCallback(() => {
    setExpression(DEFAULT_EXPRESSION);
    alert("Builder reset: The builder has been reset to the default template");
  }, []);

  // Function to evaluate the JSONLogic expression
  const evaluateExpression = useCallback(() => {
    try {
      const parsedData = JSON.parse(testData);
      const result = jsonLogic.apply(expression, parsedData);
      setTestResult(result);

      // Extract used variables
      const extractedVars = [];
      const findVars = (expr) => {
        if (expr && typeof expr === 'object') {
          if ('var' in expr) {
            const varName = expr.var;
            if (typeof varName === 'string') {
              extractedVars.push({
                name: varName,
                value: jsonLogic.apply(expr, parsedData)
              });
            }
          }
          Object.values(expr).forEach(val => {
            if (Array.isArray(val)) {
              val.forEach(findVars);
            } else if (val && typeof val === 'object') {
              findVars(val);
            }
          });
        }
      };
      
      findVars(expression);
      setUsedVariables(extractedVars);
    } catch (error) {
      console.error('Error evaluating expression:', error);
      alert(`Evaluation failed: ${error instanceof Error ? error.message : "Invalid test data format"}`);
    }
  }, [expression, testData]);

  // Add custom operation
  const addCustomOperation = useCallback((operation) => {
    const customCategory = operations.find(category => category.name === 'Custom');
    if (customCategory) {
      const updatedOperations = operations.map(category => {
        if (category.name === 'Custom') {
          return {
            ...category,
            operations: [...category.operations, operation]
          };
        }
        return category;
      });
      setOperations(updatedOperations);

      // Add the custom operation to JSONLogic
      if (operation.implementation) {
        jsonLogic.add_operation(operation.id, operation.implementation);
      }

      setIsAddCustomOperationOpen(false);
      alert(`Custom operation added: The "${operation.id}" operation has been added successfully`);
    }
  }, [operations]);

  // Initialize pre-defined custom operations
  useEffect(() => {
    // Add afterDate and beforeDate operations
    jsonLogic.add_operation("afterDate", (dateStr, compareToStr) => {
      const date = new Date(dateStr);
      const compareTo = new Date(compareToStr);
      return date > compareTo;
    });

    jsonLogic.add_operation("beforeDate", (dateStr, compareToStr) => {
      const date = new Date(dateStr);
      const compareTo = new Date(compareToStr);
      return date < compareTo;
    });

    // Evaluate the initial expression
    evaluateExpression();
  }, []);

  return (
    <div className="jsonlogic-builder">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="builder-container">
          <OperationsSidebar 
            operations={operations} 
            onAddCustomOperation={() => setIsAddCustomOperationOpen(true)}
          />
          
          <BuilderArea 
            expression={expression} 
            updateExpression={updateExpression}
            resetBuilder={resetBuilder}
          />
          
          <TestArea 
            testData={testData}
            setTestData={setTestData}
            evaluateExpression={evaluateExpression}
            testResult={testResult}
            usedVariables={usedVariables}
          />
        </div>

        <DragOverlay>
          {activeId && draggingOperation ? (
            <div className="dragging-operation">
              <div className="operation-name">"{draggingOperation.id}"</div>
              <div className="operation-description">{draggingOperation.description}</div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AddCustomOperationDialog 
        isOpen={isAddCustomOperationOpen} 
        onClose={() => setIsAddCustomOperationOpen(false)}
        onAdd={addCustomOperation}
      />
    </div>
  );
};

export default JSONLogicBuilder;