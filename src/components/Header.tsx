import { Mic } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

export default function Header({ onNavigate, currentSection }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'services', label: 'Services' },
    { id: 'record', label: 'Record' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-900 text-white z-50 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-amber-500 p-3 rounded-full">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">VoiceArtistry</h1>
              <p className="text-sm text-amber-500">Professional Voice Over Services</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`transition-colors ${
                  currentSection === item.id
                    ? 'text-amber-500 font-semibold'
                    : 'text-white hover:text-amber-400'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => onNavigate('contact')}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Contact Me
            </button>
          </nav>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left transition-colors ${
                  currentSection === item.id
                    ? 'text-amber-500 font-semibold'
                    : 'text-white hover:text-amber-400'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors text-left"
            >
              Contact Me
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
