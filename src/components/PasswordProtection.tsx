import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface PasswordProtectionProps {
  onAuthenticated: (password: string) => void;
  password: string;
  error: string | null;
}

export const PasswordProtection: React.FC<PasswordProtectionProps> = ({
  onAuthenticated,
  password,
  error: externalError,
}) => {
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === password) {
      onAuthenticated(inputPassword);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Lock className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Protected Content</h2>
          <p className="mt-2 text-gray-600 text-center">
            Please enter the password to view this proposal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  setError(false);
                }}
                className={`block w-full rounded-lg border ${
                  error || externalError ? 'border-red-300' : 'border-gray-300'
                } px-4 py-3 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500`}
                placeholder="Enter password"
              />
              {(error || externalError) && (
                <p className="mt-2 text-sm text-red-600">Incorrect password. Please try again.</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};