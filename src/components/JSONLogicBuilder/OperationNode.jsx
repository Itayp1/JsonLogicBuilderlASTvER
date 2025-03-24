import React, { useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import _ from 'lodash';

const OperationNode = ({
  operation,
  value,
  path,
  updateExpression,
  expression,
  isRoot = false,
  parentIndex,
  onRemove,
  isCollapsedGlobal = false,
  allowRootDelete = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Determine if the value is a variable reference (has format {var: "name"})
  const isVarReference = typeof value === 'object' && value !== null && 
                       !Array.isArray(value) && 'var' in value;
                       
  const [valueType, setValueType] = useState(
    isVarReference ? 'variable' : 'text'
  );
  
  useEffect(() => {
    setIsCollapsed(isCollapsedGlobal);
  }, [isCollapsedGlobal]);

  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${path.join('-')}`,
    data: {
      path,
      operation,
      acceptsOperation: true,
    },
  });

  const isArray = Array.isArray(value);
  const isOperator = typeof operation === 'string' && !['var', 'missing', 'missing_some'].includes(operation);
  const isSimplePrimitive = !isArray && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean');
  
  const handleRemove = () => {
    if (isRoot && !allowRootDelete) {
      alert("The root operation cannot be removed. Use the reset button instead.");
      return;
    }
    
    if (onRemove) {
      onRemove();
    } else if (isRoot && allowRootDelete) {
      // Clear the entire expression
      updateExpression({});
      alert("All operations have been cleared from the builder");
    }
  };
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const updateValueAtPath = (newValue) => {
    const newExpression = _.cloneDeep(expression);
    let current = newExpression;
    
    // Navigate to the parent object that contains our target
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    // Update the value at the last path segment
    current[path[path.length - 1]] = newValue;
    updateExpression(newExpression);
  };
  
  const handleValueChange = (e, valueIndex) => {
    const inputValue = e.target.value;
    
    // Parse the input value to the appropriate type
    const parseValue = (input) => {
      // Try to convert to appropriate type
      if (!isNaN(Number(input))) {
        return Number(input);
      } else if (input === 'true') {
        return true;
      } else if (input === 'false') {
        return false;
      }
      return input;
    };
    
    // If this is a simple value (not an array)
    if (!isArray && valueIndex === undefined) {
      const parsedValue = parseValue(inputValue);
      updateValueAtPath(parsedValue);
    } 
    // If this is an array element
    else if (isArray && valueIndex !== undefined) {
      const newArray = [...value];
      const parsedValue = parseValue(inputValue);
      newArray[valueIndex] = parsedValue;
      updateValueAtPath(newArray);
    }
  };
  
  const handleRemoveArrayItem = (index) => {
    if (isArray) {
      const newArray = [...value];
      newArray.splice(index, 1);
      updateValueAtPath(newArray);
    }
  };
  
  const handleAddToArray = () => {
    if (isArray) {
      const newArray = [...value, ""];
      updateValueAtPath(newArray);
    }
  };

  // Render different content based on the type of value
  const renderContent = () => {
    // Special handling for var operation
    if (operation === 'var') {
      return (
        <div className="node-child-content">
          <div className="input-container">
            <input 
              type="text" 
              value={typeof value === 'string' ? value : JSON.stringify(value)}
              onChange={(e) => handleValueChange(e)} 
              placeholder="Variable name"
              className="input-field"
            />
            {!isRoot && (
              <button 
                onClick={handleRemove} 
                className="action-button secondary-button"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      );
    }
    
    // If value is a simple primitive, render input with toggle for variable
    if (isSimplePrimitive) {
      return (
        <div className="value-container">
          <div className="type-toggle">
            <button 
              className={`toggle-option ${valueType === 'text' ? 'toggle-option-active' : ''}`}
              onClick={() => {
                setValueType('text');
                if (isVarReference) {
                  // Convert from variable reference back to plain text
                  const varObj = value;
                  const varName = varObj.var || '';
                  updateValueAtPath(varName);
                }
              }}
            >
              Text
            </button>
            <button 
              className={`toggle-option ${valueType === 'variable' ? 'toggle-option-active' : ''}`}
              onClick={() => {
                setValueType('variable');
                // Convert current value to a variable reference
                updateValueAtPath({ var: String(value) });
              }}
            >
              Variable
            </button>
          </div>
          
          <div className="input-container">
            <input 
              type={typeof value === 'number' ? 'number' : 'text'}
              value={String(value)}
              onChange={(e) => handleValueChange(e)} 
              className="input-field"
            />
            
            {!isRoot && (
              <button 
                onClick={handleRemove} 
                className="action-button secondary-button"
              >
                Delete
              </button>
            )}
          </div>
          
          {valueType === 'variable' && (
            <div className="variable-info">
              This will use the value from the variable named "{isVarReference && value.var || String(value)}"
            </div>
          )}
        </div>
      );
    }
    
    // If value is an array, render items recursively
    if (isArray && !isCollapsed) {
      return (
        <div className="node-child-content">
          {value.map((item, index) => {
            const itemPath = [...path, index.toString()];
            
            // If item is an object with a single key, it's an operation
            if (item && typeof item === 'object' && !Array.isArray(item) && Object.keys(item).length === 1) {
              const itemOperation = Object.keys(item)[0];
              return (
                <OperationNode 
                  key={`${itemPath.join('-')}`}
                  operation={itemOperation}
                  value={item[itemOperation]}
                  path={[...itemPath, itemOperation]}
                  updateExpression={updateExpression}
                  expression={expression}
                  parentIndex={index}
                  onRemove={() => handleRemoveArrayItem(index)}
                  isCollapsedGlobal={isCollapsedGlobal}
                />
              );
            }
            
            // Otherwise render as simple value
            // Check if the item is a variable reference
            const isItemVarRef = typeof item === 'object' && item !== null && 
                              !Array.isArray(item) && 'var' in item;
                              
            return (
              <div key={`${itemPath.join('-')}`} className="array-item">
                <div className="type-toggle">
                  <button 
                    className={`toggle-option ${!isItemVarRef ? 'toggle-option-active' : ''}`}
                    onClick={() => {
                      if (isItemVarRef) {
                        // Convert back to text
                        const varObj = item;
                        const newArray = [...value];
                        newArray[index] = varObj.var || '';
                        updateValueAtPath(newArray);
                      }
                    }}
                  >
                    Text
                  </button>
                  <button 
                    className={`toggle-option ${isItemVarRef ? 'toggle-option-active' : ''}`}
                    onClick={() => {
                      if (!isItemVarRef) {
                        // Convert to variable reference
                        const newArray = [...value];
                        newArray[index] = { var: String(item) };
                        updateValueAtPath(newArray);
                      }
                    }}
                  >
                    Variable
                  </button>
                </div>
                
                <div className="input-container">
                  <input 
                    type={typeof item === 'number' ? 'number' : 'text'}
                    value={
                      isItemVarRef ? 
                        item.var || '' : 
                        (typeof item === 'object' ? JSON.stringify(item) : String(item))
                    }
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const newArray = [...value];
                      
                      if (isItemVarRef) {
                        // Update the variable name in the var reference object
                        newArray[index] = { var: newValue };
                      } else {
                        // Try to parse the value appropriately
                        const parsedValue = !isNaN(Number(newValue)) ? Number(newValue) :
                                         newValue === 'true' ? true :
                                         newValue === 'false' ? false : newValue;
                        newArray[index] = parsedValue;
                      }
                      
                      updateValueAtPath(newArray);
                    }} 
                    className="input-field"
                  />
                  <button 
                    onClick={() => handleRemoveArrayItem(index)} 
                    className="action-button secondary-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
          
          {/* Drop zone for adding new operations */}
          <div 
            ref={setNodeRef} 
            className={`dropzone ${isOver ? 'dropzone-active' : ''}`}
          >
            Drop another operation here or 
            <button 
              className="action-button primary-button"
              onClick={handleAddToArray}
            >
              add value
            </button>
          </div>
        </div>
      );
    }
    
    // If value is an object but not an array, handle specially
    if (typeof value === 'object' && !isArray) {
      const pairs = Object.entries(value);
      if (pairs.length > 0) {
        return (
          <div className="node-child-content">
            {pairs.map(([key, val]) => {
              const itemPath = [...path, key];
              return (
                <div key={itemPath.join('-')} className="object-property">
                  <div className="property-name">{key}:</div>
                  {typeof val === 'object' ? (
                    <OperationNode
                      operation={key}
                      value={val}
                      path={itemPath}
                      updateExpression={updateExpression}
                      expression={expression}
                    />
                  ) : (
                    <div className="property-value">
                      <input 
                        type="text" 
                        value={String(val)}
                        onChange={(e) => {
                          const newObj = {...value};
                          newObj[key] = e.target.value;
                          updateValueAtPath(newObj);
                        }} 
                        className="input-field"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      }
    }
    
    // Fallback for empty arrays when collapsed
    if (isArray && isCollapsed) {
      return (
        <div className="collapsed-array">
          {value.length} items (collapsed)
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="operation-node">
      <div className="operation-header">
        <div className="drag-handle">≣</div>
        <div className="operation-name">{operation}</div>
        <div className="node-controls">
          {isArray && (
            <button onClick={toggleCollapse} className="action-button secondary-button">
              {isCollapsed ? "+" : "-"}
            </button>
          )}
          {(!isRoot || allowRootDelete) && (
            <button onClick={handleRemove} className="action-button secondary-button">
              Delete
            </button>
          )}
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default OperationNode;