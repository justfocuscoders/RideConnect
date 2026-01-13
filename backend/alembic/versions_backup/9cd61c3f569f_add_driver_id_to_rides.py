"""add driver_id to rides

Revision ID: 9cd61c3f569f
Revises: 6d685f975b72
Create Date: 2026-01-04 12:32:10.409786

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9cd61c3f569f'
down_revision: Union[str, Sequence[str], None] = '6d685f975b72'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        "rides",
        sa.Column(
            "driver_id",
            sa.Integer(),
            sa.ForeignKey("drivers.id", ondelete="SET NULL"),
            nullable=True
        )
    )


def downgrade():
    op.drop_column("rides", "driver_id")