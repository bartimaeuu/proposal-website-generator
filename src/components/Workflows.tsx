import React from "react";
import * as LucideIcons from "lucide-react";

interface WorkflowsProps {
  content: {
    whyThisProject: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    clientName: string;
  };
}

export const Workflows: React.FC<WorkflowsProps> = ({ content }) => {
  const whyWorkflowsy = [
    {
      title: "Automation Expertise",
      description: "With experience automating processes for Fortune 500 companies, we bring enterprise-grade solutions to businesses of all sizes.",
      icon: LucideIcons.Boxes
    },
    {
      title: "100+ Business Workflows Implemented",
      description: "Proven track record of successful workflow automation projects.",
      icon: LucideIcons.Clock
    },
    {
      title: "Minimal Meetings",
      description: "Efficient project management with minimal disruption to your team.",
      icon: LucideIcons.Target
    }
  ];

  const getIconByName = (iconName: string) => {
    const MaybeIcon = LucideIcons[iconName as keyof typeof LucideIcons];
    if (!MaybeIcon) {
      console.warn(`Icon '${iconName}' not found in lucide-react. Falling back to AlertTriangle.`);
      return LucideIcons['AlertTriangle'];
    }
    return MaybeIcon;
  };

  const whyThisProject = content.whyThisProject.map((item) => ({
    ...item,
    icon: getIconByName(item.icon),
  }));

  return (
    <div id="why-workflowsy" className="bg-gradient-to-b from-white to-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-xl font-semibold leading-7 text-indigo-600">Why Choose Workflowsy</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Expert Automation Partner
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            We specialize in making automation accessible and effective for businesses like {content.clientName}, combining enterprise expertise with personalized service.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {whyWorkflowsy.map((feature) => (
              <div key={feature.title} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-gray-900">
                  <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-indigo-600 text-white">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-lg leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-16 border-t border-gray-200">
            <h3 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-12">
              Why This Solution for {content.clientName}
            </h3>
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {whyThisProject.map((feature) => (
                <div key={feature.title} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-gray-900">
                    <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-indigo-600 text-white">
                      <feature.icon className="h-7 w-7" />
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-lg leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};