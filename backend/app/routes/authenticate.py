from typing import Optional
from app.models.usuario import UsuarioModel, EditarUsuarioModel, LoginModel
from app.services.usuario import UsuarioService
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from utils.validador_rota import validador_rota


router = APIRouter(tags=["Autenticação"])


usuario_service = UsuarioService()


@router.post("/login")
def login(data: LoginModel):
    usuario = usuario_service.login(data)
    if not usuario:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": "Erro de credenciais!"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK, content=jsonable_encoder(usuario)
    )


@router.get("/me")
def me(current_user=Depends(validador_rota)):
    usuario = usuario_service.decodificar_token(current_user)
    if not usuario:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": "Usuário não autenticado!"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK, content=jsonable_encoder(usuario)
    )
