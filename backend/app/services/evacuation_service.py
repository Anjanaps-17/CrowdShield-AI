
import heapq


# Sample building map.
# Each connection has a travel time in minutes.
# These values are illustrative, not real building measurements.
BUILDING_MAP = {
    "Zone A": {
        "Corridor 1": 2,
        "Corridor 2": 4,
    },
    "Corridor 1": {
        "Zone A": 2,
        "Junction": 3,
    },
    "Corridor 2": {
        "Zone A": 4,
        "Junction": 2,
        "Gate 2": 3,
    },
    "Junction": {
        "Corridor 1": 3,
        "Corridor 2": 2,
        "Gate 1": 2,
    },
    "Gate 1": {
        "Junction": 2,
    },
    "Gate 2": {
        "Corridor 2": 3,
    },
}

# Exits available in the sample map.
EXITS = {"Gate 1", "Gate 2"}


def find_shortest_path(graph, start, exits):
    """Find the lowest-travel-time path to a reachable exit."""
    if start not in graph:
        return None, None

    queue = [(0, start, [start])]
    best_time = {start: 0}

    while queue:
        travel_time, current, path = heapq.heappop(queue)

        if travel_time > best_time.get(current, float("inf")):
            continue

        if current in exits:
            return path, travel_time

        for neighbor, minutes in graph[current].items():
            new_time = travel_time + minutes

            if new_time < best_time.get(neighbor, float("inf")):
                best_time[neighbor] = new_time
                heapq.heappush(
                    queue,
                    (new_time, neighbor, path + [neighbor])
                )

    return None, None


def get_evacuation_route(start="Zone A"):
    """Return a sample-map route recommendation."""
    path, estimated_minutes = find_shortest_path(
        BUILDING_MAP,
        start,
        EXITS
    )

    if path is None:
        return {
            "status": "error",
            "message": f"No route found from {start}",
            "route": None,
            "path": [],
            "estimated_time_minutes": None,
        }

    return {
        "status": "route_found",
        "route": path[-1],
        "path": path,
        "estimated_time_minutes": estimated_minutes,
        "estimated_time": f"{estimated_minutes} minutes",
        "message": (
            "Shortest travel-time route on the sample map. "
            "Actual exit safety has not been verified."
        ),
    }
