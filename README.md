# CIS4914 - Senior Project
Home automation with Raspberry Pi

## Project Description:
### Overview
- Website built using Sails to provide API.
- Raspberry Pi 2 Model B which hosts the website (at broskj.me once I build a decent website and configure DNS).
- Two Raspberry Pi Zeros:
    1. Affixed to the back of a 4-gang faceplate.  Runs python code to monitor web API and handle GPIO, and monitor button presses and motion and update web API accordingly.
    2. Inside an ideally weather-proof box.  Runs python code to fetch weather data (using DHT-22 sensor) and update web API with results.  Also manages the alarm which also updates web API.

### Raspberry Pi 2:
#### Website
##### Overview
- Built using Sails; uses the Model-View-Controller architecture.  Provides an interface to interact with/modify back-end API, which is read continuously by other components of the project.
- Will be mobile-friendly, so that a user may truly experience home automation by mimicking a remote control.

##### Components:
- One interface controls lighting; it contains buttons (colored based on the current state of its corresponding relay) to control lights.  Additionally, a button may be checked to allow timing of specific lights.  If checked, 'start' and 'end' times may be configured.  Also, a light may be set to activate on detected motion.
- A second interface allows the duration between weather pings to be set, and also contains a button to immediately fetch current weather information.  A table of weather readings is also shown with fields including time and temperature/humidity.
- A third smaller interface shows the current state of the alarm and allows for its toggling.  A table is also shown containing times that the alarm is activated/deactivated, and possibly when the magnetic switch is triggered.

##### Web API:
- Relay 'objects' containing current state, auto on/off times, and whether they're controlled via motion:
    - The state variables correspond with python code running on a Raspberry Pi Zero and determine GPIO output to a corresponding Relay.
    - On/off times are also associated with a boolean, which changes the state of a light at a given time if true.
    - Motion boolean controls state of a light given detected motion
- Alarm controller, which indicates whether the alarm is on or off
    - Based on current state, python code may or may not monitor a magnetic switch.  If alarm is on and switch is triggered, I am notified via email if alarm is not toggled off within x seconds.
- Alarm log, which is a list of times that the alarm is activated/deactivated and when the magnetic switch is triggered.
- Weather controller, which indicates duration between grabbing weather data.  Also contains a variable for grabbing the weather immediately.
- Weather log, which is a list of weather entries.  Contains fields such as id, time, temperature, and humidity.

### Raspberry Pi Zero #1:
- Affixed to the back of a 4-gang faceplate.  It is a component of an entire system containing the pi, a relay bus, momentary switches, a motion sensor, and a power supply, among other wiring.
    - The power supply converts AC to 5v DC to power the pi.
    - The relay bus is daisy-chained with the input AC power to each of the relays and the lights.
    - The pi hosts the python code controlling the relay logic.  This is based on GPIO readings from momentary switches and a motion detector, as well as the web API:
        - The momentary switches are wired in to the pi's GPIO and are in a 'normally-open' state.  One pin of each switch is powered, and the other pin is being checked for an active high signal - once active high, the light is toggled and the web API is updated to reflect the current state.
        - The motion detector is fed power and ground and has a return line for data.  On motion detected, the return line sends a signal which is read by the GPIO.  Based on boolean values from the API, a light will either turn on or remain in its current state (if on - stay on; if off and true, turn on; if off and false, stay off).  If a modification is made, the web API is updated to reflect the current state.
        - With each iteration of the main python loop, an HTTP GET request is sent to the web API to retrieve current state of each light.  Based on the current values, the light will either remain in the current state or toggle.

### Raspberry Pi Zero #2:
- Within a container of some sort, weather-proof or not, lies the second pi.  This is wired to a temperature/humidity sensor via the GPIO for grabbing weather data, and is wired to a momentary button and RBG LED for the alarm system.
    - The weather system is controlled via the web API; a field exists to modify the duration between grabbing weather data from the sensor, as well as a button for grabbing current weather data immediately.  The results from the sensor are sent using an HTTP PUT request to add a new entry to a weather log.  Alternatively, a user may press a button to grab weather data immediately, also logging the data.
        - The weather data will be formatted on the website in a readable table format.
    - The alarm system is very simple; if the state of the alarm is active, turn the LED to red and monitor a magnetic switch; on trigger, wait 15 seconds and check alarm state again - if still on, send me an email; otherwise, do nothing.  If the alarm is inactive, turn the LED to green and do not monitor the switch.
