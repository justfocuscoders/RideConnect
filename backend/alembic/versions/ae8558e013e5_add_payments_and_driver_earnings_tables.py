"""add payments and driver earnings tables

Revision ID: ae8558e013e5
Revises: 9ecf664f2fd3
Create Date: 2026-01-03 13:16:36.910166

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ae8558e013e5'
down_revision: Union[str, Sequence[str], None] = '9ecf664f2fd3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        "payments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("ride_id", sa.Integer(), nullable=False, unique=True),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("driver_id", sa.Integer(), nullable=False),
        sa.Column("amount", sa.Float(), nullable=False),
        sa.Column("commission", sa.Float(), nullable=False),
        sa.Column("driver_earning", sa.Float(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
    )

    op.create_table(
        "driver_earnings",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("driver_id", sa.Integer(), nullable=False),
        sa.Column("payment_id", sa.Integer(), nullable=False, unique=True),
        sa.Column("amount", sa.Float(), nullable=False),
    )
