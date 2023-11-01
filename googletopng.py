import os
import numpy as np
import cv2
from tqdm import tqdm

# Input and output directories
input_folder = "E:\DATASET\Reduced 20 classes"
output_folder = "QD/"

# Iterate through all .npy files in the input folder with tqdm
for file_name in tqdm(os.listdir(input_folder), desc="Processing .npy files"):
    if file_name.endswith(".npy"):
        # Load the .npy file
        npy_file_path = os.path.join(input_folder, file_name)
        data = np.load(npy_file_path, allow_pickle=True, encoding='latin1')

        # Extract and save images in corresponding output folder
        class_name = os.path.splitext(file_name)[0]  # Get the name of the file without extension
        class_output_folder = os.path.join(output_folder, class_name)

        # Create the output folder if it doesn't exist
        os.makedirs(class_output_folder, exist_ok=True)

        # Iterate through the bitmaps and save them as PNG files with tqdm
        for i, bitmap in enumerate(tqdm(data, desc=f"Processing {file_name}")):
            # Reshape the 1D array to 2D (28x28) for the image
            image_array = bitmap.reshape(28, 28)

            # Save the image as a PNG file in the corresponding class folder
            png_file_path = os.path.join(class_output_folder, f"image_{i}.png")
            cv2.imwrite(png_file_path, image_array)

# Print a message after processing is complete
print("Processing complete.")