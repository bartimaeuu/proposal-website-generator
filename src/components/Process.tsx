import React from 'react';
import { Workflow, ArrowRight } from 'lucide-react';

interface ProcessStep {
  title: string;
  description: string;
  duration?: string;
  deliverables?: string[];
  activities?: string[];
}

interface ProcessProps {
  content: {
    process: {
      description: string;
      steps: ProcessStep[];
    };
  };
}

export const Process: React.FC<ProcessProps> = ({ content }) => {
  return (
    <div className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <Workflow className="h-16 w-16 text-indigo-600 mx-auto" />
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Implementation Process
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            {content.process.description}
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="space-y-12">
            {content.process.steps.map((step, index) => (
              <div key={step.title} className="relative bg-white rounded-lg shadow-sm p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-600 text-white text-2xl font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-lg text-indigo-600">{step.duration}</p>
                  </div>
                </div>
                
                <p className="text-xl text-gray-600 mb-6">{step.description}</p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Deliverables</h4>
                    <ul className="space-y-3">
                      {step.deliverables?.map((deliverable) => (
                        <li key={deliverable} className="flex items-start gap-2 text-lg text-gray-600">
                          <ArrowRight className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-1" />
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Activities</h4>
                    <ul className="space-y-3">
                      {step.activities?.map((activity) => (
                        <li key={activity} className="flex items-start gap-2 text-lg text-gray-600">
                          <ArrowRight className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-1" />
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};