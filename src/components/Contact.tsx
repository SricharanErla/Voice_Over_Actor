import { useState } from 'react';
import { Mail, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Project } from '../types';

export default function Contact() {
  const [formData, setFormData] = useState<Partial<Project>>({
    full_name: '',
    email: '',
    project_type: '',
    script_length: '',
    deadline: '',
    budget_range: '',
    preferred_accent: '',
    desired_tone: '',
    project_details: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('projects')
        .insert([{ ...formData, status: 'pending' }]);

      if (error) {
        console.error('Error submitting project:', error);
        alert('Error submitting project. Please try again.');
      } else {
        setSubmitted(true);
        setFormData({
          full_name: '',
          email: '',
          project_type: '',
          script_length: '',
          deadline: '',
          budget_range: '',
          preferred_accent: '',
          desired_tone: '',
          project_details: '',
        });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Project Details
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Fill out the form with your project requirements. I'll review your needs and provide a custom
                quote along with sample recordings if needed.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Email Me At</h3>
                    <a href="mailto:hello@voiceartistry.com" className="text-amber-600 hover:text-amber-700">
                      hello@voiceartistry.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Response Time</h3>
                    <p className="text-gray-600">Within 24 hours</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Booking Availability</h3>
                    <p className="text-gray-600">Currently accepting new projects</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
                  <p className="text-gray-600">
                    Your project inquiry has been submitted successfully. I'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Project Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="project_type"
                        value={formData.project_type}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="">Select project type</option>
                        <option value="commercial">Commercial</option>
                        <option value="corporate">Corporate</option>
                        <option value="audiobook">Audiobook</option>
                        <option value="character">Character Voice</option>
                        <option value="elearning">E-Learning</option>
                        <option value="ivr">IVR/Phone System</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Script Length <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="script_length"
                        value={formData.script_length}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="">Select length</option>
                        <option value="0-30">0-30 seconds</option>
                        <option value="30-60">30-60 seconds</option>
                        <option value="1-3">1-3 minutes</option>
                        <option value="3-5">3-5 minutes</option>
                        <option value="5-10">5-10 minutes</option>
                        <option value="10+">10+ minutes</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Project Deadline
                      </label>
                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Budget Range
                      </label>
                      <select
                        name="budget_range"
                        value={formData.budget_range}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="">Select budget range</option>
                        <option value="under-500">Under $500</option>
                        <option value="500-1000">$500 - $1,000</option>
                        <option value="1000-2500">$1,000 - $2,500</option>
                        <option value="2500-5000">$2,500 - $5,000</option>
                        <option value="5000+">$5,000+</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Preferred Accent
                      </label>
                      <select
                        name="preferred_accent"
                        value={formData.preferred_accent}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="">Select accent</option>
                        <option value="neutral">Neutral</option>
                        <option value="american">American</option>
                        <option value="british">British</option>
                        <option value="australian">Australian</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Desired Tone
                      </label>
                      <select
                        name="desired_tone"
                        value={formData.desired_tone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="">Select tone</option>
                        <option value="professional">Professional</option>
                        <option value="friendly">Friendly</option>
                        <option value="authoritative">Authoritative</option>
                        <option value="energetic">Energetic</option>
                        <option value="calm">Calm</option>
                        <option value="conversational">Conversational</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Project Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="project_details"
                      value={formData.project_details}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Please provide details about your project, including any specific requirements, script details, or reference examples..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-5 h-5" />
                        Submit Project Inquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
