from alembic import op
import sqlalchemy as sa

revision = "011"
down_revision = "010"


def upgrade():

    op.add_column(
        "meetings",
        sa.Column("start_time", sa.String(20)),
    )

    op.add_column(
        "meetings",
        sa.Column("end_time", sa.String(20)),
    )


def downgrade():

    op.drop_column("meetings", "start_time")
    op.drop_column("meetings", "end_time")
