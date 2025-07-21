import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
          ThalaLink: <span className="text-red-600">AI Document Generator</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">Transforming project briefs into professional documents with Gemini.</p>
      </div>
    </header>
  );
};

export default Header;