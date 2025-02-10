export interface FeedbackFormData {
  comments: string;
  commenterName: string;
  sectionId: string;
  sectionTitle: string;
}

export interface Feedback extends FeedbackFormData {
  id: string;
  proposalId: string;
  createdAt: string;
  position?: {
    x: number;  // Relative position within the section
    y: number;
  };
}
