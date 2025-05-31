import qrcode
import os
from pathlib import PurePath
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/qrcode", methods=['POST'])
def generate_qr_code():
    if not request.is_json:
        return jsonify({"message": "Request must be JSON"}), 400
    data = request.json
    try:
        if "_id" not in data:
            return jsonify({"message": "entry_id not provided"}), 400
        entry_id = data["_id"]
        entry_id = str(entry_id)
        if not entry_id:
            return jsonify({"message": "entry_id is empty"}), 400
        img = qrcode.make(entry_id)
        if not os.path.exists("imgs"):
            os.mkdir("imgs")
        img.save(PurePath("imgs", entry_id + ".png"))
        return jsonify({"message": "Success"}), 200
    except ValueError:
        return jsonify({"message": "Invalid entry_id"}), 400
    except OSError:
        return jsonify({"message": "Error processing QR code"}), 500

@app.route("/")
def main():
    return """
        <h1 style="text-align:center;">Main Page</h1>
        <p style="text-align:center;">This is the main page of the backend use other routes to make requests</p>
        """