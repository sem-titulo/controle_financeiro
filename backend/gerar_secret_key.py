import secrets

# Gerar uma chave secreta com 256 bits (32 bytes)
secret_key = secrets.token_urlsafe(32)
print(secret_key)
