# -*- coding: utf-8 -*-
import socket
import os
import _rpi_ws281x as ws
import sys

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
LED_2_BRIGHTNESS = 32     # Set to 0 for darkest and 255 for brightest
LED_2_INVERT     = False   # True to invert the signal (when using NPN transistor level shift)
LED_2_CHANNEL    = 1

if __name__ == '__main__':
    leds = ws.new_ws2811_t()

    # Initialize all channels to off
    for channum in range(2):
        channel = ws.ws2811_channel_get(leds, channum)
        ws.ws2811_channel_t_count_set(channel, 0)
        ws.ws2811_channel_t_gpionum_set(channel, 0)
        ws.ws2811_channel_t_invert_set(channel, 0)
        ws.ws2811_channel_t_brightness_set(channel, 0)

    channel = ws.ws2811_channel_get(leds, LED_CHANNEL)
    channel2 = ws.ws2811_channel_get(leds, LED_2_CHANNEL)

    ws.ws2811_channel_t_count_set(channel, LED_COUNT)
    ws.ws2811_channel_t_gpionum_set(channel, LED_PIN)
    ws.ws2811_channel_t_invert_set(channel, LED_INVERT)
    ws.ws2811_channel_t_brightness_set(channel, LED_BRIGHTNESS)

    ws.ws2811_channel_t_count_set(channel2, LED_2_COUNT)
    ws.ws2811_channel_t_gpionum_set(channel2, LED_2_PIN)
    ws.ws2811_channel_t_invert_set(channel2, LED_2_INVERT)
    ws.ws2811_channel_t_brightness_set(channel2, LED_2_BRIGHTNESS)

    ws.ws2811_t_freq_set(leds, LED_FREQ_HZ)
    ws.ws2811_t_dmanum_set(leds, LED_DMA)

    # Initialize library with LED configuration.
    resp = ws.ws2811_init(leds)
    if resp != ws.WS2811_SUCCESS:
        message = ws.ws2811_get_return_t_str(resp)
        raise RuntimeError('ws2811_init failed with code {0} ({1})'.format(resp, message))

    if os.path.exists("/tmp/app.main"):
        os.remove("/tmp/app.main")

    print("Opening socket...")
    sys.stdout.flush()
    server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    server.bind("/tmp/app.main")
    server.listen(5)

    try:
        print("Listening...")
        sys.stdout.flush()
        index = 0
        no_data = 0
        while True:
            conn, addr = server.accept()

            print("accepted connection")
            sys.stdout.flush()

            while True:

                data = conn.recv(6120) # 6120 is number of bytes for an entire frame of the LED wall.
                if not data:
                    break
                else:
                    for i in range(0, len(data), 3):
                        # Write to appropriate strip
                        if index < LED_COUNT:
                            ws.ws2811_led_set(channel, index, (ord(data[i + 1]) << 16) | (ord(data[i]) << 8) | ord(data[i + 2]))
                        else:
                            ws.ws2811_led_set(channel2, index - LED_COUNT, (ord(data[i + 1]) << 16) | (ord(data[i]) << 8) | ord(data[i + 2]))

                        # Increment the pixel index
                        index += 1

                        # Check whether end of frame has been reached and if so reset pixel index and show pixels
                        if index == LED_COUNT + LED_2_COUNT:
                            index = 0
                            # Send the LED color data to the hardware.
                            resp = ws.ws2811_render(leds)
                            if resp != ws.WS2811_SUCCESS:
                                message = ws.ws2811_get_return_t_str(resp)
                                raise RuntimeError('ws2811_render failed with code {0} ({1})'.format(resp, message))
                            # TODO - sleep here 0.25?
                            r = 'Done'
                            conn.send(r.encode())
                if data == "DONE":
                    break
        print("-" * 20)
        print("Shutting down...")
        sys.stdout.flush()
        server.close()
        os.remove("/tmp/app.main")
        print("Done")
        sys.stdout.flush()
    finally:
        # Ensure ws2811_fini is called before the program quits.
        ws.ws2811_fini(leds)
        # Example of calling delete function to clean up structure memory.  Isn't
        # strictly necessary at the end of the program execution here, but is good practice.
        ws.delete_ws2811_t(leds)
