import React from 'react';
import { X, MessageCircle } from 'lucide-react';
import { Feedback } from '../types/feedback';

interface CommentsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: Feedback[];
}

export const CommentsSidebar: React.FC<CommentsSidebarProps> = ({
  isOpen,
  onClose,
  feedback
}) => {
  if (!isOpen) return null;

  // Group feedback by section
  const feedbackBySection = feedback.reduce((acc, item) => {
    if (!acc[item.sectionTitle]) {
      acc[item.sectionTitle] = [];
    }
    acc[item.sectionTitle].push(item);
    return acc;
  }, {} as Record<string, Feedback[]>);

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold">Comments</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4">
          {Object.entries(feedbackBySection).map(([sectionTitle, sectionFeedback]) => (
            <div key={sectionTitle} className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">{sectionTitle}</h3>
              <div className="space-y-4">
                {sectionFeedback.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">
                        {item.commenterName}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-indigo-600 mb-2">
                      {item.sectionTitle}
                    </div>
                    <p className="text-gray-700">{item.comments}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {feedback.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No comments yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
