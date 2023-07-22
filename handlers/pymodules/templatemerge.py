import sys
import csv
from pathlib import Path
from os import walk
from PIL import Image
import numpy as np

if (len(sys.argv) < 6):
    print("You didn't give an image!")
    print(sys.argv)
    exit()
    
walk_dir = Path(sys.argv[1])
size_x = int(sys.argv[2])
size_y = int(sys.argv[3])
with open(sys.argv[4], newline='') as f:
    reader = csv.reader(f)
    toggled = list(reader)
new_image_dest=sys.argv[5]
toggled = [item for sublist in toggled for item in sublist]
filenames = next(walk(walk_dir), (None, None, []))[2]
images =[Image.open(walk_dir / filename).convert('RGBA') for filename in filenames if filename.endswith(".png") and filename[:-4] not in toggled]
template_img=Image.new( mode = "RGBA", size = (size_x, size_y) )
template_arr=np.array(template_img)
for image in images:
    imagesize=image.size
    for x in range(imagesize[0]):
        for y in range(imagesize[1]):
            R, G, B, A = image.getpixel((x,y))
            if (A == 0):
                continue
            template_arr[y][x]=[R, G, B, A]
image = Image.fromarray(template_arr, 'RGBA')
image.save(new_image_dest)
    




