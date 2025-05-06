from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from pydantic import ValidationError
import pandas as pd
from io import StringIO
from datetime import datetime
from app.services.balanco import BalancoService
from app.services.usuario import UsuarioService
from utils.validador_rota import validador_rota

router = APIRouter(tags=["Upload Balanço"])

MAPPING_MESES = {
    "January": "Janeiro",
    "February": "Fevereiro",
    "March": "Março",
    "April": "Abril",
    "May": "Maio",
    "June": "Junho",
    "July": "Julho",
    "August": "Agosto",
    "September": "Setembro",
    "October": "Outubro",
    "November": "Novembro",
    "December": "Dezembro",
}

balanco_service = BalancoService()
usuario_service = UsuarioService()


def parse_csv(content: bytes, tipo: str):
    df = pd.read_csv(StringIO(content.decode("utf-8")))
    registros = []

    for _, row in df.iterrows():
        fonte = row.get("Source")
        if pd.isna(fonte):
            continue

        mes_str = str(row.get("Month", "")).split(" ")[0]
        mes = MAPPING_MESES.get(mes_str)
        if not mes:
            continue

        try:
            valor_str = str(row.get("Amount", "0")).replace("R$", "").replace(",", "")
            valor = float(valor_str)
        except ValueError:
            continue

        registros.append(
            {
                "fonte": fonte,
                "valor": valor,
                "tipo": tipo,
                "mes": mes,
                "ano": 2025,
                "tag": "" if pd.isna(row.get("Tags")) else row.get("Tags"),
                "observacao": "" if pd.isna(row.get("Obs")) else row.get("Obs"),
            }
        )
    return registros


@router.post("/upload-financeiro")
def upload_balanco(
    income_file: UploadFile = File(...),
    expenses_file: UploadFile = File(...),
    current_user=Depends(validador_rota),
):
    usuario = usuario_service.decodificar_token(current_user)

    try:
        income_content = income_file.file.read()
        expenses_content = expenses_file.file.read()

        entradas = parse_csv(income_content, tipo="Entrada")
        saidas = parse_csv(expenses_content, tipo="Saída")

        total = 0
        for registro in entradas + saidas:
            try:
                balanco_service.criar_balanco(registro, usuario)
                total += 1
            except ValidationError:
                continue

        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"mensagem": f"{total} registros criados com sucesso."},
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
