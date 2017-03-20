import pymysql
import requests
import json
import sys
import threading

# https://api.jcdecaux.com/vls/v1/stations?apiKey=a982c88ae2bd27c612550bff6eedaa3e8e25d8bc&contract=Dublin
api_key = "a982c88ae2bd27c612550bff6eedaa3e8e25d8bc"
api_key_weather = "dac182eb7101ccaf65e1f8b9b524bf01"

weather_uri = "http://api.openweathermap.org/data/2.5/weather?units=metric&q=Dublin,%20IE&appid=dac182eb7101ccaf65e1f8b9b524bf01"
weather_r = requests.get(weather_uri)

weather_values = weather_r.json()

uri = "https://api.jcdecaux.com/vls/v1/stations"
city = "Dublin"
r = requests.get(uri, params={'type':'stations', 'apiKey': api_key, 'contract': city})

values = r.json()
# for data in values:
# 	print("latitude :", data["position"]["lat"],"longitude : ", data["position"]["lng"])

def dbconnect():
	try:
		db = pymysql.connect(
		host='dubbikesinstance.ct0jhxantvpy.eu-west-1.rds.amazonaws.com',
		user='',
		passwd='',
		db='dublinbikesdata'
		)
	except Exception as e:
		sys.exit("Can't connect to database")
	return db

def insertDbWeather():
	try:
		threading.Timer((60.0 * 5), insertDbWeather).start()
		db = dbconnect()
		cursor = db.cursor()
		for data in values:
			# first insert into station
			cursor.execute("""
			INSERT INTO station(`st_number`,`name`,`address`,`position_lat`,
			`position_lng`,`banking`,`bonus`,`status`,
			`contract_name`,`bike_stands`,`available_bike_stands`,`available_bikes`,
			`last_update`)
			VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) """,
			(data["number"],data["name"],data["address"],data["position"]["lat"],data["position"]["lng"],
			data["banking"],data["bonus"],data["status"],data["contract_name"],data["bike_stands"],
			data["available_bike_stands"],data["available_bikes"],data["last_update"])
			)
		db.commit()
		cursor.close()
	except Exception as e:
		print(e)




def insertDbStation():
	try:
		threading.Timer((60.0 * 180), insertDbStation).start()
		db = dbconnect()
		cursor = db.cursor()

			# first insert into station
		cursor.execute("""
		INSERT INTO weather(`coord_lon`,`coord_lat`,`weather_id`,`weather_main`,
		`weather_description`,`weather_icon`,`base`,`main_temp`,`main_pressure`,
		`main_humidity`,`main_temp_min`,`main_temp_max`,`visibility`,
		`wind_speed`,`wind_deg`,`clouds_all`,`dt`,`sys_type`,`sys_id`,
		`sys_message`,`sys_country`,`sys_sunrise`,`sys_sunset`,`id`,`name`,
		`cod`)
		VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) """,
		(weather_values["coord"]["lon"],weather_values["coord"]["lat"],
		weather_values["weather"][0]["id"],weather_values["weather"][0]["main"],
		weather_values["weather"][0]["description"],
		weather_values["weather"][0]["icon"],weather_values["base"],
		weather_values["main"]["temp"],weather_values["main"]["pressure"],
		weather_values["main"]["humidity"],
		weather_values["main"]["temp_min"],weather_values["main"]["temp_max"],
		weather_values["visibility"],weather_values["wind"]["speed"],
		weather_values["wind"]["deg"],
		weather_values["clouds"]["all"],str(weather_values["dt"]),weather_values["sys"]["type"],
		weather_values["sys"]["id"],weather_values["sys"]["message"],
		weather_values["sys"]["country"],str(weather_values["sys"]["sunrise"]),str(weather_values["sys"]["sunset"]),
		weather_values["id"],weather_values["name"],weather_values["cod"])
		)
		db.commit()
		cursor.close()
	except Exception as e:
		print(e)


insertDbWeather()

insertDbStation()

