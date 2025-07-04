from tensorflow.keras.preprocessing.image import ImageDataGenerator

def get_data_generators(train_dir, val_dir, test_dir, img_size=(224, 224), batch_size=32):
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        zoom_range=0.2,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True
    )

    val_test_datagen = ImageDataGenerator(rescale=1./255)

    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode='categorical'
    )

    val_generator = val_test_datagen.flow_from_directory(
        val_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode='categorical'
    )

    test_generator = val_test_datagen.flow_from_directory(
        test_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode='categorical',
        shuffle=False
    )

    return train_generator, val_generator, test_generator


# ✅ Optional test block — run directly to check
if __name__ == "__main__":
    import os

    BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # Go one level up from /src
    train_path = os.path.join(BASE_DIR, "e_waste_dataset", "train")
    val_path = os.path.join(BASE_DIR, "e_waste_dataset", "val")
    test_path = os.path.join(BASE_DIR, "e_waste_dataset", "test")

    print("Testing data generator loading...")

    train_gen, val_gen, test_gen = get_data_generators(train_path, val_path, test_path)

    print("✅ Class labels found:", train_gen.class_indices)
