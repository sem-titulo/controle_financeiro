import jwt
import base64
from datetime import datetime, timezone, timedelta
from uuid import uuid4
from database.database import DBConnection
from utils.settings import SECRET_KEY_JWT


class UsuarioService:
    def __init__(self):
        self.db_connection = DBConnection()
        return

    def criar_usuario(self, data):
        data["id"] = str(uuid4())
        data["criado_em"] = datetime.now().isoformat()
        data["senha"] = base64.b64encode(bytes(data["senha"], "utf-8"))
        self.db_connection.insert_one("usuarios", data)
        return data

    def listar_usuarios(self, email):
        query = {}
        if email:
            query["email"] = email
        return self.db_connection.find("usuarios", query, {"_id": 0, "senha": 0})

    def listar_usuario(self, id):
        return self.db_connection.find_one(
            "usuarios", {"id": id}, {"_id": 0, "senha": 0}
        )

    def editar_usuario_put(self, id, data):
        if data.get("senha") == "" or not data.get("senha"):
            data.pop("senha")
        return self.db_connection.update_one("usuarios", {"id": id}, {"$set": data})

    def editar_usuario_patch(self, id, email):
        return self.db_connection.update_one(
            "usuarios", {"id": id}, {"$set": {"email": email}}
        )

    def deletar_usuario(self, id):
        return self.db_connection.delete_one("usuarios", {"id": id})

    def login(self, data):
        try:
            usuario = self.db_connection.find_one(
                "usuarios", {"email": data.email}, {"_id": 0}
            )
            senha = base64.b64decode(usuario["senha"]).decode("ascii")
            if senha == data.senha:
                usuario.pop("senha")

                data_token = {
                    "exp": datetime.now(tz=timezone.utc) + timedelta(days=1),
                    "user": usuario["email"],
                }

                token = jwt.encode(data_token, SECRET_KEY_JWT, algorithm="HS256")
                payload = {
                    "access": token,
                    "info": usuario,
                }
                return payload
            else:
                return False
        except Exception as e:
            print(e)
            return False

    def decodificar_token(self, decoded):
        email = decoded["user"]
        usuario = self.db_connection.find_one(
            "usuarios", {"email": email}, {"_id": 0, "senha": 0}
        )
        if usuario:
            return {"info": usuario}
        else:
            return False
