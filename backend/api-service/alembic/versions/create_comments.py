from alembic import op
import sqlalchemy as sa

revision = "009"
down_revision = "008"


def upgrade():

    op.create_table(
        "comments",

        sa.Column("id", sa.Integer, primary_key=True),

        sa.Column(
            "meeting_id",
            sa.Integer,
            sa.ForeignKey("meetings.id")
        ),

        sa.Column("user_name", sa.String(100)),

        sa.Column("comment", sa.Text),
    )


def downgrade():

    op.drop_table("comments")