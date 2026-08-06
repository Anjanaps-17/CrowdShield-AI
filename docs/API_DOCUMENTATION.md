# CrowdShield AI - API Documentation

## Project Overview

This document describes the REST APIs developed for the CrowdShield AI backend.

---

# API List

| Method | Endpoint | Description | Status |
|---------|----------|-------------|--------|
| GET | /health | Check backend status | ✅ Completed |
| GET | /crowd-density | Retrieve crowd density information | ✅ Completed |
| GET | /risk-level | Retrieve crowd risk level | ✅ Completed |
| GET | /alerts | Retrieve emergency alerts | ✅ Completed |
| GET | /evacuation-route | Retrieve recommended evacuation route | ✅ Completed |
| POST | /upload-video | Upload CCTV video for processing | ✅ Completed |

---

# API Details

## 1. GET /health

### Description
Checks whether the backend server is running.

### Response

```json
{
    "status": "healthy",
    "service": "CrowdShield AI Backend"
}
```

---

## 2. GET /crowd-density

### Description
Returns the current crowd density information.

### Response

```json
{
    "crowd_count": 327,
    "density": "High",
    "zone": "Zone A"
}
```

---

## 3. GET /risk-level

### Description
Returns the predicted crowd risk level.

### Response

```json
{
    "risk_level": "Medium",
    "confidence": 87,
    "reason": "Moderate crowd density detected"
}
```

---

## 4. GET /alerts

### Description
Returns emergency alert information.

### Response

```json
{
    "alert": "High crowd congestion detected",
    "priority": "High",
    "zone": "Zone A"
}
```

---

## 5. GET /evacuation-route

### Description
Returns the recommended evacuation route.

### Response

```json
{
    "route": "Gate 2",
    "estimated_time": "3 minutes",
    "status": "Safe"
}
```

---

## 6. POST /upload-video

### Description
Uploads a CCTV video to the backend for processing.

### Request

**Method:** POST

**Body:** form-data

| Key | Type | Required |
|-----|------|----------|
| video | File | Yes |

### Response

```json
{
    "message": "Video uploaded successfully.",
    "filename": "sample.mp4",
    "status": "Processing"
}
```