const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
app.use(express.json());
app.use(express.static('.'));

const PORT = process.env.PORT || 3000;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

async function askGemini(userQuestion) {
  try {
    console.log('[Gemini] API Key status:', GEMINI_KEY ? 'Present' : 'Missing');
    console.log('[Gemini] Question:', userQuestion);
    
    if (!GEMINI_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const payload = {
      contents: [{
        parts: [{
          text: userQuestion
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    };

    console.log('[Gemini] Sending request to Gemini API...');
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_KEY}`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );

    console.log('[Gemini] Got response from API');
    console.log('[Gemini] Response data:', JSON.stringify(response.data).substring(0, 200));
    
    if (response.data && response.data.candidates && response.data.candidates.length > 0) {
      const candidate = response.data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        const answer = candidate.content.parts[0].text;
        console.log('[Gemini] Extracted answer:', answer.substring(0, 100));
        return answer;
      }
    }
    
    console.log('[Gemini] No valid response structure found');
    return 'I could not generate a response. Please try again.';
    
  } catch (err) {
    console.error('[Gemini Error] Status:', err.response?.status);
    console.error('[Gemini Error] Data:', JSON.stringify(err.response?.data || err.message).substring(0, 300));
    console.error('[Gemini Error] Full error:', err.message);
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
      return res.status(500).json({ answer: 'API key not configured' });
    }
    
    const answer = await askGemini(question);
    console.log('[API] Sending answer to client');
    res.json({ answer });
    
  } catch (err) {
    console.error('[API Error]', err.message);
    res.status(500).json({ answer: 'Server error: ' + (err.message || 'Unknown error') });
  }
});


app.post('/api/test', async (req, res) => {
  res.json({ answer: 'backend is working test endpoint' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
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
