import React from 'react';
import { Network } from 'lucide-react';

interface ArchitectureProps {
  diagramUrl?: string;
  content: {
    architecture: {
      description: string;
      sections: {
        title: string;
        items: string[];
      }[];
    };
  };
}

export const Architecture: React.FC<ArchitectureProps> = ({ diagramUrl, content }) => {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <Network className="h-16 w-16 text-indigo-600 mx-auto" />
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Technical Architecture
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            {content.architecture.description}
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          {diagramUrl ? (
            <img
              src={diagramUrl}
              alt="System Architecture"
              className="rounded-lg shadow-xl max-w-full"
            />
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-dashed border-gray-300 max-w-3xl w-full">
              <p className="text-xl text-gray-500 text-center">
                Technical architecture diagram will be provided during the project kickoff
              </p>
            </div>
          )}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {content.architecture.sections.map((section) => (
            <div key={section.title} className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-4 text-lg text-gray-600">
                {section.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}