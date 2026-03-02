# Kube Backend — FastAPI

Verified used goods marketplace backend.

## Setup

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env with your credentials

# Run migrations
alembic upgrade head

# Start dev server
uvicorn app.main:app --reload
```

## API Docs

- Swagger UI: http://localhost:8000/docs
- ReDoc:       http://localhost:8000/redoc

## Tests

```bash
pytest tests/
```

## Stack

- FastAPI + Pydantic v2
- PostgreSQL + SQLAlchemy + Alembic
- Redis (OTP TTL, caching)
- Paystack (payments + seller payouts)
- Plivo (SMS OTP)
- Cloudinary (product images)
