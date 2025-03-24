import { useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JSONLogicExpression } from './types';
import { useToast } from '@/hooks/use-toast';
import { Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import _ from 'lodash';

interface OperationNodeProps {
  operation: string;
  value: any;
  path: string[];
  updateExpression: (expression: JSONLogicExpression) => void;
  expression: JSONLogicExpression;
  isRoot?: boolean;
  parentIndex?: number;
  onRemove?: () => void;
  isCollapsedGlobal?: boolean;
}

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
}: OperationNodeProps) => {
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
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
    if (isRoot) {
      toast({
        variant: "destructive",
        title: "Cannot remove root operation",
        description: "The root operation cannot be removed. Use the reset button instead.",
      });
      return;
    }
    
    if (onRemove) {
      onRemove();
    }
  };
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const updateValueAtPath = (newValue: any) => {
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
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>, valueIndex?: number) => {
    const inputValue = e.target.value;
    
    // If this is a simple value (not an array)
    if (!isArray && valueIndex === undefined) {
      let parsedValue = inputValue;
      
      // Try to convert to appropriate type
      if (!isNaN(Number(inputValue))) {
        parsedValue = Number(inputValue);
      } else if (inputValue === 'true') {
        parsedValue = true;
      } else if (inputValue === 'false') {
        parsedValue = false;
      }
      
      updateValueAtPath(parsedValue);
    } 
    // If this is an array element
    else if (isArray && valueIndex !== undefined) {
      const newArray = [...value];
      let parsedValue = inputValue;
      
      // Try to convert to appropriate type
      if (!isNaN(Number(inputValue))) {
        parsedValue = Number(inputValue);
      } else if (inputValue === 'true') {
        parsedValue = true;
      } else if (inputValue === 'false') {
        parsedValue = false;
      }
      
      newArray[valueIndex] = parsedValue;
      updateValueAtPath(newArray);
    }
  };
  
  const handleRemoveArrayItem = (index: number) => {
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
        <div className="pl-6 border-l-2 border-gray-200 space-y-2 mt-2">
          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 border rounded p-2 flex-grow">
              <Input 
                type="text" 
                value={typeof value === 'string' ? value : JSON.stringify(value)}
                onChange={(e) => handleValueChange(e)} 
                placeholder="Variable name"
                className="w-full bg-transparent border-none focus-visible:ring-0 focus-visible:outline-none"
              />
            </div>
            {!isRoot && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRemove} 
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      );
    }
    
    // If value is a simple primitive, render input
    if (isSimplePrimitive) {
      return (
        <div className="flex items-center space-x-2">
          <div className="bg-gray-100 border rounded p-2 flex-grow">
            <Input 
              type={typeof value === 'number' ? 'number' : 'text'}
              value={String(value)}
              onChange={(e) => handleValueChange(e)} 
              className="w-full bg-transparent border-none focus-visible:ring-0 focus-visible:outline-none"
            />
          </div>
          {!isRoot && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRemove} 
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    }
    
    // If value is an array, render items recursively
    if (isArray && !isCollapsed) {
      return (
        <div className="pl-6 border-l-2 border-gray-200 space-y-2 mt-2">
          {value.map((item: any, index: number) => {
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
            return (
              <div key={`${itemPath.join('-')}`} className="flex items-center space-x-2">
                <div className="bg-gray-100 border rounded p-2 flex-grow">
                  <Input 
                    type={typeof item === 'number' ? 'number' : 'text'}
                    value={typeof item === 'object' ? JSON.stringify(item) : String(item)}
                    onChange={(e) => handleValueChange(e, index)} 
                    className="w-full bg-transparent border-none focus-visible:ring-0 focus-visible:outline-none"
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveArrayItem(index)} 
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
          
          {/* Drop zone for adding new operations */}
          <div ref={setNodeRef} className={cn(
            "border border-dashed border-gray-300 rounded-lg p-3 text-center text-sm text-muted-foreground transition-all",
            isOver && "bg-primary/10"
          )}>
            Drop another operation here or 
            <Button 
              variant="link" 
              className="h-auto p-0 px-1 text-primary"
              onClick={handleAddToArray}
            >
              add value
            </Button>
          </div>
        </div>
      );
    }
    
    // If value is an object but not an array, handle specially
    if (typeof value === 'object' && !isArray) {
      const pairs = Object.entries(value);
      if (pairs.length > 0) {
        return (
          <div className="pl-6 border-l-2 border-gray-200 space-y-2 mt-2">
            {pairs.map(([key, val]) => {
              const itemPath = [...path, key];
              return (
                <div key={itemPath.join('-')}>
                  <div className="text-sm font-medium mb-1">{key}:</div>
                  {typeof val === 'object' ? (
                    <OperationNode
                      operation={key}
                      value={val}
                      path={itemPath}
                      updateExpression={updateExpression}
                      expression={expression}
                    />
                  ) : (
                    <div className="bg-gray-100 border rounded p-2">
                      <Input 
                        type="text" 
                        value={String(val)}
                        onChange={(e) => {
                          const newObj = {...value};
                          newObj[key] = e.target.value;
                          updateValueAtPath(newObj);
                        }} 
                        className="w-full bg-transparent border-none focus-visible:ring-0 focus-visible:outline-none"
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
        <div className="pl-6 border-l-2 border-gray-200 mt-2 py-1 text-sm text-muted-foreground">
          {value.length} items (collapsed)
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="bg-background border rounded-lg p-3 mb-2 relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
          <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-sm">"{operation}"</span>
          
          {isArray && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="h-6 w-6 p-0 text-muted-foreground"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </div>
        
        <div className="flex space-x-1">
          {!isRoot && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRemove} 
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default OperationNode;
