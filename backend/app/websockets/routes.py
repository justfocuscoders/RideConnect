from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.websockets.manager import manager
from app.websockets.deps import get_ws_user

router = APIRouter()

@router.websocket("/ws/dashboard")
async def dashboard_ws(websocket: WebSocket):
    auth = await get_ws_user(websocket)
    if not auth:
        return

    await manager.connect(
        websocket,
        auth["role"],
        auth["entity_id"],
    )

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, auth["role"], auth["entity_id"])
