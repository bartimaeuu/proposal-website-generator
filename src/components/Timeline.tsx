import React from 'react';
import { Clock } from 'lucide-react';

interface TimelineEvent {
  title: string;
  description: string;
  duration: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events = [] }) => {
  return (
    <div className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <Clock className="h-12 w-12 text-indigo-600 mx-auto" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Implementation Timeline
          </h2>
        </div>
        <div className="mx-auto mt-16 max-w-2xl">
          <div className="space-y-8">
            {events.map((event, index) => (
              <div key={index} className="relative">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <span className="font-semibold">{index + 1}</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{event.duration}</p>
                  </div>
                </div>
                <p className="mt-3 text-base text-gray-600 ml-16">{event.description}</p>
                {index < events.length - 1 && (
                  <div className="absolute left-6 top-12 h-8 w-px bg-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};