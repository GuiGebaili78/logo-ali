"use client";

import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="bg-accent w-12 h-12 rounded-full flex items-center justify-center">
              <span className="text-light text-xl font-bold">L</span>
            </div>
            <div>
              <h1 className="text-light text-2xl font-bold">LogoAli</h1>
              <p className="text-gray-300 text-sm">Serviços Públicos SP</p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-6">
            <a
              href="#"
              className="text-light hover:text-accent transition-colors"
            >
              Início
            </a>
            <a
              href="#"
              className="text-light hover:text-accent transition-colors"
            >
              Serviços
            </a>
            <a
              href="#"
              className="text-light hover:text-accent transition-colors"
            >
              Sobre
            </a>
            <a
              href="#"
              className="text-light hover:text-accent transition-colors"
            >
              Contato
            </a>
          </nav>

          <button
            className="md:hidden text-light"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-secondary">
          <div className="px-4 pb-4 space-y-2">
            <a href="#" className="block text-light hover:text-accent py-2">
              Início
            </a>
            <a href="#" className="block text-light hover:text-accent py-2">
              Serviços
            </a>
            <a href="#" className="block text-light hover:text-accent py-2">
              Sobre
            </a>
            <a href="#" className="block text-light hover:text-accent py-2">
              Contato
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
