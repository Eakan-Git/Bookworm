FROM python:3.11-slim

WORKDIR /app

# Install PostgreSQL client dependencies first
RUN apt-get update && \
    apt-get install -y postgresql-client libpq-dev gcc && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--reload"]
