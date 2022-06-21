import flask
import random

app = flask.Flask(__name__)
app.config["DEBUG"] = True


@app.route("/", methods=["GET"])
def home():
    resp = flask.Response(str(random.randint(0, 100)))
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp


app.run()
