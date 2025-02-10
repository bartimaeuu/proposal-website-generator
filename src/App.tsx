import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { PasswordProtection } from './components/PasswordProtection';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Workflows } from './components/Workflows';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { Architecture } from './components/Architecture';
import { Process } from './components/Process';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQ';
import { SocialProof } from './components/SocialProof';
import { Scope } from './components/Scope';
import { NextSteps } from './components/NextSteps';
import { Contact } from './components/Contact';
import { loadProposalContent } from './utils/proposal';
import { WithFeedback } from './components/WithFeedback';
import { ActiveSectionProvider } from './context/ActiveSectionContext';
import { ContentType } from './types/content';
import { EnvTest } from './components/EnvTest';

const ProposalPage: React.FC = () => {
  const { proposalId = 'default' } = useParams();
  const [content, setContent] = useState<ContentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Loading proposal:', proposalId);
        
        const proposalContent = await loadProposalContent(proposalId);
        
        // If proposal requires password and not authenticated, don't set content yet
        if (proposalContent.password && !isAuthenticated) {
          setContent({ ...proposalContent, password: proposalContent.password });
        } else {
          setContent(proposalContent);
        }
      } catch (err) {
        console.error('Failed to load proposal:', err);
        setError(err instanceof Error ? err.message : 'Failed to load proposal');
        setContent(null);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [proposalId, isAuthenticated]);

  const handleAuthentication = (password: string) => {
    if (content?.password === password) {
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Invalid password');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading proposal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Proposal</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-gray-500 text-sm">
            Please check that the proposal ID is correct and try again.
            If the problem persists, contact support.
          </p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Proposal Not Found</h2>
          <p className="text-gray-600">
            The proposal you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // Show password protection if needed
  if (content?.password && !isAuthenticated) {
    return (
      <PasswordProtection
        onAuthenticated={handleAuthentication}
        error={authError}
        password={content.password}
      />
    );
  }

  // Check expiration
  if (content?.expirationDate) {
    const expirationDate = new Date(content.expirationDate);
    if (expirationDate < new Date()) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Proposal Expired</h2>
            <p className="text-gray-600">
              This proposal has expired. Please contact us for an updated proposal.
            </p>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header clientName={content.clientName} projectTitle={content.projectTitle} />
      <WithFeedback
        proposalId={proposalId}
        sectionId="hero"
        sectionTitle="Introduction"
      >
        <Hero
          clientName={content.clientName}
          projectTitle={content.projectTitle}
          description={content.description}
          loomVideoUrl={content.loomVideoUrl}
        />
      </WithFeedback>
      
      {content.whyThisProject && content.whyThisProject.length > 0 && (
        <WithFeedback
          proposalId={proposalId}
          sectionId="why-workflowsy"
          sectionTitle="Why Workflowsy"
        >
          <Workflows content={content} />
        </WithFeedback>
      )}
      
      {content.problemStatement && (
        <WithFeedback
          proposalId={proposalId}
          sectionId="problem"
          sectionTitle="Problem Statement"
        >
          <Problem content={content} />
        </WithFeedback>
      )}
      
      {content.solutionDescription && (
        <WithFeedback
          proposalId={proposalId}
          sectionId="solution"
          sectionTitle="Solution"
        >
          <Solution content={content} />
        </WithFeedback>
      )}
      
      {content.architecture && (
        <WithFeedback
          proposalId={proposalId}
          sectionId="architecture"
          sectionTitle="Technical Architecture"
        >
          <Architecture content={content} diagramUrl={content.architecture.diagramUrl} />
        </WithFeedback>
      )}
      
      <div className="py-12 bg-gray-50">
        <SocialProof />
      </div>
      
      {content.process && (
        <WithFeedback
          proposalId={proposalId}
          sectionId="process"
          sectionTitle="Process"
        >
          <Process content={content} />
        </WithFeedback>
      )}
      
      {content.scope && (
        <WithFeedback
          proposalId={proposalId}
          sectionId="scope"
          sectionTitle="Scope"
        >
          <Scope content={content} />
        </WithFeedback>
      )}
      
      {content.nextSteps && (
        <WithFeedback
          proposalId={proposalId}
          sectionId="next-steps"
          sectionTitle="Next Steps"
        >
          <NextSteps content={content} />
        </WithFeedback>
      )}
      
      {content.pricing && content.pricing.includedFeatures && content.pricing.includedFeatures.length > 0 && (
        <WithFeedback
          proposalId={proposalId}
          sectionId="pricing"
          sectionTitle="Pricing"
        >
          <PricingSection
            projectType={content.projectType}
            price={content.price}
            stripePaymentLink={content.stripePaymentLink}
            content={content}
          />
        </WithFeedback>
      )}
      
      {content.faq && content.faq.faqs && content.faq.faqs.length > 0 && (
        <WithFeedback
          proposalId={proposalId}
          sectionId="faq"
          sectionTitle="FAQ"
        >
          <FAQSection content={content} />
        </WithFeedback>
      )}
      
      <WithFeedback
        proposalId={proposalId}
        sectionId="contact"
        sectionTitle="Contact"
      >
        <Contact content={content} />
      </WithFeedback>
      
      <EnvTest />
      
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ActiveSectionProvider>
      <Router>
        <Routes>
          <Route path="/:proposalId?" element={<ProposalPage />} />
        </Routes>
      </Router>
    </ActiveSectionProvider>
  );
}

export default App;