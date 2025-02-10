import React, { useState, useEffect } from 'react';
import { InlineFeedback } from './InlineFeedback';
import { getFeedbackForSection, getFeedbackForProposal, submitFeedback } from '../utils/feedback';
import { Feedback } from '../types/feedback';

interface WithFeedbackProps {
  proposalId: string;
  sectionId: string;
  sectionTitle: string;
  children: React.ReactNode;
}

export const WithFeedback: React.FC<WithFeedbackProps> = ({
  proposalId,
  sectionId,
  sectionTitle,
  children,
}) => {
  const [allFeedback, setAllFeedback] = useState<Feedback[]>([]);
  const [sectionFeedback, setSectionFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        // Get all feedback for the proposal
        const proposalFeedback = await getFeedbackForProposal(proposalId);
        setAllFeedback(proposalFeedback);

        // Get feedback specific to this section
        const feedbackForSection = await getFeedbackForSection(proposalId, sectionId);
        setSectionFeedback(feedbackForSection);
      } catch (error) {
        console.error('Error loading feedback:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedback();
  }, [proposalId, sectionId]);

  const handleSubmitFeedback = async (feedbackData: any) => {
    try {
      await submitFeedback(proposalId, {
        ...feedbackData,
        sectionId,
        sectionTitle
      });

      // Update feedback after submission
      const updatedProposalFeedback = await getFeedbackForProposal(proposalId);
      setAllFeedback(updatedProposalFeedback);

      const updatedSectionFeedback = await getFeedbackForSection(proposalId, sectionId);
      setSectionFeedback(updatedSectionFeedback);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <InlineFeedback
      proposalId={proposalId}
      sectionId={sectionId}
      sectionTitle={sectionTitle}
      onSubmit={handleSubmitFeedback}
      existingFeedback={allFeedback}
      isLoading={isLoading}
    >
      {children}
    </InlineFeedback>
  );
};
