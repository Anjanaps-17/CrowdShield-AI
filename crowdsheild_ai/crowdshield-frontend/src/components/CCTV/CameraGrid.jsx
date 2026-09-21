import { useState } from "react";
import cameras from "../../data/cameras";
import CameraCard from "./CameraCard";
import styles from "./CCTV.module.css";

function CameraGrid() {
  const [selectedCamera, setSelectedCamera] =
    useState(null);

  return (
    <>
      <div className={styles.cameraGrid}>
        {cameras.map((camera) => (
          <CameraCard
            key={camera.id}
            camera={camera}
            onSelect={setSelectedCamera}
          />
        ))}
      </div>

      {selectedCamera && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedCamera(null)}
        >
          <div
            className={styles.modal}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.modalLabel}>
                  LIVE SURVEILLANCE
                </span>

                <h2>
                  {selectedCamera.location}
                </h2>

                <p>{selectedCamera.name}</p>
              </div>

              <button
                className={styles.closeButton}
                onClick={() =>
                  setSelectedCamera(null)
                }
              >
                ×
              </button>
            </div>

            <div className={styles.largeFeed}>
              {selectedCamera.video ? (
                <video
                  src={selectedCamera.video}
                  autoPlay
                  muted
                  loop
                  controls
                  playsInline
                />
              ) : (
                <div
                  className={
                    styles.largePlaceholder
                  }
                >
                  <div className={styles.largeCameraIcon}>
                    ▣
                  </div>

                  <strong>
                    LIVE CCTV FEED
                  </strong>

                  <span>
                    {selectedCamera.name} ·{" "}
                    {selectedCamera.location}
                  </span>

                  <small>
                    Connect your CCTV video to display
                    the live feed here.
                  </small>
                </div>
              )}

              <div className={styles.modalLive}>
                <span></span>
                LIVE
              </div>
            </div>

            <div className={styles.modalStats}>
              <div>
                <span>CURRENT CROWD</span>
                <strong>
                  {selectedCamera.people.toLocaleString()}
                </strong>
              </div>

              <div>
                <span>CAMERA STATUS</span>
                <strong>ONLINE</strong>
              </div>

              <div>
                <span>AI MONITORING</span>
                <strong>ACTIVE</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CameraGrid;