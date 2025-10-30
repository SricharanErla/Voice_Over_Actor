import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Download, Sliders } from 'lucide-react';
import { VoiceTransformOptions } from '../types';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
}

export default function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState<string>('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTransform, setShowTransform] = useState(false);
  const [transformedAudioURL, setTransformedAudioURL] = useState<string>('');
  const [isTransformed, setIsTransformed] = useState(false);


  
  const [transformOptions, setTransformOptions] = useState<VoiceTransformOptions>({
    accent: 'neutral',
    tone: 'natural',
    pitch: 1,
    speed: 1,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        onRecordingComplete(audioBlob, recordingTime);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const togglePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) clearInterval(timerRef.current);
      }
      setIsPaused(!isPaused);
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const downloadRecording = () => {
    if (audioURL) {
      const a = document.createElement('a');
      a.href = audioURL;
      a.download = `recording-${Date.now()}.webm`;
      a.click();
    }
  };

  const applyTransformation = async () => {
    if (!audioURL) return;

    try {
      const response = await fetch(audioURL);
      const blob = await response.blob();

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );

      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.playbackRate.value = transformOptions.speed;

      source.connect(offlineContext.destination);
      source.start();

      const renderedBuffer = await offlineContext.startRendering();

      const numberOfChannels = renderedBuffer.numberOfChannels;
      const length = renderedBuffer.length * numberOfChannels * 2;
      const buffer = new ArrayBuffer(44 + length);
      const view = new DataView(buffer);

      const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(0, 'RIFF');
      view.setUint32(4, 36 + length, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numberOfChannels, true);
      view.setUint32(24, renderedBuffer.sampleRate, true);
      view.setUint32(28, renderedBuffer.sampleRate * numberOfChannels * 2, true);
      view.setUint16(32, numberOfChannels * 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, length, true);

      let offset = 44;
      for (let i = 0; i < renderedBuffer.length; i++) {
        for (let channel = 0; channel < numberOfChannels; channel++) {
          const sample = Math.max(-1, Math.min(1, renderedBuffer.getChannelData(channel)[i]));
          view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
          offset += 2;
        }
      }

      const transformedBlob = new Blob([buffer], { type: 'audio/wav' });
      const transformedURL = URL.createObjectURL(transformedBlob);

      setTransformedAudioURL(transformedURL);
      setIsTransformed(true);

      const a = document.createElement('a');
      a.href = transformedURL;
      a.download = `transformed-recording-${Date.now()}.wav`;
      a.click();

    } catch (error) {
      console.error('Error transforming audio:', error);
      alert('Error transforming audio. Please try again.');
    }
  };

  const downloadTransformedRecording = () => {
    if (transformedAudioURL) {
      const a = document.createElement('a');
      a.href = transformedAudioURL;
      a.download = `transformed-recording-${Date.now()}.wav`;
      a.click();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-4">
            <Mic className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Voice Recorder</h3>
          <p className="text-gray-600">Record your voice and transform it with AI</p>
        </div>

        <div className="bg-slate-50 rounded-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-mono font-bold text-slate-900 mb-2">
              {formatTime(recordingTime)}
            </div>
            {isRecording && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-500 font-medium">
                  {isPaused ? 'Paused' : 'Recording...'}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-105"
              >
                <Mic className="w-5 h-5" />
                Start Recording
              </button>
            ) : (
              <>
                <button
                  onClick={togglePause}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-5 h-5" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-5 h-5" />
                      Pause
                    </>
                  )}
                </button>
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-full font-semibold transition-colors"
                >
                  <Square className="w-5 h-5" />
                  Stop
                </button>
              </>
            )}
          </div>
        </div>

        {audioURL && (
          <>
            <div className="bg-slate-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-slate-900 mb-4">Playback & Download</h4>
              <audio
                ref={audioRef}
                src={audioURL}
                onEnded={() => setIsPlaying(false)}
                className="w-full mb-4"
                controls
              />
              <div className="flex gap-3">
                <button
                  onClick={togglePlayback}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={downloadRecording}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => setShowTransform(!showTransform)}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors ml-auto"
                >
                  <Sliders className="w-4 h-4" />
                  Transform Voice
                </button>
              </div>
            </div>

            {showTransform && (
              <div className="bg-gradient-to-br from-blue-50 to-amber-50 rounded-lg p-6">
                <h4 className="font-semibold text-slate-900 mb-4">Voice Transformation</h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Accent
                    </label>
                    <select
                      value={transformOptions.accent}
                      onChange={(e) => setTransformOptions({ ...transformOptions, accent: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="neutral">Neutral</option>
                      <option value="american">American</option>
                      <option value="british">British</option>
                      <option value="australian">Australian</option>
                      <option value="indian">Indian</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="spanish">Spanish</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tone
                    </label>
                    <select
                      value={transformOptions.tone}
                      onChange={(e) => setTransformOptions({ ...transformOptions, tone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="natural">Natural</option>
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="authoritative">Authoritative</option>
                      <option value="energetic">Energetic</option>
                      <option value="calm">Calm</option>
                      <option value="dramatic">Dramatic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Pitch: {transformOptions.pitch.toFixed(1)}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={transformOptions.pitch}
                      onChange={(e) => setTransformOptions({ ...transformOptions, pitch: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Lower</span>
                      <span>Higher</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Speed: {transformOptions.speed.toFixed(1)}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={transformOptions.speed}
                      onChange={(e) => setTransformOptions({ ...transformOptions, speed: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Slower</span>
                      <span>Faster</span>
                    </div>
                  </div>

                  <button
                    onClick={applyTransformation}
                    className="w-full bg-gradient-to-r from-blue-500 to-amber-500 hover:from-blue-600 hover:to-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                  >
                    Apply Transformation
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
