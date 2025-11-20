FROM python:3.10-slim

# --- Fix random_device BEFORE Python starts ---
ENV PYTHONHASHSEED=0
ENV CUBLAS_WORKSPACE_CONFIG=:16:8
ENV MKL_SERVICE_FORCE_INTEL=1
ENV CUDA_VISIBLE_DEVICES=""
ENV USE_RANDOM_DEVICE=0
ENV FORCE_CPU=1
ENV PYTORCH_ENABLE_MPS_FALLBACK=1

WORKDIR /app

COPY . /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libgl1 \
    libjpeg62-turbo \
    libpng16-16 \
    libopenblas-dev \
    libomp-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 7860
CMD ["python", "app.py"]
