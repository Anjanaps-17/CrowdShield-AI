
import os
import logging

from flask import Blueprint, jsonify, request
from app.services.upload_service import process_uploaded_video
from app.services.ai_service import process_video

upload_bp = Blueprint("upload", __name__)
logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {".mp4", ".avi", ".mov"}


@upload_bp.route("/upload-video", methods=["POST"])
def upload_video():
    if "video" not in request.files:
        return jsonify({"error": "No video uploaded"}), 400

    video = request.files["video"]

    if not video.filename:
        return jsonify({"error": "No video selected"}), 400

    file_extension = os.path.splitext(video.filename)[1].lower()

    if file_extension not in ALLOWED_EXTENSIONS:
        return jsonify({"error": "Unsupported video format"}), 400

    try:
        data = process_uploaded_video(video)
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    except Exception:
        logger.exception("Failed to save uploaded video")
        return jsonify({
            "error": "Unable to save the uploaded video"
        }), 500

    try:
        ai_result = process_video(data["file_path"])
    except Exception:
        logger.exception("Video processing failed")
        return jsonify({
            "error": "Video uploaded, but AI processing failed"
        }), 500

    data["ai_result"] = ai_result
    return jsonify(data), 200
