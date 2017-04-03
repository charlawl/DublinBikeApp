from __init__ import *
import unittest

class FlaskTestCase(unittest.TestCase):

	def test_index_page(self):
		# tester is a dummy of our app
		tester = app.test_client(self)
		response = tester.get('/', content_type='html/text')
		self.assertEqual(response.status_code, 200)

	def test_index_header_presence(self):
		# tester is a dummy of our app
		tester = app.test_client(self)
		response = tester.get('/', content_type='html/text')
		self.assertTrue(b'Dublin Bikes App' in response.data)

	def test_station_json(self):
		# tester is a dummy of our app
		tester = app.test_client(self)
		response = tester.get('/stations/', content_type='application/json')
		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.content_length, 15956)

	def test_station_json_length(self):
		# tester is a dummy of our app
		tester = app.test_client(self)
		response = tester.get('/stations/', content_type='application/json')
		self.assertEqual(response.content_length, 15956)


if __name__ == '__main__':
	unittest.main()

