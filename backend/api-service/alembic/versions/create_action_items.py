from alembic import op
import sqlalchemy as sa

revision = "006"
down_revision = "005"


def upgrade():

    op.create_table(
        "action_items",

        sa.Column("id", sa.Integer, primary_key=True),

        sa.Column(
            "meeting_id",
            sa.Integer,
            sa.ForeignKey("meetings.id")
        ),

        sa.Column("title", sa.String(200)),

        sa.Column("assigned_to", sa.String(100)),

        sa.Column("deadline", sa.Date),

        sa.Column("status", sa.String(50)),
    )


def downgrade():

    op.drop_table("action_items")