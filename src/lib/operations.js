// Logic operations
const logicOperations = [
  { id: 'and', description: 'All conditions must be true', category: 'logic' },
  { id: 'or', description: 'Any condition must be true', category: 'logic' },
  { id: 'if', description: 'Conditional logic (if-then-else)', category: 'logic' },
  { id: '!', description: 'Logical NOT', category: 'logic' },
  { id: '!!', description: 'Convert to boolean', category: 'logic' }
];

// Comparison operations
const comparisonOperations = [
  { id: '==', description: 'Equal (type coercion)', category: 'comparison' },
  { id: '===', description: 'Strictly equal (no type coercion)', category: 'comparison' },
  { id: '!=', description: 'Not equal (type coercion)', category: 'comparison' },
  { id: '!==', description: 'Strictly not equal (no type coercion)', category: 'comparison' },
  { id: '>', description: 'Greater than', category: 'comparison' },
  { id: '>=', description: 'Greater than or equal', category: 'comparison' },
  { id: '<', description: 'Less than', category: 'comparison' },
  { id: '<=', description: 'Less than or equal', category: 'comparison' }
];

// Math operations
const mathOperations = [
  { id: '+', description: 'Addition', category: 'math' },
  { id: '-', description: 'Subtraction', category: 'math' },
  { id: '*', description: 'Multiplication', category: 'math' },
  { id: '/', description: 'Division', category: 'math' },
  { id: '%', description: 'Remainder (modulo)', category: 'math' },
  { id: 'min', description: 'Minimum value', category: 'math' },
  { id: 'max', description: 'Maximum value', category: 'math' },
  { id: 'abs', description: 'Absolute value', category: 'math' }
];

// Data access operations
const dataOperations = [
  { id: 'var', description: 'Access variable', category: 'data' },
  { id: 'missing', description: 'Check for missing keys', category: 'data' },
  { id: 'missing_some', description: 'Check if some keys are missing', category: 'data' }
];

// Array operations
const arrayOperations = [
  { id: 'map', description: 'Apply logic to each item', category: 'array' },
  { id: 'filter', description: 'Filter array by condition', category: 'array' },
  { id: 'reduce', description: 'Reduce array to single value', category: 'array' },
  { id: 'all', description: 'Check if all items match condition', category: 'array' },
  { id: 'none', description: 'Check if no items match condition', category: 'array' },
  { id: 'some', description: 'Check if any items match condition', category: 'array' },
  { id: 'merge', description: 'Merge arrays', category: 'array' }
];

// String operations
const stringOperations = [
  { id: 'cat', description: 'Concatenate strings', category: 'string' },
  { id: 'substr', description: 'Get substring', category: 'string' }
];

// Custom operations
const customOperations = [
  { id: 'afterDate', description: 'Check if date is after another date', category: 'custom' },
  { id: 'beforeDate', description: 'Check if date is before another date', category: 'custom' }
];

// All operations grouped by category
export const categories = [
  { name: 'Logic', operations: logicOperations },
  { name: 'Comparison', operations: comparisonOperations },
  { name: 'Math', operations: mathOperations },
  { name: 'Data Access', operations: dataOperations },
  { name: 'Array', operations: arrayOperations },
  { name: 'String', operations: stringOperations },
  { name: 'Custom', operations: customOperations }
];

// Flattened list of all operations
export const defaultOperations = [
  ...logicOperations,
  ...comparisonOperations,
  ...mathOperations,
  ...dataOperations,
  ...arrayOperations,
  ...stringOperations,
  ...customOperations
];