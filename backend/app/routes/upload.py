import os
from flask import Blueprint, jsonify, request
from app.services.upload_service import process_uploaded_video
from app.services.ai_service import process_video

upload_bp = Blueprint("upload", __name__)


@upload_bp.route("/upload-video", methods=["POST"])
def upload_video():

    if "video" not in request.files:
        return jsonify({"error": "No video uploaded"}), 400

    video = request.files["video"]

    if video.filename == "":
        return jsonify({"error": "No video selected"}), 400

    allowed_extensions = {".mp4", ".avi", ".mov"}

    file_extension = os.path.splitext(video.filename)[1].lower()

    if file_extension not in allowed_extensions:
        return jsonify({"error": "Unsupported video format"}), 400

    data = process_uploaded_video(video)

    ai_result = process_video(data["file_path"])

    data["ai_result"] = ai_result

    return jsonify(data)