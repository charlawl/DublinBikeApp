from sqlalchemy import Column, ForeignKey, Integer, String, Float, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker, scoped_session, load_only
from sqlalchemy.pool import NullPool
from datetime import datetime

Base = declarative_base()


class Station(Base):
    __tablename__ = "station"
    number = Column(Integer, primary_key=True, autoincrement=False)
    contract_name = Column(String(250), nullable=False)
    name = Column(String(250), nullable=False)
    address = Column(String(250), nullable=False)
    position_lat = Column(Float, nullable=False)
    position_long = Column(Float, nullable=False)
    banking = Column(Boolean, nullable=True)
    bonus = Column(Boolean, nullable=True)
    station_usage = relationship("UsageData", lazy="dynamic")

    # def to_json(self):
    #     return {k: v for k, v in self.__dict__.items() if not k.startswith("_")}

    @property
    def last_updated(self):
        try:
            return max(self.station_usage, key=lambda x: x.last_update).dt_last_update
        except ValueError:
            return datetime.fromtimestamp(0)


class UsageData(Base):
    __tablename__ = "bike_usage"
    id = Column(Integer, primary_key=True)
    station_id = Column(Integer, ForeignKey('station.number'))
    status = Column(Boolean, nullable=False)
    bike_stands = Column(Integer, nullable=False)
    available_bike_stands = Column(Integer, nullable=False)
    available_bikes = Column(Integer, nullable=False)
    last_update = Column(DateTime, nullable=False)


    @property
    def dt_last_update(self):
        return self.last_update


    @dt_last_update.setter
    def dt_last_update(self, val):
        self.last_update = datetime.fromtimestamp(int(val)/1000)

    @classmethod
    def get_bikes_for_weekday(cls, dbsession, weekday, station_id):
        # weekday = 6
        station = [("Time", "Available Bikes", "Available Stands")]

        station_data = dbsession.query(func.hour(cls.last_update),
                                        func.avg(cls.available_bikes),
                                        func.avg(cls.available_bike_stands)) \
            .filter(cls.station_id == station_id,
                    func.weekday(cls.last_update) == weekday) \
            .group_by(func.hour(cls.last_update)) \
            .all()

        station.extend([(a, float(b), float(c)) for a, b, c in station_data])
        return station


class Weather(Base):
    __tablename__ = "weather"
    id = Column(Integer, nullable=False, primary_key=True, autoincrement=True)
    coord_lon = Column(Float)
    coord_lat = Column(Float)
    weather_id = Column(Integer)
    weather_main = Column(String(45))
    weather_description = Column(String(45))
    weather_icon = Column(String(10))
    base = Column(String(45))
    main_temp = Column(Integer)
    main_pressure = Column(Integer)
    main_humidity = Column(Integer)
    main_temp_min = Column(Integer)
    main_temp_max = Column(Integer)
    visibility = Column(Integer)
    wind_speed = Column(Float)
    wind_deg = Column(Integer)
    clouds_all = Column(Integer)
    dt = Column(DateTime)
    sys_type = Column(Integer)
    sys_id = Column(Integer)
    sys_message = Column(Float)
    sys_country = Column(String(2))
    sys_sunrise = Column(DateTime)
    sys_sunset = Column(DateTime)
    city_id = Column(Integer)
    city_name = Column(String(6))
    cod = Column(Integer)

# path to DB
engine = create_engine('mysql+mysqldb://hinfeyg2:ftz6wn77@dubbikesinstance.ct0jhxantvpy.eu-west-1.rds.amazonaws.com:3306/dublinbikesdata', poolclass=NullPool)
# engine = create_engine('mysql+mysqldb://charlottehearne:charlottehearne@localhost:3306/sqlalchemy_test')

db_session = scoped_session(sessionmaker(bind=engine, autocommit=False, autoflush=False))


if __name__=="__main__":
    station_id = 42
    # station = db_session.query(Station).get(station_id)
    # print(list(map(lambda x: x.to_json(fields=["available_bikes", "available_bike_stands", "last_update"]),  station.station_usage)))
    station = db_session.query(Station).get(station_id)
    station_usage = station.station_usage.group_by(func.hour(UsageData.last_update))

    # station = db_session.query(Station.number, UsageData.last_update, UsageData.available_bikes, UsageData.available_bike_stands)\
    #     .join(Station.station_usage)\
    #     .filter(Station.number==station_id, func.weekday(UsageData.last_update) == 0).all()
    # station_usage = station.station_usage("available_bikes")
    # station_usage.options(load_only("available_bikes"))
    print(station_usage)
    print(station)