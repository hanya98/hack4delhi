# Quick Setup for Rumour Detector

## What's Been Fixed
Your Rumour Detector chatbot is now ready for deployment! Here's what was done:

1. **Gemini API Key Security** - Moved the hardcoded API key out of the code and into environment variables
2. **Environment Template** - Created .env.example so you know what config you need
3. **Deployment Guide** - Full instructions on how to deploy to Render in DEPLOYMENT.md

## For Local Testing (Next 5 Minutes)

1. Copy the example env file:
   `cp .env.example .env`

2. Edit .env and paste your Gemini API key there (the one you shared)

3. Install packages:
   `npm install`

4. Start the server:
   `npm start`

5. Open your browser and go to http://localhost:3000

That's it! Your chatbot should be working locally.

## For Render Deployment (When Ready)

Read through DEPLOYMENT.md - it's got everything you need to get this running on the cloud.

The main steps are:
1. Push your code to GitHub (it's already there)
2. Connect your repo to Render
3. Add the GEMINI_API_KEY as an environment variable on Render
4. Done - Render will auto-deploy

## Important Security Notes

**Never put API keys in your code!** 
We moved it to environment variables, so keep it that way.

**Don't commit .env files to GitHub!**
The .gitignore should already have this, but double-check.

## Troubleshooting

- **Local: "Cannot find module 'cors'"?** → Run `npm install` again
- **Local: Port already in use?** → Change PORT in .env to 3001 or 3002
- **Render: 503 error?** → The free tier takes 30-60 seconds to start up, just wait a bit
- **Render: API not working?** → Make sure GEMINI_API_KEY env var is set in Render dashboard

## Questions?
Check DEPLOYMENT.md for more detailed info, or look at the code comments in server.js
