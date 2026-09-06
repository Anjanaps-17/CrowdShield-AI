def get_crowd_data(crowd_count=327):
    if crowd_count < 100:
        density = "Low"
    elif crowd_count < 250:
        density = "Medium"
    else:
        density = "High"

    return {
        "crowd_count": crowd_count,
        "density": density,
        "zone": "Zone A"
    }