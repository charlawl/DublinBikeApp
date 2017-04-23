import json
from datetime import datetime
from model import UsageData, Weather, Session, Station
import requests
import threading

# API keys for Dublin Bikes and Weather API's
api_key_bikes = "a982c88ae2bd27c612550bff6eedaa3e8e25d8bc"
api_key_weather = "dac182eb7101ccaf65e1f8b9b524bf01"


def scrape_bikes(api_key, city='Dublin'):
    """Function to scrape Dublin Bikes API and insert returned data to the database in json format"""
    uri = "https://api.jcdecaux.com/vls/v1/stations"
    # Formatting request structure
    r = requests.get(uri, params={'type': 'stations',
                                  'apiKey': api_key,
                                  'contract': city})

    insert_db_bikes(r.json())
    # setting the scraper on a timer - every minute
    threading.Timer((60.0 * 1), scrape_bikes, kwargs={'api_key': api_key_bikes}).start()


def scrape_weather(api_key):
    """Function to scrape Open Weather Map API and insert returned data to the database in json format"""
    uri = "http://api.openweathermap.org/data/2.5/weather"
    # Formatting request structure
    r = requests.get(uri, params={'type': 'weather',
                                  'appid': api_key,
                                  'units': 'metric',
                                  'q': 'Dublin, IE'
                                  })

    insert_db_weather(r.json())
    # setting the scraper on a timer - every 3 hours
    threading.Timer((60.0 * 180), scrape_weather, kwargs={'api_key': api_key_weather}).start()


def insert_db_bikes(values):
    """Function for inserting scraped data from Bikes API into database"""
    fields = ['status', 'bike_stands', 'available_bike_stands', 'available_bikes']

    session = Session()

    for data in values:
        station = session.query(Station).get(data['number'])
        # checking if the timestamp is greater than the last update to ensure no duplicates are added to the DB
        if datetime.fromtimestamp(data['last_update']/1000) > station.last_updated:
            new_data = UsageData(**{field: data[field] for field in fields})
            new_data.dt_last_update = data['last_update']
            station.station_usage.append(new_data)
    session.commit()
    session.close()



def insert_db_weather(weather_values):
    """Function for inserting scraped data from Weather API into database"""
    session = Session()
    new_data = Weather(coord_lon=weather_values["coord"]["lon"],
                       coord_lat=weather_values["coord"]["lat"],
                       weather_id=weather_values["weather"][0]["id"],
                       weather_main=weather_values["weather"][0]["main"],
                       weather_description=weather_values["weather"][0]["description"],
                       weather_icon=weather_values["weather"][0]["icon"],
                       base=weather_values["base"],
                       main_temp=weather_values["main"]["temp"],
                       main_pressure=weather_values["main"]["pressure"],
                       main_humidity=weather_values["main"]["humidity"],
                       main_temp_min=weather_values["main"]["temp_min"],
                       main_temp_max=weather_values["main"]["temp_max"],
                       visibility=weather_values["visibility"],
                       wind_speed=weather_values["wind"]["speed"],
                       wind_deg=weather_values["wind"]["deg"],
                       clouds_all=weather_values["clouds"]["all"],
                       dt=datetime.fromtimestamp(weather_values["dt"]),
                       sys_type=weather_values["sys"]["type"],
                       sys_id=weather_values["sys"]["id"],
                       sys_message=weather_values["sys"]["message"],
                       sys_country=weather_values["sys"]["country"],
                       sys_sunrise=datetime.fromtimestamp(weather_values["sys"]["sunrise"]),
                       sys_sunset=datetime.fromtimestamp(weather_values["sys"]["sunset"]),
                       city_id=weather_values["id"],
                       city_name=weather_values["name"],
                       cod=weather_values["cod"])
    session.add(new_data)
    session.commit()
    session.close()

# Running the scraper
scrape_bikes(api_key_bikes)
scrape_weather(api_key_weather)
