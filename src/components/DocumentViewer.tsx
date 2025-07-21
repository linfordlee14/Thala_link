import React from 'react';
import type { DocumentContent, DocumentSection } from '../types';
import { generateDocx } from '../services/fileGenerator';
import { DownloadIcon } from './Icons';

interface DocumentViewerProps {
  content: DocumentContent;
}

const renderSectionContent = (section: DocumentSection) => {
  const contentElements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      contentElements.push(
        <ul key={`list-${contentElements.length}`} className="list-disc pl-5 space-y-1 my-4">
          {currentList.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      );
      currentList = [];
    }
  };

  section.content.forEach((part, partIndex) => {
    if (part.type === 'bullet') {
      currentList.push(part.text);
    } else {
      flushList();
      contentElements.push(<p key={partIndex}>{part.text}</p>);
    }
  });

  flushList();
  return contentElements;
};

const DocumentViewer = ({ content }: DocumentViewerProps) => {
  const handleDownload = async () => {
    await generateDocx(content);
  };

  return (
    <div className="w-full h-full bg-white p-8 md:p-12 animate-fade-in self-start relative">
       <button
        onClick={handleDownload}
        className="absolute top-6 right-6 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 z-10"
        aria-label="Download Document"
        title="Download as .docx"
      >
        <DownloadIcon className="w-6 h-6" />
      </button>

      <div className="max-w-4xl mx-auto prose lg:prose-lg">
        <h1 className="text-center !text-blue-800">{content.title}</h1>
        
        <div className="mt-8 mb-10 p-4 bg-blue-50 border-l-4 border-blue-400">
            <h2 className="!mt-0 !text-xl !text-blue-700">Executive Summary</h2>
            <p className="!text-base">{content.executiveSummary}</p>
        </div>

        {content.sections.map((section, index) => (
          <div key={index} className="mt-8">
            <h2 className="!text-blue-700">{section.heading}</h2>
            {renderSectionContent(section)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentViewer;