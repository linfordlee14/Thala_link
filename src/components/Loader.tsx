import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700">Generating with Gemini...</p>
      <p className="text-sm text-gray-500">This may take a moment.</p>
    </div>
  );
};

export default Loader;