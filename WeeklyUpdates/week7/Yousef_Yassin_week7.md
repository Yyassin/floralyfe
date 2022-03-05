## Weekly Individual Project Update Report
### Group number: L3 **G5**
### Student name: Yousef Yassin
### Week: Week 7, Monday February 28th to Sunday March 6th
### *&(Monday February 21th to Sunday February 27th)*
___
1. **How many hours did you spend on the project this week? 25 hours**

2. **Give rough breakdown of hours spent on 1-3 of the following:***
   1. Group Meeting, 1 hours
   2. Research, 2 hours
   3. Software Implementation, 15 hours
   4. Hardware Implementation, 2 hours
   5. Writing/documenting, 5 hours
   
3. ***What did you accomplish this week?***
     - Many, many things. 
     - Most recently, we've been working on the Design Document which has involved several hours of writing and also the creation of new diagrams to convey the new architecture of our system.
     - The project also saw the addition of quite a few software features over reading week. To name a few:
       - I created a Websocket server that is supports client subscriptions such that messages can be multiplexed and demultiplexed between several connection.
       - I created a hook on the frontend client, in addition to a (very rough) interface to test the socket and everything seems to work as needed.
       - I also added a Firestore connection on the backend along with an emulator which has been integrated into our testing workflow.
       - I added a GraphQL server to wrap the Firestore database which currently only has a plant "Vital"(s) schema with queries, mutations and subscriptions(!). I aim to complete the GraphQL API this coming week.
       - A few things happened on the Python end too...
       - Setup the core architecture of the system to consist of a WebSocket Receiver that routes messages to various nodes in our system. Configured each node to consists of a 2 threads: a main one and a listener. This has been tested and seems to work as intended. In fact, end-to-end communication was established at this point with general JSON (so any message really).
       - Added OpenCV support in the Raspberry Pi along with the PiCamera and image transmission over websockets.
       - Added OpenCV filters to estimate the growth of a plant through the application of a green mask and one that estimates the light in a frame through the CIELAB colour scheme.
         - These have also been tested: I don't have ideal results to compare them to but the use of different images (and using testing threshold produced by solid colours) produce results that are consistent relative to eachother which is good enough.
       - Quite a few more small maintenance tasks were also performed: updating the README, helping my teammates setup their environments, upgrading the continuous integration workflow, adding a gpio mocking library and example, etc. 

4. ***How do you feel about your progress?*** 
     - Very good. I think the time in the reading week was spent very well in planning and implementing a skeleton design for our project to serve as a backbone for the rest of the term. Getting end-to-end communication is a crucial milestone and I think the architecture of our system is very modular and scalable to what we'd like to achieve.\\

     - At this point, I have a decent vision of how to build our system (much better than before reading week) in terms of the structure. The few remaining "grey" areas are UI implementation (always tricky), UI unit tests (new to me) and acquiring optimal plant information - the API we wanted to use is no longer maintained :( and plant living conditions seem to be poorly documented outside of books. More on this below.
  
5. ***What are you planning to do next week***? 
     - The majority of the Design Document should be completed by end of day Sunday but part of this week will be spent editting the document and responding to the feedback we receive.


     - In terms of development, the major goal is to complete the GraphQL API and database schema implementation. I've already got a single schema completed so it's effectively copy and paste at this point.
     - Once the API is complete, two integration test scripts need to be written. One for checking messages received by the RPi system and the other for the client. We need the GraphQL API to be done for this since it sends subscription messages.


     ##### Plant Recognition Prototype
     - This was a goal for reading week and was actually partially accomplished. I was able to implement plant recognition with a third party API called PlantNet though it wasn't extensively tested for accuracy.
       - PlantNet does not accept base64 images, they want a read stream to the images. This isn't ideal since all of our frames are base64 encoded. I've found another API called Plant Id which supports this and have acquired an API Key. I'd like to implement this on the express server under a route that accepts the base64 string.
     - The other issue with plants is that the API we were planning to use to acquire optimal plant living conditions, Trefle.io, is no longer maintained.
       - A fork, Flora codex, seems to be an alternative but it's very new, has poor (basically non-existent) documentation and doesn't guarantee all the features we need.

     - The alternative I'm planning to apply is the following:
       - I've acquired a database of plant living conditions in California (~4K species) called WUCOLS IV. There's also another database of ~40 common plants and their basic living requirements.
       - I plant to consolidate this information into our own Firestore database through a script (while also cleaning it up to suit our needs).
       - In terms of the application feature: if we're able to find a user's plant in our database then we'll use that information. If not, we can still provide the user with the species and they can then find the water requirements if they don't know them already. When they enter this information, our dataset will grow and, in a real-world, the dataset would eventually satisfy our needs. 
         - Plant id's API also has the ability to detect plant disease (including some from over-watering). If we have time, we could try adding the ability to modify plant optima based on this feedback.

     - The second goal for next week is partially integrating the system explained above. Mainly the script for integrating the databases into our own.
     - I also hope to begin implementing the interface of our system along with doing more research and begin implementing unit tests for the UI (looking at react-testing-library and jest). 
  
6. ***Is anything blocking you that you need from others?*** _(What do you need from whom)_
     - We've now basically got all our material so everything is good from a resource standpoint!
     - Nothing is technically blocking me but I hope my teammates can make progress in terms of expanding the RPi system we currently have to interface the GraphQL database and also begin with implementation of some hardware systems - at least at the mocking level.