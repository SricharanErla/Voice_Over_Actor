require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/voice_over_db';

app.use(cors());
app.use(bodyParser.json());

// Mongoose schema and model
const voiceProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  audioUrl: { type: String, required: true },
  duration: { type: Number, required: true },
  status: { type: String, enum: ['draft', 'in-progress', 'completed'], default: 'draft' },
  tags: [{ type: String }]
}, { timestamps: true });

const VoiceProject = mongoose.models.VoiceProject || mongoose.model('VoiceProject', voiceProjectSchema);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Server: Connected to MongoDB');
}).catch(err => {
  console.error('Server: MongoDB connection error', err);
});

// Routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await VoiceProject.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('GET /api/projects error', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const data = req.body;
    const project = new VoiceProject(data);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error('POST /api/projects error', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await VoiceProject.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (err) {
    console.error('GET /api/projects/:id error', err);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const project = await VoiceProject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (err) {
    console.error('PUT /api/projects/:id error', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const project = await VoiceProject.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/projects/:id error', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

app.listen(PORT, () => {
  console.log(`Server: Listening on port ${PORT}`);
});