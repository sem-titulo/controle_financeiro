from typing import Optional
from app.models.usuario import UsuarioModel, EditarUsuarioModel
from app.services.usuario import UsuarioService
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/users", tags=["Usuários"])


usuario_service = UsuarioService()


@router.post("/")
def criar_usuario(data: UsuarioModel):
    try:
        usuario = usuario_service.criar_usuario(data.dict())
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "mensagem": "Usuário cadastrado com sucesso",
                "id": str(usuario.get("id")),
            },
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("")
def listar_usuarios(email: Optional[str] = None):
    try:
        usuarios = usuario_service.listar_usuarios(email)
        return JSONResponse(status_code=status.HTTP_200_OK, content=usuarios)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "Nenhum usuário encontrado"},
        )


@router.get("/{id}")
def listar_usuario(id: str):
    try:
        usuario = usuario_service.listar_usuario(id)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"error": "Nenhum usuário encontrado"},
            )
        return JSONResponse(status_code=status.HTTP_200_OK, content=usuario)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "Nenhum usuário encontrado"},
        )


@router.put("/{id}")
def editar_usuario(id: str, data: EditarUsuarioModel):
    try:
        print("90")
        usuario = usuario_service.editar_usuario_put(id, data.dict())
        print(usuario)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"error": "Usuário não editado"},
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Usuário editado com sucesso!"},
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "Usuário não editado"},
        )


@router.patch("/editar/{id}")
def editar_usuario_patch(id: str, email: str):
    try:
        usuario = usuario_service.editar_usuario_patch(id, email)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"error": "Usuário não editado"},
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Usuário editado com sucesso!"},
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "Usuário não editado"},
        )


@router.delete("/{id}")
def deletar_usuario(id: str):
    try:
        usuario = usuario_service.deletar_usuario(id)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"error": "Usuário não deletado"},
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Usuário deletado com sucesso!"},
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "Usuário não deletado"},
        )
