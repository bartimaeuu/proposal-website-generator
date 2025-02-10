import { ContentType } from '../types/content';

type TemplateVariables = {
  [key: string]: string;
};

const resolveTemplateString = (str: string, variables: TemplateVariables): string => {
  return str.replace(/\${(\w+)}/g, (match, key) => variables[key] || match);
};

const resolveContent = (content: ContentType): ContentType => {
  
  try {
    const variables = {
      clientName: content.clientName,
      projectTitle: content.projectTitle,
      industry: content.industry
    };

    const resolveObject = (obj: any): any => {
      if (typeof obj === 'string') {
        return resolveTemplateString(obj, variables);
      }
      
      if (Array.isArray(obj)) {
        return obj.map(item => resolveObject(item));
      }
      
      if (obj && typeof obj === 'object') {
        const resolved: any = {};
        for (const [key, value] of Object.entries(obj)) {
          resolved[key] = resolveObject(value);
        }
        return resolved;
      }
      
      return obj;
    };

    const resolvedContent = {
      ...content,
      whyThisProject: content.whyThisProject || [],
      benefits: content.benefits || [],
      impacts: content.impacts || [],
      consequences: content.consequences || [],
      solutionFeatures: content.solutionFeatures || [],
      process: {
        ...content.process,
        steps: content.process?.steps || []
      },
      scope: {
        ...content.scope,
        includedFeatures: content.scope?.includedFeatures || [],
        excludedFeatures: content.scope?.excludedFeatures || []
      },
      pricing: {
        ...content.pricing,
        includedFeatures: content.pricing?.includedFeatures || []
      },
      faq: {
        ...content.faq,
        faqs: content.faq?.faqs || []
      }
    };

    const resolvedResolvedContent = resolveObject(resolvedContent);

    console.log('Resolved content:', resolvedResolvedContent);
    return resolvedResolvedContent;
  } catch (error) {
    console.error('Error resolving content:', error);
    throw error;
  }
};

export { resolveContent };
