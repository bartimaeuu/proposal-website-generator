import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div>
              <img 
                src="https://workflowsy-public-assets.s3.us-east-1.amazonaws.com/Workflowsy+Main+Logo_All_Black.png"
                alt="Workflowsy"
                className="h-10 brightness-0 invert"
              />
            </div>
            <p className="text-lg leading-7 text-gray-300">
              Transforming business processes through intelligent automation.
            </p>
            <div className="flex space-x-6">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="h-5 w-5" />
                <span className="text-lg">contact@workflowsy.io</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-800 pt-8">
          <p className="text-base leading-6 text-gray-400">
            &copy; {new Date().getFullYear()} Workflowsy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};