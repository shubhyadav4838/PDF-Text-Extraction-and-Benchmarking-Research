FROM python:3.13-slim

# Prevent Python from writing .pyc files
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 1. Install system dependencies (no C++ compilers needed anymore!)
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-eng \
    poppler-utils \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 2. Copy the official uv binary directly into the Docker image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# 3. Copy ONLY your lockfile and pyproject (no requirements.txt needed)
COPY pyproject.toml uv.lock ./

# 4. Sync dependencies using uv (blazing fast, automatically creates a .venv)
RUN uv sync --frozen --no-dev

# 5. Copy the rest of the application files
COPY . .

# Render dynamically sets $PORT
ENV PORT=8000
EXPOSE 8000

# 6. Run uvicorn using `uv run` to ensure it uses the isolated virtual environment
CMD ["sh", "-c", "uv run uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]