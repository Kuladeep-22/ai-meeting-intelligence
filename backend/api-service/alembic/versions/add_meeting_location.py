from alembic import op
import sqlalchemy as sa

revision = "013"
down_revision = "012"


def upgrade():

    op.add_column(
        "meetings",
        sa.Column("location", sa.String(255)),
    )


def downgrade():

    op.drop_column("meetings", "location")
