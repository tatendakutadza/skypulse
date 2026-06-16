from fastapi import APIRouter

router = APIRouter(prefix="/api/bots", tags=["bots"])

@router.post("/telegram")
def telegram_webhook():
    return {"message": "telegram webhook - coming soon"}

@router.post("/whatsapp")
def whatsapp_webhook():
    return {"message": "whatsapp webhook - coming soon"}