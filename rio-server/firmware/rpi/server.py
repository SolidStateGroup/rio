# -*- coding: utf-8 -*-
import socket
import os
import json

from neopixel import *

# LED strip configuration:
LED_COUNT      = 1020      # Number of LED pixels.
LED_PIN        = 18      # GPIO pin connected to the pixels (must support PWM!).
LED_FREQ_HZ    = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA        = 5       # DMA channel to use for generating signal (try 5)
LED_BRIGHTNESS = 32     # Set to 0 for darkest and 255 for brightest
LED_INVERT     = False   # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL    = 0

LED_2_COUNT      = 1020      # Number of LED pixels.
LED_2_PIN        = 19      # GPIO pin connected to the pixels (must support PWM!).
LED_2_FREQ_HZ    = 800000  # LED signal frequency in hertz (usually 800khz)
LED_2_DMA        = 5       # DMA channel to use for generating signal (try 5)
LED_2_BRIGHTNESS = 32     # Set to 0 for darkest and 255 for brightest
LED_2_INVERT     = False   # True to invert the signal (when using NPN transistor level shift)
LED_2_CHANNEL    = 1

def blackout(strip):
	for i in range(LED_COUNT):
		strip.setPixelColor(i, Color(0,0,0))
		strip.show()

if __name__ == '__main__':
    # Create NeoPixel object with appropriate configuration.
    strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL)
    strip2 = Adafruit_NeoPixel(LED_2_COUNT, LED_2_PIN, LED_2_FREQ_HZ, LED_2_DMA, LED_2_INVERT, LED_2_BRIGHTNESS, LED_2_CHANNEL)
    # Intialize the library (must be called once before other functions).
    strip.begin()
    strip2.begin()

    # Black out any LEDs that are still on from last run
    #blackout(strip)
    #blackout(strip2)

    if os.path.exists("/tmp/app.main"):
        os.remove("/tmp/app.main")

    print("Opening socket...")
    server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    server.bind("/tmp/app.main")
    server.listen(5)

    print("Listening...")
    index = 0
    no_data = 0
    while True:
        conn, addr = server.accept()

        print("accepted connection")

        while True:

            data = conn.recv(6120) # 6120 is number of bytes for an entire frame of the LED wall.
            if not data:
                break
            else:
                for i in range(0, len(data), 3):
                    # Write to appropriate strip
                    if index < LED_COUNT:
                        strip.setPixelColor(index, (ord(data[i + 1]) << 16) | (ord(data[i]) << 8) | ord(data[i + 2]))
                    else:
                        strip2.setPixelColor(index - LED_COUNT, (ord(data[i + 1]) << 16) | (ord(data[i]) << 8) | ord(data[i + 2]))

                    # Increment the pixel index
                    index += 1

                    # Check whether end of frame has been reached and if so reset pixel index and show pixels
                    if index == 60 * 34:
                        index = 0
                        strip.show()
                        strip2.show()
                        r = 'Done'
                        conn.send(r.encode())
            if data == "DONE":
                break
    print("-" * 20)
    print("Shutting down...")
    server.close()
    os.remove("/tmp/app.main")
    print("Done")
