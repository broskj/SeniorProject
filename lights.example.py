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

# get authorization token to assign to headers
token = json.loads(req.post(loginUrl, data={'email':'username@emain.com','password':'mypassword'}).text)['token']
header = {'Authorization':'Bearer ' + str(token)}

# gpio pins
count = 4
sleep_time = 0.25
pir_in = 18
init_gpio_in = [22,23,24,25]
init_gpio_out = [2,3,4,17]
cur_motion = False
off_time = datetime.datetime.now()

GPIO.setup(pir_in, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(init_gpio_in, GPIO.IN, pull_up_down = GPIO.PUD_DOWN)
GPIO.setup(init_gpio_out, GPIO.OUT, initial=GPIO.HIGH)

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
	def api_toggle(self, newStatus=None, newMotion=None, newTimed=None, newOnTime=None, newOffTime=None:
		var now = datetime.datetime.now()
		h = now.hour
		m = now.minute
		if newStatus is not None:
			# update status and set GPIO
			self.status=newStatus
			GPIO.output(self.gpio_out, self.status is 'false')
		elif newMotion is not None:
			# update motion and set GPIO if there is motion
			self.motion=newMotion
			if cur_motion:
				self.status='true'
				GPIO.output(self.gpio_out, self.status is 'false')
		elif newTimed is not None:
			# update timed and set GPIO if timed and in time range
			self.timed=newTimed
			if self.timed and self.inTimeRange(h, m):
				self.status='true'
				GPIO.output(self.gpio_out, self.status is 'false')
		elif newOnTime is not None:
			# update onTime and set GPIO if timed and in time range
			self.ontime=newOnTime
			if self.timed and self.inTimeRange(h,m):
				self.status='true'
				GPIO.output(self.gpio_out, self.status is 'false')
		elif newOffTime is not None:
			# update offTime and set GPIO if timed and in time range
			self.offTime=newOffTime
			if self.timed and self.inTimeRange(h,m):
				self.status='true'
				GPIO.output(self.gpio_out, self.status is 'false')
		else:
			print 'something happened'
			
	# define behavior for detecting physical actions
	# need to toggle GPIO to reflect status
	def physical_toggle(self, newStatus=None):
		var now = str(datetime.datetime.now())
		# only called on button press - only concerned with toggling light status
		if newStatus is not None:
			# disable timed if turned off while in time range
			if self.timed and self.inTimeRange(datetime.datetime.now().hour, datetime.datetime.now().minute) and newStatus is 'false':
				self.timed='false'
				req.put(baseLightsUrl + '/' + self.id, data={'status':newStatus, 'timed':'false', 'updatedAt':now}, headers=header)
				# need to POST to log with description
			else:
				req.put(baseLightsUrl + '/' + self.id, data={'status':newStatus,'updatedAt':now}, headers=header)
			self.status=newStatus
			GPIO.output(self.gpio_out, newStatus is 'false') # newStatus is 'false' returns boolean
			
	# perform check to determine if current time is within timed range
	def inTimeRange(self, cur_hour, cur_minute):
		on = time.strptime(self.onTime, '%H:%M')
		off = time.strptime(self.offTime, '%H:%M')
		
		cur_time = cur_hour * 100 + cur_minute
		on_time = on.tm_hour * 100 + on.tm_min
		off_time = off.tm_hour * 100 + off.tm_min
		
		return cur_time >= on_time or cur_time < off_time
			
""" end of class Light """

# callback function to be executed on rising GPIO edge from PIR
# toggles motion variable to true and toggles lights which are detecting motion to true
def toggle_motion(channel):
	print 'motion toggled on'
	global cur_motion
	global off_time
	global new_lights_list
	cur_motion = True
	off_time = datetime.datetime.now() + datetime.timedelta(seconds=5)
	for i in range(count):
		if new_lights_list[i].motion:					# if a light is set to toggle on motion
			new_lights_list[i].physical_toggle(newStatus='true')	# toggle that light to ON
			
def check_expired_motion():
	global cur_motion
	global off_time
	global new_lights_list
	if datetime.datetime.now() > off_time:				# if time has elapsed
		print 'motion expired'
		for i in range(count):		
			if new_lights_list[i].motion:					# if a light is set to toggle on motion
				new_lights_list[i].physical_toggle(newStatus='false')	# toggle that light to OFF
		cur_motion = False

# callback function to be executed on rising GPIO edge from a light
# gets light to be toggled and toggles that light to opposite status
def toggle_light(channel):
	print 'toggle_light'
	index = gpio_in.index(channel)
	global new_lights_list
	curStatus = new_lights_list[index].status
	if curStatus is 'true':
		new_lights_list[index].physical_toggle(newStatus='false')
	else:
		new_lights_list[index].physical_toggle(newStatus='true')

try:
	lights = json.loads(req.get(baseLightsUrl, headers=header).text)
	GPIO.add_event_detect(pir_in, GPIO.RISING, callback=toggle_motion)
	for i in range(count):
		# add event detection for lights
		# will pass a 'channel' - use to get index of init_gpio array and thus lights array
		GPIO.add_event_detect(gpio_in[i], GPIO.RISING, callback=toggle_light, bouncetime=250)
		# initialize Light objects from lights json
		lights_list[i] = Light(lights[i]['_id'], lights[i]['description'], init_gpio_in[i], init_gpio_out[i], lights[i]['status'], lights[i]['onMotion'], lights[i]['timed'], lights[i]['onTime'], lights[i]['offTime'])
		
	# begin infinite loop
	while True:
		cur_hour = datetime.datetime.now().hour
		cur_min = datetime.datetime.now().minute
		
		new_lights = json.loads(req.get(baseLightsUrl, headers=header).text)
		
		for i in range(count):
			new_lights_list[i] = Light(new_lights[i]['_id'], new_lights[i]['description'], init_gpio_in[i], init_gpio_out[i], new_lights[i]['status'], new_lig	hts[i]['onMotion'], new_lights[i]['timed'], new_lights[i]['onTime'], new_lights[i]['offTime'])
			
		# detect changes in api
		for i in new_lights_list:
			# if a light is timed and current time is within its time range
			if new_lights_list[i].timed and new_lights_list[i].inTimeRange(cur_hour, cur_min):
				# if the light is currently off, toggle on
				if new_lights_list[i].status is 'false':
					new_lights_list[i].api_toggle(newStatus='true')
					continue
			# if light status is not equal to new status, toggle to new status
			if lights_list[i].status is not new_lights_list[i].status:
				lights_list[i].api_toggle(newStatus=new_lights_list[i].status)
				continue
			# if light motion is not equal to new motion, toggle to new motion
			if lights_list[i].motion is not new_lights_list[i].motion:
				lights_list[i].api_toggle(newMotion=new_lights_list[i].motion)
				continue
			# if light timed is not equal to new timed, toggle to new timed
			if lights_list[i].timed is not new_lights_list[i].timed:
				lights_list[i].api_toggle(newTimed=new_lights_list[i].timed)
				continue
			# if light onTime is not equal to new onTime, update
			if lights_list[i].onTime is not new_lights_list[i].onTime:
				lights_list[i].api_toggle(newOnTime=new_lights_list[i].onTime)
			# if light offTime is not equal to new offTime, update
			if lights_list[i].offTime is not new_lights_list[i].offTime:
				lights_list[i].api_toggle(newOffTime=new_lights_list[i].offTime)
				
		if cur_motion:				# if motion has been detected
			check_expired_motion()	# shut off if time has elapsed
		lights_list = new_lights_list
	
except KeyboardInterrupt:
	print '\nKeyboardInterruptException'

finally:
	GPIO.cleanup()

