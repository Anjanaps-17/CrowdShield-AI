# CrowdShield AI - API Documentation

## Project Overview

This document describes the REST APIs developed for the CrowdShield AI backend.

---

# API List

| Method | Endpoint | Description | Status |
|---------|----------|-------------|--------|
| GET | /health | Check backend status | ✅ Completed |
| GET | /crowd-density | Retrieve crowd density information | ✅ Completed |
| GET | /risk-level | Retrieve crowd risk level | ⏳ Planned |
| GET | /alerts | Retrieve emergency alerts | ⏳ Planned |
| GET | /evacuation-route | Retrieve evacuation route | ⏳ Planned |
| POST | /upload-video | Upload CCTV video for analysis | ⏳ Planned |

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

Returns the current crowd density detected in a monitored area.

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

**Status:** Planned

---

## 4. GET /alerts

**Status:** Planned

---

## 5. GET /evacuation-route

**Status:** Planned

---

## 6. POST /upload-video

**Status:** Planned