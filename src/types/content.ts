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

export interface ContentType {
  clientName: string;
  projectTitle: string;
  industry: string;
  description: string;
  loomVideoUrl: string;
  password: string;
  projectType: string;
  price: number;
  stripePaymentLink: string;
  expirationDate: string; // ISO date string
  problemStatement: string;
  solutionDescription: string;
  benefits: string[];
  whyThisProject: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  impacts: Array<{
    icon: string;
    title: string;
    description: string;
    metric: string;
  }>;
  consequences: {
    shortTerm: string[];
    longTerm: string[];
  };
  solutionFeatures: Array<{
    name: string;
    description: string;
    icon: string;
    benefits: string[];
  }>;
  architecture: {
    description: string;
    sections: Array<{
      title: string;
      items: string[];
    }>;
    diagramUrl?: string;
  };
  scope: {
    description: string;
    items: Array<{
      title: string;
      description: string;
      deliverables: string[];
      features: string[];
    }>;
  };
  process: {
    description: string;
    steps: Array<{
      title: string;
      description: string;
      duration: string;
      deliverables: string[];
      activities: string[];
    }>;
  };
  nextSteps: {
    title: string;
    subtitle: string;
    description: string;
    steps: Array<{
      icon: string;
      title: string;
      description: string;
      details: string[];
    }>;
  };
  faq: {
    title: string;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
  pricing: {
    description: string;
    includedFeatures: Array<{
      icon: string;
      title: string;
      items: string[];
    }>;
    paymentTerms: string[];
    additionalCosts: string[];
  };
  processSteps: Array<{
    title: string;
    description: string;
  }>;
  timelineEvents: Array<{
    title: string;
    description: string;
    duration: string;
  }>;
  contact: {
    email: string;
    phone: string;
    calendly: string;
    socialMedia?: {
      linkedin?: string;
      twitter?: string;
      github?: string;
    };
  };
  testimonials: Array<{
    name: string;
    title: string;
    company: string;
    testimonial: string;
  }>;
}