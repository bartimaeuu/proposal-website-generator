import React, { useState } from 'react';
import { FileCode, Loader2 } from 'lucide-react';
import { UseFormSetValue } from 'react-hook-form';

const CLOUDFRONT_URL = import.meta.env.VITE_CLOUDFRONT_URL;

interface LoadExampleButtonProps {
  label?: string;
  fields: string[];
  setValue: UseFormSetValue<any>;
  className?: string;
}

export const LoadExampleButton: React.FC<LoadExampleButtonProps> = ({
  label = "Load Example Data",
  fields,
  setValue,
  className = "inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
}) => {
  const [loading, setLoading] = useState(false);

  const loadExample = async () => {
    if (window.confirm('This will replace the current section data with example data. Are you sure?')) {
      try {
        setLoading(true);
        if (!CLOUDFRONT_URL) {
          throw new Error('CloudFront URL is not configured');
        }

        const response = await fetch(`${CLOUDFRONT_URL}/examples/company-xyz.json`);
        if (!response.ok) {
          throw new Error(`Failed to load example data: ${response.statusText}`);
        }
        const exampleData = await response.json();
        
        fields.forEach(field => {
          let value = field.split('.').reduce((obj, key) => obj?.[key], exampleData);
          if (value !== undefined) {
            setValue(field, value);
          }
        });
      } catch (error) {
        console.error('Error loading example data:', error);
        alert('Failed to load example data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={loadExample}
      className={className}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <FileCode className="h-4 w-4 mr-2" />
      )}
      {loading ? 'Loading...' : label}
    </button>
  );
};
