from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ============================================================
# API Routers
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


# ============================================================
# Configuration
# ============================================================

API_PREFIX = "/api/v1"


# ============================================================
# Application
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
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api/v1"


# ============================================================
# Authentication
#
# auth_router routes should define:
#
#   POST /register
#   POST /login
#   GET  /me
#
# Therefore:
#
#   POST /api/v1/register
#   POST /api/v1/login
#   GET  /api/v1/me
# ============================================================

app.include_router(
    auth_router,
    prefix=API_PREFIX,
)


# ============================================================
# Users
# ============================================================

app.include_router(
    user_router,
    prefix=API_PREFIX,
)


# ============================================================
# Teams
# ============================================================

app.include_router(
    team_router,
    prefix=API_PREFIX,
)


# ============================================================
# Meetings
# ============================================================

app.include_router(
    meeting_router,
    prefix=API_PREFIX,
)


# ============================================================
# Decisions
# ============================================================

app.include_router(
    decision_router,
    prefix=API_PREFIX,
)


# ============================================================
# Action Items
# ============================================================

app.include_router(
    action_item_router,
    prefix=API_PREFIX,
)


# ============================================================
# Risks
# ============================================================

app.include_router(
    risk_router,
    prefix=API_PREFIX,
)


# ============================================================
# Analytics
# ============================================================

app.include_router(
    analytics_router,
    prefix=API_PREFIX,
)


# ============================================================
# Notifications
# ============================================================

app.include_router(
    notification_router,
    prefix=API_PREFIX,
)


# ============================================================
# AI CHATBOT
#
# chatbot/routes.py MUST define:
#
#     @router.post("/ask")
#
# Since we add:
#
#     prefix="/api/v1/chatbot"
#
# the final endpoint is:
#
#     POST /api/v1/chatbot/ask
#
# ============================================================

app.include_router(
    chatbot_router,
    prefix=f"{API_PREFIX}/chatbot",
)


# ============================================================
# Health Check
# ============================================================

@app.get("/",)
def health_check():
    return {
        "status": "AI Meeting Intelligence API is running"
    }