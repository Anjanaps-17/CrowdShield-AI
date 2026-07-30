from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/")
def home():
    return jsonify({
        "message": "Welcome to CrowdShield AI Backend!"
    })


@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "service": "CrowdShield AI Backend"
    })


if __name__ == "__main__":
    app.run(debug=True)