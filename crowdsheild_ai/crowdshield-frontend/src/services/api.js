const API_BASE_URL = "http://localhost:5000/api";

export async function getCameras() {
    try {
        const response = await fetch(`${API_BASE_URL}/cameras`);

        if (!response.ok) {
            throw new Error("Failed to fetch camera data");
        }

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
}