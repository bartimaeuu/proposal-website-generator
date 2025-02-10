import React from 'react';
import { HelpCircle } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  content: {
    faq: {
      faqs: FAQ[];
      title: string;
    };
  };
}

export const FAQSection: React.FC<FAQSectionProps> = ({ content }) => {
  return (
    <div className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <HelpCircle className="h-16 w-16 text-indigo-600 mx-auto" />
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {content.faq.title}
          </h2>
        </div>
        <div className="mx-auto mt-16 max-w-5xl">
          <dl className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {content.faq.faqs.map((faq) => (
              <div key={faq.question} className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
                <dt className="text-xl font-semibold leading-7 text-gray-900">
                  {faq.question}
                </dt>
                <dd className="mt-4 text-lg leading-7 text-gray-600">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};