import React, { createContext, useContext, useState, useEffect } from 'react';

interface ActiveSectionContextType {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ActiveSectionContext = createContext<ActiveSectionContextType>({
  activeSection: '',
  setActiveSection: () => {},
});

export const useActiveSection = () => useContext(ActiveSectionContext);

export const ActiveSectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'hero',
        'why-workflowsy',
        'problem',
        'solution',
        'architecture',
        'process',
        'scope',
        'pricing',
        'faq',
        'next-steps',
        'contact'
      ];

      // Find the section that is currently in view
      const viewportHeight = window.innerHeight;
      const headerOffset = 80; // Height of the fixed header
      let currentSection = '';

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const sectionTop = rect.top;
          const sectionBottom = rect.bottom;
          
          // Check if the section is in the middle third of the viewport
          if (sectionTop < (viewportHeight * 2/3) && sectionBottom > (viewportHeight * 1/3)) {
            currentSection = sectionId;
            break;
          }
        }
      }

      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection]);

  return (
    <ActiveSectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </ActiveSectionContext.Provider>
  );
};
