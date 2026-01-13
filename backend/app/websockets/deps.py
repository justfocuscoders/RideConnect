from fastapi import WebSocket, status
from app.core.security import decode_access_token


async def get_ws_user(websocket: WebSocket):
    token = websocket.query_params.get("token")

    if not token:
        return None

    payload = decode_access_token(token)
    if not payload:
        return None

    role = payload.get("role")

    if role == "driver":
        # ✅ Drivers MUST use driver_id
        entity_id = payload.get("driver_id")
    else:
        # ✅ Users use user_id / sub
        entity_id = payload.get("sub")

    if role not in ("user", "driver") or not entity_id:
        return None

    return {
        "role": role,
        "entity_id": str(entity_id),  # always string-safe
    }
