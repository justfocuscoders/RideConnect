"""initial schema

Revision ID: 545e7cabfa25
Revises:
Create Date: 2026-01-13 20:47:44.631776
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "545e7cabfa25"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ============================
    # USERS
    # ============================
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=True),
        sa.Column("phone", sa.String(length=20), nullable=True),
        sa.Column("role", sa.String(length=20), nullable=False),
        sa.Column(
            "is_active",
            sa.Boolean(),
            server_default=sa.text("1"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_id", "users", ["id"], unique=False)

    # ============================
    # DRIVERS
    # ============================
    op.create_table(
        "drivers",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("license_number", sa.String(length=50), nullable=False),
        sa.Column("vehicle_number", sa.String(length=50), nullable=False),
        sa.Column("vehicle_type", sa.String(length=20), nullable=False),
        sa.Column("is_verified", sa.Boolean(), server_default=sa.text("0"), nullable=False),
        sa.Column("is_online", sa.Boolean(), server_default=sa.text("0"), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id"),
    )

    op.create_index("ix_drivers_id", "drivers", ["id"], unique=False)

    # ============================
    # RIDES
    # ============================
    op.create_table(
        "rides",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("driver_id", sa.Integer(), nullable=True),
        sa.Column("pickup_location", sa.String(length=255), nullable=False),
        sa.Column("drop_location", sa.String(length=255), nullable=False),
        sa.Column("distance_km", sa.Float(), nullable=False),
        sa.Column("estimated_fare", sa.Float(), nullable=False),
        sa.Column("status", sa.String(length=30), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["driver_id"],
            ["drivers.id"],
            ondelete="SET NULL",
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index("ix_rides_id", "rides", ["id"], unique=False)
    op.create_index("ix_rides_user_id", "rides", ["user_id"], unique=False)
    op.create_index("ix_rides_driver_id", "rides", ["driver_id"], unique=False)
    op.create_index("ix_rides_status", "rides", ["status"], unique=False)
    op.create_index("ix_rides_created_at", "rides", ["created_at"], unique=False)
    op.create_index(
        "idx_available_rides",
        "rides",
        ["status", "driver_id"],
        unique=False,
    )

    # ============================
    # PAYMENTS
    # ============================
    op.create_table(
        "payments",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("ride_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("driver_id", sa.Integer(), nullable=False),
        sa.Column("amount", sa.Float(), nullable=False),
        sa.Column("commission", sa.Float(), nullable=False),
        sa.Column("driver_earning", sa.Float(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["ride_id"],
            ["rides.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
        ),
        sa.ForeignKeyConstraint(
            ["driver_id"],
            ["drivers.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("ride_id"),
    )

    op.create_index("ix_payments_id", "payments", ["id"], unique=False)
    op.create_index("ix_payments_ride_id", "payments", ["ride_id"], unique=True)

    # ============================
    # DRIVER EARNINGS
    # ============================
    op.create_table(
        "driver_earnings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("driver_id", sa.Integer(), nullable=False),
        sa.Column("payment_id", sa.Integer(), nullable=False),
        sa.Column("amount", sa.Float(), nullable=False),
        sa.ForeignKeyConstraint(
            ["driver_id"],
            ["drivers.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["payment_id"],
            ["payments.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("payment_id"),
    )

    op.create_index(
        "ix_driver_earnings_id",
        "driver_earnings",
        ["id"],
        unique=False,
    )
    op.create_index(
        "ix_driver_earnings_driver_id",
        "driver_earnings",
        ["driver_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_driver_earnings_driver_id", table_name="driver_earnings")
    op.drop_index("ix_driver_earnings_id", table_name="driver_earnings")
    op.drop_table("driver_earnings")

    op.drop_index("ix_payments_ride_id", table_name="payments")
    op.drop_index("ix_payments_id", table_name="payments")
    op.drop_table("payments")

    op.drop_index("idx_available_rides", table_name="rides")
    op.drop_index("ix_rides_created_at", table_name="rides")
    op.drop_index("ix_rides_status", table_name="rides")
    op.drop_index("ix_rides_driver_id", table_name="rides")
    op.drop_index("ix_rides_user_id", table_name="rides")
    op.drop_index("ix_rides_id", table_name="rides")
    op.drop_table("rides")

    op.drop_index("ix_drivers_id", table_name="drivers")
    op.drop_table("drivers")

    op.drop_index("ix_users_id", table_name="users")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
