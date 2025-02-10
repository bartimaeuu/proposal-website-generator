export interface ProposalContent {
  clientName: string;
  projectTitle: string;
  industry: string;
  description: string;
  loomVideoUrl: string;
  architectureDiagram?: string;
  pricingTiers: PricingTier[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  features: Feature[];
}

export interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface Testimonial {
  name: string;
  company: string;
  quote: string;
  image: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}