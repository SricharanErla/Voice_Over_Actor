export interface IVoiceProject {
  _id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  status: 'draft' | 'in-progress' | 'completed';
  tags: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}