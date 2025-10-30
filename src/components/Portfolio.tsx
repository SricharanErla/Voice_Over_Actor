import { Play, Pause } from 'lucide-react';
import { useState, useRef } from 'react';

export default function Portfolio() {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  const samples = [
    {
      title: 'Commercial - Tech Product',
      description: 'Energetic and modern voice for a cutting-edge tech brand',
      category: 'Commercial',
      duration: '0:30',
    },
    {
      title: 'Narration - Documentary',
      description: 'Warm and authoritative tone for educational content',
      category: 'Narration',
      duration: '2:15',
    },
    {
      title: 'Character - Animation',
      description: 'Playful and expressive character voice for animated series',
      category: 'Character',
      duration: '1:00',
    },
    {
      title: 'Corporate - Training Video',
      description: 'Professional and clear delivery for business training',
      category: 'Corporate',
      duration: '3:45',
    },
  ];

  const togglePlay = (index: number) => {
    if (playingIndex === index) {
      audioRefs.current[index]?.pause();
      setPlayingIndex(null);
    } else {
      if (playingIndex !== null) {
        audioRefs.current[playingIndex]?.pause();
      }
      audioRefs.current[index]?.play();
      setPlayingIndex(index);
    }
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-center">
          Portfolio
        </h2>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          Listen to samples of my work across various categories and styles
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {samples.map((sample, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => togglePlay(index)}
                  className="flex-shrink-0 w-14 h-14 bg-amber-500 hover:bg-amber-600 rounded-full flex items-center justify-center transition-colors"
                >
                  {playingIndex === index ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{sample.title}</h3>
                    <span className="text-sm text-gray-500">{sample.duration}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{sample.description}</p>
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                    {sample.category}
                  </span>
                </div>
              </div>
              <audio
                ref={(el) => (audioRefs.current[index] = el)}
                onEnded={() => setPlayingIndex(null)}
                className="hidden"
              >
                <source src="#" type="audio/mpeg" />
              </audio>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
