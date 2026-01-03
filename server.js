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
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
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
        timeout: 15000
      }
    );

    if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content && response.data.candidates[0].content.parts && response.data.candidates[0].content.parts[0]) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      return 'No response from API';
    }
  } catch (err) {
    console.error('Gemini error:', err.response?.data || err.message);
    throw err;
  }
}

app.post('/api/chat', async (req, res) => {
  try {
      console.log('[API] Received question:', question);
    const { question } = req.body;
    
    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Empty question' });
    }

    const answer = await askGemini(question);
      console.log('[API] Got answer:', answer);
    res.json({ answer });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log('Server on port ' + PORT);
  console.log('Using: gemini-2.5-flash');
});
