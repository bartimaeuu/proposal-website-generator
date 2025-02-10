import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, MessageSquare } from 'lucide-react';
import { Feedback, FeedbackFormData } from '../types/feedback';
import { CommentsSidebar } from './CommentsSidebar';
import { useActiveSection } from '../context/ActiveSectionContext';

interface InlineFeedbackProps {
  proposalId: string;
  sectionId: string;
  sectionTitle: string;
  onSubmit: (feedback: FeedbackFormData) => Promise<void>;
  existingFeedback?: Feedback[];
  children: React.ReactNode;
}

export const InlineFeedback: React.FC<InlineFeedbackProps> = ({
  proposalId,
  sectionId,
  sectionTitle,
  onSubmit,
  existingFeedback = [],
  children
}) => {
  const { activeSection } = useActiveSection();
  
  // Define sections first
  const sections = [
    { id: 'hero', title: 'Introduction' },
    { id: 'why-workflowsy', title: 'Why Workflowsy' },
    { id: 'problem', title: 'Business Challenge' },
    { id: 'solution', title: 'Solution' },
    { id: 'architecture', title: 'Technical Architecture' },
    { id: 'process', title: 'Process' },
    { id: 'scope', title: 'Scope' },
    { id: 'pricing', title: 'Pricing' },
    { id: 'faq', title: 'FAQ' },
    { id: 'next-steps', title: 'Next Steps' },
    { id: 'contact', title: 'Contact' }
  ];

  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [comments, setComments] = useState('');
  const [commenterName, setCommenterName] = useState(() => {
    return localStorage.getItem('commenterName') || '';
  });

  // Get current section based on activeSection or fallback to props
  const getCurrentSection = () => {
    const currentId = activeSection || sectionId;
    const section = sections.find(s => s.id === currentId);
    return {
      id: currentId,
      title: section?.title || sectionTitle
    };
  };

  const [selectedSection, setSelectedSection] = useState(getCurrentSection());

  // Update selectedSection whenever activeSection changes
  useEffect(() => {
    const current = getCurrentSection();
    setSelectedSection(current);
  }, [activeSection]);

  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [showExistingComments, setShowExistingComments] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleCommentButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingComment(true);
    
    // Update selected section when opening comment form
    const current = getCurrentSection();
    setSelectedSection(current);
    
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        x: e.clientX,
        y: window.scrollY + rect.top + (e.clientY - rect.top)
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isAddingComment && !sectionRef.current?.contains(e.target as Node)) {
        setIsAddingComment(false);
        setPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAddingComment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commenterName.trim()) {
      alert('Please enter your name');
      return;
    }

    try {
      // Save commenter name to localStorage
      localStorage.setItem('commenterName', commenterName);

      await onSubmit({
        comments,
        commenterName,
        sectionId: selectedSection.id,
        sectionTitle: selectedSection.title
      });

      setComments('');
      setIsAddingComment(false);
      setPosition(null);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit comment. Please try again.');
    }
  };

  return (
    <div ref={sectionRef} className="relative group">
      {children}

      {/* Existing Comment Indicators */}
      {existingFeedback.map((feedback) => (
        <div
          key={feedback.id}
          className="absolute w-6 h-6 -mt-3 -ml-3 cursor-pointer"
          style={{
            left: `${feedback.position?.x}%`,
            top: `${feedback.position?.y}%`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setShowExistingComments(!showExistingComments);
          }}
        >
          <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse" />
        </div>
      ))}

      {/* Comment Form */}
      {isAddingComment && position && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setIsAddingComment(false);
            setPosition(null);
          }}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Comment</h3>
              <button
                onClick={() => {
                  setIsAddingComment(false);
                  setPosition(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!localStorage.getItem('commenterName') && (
                <div>
                  <label htmlFor="commenterName" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="commenterName"
                    value={commenterName}
                    onChange={(e) => setCommenterName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
                  Section
                </label>
                <select
                  value={selectedSection.id}
                  onChange={(e) => {
                    const section = sections.find(s => s.id === e.target.value);
                    if (section) {
                      setSelectedSection({
                        id: section.id,
                        title: section.title
                      });
                    }
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                >
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                  Please note: Do not include any confidential information in your comments as they will be visible to others viewing this proposal.
                </div>
                <div>
                  <label
                    htmlFor="comments"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Comments
                  </label>
                  <textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your comment..."
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comment Button Group */}
      <div className="fixed bottom-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="bg-white text-indigo-600 rounded-full p-4 shadow-lg hover:bg-gray-50 transition-colors z-40 flex items-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          <span>View Comments {existingFeedback.length > 0 && `(${existingFeedback.length})`}</span>
        </button>
        <button
          onClick={handleCommentButtonClick}
          className="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-colors z-40 flex items-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Add Comment</span>
        </button>
      </div>

      {/* Comments Sidebar */}
      <CommentsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        feedback={existingFeedback}
      />

      {/* Existing Comments Panel */}
      {showExistingComments && existingFeedback.length > 0 && (
        <div 
          className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg p-4 overflow-y-auto z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Comments</h3>
            <button
              onClick={() => setShowExistingComments(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            {existingFeedback.map((feedback) => (
              <div key={feedback.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-800">{feedback.comments}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
