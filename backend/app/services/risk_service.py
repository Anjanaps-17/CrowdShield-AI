def get_risk_level(density="Medium"):
    if density == "Low":
        risk_level = "Low"
        confidence = 90
        reason = "Low crowd density detected"

    elif density == "Medium":
        risk_level = "Medium"
        confidence = 87
        reason = "Moderate crowd density detected"

    else:
        risk_level = "High"
        confidence = 92
        reason = "High crowd density detected"

    return {
        "risk_level": risk_level,
        "confidence": confidence,
        "reason": reason
    }