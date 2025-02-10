import React from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "Head of Sales",
    company: "TechGrowth Inc",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80",
    quote: "Workflowy transformed our sales process. We've seen a 3x increase in productivity since implementation."
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO",
    company: "InnovateCorp",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80",
    quote: "The automation capabilities are incredible. What used to take hours now happens in minutes."
  }
];

const logos = [
  { name: "Acme Corp", url: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&w=120&h=40&q=80" },
  { name: "Globex", url: "https://images.unsplash.com/photo-1614680376408-12c9d0a92876?auto=format&fit=crop&w=120&h=40&q=80" },
  { name: "Hooli", url: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=120&h=40&q=80" }
];

export const SocialProof: React.FC = () => {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Trusted by industry leaders
            </h2>
            <div className="flex flex-col gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.name} className="relative bg-white p-8 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xl font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-lg text-gray-500">{testimonial.role} at {testimonial.company}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <p className="mt-4 text-xl text-gray-600">{testimonial.quote}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-8 border-b border-gray-200 pb-8">
              <div>
                <div className="text-5xl font-bold text-indigo-600">98%</div>
                <div className="mt-2 text-lg text-gray-600">Customer satisfaction rate</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-indigo-600">2.5M+</div>
                <div className="mt-2 text-lg text-gray-600">Hours saved annually</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-indigo-600">500+</div>
                <div className="mt-2 text-lg text-gray-600">Enterprise clients</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-indigo-600">99.9%</div>
                <div className="mt-2 text-lg text-gray-600">System uptime</div>
              </div>
            </div>
            
            <div className="mt-8">
              <p className="text-xl font-semibold text-gray-900">Trusted by leading companies</p>
              <div className="mt-6 grid grid-cols-3 gap-8">
                {logos.map((logo) => (
                  <img
                    key={logo.name}
                    src={logo.url}
                    alt={logo.name}
                    className="h-12 object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}