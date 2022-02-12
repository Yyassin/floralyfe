# SYSC3010 Project

### Garden Care

### Major Features

- **Make system work for muiltiple plants - circle of plants with camera servo that rotates between. Data collected and info for all plants.**

- Monitoring system that delivers a live feed from each plant (video/frames).
  
  - Camera on controllable servo: monitor plant environment 360.

- Monitoring plant vitals: temperature, soil moisture, humidity and light received.
  
  - Store vital history in database.
  
  - Displayed as graphs in a analysis tab on user interface.
  
  - Send notifications when critical levels are reached.
    
    - Determined through plant api: 
  
  - **Display visual icons on sensehat** to communicate info as well (GUI not as necessary if at home).
    
    - Allow visual override from GUI

- Plant recognition with confidence. Based on camera feed frames, display the most likely 3 plants that the current one would be.
  
  - Also allow user to override with their own specification.
  
  - Used for vital optimization.

- Watering system when soil moisture is low (based on api) [Water tank and valve]
  
  - When moisture is too low, actuator activated to water plant (closed-loop: water -> check moisture, repeat). 
  
  - Sends notification to user when done.
  
  - Sends notification if water tank needs to be refilled (and display tank info)

- *Display artificial light if light is low*

- Object Detection: Detect human and animals (pets): dogs and cats. 
  
  - Send notification (possibly with picture) when detected.
  
  - Activate speaker to alert or diter animal.

- *Distance based recognition (Ultrasonic Sensor)*

- *Monitor growth via how much green or plant length - this one is iffy*

### Components

- React User Interface

- Firebase Realtime DB

- Websocket, Node Server (Express)

- 3 Raspberry Pis, each hosting a system

### Structure

- Users -> Plants -> Vitals

### Requirements

#### Computer Components

- **Is there a computer (RPi, Arduino, Launchpad, etc.) per student in the  
  group?**
  
  - Yes, 3 Raspberry Pis, each hosting a system.
  
  - Also, several cloud systems.

- !!!**Is at least one RPi in headless mode?**
  
  - All raspberry pis are headless [could optionally run website on it too].
    
    - !!!**Check if ok.**

#### Hardware Components

- **Is there at least one hardware device per student in the group?**
  
  - Camera, water system actuator

- **Is there an actuator? (i.e., not every hardware device is a sensor)**
  
  - Yes, water system actuator.

- **Is there a feedback loop? Interaction between input/output devices**
  
  - Yes, water system for maintaining optimal moisture level is a closed-loop system.

#### Software Components

- **Is there a database?**
  
  - Firebase Realtime DB to store user authentication information and plant related metadata and vital history.

- **Does the computer hosting the database have other responsibilities?**
  
  - Primarily using FirebaseDB for realtime
  
  - All pis have a local database, so yes.
  
  - Local database -> save plant picture every day
    
    - [For Roger] Can be analyzed later for timelapse, plant growth and used as training data for plant recognition.
    
    - Queried by user [via middleman server], paginated api.
    
    - *Log of all notifications sent (transaction history)*
  
  - *All data is held locally if no internet connection, then commited when back on network*
  
  - Could do 2 pi systems then ... revisit.

- **Does the database contain at least two tables (or types of information)?**
  
  - Temperature, humidity, moisture, light.

- **Is there a periodic timing loop?**
  
  - Check vitals every X(~2) hours.

- **Is there some processing or analysis of the IoT data read?**
  
  - Graphed as chart.
  
  - Compared against optimal values, send notification if critical.
  
  - Camera feeds are processed for plant recognition (API).

- **Are notifications sent (SMS, email, push notifications)?**
  
  - Yes, email (maybe SMS, twitter) - plant vital info.
  
  - *Object recognition.*

- **Is there at least one bidirectional GUI running on a computer?**
  
  - Yes, React GUI
    
    - Authentication
    
    - Add notes to plants (keep track of info, diseases, ...)
    
    - Transaction Log (all notifications - vitals and detections)
    
    - Display charts
    
    - Display Plant feeds
    
    - Display Plant Recog and optimal info
    
    - **Manually activate watering from GUI**
    
    - **Move servo camera 360**
    
    - Allow visual override from GUI to display select icons on plant system (allows owner to communicate with individuals at home near plant)
    
    - Manually activate speaker (scare pets)