# ===========================================
# DOCKERFILE FOR POTATO LEAF DISEASE DETECTION (FLASK)
# ===========================================

# Use official Python slim image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy all files into the container
COPY . /app

# Upgrade pip
RUN pip install --no-cache-dir --upgrade pip

# Install dependencies
RUN pip install --no-cache-dir flask tensorflow keras numpy pillow werkzeug

# Expose the port that HF Spaces expects
EXPOSE 7860

# Command to run the Flask app
CMD ["python", "app.py"]
