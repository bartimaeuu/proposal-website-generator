import React from 'react';

export const EnvTest: React.FC = () => {
  console.log('Environment Test:', {
    CLOUDFRONT_URL: import.meta.env.VITE_CLOUDFRONT_URL,
    MODE: import.meta.env.MODE,
    allEnv: import.meta.env
  });

  return (
    <div>
      <h2>Environment Variables Test</h2>
      <pre>
        {JSON.stringify({
          CLOUDFRONT_URL: import.meta.env.VITE_CLOUDFRONT_URL,
          MODE: import.meta.env.MODE
        }, null, 2)}
      </pre>
    </div>
  );
}; 