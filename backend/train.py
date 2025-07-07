import os
import json
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

from data_utils import get_data_generators

# 📁 Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = os.path.join(BASE_DIR, "e_waste_dataset")
MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)

train_path = os.path.join(DATA_DIR, "train")
val_path = os.path.join(DATA_DIR, "val")
test_path = os.path.join(DATA_DIR, "test")

# 📦 Load data
print("📦 Loading data...")
train_gen, val_gen, _ = get_data_generators(train_path, val_path, test_path)

# 🔧 Build MobileNetV2 model
print("🔧 Building model...")
base_model = MobileNetV2(include_top=False, weights='imagenet', input_shape=(224, 224, 3))
base_model.trainable = False  # Freeze base initially

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.3)(x)
x = Dense(128, activation='relu')(x)
x = Dropout(0.3)(x)
output = Dense(train_gen.num_classes, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=output)
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

model.summary()

# ⏺️ Callbacks
model_path = os.path.join(MODEL_DIR, "mobilenetv2_e_waste.h5")
class_indices_path = os.path.join(MODEL_DIR, "class_indices.json")

callbacks = [
    EarlyStopping(patience=5, restore_best_weights=True),
    ModelCheckpoint(model_path, save_best_only=True)
]

# 🚀 Train top layers first
print("🚀 Training top layers...")
model.fit(train_gen, validation_data=val_gen, epochs=5, callbacks=callbacks)

# 🔄 Fine-tune base model
print("🔓 Unfreezing base model for fine-tuning...")
base_model.trainable = True

for layer in base_model.layers[:-20]:  # Unfreeze last 20 layers
    layer.trainable = False

model.compile(optimizer=tf.keras.optimizers.Adam(1e-5),
              loss='categorical_crossentropy',
              metrics=['accuracy'])

print("🔁 Fine-tuning entire model...")
model.fit(train_gen, validation_data=val_gen, epochs=10, callbacks=callbacks)

# 💾 Save class indices
with open(class_indices_path, 'w') as f:
    json.dump(train_gen.class_indices, f)

print(f"\n✅ Training complete!")
print(f"📁 Model saved to: {model_path}")
print(f"📁 Class labels saved to: {class_indices_path}")
