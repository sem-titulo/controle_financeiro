from datetime import datetime
from uuid import uuid4
from database.database import DBConnection


class BalancoService:
    def __init__(self):
        self.db_connection = DBConnection()

    def criar_balanco(self, data, usuario):
        data["id"] = str(uuid4())
        data["criado_em"] = datetime.now().isoformat()
        data["usuario_id"] = usuario.get("info", {}).get("id", "")

        if "ano" not in data or data["ano"] in [None, 0]:
            data["ano"] = datetime.now().year

        self.db_connection.insert_one("balanco", data)
        return data

    def editar_balanco(self, id, data, usuario):
        return self.db_connection.update_one(
            "balanco",
            {"id": id, "usuario_id": usuario.get("info", {}).get("id")},
            {"$set": data},
        )
