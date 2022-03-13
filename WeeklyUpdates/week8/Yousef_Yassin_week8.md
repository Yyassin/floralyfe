## Weekly Individual Project Update Report
### Group number: L3 **G5**
### Student name: Yousef Yassin
### Week: Week 7, Monday March 7th to Sunday March 13th
___
1. **How many hours did you spend on the project this week? 15.5 hours**

2. **Give rough breakdown of hours spent on 1-3 of the following:***
   1. Research, 0.5 hours
   2. Software Implementation, 8 hours
   3. Writing/documenting, 7 hours
   
3. ***What did you accomplish this week?***
     - This week was focused on meeting deliverables.
     - A large portion of time went into writing and refining our Detailed Design Document which included the creation of numerous diagrams to detail the architecture and functionality of our system; sequence, deployment, class diagrams along with flow charts.
     - In addition to the document, the team finalized our communication architecture and integration test implementation, culminating with an end-to-end communication demo.
     - From my end, the end-to-end demo involved finalizing the Firestore database schema to include all our entity models and their respective GraphQL queries, mutations and subscriptions.
     - I also created a small web interface and tests to interact with the GraphQL server to demonstrate the communication functionality across all our system nodes (namely the RPi and client).
     - I also modified and created various scripts in our RPi nodes to test communication directed from the frontend client to the Pis. Sending GraphQL requests from the RPi using Python required some research but worked great in the end.
     - Finally, I transitioned our server away from being tunneled using ngrok to using localtunnel. This allows us to specify multiple tunnels with specific domains that remain relatively consistent among deployments - simplifying development.

4. ***How do you feel about your progress?*** 
     - I'm very happy with our progress. End-to-end communication is a large milestone to cross and I'm incredibly satisfied with the way we've constructed our system nodes to communicate with each other in an efficient yet modular manner. 
     - Unit testing frameworks are already set in place so the next large deliverable is only a matter of constructing units and coding the tests - If we get the hardware working well, I'm confident in constructing our system (always weary about hardware though).
  
5. ***What are you planning to do next week***? 
     - This week I'm hoping to develop the majority of our frontend dashboard along with a login screen and authentication system. This dashboard will involve the creation of various modular React components and their respective styling. I also hope to setup the appropriate communication logic such that the client's components can communicate with the GraphQL and WebSocket servers in an organized manner - this has already been done with the end-to-end demo, it's just a matter of moving things around.
     - Instead of placing fake data on the GUI, my plan is to write a "test" script on the Pi that simply sends periodically generated random data but in the expected format. This can later be used as a true "unit" test (not really automatically validated though).
     - Completing the majority of the UI will allow me to begin writing unit tests to verify its functionality - leaning towards React Testing Library.
     - Another hope is to add functionality for plant recognition API calls with base64 images from the frontend, this is long overdue.
     - I'm going to push optima acquisition to the end of the project as I think it's lowest priority but I may integrate a database of 40 common plants and their watering needs. Light and temperature will be fairly consistent among houseplants so I don't think that's a problem.

  
6. ***Is anything blocking you that you need from others?*** _(What do you need from whom)_
     - The main concentration for me right now is getting a good User Interface in place which isn't blocked by any other activities.
     - That being said, it's really important that my team mates figure out how to interface with their hardware components soon and begin writing their node RPi classes so they can be tested soon so I'm hopeful that gets done this week.
       - Interfacing and commanding the angle of a servo.
       - Consistent readings from moisture and water sensors + activating/deactivating water pumps.
         - Both are under way but have some finicky behaviour which needs to be ironed out.