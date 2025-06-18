import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  errors: string[];
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errors, className = '' }) => {
  if (errors.length === 0) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          {errors.length === 1 ? (
            <p className="text-sm text-red-700">{errors[0]}</p>
          ) : (
            <ul className="text-sm text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;