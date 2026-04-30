"""init clean schema

Revision ID: 1eee48eac4b2
Revises: 
Create Date: 2026-04-30 14:22:03.912294

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1eee48eac4b2'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. add column safely first (nullable or defaulted)
    op.add_column(
        'users',
        sa.Column(
            'email_verified',
            sa.Boolean(),
            nullable=False,
            server_default=sa.text('false')
        )
    )

    # 2. drop old column safely
    op.drop_column('users', 'phone_verified')


def downgrade() -> None:
    # restore old column
    op.add_column(
        'users',
        sa.Column(
            'phone_verified',
            sa.Boolean(),
            nullable=False,
            server_default=sa.text('false')
        )
    )

    # remove new column
    op.drop_column('users', 'email_verified')
