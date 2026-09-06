import os


UPLOAD_FOLDER = "uploads"


def process_uploaded_video(video):
    filename = video.filename
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    video.save(file_path)

    return {
        "message": "Video uploaded successfully.",
        "filename": filename,
        "file_path": file_path,
        "status": "Saved"
    }