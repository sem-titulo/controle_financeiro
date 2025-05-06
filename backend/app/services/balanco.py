from datetime import datetime
from uuid import uuid4
from database.database import DBConnection
import pandas as pd
from typing import List
from app.models.balanco import BalancoModel


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

    def normalizar_categoria(self, c: str) -> str:
        return c.capitalize() if isinstance(c, str) else ""

    def extrair_nome_nubank(self, desc: str) -> str:
        if not isinstance(desc, str):
            return ""
        partes = desc.split("-")
        for p in partes:
            if any(nome in p.lower() for nome in ["daniel", "luan", "petruitis"]):
                return p.strip()
        if len(partes) > 1:
            return partes[1].strip()
        else:
            return partes[0].strip()

    def tratar_title_fatura_nubank(self, title: str) -> tuple:
        if not isinstance(title, str):
            return "", ""
        partes = title.split("-")
        fonte = (
            partes[0]
            .replace("*3", " ")
            .replace("Ebn*", "")
            .replace("Hotmart*", "")
            .replace("Htm*", "")
            .replace("Unicef*", "")
            .replace('"', "")
            .replace("*", " ")
            .strip()
            if partes
            else title
        )
        observacao = "-".join(partes[1:]).strip() if len(partes) > 1 else ""
        return fonte, observacao

    def processar_balanco_upload(
        self, df: pd.DataFrame, tipo_arquivo: str, mes: str, ano: int
    ) -> List[BalancoModel]:
        registros = []

        for _, row in df.iterrows():
            try:
                if tipo_arquivo == "extrato_inter":
                    if row.get("Histórico") == "Crédito Evento B3":
                        continue
                    desc = " ".join(str(row.get("Descrição", "")).split())

                    if desc in [
                        "Fatura cartão Inter",
                        "Petruitis",
                        "Luan Rodrigues Petruitis",
                    ]:
                        continue

                    valor_str = (
                        str(row.get("Valor", "0"))
                        .replace(".", "")
                        .replace(",", ".")
                        .replace("R$", "")
                        .strip()
                    )
                    valor = float(valor_str) if valor_str else 0.0
                    tipo = "Saída" if valor < 0 else "Entrada"

                    registros.append(
                        BalancoModel(
                            id=str(uuid4()),
                            fonte=str(row.get("Descrição", "")).strip(),
                            valor=abs(valor),
                            tipo=tipo,
                            mes=mes,
                            ano=ano,
                            tag="Inter PF",
                        )
                    )

                elif tipo_arquivo == "fatura_inter":
                    valor_str = (
                        str(row.get("Valor", "0"))
                        .replace("R$", "")
                        .replace("\xa0", "")
                        .replace(".", "")
                        .replace(",", ".")
                        .strip()
                    )
                    valor = float(valor_str) if valor_str else 0.0

                    registros.append(
                        BalancoModel(
                            id=str(uuid4()),
                            fonte=" ".join(row.get("Lançamento", "").split()),
                            valor=abs(valor),
                            tipo="Saída",
                            mes=mes,
                            ano=ano,
                            tag="Inter Cartão",
                            categoria=self.normalizar_categoria(
                                row.get("Categoria", "")
                            ),
                            observacao=str(row.get("Tipo", "")).strip(),
                        )
                    )

                elif tipo_arquivo == "extrato_nubank":
                    if "pagamento de fatura" in str(row.get("Descrição", "")).lower():
                        continue
                    if (
                        "luan rodrigues petruitis"
                        in str(row.get("Descrição", "")).lower()
                    ):
                        continue

                    valor = float(row.get("Valor", 0))
                    tipo = "Saída" if valor < 0 else "Entrada"

                    registros.append(
                        BalancoModel(
                            id=str(uuid4()),
                            fonte=self.extrair_nome_nubank(row.get("Descrição", "")),
                            valor=abs(valor),
                            tipo=tipo,
                            mes=mes,
                            ano=ano,
                            tag="Nubank PF",
                        )
                    )

                elif tipo_arquivo == "fatura_nubank":
                    valor = float(row.get("amount", 0))
                    if valor < 0:
                        continue
                    fonte, observacao = self.tratar_title_fatura_nubank(
                        row.get("title", "")
                    )
                    registros.append(
                        BalancoModel(
                            id=str(uuid4()),
                            fonte=fonte,
                            valor=abs(valor),
                            tipo="Saída",
                            mes=mes,
                            ano=ano,
                            tag="Nubank Cartão",
                            observacao=observacao,
                        )
                    )

            except Exception as err:
                print(err)
                continue

        return registros
