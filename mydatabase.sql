/*
 * Kyle Brost
 * Senior Project
 * CIS4914
 * 
 * One table will contain weather data.  This will use fields for id, 
 * 	temperature, humidity, and time.  In the future it may also contain 
 * 	rain should I purchase a rain sensor.
 * 
 * Another table will control the weather pi.  It will contains fields for 
 * 	duration (in seconds) and fetchNow, which the python code will read to 
 * 	determine when to grab weather data.
 * 
 * The third and fourth tables control the alarm; one keeps track of whether or 
 * 	not it is armed, and the other logs entries as the alarm is toggled/when the
 * 	door opens.
 * 
 * The final table will control individual relays based on the python code.
 * 	Each relay has its own id in the table and will be controlled by checking
 * 	the id in the table.  Each relay has a status bit and a timed bit, the
 * 	latter of which enables turning the respective relay on and off at a
 * 	specific time.  Each also contains a description.
 */

-- create tables --

# weather log 
CREATE TABLE WeatherLog (
	id INT NOT NULL AUTO_INCREMENT,			# tracks entries
	temp REAL(4,1),							# stores temperature as ###.#
	hum REAL(4,1),							# stores humidity as ###.# (treated as %)
	time DATETIME NOT NULL DEFAULT NOW(),	# populates with current datetime with each new entry
	PRIMARY KEY(id)							# probably not necessary; not using relations
);

# weather controller 
CREATE TABLE WeatherCtrl (
	duration INT DEFAULT 1800,				# tracks time between fetching; 30 minutes
	fetchNow BIT DEFAULT 0					# initiates fetch function; 0 - false, 1 - true
);


# relay bus controller
CREATE TABLE RelayBus (
	id INT NOT NULL AUTO_INCREMENT,
	status BIT NOT NULL DEFAULT 0,
	timed BIT NOT NULL DEFAULT 0,
	onTime TIME NOT NULL DEFAULT '20:00:00',
	offTime TIME NOT NULL DEFAULT '06:00:00',
	description VARCHAR(255) NOT NULL DEFAULT 'no description',
	PRIMARY KEY(id)
);

# alarm log
CREATE TABLE AlarmLog (
	id INT NOT NULL AUTO_INCREMENT,
	time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	description VARCHAR(255) NOT NULL DEFAULT 'no description',
	PRIMARY KEY(id)
);

# alarm controller
CREATE TABLE AlarmCtrl (
	status BIT NOT NULL DEFAULT 0
);

/*
# relay 0 table
CREATE TABLE Relay0 (
	status BIT NOT NULL DEFAULT 0,			# toggles device on/off; default off
	timed BIT NOT NULL DEFAULT 0,			# controls relays based on onTime and offTime
	onTime TIME NOT NULL DEFAULT '20:00:00',	# collaborates with 'timed' - when to turn on
	offTime TIME NOT NULL DEFAULT '06:00:00'	# collaborates with 'timed' - when to turn off
);

# relay 1 table
CREATE TABLE Relay1 (
	status BIT NOT NULL DEFAULT 0,			# toggles device on/off; default off
	timed BIT NOT NULL DEFAULT 0,			# controls relays based on onTime and offTime
	onTime TIME NOT NULL DEFAULT '20:00:00',	# collaborates with 'timed' - when to turn on
	offTime TIME NOT NULL DEFAULT '06:00:00'	# collaborates with 'timed' - when to turn off
);

# relay 2 table
CREATE TABLE Relay2 (
	status BIT NOT NULL DEFAULT 0,			# toggles device on/off; default off
	timed BIT NOT NULL DEFAULT 0,			# controls relays based on onTime and offTime
	onTime TIME NOT NULL DEFAULT '20:00:00',	# collaborates with 'timed' - when to turn on
	offTime TIME NOT NULL DEFAULT '06:00:00'	# collaborates with 'timed' - when to turn off
);

# relay 3 table
CREATE TABLE Relay3 (
	status BIT NOT NULL DEFAULT 0,			# toggles device on/off; default off
	timed BIT NOT NULL DEFAULT 0,			# controls relays based on onTime and offTime
	onTime TIME NOT NULL DEFAULT '20:00:00',	# collaborates with 'timed' - when to turn on
	offTime TIME NOT NULL DEFAULT '06:00:00'	# collaborates with 'timed' - when to turn off
);
*/

-- add initial data --

# weather controller
INSERT INTO WeatherCtrl (duration, fetchNow) VALUES (1800, 0);

/*
# relays
INSERT INTO Relay0 (status, timed, onTime, offTime) VALUES (0, 0, '20:00:00', '06:00:00');
INSERT INTO Relay1 (status, timed, onTime, offTime) VALUES (0, 0, '20:00:00', '06:00:00');
INSERT INTO Relay2 (status, timed, onTime, offTime) VALUES (0, 0, '20:00:00', '06:00:00');
INSERT INTO Relay3 (status, timed, onTime, offTime) VALUES (0, 0, '20:00:00', '06:00:00');
*/

# relay bus
INSERT INTO RelayBus (description) VALUES ('Relay 0');
INSERT INTO RelayBus (description) VALUES ('Relay 1');
INSERT INTO RelayBus (description) VALUES ('Relay 2');
INSERT INTO RelayBus (description) VALUES ('Relay 3');

# alarm controller
INSERT INTO AlarmCtrl (status) VALUES (0);
