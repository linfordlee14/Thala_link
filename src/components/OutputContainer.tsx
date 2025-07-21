import React from 'react';
import DocumentViewer from './DocumentViewer';
import SlidesViewer from './SlidesViewer';
import Loader from './Loader';
import { WelcomeSplash } from './WelcomeSplash';
import type { DocumentContent, SlideContent } from '../types';
import { ViewType } from '../types';
import { ErrorIcon } from './Icons';

interface OutputContainerProps {
  isLoading: boolean;
  error: string | null;
  activeView: ViewType;
  docContent: DocumentContent | null;
  slidesContent: SlideContent[] | null;
}

const OutputContainer = ({ isLoading, error, activeView, docContent, slidesContent }: OutputContainerProps) => {
  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-red-600">
          <ErrorIcon className="w-16 h-16 mb-4"/>
          <h3 className="text-xl font-semibold">An Error Occurred</h3>
          <p className="text-red-500 mt-2">{error}</p>
        </div>
      );
    }
    switch (activeView) {
      case ViewType.DOC:
        return docContent ? <DocumentViewer content={docContent} /> : null;
      case ViewType.SLIDES:
        return slidesContent ? <SlidesViewer content={slidesContent} /> : null;
      default:
        return <WelcomeSplash />;
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md min-h-[600px] flex items-center justify-center">
      {renderContent()}
    </div>
  );
};

export default OutputContainer;