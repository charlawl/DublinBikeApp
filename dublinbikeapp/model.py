from sqlalchemy import Column, ForeignKey, Integer, String, Float, Boolean, DateTime
from sqlalchemy import and_, or_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker, scoped_session, load_only
from sqlalchemy.pool import NullPool
from datetime import datetime

Base = declarative_base()
days = ['M','T','W','T','F', 'S', 'S']

# using sqlalchemy declare a class for each table in our database.
class Station(Base):
    """this one is for storing information about each station."""
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


    @property
    def last_updated(self):
        """this method is used in the scraper to return the last updated station.
        this lets us pull only updated data."""
        try:
            return max(self.station_usage, key=lambda x: x.last_update).dt_last_update
        except ValueError:
            return datetime.fromtimestamp(0)

    @classmethod
    def get_current_station_info(cls, dbsession):
        """as the method name suggests this returns the up to date station information."""
        sub = dbsession.query(UsageData.station_id, func.max(UsageData.id).label('max_update')).group_by(
            UsageData.station_id).subquery()
        return dbsession.query(
            UsageData.last_update,
             UsageData.available_bike_stands, UsageData.available_bikes).join(sub, and_(
                sub.c.max_update == UsageData.id)).all()


class UsageData(Base):
    """holds data about bicycle usage for every station."""
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
        """return when was the last update. Once again this is used in the scraper to determine newly updated data."""
        return self.last_update


    @dt_last_update.setter
    def dt_last_update(self, val):
        """creates a datetime object which is added to the database with an update from the dublinbikes api.
        once again used by the scraper. essentially the adds the time at which the update was entered."""
        self.last_update = datetime.fromtimestamp(int(val)/1000)

    @classmethod
    def get_bikes_for_weekday(cls, dbsession, weekday, station_id):
        """returns a list of bikes for a provided weekday and station.
        averaged per hour so 24 results."""
        station = [("Time", "Available Bikes", "Available Stands")]

        station_data = dbsession.query(func.hour(cls.last_update),
                                        func.avg(cls.available_bikes),
                                        func.avg(cls.available_bike_stands)) \
            .filter(cls.station_id == station_id,
                    func.weekday(cls.last_update) == weekday) \
            .group_by(func.hour(cls.last_update)) \
            .all()

        # this section parses the query return into a readable list.
        # from docs:extend() appends the contents of seq to list.
        if station_data:
            station.extend([(a, float(b), float(c)) for a, b, c in station_data])
        else:
            station.extend([(0,0,0)])
        return station

    @classmethod
    def get_bikes_for_wetday(cls, dbsession, wetdate, station_id):
        """very similar to get_bikes_for_weekday but not the same: date specified is wetdate not weekday.
        returns a list of bikes for a provided datetime object (wetdate) and station."""
        # averaged per hour so 24 results.
        station = [("Time", "Available Bikes", "Available Stands")]
        station_data = dbsession.query(
            func.hour(cls.last_update),
            func.avg(cls.available_bikes),
            func.avg(cls.available_bike_stands))\
            .filter(cls.station_id == station_id,
                    func.date(cls.last_update) == wetdate.date())\
            .group_by(func.hour(cls.last_update)).all()

        # this section parses the query return into a readable list.
        # from docs:extend() appends the contents of seq to list.
        if station_data:
            station.extend([(a, float(b), float(c)) for a, b, c in station_data])
        else:
            station.extend([(0,0,0)])
        return station


    @classmethod
    def get_bikes_for_week(cls, dbsession, station_id):
        """as method name describes.
        similar to methods above but averaged over week."""
        station = [("Day", "Available Bikes")]
        station_data = dbsession.query(func.weekday(cls.last_update),
                                       func.avg(cls.available_bikes)) \
            .filter(cls.station_id == station_id) \
            .group_by(func.weekday(cls.last_update)) \
            .all()

        # this section parses the query return into a readable list.
        # from docs:extend() appends the contents of seq to list.
        if station_data:
            station.extend([(days[a], float(b)) for a, b in station_data])
        else:
            station.extend([(0,0)])

        return station


class Weather(Base):
    """holds data scraped from the open weather API."""
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

    @classmethod
    def findWetWeatherDays(self, dbsession, today):
        """finds days where there was wet weather."""
        wetDays = dbsession.query(self.dt).filter(or_(self.weather_description == "light rain", self.weather_description == "moderate rain")).all()
        # if one of those days is today return it.
        # else just return a wet day.
        for i in range(len(wetDays)):
            if today == wetDays[i][0].weekday():
                return wetDays[i][0]
        else:
            return wetDays[0][0]


# path to DB
engine = create_engine('mysql+mysqldb://hinfeyg2:ftz6wn77@dubbikesinstance.ct0jhxantvpy.eu-west-1.rds.amazonaws.com:3306/dublinbikesdata', poolclass=NullPool)

# create the session using sqlalchemy.
db_session = scoped_session(sessionmaker(bind=engine, autocommit=False, autoflush=False))


if __name__=="__main__":
    """Below is used for testing if the database is working by running this file directly.
    not used in the actual app."""
    station_id = 42

    static_info = db_session.query(Station.number,
                                   Station.name,
                                   Station.address,
                                   Station.position_lat,
                                   Station.position_long).all()
    dynamic_info = Station.get_current_station_info(db_session)
    static_fields = ['number', 'name', 'address', 'position_lat', 'position_long']
    dynamic_fields = ['last_update', 'available_bike_stands', 'available_bikes']

    json_data = [dict(zip(static_fields + dynamic_fields, static + dynamic))
                 for static, dynamic in
                 zip(static_info, dynamic_info)]
    print(json_data)
