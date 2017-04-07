from flask import Flask, render_template, jsonify
app = Flask(__name__)
from dublinbikeapp.model import db_session, Station, UsageData
from datetime import datetime
import requests
from sqlalchemy import func
from sqlalchemy.orm import Bundle


from flask import Flask
app = Flask(__name__)

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


@app.route("/")
def homepage():
    weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    response = requests.get( "http://api.openweathermap.org/data/2.5/forecast/daily?id=2964574&units=metric&APPID=1f0867a1f0c8ffc3bd29767c8aed1cb2")
    data = response.json()['list']

    for day in data:
        day['icon_filename'] = "icons/icon-{}.svg".format(int(day['weather'][0]['icon'][:-1]))
        day['weekday'] = weekdays[datetime.fromtimestamp(day['dt']).weekday()]
        day['date'] = datetime.fromtimestamp(day['dt']).strftime('%b %d, %Y')

    return render_template("index.html", weather_data=data)

@app.route("/stations/<station_id>")
@app.route("/stations/", defaults={"station_id": None})
def get_station(station_id):
    if station_id:
        station = [("Time", "Available Bikes", "Available Stands")]
        return jsonify(UsageData.get_bikes_for_weekday(db_session, datetime.today().weekday(), station_id))

    else:
        entries = db_session.query(Station).all()
        fields = ['number', 'name', 'address', 'position_lat', 'position_long']
        json_station = []
        for station in entries:
            data = {f: getattr(station, f) for f in fields}
            json_station.append(data)

        return jsonify(json_station)

if __name__ == "__main__":
    app.run(debug=True, port=8080, host='localhost')

