import { useState } from 'react';
import VoiceRecorder from './VoiceRecorder';
import { supabase } from '../lib/supabase';
import { Recording } from '../types';
import { CheckCircle, Loader } from 'lucide-react';

export default function Record() {
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecording, setSavedRecording] = useState<Recording | null>(null);

  const handleRecordingComplete = async (audioBlob: Blob, duration: number) => {
    setIsSaving(true);
    try {
      const fileName = `recording-${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(fileName, audioBlob);

      if (uploadError) {
        console.error('Upload error:', uploadError);
      }

      const recording: Omit<Recording, 'id' | 'created_at'> = {
        original_audio_url: uploadData?.path || '',
        duration: duration,
      };

      const { data, error } = await supabase
        .from('recordings')
        .insert([recording])
        .select()
        .maybeSingle();

      if (error) {
        console.error('Database error:', error);
      } else if (data) {
        setSavedRecording(data);
      }
    } catch (error) {
      console.error('Error saving recording:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-center">
            Record Your Voice
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center">
            Record your voice and transform it with AI-powered accent and tone modifications
          </p>

          <VoiceRecorder onRecordingComplete={handleRecordingComplete} />

          {isSaving && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
              <Loader className="w-5 h-5 text-blue-500 animate-spin" />
              <span className="text-blue-700 font-medium">Saving your recording...</span>
            </div>
          )}

          {savedRecording && !isSaving && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700 font-medium">Recording saved successfully!</span>
            </div>
          )}

          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Features</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Record High-Quality Audio</h4>
                  <p className="text-gray-600 text-sm">
                    Capture crystal-clear voice recordings directly from your browser
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Choose Your Accent</h4>
                  <p className="text-gray-600 text-sm">
                    Transform your voice into different accents including American, British, and more
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Adjust Tone & Style</h4>
                  <p className="text-gray-600 text-sm">
                    Modify the conversational tone from professional to energetic
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Fine-Tune Audio</h4>
                  <p className="text-gray-600 text-sm">
                    Control pitch and speed to get the perfect sound for your project
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
