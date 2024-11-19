from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
from utils.watermark_utils import process_watermark  # Ensure you have this utility function
from utils.duplicate_masters import stolen_watermark
import requests
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

@app.route('/tester', methods=['GET'])
def health_check():
    """
    Health check endpoint to verify the server is running.
    """
    return jsonify({'status': 'Backend is working'})

@app.route('/process_watermark', methods=['POST'])
def process_watermark_route():
    """
    Endpoint for processing watermark.
    Accepts either uploaded files or URLs as input.
    """
    try:
        # Handle uploaded files
        if 'original_image' in request.files and 'watermark_image' in request.files:
            original_image = request.files['original_image']
            watermark_image = request.files['watermark_image']

            # Read images as grayscale
            og_img = cv2.imdecode(np.frombuffer(original_image.read(), np.uint8), cv2.IMREAD_GRAYSCALE)
            watermark_img = cv2.imdecode(np.frombuffer(watermark_image.read(), np.uint8), cv2.IMREAD_GRAYSCALE)

        # Handle URLs from JSON payload
        elif 'originalImage' in request.json and 'watermarkImage' in request.json:
            original_url = request.json['originalImage']
            watermark_url = request.json['watermarkImage']

            # Download images from URLs
            original_image_response = requests.get(original_url)
            watermark_image_response = requests.get(watermark_url)

            og_img = cv2.imdecode(np.frombuffer(original_image_response.content, np.uint8), cv2.IMREAD_GRAYSCALE)
            watermark_img = cv2.imdecode(np.frombuffer(watermark_image_response.content, np.uint8), cv2.IMREAD_GRAYSCALE)

        else:
            return jsonify({'error': 'Invalid input format. Provide files or valid URLs.'}), 400

        # Process watermark to generate master and owner images
        master_img, owner_img = process_watermark(og_img, watermark_img)

        # Encode the processed images to Base64 format
        _, master_img_encoded = cv2.imencode('.jpg', master_img)
        _, owner_img_encoded = cv2.imencode('.jpg', owner_img)

        master_img_base64 = base64.b64encode(master_img_encoded).decode('utf-8')
        owner_img_base64 = base64.b64encode(owner_img_encoded).decode('utf-8')

        return jsonify({
            'master_image': master_img_base64,
            'owner_image': owner_img_base64
        })

    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500


@app.route('/stolen_watermark', methods=['POST'])
def process_watermark_rout():
    """
    Endpoint for processing watermark.
    Accepts either uploaded files or URLs as input.
    """
    try:
        # Handle uploaded files
        if 'original_image' in request.files:
            original_image = request.files['original_image']
            

            # Read images as grayscale
            og_img = cv2.imdecode(np.frombuffer(original_image.read(), np.uint8), cv2.IMREAD_GRAYSCALE)

        # Handle URLs from JSON payload
        elif 'originalImage' in request.json:
            original_url = request.json['originalImage']
           

            # Download images from URLs
            original_image_response = requests.get(original_url)

            og_img = cv2.imdecode(np.frombuffer(original_image_response.content, np.uint8), cv2.IMREAD_GRAYSCALE)

        else:
            return jsonify({'error': 'Invalid input format. Provide files or valid URLs.'}), 400

        # Process watermark to generate master and owner images
        master_img = stolen_watermark(og_img)

        # Encode the processed images to Base64 format
        _, master_img_encoded = cv2.imencode('.jpg', master_img)

        master_img_base64 = base64.b64encode(master_img_encoded).decode('utf-8')

        return jsonify({
            'master_image': master_img_base64,
        })

    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True)
