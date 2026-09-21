import { useEffect, useState } from "react";
import cameras from "../data/cameras";
import { getCameras } from "../services/api";

function useCamera() {
    const [cameraData, setCameraData] = useState(cameras);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCameras() {
            const data = await getCameras();

            if (data) {
                setCameraData(data);
            }

            setLoading(false);
        }

        loadCameras();
    }, []);

    return {
        cameras: cameraData,
        loading,
    };
}

export default useCamera;