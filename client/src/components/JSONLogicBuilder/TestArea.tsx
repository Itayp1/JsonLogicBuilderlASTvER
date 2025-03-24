import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Code, ExternalLink, Play } from 'lucide-react';

interface TestAreaProps {
  testData: string;
  setTestData: (data: string) => void;
  evaluateExpression: () => void;
  testResult: any;
  usedVariables: { name: string; value: any }[];
}

const TestArea = ({ 
  testData, 
  setTestData, 
  evaluateExpression, 
  testResult,
  usedVariables 
}: TestAreaProps) => {
  const { toast } = useToast();
  
  const handleFormatTestData = () => {
    try {
      const parsed = JSON.parse(testData);
      setTestData(JSON.stringify(parsed, null, 2));
      toast({
        title: "Test data formatted",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Invalid JSON",
        description: "The test data is not valid JSON",
      });
    }
  };
  
  const handleTestDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTestData(e.target.value);
  };

  return (
    <div className="lg:col-span-3 space-y-4">
      <Card>
        <CardHeader className="bg-primary text-primary-foreground py-3 px-4 flex-row flex items-center justify-between">
          <CardTitle className="text-base">Test Data</CardTitle>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-primary-foreground opacity-90 hover:opacity-100 hover:bg-white/10"
            onClick={handleFormatTestData}
            title="Format JSON"
          >
            <Code className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          <Textarea 
            className="w-full h-60 p-3 border font-mono text-sm bg-gray-800 text-white resize-none"
            value={testData}
            onChange={handleTestDataChange}
          />
          <div className="mt-3">
            <Button 
              className="w-full"
              onClick={evaluateExpression}
            >
              <Play className="h-4 w-4 mr-2" />
              Evaluate Logic
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-primary text-primary-foreground py-3 px-4">
          <CardTitle className="text-base">Result</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="bg-gray-100 p-3 rounded text-center">
            <div className="text-sm text-muted-foreground mb-2">Evaluation result:</div>
            <div className="flex items-center justify-center">
              {testResult === true && (
                <>
                  <CheckCircle className="text-green-600 mr-2 h-6 w-6" />
                  <span className="text-xl font-medium">true</span>
                </>
              )}
              {testResult === false && (
                <>
                  <XCircle className="text-red-600 mr-2 h-6 w-6" />
                  <span className="text-xl font-medium">false</span>
                </>
              )}
              {testResult !== true && testResult !== false && (
                <span className="text-xl font-medium">
                  {testResult === null ? "null" : 
                   testResult === undefined ? "undefined" : 
                   typeof testResult === 'object' ? JSON.stringify(testResult) : 
                   String(testResult)}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {testResult === true && "Logic evaluates to true with the current test data"}
              {testResult === false && "Logic evaluates to false with the current test data"}
              {testResult !== true && testResult !== false && 
               `Logic evaluates to ${testResult === null ? "null" : 
                                    testResult === undefined ? "undefined" : 
                                    typeof testResult === 'object' ? "object" : 
                                    typeof testResult}`}
            </div>
          </div>
          
          {usedVariables.length > 0 && (
            <div className="mt-3 text-sm text-muted-foreground">
              <div className="font-medium mb-1">Variables Used:</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {usedVariables.map((variable, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-primary px-2 py-1 rounded-full text-xs">
                    {variable.name}
                    <span className="ml-1 text-xs">= {JSON.stringify(variable.value)}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-primary text-primary-foreground py-3 px-4">
          <CardTitle className="text-base">Help & Documentation</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Button 
            variant="outline" 
            className="w-full justify-center items-center space-x-2"
            onClick={() => window.open("https://jsonlogic.com/operations.html", "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2 text-primary" />
            <div>
              <div className="font-medium">JSONLogic Documentation</div>
              <div className="text-xs text-muted-foreground mt-1">View all available operations</div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestArea;
