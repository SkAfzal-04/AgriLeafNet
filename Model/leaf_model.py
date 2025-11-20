import os

# ==========================================
# 🔒 HARDEN AGAINST random_device FAILURE
# ==========================================
# Must be set BEFORE importing torch
os.environ["PYTHONHASHSEED"] = "0"
os.environ["CUDA_VISIBLE_DEVICES"] = ""
os.environ["CUBLAS_WORKSPACE_CONFIG"] = ":16:8"
os.environ["MKL_SERVICE_FORCE_INTEL"] = "1"
os.environ["FORCE_CPU"] = "1"
os.environ["PYTORCH_ENABLE_MPS_FALLBACK"] = "1"

# ============================
# Imports
# ============================
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

# ============================
# Build EfficientNet-B0 model
# ============================
def build_model():
    model = models.efficientnet_b0(weights=None)
    model.classifier[1] = nn.Linear(1280, 2)
    return model

model = build_model()

# Load your trained weights
model.load_state_dict(
    torch.load("leaf_nonleaf.pth", map_location="cpu")
)
model.eval()

# ============================
# Preprocessing
# ============================
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

CLASSES = ["leaf", "non_leaf"]

# ============================
# Prediction
# ============================
def predict_leaf_nonleaf(img_path):
    img = Image.open(img_path).convert("RGB")
    tensor = transform(img).unsqueeze(0)

    with torch.no_grad():
        out = model(tensor)
        pred = torch.argmax(out, dim=1).item()
        print(pred)

    return CLASSES[pred]
