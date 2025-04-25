from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from database.database import DBConnection
from app.services.usuario import UsuarioService
from app.services.notas import NotasService
from utils.validador_rota import validador_rota
from models.nota import NotaModel, NotaAtualizacaoModel

router = APIRouter(
    prefix="/notas", tags=["Notas"], dependencies=[Depends(validador_rota)]
)

# router = APIRouter(
#     tags=["Autenticação"],
#       # Protege todas as rotas com autenticação
# )
db_connection = DBConnection()
usuario_service = UsuarioService()
notas_service = NotasService()


@router.post("/")
def criacao_nota(data: NotaModel, current_user=Depends(validador_rota)):
    usuario = usuario_service.decodificar_token(current_user)
    nota = notas_service.criar_nota(data.dict(), usuario)

    if not nota:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": "Nota não criada!"},
        )
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"mensagem": "Nota criada com sucesso", "id": str(nota.get("id"))},
    )


@router.get("/")
def buscar_notas(current_user=Depends(validador_rota)):
    usuario = usuario_service.decodificar_token(current_user)

    notas = db_connection.find(
        "notas", {"usuario_id": usuario.get("info", {}).get("id")}, {"_id": 0}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(notas))


@router.get("/{id}")
def buscar_nota(id: str, current_user=Depends(validador_rota)):
    usuario = usuario_service.decodificar_token(current_user)

    nota = db_connection.find_one(
        "notas", {"id": id, "usuario_id": usuario.get("info", {}).get("id")}, {"_id": 0}
    )
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(nota))


@router.delete("/deletar/{id}")
def deletar_usuario(id: str, current_user=Depends(validador_rota)):
    try:
        usuario = usuario_service.decodificar_token(current_user)
        nota = db_connection.delete_one(
            "notas", {"id": id, "usuario_id": usuario.get("info", {}).get("id")}
        )
        if not nota:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"error": "Nota não deletada"},
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Nota deletada com sucesso!"},
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "Nota não deletada"},
        )


@router.put("/{id}")
def editar_nota(
    id: str, data: NotaAtualizacaoModel, current_user=Depends(validador_rota)
):
    usuario = usuario_service.decodificar_token(current_user)
    nota = notas_service.editar_nota(id, data.dict(), usuario)

    if not nota:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": "Nota não editada!"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"mensagem": "Nota editada com sucesso"},
    )
