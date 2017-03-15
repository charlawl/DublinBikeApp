class Vector(object):
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return "Vector({}, {})".format(self.x, self.y)
