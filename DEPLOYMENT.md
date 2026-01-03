# deploying the rumour detector

so basically you got the chatbot working locally right? now you gotta get it on the cloud so like people can actually use it without you having your laptop running 24/7 lol

## what you need before starting

first make sure you got:
- node.js installed
- npm (it comes with node)
- a github account (duh)
- render account - go to render.com, its free
- that gemini api key you got

## setting up locally first

this is real quick. just do:

1. clone it if you havent
   git clone https://github.com/hanya98/hack4delhi.git
   cd hack4delhi

2. copy the env file
   cp .env.example .env

3. add your gemini key to the .env file (just paste it where it says your_gemini_api_key_here)

4. npm install

5. npm start

go to localhost:3000 and make sure everything works. if the chatbot responds, youre good.

## pushing to render

ok so render just deploys whatever is in your github main branch. so first push your code:

git add -A
git commit -m "getting ready to deploy"
git push origin main

then go to render.com and:

1. click "new" and pick "web service"
2. connect your github repo (hack4delhi)
3. give it a name like hack4delhi-backend
4. environment is Node
5. build command: npm install
6. start command: node server.js
7. then scroll down to environment and add GEMINI_API_KEY with your actual key

## after deployment

render will automatically deploy when you push to github. you can check the logs to see if its working.

your backend url will be something like https://hack4delhi-backend.onrender.com

the frontend is already set up to call this url so you should be good.

## if stuff breaks

common issues:
- "cannot find module" - just run npm install again
- "service unavailable" - free tier takes like 30 seconds to start up, just wait
- api not responding - check that your gemini key is actually in the render environment variables
- cors error - make sure the frontend url is whitelisted in server.js

## in case you need to update

just change your code, push to github, and render auto deploys. nice right
