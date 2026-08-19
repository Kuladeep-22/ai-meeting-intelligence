from fastapi import HTTPException
from app.models.user import User


def get_all_users(db):
    return db.query(User).all()


def get_user_by_id(db, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


def create_user(db, user_data):

    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        password=user_data.password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def update_user(db, user_id, user_data):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user_data.full_name:
        user.full_name = user_data.full_name

    if user_data.email:
        user.email = user_data.email

    db.commit()
    db.refresh(user)

    return user


def delete_user(db, user_id):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db.delete(user)

    db.commit()

    return {
        "message": "User deleted successfully"
    }