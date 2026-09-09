from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ============================================================
# API ROUTERS
# ============================================================

from app.api.auth.routes import router as auth_router
from app.api.users.routes import router as user_router
from app.api.teams.routes import router as team_router
from app.api.meetings.routes import router as meeting_router
from app.api.decisions.routes import router as decision_router
from app.api.action_items.routes import router as action_item_router
from app.api.risks.routes import router as risk_router
from app.api.analytics.routes import router as analytics_router
from app.api.notifications.routes import router as notification_router
from app.api.chatbot.routes import router as chatbot_router
from app.websocket.chat_socket import router as chat_socket_router


# ============================================================
# CONFIGURATION
# ============================================================

API_PREFIX = "/api/v1"


# ============================================================
# APPLICATION
# ============================================================

app = FastAPI(
    title="AI Meeting Intelligence API",
    version="1.0.0",
    description=(
        "Backend API for meetings, decisions, action items, "
        "risks, analytics, notifications, authentication, "
        "and AI-powered meeting assistance."
    ),
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

origins = [
    "https://ai-meeting-intelligence-silk.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROUTERS
# ============================================================

app.include_router(
    auth_router,
    prefix=API_PREFIX,
)

app.include_router(
    user_router,
    prefix=API_PREFIX,
)

app.include_router(
    team_router,
    prefix=API_PREFIX,
)

app.include_router(
    meeting_router,
    prefix=API_PREFIX,
)

app.include_router(
    decision_router,
    prefix=API_PREFIX,
)

app.include_router(
    action_item_router,
    prefix=API_PREFIX,
)

app.include_router(
    risk_router,
    prefix=API_PREFIX,
)

app.include_router(
    analytics_router,
    prefix=API_PREFIX,
)

app.include_router(
    notification_router,
    prefix=API_PREFIX,
)

app.include_router(
    chatbot_router,
    prefix=API_PREFIX,
)

app.include_router(
    chat_socket_router,
    prefix=API_PREFIX,
)


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def health_check():
    return {
        "status": "AI Meeting Intelligence API is running"
    }