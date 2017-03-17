from flask import Flask, render_template, jsonify
app = Flask(__name__)
from sql_connection import Session, Station


session = Session()

# from misc import x

@app.route("/")
def homepage():
    json_data = {"name":"Joe","surname":"Doe"}
    return render_template("index.html")

@app.route("/stations/")
def get_station():
    with session.no_autoflush:
        entries = session.query(Station).all()
        fields = ['station_number', 'name', 'address', 'position_lat', 'position_long']
        json_station = []
        for station in entries:
            data = {f: getattr(station, f) for f in fields}
            data['station_number'] = data['station_number']
            
            json_station.append(data)
        return jsonify(json_station)

if __name__ == "__main__":
    app.run(debug=True, port=8080, host='localhost')
