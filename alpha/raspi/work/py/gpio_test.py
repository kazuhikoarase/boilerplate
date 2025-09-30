import RPi.GPIO as GPIO

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

#GPIO.output(BL, GPIO.LOW)
