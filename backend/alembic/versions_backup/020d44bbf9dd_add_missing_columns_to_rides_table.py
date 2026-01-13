"""add missing columns to rides table

Revision ID: 020d44bbf9dd
Revises: 
Create Date: 2026-01-02 19:05:01.753422
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "020d44bbf9dd"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "rides",
        sa.Column("pickup_location", sa.String(length=255), nullable=False),
    )
    op.add_column(
        "rides",
        sa.Column("drop_location", sa.String(length=255), nullable=False),
    )
    op.add_column(
        "rides",
        sa.Column(
            "status",
            sa.String(length=50),
            nullable=False,
            server_default="requested",
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("rides", "status")
    op.drop_column("rides", "drop_location")
    op.drop_column("rides", "pickup_location")
