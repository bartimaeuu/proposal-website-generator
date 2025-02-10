import { ContentType } from '../types/content';
import { resolveContent } from './contentResolver';

const CLOUDFRONT_URL = import.meta.env.VITE_CLOUDFRONT_URL?.replace(/\/$/, '') || '';

function validateContent(content: any): content is ContentType {
  const requiredFields = [
    'clientName',
    'projectTitle',
    'description'
  ];

  const missingFields = requiredFields.filter(field => !content[field]);
  if (missingFields.length > 0) {
    console.error('Missing required fields:', missingFields);
    return false;
  }

  return true;
}

export function validateProposalContent(content: ContentType): void {
  if (!content) {
    throw new Error('Proposal content is required');
  }

  // Required fields that must be present
  const requiredFields = [
    'clientName',
    'projectTitle',
    'industry',
    'description',
    'projectType',
    'price',
    'problemStatement',
    'solutionDescription',
    'benefits',
    'whyThisProject',
    'impacts',
    'consequences',
    'solutionFeatures',
    'architecture',
    'scope',
    'process',
    'nextSteps',
    'faq',
    'pricing',
    'contact'
  ];

  // Check for missing required fields
  const missingFields = requiredFields.filter(field => !(field in content));
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Additional type validations
  if (!Array.isArray(content.benefits)) {
    throw new Error('Benefits must be an array');
  }

  if (!Array.isArray(content.whyThisProject)) {
    throw new Error('WhyThisProject must be an array');
  }

  if (!Array.isArray(content.impacts)) {
    throw new Error('Impacts must be an array');
  }

  if (!content.consequences || !Array.isArray(content.consequences.shortTerm) || !Array.isArray(content.consequences.longTerm)) {
    throw new Error('Consequences must have shortTerm and longTerm arrays');
  }

  if (!Array.isArray(content.solutionFeatures)) {
    throw new Error('SolutionFeatures must be an array');
  }

  if (!content.architecture || !Array.isArray(content.architecture.sections)) {
    throw new Error('Architecture must have sections array');
  }

  if (!content.scope || !Array.isArray(content.scope.items)) {
    throw new Error('Scope must have items array');
  }

  if (!content.process || !Array.isArray(content.process.steps)) {
    throw new Error('Process must have steps array');
  }

  if (!content.nextSteps || !Array.isArray(content.nextSteps.steps)) {
    throw new Error('NextSteps must have steps array');
  }

  if (!content.faq || !Array.isArray(content.faq.faqs)) {
    throw new Error('FAQ must have faqs array');
  }

  if (!content.pricing || !Array.isArray(content.pricing.includedFeatures)) {
    throw new Error('Pricing must have includedFeatures array');
  }

  if (!content.contact || !content.contact.email) {
    throw new Error('Contact must have an email');
  }
}

export async function loadProposalContent(proposalId: string): Promise<ContentType> {
  try {
    // Ensure we have the CloudFront URL
    if (!CLOUDFRONT_URL) {
      throw new Error('CloudFront URL is not configured');
    }

    // Construct the full URL
    const url = `${CLOUDFRONT_URL}/proposals/${proposalId}.json`;
    console.log('Fetching proposal from:', url);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      console.error('Failed to load proposal:', {
        status: response.status,
        statusText: response.statusText,
        url
      });
      throw new Error(`Failed to load proposal: ${response.statusText}`);
    }

    // Verify content type
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.error('Invalid content type:', contentType);
      throw new Error('Invalid response format');
    }

    const rawContent = await response.json();
    console.log('Raw content loaded:', rawContent);

    // Handle both formats: direct object or array with data property
    let content: ContentType;
    if (Array.isArray(rawContent) && rawContent.length > 0 && rawContent[0].data) {
      console.log('Found proposal data in array format with data property');
      content = rawContent[0].data;
    } else if (rawContent.data) {
      console.log('Found proposal data with data property');
      content = rawContent.data;
    } else {
      console.log('Using direct proposal data');
      content = rawContent;
    }

    // Validate the content structure
    validateProposalContent(content);
    
    // Resolve any dynamic content or placeholders
    const resolvedContent = resolveContent(content);
    console.log('Resolved content:', resolvedContent);
    
    return resolvedContent;
  } catch (error) {
    console.error('Error loading proposal content:', error);
    throw error;
  }
}
