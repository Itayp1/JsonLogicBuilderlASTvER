import { useRef, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { JSONLogicExpression } from './types';
import OperationNode from './OperationNode';
import { RefreshCw, Maximize, Minimize, Copy, Code, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Default template example
const DEFAULT_TEMPLATE = {
  "or": [
    {
      ">": [
        { "+": [1, { "var": "myVariable" }] },
        5
      ]
    }
  ]
};

interface BuilderAreaProps {
  expression: JSONLogicExpression;
  updateExpression: (expression: JSONLogicExpression) => void;
  resetBuilder: () => void;
}

const BuilderArea = ({ expression, updateExpression, resetBuilder }: BuilderAreaProps) => {
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const jsonRef = useRef<HTMLPreElement>(null);

  const { setNodeRef } = useDroppable({
    id: 'builder-root',
    data: {
      acceptsOperation: true,
      isRoot: true
    }
  });

  const handleExpandAll = () => {
    setIsCollapsed(false);
    toast({
      title: "All operations expanded",
    });
  };

  const handleCollapseAll = () => {
    setIsCollapsed(true);
    toast({
      title: "All operations collapsed",
    });
  };

  const handleCopyJSON = () => {
    const jsonString = JSON.stringify(expression, null, 2);
    navigator.clipboard.writeText(jsonString);
    toast({
      title: "JSON copied to clipboard",
    });
  };

  const handleFormatJSON = () => {
    // Already formatted with 2-space indentation
    toast({
      title: "JSON already formatted",
    });
  };

  const handleAddTemplate = () => {
    updateExpression(DEFAULT_TEMPLATE);
    toast({
      title: "Template added",
      description: "Default template has been applied to the builder"
    });
  };

  const handleClearBuilder = () => {
    updateExpression({});
    toast({
      title: "Builder cleared",
      description: "All operations have been removed from the builder"
    });
  };

  // Find root operation (first key in the object)
  const rootOperation = Object.keys(expression)[0];
  const rootValue = expression[rootOperation];

  const isEmpty = !rootOperation;

  return (
    <div className="lg:col-span-6 space-y-4">
      <Card>
        <CardHeader className="bg-primary text-primary-foreground py-3 px-4 flex-row flex items-center justify-between">
          <CardTitle className="text-base">Builder</CardTitle>
          <div className="flex space-x-2">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-primary-foreground opacity-90 hover:opacity-100 hover:bg-white/10"
              onClick={handleAddTemplate}
              title="Add Template"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-primary-foreground opacity-90 hover:opacity-100 hover:bg-white/10"
              onClick={handleClearBuilder}
              title="Clear Builder"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-primary-foreground opacity-90 hover:opacity-100 hover:bg-white/10"
              onClick={handleExpandAll}
              title="Expand All"
            >
              <Maximize className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-primary-foreground opacity-90 hover:opacity-100 hover:bg-white/10"
              onClick={handleCollapseAll}
              title="Collapse All"
            >
              <Minimize className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="text-center text-sm text-muted-foreground mb-4 bg-blue-50 p-3 rounded">
            Drag operations from the sidebar and drop them here. Nest operations by dragging inside other operations.
          </div>

          <div ref={setNodeRef} className={`min-h-32 ${isEmpty ? 'border-2 border-dashed border-gray-300 rounded-lg p-6' : ''}`}>
            {rootOperation ? (
              <OperationNode
                operation={rootOperation}
                value={rootValue}
                path={[rootOperation]}
                updateExpression={updateExpression}
                expression={expression}
                isRoot={true}
                isCollapsedGlobal={isCollapsed}
                allowRootDelete={true}
              />
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Drop an operation here to start building your logic</p>
                <Button onClick={handleAddTemplate} className="mx-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Template
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-primary text-primary-foreground py-3 px-4 flex-row flex items-center justify-between">
          <CardTitle className="text-base">JSON Output</CardTitle>
          <div className="flex space-x-2">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-primary-foreground opacity-90 hover:opacity-100 hover:bg-white/10"
              onClick={handleCopyJSON}
              title="Copy JSON"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-primary-foreground opacity-90 hover:opacity-100 hover:bg-white/10"
              onClick={handleFormatJSON}
              title="Format JSON"
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <div className="p-4 bg-gray-800 text-white overflow-x-auto">
          <pre ref={jsonRef} className="font-mono text-sm whitespace-pre-wrap">
            {JSON.stringify(expression, null, 2)}
          </pre>
        </div>
      </Card>
    </div>
  );
};

export default BuilderArea;
