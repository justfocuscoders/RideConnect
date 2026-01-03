ALLOWED_STATUS_TRANSITIONS = {
    "requested": ["accepted", "cancelled"],
    "accepted": ["in_progress", "cancelled"],
    "in_progress": ["completed"],
    "completed": [],
    "cancelled": []
}
