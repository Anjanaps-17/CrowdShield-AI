
import { useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import styles from "./CCTV.module.css";

// Reusable player for demo videos and HLS streams.
function CameraVideo({ src, className, onClick }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [nativeHlsSupported, setNativeHlsSupported] = useState(false);

  const setVideoRef = useCallback((video) => {
    videoRef.current = video;
    setNativeHlsSupported(
      Boolean(video?.canPlayType("application/vnd.apple.mpegurl"))
    );
  }, []);

  const [playbackError, setPlaybackError] = useState({
    src: "",
    message: "",
  });

  

  const isHlsSource = /\.m3u8(?:$|[?#])/i.test(src || "");

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !src) return;

    const isHls = /\.m3u8(?:$|[?#])/i.test(src);

    // Ordinary demo videos, such as MP4 and WebM.
    if (!isHls) {
      video.src = src;

      return () => {
        video.removeAttribute("src");
        video.load();
      };
    }

    // Native HLS support, available in some browsers.
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;

      return () => {
        video.removeAttribute("src");
        video.load();
      };
    }

    // HLS playback through hls.js.
    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setPlaybackError({
            src,
            message:
              "HLS playback failed. Check the stream URL and server.",
          });

          hls.destroy();

          if (hlsRef.current === hls) {
            hlsRef.current = null;
          }
        }
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      return () => {
        hls.destroy();

        if (hlsRef.current === hls) {
          hlsRef.current = null;
        }

        video.removeAttribute("src");
        video.load();
      };
    }

    // No synchronous state update inside this effect.
    return undefined;
  }, [src]);

  const hlsJsSupported = Hls.isSupported();

  const handleVideoError = () => {
    setPlaybackError({
      src,
      message: "Video playback failed. Check the video or stream URL.",
    });
  };

  const showUnsupportedMessage =
    isHlsSource &&
    !nativeHlsSupported &&
    !hlsJsSupported;

  return (
    <>
      <video
        ref={setVideoRef}
        className={className}
        controls
        playsInline
        preload="metadata"
        onClick={onClick}
        onError={handleVideoError}
      />

      {playbackError.src === src && playbackError.message && (
        <div className={styles.videoError} role="alert">
          {playbackError.message}
        </div>
      )}

      {showUnsupportedMessage && (
        <div className={styles.videoError} role="alert">
          This browser does not support HLS playback.
        </div>
      )}
    </>
  );
}

function CameraCard({ camera, onClick }) {
  const [videoSrc, setVideoSrc] = useState(camera.video || "");
  const [videoName, setVideoName] = useState("");
  const [videoError, setVideoError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const videoInputRef = useRef(null);
  const videoUrlRef = useRef(null);

  // Identify the logged-in user's role.
  const currentUser = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("crowdshieldUser") || "null"
      );
    } catch {
      return null;
    }
  })();

  const isController =
    currentUser?.role?.toLowerCase() === "controller";

  const riskLabel =
    camera.status === "critical"
      ? "HIGH"
      : camera.status === "warning"
      ? "MEDIUM"
      : "LOW";

  // Uploaded demo videos take priority over the optional HLS stream.
  const playbackSrc = videoSrc || camera.hlsUrl || "";

  const handleVideoUpload = (event) => {
    if (!isController) {
      setVideoError("Only controllers can upload videos.");
      event.target.value = "";
      return;
    }

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

  // Release uploaded video URLs when the component unmounts.
  useEffect(() => {
    return () => {
      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
      }
    };
  }, []);

  const feedLabel = videoName
    ? "DEMO VIDEO"
    : videoSrc
    ? "VIDEO READY"
    : camera.hlsUrl
    ? "HLS STREAM"
    : "NO FEED";

  return (
    <>
      <div
        className={`${styles.cameraCard} ${styles[camera.status]}`}
        onClick={onClick}
      >
        <div className={styles.videoArea}>
          <div className={styles.liveBadge}>
            <span></span>
            {feedLabel}
          </div>

          <div className={styles.cameraNumber}>
            {camera.name}
          </div>

          {playbackSrc ? (
            <CameraVideo
              src={playbackSrc}
              className={styles.videoPlayer}
              onClick={(event) => event.stopPropagation()}
            />
          ) : (
            <div className={styles.videoPlaceholder}>
              <div className={styles.cameraIcon}>▣</div>
              <span>CAMERA FEED</span>
              <small>
                {isController
                  ? "UPLOAD A DEMO VIDEO"
                  : "NO VIDEO AVAILABLE"}
              </small>
            </div>
          )}

          {/* Only controllers can see the upload controls. */}
          {isController && (
            <>
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
            </>
          )}

          {videoError && (
            <div className={styles.videoError} role="alert">
              {videoError}
            </div>
          )}

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

            {playbackSrc ? (
              <CameraVideo
                src={playbackSrc}
                className={styles.expandedVideo}
              />
            ) : (
              <div className={styles.expandedPlaceholder}>
                <div className={styles.cameraIcon}>▣</div>
                <span>No video available</span>
                <small>
                  {isController
                    ? "Upload a demo video from the camera card."
                    : "A camera feed has not been provided."}
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
