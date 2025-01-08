import React from 'react';
import { Github, Twitter, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 bg-gray-900 border-t border-cyan-900/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              DePINS.io
            </h3>
            <p className="text-gray-400">Building the future of decentralized infrastructure</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300">Explore</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300">Store</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300">About</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300">Documentation</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300">API</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <MessageSquare className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-cyan-900/30 text-center text-gray-400">
          <p>&copy; 2024 DePINS.io. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
