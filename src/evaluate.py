import os
import json
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# 📁 Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = os.path.join(BASE_DIR, "e_waste_dataset")
MODEL_DIR = os.path.join(BASE_DIR, "models")

MODEL_PATH = os.path.join(MODEL_DIR, "mobilenetv2_e_waste.h5")
CLASS_INDICES_PATH = os.path.join(MODEL_DIR, "class_indices.json")
TEST_DIR = os.path.join(DATA_DIR, "test")

# ✅ Load model
print("📥 Loading trained model...")
model = load_model(MODEL_PATH)

# ✅ Load saved class indices
with open(CLASS_INDICES_PATH, 'r') as f:
    class_indices = json.load(f)

# 🔁 Ensure test generator uses same class order
class_names = list(class_indices.keys())

# ✅ Load test data
print("📦 Loading test data...")
test_datagen = ImageDataGenerator(rescale=1./255)
test_generator = test_datagen.flow_from_directory(
    TEST_DIR,
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    shuffle=False,
    classes=class_names  # 🔑 Align class order
)

# 🧪 Evaluate
print("🔍 Evaluating on test data...")
loss, accuracy = model.evaluate(test_generator)

print(f"\n✅ Test Accuracy: {accuracy * 100:.2f}%")
print(f"📉 Test Loss: {loss:.4f}")
