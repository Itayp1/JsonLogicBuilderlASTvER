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
  isCollapsedGlobal,
  allowRootDelete = false
}) => {
  // State for collapsed status
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Update collapsed state when global collapsed state changes
  useEffect(() => {
    if (isCollapsedGlobal !== undefined) {
      setIsCollapsed(isCollapsedGlobal);
    }
  }, [isCollapsedGlobal]);

  // Set up drop area for this node
  const { setNodeRef } = useDroppable({
    id: `droppable-${path.join('-')}`,
    data: {
      type: 'operation-node',
      path,
      parentOperation: operation
    }
  });

  // Get path to the value in the expression
  const getValuePath = () => {
    return path.length > 1 ? path.slice(1) : [];
  };

  // Handle deletion of this node
  const handleDelete = () => {
    if (isRoot) {
      if (allowRootDelete) {
        // For root elements, just reset the expression to empty
        updateExpression({});
      }
    } else if (onRemove) {
      onRemove();
    }
  };

  // Add a new value to an array
  const addValueToArray = () => {
    const valuePath = getValuePath();
    const newExpression = _.cloneDeep(expression);
    
    if (valuePath.length === 0) {
      // If this is a root operation with an array value
      if (Array.isArray(newExpression[operation])) {
        newExpression[operation].push("");
      }
    } else {
      // For nested operations
      const arrayPath = ['$root', ...valuePath];
      const array = _.get(newExpression, arrayPath);
      
      if (Array.isArray(array)) {
        array.push("");
        _.set(newExpression, arrayPath, array);
      }
    }
    
    updateExpression(newExpression);
  };

  // Handle change in a primitive value (string, number, boolean)
  const handleValueChange = (newValue, index) => {
    const valuePath = getValuePath();
    const newExpression = _.cloneDeep(expression);
    
    // Determine value type
    let parsedValue = newValue;
    if (newValue === 'true') parsedValue = true;
    else if (newValue === 'false') parsedValue = false;
    else if (!isNaN(Number(newValue)) && newValue !== '') parsedValue = Number(newValue);
    
    if (valuePath.length === 0) {
      // Root level value
      if (Array.isArray(newExpression[operation]) && index !== undefined) {
        newExpression[operation][index] = parsedValue;
      } else {
        newExpression[operation] = parsedValue;
      }
    } else {
      // Nested value
      let targetPath;
      if (index !== undefined && Array.isArray(_.get(newExpression, ['$root', ...valuePath]))) {
        targetPath = ['$root', ...valuePath, index];
      } else {
        targetPath = ['$root', ...valuePath];
      }
      
      _.set(newExpression, targetPath, parsedValue);
    }
    
    updateExpression(newExpression);
  };

  // Remove an item from an array
  const removeArrayItem = (index) => {
    const valuePath = getValuePath();
    const newExpression = _.cloneDeep(expression);
    
    if (valuePath.length === 0) {
      // Root level array
      if (Array.isArray(newExpression[operation])) {
        newExpression[operation].splice(index, 1);
      }
    } else {
      // Nested array
      const arrayPath = ['$root', ...valuePath];
      const array = _.get(newExpression, arrayPath);
      
      if (Array.isArray(array)) {
        array.splice(index, 1);
        _.set(newExpression, arrayPath, array);
      }
    }
    
    updateExpression(newExpression);
  };

  // Toggle between showing value directly or as a var reference
  const toggleVarWrapper = (index) => {
    const valuePath = getValuePath();
    const newExpression = _.cloneDeep(expression);
    
    let targetValue, targetPath;
    
    if (valuePath.length === 0) {
      // Root level
      if (Array.isArray(newExpression[operation]) && index !== undefined) {
        targetValue = newExpression[operation][index];
        targetPath = [operation, index];
      } else {
        targetValue = newExpression[operation];
        targetPath = [operation];
      }
    } else {
      // Nested value
      if (index !== undefined) {
        targetPath = ['$root', ...valuePath, index];
      } else {
        targetPath = ['$root', ...valuePath];
      }
      targetValue = _.get(newExpression, targetPath);
    }
    
    // Toggle between direct value and var wrapper
    if (typeof targetValue === 'object' && targetValue !== null && 'var' in targetValue) {
      // If it's a var, unwrap it
      _.set(newExpression, targetPath, targetValue.var);
    } else if (typeof targetValue === 'string') {
      // If it's a string, wrap it in a var
      _.set(newExpression, targetPath, { var: targetValue });
    }
    
    updateExpression(newExpression);
  };

  // Render array values
  const renderArrayValues = (arrayValues) => {
    return (
      <div className="array-values">
        {arrayValues.map((item, index) => (
          <div key={index} className="array-item">
            <div className="array-item-header">
              <span className="array-index">[{index}]</span>
              <button
                className="remove-item-button"
                onClick={() => removeArrayItem(index)}
              >
                ×
              </button>
            </div>
            {renderValue(item, index)}
          </div>
        ))}
        <button className="add-item-button" onClick={addValueToArray}>
          + Add Item
        </button>
      </div>
    );
  };

  // Render a value (could be primitive, object, or array)
  const renderValue = (val, index) => {
    // If the value is an array
    if (Array.isArray(val)) {
      return renderArrayValues(val);
    }
    
    // If the value is a JSONLogic sub-expression
    if (val && typeof val === 'object') {
      const [subOperation, subValue] = Object.entries(val)[0] || [];
      
      if (subOperation) {
        const subPath = [...path];
        if (Array.isArray(value)) {
          subPath.push(index, subOperation);
        } else {
          subPath.push(subOperation);
        }
        
        return (
          <OperationNode
            operation={subOperation}
            value={subValue}
            path={subPath}
            updateExpression={updateExpression}
            expression={expression}
            parentIndex={index}
            onRemove={() => {
              const newExpression = _.cloneDeep(expression);
              if (Array.isArray(value)) {
                value[index] = "";
                _.set(newExpression, ['$root', ...getValuePath()], value);
              }
              updateExpression(newExpression);
            }}
            isCollapsedGlobal={isCollapsedGlobal}
          />
        );
      }
    }
    
    // For primitive values (string, number, boolean)
    return (
      <div className="primitive-value">
        <input
          type="text"
          value={val === null ? '' : String(val)}
          onChange={(e) => handleValueChange(e.target.value, index)}
          className="value-input"
        />
        <button
          className="toggle-var-button"
          onClick={() => toggleVarWrapper(index)}
          title="Toggle between direct value and variable reference"
        >
          {typeof val === 'object' && val !== null && 'var' in val ? 'raw' : 'var'}
        </button>
      </div>
    );
  };

  return (
    <div
      ref={setNodeRef}
      className={`operation-node ${isRoot ? 'root-node' : ''}`}
    >
      <div className="node-header">
        <div className="operation-info">
          <button
            className="collapse-button"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? '►' : '▼'}
          </button>
          <span className="operation-label">{operation}</span>
        </div>
        <button
          className="delete-node-button"
          onClick={handleDelete}
          disabled={isRoot && !allowRootDelete}
        >
          Remove
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="node-content">
          {renderValue(value)}
        </div>
      )}
    </div>
  );
};

export default OperationNode;