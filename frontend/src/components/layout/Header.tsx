"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={handleLogoClick}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LogoAli
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={handleLogoClick}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Início
            </button>
            <a
              href="#sobre"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Sobre
            </a>
            <a
              href="#contato"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Contato
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}