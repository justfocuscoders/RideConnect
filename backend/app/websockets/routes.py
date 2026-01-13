from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websockets.manager import manager
from app.websockets.deps import get_ws_user

router = APIRouter()


@router.websocket("/ws/dashboard")
async def dashboard_ws(websocket: WebSocket):
    auth = await get_ws_user(websocket)
    if not auth:
        return

    role = auth["role"]
    entity_id = auth["entity_id"]

    await manager.connect(websocket, role, entity_id)

    try:
        while True:
            # Passive mode: keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, role, entity_id)
