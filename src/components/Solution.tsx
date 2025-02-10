import React from 'react';
import * as LucideIcons from 'lucide-react';

interface SolutionProps {
  content: {
    solutionDescription: string;
    benefits: string[];
    solutionFeatures: Array<{
      name: string;
      description: string;
      icon: string;
      benefits: string[];
    }>;
  };
}

export const Solution: React.FC<SolutionProps> = ({ content }) => {
  const { solutionDescription, benefits, solutionFeatures } = content;

  const getIconByName = (iconName: string) => {
    const MaybeIcon = LucideIcons[iconName as keyof typeof LucideIcons];
    if (!MaybeIcon) {
      console.warn(`Icon '${iconName}' not found in lucide-react. Falling back to AlertTriangle.`);
      return LucideIcons['AlertTriangle'];
    }
    return MaybeIcon;
  };

  // Process the features data to include actual icon components
  const features = solutionFeatures.map((feature) => ({
    ...feature,
    icon: getIconByName(feature.icon),
  }));

  return (
    <section id="solution" className="py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Solution</h2>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl">{solutionDescription}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.name}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center text-gray-600">
                    <LucideIcons.Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-indigo-50 rounded-2xl p-8 lg:max-w-none">
          <h3 className="text-2xl font-semibold text-indigo-900 mb-6">Key Benefits</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center text-lg text-indigo-900">
                <LucideIcons.ArrowRight className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};