from alembic import op
import sqlalchemy as sa

revision = "005"
down_revision = "004"


def upgrade():

    op.create_table(
        "decisions",

        sa.Column("id", sa.Integer, primary_key=True),

        sa.Column(
            "meeting_id",
            sa.Integer,
            sa.ForeignKey("meetings.id")
        ),

        sa.Column("title", sa.String(200)),

        sa.Column("description", sa.Text),

        sa.Column("owner", sa.String(100)),

        sa.Column("status", sa.String(50)),
    )


def downgrade():

    op.drop_table("decisions")