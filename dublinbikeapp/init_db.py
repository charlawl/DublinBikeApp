from model import Session, Base, Station, engine
import json

Base.metadata.drop_all(engine, checkfirst=True)
print("tables dropped")
Base.metadata.create_all(engine)
print("tables recreated")

contract_name = 'Dublin'
data = json.load(open('static/Dublin.json'))
print("loading", len(data), "entries")

session = Session()
for station in data:
    kwargs = {'id': '{}_{}'.format(contract_name, station['number']),
              'contract_name': 'Dublin',
              'name': station['name'],
              'address': station['address'],
              'position_lat': station['position']['lat'],
              'position_long': station['position']['lng'],
              'banking': station['banking'],
              'bonus': station['bonus']}
    new_station = Station(**kwargs)
    session.add(new_station)

session.commit()