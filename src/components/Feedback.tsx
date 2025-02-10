import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { FeedbackFormData } from '../types/feedback';
import { getFeedbackForSection } from '../utils/feedback';

interface FeedbackProps {
  proposalId: string;
  sectionId: string;
  onSubmit: (feedback: FeedbackFormData) => Promise<void>;
}

export const Feedback: React.FC<FeedbackProps> = ({ proposalId, sectionId, onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadFeedback = async () => {
      try {
        setIsLoading(true);
        const sectionFeedback = await getFeedbackForSection(proposalId, sectionId);
        if (mounted) {
          setFeedback(sectionFeedback);
        }
      } catch (error) {
        console.error('Error loading feedback:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadFeedback();
    return () => {
      mounted = false;
    };
  }, [proposalId, sectionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({ rating, comments });
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setRating(0);
        setComments('');
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-colors z-50"
        style={{ position: 'fixed' }}
      >
        Leave Feedback
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Feedback</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {!isLoading && feedback.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Previous Feedback</h3>
            {feedback.map((item) => (
              <div key={item.id} className="bg-gray-50 p-3 rounded mb-2">
                <div className="flex items-center mb-1">
                  <span className="font-medium">{item.commenterName}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{item.comments}</p>
              </div>
            ))}
          </div>
        )}

        {!submitted && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        value <= rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="comments"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Comments
              </label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                rows={4}
                placeholder="Share your thoughts..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
