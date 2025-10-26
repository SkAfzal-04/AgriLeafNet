# ===========================================
# 🥔 POTATO LEAF DISEASE DETECTION (LOCAL FLASK APP)
# ===========================================

# 📦 IMPORTS
from flask import Flask, request, render_template_string, send_file
from keras.models import load_model
from keras.preprocessing import image
import numpy as np
import os

# ===========================================
# ⚙️ CONFIGURATION
# ===========================================
MODEL_PATH = "potato_leaf_disease_cnn_model.keras"  # your trained model file
IMG_SIZE = (224, 224)

# Load the trained model
model = load_model(MODEL_PATH)

# Classes (same order as your model’s output layer)
classes = ['Bacteria', 'Fungi', 'Healthy', 'Nematode', 'Pest', 'Phytopthora', 'Virus']

# Initialize Flask app
app = Flask(__name__)

# ===========================================
# 🎨 HTML TEMPLATE
# ===========================================
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Potato Leaf Disease Detection</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f7f9fa;
            text-align: center;
            margin-top: 60px;
        }
        h2 {
            color: #333;
        }
        form {
            margin: 20px auto;
            padding: 20px;
            border: 2px solid #ddd;
            border-radius: 10px;
            width: 320px;
            background: #fff;
        }
        input[type="file"] {
            margin-bottom: 15px;
        }
        .result {
            margin-top: 30px;
        }
        img {
            width: 224px;
            height: 224px;
            border-radius: 8px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <h2>🥔 Potato Leaf Disease Detection</h2>
    <form action="/predict" method="post" enctype="multipart/form-data">
        <input type="file" name="file" accept="image/*" required><br>
        <input type="submit" value="Predict">
    </form>

    {% if result %}
    <div class="result">
        <h3>Predicted Class: {{ result }}</h3>
        <h4>Confidence: {{ confidence }}%</h4>
        <img src="{{ img_url }}" alt="Uploaded Image">
    </div>
    {% endif %}
</body>
</html>
'''

# ===========================================
# 🏠 HOME ROUTE
# ===========================================
@app.route('/', methods=['GET'])
def home():
    return render_template_string(HTML_TEMPLATE)

# ===========================================
# 🔍 PREDICT ROUTE
# ===========================================
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return render_template_string(HTML_TEMPLATE, result="No file uploaded!")

    f = request.files['file']
    if f.filename == '':
        return render_template_string(HTML_TEMPLATE, result="No file selected!")

    # Save uploaded image temporarily
    upload_folder = "uploads"
    os.makedirs(upload_folder, exist_ok=True)
    file_path = os.path.join(upload_folder, f.filename)
    f.save(file_path)

    # Preprocess image
    img = image.load_img(file_path, target_size=IMG_SIZE)
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Predict
    pred = model.predict(img_array)
    predicted_class = classes[np.argmax(pred)]
    confidence = round(float(np.max(pred)) * 100, 2)

    img_url = f"/view_image/{f.filename}"

    return render_template_string(HTML_TEMPLATE, result=predicted_class, confidence=confidence, img_url=img_url)

# ===========================================
# 🖼️ IMAGE DISPLAY ROUTE
# ===========================================
@app.route('/view_image/<filename>')
def view_image(filename):
    file_path = os.path.join("uploads", filename)
    return send_file(file_path, mimetype='image/jpeg')

# ===========================================
# 🚀 RUN APP LOCALLY
# ===========================================
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=7860, debug=True)

