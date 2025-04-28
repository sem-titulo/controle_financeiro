from typing import Optional
from pydantic import BaseModel
from datetime import date


class RecorrenteModel(BaseModel):
    descricao: str
    valor: float
    tipo: str  # Entrada ou Saída
    categoria: Optional[str] = None
    tag: Optional[str] = None
    dia: int  # Dia do mês para lançar (1-31)
    inicio: Optional[str] = None  # Data inicial opcional
    fim: Optional[str] = None  # Data final opcional


class RecorrenteAtualizacaoModel(BaseModel):
    descricao: Optional[str] = None
    valor: Optional[float] = None
    tipo: Optional[str] = None
    categoria: Optional[str] = None
    tag: Optional[str] = None
    dia: Optional[int] = None
    inicio: Optional[str] = None
    fim: Optional[str] = None
