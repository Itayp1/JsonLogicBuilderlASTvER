/**
 * Extracts variable names from a JSONLogic expression
 * @param {Object} expression - The JSONLogic expression
 * @returns {Array} Array of variable names used in the expression
 */
export const extractVariables = (expression) => {
  const variables = new Set();

  const traverse = (obj) => {
    if (!obj || typeof obj !== 'object') {
      return;
    }

    // Check if it's a var operation
    if ('var' in obj && typeof obj.var === 'string') {
      variables.add(obj.var);
      return;
    }

    // Recursively check arrays
    if (Array.isArray(obj)) {
      obj.forEach(item => traverse(item));
      return;
    }

    // Recursively check object properties
    Object.values(obj).forEach(value => traverse(value));
  };

  traverse(expression);
  return Array.from(variables);
};