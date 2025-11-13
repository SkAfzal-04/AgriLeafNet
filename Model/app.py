# ===========================================
# 🥔 AGRILEAFNET - FLASK BACKEND (for React)
# ===========================================

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from keras.models import load_model
from keras.preprocessing import image
import numpy as np
import os

# ===========================================
# ⚙️ CONFIGURATION
# ===========================================
MODEL_PATH = "potato_leaf_disease_cnn_model.keras"  # Path to your model
IMG_SIZE = (224, 224)

# Load model
model = load_model(MODEL_PATH)

# Define class labels
classes = [
    'Bacteria',
    'Fungi',
    'Healthy',
    'Nematode',
    'Pest',
    'Phytopthora',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Virus'
]

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow frontend (React) access from localhost or HF space

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ===========================================
# 🔍 PREDICT ROUTE
# ===========================================
@app.route('/predict', methods=['POST'])
def predict():
    """Handle image upload and prediction."""
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    f = request.files['file']
    if f.filename == '':
        return jsonify({"error": "No file selected"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, f.filename)
    f.save(file_path)

    try:
        # Load and preprocess image
        img = image.load_img(file_path, target_size=IMG_SIZE)
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Predict using model
        preds = model.predict(img_array)
        predicted_class = classes[np.argmax(preds)]
        confidence = round(float(np.max(preds)) * 100, 2)

        return jsonify({
            "prediction": predicted_class,
            "confidence": confidence
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===========================================
# 🖼️ IMAGE SERVE (Optional)
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
