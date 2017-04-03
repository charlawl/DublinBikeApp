import setuptools

setuptools.setup(name="DublinBikesApp",
      version="0.1",
      description="Dublin Bike Application - Project",
      url="dublinbike.info",
      author="Charlotte Hearne, Gavin Hinfey, Nkosi Ndlovu",
      author_email="charlotte.hearne@ucdconnect.ie",
      licence="GPL3",
      packages=['light_box'],
      test_suite="tests",
      install_requires=['flask', 'mysqlclient', 'SQLAlchemy']
      )