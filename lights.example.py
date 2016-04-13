 #	PIN	|	GPIO	|	COLOR	|	COMPONENT
 # =========================================================
 #	1	|			|	ylw		|	buttons Vcc (3.3v)
 #	2	|			|	blk		|	Relay Vcc (5v)
 #	4	|			|	gry		|	PIR Vcc (5v)
 #	6	|			|	wht		|	Relay GND
 #	9	|			|	pur		|	PIR GND
 #		|	2		|	gry		|	IN1 (relay 1 toggle)
 #		|	3		|	pur		|	IN2 (relay 2 toggle)
 #		|	4		|	blu		|	IN3 (relay 3 toggle)
 #		|	17		|	grn		|	IN4 (relay 4 toggle)
 #		|	18		|	blu		|	PIR out
 #		|	22		|	wht		|	A out (button return)
 #		|	23		|	blk		|	B out (button return)
 #		|	24		|	brn		|	C out (button return)
 #		|	27		|	orng	|	D out (button return)
"""
	a quick note:
		the GPIO is ass-backwards and it thinks False means 'turn on'.  
"""
 
"""
Use cases:
	User toggles status on site
		read in loop
		toggle new_light status to reflect
		
		
		
		
	User hits light switch
		light is currently on:
			turn off
			if light is on timer and within time range
				turn timed off
			if light is on motion and motion has been detected
				turn off motion
			put data to api
		light is currently off:
			turn on
			put data to api
	Motion detected
		light is currently on:
			remain on
			put data to api
		light is currently off:
			turn on
			put data to api
"""

import requests as req
import json
import RPi.GPIO as GPIO
import time
import datetime


baseUrl = 'http://broskj.me/api'
loginUrl = 'http://broskj.me/auth/local'
baseLightsUrl = baseUrl + '/Lights'
baseLogsUrl = baseUrl + '/LightsLog'

try:
	# get authorization token to assign to headers
	token = json.loads(req.post(loginUrl, data={'email':'email@email.com','password':'mypassword'}).text)['token']
	header = {'Authorization':'Bearer ' + str(token)}
except req.exceptions.ConnectionError:
	print "Connection refused"

