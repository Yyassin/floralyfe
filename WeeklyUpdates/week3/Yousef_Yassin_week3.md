## Weekly Individual Project Update Report
### Group number: L3 **G5**
### Student name: Yousef Yassin
### Week: Week 3, Monday January 24th to Sunday January 30th
___
1. **How many hours did you spend on the project this week? 9**

2. **Give rough breakdown of hours spent on 1-3 of the following:***
   1. Brainstorming, 3 hours
   2. Evaluating Options, 1 hour
   3. Protoyping, 4 hours
   
3. ***What did you accomplish this week?***
     - Conducted a team meeting to finalize our project idea and the use cases we were going to implement. Decided on an indoor smart plant monitoring system that would.
       -  Track plant growth (provides historical data).
       -  Support growth by monitoring moisture/sandlight and ensuring adequate amounts through actuated water disposer. 
       -  Display a live plant camera feed (video or picture, not clear yet - see below)
       -  Recognize plant species by feed and display pertinent statistics (how many hours of sunlight this plant typically requires for optimal growth.)
       -  Recognize humans and pet animals that are close to plant
       -  Sends notifications on human/pet encounters and also critical environmental conditions (too much sunlight, extreme temperature or no water).
     - I started brainstorming ideas to implement the live plant camera feed. Came up with the following:
       - Run a (flask) server on each raspberry pi that serves the feed to the client website. Not a great solution since we'd need to make the servers reachable somehow.
       - Use a third party application to stream the camera feed but this wouldn't allow us to send python-processed (opencv) images.
       - Create a websocket server (which can be deployed) that each pi sends the encoded frames to. The client connects to the socket to receive the images and recreate a feed.
     - I've started prototyping the websocket idea.
       - A node server has been implemented and a python client is successfully able to connect and send images encoded with base64 which are successfully received as bytearrays.
       - I created a basic React client to receive the sent data and display the image. However, currently having issues where the website is encountering errors while attempting to connect to the websocket possibly due to certification issues.
  
4. ***How do you feel about your progress?*** 
     - Finalizing the major part of our project was a good first step and I'm happy that we can now start with deeper planning on the implementation and architecture side.
     - The live camera feed is likely to be one of the more difficult parts of the projects which is why I'm trying to tackle it early.
     - While I haven't been successful yet, I did achieve end-to-end communication between node and python which is a major first step and has provided several insights on how we can achieve communication going forward.
  
5. ***What are you planning to do next week***? 
     - Resolve the React connection error. I have several ideas to experiment with including missing protocol types and/or a cors (Cross-Origin Resource Sharing) issue that is blocking the connection. 
     - Brainstorm and write a first draft of our Project Proposal
     - Brainstorm what and how we'll be storing data in our database (look into firebase real-time database streaming and the Prisma ORM for the client).
     - Look into plant recognition APIs and set up a small prototype where an image is sent and plant data is received.
  
6. ***Is anything blocking you that you need from others?*** _(What do you need from whom)_
     - Nothing is really blocking me so far, there's a lot to still prototype and brainstorm.
     - I do need to meet with the team and decide on a backend database structure to start planning how we'll be storing and receiving our data. A basic protoype can be made without this but having a meeting will be useful.