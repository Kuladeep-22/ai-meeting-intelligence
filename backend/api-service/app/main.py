from fastapi import FastAPI
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.middleware.auth_middleware import (
    AuthMiddleware,
)

from app.middleware.error_handler import (
    global_exception_handler,
)

from app.api.auth.routes import router as auth_router
from app.api.users.routes import router as user_router
from app.api.teams.routes import router as team_router
from app.api.meetings.routes import router as meeting_router
from app.api.decisions.routes import router as decision_router
from app.api.action_items.routes import router as action_router
from app.api.risks.routes import router as risk_router
from app.api.analytics.routes import router as analytics_router
from app.api.chatbot.routes import router as chatbot_router
from app.api.notifications.routes import router as notification_router
from fastapi.middleware.cors import CORSMiddleware

from app.websocket.notification_socket import (
    router as websocket_router,
)

from app.services.meeting_reminders import send_meeting_reminders

app = FastAPI(
    title="AI Meeting Intelligence API",
    version="1.0.0",
)


app.add_middleware(
    AuthMiddleware
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_exception_handler(
    Exception,
    global_exception_handler,
)

app.include_router(
    auth_router,
    prefix="/api/v1/auth",
    tags=["Authentication"],
)

# Include all API routers with /api/v1 prefix
app.include_router(user_router, prefix="/api/v1")
app.include_router(team_router, prefix="/api/v1")
app.include_router(meeting_router, prefix="/api/v1")
app.include_router(decision_router, prefix="/api/v1")
app.include_router(action_router, prefix="/api/v1")
app.include_router(risk_router, prefix="/api/v1")
app.include_router(analytics_router, prefix="/api/v1")
app.include_router(chatbot_router, prefix="/api/v1")
app.include_router(notification_router, prefix="/api/v1")

app.include_router(websocket_router)

scheduler = AsyncIOScheduler()


@app.on_event("startup")
def start_scheduler():
    scheduler.add_job(send_meeting_reminders, "interval", minutes=1)
    scheduler.start()


@app.on_event("shutdown")
def stop_scheduler():
    scheduler.shutdown(wait=False)


@app.get("/")
def home():

    return {
        "message": "AI Meeting Intelligence API Running"
    }