import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';

// Component for individual operation item
const OperationItem = ({ operation }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `operation-${operation.id}`,
    data: {
      type: 'operation',
      operation
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={`operation-item ${isDragging ? 'dragging' : ''}`}
      {...listeners}
      {...attributes}
    >
      <div className="operation-name">{operation.id}</div>
      <div className="operation-description">{operation.description}</div>
    </div>
  );
};

// Component for operations sidebar
const OperationsSidebar = ({ operations, onAddCustomOperation }) => {
  const [expandedCategories, setExpandedCategories] = useState(
    operations.reduce((acc, category) => {
      acc[category.name] = true;
      return acc;
    }, {})
  );

  // Toggle a category's expanded state
  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  return (
    <div className="operations-sidebar">
      <div className="sidebar-header">
        <h3>Available Operations</h3>
        <button
          className="add-custom-button"
          onClick={onAddCustomOperation}
        >
          Add Custom Operation
        </button>
      </div>

      <div className="operations-list">
        {operations.map((category) => (
          <div key={category.name} className="operation-category">
            <div
              className="category-header"
              onClick={() => toggleCategory(category.name)}
            >
              <span className="category-toggle">
                {expandedCategories[category.name] ? '▼' : '►'}
              </span>
              <h4>{category.name}</h4>
            </div>

            {expandedCategories[category.name] && (
              <div className="category-items">
                {category.operations.map((operation) => (
                  <OperationItem
                    key={operation.id}
                    operation={operation}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperationsSidebar;