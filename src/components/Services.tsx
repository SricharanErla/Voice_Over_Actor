import { Briefcase, Headphones, Mic2, Radio, BookOpen, Video } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Radio,
      title: 'Commercial Voice Overs',
      description: 'Engaging and persuasive voice for TV, radio, and online advertisements that capture attention and drive results.',
    },
    {
      icon: Video,
      title: 'Corporate Narration',
      description: 'Professional and authoritative delivery for training videos, presentations, and corporate communications.',
    },
    {
      icon: BookOpen,
      title: 'Audiobook Narration',
      description: 'Captivating storytelling that brings characters to life and keeps listeners engaged from start to finish.',
    },
    {
      icon: Mic2,
      title: 'Character Voices',
      description: 'Versatile character work for animation, video games, and interactive media with unique personalities.',
    },
    {
      icon: Headphones,
      title: 'E-Learning & Training',
      description: 'Clear and engaging narration for educational content, online courses, and instructional materials.',
    },
    {
      icon: Briefcase,
      title: 'IVR & Phone Systems',
      description: 'Professional voice prompts and messages for phone systems, virtual assistants, and automated services.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-center">
          Services
        </h2>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          Comprehensive voice over solutions tailored to your project needs
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-xl bg-slate-50 hover:bg-amber-50 transition-all hover:shadow-lg border-2 border-transparent hover:border-amber-200"
              >
                <div className="inline-block p-3 bg-amber-500 rounded-lg mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
