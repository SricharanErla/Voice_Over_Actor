import { ChevronDown } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center relative">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Your Voice, Your <span className="text-amber-500">Brand</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Professional voice over services that bring your words to life with clarity, emotion, and impact.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => onNavigate('contact')}
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            Book a Session
          </button>
          <button
            onClick={() => onNavigate('portfolio')}
            className="border-2 border-white hover:bg-white hover:text-slate-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
          >
            Listen to Samples
          </button>
        </div>
      </div>
      <button
        onClick={() => onNavigate('about')}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <ChevronDown className="w-8 h-8 text-amber-500" />
      </button>
    </section>
  );
}
