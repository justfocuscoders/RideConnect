"""add driver_id to rides

Revision ID: 9ecf664f2fd3
Revises: abcd1234
Create Date: 2026-01-03
"""


from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "9ecf664f2fd3"
down_revision: Union[str, Sequence[str], None] = "abcd1234"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "rides",
        sa.Column(
            "driver_id",
            sa.Integer(),
            sa.ForeignKey("drivers.id"),
            nullable=True
        )
    )


def downgrade() -> None:
    op.drop_column("rides", "driver_id")
