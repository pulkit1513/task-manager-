import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'tasks.json');

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Ensure data directory and file exist
async function initStorage() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      // File does not exist, write empty array
      await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

// Helper to read tasks
async function readTasks() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tasks:', error);
    return [];
  }
}

// Helper to write tasks
async function writeTasks(tasks) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing tasks:', error);
  }
}

// REST API Routes

// 1. Get all tasks
app.get('/api/tasks', async (req, res) => {
  const tasks = await readTasks();
  res.json(tasks);
});

// 2. Add a new task
app.post('/api/tasks', async (req, res) => {
  const { title, description, dueDate } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const tasks = await readTasks();
  
  const newTask = {
    id: crypto.randomUUID(),
    title: title.trim(),
    description: (description || '').trim(),
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date().toISOString()
  };

  // Prepend to display newest first by default
  tasks.unshift(newTask);
  await writeTasks(tasks);

  res.status(201).json(newTask);
});

// 3. Update a task
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, completed } = req.body;

  const tasks = await readTasks();
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const existingTask = tasks[taskIndex];

  // Update properties if provided in the body
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    existingTask.title = title.trim();
  }

  if (description !== undefined) {
    existingTask.description = (description || '').trim();
  }

  if (dueDate !== undefined) {
    existingTask.dueDate = dueDate || null;
  }

  if (completed !== undefined) {
    existingTask.completed = Boolean(completed);
  }

  tasks[taskIndex] = existingTask;
  await writeTasks(tasks);

  res.json(existingTask);
});

// 4. Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;

  const tasks = await readTasks();
  const filteredTasks = tasks.filter(t => t.id !== id);

  if (tasks.length === filteredTasks.length) {
    return res.status(404).json({ error: 'Task not found' });
  }

  await writeTasks(filteredTasks);
  res.json({ message: 'Task deleted successfully', id });
});

// 5. Reorder tasks (Drag and Drop persistence)
app.put('/api/tasks/reorder', async (req, res) => {
  const { taskIds } = req.body;

  if (!Array.isArray(taskIds)) {
    return res.status(400).json({ error: 'taskIds array is required' });
  }

  const tasks = await readTasks();
  
  // Reorder tasks based on the provided IDs
  const taskMap = new Map(tasks.map(t => [t.id, t]));
  const reorderedTasks = [];

  for (const id of taskIds) {
    if (taskMap.has(id)) {
      reorderedTasks.push(taskMap.get(id));
      taskMap.delete(id);
    }
  }

  // If there are any remaining tasks not mentioned in taskIds, append them
  for (const task of taskMap.values()) {
    reorderedTasks.push(task);
  }

  await writeTasks(reorderedTasks);
  res.json(reorderedTasks);
});

// Initialize storage then start server
initStorage().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
