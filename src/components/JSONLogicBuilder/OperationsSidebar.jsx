import React, { useMemo, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';

const OperationItem = ({ operation }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: operation.id,
    data: {
      type: 'operation',
      operation
    }
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 1000 : undefined,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="operation-item"
      {...listeners}
      {...attributes}
    >
      <div className="operation-item-content">
        <div className="operation-name">"{operation.id}"</div>
        <div className="operation-description">{operation.description}</div>
      </div>
      <div className="drag-handle">≣</div>
    </div>
  );
};

const OperationsSidebar = ({ operations, onAddCustomOperation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredOperations = useMemo(() => {
    if (!searchTerm.trim()) return operations;
    
    return operations.map(category => ({
      ...category,
      operations: category.operations.filter(op => 
        op.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        op.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.operations.length > 0);
  }, [operations, searchTerm]);

  return (
    <div className="sidebar">
      <h2 className="section-header">Operations</h2>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search operations"
          className="input-field"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="operations-list">
        {filteredOperations.map((category) => (
          <div className="operations-category" key={category.name}>
            <div className="category-header">{category.name}</div>
            <div className="category-operations">
              {category.operations.map((operation) => (
                <OperationItem key={operation.id} operation={operation} />
              ))}
              
              {category.name === 'Custom' && (
                <button 
                  className="action-button primary-button custom-operation-button"
                  onClick={onAddCustomOperation}
                >
                  Add Custom Operation
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperationsSidebar;