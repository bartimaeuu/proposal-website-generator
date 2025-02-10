import React from 'react';
import * as LucideIcons from 'lucide-react';

interface NextStepsProps {
  content: {
    nextSteps: {
      description: string;
      steps: Array<{
        title: string;
        description: string;
        icon: string;
        details: Array<string>;
      }>;
      subtitle: string;
      title: string;
    };
  };
}

export const NextSteps: React.FC<NextStepsProps> = ({ content }) => {
  const getIconByName = (iconName: string) => {
    const MaybeIcon = LucideIcons[iconName as keyof typeof LucideIcons];
    if (!MaybeIcon) {
      console.warn(`Icon '${iconName}' not found in lucide-react. Falling back to AlertTriangle.`);
      return LucideIcons['AlertTriangle'];
    }
    return MaybeIcon;
  };

  const steps = content.nextSteps.steps.map((step) => ({
    ...step,
    icon: getIconByName(step.icon),
  }));

  return (
    <div id="next-steps" className="bg-gradient-to-b from-white to-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-xl font-semibold leading-7 text-indigo-600">{content.nextSteps.subtitle}</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {content.nextSteps.title}
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            {content.nextSteps.description}
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:max-w-none">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.title} className="relative pl-16">
                <div className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-lg bg-indigo-600">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <div className="mt-1">
                  <h3 className="text-2xl font-semibold leading-8 tracking-tight text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-lg leading-7 text-gray-600">{step.description}</p>
                  <ul className="mt-4 space-y-3">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center text-lg text-gray-500">
                        <LucideIcons.ArrowRight className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};