from flask import Flask, render_template
app = Flask(__name__)

# from misc import x

@app.route("/")
def homepage():
    json_data = {"name":"Joe","surname":"Doe"}
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True, port=8080, host='localhost')
