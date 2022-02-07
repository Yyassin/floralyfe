## Weekly Individual Project Update Report
### Group number: L3 **G5**
### Student name: Yousef Yassin
### Week: Week 4, Monday January 31st to Sunday February 6th
___
1. **How many hours did you spend on the project this week? 10**

2. **Give rough breakdown of hours spent on 1-3 of the following:***
   1. Brainstorming / Group Meeting, 1 hours
   2. Information Gathering, 2 hours
   3. Writing/Documenting, 7 hours
   
3. ***What did you accomplish this week?***
     - I resolved the React client -> Node websocket connection issue that I was recieving last week. We're now able to send picture frames from one machine to another though I've yet to do any stress testing, nor checks on how we can multiplex with multiple clients.
     - Held a team meeting to completely finalize our project and ensure it satisfies the imposed requirements. We also drew out the system to get a better idea of how everything would eventually come together.
     - I started researching a few technologies regarding the cloud-based architecture that would form our backend. Notably, I've looked into graphql for setting up a convenient API to query relational data. I've also learned more about Firebase's realtime database and model streaming.
       - The current plan is to use a Firebase Realtime database to store our data. Another API server (Node, the same one hosting the websocket) will host a GraphQL client that queries this data so that we can perform nested queries (i.e get all the posts under x user - where posts are associated to plants which are in turn associated with user owners). GraphQL also allows subscriptions through a publisher-subscriber pattern.
       - Once I have free time, I'd like to prototype this.
     - In addition to the backend, I've learned more about setting up continuous integration pipelines on github to ease remote development. Along with the above, I'm planning to setup a pipeline to statically type all python commits to ensure type safety with mypy and perhaps styling with flake8. The pipeline will also run all unit tests to make sure no new commits break anything major (that has a defined unit test).
     - The majority of this week has been spent on writing our project proposal which is coming along nicely. I've also created a variety of diagrams for the proposal with more on the way.
  
4. ***How do you feel about your progress?*** 
     - I feel very good regarding the progress. In my eyes, the live camera feed is an important addition to the project which seemed like it would be difficult to integrate. Having a mostly "working" prototype is relieving to have a model to build off of once development is truly under way.
     - The feed also provided an interesting idea about how we can store image data in databases through base64 encoding such that we'd only need to store serialized strings. This has introduced a new plan to store one picture a day for each system locally to create a plant "growth" slideshow.
     - The proposal is coming along nicely and our project is finally taking some shape. It's nice to begin to understand what we'll be developing since we can start to further plan ahead (and sometimes change current plans with better ideas).
  
5. ***What are you planning to do next week***? 
     - The project proposal is due this coming week so the majority of the work will be focused on that. Primarily, I'm looking to:
       - Create a simple logo for our project (a minimalistic plant)
       - Create a brief figma wireframe of a one or two pages for the website (mainly the home dashboard and perhaps the login screen).
       - Create a gantt chart, system structure diagram and various other UML diagrams.
       - Continue writing and editing.
     - The below aren't likely to be this week, but in the near future...
     - I found a couple plant recognition APIs. I'd like to set up a small prototype where an image is sent and plant data is received.
     - I'd also like to setup continuous integration for Python and reasearch how it can be done for a Node server - I'm leaning towards mocha/jest/chai for Node/React although I'm not yet sure how to test a "server".
     - I'd like to prototype a small backend with a firebase database and GraphQl subscriptions that support realtime data updates.
     - With these done, we should be in a very good place to develop. Hopefully they'll be done before end of reading week.
  
6. ***Is anything blocking you that you need from others?*** _(What do you need from whom)_
     - Nothing is really blocking me so far, there's a lot to still prototype and so I'm not yet at the point where I need something done to continue any work.