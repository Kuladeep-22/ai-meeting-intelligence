from fastapi import HTTPException
from app.models.team import Team


def get_all_teams(db):
    return db.query(Team).all()


def get_team(db, team_id: int):
    team = db.query(Team).filter(Team.id == team_id).first()

    if not team:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    return team


def create_team(db, data):
    team = Team(
        name=data.name,
        description=data.description
    )

    db.add(team)
    db.commit()
    db.refresh(team)

    return team


def update_team(db, team_id: int, data):

    team = db.query(Team).filter(
        Team.id == team_id
    ).first()

    if not team:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    if data.name:
        team.name = data.name

    if data.description:
        team.description = data.description

    db.commit()
    db.refresh(team)

    return team


def delete_team(db, team_id: int):

    team = db.query(Team).filter(
        Team.id == team_id
    ).first()

    if not team:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    db.delete(team)
    db.commit()

    return {
        "message": "Team deleted successfully"
    }