import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Operation } from './types';
import { nanoid } from 'nanoid';
import { useToast } from '@/hooks/use-toast';

interface AddCustomOperationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (operation: Operation) => void;
}

const AddCustomOperationDialog = ({ isOpen, onClose, onAdd }: AddCustomOperationDialogProps) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [implementation, setImplementation] = useState('');
  
  const handleSave = () => {
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Name is required",
        description: "Please provide a name for the custom operation"
      });
      return;
    }
    
    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: "Description is required",
        description: "Please provide a description for the custom operation"
      });
      return;
    }
    
    if (!implementation.trim()) {
      toast({
        variant: "destructive",
        title: "Implementation is required",
        description: "Please provide a JavaScript implementation for the custom operation"
      });
      return;
    }
    
    // Validate implementation by trying to convert it to a function
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`return ${implementation}`)();
      if (typeof fn !== 'function') {
        throw new Error('Not a valid function');
      }
      
      const operation: Operation = {
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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Invalid implementation",
        description: "The implementation is not a valid JavaScript function"
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Operation</DialogTitle>
          <DialogDescription>
            Create a new custom operation to use in your JSONLogic expressions
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-3">
          <div className="grid gap-2">
            <Label htmlFor="name">Operation Name</Label>
            <Input
              id="name"
              placeholder="e.g., containsString"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Checks if string contains substring"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="implementation">Implementation (JavaScript)</Label>
            <Textarea
              id="implementation"
              placeholder="(a, b) => String(a).includes(String(b))"
              className="font-mono text-sm"
              rows={5}
              value={implementation}
              onChange={(e) => setImplementation(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Write a JavaScript function that will implement this operation.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Add Operation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomOperationDialog;