# gpio pins
count = 4
sleep_time = 0.25
pir_in = 18
init_gpio_in = [25,24,22,23]
init_gpio_out = [17,4,2,3]
cur_motion = False
off_time = datetime.datetime.now()

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(pir_in, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(init_gpio_in, GPIO.IN, pull_up_down = GPIO.PUD_DOWN)
GPIO.setup(init_gpio_out, GPIO.OUT, initial=GPIO.HIGH)

# get initial api data
lights = json.loads(req.get(baseLightsUrl, headers=header).text)

# initialize light arrays
lights_list = [None for x in range(count)]
new_lights_list = [None for x in range(count)]

class Light(object):
	def __init__(self, this_id, description, gpio_in, gpio_out, status, motion, timed, onTime, offTime):
		self.id = this_id				# string
		self.description = description	# string
		self.gpio_in = gpio_in			# int
		self.gpio_out = gpio_out		# int
		self.status = status			# boolean / string of boolean
		self.motion = motion			# boolean / string of boolean
		self.timed = timed				# boolean / string of boolean
		self.onTime = onTime			# string: 'HH:mm'
		self.offTime = offTime			# string: 'HH:mm'
		
	# define behavior for detecting changes in api
	# update local variables and toggle gpio if needed - 
	def api_toggle(self, newStatus=None, newMotion=None, newTimed=None, newOnTime=None, newOffTime=None):
		if newStatus is not None:
			# update status and set GPIO
			#if self.status is not newStatus:
			#print 'toggling status'
			self.status=newStatus
			#if self.timed and not newStatus:
			#	self.timed=False
			#	print 'test'
			#	req.put(baseLightsUrl + '/' + self.id, data={'status':newStatus, 'timed':self.timed, 'updatedAt':str(datetime.datetime.now())}, headers=header)
			GPIO.output(self.gpio_out, not self.status)
		elif newMotion is not None:
			# update motion and set GPIO if there is motion
			self.motion=newMotion
		elif newTimed is not None:
			# update timed and set GPIO if timed and in time range
			self.timed=newTimed
		elif newOnTime is not None:
			# update onTime and set GPIO if timed and in time range
			self.ontime=newOnTime
		elif newOffTime is not None:
			# update offTime and set GPIO if timed and in time range
			self.offTime=newOffTime
		else:
			print 'something happened'
			
	# define behavior for detecting physical actions
	# need to toggle GPIO to reflect status
	def physical_toggle(self, newStatus=None):
		print 'physical toggle'
		self.status=newStatus
		now = str(datetime.datetime.now())
		# only called on button press - only concerned with toggling light status
		if newStatus is not None:
			# disable timed if turned off while in time range
			if self.timed and self.inTimeRange() and newStatus is False:
				print 'attempting to toggle off while on timer'
				self.timed=False
				req.put(baseLightsUrl + '/' + self.id, data={'status':newStatus, 'timed':self.timed, 'updatedAt':now}, headers=header)
				# need to POST to log with description
			else:
				print 'toggling ' + self.description + ' to ' + str(newStatus)
				t = req.put(baseLightsUrl + '/' + self.id, data={'status':self.status,'updatedAt':now}, headers=header)
				print t.text
			# GPIO.output(self.gpio_out, newStatus is False) # newStatus is 'false' returns boolean
			
	def toggle_from_button(self, newStatus=None):
		now = str(datetime.datetime.now())
		print 'toggle from button'
		if newStatus is None:
			if not self.status:
				newStatus = 'true'
			else:
				newStatus='false'
			self.status=newStatus
		if self.status is 'false' or not self.status and self.timed:
			thedata = {'status':newStatus,'timed':'false','updatedAt':now}
		else:
			thedata = {'status':newStatus,'updatedAt':now}
		req.put(baseLightsUrl + '/' + self.id, data=thedata, headers = header)
			
		
	# perform check to determine if current time is within timed range
	def inTimeRange(self):
		cur_hr = datetime.datetime.now().hour
		cur_min = datetime.datetime.now().minute
		on = time.strptime(self.onTime, '%H:%M:%S')
		off = time.strptime(self.offTime, '%H:%M:%S')
		start = datetime.time(on.tm_hour, on.tm_min, 0)
		end = datetime.time(off.tm_hour, off.tm_min, 0)
		cur = datetime.time(cur_hr, cur_min, 0)
		
		if start <= end:
			return start <= cur < end
		else:
			return start <= cur or cur < end
			
""" end of class Light """

# callback function to be executed on rising GPIO edge from PIR
# toggles motion variable to true and toggles lights which are detecting motion to true
def toggle_motion():
	print 'motion toggled on'
	global cur_motion
	global off_time
	global new_lights_list
	cur_motion = True
	off_time = datetime.datetime.now() + datetime.timedelta(seconds=5)
	for i in range(count):
		if new_lights_list[i].motion:					# if a light is set to toggle on motion
			new_lights_list[i].toggle_from_button(newStatus=True)	# toggle that light to ON
			
def check_expired_motion():
	global cur_motion
	global off_time
	global new_lights_list
	if datetime.datetime.now() > off_time and not GPIO.event_detected(pir_in):				# if time has elapsed
		print 'motion expired'
		for i in range(count):		
			if new_lights_list[i].motion:					# if a light is set to toggle on motion
				new_lights_list[i].toggle_from_button()	# toggle that light to OFF
		cur_motion = False

try:	
	GPIO.add_event_detect(pir_in, GPIO.RISING, bouncetime=250)
	for i in range(count):
		# add event detection for lights
		# will pass a 'channel' - use to get index of init_gpio array and thus lights array
		lights_list[i] = Light(lights[i]['_id'], lights[i]['description'], init_gpio_in[i], init_gpio_out[i], lights[i]['status'], lights[i]['onMotion'], lights[i]['timed'], lights[i]['onTime'], lights[i]['offTime'])
		GPIO.add_event_detect(init_gpio_in[i], GPIO.RISING, bouncetime=250)
		
	print 'running'
		
	# begin infinite loop
	while True:
		new_lights = json.loads(req.get(baseLightsUrl, headers=header).text)
		
		if GPIO.event_detected(pir_in):
			#print 'motion event detected'
			toggle_motion()

		# detect changes in api
		for i in range(count):
			new_lights_list[i] = Light(new_lights[i]['_id'], new_lights[i]['description'], init_gpio_in[i], init_gpio_out[i], new_lights[i]['status'], new_lights[i]['onMotion'], new_lights[i]['timed'], new_lights[i]['onTime'], new_lights[i]['offTime'])

			if GPIO.event_detected(init_gpio_in[i]):
				print 'event detected on light ' + new_lights_list[i].description
				new_lights_list[i].toggle_from_button()
			
			
			# if a light is timed and current time is within its time range
			if new_lights_list[i].timed and new_lights_list[i].inTimeRange():
				# if the light is currently off, toggle on
				#print 'in time range'
				if not new_lights_list[i].status:
					new_lights_list[i].toggle_from_button()
			elif new_lights_list[i].timed and not new_lights_list[i].inTimeRange():
				#print 'no longer in time range'
				if new_lights_list[i].status:
					new_lights_list[i].toggle_from_button()

			# if light status is not equal to new status, toggle to new status
			new_lights_list[i].api_toggle(newStatus=new_lights_list[i].status)
			# if light motion is not equal to new motion, toggle to new motion
			new_lights_list[i].api_toggle(newMotion=new_lights_list[i].motion)
			# if light timed is not equal to new timed, toggle to new timed
			new_lights_list[i].api_toggle(newTimed=new_lights_list[i].timed)
			# if light onTime is not equal to new onTime, update
			new_lights_list[i].api_toggle(newOnTime=new_lights_list[i].onTime)
			# if light offTime is not equal to new offTime, update
			new_lights_list[i].api_toggle(newOffTime=new_lights_list[i].offTime)

		if cur_motion:				# if motion has been detected
			check_expired_motion()	# shut off if time has elapsed
		
except KeyboardInterrupt:
	print '\nKeyboardInterruptException'

finally:
	GPIO.cleanup()

