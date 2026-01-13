"""add role column to users

Revision ID: 06898e19f781
Revises: 9cd61c3f569f
Create Date: 2026-01-04 13:07:59.569740

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '06898e19f781'
down_revision: Union[str, Sequence[str], None] = '9cd61c3f569f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        "users",
        sa.Column(
            "role",
            sa.String(length=20),
            nullable=False,
            server_default="user"
        )
    )

def downgrade():
    op.drop_column("users", "role")