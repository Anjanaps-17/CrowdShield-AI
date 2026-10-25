import { useEffect, useRef, useState } from "react";
import styles from "./CCTV.module.css";

function CameraCard({ camera, onClick }) {
  const [videoSrc, setVideoSrc] = useState(camera.video || "");
  const [videoName, setVideoName] = useState("");
  const [videoError, setVideoError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const videoInputRef = useRef(null);
  const videoUrlRef = useRef(null);

  const riskLabel =
    camera.status === "critical"
      ? "HIGH"
      : camera.status === "warning"
      ? "MEDIUM"
      : "LOW";

  const handleVideoUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const isVideo =
      file.type.startsWith("video/") ||
      /\.(mp4|webm|ogg|mov|m4v)$/i.test(file.name);

    if (!isVideo) {
      setVideoError("Please select a valid video file.");
      event.target.value = "";
      return;
    }

    if (videoUrlRef.current) {
      URL.revokeObjectURL(videoUrlRef.current);
    }

    const videoUrl = URL.createObjectURL(file);

    videoUrlRef.current = videoUrl;

    setVideoSrc(videoUrl);
    setVideoName(file.name);
    setVideoError("");

    event.target.value = "";
  };

  useEffect(() => {
    return () => {
      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        className={`${styles.cameraCard} ${styles[camera.status]}`}
        onClick={onClick}
      >
        <div className={styles.videoArea}>
          <div className={styles.liveBadge}>
            <span></span>
            {videoName
              ? "DEMO VIDEO"
              : videoSrc
              ? "VIDEO READY"
              : "NO FEED"}
          </div>

          <div className={styles.cameraNumber}>
            {camera.name}
          </div>

          {videoSrc ? (
            <video
              className={styles.videoPlayer}
              src={videoSrc}
              controls
              playsInline
              preload="metadata"
              onClick={(event) => event.stopPropagation()}
              onError={() =>
                setVideoError(
                  "Video playback failed. Try another MP4 file."
                )
              }
            />
          ) : (
            <div className={styles.videoPlaceholder}>
              <div className={styles.cameraIcon}>▣</div>
              <span>CAMERA FEED</span>
              <small>UPLOAD A DEMO VIDEO</small>
            </div>
          )}

          <input
            ref={videoInputRef}
            type="file"
            accept="video/*,.mp4,.webm,.ogg,.mov,.m4v"
            className={styles.videoUploadInput}
            onChange={handleVideoUpload}
            onClick={(event) => event.stopPropagation()}
          />

          <div className={styles.videoActions}>
            <button
              type="button"
              className={styles.uploadVideoButton}
              onClick={(event) => {
                event.stopPropagation();
                videoInputRef.current?.click();
              }}
            >
              {videoSrc ? "Replace Video" : "Upload Video"}
            </button>
          </div>

          {videoError && (
            <div className={styles.videoError} role="alert">
              {videoError}
            </div>
          )}

          {/* Expand button */}
          <button
            type="button"
            className={styles.expandIcon}
            aria-label={`Expand ${camera.name}`}
            onClick={(event) => {
              event.stopPropagation();
              setIsExpanded(true);
            }}
          >
            ⛶
          </button>
        </div>

        <div className={styles.cameraInfo}>
          <div>
            <strong>{camera.location}</strong>
            <span>{camera.name}</span>

            {videoName && (
              <span className={styles.videoFileName}>
                {videoName}
              </span>
            )}
          </div>

          <div className={styles.cameraStatus}>
            <span className={styles.statusDot}></span>

            <div>
              <strong>{riskLabel}</strong>
              <span>
                {camera.people.toLocaleString()} people
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded camera view */}
      {isExpanded && (
        <div
          className={styles.expandedOverlay}
          onClick={() => setIsExpanded(false)}
        >
          <div
            className={styles.expandedCard}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.expandedHeader}>
              <div>
                <strong>{camera.name}</strong>
                <span>{camera.location}</span>
              </div>

              <button
                type="button"
                className={styles.expandedCloseButton}
                aria-label="Close expanded camera"
                onClick={() => setIsExpanded(false)}
              >
                ×
              </button>
            </div>

            {videoSrc ? (
              <video
                className={styles.expandedVideo}
                src={videoSrc}
                controls
                playsInline
                preload="metadata"
              />
            ) : (
              <div className={styles.expandedPlaceholder}>
                <div className={styles.cameraIcon}>▣</div>
                <span>No video uploaded</span>
                <small>
                  Upload a demo video from this camera card.
                </small>
              </div>
            )}

            <div className={styles.expandedInfo}>
              <span>
                Risk: <strong>{riskLabel}</strong>
              </span>

              <span>
                Crowd count:{" "}
                <strong>
                  {camera.people.toLocaleString()}
                </strong>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CameraCard;