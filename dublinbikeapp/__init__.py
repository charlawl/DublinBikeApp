from flask import Flask, render_template, jsonify
app = Flask(__name__)
from dublinbikeapp.model import db_session, Station, UsageData
import datetime
from sqlalchemy import func
from sqlalchemy.orm import Bundle


from flask import Flask
app = Flask(__name__)

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


@app.route("/")
def homepage():
    return render_template("index.html")

@app.route("/stations/<station_id>")
@app.route("/stations/", defaults={"station_id": None})
def get_station(station_id):
    if station_id:
        station = [("Time", "Available Bikes", "Available Stands")]
        return jsonify(UsageData.get_bikes_for_weekday(db_session, datetime.datetime.today().weekday(), station_id))

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

