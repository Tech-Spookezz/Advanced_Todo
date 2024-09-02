// server.js (or app.js)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todoapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const todoSchema = new mongoose.Schema({
    title: String,
    completed: Boolean,
    createdAt: { type: Date, default: Date.now },
    dueDate: Date
});

const Todo = mongoose.model('Todo', todoSchema);

// Get all todos
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).send('Error fetching todos');
    }
});

// Add a new todo
app.post('/api/todos', async (req, res) => {
    const { title, dueDate } = req.body;
    try {
        const todo = new Todo({ title, completed: false, dueDate });
        await todo.save();
        res.status(201).json(todo);
    } catch (error) {
        res.status(400).send('Error adding todo');
    }
});

// Update a todo
app.put('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { title, completed, dueDate } = req.body;
    try {
        const todo = await Todo.findByIdAndUpdate(id, { title, completed, dueDate }, { new: true });
        res.json(todo);
    } catch (error) {
        res.status(400).send('Error updating todo');
    }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Todo.findByIdAndDelete(id);
        res.sendStatus(204);
    } catch (error) {
        res.status(400).send('Error deleting todo');
    }
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
