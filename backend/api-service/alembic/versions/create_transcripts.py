from alembic import op
import sqlalchemy as sa

revision = "004"
down_revision = "003"


def upgrade():

    op.create_table(
        "transcripts",

        sa.Column("id", sa.Integer, primary_key=True),

        sa.Column(
            "meeting_id",
            sa.Integer,
            sa.ForeignKey("meetings.id")
        ),

        sa.Column("transcript", sa.Text),
    )


def downgrade():

    op.drop_table("transcripts")