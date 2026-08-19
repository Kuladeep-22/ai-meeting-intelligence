from alembic import op
import sqlalchemy as sa

revision = "012"
down_revision = "011"


def upgrade():

    op.add_column(
        "meetings",
        sa.Column("join_url", sa.String(255)),
    )

    op.create_table(
        "meeting_participants",

        sa.Column("id", sa.Integer, primary_key=True),

        sa.Column(
            "meeting_id",
            sa.Integer,
            sa.ForeignKey("meetings.id", ondelete="CASCADE"),
            nullable=False,
        ),

        sa.Column(
            "user_id",
            sa.Integer,
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),

        sa.Column("status", sa.String(20), server_default="invited"),

        sa.Column("reminder_sent", sa.Boolean, server_default=sa.false()),

        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),

        sa.UniqueConstraint("meeting_id", "user_id", name="uq_meeting_participant"),
    )


def downgrade():

    op.drop_table("meeting_participants")
    op.drop_column("meetings", "join_url")
