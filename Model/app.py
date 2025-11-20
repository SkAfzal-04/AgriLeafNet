# ===========================================
# 🌿 AGRILEAFNET (Three-Model Pipeline)
# PyTorch .pth + Keras models – HF-SAFE VERSION
# ===========================================

import os

# ========= FIX FOR PYTORCH RANDOM_DEVICE FAILURE =========
# Must be defined BEFORE importing torch
os.environ["CUBLAS_WORKSPACE_CONFIG"] = ":16:8"
os.environ["PYTHONHASHSEED"] = "0"
os.environ["CUDA_VISIBLE_DEVICES"] = ""           # Force CPU
os.environ["TORCH_USE_RTLD_GLOBAL"] = "YES"
os.environ["MKL_SERVICE_FORCE_INTEL"] = "1"
os.environ["FORCE_CPU"] = "1"
os.environ["PYTORCH_ENABLE_MPS_FALLBACK"] = "1"
# =========================================================

import uuid
import traceback
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename

from keras.models import load_model
from keras.preprocessing import image
import numpy as np


  


# ------------ CONFIG ------------
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
MAX_CONTENT_LENGTH = 6 * 1024 * 1024  # 6 MB

# CATEGORY + TYPE MODELS (Keras)
CATEGORY_MODEL_PATH = "disease_category_model.keras"
TYPE_MODEL_PATH = "disease_type_model.keras"

CATEGORY_SIZE = (224, 224)
TYPE_SIZE = (256, 256)


# ------------ FLASK APP ------------
app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH

CORS(app, resources={
    r"/*": {"origins": [
        "http://localhost:3000",
        "https://agrileafnet.vercel.app"
    ]}
})

# ------------ HELPERS ------------
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def safe_save_file(file_storage):
    orig = secure_filename(file_storage.filename)
    ext = os.path.splitext(orig)[1] or ".jpg"
    new = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(UPLOAD_FOLDER, new)
    file_storage.save(path)
    return new, path


def preprocess(path, size):
    img = image.load_img(path, target_size=size)
    arr = image.img_to_array(img) / 255.0
    return np.expand_dims(arr, axis=0)


# ------------ LOAD MODELS ------------
def load_keras_model(path):
    try:
        return load_model(path), None
    except Exception as e:
        return None, str(e)
def load_leaf_model(filepath):
    from leaf_model import predict_leaf_nonleaf
    return predict_leaf_nonleaf(filepath)


model_category, err_cat = load_keras_model(CATEGORY_MODEL_PATH)
model_type, err_type = load_keras_model(TYPE_MODEL_PATH)

# AUTO-DETECT INPUT SIZES
try:
    s = model_category.input_shape
    CATEGORY_SIZE = (s[1], s[2])
except:
    pass

try:
    s = model_type.input_shape
    TYPE_SIZE = (s[1], s[2])
except:
    pass


# ------------ CLASSES ------------
LEAF_CLASSES = ["Leaf", "Non-Leaf"]

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
    "Phytophthora",
    "Virus"
]


# ------------ ROUTES ------------

@app.route("/", methods=["GET"])
def health():
    return jsonify({
        "status": "running",
        "models": {
            "leaf_loaded": True,  # PyTorch model always loads
            "category_loaded": model_category is not None,
            "type_loaded": model_type is not None
        },
        "errors": {
            "leaf": None,
            "category": err_cat,
            "type": err_type
        },
        "sizes": {
            "category": CATEGORY_SIZE,
            "type": TYPE_SIZE
        }
    })


@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    # SAVE FILE
    filename, filepath = safe_save_file(file)

    try:
        # --- STEP 1: LEAF / NON-LEAF (Pytorch model) ---
        leaf_label = load_leaf_model(filepath)

        if leaf_label == "non_leaf":
            return jsonify({
                "is_leaf": False,
                "message": "Uploaded image is not a leaf.",
                "filename": filename
            }), 400

        # --- STEP 2: CATEGORY ---
        cat_img = preprocess(filepath, CATEGORY_SIZE)
        pred_cat = model_category.predict(cat_img)
        cat_idx = int(np.argmax(pred_cat))
        cat_label = CATEGORY_CLASSES[cat_idx]
        cat_conf = round(float(np.max(pred_cat)) * 100, 2)

        # --- STEP 3: TYPE ---
        type_img = preprocess(filepath, TYPE_SIZE)
        pred_type = model_type.predict(type_img)
        type_idx = int(np.argmax(pred_type))
        type_label = TYPE_CLASSES[type_idx]
        type_conf = round(float(np.max(pred_type)) * 100, 2)

        return jsonify({
            "is_leaf": True,
            "category_prediction": cat_label,
            "category_confidence": cat_conf,
            "disease_type_prediction": type_label,
            "disease_type_confidence": type_conf,
            "filename": filename
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "error": "Prediction failed",
            "detail": str(e)
        }), 500


@app.route("/view_image/<filename>")
def view_image(filename):
    safe_name = secure_filename(filename)
    path = os.path.join(UPLOAD_FOLDER, safe_name)
    if os.path.exists(path):
        return send_file(path, mimetype="image/jpeg")
    return jsonify({"error": "Not found"}), 404


if __name__ == "__main__":
    print("🚀 Starting AgriLeafNet Backend...")
    print("Category model error:", err_cat)
    print("Type model error:", err_type)
    app.run(host="0.0.0.0", port=7860, debug=True)
