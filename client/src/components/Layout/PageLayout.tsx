import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
}

const PageLayout = ({ children, title }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-icons text-2xl">code</span>
            <h1 className="text-xl font-medium">{title}</h1>
          </div>
          <div>
            <a 
              href="https://jsonlogic.com/operations.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 rounded px-3 py-1 text-sm flex items-center space-x-1 transition-colors"
            >
              <span className="material-icons text-sm">help_outline</span>
              <span>Help</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="bg-white border-t py-3">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          JSONLogic Builder - A visual interface for building JSONLogic expressions
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
