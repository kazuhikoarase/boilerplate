import time
import pygame

pygame.mixer.init() 
print pygame.mixer.get_init() 

alert=pygame.mixer.Sound('phone2.ogg')
alert.play()

time.sleep(5)
