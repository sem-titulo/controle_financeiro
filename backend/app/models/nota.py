from typing import Literal
from pydantic import BaseModel


class NotaModel(BaseModel):
    titulo: str
    descricao: str
    status: Literal["Pendente", "Em Andamento", "Concluído"]


class NotaAtualizacaoModel(BaseModel):
    titulo: str
    descricao: str
    status: Literal["Pendente", "Em Andamento", "Concluído"]
