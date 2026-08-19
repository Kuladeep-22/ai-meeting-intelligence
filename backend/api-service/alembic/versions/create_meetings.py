from alembic import op
import sqlalchemy as sa

revision = "003"
down_revision = "002"


def upgrade():

    op.create_table(
        "meetings",

        sa.Column("id", sa.Integer, primary_key=True),

        sa.Column("title", sa.String(200)),

        sa.Column("description", sa.Text),

        sa.Column("meeting_date", sa.Date),

        sa.Column("organizer", sa.String(100)),
    )


def downgrade():

    op.drop_table("meetings")