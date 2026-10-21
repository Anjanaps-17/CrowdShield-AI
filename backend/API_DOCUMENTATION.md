# CrowdShield AI — Backend API Documentation

## Base URL

Local development: `http://127.0.0.1:5000`

## Endpoints

### 1. Welcome

- **Method:** GET
- **Endpoint:** `/`
- **Purpose:** Returns a welcome message.

Example response:

```json
{
  "message": "Welcome to CrowdShield AI Backend!"
}
```

### 2. Health Check

- **Method:** GET
- **Endpoint:** `/health`
- **Purpose:** Checks whether the backend is responding.

Example response:

```json
{
  "status": "healthy",
  "service": "CrowdShield AI Backend"
}
```

### 3. Crowd Density

- **Method:** GET
- **Endpoint:** `/crowd-density`
- **Purpose:** Returns crowd count, density, and zone.
- **Current implementation:** The route passes a fixed count of 180 to the crowd service.

Example response:

```json
{
  "crowd_count": 180,
  "density": "Medium",
  "zone": "Zone A"
}
```

Density rules:
- Below 100: Low
- 100–249: Medium
- 250 or above: High

### 4. Risk Level

- **Method:** GET
- **Endpoint:** `/risk-level`
- **Purpose:** Returns risk classification, confidence value, and reason.
- **Current implementation:** The route passes the fixed value `Medium` to rule-based logic. The confidence value is configured, not a calibrated AI confidence score.

Example response:

```json
{
  "risk_level": "Medium",
  "confidence": 87,
  "reason": "Moderate crowd density detected"
}
```

### 5. Alerts

- **Method:** GET
- **Endpoint:** `/alerts`
- **Purpose:** Returns alert information.
- **Current implementation:** The alert service returns a hardcoded example alert.

Example response:

```json
{
  "alert": "High crowd congestion detected",
  "priority": "High",
  "zone": "Zone A"
}
```

### 6. Evacuation Route

- **Method:** GET
- **Endpoint:** `/evacuation-route`
- **Purpose:** Calculates a shortest travel-time route to a reachable exit.
- **Algorithm:** Dijkstra's shortest-path algorithm.
- **Current implementation:** Uses a sample map with illustrative travel times. It is not validated for real emergency use.

Example response:

```json
{
  "status": "route_found",
  "route": "Gate 1",
  "path": [
    "Zone A",
    "Corridor 1",
    "Junction",
    "Gate 1"
  ],
  "estimated_time_minutes": 7,
  "estimated_time": "7 minutes",
  "message": "Shortest travel-time route on the sample map. Actual exit safety has not been verified."
}
```

### 7. Upload and Process Video

- **Method:** POST
- **Endpoint:** `/upload-video`
- **Content-Type:** `multipart/form-data`
- **Required form field:** `video`
- **Allowed filename extensions:** `.mp4`, `.avi`, `.mov`

Example request:

```bash
curl -X POST http://127.0.0.1:5000/upload-video -F "video=@crowd_sample.mp4"
```

The backend saves the uploaded video and invokes the YOLO-based video-processing service. It processes every third frame and returns detections from the last sampled frame.

The success response includes the upload result and an `ai_result` object. Counts, frame totals, and bounding boxes depend on the uploaded video and model output.

Possible validation errors:

| HTTP status | Error |
|---|---|
| 400 | `No video uploaded` |
| 400 | `No video selected` |
| 400 | `Unsupported video format` |

The processing service may also return an error if the file is missing, cannot be opened, or has no processable frames.

## Implementation Notes

- Crowd-density data currently uses a fixed input.
- Risk classification uses rule-based logic with a fixed input.
- Alerts are currently hardcoded.
- Evacuation routing uses an illustrative sample map.
- Video upload invokes the YOLO-based detection pipeline.
- These endpoints are not yet validated as real-world crowd-safety assessments.

## Testing

Run the backend tests from the backend directory:

```bash
python -m pytest -v
```
