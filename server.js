const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  headers: ['Content-Type']
}));

app.use(express.json());
app.use(express.static('.'));

const PORT = process.env.PORT || 3000;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

async function askGemini(userQuestion) {
  try {
    console.log('[Gemini] Calling API with key:', GEMINI_KEY ? 'Present' : 'Missing');
    console.log('[Gemini] Question:', userQuestion);
    
    const response = await axios.post(
 `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_KEY}`,      {
        contents: [{
          parts: [{
            text: userQuestion
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );
    
    console.log('[Gemini] Got response');
    
    if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content && response.data.candidates[0].content.parts && response.data.candidates[0].content.parts[0]) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      console.log('[Gemini] No candidates in response');
      return 'I could not generate a response. Please try again.';
    }
  } catch (err) {
    console.error('[Gemini Error]', err.response?.status, err.response?.data || err.message);
    throw err;
  }
}

app.post('/api/chat', async (req, res) => {
  try {
    const { question } = req.body;
    console.log('[API] Received question:', question);
    
    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Empty question' });
    }
    
    if (!GEMINI_KEY) {
      console.error('[API] API Key not configured');
      return res.status(500).json({ answer: 'API key not configured. Please set GEMINI_API_KEY environment variable.' });
    }
    
    const answer = await askGemini(question);
    console.log('[API] Sending answer');
    res.json({ answer });
    
  } catch (err) {
    console.error('[API Error]', err.message);
    res.status(500).json({ answer: 'Server error: ' + (err.message || 'Unknown error') });
  }
});

app.listen(PORT, () => {
  console.log('========================================');
  console.log('Server running on http://localhost:' + PORT);
  console.log('Rumour Detector API: http://localhost:' + PORT + '/api/chat');
  console.log('Health Check: http://localhost:' + PORT + '/health');
  console.log('========================================');
  console.log('');
  if (GEMINI_KEY) {
    console.log('Using Gemini API Key: ✓ Configured');
  } else {
    console.log('Using Gemini API Key: ✗ NOT CONFIGURED');
  }
  console.log('');
});
