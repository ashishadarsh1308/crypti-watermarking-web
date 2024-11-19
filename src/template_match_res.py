# import cv2
# import numpy as np

# template = cv2.imread('images\watermark.jpg', 0)

# for k in range(0, 1):
#     img_gray = cv2.imread('images\\regenerated_watermarks\\watermark_img_'+str(k)+'.png', 0)
#     res = cv2.matchTemplate(img_gray,template,cv2.TM_CCOEFF_NORMED)
#     print(res)

import cv2
import numpy as np

# Load the template image
template = cv2.imread('images\\watermark.jpg', 0)

# Loop through images for template matching
for k in range(0, 1):
    # Load the regenerated watermark image
    img_gray = cv2.imread(f'images\\regenerated_watermarks\\watermark_img_{k}.png', 0)

    # Perform template matching
    res = cv2.matchTemplate(img_gray, template, cv2.TM_CCOEFF_NORMED)

    # Get the maximum accuracy value from the result
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)

    # Prepare the accuracy message
    accuracy_message = f"Matching Accuracy: {max_val * 100:.2f}%"

    # Create an image to display the accuracy
    output_image = np.zeros((200, 400, 3), dtype=np.uint8)  # Black background
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 0.8
    color = (255, 255, 255)  # White color
    thickness = 2
    text_size = cv2.getTextSize(accuracy_message, font, font_scale, thickness)[0]
    text_x = (output_image.shape[1] - text_size[0]) // 2
    text_y = (output_image.shape[0] + text_size[1]) // 2
    cv2.putText(output_image, accuracy_message, (text_x, text_y), font, font_scale, color, thickness)

    # Show the pop-up with the accuracy
    cv2.imshow(f"Accuracy for Image {k}", output_image)

# Wait for a key press and close all OpenCV windows
cv2.waitKey(0)
cv2.destroyAllWindows()
