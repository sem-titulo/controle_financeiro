from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from database.database import DBConnection
from app.services.usuario import UsuarioService
from app.services.recorrente import RecorrenteService
from utils.validador_rota import validador_rota
from models.recorrente import RecorrenteModel, RecorrenteAtualizacaoModel

router = APIRouter(
    prefix="/recurrent",
    tags=["Transações Recorrentes"],
    dependencies=[Depends(validador_rota)],
)

usuario_service = UsuarioService()
recorrente_service = RecorrenteService()


@router.post("/")
def criar_recorrente(data: RecorrenteModel, current_user=Depends(validador_rota)):
    usuario = usuario_service.decodificar_token(current_user)
    recorrente = recorrente_service.criar_recorrente(data.dict(), usuario)

    if not recorrente:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": "Transação recorrente não criada!"},
        )
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"mensagem": "Transação recorrente criada com sucesso"},
    )


@router.get("/")
def listar_recorrentes(current_user=Depends(validador_rota)):
    usuario = usuario_service.decodificar_token(current_user)
    registros = recorrente_service.listar_recorrentes(usuario)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(registros),
    )


@router.get("/{id}")
def buscar_recorrente(id: str, current_user=Depends(validador_rota)):
    usuario = usuario_service.decodificar_token(current_user)
    registro = recorrente_service.buscar_recorrente(id, usuario)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder(registro),
    )


@router.put("/{id}")
def editar_recorrente(
    id: str, data: RecorrenteAtualizacaoModel, current_user=Depends(validador_rota)
):
    usuario = usuario_service.decodificar_token(current_user)
    resultado = recorrente_service.editar_recorrente(
        id, data.dict(exclude_none=True), usuario
    )

    if not resultado:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": "Transação recorrente não editada!"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"mensagem": "Transação recorrente editada com sucesso"},
    )


@router.delete("/{id}")
def deletar_recorrente(id: str, current_user=Depends(validador_rota)):
    usuario = usuario_service.decodificar_token(current_user)
    resultado = recorrente_service.deletar_recorrente(id, usuario)

    if not resultado:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "Transação recorrente não deletada"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"mensagem": "Transação recorrente deletada com sucesso"},
    )
