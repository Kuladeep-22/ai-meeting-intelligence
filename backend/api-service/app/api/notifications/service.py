from fastapi import HTTPException

from app.models.notification import Notification


def get_notifications(db):

    return db.query(Notification).all()


def get_notification(db, notification_id):

    notification = (
        db.query(Notification)
        .filter(Notification.id == notification_id)
        .first()
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    return notification


def create_notification(db, data):

    notification = Notification(
        user_id=data.user_id,
        title=data.title,
        message=data.message,
        is_read=False,
    )

    db.add(notification)

    db.commit()

    db.refresh(notification)

    return notification


def mark_as_read(db, notification_id):

    notification = (
        db.query(Notification)
        .filter(Notification.id == notification_id)
        .first()
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    notification.is_read = True

    db.commit()

    db.refresh(notification)

    return notification


def delete_notification(db, notification_id):

    notification = (
        db.query(Notification)
        .filter(Notification.id == notification_id)
        .first()
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    db.delete(notification)

    db.commit()

    return {
        "message": "Notification deleted"
    }