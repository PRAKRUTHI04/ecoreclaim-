import os
import json
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import matplotlib.pyplot as plt

# 📁 Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODEL_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODEL_DIR, "mobilenetv2_e_waste.h5")
CLASS_INDICES_PATH = os.path.join(MODEL_DIR, "class_indices.json")

# ✅ Load model
model = load_model(MODEL_PATH)

# ✅ Load class index mapping
with open(CLASS_INDICES_PATH, 'r') as f:
    class_indices = json.load(f)

# Invert dict to get index → class name
index_to_class = {v: k for k, v in class_indices.items()}

# 🔍 Load and preprocess image
def predict_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = preprocess_input(img_array)  # Normalizes like training
    img_array = np.expand_dims(img_array, axis=0)

    preds = model.predict(img_array)
    predicted_index = np.argmax(preds)
    confidence = np.max(preds)
    predicted_label = index_to_class[predicted_index]

    # 🖼️ Show image and prediction
    plt.imshow(img)
    plt.title(f"Prediction: {predicted_label} ({confidence*100:.2f}%)")
    plt.axis('off')
    plt.show()

    print(f"\n🔮 Predicted class: {predicted_label}")
    print(f"📊 Confidence: {confidence:.2f}")

# 🧪 Test it!
# Replace this path with your image path
test_image_path = os.path.join(BASE_DIR, "test_img.jpg")  # <-- update this
predict_image(test_image_path)
