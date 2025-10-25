import React from 'react';
import { APP_LOGO_BASE64 } from '../constants';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
      <img
        src={APP_LOGO_BASE64}
        alt="Currency Guesser Logo"
        className="w-40 h-40 md:w-48 md:h-48 animate-fadeIn"
        style={{ animationDuration: '1.5s' }}
      />
      <div className="flex space-x-2.5 mt-8">
        <div
          className="w-3 h-3 bg-primary rounded-full animate-pulsate"
          style={{ animationDelay: '0s' }}
        ></div>
        <div
          className="w-3 h-3 bg-primary rounded-full animate-pulsate"
          style={{ animationDelay: '0.2s' }}
        ></div>
        <div
          className="w-3 h-3 bg-primary rounded-full animate-pulsate"
          style={{ animationDelay: '0.4s' }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
