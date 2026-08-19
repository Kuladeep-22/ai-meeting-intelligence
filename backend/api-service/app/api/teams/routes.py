from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

from .schemas import (
    TeamCreate,
    TeamUpdate,
)

from .service import *

router = APIRouter(
    prefix="/teams",
    tags=["Teams"]
)


@router.get("/")
def get_all(
    db: Session = Depends(get_db)
):
    return get_all_teams(db)


@router.get("/{team_id}")
def get_one(
    team_id: int,
    db: Session = Depends(get_db)
):
    return get_team(db, team_id)


@router.post("/")
def create(
    request: TeamCreate,
    db: Session = Depends(get_db)
):
    return create_team(db, request)


@router.put("/{team_id}")
def update(
    team_id: int,
    request: TeamUpdate,
    db: Session = Depends(get_db)
):
    return update_team(
        db,
        team_id,
        request
    )


@router.delete("/{team_id}")
def delete(
    team_id: int,
    db: Session = Depends(get_db)
):
    return delete_team(
        db,
        team_id
    )