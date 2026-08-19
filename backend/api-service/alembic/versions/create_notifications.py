from alembic import op
import sqlalchemy as sa

revision = "010"
down_revision = "009"


def upgrade():

    op.create_table(
        "notifications",

        sa.Column("id", sa.Integer, primary_key=True),

        sa.Column(
            "user_id",
            sa.Integer,
            sa.ForeignKey("users.id")
        ),

        sa.Column("title", sa.String(200)),

        sa.Column("message", sa.Text),

        sa.Column(
            "is_read",
            sa.Boolean,
            default=False
        ),
    )


def downgrade():

    op.drop_table("notifications")