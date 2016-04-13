 #	PIN	|	GPIO	|	COLOR	|	COMPONENT
 # =========================================================
 #	1	|			|	grn		|	alarm button in (3.3V)
 #		|	2		|	yel		|	alarm button out
 #		|	4		|	orn		|	LED green
 #	9	|			|	red		|	LED GND
 #		|	x		|	brn		|	LED blue (unused)
 #		|	17		|	blk		|	LED red
 #		|	x		|	pur		|	DHT Vcc (3.3V - needs 4.7K Ohm resistor)
 #		|	x		|	gry		|	DHT data
 #		|	x		|	---		|	-unused-
 #		|	x		|	wht		|	GND
 
 #	   RGB LED					|	 DHT-22
 #		____					|	  ____
 #		 /\						|	 /    \
 #		/##\					|	/ (  ) \
 #	 ----------					|	--------
 #		||||	1: Green 	(+)	|	|######|	1: 3.3V Vcc
 #		||||	2: Ground 	(-)	|	|######|	2: Data
 #		1|||	3: Blue		(+)	|	--------	3: No Contact
 #		 ||4	4: Red		(+)	|	| |  | |	4: GND
 #		 |3						|	| |  | |
 #		 2						|	1 2  3 4

'''
https://learn.adafruit.com/dht-humidity-sensing-on-raspberry-pi-with-gdocs-logging/software-install-updated
https://github.com/adafruit/Adafruit_Python_DHT

Use cases:
	Alarm:
		user toggles 'status' on site
			add event detection to input pin
		user presses button on display
			add event detection to input pin
			put changes to api
		event detected
			wait x seconds; if alarm status is still 'true', send email
	Weather:
		duration has passed
			fetch weather information
			post to weatherlog
		user toggles 'fetch' to true
			toggle 'fetch' to false (put)
			fetch weather information
			post to weatherlog

ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

'''

import requests as req
import json
import smtplib as smtp
import RPi.GPIO as GPIO
import time
import datetime

baseUrl = 'http://broskj.me/api'
loginUrl = 'http://broskj.me/auth/local'
baseAlarmUrl = baseUrl + '/Alarms'
baseAlarmLogUrl = baseUrl + '/AlarmLogs'
baseWeatherUrl = baseUrl + '/Weather'
baseWeatherLogUrl = baseUrl + '/WeatherLogs'
weatherApiUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=32607,us&appid=myappid&units=imperial'

# get authorization token to assign to headers
token = json.loads(req.post(loginUrl, data={'email':'email@address.com','password':'mypassword'}).text)['token']
header = {'Authorization':'Bearer ' + str(token)}

# email stuff
sender = 'myemail@gmail.com'
receiver = 'myphonenumber@mms.att.net'
username = 'mygmail@gmail.com'
password = 'myapppassword'
server = smtp.SMTP('smtp.gmail.com:587')
# server.starttls()
# server.login(username, password)
# server.sendmail(sender, receiver, message)
# server.quit()		# close connection

