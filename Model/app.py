# app.py
# ===========================================
# 🥔 AGRILEAFNET - FLASK BACKEND (Fixed & Robust)
# Two-Model Pipeline Edition
# ===========================================
import os
os.system("pip install flask-cors==3.0.10")
import uuid
import traceback
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from keras.models import load_model
from keras.preprocessing import image
import numpy as np

# Optional: install dependency (kept here for HF Space where install on startup is needed)
# os.system("pip install flask-cors==3.0.10")    # uncomment if required by your environment

# ------------- CONFIG -------------
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
MAX_CONTENT_LENGTH = 6 * 1024 * 1024  # 6 MB upload limit

MODEL1_PATH = "disease_category_model.keras"   # model trained on 224x224
MODEL2_PATH = "disease_type_model.keras"       # model trained on 256x256

# Default expected sizes (will be overridden by detecting model input shape if possible)
MODEL1_SIZE = (224, 224)
MODEL2_SIZE = (256, 256)

# ------------- APP SETUP -------------
app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH

# Allow cross-origin requests (you can restrict origins if needed)
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",
            "https://agrileafnet.vercel.app"
        ]
    }
}) # open CORS; change to CORS(app, resources={r"/*": {"origins": ["https://your-site"]}}) to lock down

# ------------- HELPERS -------------
def allowed_file(filename: str) -> bool:
    if "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in ALLOWED_EXTENSIONS

def safe_save_file(file_storage):
    """Save incoming file with a safe uuid filename and preserve extension."""
    orig_name = secure_filename(file_storage.filename)
    _, ext = os.path.splitext(orig_name)
    if ext == "":
        ext = ".jpg"
    new_name = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(app.config["UPLOAD_FOLDER"], new_name)
    file_storage.save(path)
    return new_name, path

def preprocess_for_size(path, size):
    """Load image, resize to 'size', normalize to [0,1], and expand dims."""
    img = image.load_img(path, target_size=size)
    arr = image.img_to_array(img) / 255.0
    arr = np.expand_dims(arr, axis=0)
    return arr

# ------------- MODEL LOADING -------------
model_category = None
model_type = None
model_load_errors = {}

def try_load_model(path):
    try:
        m = load_model(path)
        return m, None
    except Exception as e:
        return None, str(e)

model_category, err = try_load_model(MODEL1_PATH)
if err:
    model_load_errors["model_category"] = err
else:
    # attempt to read model's input shape if available
    try:
        ishape = model_category.input_shape
        if ishape and len(ishape) >= 3:
            h, w = ishape[1], ishape[2]
            if isinstance(h, int) and isinstance(w, int):
                MODEL1_SIZE = (h, w)
    except Exception:
        pass

model_type, err = try_load_model(MODEL2_PATH)
if err:
    model_load_errors["model_type"] = err
else:
    try:
        ishape = model_type.input_shape
        if ishape and len(ishape) >= 3:
            h, w = ishape[1], ishape[2]
            if isinstance(h, int) and isinstance(w, int):
                MODEL2_SIZE = (h, w)
    except Exception:
        pass

# Model classes (keep in-sync with how models were trained)
CATEGORY_CLASSES = [
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy"
]

TYPE_CLASSES = [
    "Bacteria",
    "Fungi",
    "Healthy",
    "Nematode",
    "Pest",
    "Phytopthora",
    "Virus"
]

# ------------- ROUTES -------------
@app.route("/", methods=["GET"])
def health():
    """Health check: returns model load status and input sizes used."""
    return jsonify({
        "status": "ok",
        "model_category_loaded": model_category is not None,
        "model_type_loaded": model_type is not None,
        "model1_size": MODEL1_SIZE,
        "model2_size": MODEL2_SIZE,
        "model_load_errors": model_load_errors
    })

@app.route("/predict", methods=["POST"])
def predict():
    # Basic validations
    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    f = request.files["file"]
    if f.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(f.filename):
        return jsonify({"error": "File type not allowed"}), 400

    if (model_category is None) or (model_type is None):
        return jsonify({"error": "Models not loaded on server", "model_load_errors": model_load_errors}), 503

    # Save file safely
    try:
        filename, file_path = safe_save_file(f)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to save file", "detail": str(e)}), 500

    try:
        # Preprocess separately for the two models (different sizes)
        img_for_cat = preprocess_for_size(file_path, MODEL1_SIZE)
        img_for_type = preprocess_for_size(file_path, MODEL2_SIZE)

        # Predict using separate inputs
        pred1 = model_category.predict(img_for_cat)
        cat_idx = int(np.argmax(pred1, axis=1)[0])
        cat_label = CATEGORY_CLASSES[cat_idx] if 0 <= cat_idx < len(CATEGORY_CLASSES) else "Unknown"
        cat_conf = float(np.max(pred1)) * 100.0
        cat_conf = round(cat_conf, 2)

        pred2 = model_type.predict(img_for_type)
        type_idx = int(np.argmax(pred2, axis=1)[0])
        type_label = TYPE_CLASSES[type_idx] if 0 <= type_idx < len(TYPE_CLASSES) else "Unknown"
        type_conf = float(np.max(pred2)) * 100.0
        type_conf = round(type_conf, 2)

        return jsonify({
            "category_prediction": cat_label,
            "category_confidence": cat_conf,
            "disease_type_prediction": type_label,
            "disease_type_confidence": type_conf,
            "filename": filename
        })

    except Exception as e:
        # print stack trace to logs (HF Spaces show logs)
        traceback.print_exc()
        return jsonify({"error": "Prediction failed", "detail": str(e)}), 500

@app.route("/view_image/<filename>", methods=["GET"])
def view_image(filename):
    # Prevent directory traversal
    safe_name = secure_filename(filename)
    path = os.path.join(app.config["UPLOAD_FOLDER"], safe_name)
    if os.path.exists(path):
        return send_file(path, mimetype="image/jpeg")
    return jsonify({"error": "Image not found"}), 404

# ------------- RUN -------------
if __name__ == "__main__":
    # Debug prints for local run
    print("Starting AgriLeafNet backend...")
    print("Model load errors:", model_load_errors)
    print("Model1 size (used):", MODEL1_SIZE)
    print("Model2 size (used):", MODEL2_SIZE)
    app.run(host="0.0.0.0", port=7860, debug=True)
