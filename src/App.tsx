import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ProjectBrief from './components/ProjectBrief';
import ActionPanel from './components/ActionPanel';
import OutputContainer from './components/OutputContainer';
import type { DocumentContent, SlideContent } from './types';
import { ViewType } from './types';

function App() {
  const [docContent, setDocContent] = useState<DocumentContent | null>(null);
  const [slidesContent, setSlidesContent] = useState<SlideContent[] | null>(null);
  const [activeView, setActiveView] = useState<ViewType>(ViewType.NONE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (projectBrief: string, generationType: 'doc' | 'slides') => {
    setIsLoading(true);
    setError(null);
    setDocContent(null);
    setSlidesContent(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectBrief, generationType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }
      
      const content = await response.json();

      if(generationType === 'doc') {
        setDocContent(content);
        setActiveView(ViewType.DOC);
      } else {
        setSlidesContent(content);
        setActiveView(ViewType.SLIDES);
      }

    } catch (err: any) {
      const errorMessage = err.message || `Failed to generate ${generationType}. Please try again.`;
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  const handleGenerateDoc = useCallback((projectBrief: string) => {
    handleGenerate(projectBrief, 'doc');
  }, []);

  const handleGenerateSlides = useCallback((projectBrief: string) => {
    handleGenerate(projectBrief, 'slides');
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="space-y-6">
              <ProjectBrief />
              <ActionPanel 
                onGenerateDoc={handleGenerateDoc} 
                onGenerateSlides={handleGenerateSlides}
                isLoading={isLoading} 
              />
            </div>
          </div>
          <div className="lg:col-span-8">
            <OutputContainer
              isLoading={isLoading}
              error={error}
              activeView={activeView}
              docContent={docContent}
              slidesContent={slidesContent}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;