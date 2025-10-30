import React, { useEffect, useState } from 'react';
import { voiceProjectService } from '../services/voiceProjectService';
import type { IVoiceProject } from '../models/VoiceProject';

interface ProjectFormData {
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  tags: string;
}

const MongoProjects: React.FC = () => {
  const [projects, setProjects] = useState<IVoiceProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    audioUrl: '',
    duration: 0,
    tags: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      audioUrl: '',
      duration: 0,
      tags: '',
    });
  };

  // Load projects
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await voiceProjectService.getAll();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to load projects from the backend API. If the server isn't running
    // the fetch will fail and we'll show an error message.
    loadProjects();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const projectData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };
      await voiceProjectService.create(projectData);
      resetForm();
      await loadProjects(); // Refresh the list
    } catch (err) {
      setError('Failed to create project: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error creating project:', err);
    }
  };

  // Handle project deletion
  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await voiceProjectService.delete(id);
      await loadProjects(); // Refresh the list
    } catch (err) {
      setError('Failed to delete project: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error deleting project:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Voice Projects</h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {/* Add Project Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="audioUrl">
              Audio URL
            </label>
            <input
              id="audioUrl"
              type="text"
              value={formData.audioUrl}
              onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
              Duration (seconds)
            </label>
            <input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="tag1, tag2, tag3"
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Project
          </button>
        </div>
      </form>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Duration: {project.duration}s</p>
                <p className="text-sm text-gray-500">Status: {project.status}</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleDelete(project._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MongoProjects;