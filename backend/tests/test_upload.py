import io
from unittest.mock import patch

from app import create_app


def setup_client():
    app = create_app()
    app.config["TESTING"] = True
    return app.test_client()


def test_upload_without_video():
    client = setup_client()

    response = client.post("/upload-video")

    assert response.status_code == 400
    assert response.get_json()["error"] == "No video uploaded"


def test_upload_with_empty_filename():
    client = setup_client()

    response = client.post(
        "/upload-video",
        data={"video": (io.BytesIO(b""), "")},
        content_type="multipart/form-data",
    )

    assert response.status_code == 400
    assert response.get_json()["error"] == "No video selected"


def test_upload_with_unsupported_extension():
    client = setup_client()

    response = client.post(
        "/upload-video",
        data={"video": (io.BytesIO(b"test"), "document.txt")},
        content_type="multipart/form-data",
    )

    assert response.status_code == 400
    assert response.get_json()["error"] == "Unsupported video format"


@patch("app.routes.upload.process_video")
@patch("app.routes.upload.process_uploaded_video")
def test_upload_accepts_mp4_extension(mock_upload, mock_process):
    client = setup_client()

    mock_upload.return_value = {"file_path": "fake_video.mp4"}
    mock_process.return_value = {
        "status": "success",
        "crowd_count": 10,
    }

    response = client.post(
        "/upload-video",
        data={"video": (io.BytesIO(b"fake video"), "sample.mp4")},
        content_type="multipart/form-data",
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["ai_result"]["status"] == "success"
    mock_upload.assert_called_once()
    mock_process.assert_called_once_with("fake_video.mp4")
