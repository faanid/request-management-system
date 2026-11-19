import json
from urllib.error import HTTPError
from urllib.parse import quote
from urllib.request import Request, urlopen

BASE_URL = "http://127.0.0.1:8000"


def send(method, path, payload=None, headers=None):
    body = json.dumps(payload).encode("utf-8") if payload is not None else None
    request_headers = {"Content-Type": "application/json"}
    if headers:
        request_headers.update(headers)
    request = Request(f"{BASE_URL}{path}", data=body, headers=request_headers, method=method)
    try:
        with urlopen(request, timeout=5) as response:
            return response.status, json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        return error.code, json.loads(error.read().decode("utf-8"))


health_status, health = send("GET", "/api/health")
assert health_status == 200 and health == {"ok": True}

stats_status, stats = send("GET", "/api/stats")
assert stats_status == 200 and stats["total"] == 16

list_status, listing = send("GET", "/api/requests?page=1&page_size=5")
assert list_status == 200
assert len(listing["items"]) == 5
assert listing["total"] == 16

search_status, search = send("GET", f"/api/requests?q={quote('دسترسی')}")
assert search_status == 200
assert search["total"] > 0

details_status, details = send("GET", "/api/requests/1")
assert details_status == 200
assert details["id"] == 1

create_status, created = send("POST", "/api/requests", {
    "title": "Smoke test request",
    "description": "A request created by the API smoke test.",
    "requester": "CI Runner",
    "priority": "medium"
})
assert create_status == 201
assert created["version"] == 1

update_status, updated = send("PATCH", f"/api/requests/{created['id']}", {
    "status": "in_progress",
    "expected_version": 1
})
assert update_status == 200
assert updated["status"] == "in_progress"
assert updated["version"] == 2

conflict_status, conflict = send("PATCH", f"/api/requests/{created['id']}", {
    "status": "completed",
    "expected_version": 1
})
assert conflict_status == 409
assert conflict["detail"]["code"] == "version_conflict"

failure_status, failure = send(
    "PATCH",
    f"/api/requests/{created['id']}",
    {"status": "completed", "expected_version": 2},
    {"X-Mock-Fail": "1"}
)
assert failure_status == 503
assert failure["detail"]["code"] == "simulated_failure"

validation_status, validation = send("POST", "/api/requests", {
    "title": "x",
    "description": "short",
    "requester": "CI",
    "priority": "medium"
})
assert validation_status == 422

final_status, final_record = send("GET", f"/api/requests/{created['id']}")
assert final_status == 200
assert final_record["status"] == "in_progress"
assert final_record["version"] == 2

print("Mock API smoke tests passed.")
