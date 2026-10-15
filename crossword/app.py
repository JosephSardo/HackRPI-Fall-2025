from utils.convert import puz_to_json
from puz import load
from flask import Flask, Response, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/jsonify", methods=["POST"])
def convert_puzzle() -> Response:
    file = request.files['file']
    if not file:
        return Response(status=500)

    puzzle = load(file.read())    
    json = puz_to_json(puzzle)
    print(json)
    return jsonify(json)

if __name__ == "__main__":
    app.run(host="127.0.0.1",port="5174")
