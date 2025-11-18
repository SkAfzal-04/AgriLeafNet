# ===========================================
# 🥔 AGRILEAFNET - FLASK BACKEND (for React)
# Two-Model Pipeline Edition
# ===========================================
import os
os.system("pip install flask-cors==3.0.10")

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from keras.models import load_model
from keras.preprocessing import image
import numpy as np

# ===========================================
# ⚙️ MODEL CONFIGURATION
# ===========================================

MODEL1_PATH = "disease_category_model.keras"      # Early / Late / Healthy
MODEL2_PATH = "disease_type_model.keras"          # 7 class disease type model

IMG_SIZE = (256, 256)

# Load the models
model_category = load_model(MODEL1_PATH)
model_type = load_model(MODEL2_PATH)

# Model 1 classes
category_classes = [
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy'
]

# Model 2 classes (7-class)
type_classes = [
    'Bacteria',
    'Fungi',
    'Healthy',
    'Nematode',
    'Pest',
    'Phytopthora',
    'Virus'
]

# ===========================================
# 🌐 FLASK APP SETUP
# ===========================================
app = Flask(__name__)

CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",
            "https://agrileafnet.vercel.app"
        ]
    }
})

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "✅ AgriLeafNet Flask Server is Running!"})


# ===========================================
# 🔍 PREDICT ROUTE (Runs both models)
# ===========================================
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    f = request.files['file']
    if f.filename == '':
        return jsonify({"error": "No file selected"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, f.filename)
    f.save(file_path)

    try:
        img = image.load_img(file_path, target_size=IMG_SIZE)
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # ---------------------------------------
        # 🔹 Model 1 Prediction (Early / Late / Healthy)
        # ---------------------------------------
        pred1 = model_category.predict(img_array)
        class1 = category_classes[np.argmax(pred1)]
        conf1 = round(float(np.max(pred1)) * 100, 2)

        # ---------------------------------------
        # 🔹 Model 2 Prediction (7-class disease type)
        # ---------------------------------------
        pred2 = model_type.predict(img_array)
        class2 = type_classes[np.argmax(pred2)]
        conf2 = round(float(np.max(pred2)) * 100, 2)

        return jsonify({
            "category_prediction": class1,
            "category_confidence": conf1,
            "disease_type_prediction": class2,
            "disease_type_confidence": conf2
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===========================================
# 🖼️ VIEW IMAGE (Optional)
# ===========================================
@app.route('/view_image/<filename>')
def view_image(filename):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(file_path):
        return send_file(file_path, mimetype='image/jpeg')
    return jsonify({"error": "Image not found"}), 404


# ===========================================
# 🚀 RUN APP
# ===========================================
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=7860, debug=True)
