import React from 'react';
import * as LucideIcons from 'lucide-react';

interface PricingProps {
  projectType: string;
  price: number;
  stripePaymentLink: string;
  content: {
    pricing: {
      description: string;
      includedFeatures: Array<{
        title: string;
        icon: string;
        items: Array<string>;
      }>;
      paymentTerms: Array<string>;
      additionalCosts: Array<string>;
    };
  };
}

export const PricingSection: React.FC<PricingProps> = ({ projectType, price, stripePaymentLink, content }) => {
  const getIconByName = (iconName: string) => {
    const MaybeIcon = LucideIcons[iconName as keyof typeof LucideIcons];
    if (!MaybeIcon) {
      console.warn(`Icon '${iconName}' not found in lucide-react. Falling back to AlertTriangle.`);
      return LucideIcons['AlertTriangle'];
    }
    return MaybeIcon;
  };

  const deposit = price * 0.25;

  const includedFeatures = content.pricing.includedFeatures.map((feature) => ({
    ...feature,
    icon: getIconByName(feature.icon),
  }));

  return (
    <div id="pricing" className="py-24 bg-white sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Investment Details
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Project Investment</h3>
            <p className="mt-6 text-base leading-7 text-gray-600">
              {content.pricing.description}
            </p>
            
            {includedFeatures.map((category) => (
              <div key={category.title} className="mt-10">
                <div className="flex items-center gap-x-4">
                  <category.icon className="h-5 w-5 text-indigo-600" />
                  <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">{category.title}</h4>
                  <div className="h-px flex-auto bg-gray-100"></div>
                </div>
                <ul role="list" className="mt-4 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6">
                  {category.items.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <LucideIcons.Check className="h-6 w-5 flex-none text-indigo-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">Fixed Price Project</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">${price.toLocaleString()}</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">USD</span>
                </p>
                <p className="mt-6 text-sm font-medium text-gray-600">
                  25% deposit (${deposit.toLocaleString()} USD) required to begin
                </p>
                
                {stripePaymentLink ? (
                  <>
                    <a
                      href={stripePaymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-8 block w-full rounded-md bg-indigo-600 px-3 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Pay Deposit Now
                      <LucideIcons.ExternalLink className="ml-2 inline-block h-4 w-4" />
                    </a>
                    <p className="mt-2 text-xs text-gray-500">
                      Secure payment processed by Stripe
                    </p>
                  </>
                ) : (
                  <div className="mt-8 text-sm text-gray-600">
                    <p>Contact us to discuss payment options and begin your project.</p>
                  </div>
                )}

                <div className="mt-8 text-sm">
                  <p className="font-semibold text-gray-900 mb-3">Payment Terms</p>
                  <ul className="space-y-2 text-gray-600 text-left">
                    {content.pricing.paymentTerms.map((term) => (
                      <li key={term}>• {term}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 text-sm">
                  <p className="font-semibold text-gray-900 mb-3">Additional Costs</p>
                  <ul className="space-y-2 text-gray-600 text-left">
                    {content.pricing.additionalCosts.map((cost) => (
                      <li key={cost}>• {cost}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};