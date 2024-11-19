import hmac
import hashlib
import numpy as np
import cv2

# Constants for image and watermark dimensions
IMG_WIDTH = 1200
IMG_HEIGHT = 800
WATERMARK_WIDTH = 256
WATERMARK_HEIGHT = 256

IMG_SIZE = IMG_HEIGHT * IMG_WIDTH
WATERMARK_SIZE = WATERMARK_HEIGHT * WATERMARK_WIDTH
THRESH = 75  # Threshold for mean neighbor value

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

def xor(x, y):
    """
    XOR function to combine the master and watermark images.
    """
    if x == 0 and y == 0:
        return 0
    elif x == 0 and y != 0:
        return 255
    elif x != 0 and y == 0:
        return 255
    elif x != 0 and y != 0:
        return 0

def mean_neighbour(img, x, y):
    val = 0
    num = 0

    # Check each neighbor with bounds check
    
    # Center pixel
    if 0 <= x < IMG_HEIGHT and 0 <= y < IMG_WIDTH:
        val += img[x, y]
        num += 1
    
    # Top-right pixel
    if 0 <= x + 1 < IMG_HEIGHT and 0 <= y + 1 < IMG_WIDTH:
        val += img[x + 1, y + 1]
        num += 1
    
    # Bottom-left pixel
    if 0 <= x - 1 < IMG_HEIGHT and 0 <= y - 1 < IMG_WIDTH:
        val += img[x - 1, y - 1]
        num += 1
    
    # Right pixel
    if 0 <= x + 1 < IMG_HEIGHT and 0 <= y < IMG_WIDTH:
        val += img[x + 1, y]
        num += 1
    
    # Bottom pixel
    if 0 <= x < IMG_HEIGHT and 0 <= y + 1 < IMG_WIDTH:
        val += img[x, y + 1]
        num += 1
    
    # Top-left pixel
    if 0 <= x + 1 < IMG_HEIGHT and 0 <= y - 1 < IMG_WIDTH:
        val += img[x + 1, y - 1]
        num += 1
    
    # Top pixel
    if 0 <= x - 1 < IMG_HEIGHT and 0 <= y + 1 < IMG_WIDTH:
        val += img[x - 1, y + 1]
        num += 1
    
    # Left pixel
    if 0 <= x - 1 < IMG_HEIGHT and 0 <= y < IMG_WIDTH:
        val += img[x - 1, y]
        num += 1
    
    # Bottom-right pixel
    if 0 <= x < IMG_HEIGHT and 0 <= y - 1 < IMG_WIDTH:
        val += img[x, y - 1]
        num += 1

    return val / float(num) if num > 0 else 0

def stolen_watermark(og_img, key=1001):
    """
    Process the watermarking of the original image with the given watermark using the key.
    """
    # Threshold watermark image to binary
    
    master_img = np.zeros((WATERMARK_WIDTH, WATERMARK_HEIGHT, 1), np.uint8)
    
    
    # Generate secure random points
    secure_random_points = secure_seeded_random_points(key, IMG_SIZE, WATERMARK_SIZE)

    i = 0
    j = 0

    for k in secure_random_points:
        x = int(k / IMG_WIDTH)
        y = int(k % IMG_WIDTH)
        # Process based on the mean neighbor value
        if mean_neighbour(og_img, x, y) > THRESH:
            master_img[i, j] = 255
        j += 1
        if j == WATERMARK_WIDTH:
            j = 0
            i += 1



    return master_img
