from flask import Flask, render_template, jsonify
app = Flask(__name__)
from dublinbikeapp.model import Session, Station

session = Session()

from flask import Flask
app = Flask(__name__)

@app.route("/")
def homepage():
    return render_template("index.html")

@app.route("/stations/")
def get_station():
    with session.no_autoflush:
        entries = session.query(Station).all()
        fields = ['number', 'name', 'address', 'position_lat', 'position_long']
        json_station = []
        for station in entries:
            data = {f: getattr(station, f) for f in fields}
            json_station.append(data)
        return jsonify(json_station)

if __name__ == "__main__":
    app.run(debug=True, port=8080, host='localhost')

