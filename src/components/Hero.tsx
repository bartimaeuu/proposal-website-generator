import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { oembed } from '@loomhq/loom-embed';

interface HeroProps {
  clientName: string;
  projectTitle: string;
  description: string;
  loomVideoUrl: string;
}

const rainbowGradient = `linear-gradient(90deg, 
  hsl(0, 100%, 63%),
  hsl(270, 100%, 63%),
  hsl(210, 100%, 63%),
  hsl(195, 100%, 63%),
  hsl(90, 100%, 63%)
)`;

export const Hero: React.FC<HeroProps> = ({ clientName, projectTitle, description, loomVideoUrl }) => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [embedHtml, setEmbedHtml] = useState<string>('');

  useEffect(() => {
    async function setupLoom() {
      if (!loomVideoUrl) {
        setEmbedHtml('');
        return;
      }
      
      try {
        const { html } = await oembed(loomVideoUrl);
        setEmbedHtml(html);
      } catch (error) {
        console.error('Error loading Loom video:', error);
        setEmbedHtml('');
      }
    }
    setupLoom();
  }, [loomVideoUrl]);

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    const problemSection = document.getElementById('problem');
    if (problemSection) {
      problemSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100/40 via-transparent to-transparent" />
      </div>

      <div className="relative pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          <motion.div
            style={{ opacity }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 tracking-tight mb-4">
              {projectTitle}
            </h1>
            <p className="mt-2 text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-12">
              {description}
            </p>
          </motion.div>

          {loomVideoUrl && embedHtml && (
            <div className="max-w-6xl mx-auto">
              <div className="relative group">
                <div 
                  className="absolute -inset-0.5 rounded-xl opacity-75 blur-xl transition duration-1000 group-hover:opacity-100
                    animate-rainbow bg-[length:200%]"
                  style={{ background: rainbowGradient }}
                />
                <div className="relative rounded-xl overflow-hidden bg-white aspect-video">
                  <div 
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{ __html: embedHtml }}
                  />
                </div>
              </div>
            </div>
          )}

          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-gray-600 mb-4">
              {loomVideoUrl && embedHtml ? (
                <>
                  <p className="text-lg font-medium">Watch the overview above</p>
                  <p className="text-base">Then explore the detailed proposal below</p>
                </>
              ) : (
                <p className="text-lg font-medium">Explore the detailed proposal below</p>
              )}
            </div>
            <button
              onClick={handleViewDetails}
              className="group inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Full Details
              <ChevronDown className="h-5 w-5 animate-bounce" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};