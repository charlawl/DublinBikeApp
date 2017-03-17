from sqlalchemy import Column, ForeignKey, Integer, String, Float, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

Base = declarative_base()


class Station(Base):
    __tablename__ = "station"
    id = Column(String(50), primary_key=True, autoincrement=False)
    contract_name = Column(String(250), nullable=False)
    name = Column(String(250), nullable=False)
    address = Column(String(250), nullable=False)
    position_lat = Column(Float, nullable=False)
    position_long = Column(Float, nullable=False)
    banking = Column(Boolean, nullable=True)
    bonus = Column(Boolean, nullable=True)

    @property
    def station_number(self):
        return self.id.split("_")[1]


class UsageData(Base):
    __tablename__ = "bike_usage"
    id = Column(Integer, primary_key=True)
    station_id = Column(String(50), ForeignKey('station.id'))
    station = relationship(Station)
    status = Column(Boolean, nullable=False)
    bike_stands = Column(Integer, nullable=False)
    available_bike_stands = Column(Integer, nullable=False)
    available_bikes = Column(Integer, nullable=False)
    last_update = Column(DateTime, nullable=False)


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
    sys_sunrise = Column(String(45))
    sys_sunset = Column(String(45))
    city_id = Column(Integer)
    city_name = Column(String(6))
    cod = Column(Integer)

# path to DB
engine = create_engine('mysql+mysqldb://hinfeyg2:ftz6wn77@localhost:3306/dubbikesdatabase')
Session = sessionmaker(bind=engine)
