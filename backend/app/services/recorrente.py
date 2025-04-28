from database.database import DBConnection
from uuid import uuid4


class RecorrenteService:
    def __init__(self):
        self.db = DBConnection()

    def criar_recorrente(self, data: dict, usuario: dict):
        data["id"] = str(uuid4())
        data["usuario_id"] = usuario.get("info", {}).get("id")
        return self.db.insert_one("transacoes_recorrentes", data)

    def editar_recorrente(self, id: str, data: dict, usuario: dict):
        filtro = {"id": id, "usuario_id": usuario.get("info", {}).get("id")}
        return self.db.update_one("transacoes_recorrentes", filtro, {"$set": data})

    def deletar_recorrente(self, id: str, usuario: dict):
        filtro = {"id": id, "usuario_id": usuario.get("info", {}).get("id")}
        return self.db.delete_one("transacoes_recorrentes", filtro)

    def listar_recorrentes(self, usuario: dict):
        filtro = {"usuario_id": usuario.get("info", {}).get("id")}
        return self.db.find("transacoes_recorrentes", filtro, {"_id": 0})

    def buscar_recorrente(self, id: str, usuario: dict):
        filtro = {"id": id, "usuario_id": usuario.get("info", {}).get("id")}
        return self.db.find_one("transacoes_recorrentes", filtro, {"_id": 0})
