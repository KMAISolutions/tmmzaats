
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-ats-dark text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <img 
              src="/public/lovable-uploads/5b99b574-e6c1-4c0f-821e-8a7044b2800b.png" 
              alt="The Middle Man Logo" 
              className="h-10 w-auto" 
            />
          </div>
          <div className="text-center md:text-right">
            <p>© {currentYear} The Middle Man. All rights reserved.</p>
            <p className="text-sm text-gray-400 mt-1">Powered by advanced ATS technology</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
