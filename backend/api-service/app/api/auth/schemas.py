from enum import Enum

from pydantic import BaseModel, EmailStr


class UserRole(str, Enum):
    MANAGER = "manager"
    TEAM_LEAD = "team_lead"
    DEVELOPER = "developer"
    BUSINESS_ANALYST = "business_analyst"
    EMPLOYEE = "employee"


class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.EMPLOYEE

class LoginRequest(BaseModel):
    email: EmailStr
    password: str