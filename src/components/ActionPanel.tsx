import React from 'react';
import { PROJECT_BRIEF_TEXT } from '../constants';
import { DocIcon, SlidesIcon } from './Icons';

interface ActionPanelProps {
  onGenerateDoc: (brief: string) => void;
  onGenerateSlides: (brief: string) => void;
  isLoading: boolean;
}

const ActionPanel = ({ onGenerateDoc, onGenerateSlides, isLoading }: ActionPanelProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Generate Assets</h2>
      <p className="text-sm text-gray-500 mb-6">Select an output format to generate with the Gemini AI.</p>
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => onGenerateDoc(PROJECT_BRIEF_TEXT)}
          disabled={isLoading}
          className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <DocIcon className="w-5 h-5 mr-2" />
          Generate Google Doc
        </button>
        <button
          onClick={() => onGenerateSlides(PROJECT_BRIEF_TEXT)}
          disabled={isLoading}
          className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white bg-amber-500 rounded-lg shadow-sm hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          <SlidesIcon className="w-5 h-5 mr-2" />
          Generate Google Slide
        </button>
      </div>
    </div>
  );
};

export default ActionPanel;