import React from "react";
import { ClipboardCheck, ArrowRight, CheckCircle2 } from "lucide-react";

interface ScopeProps {
  content: {
    scope: {
      description: string;
      items: {
        title: string;
        description: string;
        deliverables: string[];
        features: string[];
      }[];
    };
  };
}

export const Scope: React.FC<ScopeProps> = ({ content }) => {
  return (
    <div id="scope" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <div className="flex justify-center">
            <div className="rounded-lg bg-indigo-600 p-4">
              <ClipboardCheck className="h-16 w-16 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Project Scope
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            {content.scope.description}
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-12">
            {content.scope.items.map((item) => (
              <div key={item.title} className="relative bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors">
                <h3 className="text-3xl font-semibold leading-7 text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-xl leading-7 text-gray-600 mb-6">
                  {item.description}
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-2xl font-semibold text-indigo-600 mb-4">Deliverables</h4>
                    <ul className="space-y-4">
                      {item.deliverables.map((deliverable) => (
                        <li key={deliverable} className="flex items-start gap-3 text-lg">
                          <ArrowRight className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                          <span className="text-gray-700">{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-2xl font-semibold text-indigo-600 mb-4">Key Features</h4>
                    <ul className="space-y-4">
                      {item.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-lg">
                          <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                          <span className="text-gray-700">{feature}</span>
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
}