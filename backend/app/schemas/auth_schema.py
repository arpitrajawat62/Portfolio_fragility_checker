from pydantic import BaseModel


class LoginRequest(BaseModel):
    client_code: str
    password: str
    totp: str


class LoginResponse(BaseModel):
    success: bool
    client_code: str
    message: str