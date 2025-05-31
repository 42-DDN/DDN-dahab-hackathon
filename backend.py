import qrcode
from flask import Flask

app = Flask(__name__)

@app.route("/qrcode", methods=['POST'])
def qrcode():
    if request.method == 'POST':
        try:
            entry_id = str(request.form["_id"])
            img = qrcode.make(entry_id)
            img.save(entry_id + ".png")
            return {status: 200, message: "Success"}
        except ValueError():
            return {status: 500, message: "Invalid entry_id"}

@app.route("/")
def main():
    return """
        <h1 style="text-align:center;">Main Page</h1>
        <p style="text-align:center;">This is the main page of the backend use other routes to make requests</p>
        """