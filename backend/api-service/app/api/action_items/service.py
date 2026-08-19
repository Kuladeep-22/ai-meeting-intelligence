from fastapi import HTTPException

from app.models.action_item import ActionItem


def get_all_action_items(db):
    return db.query(ActionItem).all()


def get_action_item(db, item_id: int):

    item = (
        db.query(ActionItem)
        .filter(ActionItem.id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Action item not found"
        )

    return item


def create_action_item(db, data):

    item = ActionItem(
        meeting_id=data.meeting_id,
        title=data.title,
        assigned_to=data.assigned_to,
        deadline=data.deadline,
        status=data.status,
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


def update_action_item(db, item_id, data):

    item = (
        db.query(ActionItem)
        .filter(ActionItem.id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Action item not found"
        )

    if data.title:
        item.title = data.title

    if data.assigned_to:
        item.assigned_to = data.assigned_to

    if data.deadline:
        item.deadline = data.deadline

    if data.status:
        item.status = data.status

    db.commit()
    db.refresh(item)

    return item


def delete_action_item(db, item_id):

    item = (
        db.query(ActionItem)
        .filter(ActionItem.id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Action item not found"
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Action item deleted successfully"
    }