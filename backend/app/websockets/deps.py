from fastapi import WebSocket, status
from app.core.security import decode_access_token


async def get_ws_user(websocket: WebSocket):
    token = websocket.query_params.get("token")

    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return None

    payload = decode_access_token(token)
    if not payload:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return None

    role = payload.get("role")
    entity_id = payload.get("sub")  # ✅ KEEP AS STRING (email)

    if role not in ("user", "driver") or not entity_id:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return None

    return {
        "role": role,
        "entity_id": entity_id,  # ✅ string-safe
    }
