from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    status,
    HTTPException,
    Query,
)
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import math
from database.database import DBConnection
from app.services.usuario import UsuarioService
from app.services.balanco import BalancoService
from utils.validador_rota import validador_rota
from models.balanco import BalancoModel, BalancoAtualizacaoModel

from typing import Literal, List
from uuid import uuid4
from datetime import datetime
import pandas as pd
import io

from app.models.balanco import BalancoModel


router = APIRouter(
    prefix="/balance", tags=["Balanço"], dependencies=[Depends(validador_rota)]
)

db_connection = DBConnection()
usuario_service = UsuarioService()
balanco_service = BalancoService()


@router.post("/")
def criar_balanco(data: BalancoModel, current_user=Depends(validador_rota)):
    usuario = usuario_service.decodificar_token(current_user)
    balanco = balanco_service.criar_balanco(data.dict(), usuario)

    if not balanco:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": "Registro de balanço não criado!"},
        )
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "mensagem": "Balanço criado com sucesso",
            "id": str(balanco.get("id")),
        },
    )


@router.get("/resumo_mensal")
def resumo_mensal(ano: int, current_user=Depends(validador_rota)):
    usuario = usuario_service.decodificar_token(current_user)
    filtros = {"usuario_id": usuario.get("info", {}).get("id"), "ano": ano}
    registros = db_connection.find("balanco", filtros, {"_id": 0})

    meses_do_ano = [
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

    resumo = {
        mes: {"entradas": 0.0, "saidas": 0.0, "liquido": 0.0} for mes in meses_do_ano
    }

    for r in registros:
        mes = r.get("mes")
        valor = r.get("valor", 0)
        tipo = r.get("tipo")

        if mes not in resumo:
            continue  # ignora mês inválido

        if tipo == "Entrada":
            resumo[mes]["entradas"] += valor
        elif tipo == "Saída":
            resumo[mes]["saidas"] += valor

        resumo[mes]["liquido"] = resumo[mes]["entradas"] - resumo[mes]["saidas"]

    return JSONResponse(status_code=status.HTTP_200_OK, content=resumo)


@router.get("/")
def listar_balanco(
    mes: str = Query(None),
    ano: int = Query(None),
    tipo: str = Query(None),
    categoria: str = Query(None),
    tag: str = Query(None),
    current_user=Depends(validador_rota),
):
    usuario = usuario_service.decodificar_token(current_user)

    filtros = {"usuario_id": usuario.get("info", {}).get("id")}

    if mes:
        filtros["mes"] = mes
    if ano:
        filtros["ano"] = ano
    if tipo:
        filtros["tipo"] = tipo
    if categoria:
        filtros["categoria"] = categoria
    if tag:
        filtros["tag"] = tag

    print("filtros")
    print(filtros)
    registros = db_connection.find("balanco", filtros, {"_id": 0})
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(
            registros,
            # include_none=True,
            # custom_encoder={
            #     float: lambda x: 0.0 if math.isnan(x) or math.isinf(x) else x
            # },
        ),
    )


@router.get("/{id}")
def buscar_balanco(id: str, current_user=Depends(validador_rota)):
    usuario = usuario_service.decodificar_token(current_user)

    registro = db_connection.find_one(
        "balanco",
        {"id": id, "usuario_id": usuario.get("info", {}).get("id")},
        {"_id": 0},
    )
    return JSONResponse(
        status_code=status.HTTP_200_OK, content=jsonable_encoder(registro)
    )


@router.put("/{id}")
def editar_balanco(
    id: str, data: BalancoAtualizacaoModel, current_user=Depends(validador_rota)
):
    usuario = usuario_service.decodificar_token(current_user)
    resultado = balanco_service.editar_balanco(
        id, data.dict(exclude_none=True), usuario
    )

    if not resultado:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": "Balanço não editado!"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"mensagem": "Balanço editado com sucesso"},
    )


@router.delete("/deletar/{id}")
def deletar_balanco(id: str, current_user=Depends(validador_rota)):
    usuario = usuario_service.decodificar_token(current_user)
    resultado = db_connection.delete_one(
        "balanco", {"id": id, "usuario_id": usuario.get("info", {}).get("id")}
    )

    if not resultado:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "Registro não deletado"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"mensagem": "Balanço deletado com sucesso"},
    )


@router.post("/upload")
async def upload_balanco(
    file: UploadFile = File(...),
    tipo_arquivo: Literal[
        "extrato_inter", "fatura_inter", "extrato_nubank", "fatura_nubank"
    ] = Form(...),
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
    ] = Form(...),
    ano: int = Form(...),
    usuario: dict = Depends(validador_rota),
):
    try:
        contents = await file.read()
        if tipo_arquivo == "extrato_inter":
            df = pd.read_csv(
                io.StringIO(contents.decode("utf-8")),
                sep=";",
                engine="python",
                skiprows=5,  # Ignora as 5 primeiras linhas (cabeçalho bagunçado)
                skip_blank_lines=True,
            )
        else:
            df = pd.read_csv(
                io.StringIO(contents.decode("utf-8")), sep=None, engine="python"
            )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao ler CSV: {e}")

    registros = balanco_service.processar_balanco_upload(df, tipo_arquivo, mes, ano)

    if not registros:
        raise HTTPException(
            status_code=400, detail="Nenhum registro válido encontrado."
        )

    current_usuario = usuario_service.decodificar_token(usuario)

    usuario_id = current_usuario.get("info", {}).get("id", "")
    agora = datetime.now().isoformat()

    # Inserir no banco com dados extras
    try:
        docs = []
        for r in registros:
            d = r.model_dump()
            d["usuario_id"] = usuario_id
            d["criado_em"] = agora
            d["id"] = d.get("id", str(uuid4()))
            docs.append(d)

        db_connection.insert_many("balanco", docs)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao salvar no banco: {e}")

    return {"status": "sucesso", "quantidade_registros": len(registros)}
