import React from 'react';
import * as LucideIcons from 'lucide-react';
// import { AlertTriangle, TrendingDown, DollarSign, Clock, Users } from 'lucide-react';

interface ProblemProps {
  content: {
    problemStatement: string;
    impacts: {
      title: string;
      description: string;
      metric: string;
      icon: string;
    }[];
    consequences: {
      shortTerm: string[];
      longTerm: string[];
    };
  };
}

export const Problem: React.FC<ProblemProps> = ({ content }) => {
  const getIconByName = (iconName: string) => {
    const MaybeIcon = LucideIcons[iconName as keyof typeof LucideIcons];
    if (!MaybeIcon) {
      console.warn(`Icon '${iconName}' not found in lucide-react. Falling back to AlertTriangle.`);
      return LucideIcons['AlertTriangle'];
    }
    return MaybeIcon;
  };

  // Process the impacts data to include actual icon components
  const impacts = content.impacts.map((impact) => ({
    ...impact,
    icon: getIconByName(impact.icon),
  }));

  const { consequences } = content;

  return (
    <div id="problem" className="bg-gradient-to-b from-red-50 to-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <LucideIcons.AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            The Business Challenge
          </h2>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Current Situation</h3>
            <p className="text-xl leading-8 text-gray-600">
              {content.problemStatement}
            </p>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Impact on Your Business
          </h3>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {impacts.map((impact) => (
              <div key={impact.title} className="relative bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="absolute -top-4 left-4">
                  <div className="rounded-lg bg-red-100 p-3">
                    <impact.icon className="h-7 w-7 text-red-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-xl font-semibold text-gray-900">{impact.title}</h4>
                  <p className="mt-2 text-lg text-gray-600">{impact.description}</p>
                  <p className="mt-4 text-xl font-semibold text-red-600">{impact.metric}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-red-50 rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Why This Needs to Change</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Short-term Consequences</h4>
                <ul className="space-y-3">
                  {consequences.shortTerm.map((item) => (
                    <li key={item} className="flex items-center text-lg text-gray-600">
                      <span className="text-red-600 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Long-term Risks</h4>
                <ul className="space-y-3">
                  {consequences.longTerm.map((item) => (
                    <li key={item} className="flex items-center text-lg text-gray-600">
                      <span className="text-red-600 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};