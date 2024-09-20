const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(express.json());

// Serve static files (index.html, app.js, styles.css, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Handle favicon.ico request (Ignore favicon request)
app.get('/favicon.ico', (req, res) => res.status(204));  // No content

// In-memory task storage (array)
let tasks = [];

// Get all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
    const { title, completed } = req.body;

    if (!title) {
        return res.status(400).send('Title is required');
    }

    const newTask = {
        id: tasks.length + 1,
        title,
        completed: completed || false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Update a task
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, completed } = req.body;

    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        return res.status(404).send('Task not found');
    }

    // Ensure title is non-empty and completed is a boolean
    if (title && title.trim() === '') {
        return res.status(400).send('Title cannot be empty');
    }
    if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).send('Completed must be a boolean');
    }

    // Update the task properties
    task.title = title ? title : task.title;
    task.completed = completed !== undefined ? completed : task.completed;

    // Send the updated task in the response
    res.json(task);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).send('Task not found');
    }

    tasks.splice(taskIndex, 1);
    res.status(204).send();
});

// Fallback route for serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
