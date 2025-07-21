import React from 'react';
import { PROJECT_BRIEF_TEXT } from '../constants';

const ProjectBrief = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-3 text-gray-700">Project Briefing</h2>
      <div className="prose prose-sm max-w-none h-96 overflow-y-auto pr-2">
        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-600">
            {PROJECT_BRIEF_TEXT}
        </pre>
      </div>
    </div>
  );
};

export default ProjectBrief;