from alembic import op
import sqlalchemy as sa

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():

    op.create_table(
        "users",

        sa.Column("id", sa.Integer, primary_key=True),

        sa.Column("full_name", sa.String(150), nullable=False),

        sa.Column("email", sa.String(150), unique=True),

        sa.Column("password", sa.String(255), nullable=False),

        sa.Column("created_at", sa.DateTime),
    )


def downgrade():

    op.drop_table("users")