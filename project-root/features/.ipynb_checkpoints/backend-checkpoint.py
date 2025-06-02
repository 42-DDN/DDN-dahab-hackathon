import qrcode
from pathlib import PurePath
from flask import Flask, request

app = Flask(__name__)

@app.route("/qrcode", methods=['POST'])
def generate_qr_code():
    if request.method == 'POST':
        try:
            entry_id = request.form.get("_id")
            if entry_id == None:
                return {"status": 500, "message": "entry_id not provided"}
            entry_id = str(entry_id)
            img = qrcode.make(entry_id)
            img.save(PurePath("imgs", entry_id + ".png"))
            return {"status": 200, "message": "Success"}
        except ValueError():
            return {"status": 500, "message": "Invalid entry_id"}

@app.route("/")
def main():
    return """
        <h1 style="text-align:center;">Main Page</h1>
        <p style="text-align:center;">This is the main page of the backend use other routes to make requests</p>
        """