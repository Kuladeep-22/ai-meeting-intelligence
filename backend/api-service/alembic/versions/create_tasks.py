from alembic import op
import sqlalchemy as sa

revision = "008"
down_revision = "007"


def upgrade():

    op.create_table(
        "tasks",

        sa.Column("id", sa.Integer, primary_key=True),

        sa.Column("title", sa.String(200)),

        sa.Column("description", sa.Text),

        sa.Column("status", sa.String(50)),

        sa.Column("assigned_to", sa.String(100)),
    )


def downgrade():

    op.drop_table("tasks")