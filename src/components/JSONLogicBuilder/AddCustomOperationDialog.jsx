import React, { useState } from 'react';

const AddCustomOperationDialog = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [implementation, setImplementation] = useState('');
  
  const handleSave = () => {
    if (!name.trim()) {
      alert("Name is required: Please provide a name for the custom operation");
      return;
    }
    
    if (!description.trim()) {
      alert("Description is required: Please provide a description for the custom operation");
      return;
    }
    
    if (!implementation.trim()) {
      alert("Implementation is required: Please provide a JavaScript implementation for the custom operation");
      return;
    }
    
    // Validate implementation by trying to convert it to a function
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`return ${implementation}`)();
      if (typeof fn !== 'function') {
        throw new Error('Not a valid function');
      }
      
      const operation = {
        id: name.trim(),
        description: description.trim(),
        implementation: fn,
        category: 'custom'
      };
      
      onAdd(operation);
      
      // Reset form
      setName('');
      setDescription('');
      setImplementation('');
      onClose();
    } catch (error) {
      alert("Invalid implementation: The implementation is not a valid JavaScript function");
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h2>Add Custom Operation</h2>
          <p className="dialog-description">
            Create a new custom operation to use in your JSONLogic expressions
          </p>
        </div>
        
        <div className="dialog-body">
          <div className="form-group">
            <label htmlFor="name">Operation Name</label>
            <input
              id="name"
              type="text"
              className="input-field"
              placeholder="e.g., containsString"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              className="input-field"
              placeholder="e.g., Checks if string contains substring"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="implementation">Implementation (JavaScript)</label>
            <textarea
              id="implementation"
              className="textarea-field"
              placeholder="(a, b) => String(a).includes(String(b))"
              rows={5}
              value={implementation}
              onChange={(e) => setImplementation(e.target.value)}
            />
            <p className="helper-text">
              Write a JavaScript function that will implement this operation.
            </p>
          </div>
        </div>
        
        <div className="dialog-footer">
          <button className="action-button secondary-button" onClick={onClose}>Cancel</button>
          <button className="action-button primary-button" onClick={handleSave}>Add Operation</button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomOperationDialog;