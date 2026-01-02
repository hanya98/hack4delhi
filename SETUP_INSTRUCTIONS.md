# how to run this thing

tbh the chatbot works best if you run the backend server locally. here's how:

## what you need
- node.js installed (grab it from nodejs.org if u don't have it)
- your groq api key

## getting it running

1. open terminal in your project folder
2. run `npm install`
3. make a `.env` file and add your keys:
   ```
   GROQ_API_KEY=your_key_here
   PORT=3000
   ```
4. start the server with `node server.js`
5. go to http://localhost:3000/rumour_detector.html in your browser

if the server is running it should just work. if it doesn't, check the terminal for errors
