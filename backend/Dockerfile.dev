FROM python:3.13-slim

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /apps/backend

# ✅ Copy backend code
COPY apps/backend ./

# ✅ Copy scripts with correct paths
COPY apps/backend/entrypoint.sh ./entrypoint.sh
COPY apps/backend/wait-for-it.sh ./wait-for-it.sh

# ✅ Install dependencies
RUN python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install -r requirements.txt

# ✅ Make scripts executable
RUN chmod +x entrypoint.sh wait-for-it.sh

# ✅ Run the entrypoint
CMD ["/apps/backend/entrypoint.sh"]
