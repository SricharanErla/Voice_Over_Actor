import { Award, Clock, Users } from 'lucide-react';

export default function About() {
  const stats = [
    { icon: Users, label: 'Satisfied Clients', value: '500+' },
    { icon: Clock, label: 'Hours Recorded', value: '10,000+' },
    { icon: Award, label: 'Industry Awards', value: '15+' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 text-center">
            About the Voice Behind the Brand
          </h2>
          <p className="text-lg text-gray-700 mb-12 text-center leading-relaxed">
            With over a decade of experience in voice over work, I've helped countless brands find their unique voice.
            From commercials to audiobooks, corporate videos to character animation, I bring versatility,
            professionalism, and passion to every project.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="inline-block p-4 bg-amber-500 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
