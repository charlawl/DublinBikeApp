from model import db_session, Base, Station, engine
import json

Base.metadata.drop_all(engine, checkfirst=True)
print("tables dropped")
Base.metadata.create_all(engine)
print("tables recreated")

contract_name = 'Dublin'
data = json.load(open('static/misc/station_data.json'))
print("loading", len(data), "entries")

for station in data:
    kwargs = {'number': station['number'],
              'contract_name': 'Dublin',
              'name': station['name'],
              'address': station['address'],
              'position_lat': station['position']['lat'],
              'position_long': station['position']['lng'],
              'banking': station['banking'],
              'bonus': station['bonus']}
    new_station = Station(**kwargs)
    db_session.add(new_station)

db_session.commit()
