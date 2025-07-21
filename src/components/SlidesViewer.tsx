import React from 'react';
import type { SlideContent } from '../types';
import { generatePptx } from '../services/fileGenerator';
import { DownloadIcon, IdeaIcon } from './Icons';

interface SlidesViewerProps {
  content: SlideContent[];
}

const slideColors = [
    'bg-blue-50 border-blue-200',
    'bg-green-50 border-green-200',
    'bg-yellow-50 border-yellow-200',
    'bg-purple-50 border-purple-200',
    'bg-pink-50 border-pink-200',
    'bg-indigo-50 border-indigo-200'
];

const SlidesViewer = ({ content }: SlidesViewerProps) => {
  const handleDownload = async () => {
    await generatePptx(content);
  };

  return (
    <div className="w-full h-full flex flex-col animate-fade-in">
        <div className="flex justify-between items-center mb-6 px-4">
            <h2 className="text-2xl font-bold text-gray-700">Generated Presentation</h2>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              aria-label="Download Presentation"
              title="Download as .pptx"
            >
              <DownloadIcon className="w-5 h-5" />
              <span>Download</span>
            </button>
        </div>

        <div className="flex-grow flex items-center pb-4">
            <div className="flex space-x-6 overflow-x-auto w-full p-4 snap-x snap-mandatory">
                {content.map((slide, index) => (
                <div 
                    key={index} 
                    className={`snap-center flex-shrink-0 w-11/12 md:w-3/4 lg:w-2/3 h-[450px] rounded-xl shadow-lg p-8 flex flex-col border-2 transform transition-transform hover:scale-105 relative ${slideColors[index % slideColors.length]}`}
                >
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">{slide.title}</h3>
                    <ul className="space-y-4 text-lg text-gray-700 list-disc list-inside">
                    {slide.points.map((point, pointIndex) => (
                        <li key={pointIndex}>{point}</li>
                    ))}
                    </ul>
                    {slide.visualSuggestion && (
                        <div className="absolute bottom-4 right-4 mt-4 flex items-center gap-2 bg-yellow-100 text-yellow-800 p-2 rounded-lg text-xs shadow-sm">
                            <IdeaIcon className="w-5 h-5" />
                            <span>{slide.visualSuggestion}</span>
                        </div>
                    )}
                </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default SlidesViewer;