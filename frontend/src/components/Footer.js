import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-purple-400 p-4 border-t border-gray-200 font-serif">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between">
        {/* Brand and Info */}
        <div className="flex-1 mb-8 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-900">UPTRENT</h1>
          <p className="text-gray-900 mt-2">Your one-stop shop for everything!</p>
        </div>

        <div className="text-center">
        <p className="text-gray-900 text-sm">© {new Date().getFullYear()} YourBrand. All rights reserved.</p>
        <p className="text-gray-900 mt-2 text-sm">Privacy Policy | Terms of Service</p>
      </div>
      </div>
      
    </footer>
  );
};

export default Footer;
