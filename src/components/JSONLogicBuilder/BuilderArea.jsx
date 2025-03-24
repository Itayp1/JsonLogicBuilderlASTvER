import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import OperationNode from './OperationNode';

const BuilderArea = ({ expression, updateExpression, resetBuilder, isCollapsedGlobal }) => {
  const { setNodeRef } = useDroppable({
    id: 'builder-area',
    data: {
      type: 'builder-area',
      path: []
    }
  });

  // Determine if expression is empty
  const isEmpty = !expression || Object.keys(expression).length === 0;

  return (
    <div className="builder-area" ref={setNodeRef}>
      <div className="builder-container">
        {isEmpty ? (
          <div className="empty-builder">
            <p>Drag and drop operations here to build your expression</p>
          </div>
        ) : (
          Object.entries(expression).map(([operation, value], index) => (
            <OperationNode
              key={`${operation}-${index}`}
              operation={operation}
              value={value}
              path={[operation]}
              updateExpression={updateExpression}
              expression={expression}
              isRoot={true}
              isCollapsedGlobal={isCollapsedGlobal}
              allowRootDelete={true}
            />
          ))
        )}
      </div>

      <div className="builder-json">
        <h4>Generated JSON:</h4>
        <pre>{JSON.stringify(expression, null, 2)}</pre>
      </div>
    </div>
  );
};

export default BuilderArea;