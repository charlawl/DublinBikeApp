from flask import Flask, render_template, jsonify
from model import db_session, Station, UsageData, Weather
from datetime import datetime
import requests
from sqlalchemy import func
from sqlalchemy.orm import Bundle


from flask import Flask
app = Flask(__name__)

@app.teardown_appcontext
def shutdown_session(exception=None):
    """closes all sqlalchemy sessions from each query in this in file."""
    db_session.remove()

# create endpoint for main page.
@app.route("/")
def homepage():
    """get up to date data from the open weather map API for the page header."""
    weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    response = requests.get( "http://api.openweathermap.org/data/2.5/forecast/daily?id=2964574&units=metric&APPID=1f0867a1f0c8ffc3bd29767c8aed1cb2")
    data = response.json()['list']

    for day in data:
        day['icon_filename'] = "icons/icon-{}.svg".format(int(day['weather'][0]['icon'][:-1]))
        day['weekday'] = weekdays[datetime.fromtimestamp(day['dt']).weekday()]
        day['date'] = datetime.fromtimestamp(day['dt']).strftime('%b %d, %Y')

    # returning render template is which run by jinja in weather.html. This is then included into index.html.
    return render_template("index.html", weather_data=data)

# Endpoint to send SQL Alchemy data to the front end.
@app.route("/stations_weekday/<station_id>")
def get_station_data_weekday(station_id):
    """run query for given station. Returns bike usage data for today averaged per hour."""
    data = UsageData.get_bikes_for_weekday(db_session, datetime.today().weekday(), station_id)
    # returns json object to the this endpoint
    return jsonify(data)

# Endpoint to send SQL Alchemy data to the front end.
@app.route("/stations_weekly/<station_id>")
def get_station_data_weekly(station_id):
    """run query for given station. return average for each day of the week."""
    data = UsageData.get_bikes_for_week(db_session, station_id)
    return jsonify(data)

# Endpoint to send SQL Alchemy data to the front end.
@app.route("/getRainDay/<station_id>")
def get_weather(station_id):
    """run a query to get today but wet."""
    wetDay = Weather.findWetWeatherDays(db_session, datetime.today().weekday())
    # pass that day into the get bikes db and return the average bike usage for that day.
    return jsonify(UsageData.get_bikes_for_wetday(db_session, wetDay, station_id))

# endpoint returns info about each station.
@app.route("/stations/")
def get_station():
    """Returns the current station data."""
    # Run the query.
    static_info = db_session.query(Station.number,
                                   Station.name,
                                   Station.address,
                                   Station.position_lat,
                                   Station.position_long).all()
    dynamic_info = Station.get_current_station_info(db_session)
    static_fields = ['number', 'name', 'address', 'position_lat', 'position_long']
    dynamic_fields = ['last_update', 'available_bike_stands', 'available_bikes']

    # build a dictionary with the results. Zip here returns a list of tuples. dict makes them a dictionary.
    json_data = [dict(zip(static_fields+dynamic_fields, static+dynamic)) for static, dynamic in zip(static_info, dynamic_info)]
    # convert dictionary that to json and return.
    return jsonify(json_data)


if __name__ == "__main__":
    app.run(debug=True, port=8080, host='localhost')

