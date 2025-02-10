import { Feedback, FeedbackFormData } from '../types/feedback';

// Cache feedback in memory to reduce API calls
const feedbackCache: { [key: string]: Feedback[] } = {};

const FEEDBACK_URL = import.meta.env.VITE_FEEDBACK_URL;

export const submitFeedback = async (
  proposalId: string,
  feedbackData: FeedbackFormData
): Promise<void> => {
  const feedback: Feedback = {
    id: Math.random().toString(36).substr(2, 9),
    proposalId,
    ...feedbackData,
    createdAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(FEEDBACK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(feedback)
    });

    if (!response.ok) {
      throw new Error('Failed to submit feedback');
    }

    const { feedback: savedFeedback } = await response.json();
    console.log('Feedback saved:', savedFeedback);

    // Update cache after successful upload
    const existingFeedback = await getFeedbackForProposal(proposalId);
    feedbackCache[proposalId] = [...existingFeedback, feedback];

  } catch (error) {
    console.error('Error submitting feedback:', error);
    // Fallback to localStorage if API fails
    const existingFeedback: Feedback[] = JSON.parse(
      localStorage.getItem('proposal_feedback') || '[]'
    );
    existingFeedback.push(feedback);
    localStorage.setItem('proposal_feedback', JSON.stringify(existingFeedback));
  }
};

export const getFeedbackForSection = async (
  proposalId: string,
  sectionId: string
): Promise<Feedback[]> => {
  const allFeedback = await getFeedbackForProposal(proposalId);
  return allFeedback.filter(feedback => feedback.sectionId === sectionId);
};

export const getFeedbackForProposal = async (proposalId: string): Promise<Feedback[]> => {
  // Check cache first
  if (feedbackCache[proposalId]) {
    console.log('Using cached feedback for:', proposalId);
    return feedbackCache[proposalId];
  }

  console.log('Fetching feedback for:', proposalId);
  try {
    // Get feedback list from Lambda
    console.log('Fetching from:', `${FEEDBACK_URL}?proposalId=${proposalId}`);
    const response = await fetch(`${FEEDBACK_URL}?proposalId=${proposalId}`);
    console.log('Response:', response);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Failed to fetch feedback');
    }
    
    const feedback: Feedback[] = await response.json();
    console.log('Received feedback:', feedback);
    
    // Update cache
    feedbackCache[proposalId] = feedback;
    
    return feedback;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    // Fallback to localStorage if API fails
    const allFeedback: Feedback[] = JSON.parse(
      localStorage.getItem('proposal_feedback') || '[]'
    );
    
    return allFeedback.filter((feedback) => feedback.proposalId === proposalId);
  }
};
