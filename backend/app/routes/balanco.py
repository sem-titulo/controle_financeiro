from fastapi import APIRouter, Depends, status, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from database.database import DBConnection
from app.services.usuario import UsuarioService
from app.services.balanco import BalancoService
from utils.validador_rota import validador_rota
from models.balanco import BalancoModel, BalancoAtualizacaoModel

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
        status_code=status.HTTP_200_OK, content=jsonable_encoder(registros)
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
