import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { zodResponseFormat } from "openai/helpers/zod";
import OpenAI from "openai";
import { Save, Download, FileCode, Eye, Wand2, ChevronDown, KeyRound, EyeOff, Upload, MoreVertical, Loader2 } from 'lucide-react';
import { DynamicList, DynamicObjectList } from './components/DynamicFormFields';
import { LoadExampleButton } from './components/LoadExampleButton';
import { exampleProposal } from '../data/examples/example-proposal';

// Define the form schema using Zod
const proposalSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  projectTitle: z.string().min(1, 'Project title is required'),
  industry: z.string().min(1, 'Industry is required'),
  description: z.string().min(1, 'Description is required'),
  loomVideoUrl: z.string().optional(),
  password: z.string().optional(),
  projectType: z.string().optional(),
  price: z.number().min(0, 'Price must be a positive number'),
  stripePaymentLink: z.string().optional(),
  problemStatement: z.string().min(1, 'Problem statement is required'),
  solutionDescription: z.string().min(1, 'Solution description is required'),
  benefits: z.array(z.string()).min(1, 'At least one benefit is required'),
  whyThisProject: z.array(z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    icon: z.string().min(1, 'Icon is required')
  })),
  impacts: z.array(z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string(),
    metric: z.string()
  })),
  consequences: z.object({
    shortTerm: z.array(z.string()),
    longTerm: z.array(z.string())
  }),
  solutionFeatures: z.array(z.object({
    name: z.string(),
    description: z.string(),
    icon: z.string(),
    benefits: z.array(z.string())
  })),
  architecture: z.object({
    description: z.string(),
    sections: z.array(z.object({
      title: z.string(),
      items: z.array(z.string())
    })),
    diagramUrl: z.string().optional()
  }),
  scope: z.object({
    description: z.string(),
    items: z.array(z.object({
      title: z.string(),
      description: z.string(),
      deliverables: z.array(z.string()),
      features: z.array(z.string())
    }))
  }),
  process: z.object({
    description: z.string(),
    steps: z.array(z.object({
      title: z.string(),
      description: z.string(),
      duration: z.string(),
      deliverables: z.array(z.string()),
      activities: z.array(z.string())
    }))
  }),
  nextSteps: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    steps: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string(),
      details: z.array(z.string())
    }))
  }),
  faq: z.object({
    title: z.string(),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string()
    }))
  }),
  pricing: z.object({
    description: z.string(),
    includedFeatures: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      items: z.array(z.string())
    })),
    paymentTerms: z.array(z.string()),
    additionalCosts: z.array(z.string())
  }),
  expirationDate: z.string().min(1, 'Expiration date is required'),
  processSteps: z.array(z.object({
    title: z.string(),
    description: z.string()
  })).optional(),
  timelineEvents: z.array(z.object({
    title: z.string(),
    description: z.string(),
    duration: z.string()
  })).optional(),
  contact: z.object({
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    calendly: z.string().url('Invalid Calendly URL'),
    socialMedia: z.object({
      linkedin: z.string().url('Invalid LinkedIn URL').optional(),
      twitter: z.string().url('Invalid Twitter URL').optional(),
      github: z.string().url('Invalid GitHub URL').optional()
    }).optional()
  })
});

// Infer TypeScript type from the schema
type ProposalFormData = z.infer<typeof proposalSchema> & {
  // If you decide to collect these from the UI, add them to your schema above.
  processSteps?: { title: string; description: string }[];
  timelineEvents?: { title: string; description: string; duration?: string }[];
};

// Define the schema for the proposal content
const ProposalContentSchema = z.object({
  clientName: z.string(),
  projectTitle: z.string(),
  industry: z.string(),
  description: z.string(),
  loomVideoUrl: z.string().optional(),
  password: z.string().optional(),
  projectType: z.string().optional(),
  price: z.number(),
  stripePaymentLink: z.string().optional(),
  problemStatement: z.string(),
  solutionDescription: z.string(),
  benefits: z.array(z.string()),
  whyThisProject: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string()
  })),
  impacts: z.array(z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string(),
    metric: z.string()
  })),
  consequences: z.object({
    shortTerm: z.array(z.string()),
    longTerm: z.array(z.string())
  }),
  solutionFeatures: z.array(z.object({
    name: z.string(),
    description: z.string(),
    icon: z.string(),
    benefits: z.array(z.string())
  })),
  architecture: z.object({
    description: z.string(),
    sections: z.array(z.object({
      title: z.string(),
      items: z.array(z.string())
    })),
    diagramUrl: z.string().optional()
  }),
  scope: z.object({
    description: z.string(),
    items: z.array(z.object({
      title: z.string(),
      description: z.string(),
      deliverables: z.array(z.string()),
      features: z.array(z.string())
    }))
  }),
  process: z.object({
    description: z.string(),
    steps: z.array(z.object({
      title: z.string(),
      description: z.string(),
      duration: z.string(),
      deliverables: z.array(z.string()),
      activities: z.array(z.string())
    }))
  }),
  nextSteps: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    steps: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string(),
      details: z.array(z.string())
    }))
  }),
  faq: z.object({
    title: z.string(),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string()
    }))
  }),
  pricing: z.object({
    description: z.string(),
    includedFeatures: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      items: z.array(z.string())
    })),
    paymentTerms: z.array(z.string()),
    additionalCosts: z.array(z.string())
  }),
  expirationDate: z.string(),
  contact: z.object({
    email: z.string(),
    phone: z.string(),
    calendly: z.string(),
    socialMedia: z.object({
      linkedin: z.string(),
      twitter: z.string(),
      github: z.string()
    }).optional()
  })
});

// FormField component for consistent form field rendering
interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, error, children }) => (
  <div>
    <label className="block text-lg font-medium text-gray-700">{label}</label>
    {children}
    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
  </div>
);

// Update the className for inputs and textareas to make them larger:
const inputClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-6 py-3 text-lg";
const textareaClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-6 py-4 text-lg min-h-[160px]";

