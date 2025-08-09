"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Crisis Unleashed</h3>
            <p className="text-gray-300">
              A strategic card game set in a dystopian future where factions battle for control.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/factions" className="text-gray-300 hover:text-white transition">
                  Factions
                </Link>
              </li>
              <li>
                <Link href="/cards" className="text-gray-300 hover:text-white transition">
                  Cards
                </Link>
              </li>
              <li>
                <Link href="/rules" className="text-gray-300 hover:text-white transition">
                  Game Rules
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>© {currentYear} Crisis Unleashed. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}