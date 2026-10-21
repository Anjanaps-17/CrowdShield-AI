from app.services.evacuation_service import (
    BUILDING_MAP,
    EXITS,
    find_shortest_path,
    get_evacuation_route,
)


def test_evacuation_route_finds_exit():
    result = get_evacuation_route()

    assert result["status"] == "route_found"
    assert result["route"] in EXITS
    assert result["path"][0] == "Zone A"
    assert result["path"][-1] == result["route"]


def test_evacuation_route_has_expected_travel_time():
    result = get_evacuation_route()

    assert result["estimated_time_minutes"] == 7
    assert result["estimated_time"] == "7 minutes"


def test_unknown_start_location():
    result = get_evacuation_route("Unknown Zone")

    assert result["status"] == "error"
    assert result["route"] is None


def test_no_reachable_exit():
    graph = {
        "Zone A": {"Corridor": 2},
        "Corridor": {"Zone A": 2},
        "Gate 1": {},
    }

    path, travel_time = find_shortest_path(
        graph, "Zone A", {"Gate 1"}
    )

    assert path is None
    assert travel_time is None


def test_shortest_path_is_selected():
    path, travel_time = find_shortest_path(
        BUILDING_MAP, "Zone A", EXITS
    )

    assert path == [
        "Zone A",
        "Corridor 1",
        "Junction",
        "Gate 1",
    ]
    assert travel_time == 7
