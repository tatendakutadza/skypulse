from fastapi import APIRouter

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register")
def register():
    return {"message": "register endpoint - coming soon"}

@router.post("/login")
def login():
    return {"message": "login endpoint - coming soon"}

@router.get("/me")
def get_me():
    return {"message": "me endpoint - coming soon"}

@router.post("/logout")
def logout():
    return {"message": "logout endpoint - coming soon"}