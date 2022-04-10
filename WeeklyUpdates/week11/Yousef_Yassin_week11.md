## Weekly Individual Project Update Report
### Group number: L3 **G5**
### Student name: Yousef Yassin
### Week: Week 11, Monday March 28th to Sunday April 3rd
___
1. **How many hours did you spend on the project this week? 15 hours**

2. **Give rough breakdown of hours spent on 1-3 of the following:***
   1. Software Implementation, 13 hours
   2. Integration Brainstorming, 1 hour
   3. Team meeting, 1 hour
   
3. ***What did you accomplish this week?***
     - This week I worked on integrating all the major nodes in our subsystems: the frontend, the server/database and the raspberry pis.
     - I met with Abdalla and we integrated all of our sensors on one bread board and connected them to the Pi. We tested the configuration and mostly
     everything seemed to work. There is an issue with the servo turning on unexpectedly which we are in the middle of fixing - all other sensors/actuators work normally.
     - I finalized the Vital System to periodically measure and publish plant vitals, along with streaming live vitals. Optima are also checked and according notifications
     are sent through email to the user. The sense hat icon is changed correctly and can be changed from the gui.
     - Plant green growth and luminescence have also been integrated with live images and seem to work.
     - I met with Zak and we integrated his camera system into the main system such that camera streaming is functional. We also integrated his Peewee database
     into the system to register users and their plants.
     - I created a login mechanism on the raspberry pi to register a user's device along with the according prompt on the gui.
     - I integrated graphql and websocket communication in the according locations/nodes on the raspberry pi and the interface.
     - Notification and vital subscriptions were also added to the interface.

4. ***How do you feel about your progress?*** 
     - Good - there is still some touch ups left to do but the major components of the system are in place, all that remains are a few tweaks and changes
     to make everything run smooth and we should be ready for our demo.
  
5. ***What are you planning to do next week***? 
     - In terms of functionality, not too much remains.
     - I need to add the CRUD server-communication to manage plant notes.
     - I need to integrate abdalla's irrigation system into the raspberry pi, this should be a pull-request and a few changes - we've tested a simulation
     and it mostly works on his end.
     - I need to add and test the functionality of activating the water pump(s) from the gui as well.
     - We've already integrated all the hardware in a single circuit but there was issues with initialization sometimes and the servo would be turned on when a 
     pump was turned on - I have a plan to meet with Abdalla tomorrow (Monday) to rebuild the circuit, component by component, along with a new improved 
     Sensors interface class on the Pi to get it working properly.
     - Then there's a few touch-ups: I need to get percentages from all hardware sensors (analog is giving voltages at the moment), I need to add functionality
     to turn to a plant given the id (from the client, this is added on the Pi), and I need to update the vital notifications to include the current vital measurement
     and associated optima (right now we simply state what is below optimal).
     - After that, we should be ready to finalize the final demo plan, practice for the video and final demo and film our video.
     
6. ***Is anything blocking you that you need from others?*** _(What do you need from whom)_
     - Yes. The hardware is almost working but not quite so I need to meet with Abdalla to rebuild our circuit component by component, with testing along with way,
     to ensure everything it working properly. Once that's done, there should be no more blocking tasks and we should be good to wrap up the project.
