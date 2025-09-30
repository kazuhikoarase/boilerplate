#
#

import time
import RPi.GPIO as GPIO
import luma.core.interface.serial as serial
import luma.core.render as render
import luma.lcd.device as device

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

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(LCD_HAT.BL, GPIO.OUT)
GPIO.output(LCD_HAT.BL, GPIO.HIGH)

def key1_handler(channel):
  print("key1!")

def key2_handler(channel):
  print("key2!")

def key3_handler(channel):
  print("key3!")

GPIO.setup(LCD_HAT.KEY1, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(LCD_HAT.KEY2, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(LCD_HAT.KEY3, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.add_event_detect(LCD_HAT.KEY1, GPIO.FALLING, callback=key1_handler, bouncetime=200)
GPIO.add_event_detect(LCD_HAT.KEY2, GPIO.FALLING, callback=key2_handler, bouncetime=200)
GPIO.add_event_detect(LCD_HAT.KEY3, GPIO.FALLING, callback=key3_handler, bouncetime=200)

spi = serial.spi(port=0, device=0, gpio_DC=LCD_HAT.DC, gpio_RST=LCD_HAT.RST,
             reset_hold_time=0.2, reset_release_time=0.2)

dev = device.st7789(spi, rotate=0, width=240, height=240, spi_max_speed=80000000, active_low=True)

width = dev.width
height = dev.height
center_x = width // 2
center_y = height // 2

with render.canvas(dev) as draw:
    # draw.rectangle((x1, y1, x2, y2), fill='color')
    draw.rectangle(dev.bounding_box, fill="black")
    # draw.point((x, y), fill='color')
    draw.point((center_x, center_y), fill="white")
    draw.point((center_x + 1, center_y + 1), fill="blue")

print("go into infinity loop.")

try:
    while True:
        time.sleep(10)
except KeyboardInterrupt:
    print("exit program.")
