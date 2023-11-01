import os
import random
import shutil
from tqdm import tqdm  # Import tqdm for progress bar

# Path to the source folder containing 20 subfolders
source_folder = 'QD'

# Path to the destination folder where random images will be copied
destination_folder = 'C:/Users/gauth/OneDrive/Documents/cours/Createch/AI2/QDLite'

# Number of random images to select from each subfolder
num_images_to_select = 15000

# Iterate through each subfolder in the source folder with tqdm progress bar
for folder_name in tqdm(os.listdir(source_folder), desc='Processing Subfolders', ncols=100):
    folder_path = os.path.join(source_folder, folder_name)

    # Check if the path is a directory
    if os.path.isdir(folder_path):
        # List all files in the subfolder
        all_files = os.listdir(folder_path)
        
        # Randomly select num_images_to_select images
        selected_files = random.sample(all_files, num_images_to_select)

        # Create the destination subfolder if it doesn't exist
        destination_subfolder = os.path.join(destination_folder, folder_name)
        os.makedirs(destination_subfolder, exist_ok=True)

        # Copy selected images to the destination subfolder
        for file_name in selected_files:
            source_file_path = os.path.join(folder_path, file_name)
            destination_file_path = os.path.join(destination_subfolder, file_name)
            shutil.copy(source_file_path, destination_file_path)

print('Random images copied successfully.')
