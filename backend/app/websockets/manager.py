from typing import Dict, List
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        # role -> entity_id (str, e.g. email) -> List[WebSocket]
        self.active_connections: Dict[str, Dict[str, List[WebSocket]]] = {
            "user": {},
            "driver": {},
        }

    async def connect(self, websocket: WebSocket, role: str, entity_id: str):
        await websocket.accept()

        if entity_id not in self.active_connections[role]:
            self.active_connections[role][entity_id] = []

        self.active_connections[role][entity_id].append(websocket)

    def disconnect(self, websocket: WebSocket, role: str, entity_id: str):
        connections = self.active_connections.get(role, {}).get(entity_id, [])

        if websocket in connections:
            connections.remove(websocket)

        if not connections:
            self.active_connections[role].pop(entity_id, None)

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


manager = ConnectionManager()
