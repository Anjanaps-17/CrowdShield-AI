
import io
from unittest.mock import patch

from werkzeug.datastructures import FileStorage

from app import create_app
from app.services.upload_service import process_uploaded_video


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


def test_upload_service_rejects_invalid_filename():
    video = FileStorage(
        stream=io.BytesIO(b"fake video"),
        filename="",
    )

    try:
        process_uploaded_video(video)
        assert False, "Expected ValueError for invalid filename"
    except ValueError as error:
        assert str(error) == "Invalid filename"


def test_upload_service_rejects_unsupported_extension():
    video = FileStorage(
        stream=io.BytesIO(b"not a video"),
        filename="document.txt",
    )

    try:
        process_uploaded_video(video)
        assert False, "Expected ValueError for unsupported extension"
    except ValueError as error:
        assert str(error) == "Unsupported video format"


@patch("app.services.upload_service.uuid4")
def test_upload_service_uses_generated_filename(mock_uuid, tmp_path):
    mock_uuid.return_value.hex = "abc123"

    video = FileStorage(
        stream=io.BytesIO(b"fake video"),
        filename="../../sample.mp4",
    )

    with patch(
        "app.services.upload_service.UPLOAD_FOLDER",
        str(tmp_path),
    ):
        result = process_uploaded_video(video)

    assert result["filename"] == "abc123.mp4"
    assert result["original_filename"] == "sample.mp4"
    assert result["file_path"] == str(tmp_path / "abc123.mp4")
    assert (tmp_path / "abc123.mp4").exists()


def test_oversized_request_returns_json_error():
    app = create_app()
    app.config["TESTING"] = True
    app.config["MAX_CONTENT_LENGTH"] = 100

    client = app.test_client()

    response = client.post(
        "/upload-video",
        data={"video": (io.BytesIO(b"x" * 200), "sample.mp4")},
        content_type="multipart/form-data",
    )

    assert response.status_code == 413
    assert response.is_json
    assert response.get_json()["error"] == (
        "Uploaded request exceeds the configured limit of 100 bytes"
    )
