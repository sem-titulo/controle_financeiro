from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import usuario, authenticate, balanco, recorrente, importar_notion

app = FastAPI(
    title="Projeto Controle Financeiro",
    description="Projeto FastAPI para a criação de Controle Financeiro",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou especifique o domínio ex: ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(usuario.router)
app.include_router(authenticate.router)
app.include_router(balanco.router)
app.include_router(recorrente.router)
app.include_router(importar_notion.router)
