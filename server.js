const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const PORT = process.env.PORT || 3000;

// API Keys from environment variables
const GROQ_API_KEY = process.env.GROQ_API_KEY || 'fa56797b2e8857d005bc131a33d2416a0b4b4f16fcf3afcf8ea822b765cd1cd4';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// System prompt for Delhi policies
const SYSTEM_PROMPT = `You are a knowledgeable assistant about Delhi government policies, schemes, and facts.
Current information:
- Current CM of Delhi: Rekha Gupta
- You provide accurate information about Delhi government schemes and policies
- Answer questions about Delhi facts, policies, and rumors
- Be concise and factual in your responses`;

// Function to call Groq API
async function callGroqAPI(question) {
  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'mixtral-8x7b-32768',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: question }
      ],
      temperature: 0.7,
      max_tokens: 1024
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API Error:', error.message);
    throw error;
  }
}

// Function to call OpenAI API
async function callOpenAI(question) {
  if (!OPENAI_API_KEY) throw new Error('OpenAI API key not configured');
  
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: question }
      ],
      temperature: 0.7,
      max_tokens: 1024
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    throw error;
  }
}

// Function to call Claude API
async function callClaude(question) {
  if (!ANTHROPIC_API_KEY) throw new Error('Claude API key not configured');
  
  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: question }
      ]
    }, {
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    });
    
    return response.data.content[0].text;
  } catch (error) {
    console.error('Claude API Error:', error.message);
    throw error;
  }
}

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    let answer;
    let source;
    
    // Try Groq first (free, reliable)
    try {
      answer = await callGroqAPI(question);
      source = 'Groq';
    } catch (groqError) {
      console.log('Groq failed, trying OpenAI...');
      
      // Fallback to OpenAI
      if (OPENAI_API_KEY) {
        try {
          answer = await callOpenAI(question);
          source = 'OpenAI';
        } catch (openaiError) {
          console.log('OpenAI failed, trying Claude...');
          
          // Fallback to Claude
          if (ANTHROPIC_API_KEY) {
            answer = await callClaude(question);
            source = 'Claude';
          } else {
            throw new Error('All APIs failed and no fallback available');
          }
        }
      } else if (ANTHROPIC_API_KEY) {
        answer = await callClaude(question);
        source = 'Claude';
      } else {
        throw groqError;
      }
    }
    
    res.json({ answer, source });
  } catch (error) {
    console.error('Chat Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to get response. Make sure API keys are configured properly.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n=== Delhi Rumour Detector Server ===`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Using APIs:`);
  console.log(`- Groq: ${GROQ_API_KEY ? 'Configured' : 'Not configured'}`);
  console.log(`- OpenAI: ${OPENAI_API_KEY ? 'Configured' : 'Not configured'}`);
  console.log(`- Claude: ${ANTHROPIC_API_KEY ? 'Configured' : 'Not configured'}`);
  console.log('=====================================\n');
});
