import { useMemo, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { OperationCategory, Operation } from './types';
import { Search, GripVertical, Plus } from 'lucide-react';

interface OperationItemProps {
  operation: Operation;
}

const OperationItem = ({ operation }: OperationItemProps) => {
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
      className="bg-background hover:bg-gray-100 rounded p-2 border border-gray-200 cursor-grab flex items-center justify-between group transition-colors mb-2"
      {...listeners}
      {...attributes}
    >
      <div>
        <div className="font-medium">"{operation.id}"</div>
        <div className="text-xs text-muted-foreground">{operation.description}</div>
      </div>
      <GripVertical className="h-4 w-4 text-muted-foreground invisible group-hover:visible" />
    </div>
  );
};

interface OperationsSidebarProps {
  operations: OperationCategory[];
  onAddCustomOperation: () => void;
}

const OperationsSidebar = ({ operations, onAddCustomOperation }: OperationsSidebarProps) => {
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
    <Card className="lg:col-span-3 h-[calc(100vh-9rem)] flex flex-col">
      <CardHeader className="bg-primary text-primary-foreground py-3 px-4">
        <CardTitle className="text-base flex items-center">
          <span>Operations</span>
        </CardTitle>
      </CardHeader>

      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search operations"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-grow">
        <CardContent className="p-0">
          <Accordion type="multiple" defaultValue={operations.map(cat => cat.name)}>
            {filteredOperations.map((category) => (
              <AccordionItem value={category.name} key={category.name}>
                <AccordionTrigger className="px-3 py-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {category.name}
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3 pt-0">
                  <div className="space-y-1">
                    {category.operations.map((operation) => (
                      <OperationItem key={operation.id} operation={operation} />
                    ))}
                    
                    {category.name === 'Custom' && (
                      <Button 
                        variant="outline" 
                        className="w-full mt-2 border-dashed"
                        onClick={onAddCustomOperation}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Custom Operation
                      </Button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default OperationsSidebar;
