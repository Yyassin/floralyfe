## Weekly Individual Project Update Report
### Group number: L3 **G5**
### Student name: Yousef Yassin
### Week: Week 9, Monday March 14th to Sunday March 20th
___
1. **How many hours did you spend on the project this week? 10 hours**

2. **Give rough breakdown of hours spent on 1-3 of the following:***
   1. Software Implementation, 8 hours
   2. Writing/documenting, 2 hours
   
3. ***What did you accomplish this week?***
     - This week I started finalizing a few components in our system.
     - I integrated the PlantId API into the Next Client with Base64 images and tested the implementation. I was successfully able to encode an image of a pepper plant and have the API provide the correct plant info, recognizing that it was a pepper plant with 98% accuracy.
     - I added the nodemailer API to our backend server and created routes to send emails. I was successfully able to send emails by remotely sending a POST request to the server route.
     - I added a "Sensors" class in the RPi system to interface with the sensors in our system conveniently, along with abstracting mock pins for testing.
     - I added a "VitalSystem" class for implementing the Vital Monitoring Subsystem state machine and io functionality.
     - For everything except the emails, I've added unit tests (there isn't really a way to verify the email was sent other than checking your email inbox!).
     - I've started implementing the UI, it's partway finished - I hope to finish the majority along with unit tests tomorrow.

4. ***How do you feel about your progress?*** 
     - I'm very happy with the progress, most of the units of the system that I'm responsible for are almost complete. Once the UI is complete, then all that really remains on my end is connecting the nodes together using the strategies we've already demonstrated in the end-to-end test.
     - This week is an *extremely* busy week but it looks like it'll be the last push before the end of the semester which hopefully means I have more time for the project starting next week.
  
5. ***What are you planning to do next week***? 
     - This week I hope to complete the UI of the system, most of the interface is there but the injection and formatting of data and state-management still needs to be added.
     - Once the interface is finished, I intend to integrate the React-testing library to implement unit tests to excercise the functionality of the interface's dom rendering and state-management.
     - Also, the interface likely won't have any complex logic (mostly hard-coded data) due to time so adding dynamic data fetching will be the next step for later in the week.

6. ***Is anything blocking you that you need from others?*** _(What do you need from whom)_
     - All that remains for my individual nodes is getting the UI to work. Once that's done, I can start integrating the client interface with the server but then I'll be blocked until my teammates complete their nodes.
     - Unit testing is due this Thursday so hopefully most of our units will be complete - my teammates are having a little transistor trouble but hopefully it works out.