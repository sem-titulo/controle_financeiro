from typing import Literal, Optional
from pydantic import BaseModel


class BalancoModel(BaseModel):
    fonte: str
    valor: float
    mes: Literal[
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ]
    observacao: Optional[str] = None
    tipo: Optional[Literal["Entrada", "Saída"]] = None
    ano: Optional[int] = None
    tag: Optional[
        Literal[
            "Inter PF", "Inter PJ", "Inter Cartão", "Nubank Cartão", "Nubank PF", "Caju"
        ]
    ] = None
    categoria: Optional[
        Literal[
            "Alimentação",
            "Transporte",
            "Moradia",
            "Educação",
            "Saúde",
            "Lazer",
            "Investimentos",
            "Roupas",
            "Viagem",
            "Assinaturas",
            "Impostos",
            "Doações",
            "Pets",
            "Serviços",
            "Salário",
            "Freelance",
            "Venda",
            "Outros",
        ]
    ] = None


class BalancoAtualizacaoModel(BaseModel):
    fonte: Optional[str] = None
    valor: Optional[float] = None
    mes: Optional[str] = None
    observacao: Optional[str] = None
    tipo: Optional[str] = None
    ano: Optional[int] = None
    tag: Optional[str] = None
    categoria: Optional[str] = None
