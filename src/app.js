const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

// Routes
app.get('/', (req, res) => {
  res.render('index', { error: null });
});
app.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`Attempting login with email: ${email}, backend: ${backendUrl}`);
    const response = await axios.post(`${backendUrl}/auth/login`, { email });
    res.redirect(`/dashboard?user_id=${response.data.user_id}`);
  } catch (error) {
    console.error('Login error:', error.message);
    res.render('index', { error: 'Login failed' });
  }
});
app.get('/dashboard', async (req, res) => {
  try {
    const { user_id } = req.query;
    console.log(`Fetching content for user_id: ${user_id}, backend: ${backendUrl}`);
    const content = await axios.get(`${backendUrl}/learning/content/${user_id}`);
    res.render('dashboard', { user_id, content: content.data, error: null });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.render('index', { error: 'Failed to load content' });
  }
});
app.post('/progress', async (req, res) => {
  try {
    const { user_id, module, progress } = req.body;
    console.log(`Updating progress for user_id: ${user_id}, module: ${module}`);
    await axios.post(`${backendUrl}/learning/progress/${user_id}`, { module, progress });
    res.redirect(`/dashboard?user_id=${user_id}`);
  } catch (error) {
    console.error('Progress error:', error.message);
    res.render('dashboard', { user_id, content: {}, error: 'Failed to update progress' });
  }
});

module.exports = app;
