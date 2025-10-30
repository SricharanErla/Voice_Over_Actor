export interface Project {
  id?: string;
  full_name: string;
  email: string;
  project_type?: string;
  script_length?: string;
  deadline?: string;
  budget_range?: string;
  preferred_accent?: string;
  desired_tone?: string;
  project_details?: string;
  status?: string;
  created_at?: string;
}

export interface Recording {
  id?: string;
  project_id?: string;
  original_audio_url?: string;
  transformed_audio_url?: string;
  accent_applied?: string;
  tone_applied?: string;
  duration?: number;
  created_at?: string;
}

export interface VoiceTransformOptions {
  accent: string;
  tone: string;
  pitch: number;
  speed: number;
}
