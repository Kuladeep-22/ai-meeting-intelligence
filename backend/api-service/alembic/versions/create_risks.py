from alembic import op
import sqlalchemy as sa

revision = "007"
down_revision = "006"


def upgrade():

    op.create_table(
        "risks",

        sa.Column("id", sa.Integer, primary_key=True),

        sa.Column(
            "meeting_id",
            sa.Integer,
            sa.ForeignKey("meetings.id")
        ),

        sa.Column("title", sa.String(200)),

        sa.Column("description", sa.Text),

        sa.Column("severity", sa.String(50)),

        sa.Column("status", sa.String(50)),
    )


def downgrade():

    op.drop_table("risks")