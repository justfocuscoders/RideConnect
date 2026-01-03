"""add distance_km to rides

Revision ID: 6d685f975b72
Revises: ae8558e013e5
Create Date: 2026-01-03 13:19:55.628853

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6d685f975b72'
down_revision: Union[str, Sequence[str], None] = 'ae8558e013e5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        "rides",
        sa.Column("distance_km", sa.Float(), nullable=False)
    )

def downgrade():
    op.drop_column("rides", "distance_km")
