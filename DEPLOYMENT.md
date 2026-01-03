# Rumour Detector AI Chatbot - Deployment Guide

## Overview
This guide explains how to deploy the Rumour Detector AI Chatbot from local development to Render cloud platform. The application uses Gemini API for AI-powered rumor verification and detection.

## Architecture
- **Frontend**: Static HTML/CSS/JS files (rumour_detector.html, dashboard.html, etc.)
- **Backend**: Node.js Express server with Gemini API integration
- **Database**: Currently using in-memory storage (can be upgraded to database)
- **Deployment**: Render (render.com)

## Prerequisites
1. Node.js (v14+) installed locally
2. npm (comes with Node.js)
3. Git account with your hack4delhi repository
4. Render account (free tier available)
5. Google Gemini API key from https://aistudio.google.com/app/apikey

## Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/hanya98/hack4delhi.git
cd hack4delhi
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your actual Gemini API key
# On Mac: nano .env
# On Windows: notepad .env
```
Add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
PORT=3000
```

### 4. Run Locally
```bash
npm start
```
Visit http://localhost:3000 in your browser.

## Deploying to Render

### Step 1: Push Code to GitHub
```bash
git add -A
git commit -m "Your commit message"
git push origin main
```

### Step 2: Connect Render to GitHub
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Select "Build and deploy from a Git repository"
4. Choose your hack4delhi repository
5. Configure:
   - Name: `hack4delhi-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Plan: Free (or Paid if needed)

### Step 3: Add Environment Variables on Render
1. In the web service settings, go to "Environment"
2. Click "+ Add Environment Variable"
3. Add these variables:
   - Key: `GEMINI_API_KEY`
   - Value: Your actual Gemini API key
   
4. **Important**: Never put API keys in your code!

### Step 4: Deploy
1. Render will automatically deploy when you push to GitHub
2. Check the deployment logs in Render dashboard
3. Your backend URL will be: `https://hack4delhi-backend.onrender.com`

### Step 5: Frontend Configuration
Update frontend files to use your Render backend URL:

In `rumour_detector.html` (line ~59):
```javascript
fetch('https://hack4delhi-backend.onrender.com/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question: q })
})
```

## Troubleshooting

### Issue: "Cannot find module 'cors'" or other dependencies
**Solution**: Render will run `npm install` automatically, but ensure package.json exists and is committed.

### Issue: 503 Service Unavailable
**Cause**: Backend might be starting. Render free tier may take 30-60 seconds.
**Solution**: Wait a moment and refresh the page.

### Issue: API Key not working on Render but works locally
**Cause**: Environment variable not set properly on Render.
**Solution**: Go to Render dashboard → Your Service → Environment → Verify GEMINI_API_KEY is set.

### Issue: Frontend calling wrong backend URL
**Cause**: Frontend still calling localhost instead of Render URL.
**Solution**: Search for `localhost` in HTML files and replace with Render backend URL.

### Issue: CORS Error
**Cause**: Frontend domain not whitelisted in server.js CORS config.
**Solution**: Update CORS origin in server.js to include your frontend domain.

## Security Best Practices

✅ **DO:**
- Use environment variables for ALL secrets
- Add `.env` to `.gitignore` (never commit it)
- Rotate API keys regularly
- Use HTTPS (Render provides this automatically)

❌ **DON'T:**
- Commit API keys to GitHub
- Share API keys in chat or emails
- Use same key across multiple services
- Expose API keys in client-side code

## Performance Tips

1. **Render Free Tier**: Spins down after 15 minutes of inactivity (~30sec wake-up)
2. **Optimization**: Consider moving database operations to cloud database
3. **Caching**: Implement response caching for common queries
4. **Rate Limiting**: Add rate limiting to prevent abuse

## Monitoring

1. Check Render dashboard for:
   - Active/Inactive status
   - CPU and Memory usage
   - Deployment logs
   - Error tracking

2. Test endpoints:
   ```bash
   curl -X POST https://hack4delhi-backend.onrender.com/api/chat \
     -H "Content-Type: application/json" \
     -d '{"question": "Is this rumor true?"}'
   ```

## Next Steps

1. **Database**: Migrate from in-memory to MongoDB/PostgreSQL
2. **Frontend Hosting**: Deploy frontend to Render static site or Vercel
3. **Analytics**: Add logging and monitoring
4. **Testing**: Set up automated tests
5. **CI/CD**: Configure GitHub Actions for automated deployment

## Support
For issues, check:
- Render documentation: https://render.com/docs
- Google Gemini API docs: https://ai.google.dev
- Node.js documentation: https://nodejs.org/docs
