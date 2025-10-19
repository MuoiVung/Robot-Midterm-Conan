import React from 'react';
import { useAppContext } from '../context/AppContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useAppContext();

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleLanguage}
        className="bg-white p-2 rounded-lg shadow-md text-gray-700 hover:bg-gray-200 transition"
        aria-label="Toggle language"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.5 1.73 2.85 2.96 3.99l-2.05 2.05L6 18h7v-1.99h-1.17zM19 18l-3.29-3.29L14.29 16.12 19 20.83l4.71-4.71-1.42-1.42L19 18z"/>
        </svg>
      </button>
    </div>
  );
};

export default LanguageSwitcher;