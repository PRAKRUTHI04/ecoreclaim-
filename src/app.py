from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image as keras_image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import json

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../models/mobilenetv2_e_waste.h5")
CLASS_INDICES_PATH = os.path.join(BASE_DIR, "../models/class_indices.json")

# Load model and classes
model = load_model(MODEL_PATH)
with open(CLASS_INDICES_PATH) as f:
    class_indices = json.load(f)
index_to_class = {v: k for k, v in class_indices.items()}

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    img_file = request.files["image"]
    img = Image.open(img_file.stream).convert("RGB")
    img = img.resize((224, 224))
    img_array = keras_image.img_to_array(img)
    img_array = preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)

    preds = model.predict(img_array)
    pred_index = np.argmax(preds)
    confidence = float(np.max(preds))
    label = index_to_class[pred_index]

    return jsonify({"label": label, "confidence": confidence})

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000)
