from flask import Blueprint, jsonify, request
from app.services.upload_service import process_uploaded_video
from app.services.ai_service import process_video

upload_bp = Blueprint("upload", __name__)


@upload_bp.route("/upload-video", methods=["POST"])
def upload_video():

    if "video" not in request.files:
        return jsonify({"error": "No video uploaded"}), 400

    video = request.files["video"]

    data = process_uploaded_video(video)

    ai_result = process_video(data["file_path"])

    data["ai_result"] = ai_result

    return jsonify(data)