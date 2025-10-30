import type { IVoiceProject } from '../models/VoiceProject';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

const handleJSON = async (res: Response) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.status === 204 ? null : res.json();
};

export const voiceProjectService = {
  create: async (projectData: Partial<IVoiceProject>) => {
    const res = await fetch(`${API_BASE}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });
    return handleJSON(res);
  },

  getAll: async (): Promise<IVoiceProject[]> => {
    const res = await fetch(`${API_BASE}/api/projects`);
    return handleJSON(res);
  },

  getById: async (id: string): Promise<IVoiceProject> => {
    const res = await fetch(`${API_BASE}/api/projects/${id}`);
    return handleJSON(res);
  },

  update: async (id: string, updateData: Partial<IVoiceProject>) => {
    const res = await fetch(`${API_BASE}/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    return handleJSON(res);
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_BASE}/api/projects/${id}`, { method: 'DELETE' });
    return handleJSON(res);
  },

  searchByTags: async (tags: string[]) => {
    const q = tags.map(t => `tag=${encodeURIComponent(t)}`).join('&');
    const res = await fetch(`${API_BASE}/api/projects?${q}`);
    return handleJSON(res);
  },
};