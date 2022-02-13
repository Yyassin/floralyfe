## Weekly Individual Project Update Report
### Group number: L3 **G5**
### Student name: Yousef Yassin
### Week: Week 5, Monday February 7th to Sunday February 13th
___
1. **How many hours did you spend on the project this week? 7 hours**

2. **Give rough breakdown of hours spent on 1-3 of the following:***
   1. Brainstorming / Group Meeting, 1 hours
   2. Information Gathering, 2 hours
   3. Writing/Documenting, 4 hours
   
3. ***What did you accomplish this week?***
     - We completed our project proposal this week which involved quite a bit of research, meetings, writing and diagram creation. Although it sounds simple, writing the proposal took a significant portion of time.
     - I also created a basic wireframe to act as a guide for our GUI
     - You'll also notice a new logo in our README ;)
     - Apart from proposals, I got to work implementing some things from my CI/CD research last week. Namely, I initialized up two of our three core systems: the pi and node (server) systems, the missing one is the website.
       - I setup a virtual environment for the python pi system to ease dependency management across our group.
       - Both the python pi and ts node systems have been setup with unit testing scripts integrated and these unit tests are run on pushes/pulls to main with coverage reports.
       - Last week I wasn't sure how to test a "server" - I found a package that does just that: supertest and now unit testing with mocha can verify correct server responses.
       - The only thing that remains is for Abdalla to change a setting so pushes/pulls are blocked if tests fail.
  
4. ***How do you feel about your progress?*** 
     - I feel good once again. Our repository is effectively ready for development to start (which we're hoping to begin during reading week) and so everything is going according to plan.
     - Although not much development occured this week, the proposal was completed which is a significant milestone in itself.
  
5. ***What are you planning to do next week***? 
     - This is a busy week in terms of academic responsibilities so it's not likely much will be done, however I do hope to try out the plant recognition API as I've now acquired an API key.
     - The goal is to create a small prototype with typescript where a base64 image is converted to an image and sent with the API request. If that works, then the pi system can respond with an encoded image whenever plant recognition is necessary.
     - After that (around reading week), the final bit of prototyping will involve..
     - Creating a PIL or CV script that can mask green pixels from an image and count them to approximate the size of plant. We could use this to monitor the growth of a plant. 
     - And, from last week, 'd like to prototype a small backend with a firebase database and GraphQl subscriptions that support realtime data updates.
     - With these done, we should be in a very good place to develop.
     - I also need to help my teammates setup the development pipeline on their systems at some point, likely around the start of reading week.
  
6. ***Is anything blocking you that you need from others?*** _(What do you need from whom)_
     - Nothing is really blocking me so far, there's a lot to still prototype and so I'm not yet at the point where I need something done to continue any work.
     - I do hope to meet with the team to finalize our hardware purchase orders this week (still not quite sure about how we're managing analog vs. digital when it comes to the sensors we'll be purchasing).
     - I also need Abdalla (repo owner) to activate the Settings > Branches > "Require status checks to pass before merging" to block merges when tests fail.