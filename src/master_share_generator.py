import cv2
import hashlib
import hmac
import numpy as np

# Constants for image and watermark dimensions
IMG_WIDTH = 1200
IMG_HEIGHT = 800
WATERMARK_WIDTH = 256
WATERMARK_HEIGHT = 256

IMG_SIZE = IMG_HEIGHT * IMG_WIDTH
WATERMARK_SIZE = WATERMARK_HEIGHT * WATERMARK_WIDTH

KEY = 1001
THRESH = 75


def secure_seeded_random_points(seed, img_size, watermark_size):
    """
    Generate secure random points based on HMAC and a seed value.
    """
    seed_bytes = str(seed).encode('utf-8')  # Convert seed to bytes
    points = []

    for i in range(watermark_size):
        h = hmac.new(seed_bytes, str(i).encode('utf-8'), hashlib.sha256)
        point = int(h.hexdigest(), 16) % img_size
        points.append(point)

    return points


def mean_neighbour(img, x, y):
    """
    Calculate the mean value of neighboring pixels for a given point.
    """
    val = 0
    num = 0

    offsets = [
        (0, 0), (1, 1), (-1, -1), (1, 0), (0, 1),
        (1, -1), (-1, 1), (-1, 0), (0, -1)
    ]

    for dx, dy in offsets:
        i, j = x + dx, y + dy
        if 0 <= i < IMG_HEIGHT and 0 <= j < IMG_WIDTH:
            val += img[i, j]
            num += 1

    return val / float(num) if num > 0 else 0


def generate_duplicate_masters(input_dir, output_dir, num_images, key=KEY):
    """
    Generate duplicate master images from a directory of stolen images.
    :param input_dir: Directory containing stolen images
    :param output_dir: Directory to save generated master images
    :param num_images: Number of images to process
    :param key: Seed key for secure random point generation
    """
    secure_random_points = secure_seeded_random_points(key, IMG_SIZE, WATERMARK_SIZE)

    for cnt in range(num_images):
        # Load the stolen image in grayscale
        stolen_image_path = f"{input_dir}/stolen_image_{cnt}.jpg"
        og_img = cv2.imread(stolen_image_path, 0)
        if og_img is None:
            print(f"Warning: Could not read {stolen_image_path}. Skipping...")
            continue

        # Initialize master image as a blank grayscale image
        master_img = np.zeros((WATERMARK_WIDTH, WATERMARK_HEIGHT), np.uint8)

        i, j = 0, 0
        for k in secure_random_points:
            x = int(k / IMG_WIDTH)
            y = int(k % IMG_WIDTH)
            if mean_neighbour(og_img, x, y) > THRESH:
                master_img[i, j] = 255
            j += 1
            if j == WATERMARK_WIDTH:
                j = 0
                i += 1

        master_image_path = f"{output_dir}/master_img_{cnt}.jpg"
        cv2.imwrite(master_image_path, master_img)
        print(f"Saved: {master_image_path}")

    print("All duplicate master images generated successfully.")
