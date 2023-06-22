import sys
from pathlib import Path
import os
from PIL import Image
import numpy as np

if (len(sys.argv) < 2):
    print("You didn't give an image!")
    exit()
    


def template_to_truefalse(target_filepath):
    img = Image.open(target_filepath).convert('RGBA')  # make sure image is RGBA
    img_arr = np.array(img)
    true_false_arr = np.zeros((img_arr.shape[0], img_arr.shape[1]), dtype=bool)
    for x in range(img_arr.shape[1]):
        for y in range(img_arr.shape[0]):
            R, G, B, A = img.getpixel((x,y))

         # decide if pixel is true (has alpha) or false (doesn't have alpha)
            if (A == 0):
                true_false_arr[y][x] = True
            else:
                true_false_arr[y][x] = False
    return true_false_arr


path_original = Path(sys.argv[1])
path_new=Path(sys.argv[2])

tf_original = template_to_truefalse(path_original).tolist()
tf_new = template_to_truefalse(path_new).tolist()

if all([tf_original[x][y]==tf_new[x][y] for x in range(len(tf_original)) for y in range(len(tf_original[0])) ]):
    print("true", end="")
else:
    print("false", end="")




