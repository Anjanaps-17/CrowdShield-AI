
import os
from uuid import uuid4
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = os.path.join(
    os.path.dirname(
        os.path.dirname(
            os.path.dirname(os.path.abspath(__file__))
        )
    ),
    "uploads",
)

ALLOWED_EXTENSIONS = {".mp4", ".avi", ".mov"}


def process_uploaded_video(video):
    original_filename = video.filename or ""
    safe_filename = secure_filename(original_filename)

    if not safe_filename:
        raise ValueError("Invalid filename")

    extension = os.path.splitext(safe_filename)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError("Unsupported video format")

    # Generate a unique name to avoid path traversal and filename collisions.
    filename = f"{uuid4().hex}{extension}"
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    video.save(file_path)

    return {
        "message": "Video uploaded successfully.",
        "filename": filename,
        "original_filename": safe_filename,
        "file_path": file_path,
        "status": "Saved",
    }
