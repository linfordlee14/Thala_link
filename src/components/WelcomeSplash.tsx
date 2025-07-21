import React from 'react';
import { DocIcon, SlidesIcon } from './Icons';

export const WelcomeSplash = () => {
  return (
    <div className="text-center text-gray-500 animate-fade-in">
      <div className="flex justify-center space-x-4 mb-6">
        <DocIcon className="w-16 h-16 text-blue-400" />
        <SlidesIcon className="w-16 h-16 text-amber-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-700">AI-Powered Document Creation</h2>
      <p className="mt-2 max-w-md mx-auto">
        Use the panel on the left to instantly generate a professional document or a presentation from the project brief.
      </p>
    </div>
  );
};