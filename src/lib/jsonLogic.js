import jsonLogic from 'json-logic-js';

// Add custom operations
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

// Helper function to extract variables used in a JSONLogic expression
export const extractVariables = (expression) => {
  const variables = [];
  
  const traverse = (expr) => {
    if (!expr || typeof expr !== 'object') {
      return;
    }
    
    if ('var' in expr) {
      const varName = expr.var;
      if (typeof varName === 'string' && !variables.includes(varName)) {
        variables.push(varName);
      }
    }
    
    for (const key in expr) {
      const value = expr[key];
      if (Array.isArray(value)) {
        value.forEach(traverse);
      } else if (value && typeof value === 'object') {
        traverse(value);
      }
    }
  };
  
  traverse(expression);
  return variables;
};

export { jsonLogic };