## Weekly Individual Project Update Report
### Group number: L3 **G5**
### Student name: Yousef Yassin
### Week: Week 5, Monday February 14th to Sunday February 20th
___
1. **How many hours did you spend on the project this week? 5 hours**

2. **Give rough breakdown of hours spent on 1-3 of the following:***
   1. Brainstorming / Group Meeting, 1 hours
   2. Information Gathering, 2 hours
   3. Prototyping, 2 hours
   
3. ***What did you accomplish this week?***
     - This has been the least productive week in terms of accomplishing work for the project since there were several deadlines and exams that required attention for other classes. 
     - That said, some things were still accomplished.
     - The team had a meeting and we've nearly finalized which components we'll be using for our project. The one thing that remains is figuring out if we'll need a relay/external source to power servos / water pumps but this will be finalized tomorrow when we meet to complete the hardware order.
     - I've also started working on the website for the project. I've got a NextJS (shifted from vanilla React) site running with a functional websocket connection (with both send and receive functional and fast but haven't tested with a pi yet - only local tests for now). 
     - The goal is to get a good base for the web structure by the end of reading. I'll talk more about these plans below.

4. ***How do you feel about your progress?*** 
     - All major "planning" for the project is nearly completed. It feels great to be close to finally beginning development. It is disappointing that not much progress occured this week in terms of forwarding the project (not really in our control), but I hope this coming week makes up for that.
  
5. ***What are you planning to do next week***? 
     - Lots of things.

     ##### Web Interface & WebSockets 
     - We've got a basic NextJS site working, along with a WebSocket server. I'd like to wrap the WebSocket with a class-based API that allows for simple multiplexing (sending/receiving with client IDs) - this will be on the server side.
     - Client-side I'd also like to create a wrapper hook that allows for easy subscription to socket "topics" - this would allow components to subscribe to "plant-vital" or "camera-image" topics and ignore other messages. These should also be demultiplexed based on id on the client.
     - Testing already works with the server. There's an extension to the library we're using called "superwstest" that allows websocket testing. That's on the list of things to set up as well.
  
     ##### Firestore & GraphQL
     - Once the sockets are functional, the database will be setup with a few schemas. Ideally, we'll have a basic API (GraphQL?) on the server that wraps the database interface and I'd like to setup data subscriptions to register changes in realtime.

     ##### Plant Recognition Prototype
     - The goal is to create a small prototype with typescript where a base64 image is converted to an image and sent to the PlantID API. If that works, then the pi system can respond with an encoded image whenever plant recognition is necessary.
     - Creating a PIL or CV script that can mask green pixels from an image and count them to approximate the size of plant. We could use this to monitor the growth of a plant. 


     - I'm aware these are ambitious goals. The intention is to start all of these sub-projects and have a good base that's easy to build on later.
  
6. ***Is anything blocking you that you need from others?*** _(What do you need from whom)_
     - Nothing is really blocking me so far, there's a lot to still prototype and so I'm not yet at the point where I need something done to continue any work.
     - I do hope to meet with the team to finalize our hardware purchase orders this week. They're basically finalized, we just need to do a bit more research on how the pi can interface with DC motors.