# gpio pins
alarm_gpio_in = 20	# input from alarm - will return 3.3v Vcc
# weather_gpio_in = 2	# input from weather - need to parse from library
led_gpio_red = 17	# output to red line
led_gpio_grn = 4	# output to green line
alarm_trigger=21	# line to monitor

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(alarm_gpio_in, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
#GPIO.setup(weather_gpio_in, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(led_gpio_red, GPIO.OUT, initial=GPIO.HIGH)
GPIO.setup(led_gpio_grn, GPIO.OUT, initial=GPIO.LOW)
GPIO.setup(alarm_trigger, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

# get initial api data
alarm = json.loads(req.get(baseAlarmUrl, headers=header).text)[0]
weather = json.loads(req.get(baseWeatherUrl, headers=header).text)[0]

# define toggling LED to reflect alarm status
def toggleLED(newStatus):
	if newStatus:
		GPIO.output(led_gpio_grn, False)
		GPIO.output(led_gpio_red, True)
		print 'LED is RED'
	else:
		GPIO.output(led_gpio_red, False)
		GPIO.output(led_gpio_grn, True)
		print 'LED is GREEN'

# class defining Alarm properties and functions
class Alarm(object):
	def __init__(self, this_id, gpio_in, status):
		self.id = this_id
		self.gpio_in = gpio_in
		self.status = status
	
	''' 
		define events triggered on reading new data from api 
	'''
	def toggle_from_api(self, newStatus=None):
		if newStatus is not None:
			self.status = newStatus
			# add/remove event detection
			if newStatus:
				GPIO.remove_event_detect(alarm_trigger)
				GPIO.add_event_detect(alarm_trigger, GPIO.FALLING, callback=self.on_alarm_triggered, bouncetime=500)
				print 'Event detection on'
			else:
				GPIO.remove_event_detect(alarm_trigger)
				print 'Event detection off'
			# make led reflect state
			toggleLED(newStatus)
	
	''' 
		define events triggered on physical button press 
	'''
	def toggle_from_button(self):
		now = str(datetime.datetime.now())
		# set new status, add/remove event detection
		if not self.status:
			newStatus = 'true'
			GPIO.remove_event_detect(alarm_trigger)
			GPIO.add_event_detect(alarm_trigger, GPIO.FALLING, callback=self.on_alarm_triggered, bouncetime=500)
			message = 'System armed.'
			print 'Event detection on'
		else:
			newStatus = 'false'
			GPIO.remove_event_detect(alarm_trigger)
			message = 'System disarmed.'
			print 'Event detection off'
		# update api
		self.status = newStatus
		req.put(baseAlarmUrl + '/' + self.id, data={'status':newStatus, 'updatedAt':now}, headers=header)
		req.post(baseAlarmLogUrl, data={'description':message}, headers=header)
		# make LED reflect state
		toggleLED(newStatus)
	
	'''
		define events to occur on alarm being triggered
		threaded callback function from gpio event_detection
	'''
	def on_alarm_triggered(self, channel):
		print 'Alarm triggered'
		message = "\r\n".join(["From: " + sender, "To: " + receiver, "Subject: Alarm triggered", "", "Alarm has been triggered " + str(datetime.datetime.now())])
		try:
			server.starttls()
			server.login(username, password)
			server.sendmail(sender, receiver, message)
			server.quit()		# close connection
		except:
			print 'Error: unable to send email'
		message = 'Alarm has been triggered.'
		req.post(baseAlarmLogUrl, data={'description':message}, headers=header)
				
# class defining Weather properties and functions
class Weather(object):
	def __init__(self, this_id, duration, fetch):
		self.id = this_id
		self.duration = duration
		self.fetch = fetch
		self.last_updated = datetime.datetime.now()
	
	def reset_fetch(self):
		now = str(datetime.datetime.now())
		print 'Resetting fetch'
		# set fetch boolean to false - only called if first set to true
		req.put(baseWeatherUrl + '/' + self.id, data={'fetch':'false', 'updatedAt':now}, headers=header)
		self.get_weather()
	
	def get_weather(self):
		print 'Grabbing weather data'
		now = str(datetime.datetime.now())
		# get current weather data
		# hum, temp = Adafruit_DHT.read_retry(Adafruit_DHT.DHT22, self.gpio_in)
		# create description
		w = json.loads(req.get(weatherApiUrl).text)
		temp = w['main']['temp']
		hum = w['main']['humidity']
		des = w['weather'][0]['description']
		description = str('Currently experiencing ' + des + '.  Temperature: ' + str(temp) + ' F - Humidity: ' + str(hum) + '%.')
		# post new log
		req.post(baseWeatherLogUrl, data={'description':description, 'createdAt':now, 'updatedAt':now}, headers=header)
		self.last_updated = datetime.datetime.now()
	
	def check_time(self):
		if datetime.datetime.now() >= self.last_updated + datetime.timedelta(minutes=self.duration):
			self.get_weather()

try:
	# create initial objects
	alarm_obj = Alarm(alarm['_id'], alarm_trigger, alarm['status'])
	weather_obj = Weather(weather['_id'], weather['duration'], weather['fetch'])

	# set fetch variable and get weather on startup
	#weather_obj.reset_fetch()
	
	GPIO.add_event_detect(alarm_gpio_in, GPIO.FALLING, bouncetime=250)
	
	if alarm_obj.status:
		GPIO.add_event_detect(alarm_trigger, GPIO.FALLING, callback=alarm_obj.on_alarm_triggered, bouncetime=250)
	
	print 'running'
	toggleLED(alarm_obj.status)
	
	while(True):
		# fetch current api data
		new_alarm = json.loads(req.get(baseAlarmUrl, headers=header).text)[0]
		new_weather = json.loads(req.get(baseWeatherUrl, headers=header).text)[0]
		
		# create updated objects
		new_alarm_obj = Alarm(new_alarm['_id'], alarm_trigger, new_alarm['status'])
		new_weather_obj = Weather(new_weather['_id'], new_weather['duration'], new_weather['fetch'])
		
		# check for event on alarm button
		if GPIO.event_detected(alarm_gpio_in):
			print 'event detected on alarm'
			new_alarm_obj.toggle_from_button()
		else:
			# check that alarm status has changed on api
			#	if true, call toggle_from_api
			if alarm_obj.status is not new_alarm_obj.status:
				new_alarm_obj.toggle_from_api(newStatus = new_alarm_obj.status)
		
		# check that weather fetch is true
		# 	if true, call reset_fetch (which also calls get_weather)
		if new_weather_obj.fetch and weather_obj.fetch is not new_weather_obj.fetch:
			new_weather_obj.reset_fetch()
		# to avoid too many weather fetches, don't check time on same loop if fetch was called
		# call check_time (which will fetch weather data if timedelta has passed)
		else:
			new_weather_obj.check_time()
			
		# redefine objects to their most recent versions
		alarm_obj = new_alarm_obj
		weather_obj = new_weather_obj
		
except KeyboardInterrupt:
	print '\nKeyboardInterruptException'

finally:
	GPIO.cleanup()

