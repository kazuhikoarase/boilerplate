#
#

import pathlib
import time
import numpy as np
import PIL
import RPi.GPIO as GPIO
import luma.core.interface.serial as serial
import luma.core.render as render
import luma.lcd.device as device

def log(msg):
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    print(f"{timestamp} - {msg}")

# https://www.waveshare.com/wiki/1.3inch_LCD_HAT
class LCD_HAT:
    KEY1 = 21            # KEY1GPIO
    KEY2 = 20            # KEY2GPIO
    KEY3 = 16            # KEY3GPIO
    JOYSTICK_UP = 6      # Upward direction of the Joystick
    JOYSTICK_DOWN = 19   # Downward direction of the Joystick
    JOYSTICK_LEFT = 5    # Left direction of the Joystick
    JOYSTICK_RIGHT = 26  # Right direction of the Joystick
    JOYSTICK_PRESS = 13  # Press the Joystick
    SCLK = 11            # SPI clock line
    MOSI = 10            # SPI data line
    CS = 8               # Chip selection
    DC = 25              # Data/Command control
    RST = 27             # Reset
    BL = 24              # Backlight


script_path = pathlib.Path(__file__).resolve()
script_dir = script_path.parent

log(f"cwd: {script_dir}")

log("setup start")

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(LCD_HAT.BL, GPIO.OUT)
GPIO.output(LCD_HAT.BL, GPIO.HIGH)

def key1_handler(channel):
  log("key1!")

def key2_handler(channel):
  log("key2!")

def key3_handler(channel):
  log("key3!")

GPIO.setup(LCD_HAT.KEY1, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(LCD_HAT.KEY2, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(LCD_HAT.KEY3, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.add_event_detect(LCD_HAT.KEY1, GPIO.FALLING, callback=key1_handler, bouncetime=200)
GPIO.add_event_detect(LCD_HAT.KEY2, GPIO.FALLING, callback=key2_handler, bouncetime=200)
GPIO.add_event_detect(LCD_HAT.KEY3, GPIO.FALLING, callback=key3_handler, bouncetime=200)


log("setup end")

spi = serial.spi(port=0, device=0, gpio_DC=LCD_HAT.DC, gpio_RST=LCD_HAT.RST,
             reset_hold_time=0.2, reset_release_time=0.2)

dev = device.st7789(spi, rotate=0, width=240, height=240, spi_max_speed=80000000, active_low=True)

width = dev.width
height = dev.height
cx = width // 2
cy = height // 2

log(f"color mode:{dev.mode}")

pixel_buffer = np.zeros((height, width, 3), dtype=np.uint8)
pixel_buffer[cy - 5 : cy + 5, cx - 5 : cx + 5] = [255, 255, 0]


log("buffer set start")
"""
for x in range(0, width):
  for y in range(0, height):
    pixel_buffer[y, x] = [256 * x // width, 256 * y // height, 0]
"""

#csize = 15;
csize = 1;
for x in range(0, width // csize):
  for y in range(0, height // csize):
    pixel_buffer[y * csize : y * csize + csize,
                 x * csize : x * csize + csize] = [256 * x * csize // width,
                                                   256 * y * csize // height, 0]
log("buffer set end")


image = PIL.Image.fromarray(pixel_buffer, mode = "RGB")


log(f"image color mode:{image.mode}")


#dev.image = image.copy()


draw = PIL.ImageDraw.Draw(image)


log("draw.point start")
"""
for x in range(0, width):
  for y in range(0, height):
    draw.point((x, y), fill=(256 * x // width, 256 * y // height, 0) )
"""
log("draw.point end")

draw.point((cx, cy), fill="white")
draw.point((cx + 1, cy + 1), fill="blue")


"""
with render.canvas(dev) as draw :
    # draw.rectangle((x1, y1, x2, y2), fill='color')
    #draw.rectangle(dev.bounding_box, fill="black")
    # draw.point((x, y), fill='color')
    draw.point((cx, cy), fill="white")
    draw.point((cx + 1, cy + 1), fill="blue")
"""

draw.point((cx + 1, cy + 0), fill=(255,0,255) )
draw.point((cx + 2, cy + 0), fill=(255,0,255) )
draw.point((cx + 3, cy + 0), fill=(255,0,255) )

log("display image...")

file_name = "dai.png"
#file_name = "halloween2025.png"
image_png = PIL.Image.open(script_dir / file_name)

dev.display(image_png)
#dev.display(image)


log("go into infinity loop.")

try:
    while True:
        time.sleep(10)
except KeyboardInterrupt:
    print("exit program.")