// Default template for new proposals
const defaultTemplate = {
  clientName: "",
  projectTitle: "",
  industry: "",
  description: "",
  loomVideoUrl: "",
  password: "",
  projectType: "",
  price: 0,
  stripePaymentLink: "",
  problemStatement: "",
  solutionDescription: "",
  benefits: [],
  whyThisProject: [],
  impacts: [],
  consequences: {
    shortTerm: [],
    longTerm: []
  },
  solutionFeatures: [],
  architecture: {
    description: "",
    sections: []
  },
  scope: {
    description: "",
    items: []
  },
  process: {
    description: "",
    steps: []
  },
  nextSteps: {
    title: "Next Steps",
    subtitle: "Let's Get Started",
    description: "",
    steps: []
  },
  faq: {
    title: "Frequently Asked Questions",
    faqs: []
  },
  pricing: {
    description: "",
    includedFeatures: [],
    paymentTerms: [],
    additionalCosts: []
  },
  expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  contact: {
    email: "",
    phone: "",
    calendly: "",
    socialMedia: {
      linkedin: "",
      twitter: "",
      github: ""
    }
  }
};

export const ProposalForm: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [openAIKey, setOpenAIKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [projectDescription, setProjectDescription] = useState('');
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const actionsMenuRef = useRef<HTMLDivElement>(null);

  const [showTopActionsMenu, setShowTopActionsMenu] = useState(false);
  const [showBottomActionsMenu, setShowBottomActionsMenu] = useState(false);
  const topActionsMenuRef = useRef<HTMLDivElement>(null);
  const bottomActionsMenuRef = useRef<HTMLDivElement>(null);

  // Close the actions menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (topActionsMenuRef.current && !topActionsMenuRef.current.contains(event.target as Node)) {
        setShowTopActionsMenu(false);
      }
      if (bottomActionsMenuRef.current && !bottomActionsMenuRef.current.contains(event.target as Node)) {
        setShowBottomActionsMenu(false);
      }
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setShowActionsMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ActionsMenu = ({ 
    showMenu, 
    setShowMenu, 
    menuRef 
  }: { 
    showMenu: boolean; 
    setShowMenu: (show: boolean) => void; 
    menuRef: React.RefObject<HTMLDivElement>;
  }) => (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        <MoreVertical className="h-5 w-5" />
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              type="button"
              onClick={handleExport}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              role="menuitem"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Proposal
            </button>
            <label
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
              role="menuitem"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Proposal
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );

  const handleExport = () => {
    const formData = getValues();
  
    // Build the final JSON object so it matches your "Proper JSON example" shape:
    const jsonData = buildFinalJson(formData);
  
    // Now convert jsonData to a Blob and download:
    const dataStr = JSON.stringify(jsonData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    // Name the file however you like:
    const filename = formData.clientName.toLowerCase().replace(/\s+/g, '-');
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  
    setShowActionsMenu(false);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          // Validate the imported data against our schema
          const result = proposalSchema.safeParse(data);
          if (result.success) {
            reset(data);
          } else {
            alert('Invalid proposal file format');
          }
        } catch (error) {
          alert('Error reading file');
        }
      };
      reader.readAsText(file);
    }
    setShowActionsMenu(false);
  };

  const exampleProjectDescription = `Project: E-commerce Analytics Dashboard

Client: RetailTech Solutions
Industry: Retail Technology
Project Type: Custom Software Development
Budget: $75,000

Project Overview:
RetailTech Solutions needs a comprehensive e-commerce analytics dashboard to help their online retail clients make data-driven decisions. The dashboard will aggregate and visualize data from multiple sources including their e-commerce platform, marketing tools, and inventory management system.

Key Requirements:
• Real-time sales tracking and revenue analytics
• Customer behavior analysis and segmentation
• Inventory management and stock level monitoring
• Marketing campaign performance tracking
• Customizable reporting and export capabilities
• Integration with major e-commerce platforms (Shopify, WooCommerce)
• Mobile-responsive design

Technical Specifications:
• Cloud-based solution using AWS
• React.js frontend with Material UI
• Node.js backend with GraphQL API
• Real-time data processing with Apache Kafka
• MongoDB for data storage
• Tableau-style interactive visualizations

Timeline:
• Development: 12 weeks
• Testing and QA: 3 weeks
• Deployment and Training: 1 week

Additional Requirements:
• GDPR and data privacy compliance
• Role-based access control
• Automated backup system
• 99.9% uptime SLA
• Comprehensive documentation
• Training materials and support

Expected Outcomes:
• 30% reduction in decision-making time
• 25% improvement in inventory management
• 20% increase in marketing ROI through better targeting`;

  const loadExampleDescription = () => {
    setProjectDescription(exampleProjectDescription);
  };

  const { register, handleSubmit: rhfHandleSubmit, formState: { errors }, getValues, setValue, control, reset } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: defaultTemplate
  });

  const loadExampleData = () => {
    if (window.confirm('This will replace your current form data with example data. Are you sure?')) {
      
      // Transform the example content to match the form structure
      const formattedContent = {
        ...defaultTemplate,
        benefits: [],
        solutionFeatures: [],
        whyThisProject: [],
        impacts: [],
        consequences: {
          shortTerm: [],
          longTerm: []
        },
        architecture: {
          description: '',
          sections: []
        },
        process: {
          description: '',
          steps: []
        },
        scope: {
          description: '',
          items: []
        },
        // Properly structure the faq data
        faq: {
          title: "Frequently Asked Questions",
          faqs: []
        }
      };

      reset(formattedContent);
      
      // Set each field individually to ensure nested objects are set correctly
      Object.entries(formattedContent).forEach(([key, value]) => {
        if (key === 'faq') {
          setValue('faq.title', (value as any).title);
          setValue('faq.faqs', (value as any).faqs);
        } else {
          setValue(key as any, value);
        }
      });
    }
  };

  const handleSubmit = (data: ProposalFormData) => {
    try {
      // Reuse the same builder function to keep the logic consistent:
      const jsonData = buildFinalJson(data);
  
      // Trigger file download
      const dataStr = JSON.stringify(jsonData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'content.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating JSON:', error);
      alert(`Failed to generate JSON file: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`);
    }
  };


  function buildFinalJson(data: ProposalFormData) {
    // If you have no UI fields for processSteps/timelineEvents, 
    // just default them to empty arrays or some placeholder
    const processSteps = data.processSteps || [];
    const timelineEvents = data.timelineEvents || [];
  
    // Map your existing fields to match your "Proper JSON example" exactly:
    const jsonData = {
      clientName: data.clientName,
      projectTitle: data.projectTitle,
      industry: data.industry,
      description: data.description,
      loomVideoUrl: data.loomVideoUrl,
      password: data.password,
      projectType: data.projectType,
      price: data.price,
      stripePaymentLink: data.stripePaymentLink,
      problemStatement: data.problemStatement,
      solutionDescription: data.solutionDescription,
  
      // The top-level array of benefits
      benefits: data.benefits,
  
      // The top-level array of FAQs (as in the example)
      faqs: data.faq.faqs,
  
      // "faq" object with 'title' + 'faqs' array
      faq: {
        title: data.faq.title || 'Frequently Asked Questions',
        faqs: data.faq.faqs,
      },
  
      // Why This Project
      whyThisProject: data.whyThisProject.map((item) => ({
        title: item.title,
        description: item.description,
        icon: item.icon,
      })),
  
      // Impacts
      impacts: data.impacts.map((impact) => ({
        icon: impact.icon,
        title: impact.title,
        description: impact.description,
        metric: impact.metric,
      })),
  
      // Consequences
      consequences: {
        shortTerm: data.consequences.shortTerm || [],
        longTerm: data.consequences.longTerm || [],
      },
  
      // Solution features
      solutionFeatures: data.solutionFeatures.map((feature) => ({
        name: feature.name,
        description: feature.description,
        icon: feature.icon,
        benefits: feature.benefits || [],
      })),
  
      // Architecture
      architecture: {
        description: data.architecture.description,
        sections: data.architecture.sections.map((section) => ({
          title: section.title,
          items: section.items,
        })),
      },
  
      // Scope
      scope: {
        description: data.scope.description,
        items: data.scope.items.map((item) => ({
          title: item.title,
          description: item.description,
          deliverables: item.deliverables,
          features: item.features,
        })),
      },
  
      // Process
      process: {
        description: data.process.description,
        steps: data.process.steps.map((step) => ({
          title: step.title,
          description: step.description,
          duration: step.duration || '',
          deliverables: step.deliverables || [],
          activities: step.activities || [],
        })),
      },
  
      // Pricing
      pricing: {
        description: data.pricing.description,
        includedFeatures: data.pricing.includedFeatures.map((feature) => ({
          icon: feature.icon,
          title: feature.title,
          items: feature.items,
        })),
        paymentTerms: data.pricing.paymentTerms,
        additionalCosts: data.pricing.additionalCosts,
      },
  
      // Next steps
      nextSteps: {
        title: data.nextSteps.title,
        subtitle: data.nextSteps.subtitle,
        description: data.nextSteps.description,
        steps: data.nextSteps.steps.map((step) => ({
          icon: step.icon,
          title: step.title,
          description: step.description,
          details: step.details,
        })),
      },
  
      // Extra arrays in your example
      // (Populate them however you wish. Right now, just set them from the data or blank)
      processSteps: processSteps.map((step) => ({
        title: step.title,
        description: step.description,
      })),
      timelineEvents: timelineEvents.map((evt) => ({
        title: evt.title,
        description: evt.description,
        duration: evt.duration || '',
      })),
      expirationDate: data.expirationDate,
      contact: {
        email: data.contact.email,
        phone: data.contact.phone,
        calendly: data.contact.calendly,
        socialMedia: {
          linkedin: data.contact.socialMedia?.linkedin,
          twitter: data.contact.socialMedia?.twitter,
          github: data.contact.socialMedia?.github
        }
      }
    };
  
    return jsonData;
  }


  const onSubmit = rhfHandleSubmit((data) => {
    handleSubmit(data);
  });

  const handlePreview = () => {
    const currentData = getValues();
    // Open preview in new window
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Proposal Preview - ${currentData.projectTitle || 'Untitled'}</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body>
            <div class="min-h-screen bg-gray-100">
              <div class="py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
                  <h1 class="text-3xl font-bold mb-4">${currentData.projectTitle || 'Untitled Project'}</h1>
                  <div class="text-sm text-gray-500 mb-8">
                    <p>Client: ${currentData.clientName || 'Not specified'}</p>
                    <p>Industry: ${currentData.industry || 'Not specified'}</p>
                    <p>Project Type: ${currentData.projectType || 'Not specified'}</p>
                    <p>Price: $${currentData.price || '0'}</p>
                  </div>

                  ${currentData.loomVideoUrl ? `
                    <div class="mb-8">
                      <iframe src="${currentData.loomVideoUrl}" frameborder="0" allowfullscreen class="w-full aspect-video rounded-lg"></iframe>
                    </div>
                  ` : ''}

                  <div class="space-y-12">
                    <!-- Project Overview -->
                    <section>
                      <h2 class="text-2xl font-semibold mb-4">Project Overview</h2>
                      <p class="text-gray-700">${currentData.description || 'No description provided'}</p>
                    </section>

                    <!-- Problem & Solution -->
                    <section>
                      <h2 class="text-2xl font-semibold mb-4">Problem Statement</h2>
                      <p class="text-gray-700 mb-6">${currentData.problemStatement || 'No problem statement provided'}</p>
                      
                      <h3 class="text-xl font-semibold mb-4">Solution</h3>
                      <p class="text-gray-700">${currentData.solutionDescription || 'No solution description provided'}</p>
                    </section>

                    <!-- Benefits -->
                    <section>
                      <h2 class="text-2xl font-semibold mb-4">Benefits</h2>
                      <ul class="list-disc pl-5 space-y-2">
                        ${(currentData.benefits || []).map(benefit => `
                          <li class="text-gray-700">${benefit}</li>
                        `).join('')}
                      </ul>
                    </section>

                    <!-- Solution Features -->
                    <section>
                      <h2 class="text-2xl font-semibold mb-4">Features</h2>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${(currentData.solutionFeatures || []).map(feature => `
                          <div class="border rounded-lg p-4">
                            <h3 class="text-lg font-semibold mb-2">${feature.name}</h3>
                            <p class="text-gray-700">${feature.description}</p>
                          </div>
                        `).join('')}
                      </div>
                    </section>

                    <!-- Project Reasons -->
                    <section>
                      <h2 class="text-2xl font-semibold mb-4">Why This Project</h2>
                      <div class="grid grid-cols-1 gap-6">
                        ${(currentData.whyThisProject || []).map(reason => `
                          <div class="border rounded-lg p-4">
                            <h3 class="text-lg font-semibold mb-2">${reason.title}</h3>
                            <p class="text-gray-700">${reason.description}</p>
                          </div>
                        `).join('')}
                      </div>
                    </section>

                    <!-- Impacts -->
                    <section>
                      <h2 class="text-2xl font-semibold mb-4">Impacts</h2>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${(currentData.impacts || []).map(impact => `
                          <div class="border rounded-lg p-4">
                            <h3 class="text-lg font-semibold mb-2">${impact.title}</h3>
                            <p class="text-gray-700 mb-2">${impact.description}</p>
                            <p class="text-sm font-semibold text-indigo-600">${impact.metric}</p>
                          </div>
                        `).join('')}
                      </div>
                    </section>

                    <!-- Consequences -->
                    <section>
                      <h2 class="text-2xl font-semibold mb-4">Consequences</h2>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 class="text-lg font-semibold mb-2">Short Term</h3>
                          <ul class="list-disc pl-5 space-y-2">
                            ${(currentData.consequences?.shortTerm || []).map(item => `
                              <li class="text-gray-700">${item}</li>
                            `).join('')}
                          </ul>
                        </div>
                        <div>
                          <h3 class="text-lg font-semibold mb-2">Long Term</h3>
                          <ul class="list-disc pl-5 space-y-2">
                            ${(currentData.consequences?.longTerm || []).map(item => `
                              <li class="text-gray-700">${item}</li>
                            `).join('')}
                          </ul>
                        </div>
                      </div>
                    </section>

                    <!-- Architecture -->
                    <section>
                      <h2 class="text-2xl font-semibold mb-4">Architecture</h2>
                      <p class="text-gray-700 mb-6">${currentData.architecture?.description || 'No architecture description provided'}</p>
                      
                      ${(currentData.architecture?.sections || []).map(section => `
                        <div class="mb-6">
                          <h3 class="text-lg font-semibold mb-2">${section.title}</h3>
                          <ul class="list-disc pl-5 space-y-2">
                            ${(section.items || []).map(item => `
                              <li class="text-gray-700">${item}</li>
                            `).join('')}
                          </ul>
                        </div>
                      `).join('')}
                    </section>

                    <!-- Process -->
                    <section>
                      <h2 class="text-2xl font-semibold mb-4">Process</h2>
                      <p class="text-gray-700 mb-6">${currentData.process?.description || 'No process description provided'}</p>
                      
                      <div class="space-y-6">
                        ${(currentData.process?.steps || []).map((step, index) => `
                          <div class="border rounded-lg p-4">
                            <div class="flex items-center gap-2 mb-2">
                              <span class="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">${index + 1}</span>
                              <h3 class="text-lg font-semibold">${step.title}</h3>
                            </div>
                            <p class="text-gray-700 mb-2">${step.description}</p>
                            <p class="text-sm text-gray-500 mb-2">Duration: ${step.duration}</p>
                            
                            <div class="mt-4">
                              <h4 class="font-medium mb-2">Deliverables:</h4>
                              <ul class="list-disc pl-5 space-y-1">
                                ${(step.deliverables || []).map(item => `
                                  <li class="text-gray-700">${item}</li>
                                `).join('')}
                              </ul>
                            </div>

                            <div class="mt-4">
                              <h4 class="font-medium mb-2">Activities:</h4>
                              <ul class="list-disc pl-5 space-y-1">
                                ${(step.activities || []).map(item => `
                                  <li class="text-gray-700">${item}</li>
                                `).join('')}
                              </ul>
                            </div>
                          </div>
                        `).join('')}
                      </div>
                    </section>

                    <!-- Next Steps -->
                    <section>
                      <h2 class="text-2xl font-semibold mb-4">${currentData.nextSteps?.title || 'Next Steps'}</h2>
                      <h3 class="text-xl mb-4">${currentData.nextSteps?.subtitle || ''}</h3>
                      <p class="text-gray-700 mb-6">${currentData.nextSteps?.description || ''}</p>
                      
                      <div class="grid grid-cols-1 gap-6">
                        ${(currentData.nextSteps?.steps || []).map(step => `
                          <div class="border rounded-lg p-4">
                            <h3 class="text-lg font-semibold mb-2">${step.title}</h3>
                            <p class="text-gray-700 mb-4">${step.description}</p>
                            <ul class="list-disc pl-5 space-y-1">
                              ${(step.details || []).map(detail => `
                                <li class="text-gray-700">${detail}</li>
                              `).join('')}
                            </ul>
                          </div>
                        `).join('')}
                      </div>
                    </section>

                    <!-- FAQ -->
                    <section>
                      <h2 class="text-2xl font-semibold mb-4">${currentData.faq?.title || 'Frequently Asked Questions'}</h2>
                      <div className="space-y-6">
                        ${(currentData.faq?.faqs || []).map(faq => `
                          <div class="border rounded-lg p-4">
                            <h3 class="text-lg font-semibold mb-2">${faq.question}</h3>
                            <p class="text-gray-700">${faq.answer}</p>
                          </div>
                        `).join('')}
                      </div>
                    </section>

                    <!-- Pricing -->
                    <section>
                      <h2 class="text-2xl font-semibold mb-4">Pricing</h2>
                      <p class="text-gray-700 mb-6">${currentData.pricing?.description || ''}</p>
                      
                      <div class="space-y-6">
                        ${(currentData.pricing?.includedFeatures || []).map(feature => `
                          <div class="border rounded-lg p-4">
                            <h3 class="text-lg font-semibold mb-2">${feature.title}</h3>
                            <ul class="list-disc pl-5 space-y-1">
                              ${(feature.items || []).map(item => `
                                <li class="text-gray-700">${item}</li>
                              `).join('')}
                            </ul>
                          </div>
                        `).join('')}
                      </div>

                      <div class="mt-6">
                        <h3 class="text-lg font-semibold mb-2">Payment Terms</h3>
                        <ul class="list-disc pl-5 space-y-2">
                          ${(currentData.pricing?.paymentTerms || []).map(term => `
                            <li class="text-gray-700">${term}</li>
                          `).join('')}
                        </ul>
                      </div>

                      <div class="mt-6">
                        <h3 class="text-lg font-semibold mb-2">Additional Costs</h3>
                        <ul class="list-disc pl-5 space-y-2">
                          ${(currentData.pricing?.additionalCosts || []).map(cost => `
                            <li class="text-gray-700">${cost}</li>
                          `).join('')}
                        </ul>
                      </div>

                      ${currentData.stripePaymentLink ? `
                        <div class="mt-8">
                          <a href="${currentData.stripePaymentLink}" target="_blank" class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700">
                            Proceed to Payment
                          </a>
                        </div>
                      ` : ''}
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  const generateProposalContent = async (projectDescription: string) => {
    setIsGenerating(true);
    setGenerationError(null);
    
    try {
      const openai = new OpenAI({
        apiKey: openAIKey,
        dangerouslyAllowBrowser: true
      });

      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: `You are a professional proposal writer. Generate a comprehensive proposal based on the project description. 
            The proposal should include all necessary sections with detailed, specific content. 
            For icons, use react lucide icons and their names. 
            Ensure all fields are filled with realistic, professional content that addresses the client's needs.`
          },
          { 
            role: "user", 
            content: projectDescription 
          }
        ],
        response_format: zodResponseFormat(ProposalContentSchema, "proposal"),
      });

      const proposal = completion.choices[0].message.parsed;
      
      // Update form with generated content
      Object.entries(proposal).forEach(([key, value]) => {
        if (key === 'faq') {
          setValue('faq.title', (value as any).title);
          setValue('faq.faqs', (value as any).faqs);
        } else if (key === 'consequences') {
          setValue('consequences.shortTerm', (value as any).shortTerm);
          setValue('consequences.longTerm', (value as any).longTerm);
        } else if (key === 'architecture') {
          setValue('architecture.description', (value as any).description);
          setValue('architecture.sections', (value as any).sections);
        } else if (key === 'scope') {
          setValue('scope.description', (value as any).description);
          setValue('scope.items', (value as any).items);
        } else if (key === 'process') {
          setValue('process.description', (value as any).description);
          setValue('process.steps', (value as any).steps);
        } else if (key === 'nextSteps') {
          setValue('nextSteps.title', (value as any).title);
          setValue('nextSteps.subtitle', (value as any).subtitle);
          setValue('nextSteps.description', (value as any).description);
          setValue('nextSteps.steps', (value as any).steps);
        } else if (key === 'pricing') {
          setValue('pricing.description', (value as any).description);
          setValue('pricing.includedFeatures', (value as any).includedFeatures);
          setValue('pricing.paymentTerms', (value as any).paymentTerms);
          setValue('pricing.additionalCosts', (value as any).additionalCosts);
        } else if (key === 'contact') {
          setValue('contact.email', (value as any).email);
          setValue('contact.phone', (value as any).phone);
          setValue('contact.calendly', (value as any).calendly);
          setValue('contact.socialMedia.linkedin', (value as any).socialMedia?.linkedin);
          setValue('contact.socialMedia.twitter', (value as any).socialMedia?.twitter);
          setValue('contact.socialMedia.github', (value as any).socialMedia?.github);
        } else {
          setValue(key as any, value);
        }
      });

    } catch (error) {
      console.error('Error generating proposal:', error);
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate proposal content');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes indeterminateProgress {
        0% {
          transform: translateX(-100%);
        }
        50% {
          transform: translateX(0%);
        }
        100% {
          transform: translateX(100%);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handlePreview}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Eye className="h-5 w-5 mr-2" />
                Preview
              </button>
              <LoadExampleButton
                label="Load Example Data"
                fields={[
                  'clientName',
                  'projectTitle',
                  'industry',
                  'description',
                  'loomVideoUrl',
                  'password',
                  'projectType',
                  'price',
                  'stripePaymentLink',
                  'expirationDate',
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
                ]}
                exampleData={exampleProposal}
                setValue={setValue}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              />
            </div>
            <ActionsMenu 
              showMenu={showTopActionsMenu} 
              setShowMenu={setShowTopActionsMenu}
              menuRef={topActionsMenuRef}
            />
          </div>

        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="https://gettingautomated.com/wp-content/uploads/2024/09/getting_automaated_500.png" 
              alt="Getting Automated Logo" 
              className="h-24 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Getting Automated Proposal Form Generator</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create professional and comprehensive business proposals with ease. This form helps you structure your proposal
            by breaking it down into key sections including project scope, benefits, consequences, and pricing details.
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
          <div className="space-y-6">
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-6 text-gray-600">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-blue-100 p-3 rounded-full mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-2">1. Fill in the Details</h3>
                  <p className="text-sm text-gray-600">
                    Complete each section with your proposal information. All fields are designed to create a comprehensive business proposal.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-blue-100 p-3 rounded-full mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-2">2. Review Your Proposal</h3>
                  <p className="text-sm text-gray-600">
                    Preview your proposal to ensure all information is accurate and professionally presented.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-blue-100 p-3 rounded-full mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-2">3. Generate & Download</h3>
                  <p className="text-sm text-gray-600">
                    Generate your proposal in a professional format and download it for sharing with your clients.
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-8">
            {/* AI Project Description Generator */}
            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setIsAIOpen(!isAIOpen)}
                className="w-full flex items-center justify-between px-8 py-4 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <Wand2 className="h-5 w-5 text-indigo-600 mr-2" />
                  <span className="text-lg font-semibold text-gray-900">Use AI to help generate a first version of your draft</span>
                </div>
                <ChevronDown 
                  className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isAIOpen ? 'transform rotate-180' : ''}`}
                />
              </button>
              <div
                className={`transition-all duration-200 ease-in-out ${
                  isAIOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                <div className="border-t border-gray-200 bg-gray-50 px-8 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">Project Description</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Describe your project in detail. This description can be used to generate various aspects of your proposal.
                  </p>
                </div>
                <div className="px-8 py-6">
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center mb-2">
                        <KeyRound className="h-4 w-4 text-gray-500 mr-2" />
                        <label htmlFor="openai-key" className="block text-sm font-medium text-gray-700">
                          OpenAI API Key
                        </label>
                      </div>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type={showKey ? "text" : "password"}
                          id="openai-key"
                          value={openAIKey}
                          onChange={(e) => setOpenAIKey(e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowKey(!showKey)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showKey ? (
                            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                          )}
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Your API key will be used only for generating proposal content and won't be stored anywhere.
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label htmlFor="project-description" className="block text-sm font-medium text-gray-700">
                          Project Description
                        </label>
                        <button
                          type="button"
                          onClick={loadExampleDescription}
                          className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          Load Example Description
                        </button>
                      </div>
                      <div className="relative">
                        <textarea
                          id="project-description"
                          rows={8}
                          className={`block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm ${
                            isGenerating ? 'opacity-50' : ''
                          }`}
                          placeholder="Start by describing your project's:&#10;&#10;• Main objectives and goals&#10;• Target audience or users&#10;• Key features and functionality&#10;• Technical requirements&#10;• Timeline and milestones&#10;• Any specific technologies or approaches"
                          value={projectDescription}
                          onChange={(e) => setProjectDescription(e.target.value)}
                          disabled={isGenerating}
                        />
                        {isGenerating && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden rounded-b-md">
                            <div 
                              className="h-full bg-indigo-600"
                              style={{
                                animation: 'indeterminateProgress 2s ease-in-out infinite',
                                width: '50%',
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => generateProposalContent(projectDescription)}
                          disabled={!openAIKey || !projectDescription || isGenerating}
                          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                            !openAIKey || !projectDescription || isGenerating
                              ? 'bg-indigo-300 cursor-not-allowed'
                              : 'bg-indigo-600 hover:bg-indigo-700'
                          }`}
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Wand2 className="h-4 w-4 mr-2" />
                              Generate with AI
                            </>
                          )}
                        </button>
                      </div>
                      {isGenerating && (
                        <div className="mt-2 text-sm text-gray-500 text-right">
                          Please wait 15-30 seconds while we generate your proposal content...
                        </div>
                      )}
                      {generationError && (
                        <div className="mt-2 text-sm text-red-600">
                          Error: {generationError}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-8 py-6 sm:p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
                  <LoadExampleButton
                    fields={['clientName', 'projectTitle', 'industry', 'description', 'loomVideoUrl', 'password', 'projectType', 'price', 'stripePaymentLink', 'expirationDate']}
                    exampleData={defaultTemplate}
                    setValue={setValue}
                    label="Load Example Basic Info"
                  />
                </div>
                <div className="space-y-6">
                  <FormField label="Client Name" error={errors.clientName?.message}>
                    <input
                      type="text"
                      {...register("clientName")}
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField label="Project Title" error={errors.projectTitle?.message}>
                    <input
                      type="text"
                      {...register("projectTitle")}
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField label="Industry" error={errors.industry?.message}>
                    <input
                      type="text"
                      {...register("industry")}
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField label="Description" error={errors.description?.message}>
                    <textarea
                      {...register("description")}
                      className={textareaClassName}
                    />
                  </FormField>

                  <FormField label="Loom Video URL (Optional)" error={errors.loomVideoUrl?.message}>
                    <input
                      type="url"
                      {...register("loomVideoUrl")}
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField label="Password (Optional)" error={errors.password?.message}>
                    <input
                      type="text"
                      {...register("password")}
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField label="Project Type (Optional)" error={errors.projectType?.message}>
                    <input
                      type="text"
                      {...register("projectType")}
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField label="Price" error={errors.price?.message}>
                    <input
                      type="number"
                      {...register("price", { valueAsNumber: true })}
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField label="Stripe Payment Link (Optional)" error={errors.stripePaymentLink?.message}>
                    <input
                      type="url"
                      {...register("stripePaymentLink")}
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField label="Expiration Date" error={errors.expirationDate?.message}>
                    <input
                      type="date"
                      {...register("expirationDate")}
                      className={inputClassName}
                      min={new Date().toISOString().split('T')[0]}
                      defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* Problem & Solution */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-8 py-6 sm:p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Problem & Solution</h3>
                  <LoadExampleButton
                    fields={['problemStatement', 'solutionDescription']}
                    exampleData={defaultTemplate}
                    setValue={setValue}
                    label="Load Example Problem & Solution"
                  />
                </div>
                <div className="space-y-6">
                  <FormField label="Problem Statement" error={errors.problemStatement?.message}>
                    <textarea
                      {...register("problemStatement")}
                      className={textareaClassName}
                    />
                  </FormField>

                  <FormField label="Solution Description" error={errors.solutionDescription?.message}>
                    <textarea
                      {...register("solutionDescription")}
                      className={textareaClassName}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* Benefits & Features */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-8 py-6 sm:p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Benefits & Features</h3>
                  <LoadExampleButton
                    fields={['benefits', 'solutionFeatures']}
                    exampleData={defaultTemplate}
                    setValue={setValue}
                    label="Load Example Benefits & Features"
                  />
                </div>
                <div className="space-y-6">
                  <DynamicList
                    label="Benefits"
                    name="benefits"
                    register={register}
                    error={errors.benefits?.message}
                    placeholder="Enter a benefit"
                    getValues={getValues}
                    setValue={setValue}
                    control={control}
                  />

                  <DynamicObjectList
                    label="Solution Features"
                    name="solutionFeatures"
                    register={register}
                    error={errors.solutionFeatures?.message}
                    placeholder='[{"name": "Feature Name", "description": "Description", "icon": "Icon", "benefits": ["Benefit 1"]}]'
                    fields={[
                      { name: 'name', type: 'text' },
                      { name: 'description', type: 'textarea' },
                      { name: 'icon', type: 'icon' }
                    ]}
                    getValues={getValues}
                    setValue={setValue}
                    control={control}
                  />
                </div>
              </div>
            </div>

            {/* Project Reasons */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-8 py-6 sm:p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Project Reasons</h3>
                  <LoadExampleButton
                    fields={['whyThisProject']}
                    exampleData={defaultTemplate}
                    setValue={setValue}
                    label="Load Example Project Reasons"
                  />
                </div>
                <div className="space-y-6">
                  <DynamicObjectList
                    label="Why This Project"
                    name="whyThisProject"
                    register={register}
                    error={errors.whyThisProject?.message}
                    placeholder='[{"title": "Reason", "description": "Description", "icon": "Icon"}]'
                    fields={[
                      { name: 'title', type: 'text' },
                      { name: 'description', type: 'textarea' },
                      { name: 'icon', type: 'icon' }
                    ]}
                    getValues={getValues}
                    setValue={setValue}
                    control={control}
                  />
                </div>
              </div>
            </div>

            {/* Impacts & Consequences */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-8 py-6 sm:p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Impacts & Consequences</h3>
                  <LoadExampleButton
                    fields={['impacts', 'consequences']}
                    exampleData={defaultTemplate}
                    setValue={setValue}
                    label="Load Example Impacts & Consequences"
                  />
                </div>
                <div className="space-y-6">
                  <DynamicObjectList
                    label="Impacts"
                    name="impacts"
                    register={register}
                    error={errors.impacts?.message}
                    placeholder='[{"icon": "Icon", "title": "Title", "description": "Description", "metric": "Metric"}]'
                    fields={[
                      { name: 'icon', type: 'icon' },
                      { name: 'title', type: 'text' },
                      { name: 'description', type: 'textarea' },
                      { name: 'metric', type: 'text' }
                    ]}
                    getValues={getValues}
                    setValue={setValue}
                    control={control}
                  />

                  <DynamicList
                    label="Short-term Consequences"
                    name="consequences.shortTerm"
                    register={register}
                    error={errors.consequences?.shortTerm?.message}
                    placeholder="Enter a short-term consequence"
                    getValues={getValues}
                    setValue={setValue}
                    control={control}
                  />

                  <DynamicList
                    label="Long-term Consequences"
                    name="consequences.longTerm"
                    register={register}
                    error={errors.consequences?.longTerm?.message}
                    placeholder="Enter a long-term consequence"
                    getValues={getValues}
                    setValue={setValue}
                    control={control}
                  />
                </div>
              </div>
            </div>

            {/* Architecture */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-8 py-6 sm:p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Architecture</h3>
                  <LoadExampleButton
                    fields={['architecture']}
                    exampleData={defaultTemplate}
                    setValue={setValue}
                    label="Load Example Architecture"
                  />
                </div>
                <div className="space-y-6">
                  <FormField label="Architecture Description" error={errors.architecture?.description?.message}>
                    <textarea
                      {...register("architecture.description")}
                      className={textareaClassName}
                    />
                  </FormField>

                  <DynamicObjectList
                    label="Architecture Sections"
                    name="architecture.sections"
                    register={register}
                    error={errors.architecture?.sections?.message}
                    placeholder='[{"title": "Section Title", "items": ["Item 1", "Item 2"]}]'
                    fields={[
                      { name: 'title', type: 'text' },
                      { name: 'items', type: 'textarea' }
                    ]}
                    getValues={getValues}
                    setValue={setValue}
                    control={control}
                  />
                </div>
              </div>
            </div>

            {/* Scope */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-8 py-6 sm:p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Scope</h3>
                  <LoadExampleButton
                    fields={['scope']}
                    exampleData={defaultTemplate}
                    setValue={setValue}
                    label="Load Example Scope"
                  />
                </div>
                <div className="space-y-6">
                  <FormField label="Scope Description" error={errors.scope?.description?.message}>
                    <textarea
                      {...register("scope.description")}
                      className={textareaClassName}
                    />
                  </FormField>

                  <DynamicObjectList
                    label="Scope Items"
                    name="scope.items"
                    register={register}
                    error={errors.scope?.items?.message}
                    placeholder='[{"title": "Item Title", "description": "Description", "deliverables": ["Deliverable 1"], "features": ["Feature 1"]}]'
                    fields={[
                      { name: 'title', type: 'text' },
                      { name: 'description', type: 'textarea' },
                      { name: 'deliverables', type: 'textarea' },
                      { name: 'features', type: 'textarea' }
                    ]}
                    getValues={getValues}
                    setValue={setValue}
                    control={control}
                  />
                </div>
              </div>
            </div>

            {/* Process */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-8 py-6 sm:p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Process</h3>
                  <LoadExampleButton
                    fields={['process']}
                    exampleData={defaultTemplate}
                    setValue={setValue}
                    label="Load Example Process"
                  />
                </div>
                <div className="space-y-6">
                  <FormField label="Process Description" error={errors.process?.description?.message}>
                    <textarea
                      {...register("process.description")}
                      className={textareaClassName}
                    />
                  </FormField>

                  <DynamicObjectList
                    label="Process Steps"
                    name="process.steps"
                    register={register}
                    error={errors.process?.steps?.message}
                    placeholder='[{"title": "Step Title", "description": "Description", "duration": "Duration", "deliverables": ["Deliverable 1"], "activities": ["Activity 1"]}]'
                    fields={[
                      { name: 'title', type: 'text' },
                      { name: 'description', type: 'textarea' },
                      { name: 'duration', type: 'text' },
                      { name: 'deliverables', type: 'textarea' },
                      { name: 'activities', type: 'textarea' }
                    ]}
                    getValues={getValues}
                    setValue={setValue}
                    control={control}
                  />
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-8 py-6 sm:p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Next Steps</h3>
                  <LoadExampleButton
                    fields={['nextSteps']}
                    exampleData={defaultTemplate}
                    setValue={setValue}
                    label="Load Example Next Steps"
                  />
                </div>
                <div className="space-y-6">
                  <FormField label="Next Steps Title" error={errors.nextSteps?.title?.message}>
                    <input
                      type="text"
                      {...register("nextSteps.title")}
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField label="Next Steps Subtitle" error={errors.nextSteps?.subtitle?.message}>
                    <input
                      type="text"
                      {...register("nextSteps.subtitle")}
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField label="Next Steps Description" error={errors.nextSteps?.description?.message}>
                    <textarea
                      {...register("nextSteps.description")}
                      className={textareaClassName}
                    />
                  </FormField>

                  <DynamicObjectList
                    label="Next Steps Steps"
                    name="nextSteps.steps"
                    register={register}
                    error={errors.nextSteps?.steps?.message}
                    placeholder='[{"icon": "Icon", "title": "Title", "description": "Description", "details": ["Detail 1"]}]'
                    fields={[
                      { name: 'icon', type: 'icon' },
                      { name: 'title', type: 'text' },
                      { name: 'description', type: 'textarea' },
                      { name: 'details', type: 'textarea' }
                    ]}
                    getValues={getValues}
                    setValue={setValue}
                    control={control}
                  />
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-8 py-6 sm:p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">FAQ</h3>
                  <LoadExampleButton
                    fields={['faq']}
                    exampleData={defaultTemplate}
                    setValue={setValue}
                    label="Load Example FAQ"
                  />
                </div>
                <div className="space-y-6">
                  <FormField label="FAQ Title" error={errors.faq?.title?.message}>
                    <input
                      type="text"
                      {...register("faq.title")}
                      className={inputClassName}
                    />
                  </FormField>

                  <DynamicObjectList
                    label="FAQs"
                    name="faq.faqs"
                    register={register}
                    error={errors.faq?.faqs?.message}
                    placeholder='[{"question": "Question text", "answer": "Answer text"}]'
                    fields={[
                      { name: 'question', type: 'text' },
                      { name: 'answer', type: 'textarea' }
                    ]}
                    getValues={getValues}
                    setValue={setValue}
                    control={control}
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-8 py-6 sm:p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Pricing</h3>
                  <LoadExampleButton
                    fields={['pricing']}
                    exampleData={defaultTemplate}
                    setValue={setValue}
                    label="Load Example Pricing"
                  />
                </div>
                <div className="space-y-6">
                  <FormField label="Pricing Description" error={errors.pricing?.description?.message}>
                    <textarea
                      {...register("pricing.description")}
                      className={textareaClassName}
                    />
                  </FormField>

                  <DynamicObjectList
                    label="Included Features"
                    name="pricing.includedFeatures"
                    register={register}
                    error={errors.pricing?.includedFeatures?.message}
                    placeholder='[{"icon": "Icon", "title": "Title", "items": ["Item 1", "Item 2"]}]'
                    fields={[
                      { name: 'icon', type: 'icon' },
                      { name: 'title', type: 'text' },
                      { name: 'items', type: 'textarea' }
                    ]}
                    getValues={getValues}
                    setValue={setValue}
                    control={control}
                  />

                  <DynamicList
                    label="Payment Terms"
                    name="pricing.paymentTerms"
                    register={register}
                    error={errors.pricing?.paymentTerms?.message}
                    placeholder="Enter a payment term"
                    getValues={getValues}
                    setValue={setValue}
                    control={control}
                  />

                  <DynamicList
                    label="Additional Costs"
                    name="pricing.additionalCosts"
                    register={register}
                    error={errors.pricing?.additionalCosts?.message}
                    placeholder="Enter an additional cost"
                    getValues={getValues}
                    setValue={setValue}
                    control={control}
                  />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-8 py-6 sm:p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Contact</h3>
                  <LoadExampleButton
                    fields={['contact']}
                    exampleData={defaultTemplate}
                    setValue={setValue}
                    label="Load Example Contact"
                  />
                </div>
                <div className="space-y-6">
                  <FormField label="Email" error={errors.contact?.email?.message}>
                    <input
                      type="email"
                      {...register("contact.email")}
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField label="Phone" error={errors.contact?.phone?.message}>
                    <input
                      type="text"
                      {...register("contact.phone")}
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField label="Calendly" error={errors.contact?.calendly?.message}>
                    <input
                      type="url"
                      {...register("contact.calendly")}
                      className={inputClassName}
                    />
                  </FormField>

                  <div className="space-y-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Social Media</h3>
                    <div className="space-y-6">
                      <FormField label="LinkedIn" error={errors.contact?.socialMedia?.linkedin?.message}>
                        <input
                          type="url"
                          {...register("contact.socialMedia.linkedin")}
                          className={inputClassName}
                        />
                      </FormField>

                      <FormField label="Twitter" error={errors.contact?.socialMedia?.twitter?.message}>
                        <input
                          type="url"
                          {...register("contact.socialMedia.twitter")}
                          className={inputClassName}
                        />
                      </FormField>

                      <FormField label="GitHub" error={errors.contact?.socialMedia?.github?.message}>
                        <input
                          type="url"
                          {...register("contact.socialMedia.github")}
                          className={inputClassName}
                        />
                      </FormField>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <ActionsMenu 
                showMenu={showBottomActionsMenu} 
                setShowMenu={setShowBottomActionsMenu}
                menuRef={bottomActionsMenuRef}
              />
              <button
                type="button"
                onClick={handlePreview}
                className="inline-flex items-center px-6 py-4 border border-gray-300 shadow-sm text-lg font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Eye className="h-5 w-5 mr-2" />
                Preview
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-6 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <FileCode className="h-5 w-5 mr-2" />
                Generate JSON
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};