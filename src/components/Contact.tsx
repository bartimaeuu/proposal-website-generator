import React from 'react';
import { Mail, Phone, Calendar, Clock, MessageSquare, ArrowRight, Linkedin, Twitter, Github } from 'lucide-react';

interface ContactProps {
  content: {
    contact: {
      email: string;
      phone: string;
      calendly: string;
      socialMedia?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
      };
    };
  };
}

export const Contact: React.FC<ContactProps> = ({ content }) => {
  const { contact } = content;

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Still Have Questions?
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            We're here to help! Choose the communication channel that works best for you.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="bg-gray-50 rounded-2xl p-8 space-y-10">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Ways to Connect</h3>
              <div className="space-y-6">
                {contact.email && (
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Email Us</h4>
                      <p className="mt-1 text-lg text-gray-600">{contact.email}</p>
                      <p className="text-sm text-gray-500">Response within 24 hours</p>
                    </div>
                  </div>
                )}
                
                {contact.phone && (
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Call Us</h4>
                      <p className="mt-1 text-lg text-gray-600">{contact.phone}</p>
                      <p className="text-sm text-gray-500">Direct line to our support team</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Office Hours</h4>
                    <p className="mt-1 text-lg text-gray-600">Monday - Friday, 9AM - 6PM EST</p>
                    <p className="text-sm text-gray-500">Available during business hours</p>
                  </div>
                </div>

                {contact.socialMedia && (
                  <div className="flex gap-4 mt-6">
                    {contact.socialMedia.linkedin && (
                      <a href={contact.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600">
                        <Linkedin className="h-6 w-6" />
                      </a>
                    )}
                    {contact.socialMedia.twitter && (
                      <a href={contact.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600">
                        <Twitter className="h-6 w-6" />
                      </a>
                    )}
                    {contact.socialMedia.github && (
                      <a href={contact.socialMedia.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600">
                        <Github className="h-6 w-6" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">What to Expect</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <span className="text-lg text-gray-600">Detailed responses to all your questions</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <span className="text-lg text-gray-600">Technical expertise from our solution architects</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <span className="text-lg text-gray-600">Custom demos and walkthroughs if needed</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <span className="text-lg text-gray-600">Flexible scheduling for your convenience</span>
                </li>
              </ul>
            </div>
          </div>

          {contact.calendly && (
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Schedule a Call</h3>
              <div className="bg-white rounded-xl p-4">
                <iframe
                  src={contact.calendly}
                  width="100%"
                  height="700"
                  frameBorder="0"
                  title="Schedule a call"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};