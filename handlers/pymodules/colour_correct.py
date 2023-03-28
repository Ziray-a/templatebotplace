import numpy as np
from PIL import Image, ImageDraw
from pathlib import Path
import sys
import math

# Path to image is first argument.
if (len(sys.argv) < 2):
    print("You didn't give an image! Use like `python colcorrect_2023.py image.png` and please read the instructions :)")
    exit()
    
in_img_path = Path(sys.argv[1])

# Replace these with new palette if needed.
palette = [ 
[109, 0, 26],
[190, 0, 57],
[255, 69, 0],
[255, 168, 0],
[255, 214, 53],
[255, 248, 184],
[0, 163, 104],
[0, 204, 120],
[126, 237, 86],
[0, 117, 111],
[0, 158, 170],
[0, 204, 192],
[36, 80, 164],
[54, 144, 234],
[81, 233, 244],
[73, 58, 193],
[106, 92, 255],
[148, 179, 255],
[129, 30, 159],
[180, 74, 192],
[228, 171, 255],
[222, 16, 127],
[255, 56, 129],
[255, 153, 170],
[109, 72, 47],
[156, 105, 38],
[255, 180, 112],
[0, 0, 0],
[81, 82, 82],
[137, 141, 144],
[212, 215, 217],
[255, 255, 255]
]

# Open for editing.
img = Image.open(in_img_path)
img = img.convert('RGBA')
img_arr = np.array(img)
draw = ImageDraw.Draw(img)

# Computes Pythagorean distance between a given colour and one in the palette, as if 3D vectors.
# Slightly weighted for human perception.
def rgb_pythag(r, g, b, palette_index):
    return  math.sqrt(((r - palette[palette_index][0]) * 0.3) ** 2 + ((g - palette[palette_index][1]) * 0.59) ** 2 + ((b - palette[palette_index][2]) * 0.11) ** 2)

# Per pixel
for x in range(img_arr.shape[1]):
    for y in range(img_arr.shape[0]):
        R, G, B, A = img.getpixel((x,y))

        # Don't touch transparent pixels.
        if (A == 0):
            continue

        # Find palette colour with minimum distance
        closest_dist = rgb_pythag(R, G, B, 0)
        closest = 0 
        for i in range(len(palette)):
            dist = rgb_pythag(R, G, B, i)
            if dist <= closest_dist:
                closest_dist = dist
                closest = i
        # Draw pixel using the closest found colour.
        draw.point((x,y), (palette[closest][0], palette[closest][1], palette[closest][2]))

# Save the adjusted image as a separate file.
# slightly adjusted for Template bot use where raw templates are seperated from finished templates.               
img.save(in_img_path.parent +"/colorcorrected/" +in_img_path.stem +".png")