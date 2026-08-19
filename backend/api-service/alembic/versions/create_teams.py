from alembic import op
import sqlalchemy as sa

revision = "002"
down_revision = "001"


def upgrade():

    op.create_table(
        "teams",

        sa.Column("id", sa.Integer, primary_key=True),

        sa.Column("name", sa.String(100)),

        sa.Column("description", sa.Text),
    )


def downgrade():

    op.drop_table("teams")