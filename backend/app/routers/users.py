from fastapi import APIRouter

router = APIRouter(prefix="/api/user", tags=["users"])

@router.get("/favorites")
def get_favorites():
    return {"message": "get favorites endpoint - coming soon"}

@router.post("/favorites")
def add_favorite():
    return {"message": "add favorite endpoint - coming soon"}

@router.delete("/favorites/{id}")
def remove_favorite(id: int):
    return {"message": f"delete favorite {id} endpoint - coming soon"}

@router.patch("/settings")
def update_settings():
    return {"message": "settings endpoint - coming soon"}