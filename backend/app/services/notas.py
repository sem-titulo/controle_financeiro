from datetime import datetime, timezone, timedelta
from uuid import uuid4
from database.database import DBConnection


class NotasService:
    def __init__(self):
        self.db_connection = DBConnection()
        return

    def criar_nota(self, data, usuario):
        data["id"] = str(uuid4())
        data["criado_em"] = datetime.now().isoformat()
        data["entregue_em"] = ""
        data["usuario_id"] = usuario.get("info", {}).get("id", "")
        self.db_connection.insert_one("notas", data)
        return data

    def editar_nota(self, id, data, usuario):
        if data["status"] == "Concluído":
            data["entregue_em"] = datetime.now().isoformat()

        return self.db_connection.update_one(
            "notas",
            {"id": id, "usuario_id": usuario.get("info", {}).get("id")},
            {"$set": data},
        )
