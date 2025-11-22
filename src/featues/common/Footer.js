import React from 'react';
// Using a popular icon library like 'react-icons' for clean SVGs
import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { SiVisa, SiMastercard, SiPaypal, SiAmericanexpress } from 'react-icons/si';

const Footer = () => {
  // Define your navigation structure here
  const companyLinks = [
    { name: 'About Us', url: '/about' },
    { name: 'Careers', url: '/careers' },
    { name: 'Affiliates', url: '/affiliates' },
    { name: 'Press', url: '/press' },
  ];

  const customerServiceLinks = [
    { name: 'Contact Us', url: '/contact' },
    { name: 'FAQs', url: '/faq' },
    { name: 'Shipping & Returns', url: '/shipping' },
    { name: 'Order Tracking', url: '/track-order' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', url: '/privacy' },
    { name: 'Terms of Service', url: '/terms' },
    { name: 'Accessibility', url: '/accessibility' },
  ];

  return (
    // 1. Main Footer Container: Dark Gray background, padding
    <footer className="bg-gray-900 text-gray-400">
      
      {/* 2. Top Section: Links & Newsletter */}
      <div className="pt-16 pb-12 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Grid Layout: Stacks on mobile, 4 columns on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Column 1: Brand & Newsletter (Prominent) */}
            <div>
              <h3 className="text-2xl font-extrabold text-white mb-3 tracking-wider">
                ⚡ ShopName
              </h3>
              <p className="mb-6 text-sm">Style that speaks for itself. Quality guaranteed.</p>
              
              {/* Newsletter Subscription */}
              <h4 className="text-lg font-semibold text-white mb-3">
                <FaEnvelope className="inline mr-2 text-red-500" />
                Join Our Community
              </h4>
              <p className="text-sm mb-3">Get **10% off** your first order!</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  aria-label="Newsletter email input"
                  className="w-full px-4 py-2 text-sm bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                />
                <button 
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 rounded-r-md transition duration-300 transform hover:scale-105 shadow-lg"
                >
                  Subscribe
                </button>
              </div>
            </div>

            {/* Column 2: Company Links */}
            <div>
              <h4 className="text-white text-xl font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.url} 
                      className="hover:text-white transition duration-200 text-base"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Customer Service Links */}
            <div>
              <h4 className="text-white text-xl font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-3">
                {customerServiceLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.url} 
                      className="hover:text-white transition duration-200 text-base"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Column 4: Legal & Social */}
            <div>
              <h4 className="text-white text-xl font-semibold mb-4">Connect & Legal</h4>
              
              {/* Social Media Icons */}
              <div className="flex space-x-4 mb-6 text-2xl">
                <a href="https://facebook.com" aria-label="Facebook" className="hover:text-blue-500 transition duration-200">
                  <FaFacebookF />
                </a>
                <a href="https://instagram.com" aria-label="Instagram" className="hover:text-pink-500 transition duration-200">
                  <FaInstagram />
                </a>
                <a href="https://twitter.com" aria-label="Twitter" className="hover:text-blue-400 transition duration-200">
                  <FaTwitter />
                </a>
              </div>

              {/* Legal Quick Links */}
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.url} 
                      className="text-sm hover:text-white transition duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
      
      {/* 3. Bottom Bar (Copyright & Payments) */}
      <div className="py-6 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm">
          
          <p className="text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ShopName. All rights reserved.
          </p>
          
          {/* Payment Method Icons (Trust Signal) */}
          <div className="flex space-x-3 text-2xl text-gray-500">
            <SiVisa className="hover:text-blue-400 transition" />
            <SiMastercard className="hover:text-red-500 transition" />
            <SiPaypal className="hover:text-blue-700 transition" />
            <SiAmericanexpress className="hover:text-blue-600 transition" />
          </div>
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;