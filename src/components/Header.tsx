import React, { useEffect, useState } from 'react';

interface HeaderProps {
  clientName: string;
  projectTitle: string;
}

export const Header: React.FC<HeaderProps> = ({ clientName, projectTitle }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const headerHeight = 80; // Height of the fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navItems = [
    { label: 'Why Workflowsy', href: '#why-workflowsy' },
    { label: 'Business Challenge', href: '#problem' },
    { label: 'Our Solution', href: '#solution' },
    { label: 'Scope', href: '#scope' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Next Steps', href: '#next-steps' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 shadow-lg backdrop-blur-lg'
          : 'bg-white/70 backdrop-blur-md'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50" />
      <nav className="relative mx-auto max-w-7xl px-6 lg:px-8 h-20">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="https://workflowsy-public-assets.s3.us-east-1.amazonaws.com/Workflowsy+Main+Logo_All_Black.png"
              alt="Workflowsy"
              className="h-10"
            />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative px-4 py-2 text-lg font-medium transition-all duration-200 hover:text-indigo-600 group"
              >
                <span className={`relative z-10 ${
                  scrolled ? 'text-gray-700' : 'text-gray-800'
                }`}>
                  {item.label}
                </span>
                <div className="absolute inset-0 h-full w-full rounded-lg bg-indigo-50/0 transition-all duration-200 group-hover:bg-indigo-50/80" />
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-full h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden absolute left-0 right-0 bg-white shadow-lg transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  handleNavClick(e, item.href);
                  setIsMenuOpen(false);
                }}
                className={`block px-4 py-2 text-base font-medium rounded-lg transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 ${
                  scrolled ? 'text-gray-700' : 'text-gray-800'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};