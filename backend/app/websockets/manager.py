from typing import Dict, List
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        # role -> entity_id (e.g. user_id / driver_id) -> List[WebSocket]
        self.active_connections: Dict[str, Dict[str, List[WebSocket]]] = {
            "user": {},
            "driver": {},
        }

    async def connect(self, websocket: WebSocket, role: str, entity_id: str):
        await websocket.accept()

        role_connections = self.active_connections.setdefault(role, {})
        role_connections.setdefault(entity_id, []).append(websocket)

    def disconnect(self, websocket: WebSocket, role: str, entity_id: str):
        role_connections = self.active_connections.get(role, {})
        connections = role_connections.get(entity_id, [])

        if websocket in connections:
            connections.remove(websocket)

        if not connections:
            role_connections.pop(entity_id, None)

    async def send_personal_message(
        self, message: dict, role: str, entity_id: str
    ):
        connections = self.active_connections.get(role, {}).get(entity_id, [])
        for connection in connections:
            await connection.send_json(message)

    async def broadcast_to_role(self, message: dict, role: str):
        for connections in self.active_connections.get(role, {}).values():
            for connection in connections:
                await connection.send_json(message)

    # ============================
    # Phase 10.1.3 helper
    # ============================
    async def broadcast_new_ride(self, ride: dict):
        """
        Broadcast a newly created ride to all connected drivers.
        """
        await self.broadcast_to_role(
            {
                "event": "ride_created",
                "data": ride,
            },
            role="driver",
        )


manager = ConnectionManager()
