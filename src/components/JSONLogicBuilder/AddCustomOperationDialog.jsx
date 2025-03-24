import React, { useState } from 'react';

const AddCustomOperationDialog = ({ isOpen, onClose, onAdd }) => {
  const [operation, setOperation] = useState({
    id: '',
    description: '',
    category: 'custom',
    implementation: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Try to convert the implementation string to a function
    let implementationFn;
    try {
      // eslint-disable-next-line no-new-func
      implementationFn = new Function(
        'return ' + operation.implementation
      )();
      
      if (typeof implementationFn !== 'function') {
        alert('Implementation must be a valid function.');
        return;
      }
    } catch (error) {
      alert(`Error in function implementation: ${error.message}`);
      return;
    }
    
    // Add the custom operation
    onAdd({
      ...operation,
      implementation: implementationFn
    });
    
    // Reset the form
    setOperation({
      id: '',
      description: '',
      category: 'custom',
      implementation: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add Custom Operation</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="operation-id">Operation ID:</label>
            <input
              id="operation-id"
              type="text"
              value={operation.id}
              onChange={(e) => setOperation({ ...operation, id: e.target.value })}
              required
              placeholder="e.g., myCustomOperation"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="operation-description">Description:</label>
            <input
              id="operation-description"
              type="text"
              value={operation.description}
              onChange={(e) => setOperation({ ...operation, description: e.target.value })}
              required
              placeholder="Describe what this operation does"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="operation-category">Category:</label>
            <input
              id="operation-category"
              type="text"
              value={operation.category}
              onChange={(e) => setOperation({ ...operation, category: e.target.value.toLowerCase() })}
              required
              placeholder="e.g., custom, math, logic"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="operation-implementation">Implementation (JavaScript function):</label>
            <textarea
              id="operation-implementation"
              value={operation.implementation}
              onChange={(e) => setOperation({ ...operation, implementation: e.target.value })}
              required
              placeholder="(a, b) => { return a + b; }"
              rows={5}
            />
            <small className="form-helper-text">
              Write a JavaScript function that implements your operation.
              <br />
              Example: <code>(a, b) =&gt; a + b</code> or <code>function(a, b) {'{'} return a + b; {'}'}</code>
            </small>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-button">Add Operation</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomOperationDialog;