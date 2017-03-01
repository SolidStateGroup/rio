 // Pixelwall UDP Sketch for Adafruit Dot Star RGB LED strip.

#include <Ethernet.h>
#include <EthernetUdp.h>
#include <Adafruit_GFX.h>
#include <Adafruit_NeoMatrix.h>
#include <Adafruit_NeoPixel.h>
// Because conditional #includes don't work w/Arduino sketches...
#include <SPI.h>         // COMMENT OUT THIS LINE FOR GEMMA OR TRINKET
//#include <avr/power.h> // ENABLE THIS LINE FOR GEMMA OR TRINKET

// Enter a MAC address and IP address for your controller below.
// The IP address will be dependent on your local network:
byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED
};
IPAddress ip(192,168,3,200);
unsigned int localPort = 8888;      // local port to listen on

// buffer for sending data
unsigned char packetBuffer[UDP_TX_PACKET_MAX_SIZE];  //buffer to hold incoming packet,

// An EthernetUDP instance to let us send and receive packets over UDP
EthernetUDP Udp;
EthernetClient client;

// NeoPixel matrix configuration
#define MATRIX_WIDTH  15
#define MATRIX_HEIGHT 10
// Only one pin for data for NeoPixels
#define DATA_PIN    5
// Button pins - UPDATE BOTH
#define NUM_BUTTONS 4
const int BUTTONS[NUM_BUTTONS] = {2, 3, 7, 8};
bool PRESSED[NUM_BUTTONS] = {false, false, false, false};
// No packet max
#define NO_PACKET_MAX 100
Adafruit_NeoMatrix matrix = Adafruit_NeoMatrix(
  MATRIX_WIDTH, MATRIX_HEIGHT, DATA_PIN,
  NEO_MATRIX_TOP + NEO_MATRIX_LEFT +
  NEO_MATRIX_ROWS + NEO_MATRIX_ZIGZAG,
  NEO_GRB + NEO_KHZ800);
// The last parameter is optional -- this is the color data order of the
// DotStar strip, which has changed over time in different production runs.
// Your code just uses R,G,B colors, the library then reassigns as needed.
// Default is DOTSTAR_BRG, so change this if you have an earlier strip.
// Hardware SPI is a little faster, but must be wired to specific pins
// (Arduino Uno = pin 11 for data, 13 for clock, other boards are different).
//Adafruit_DotStar strip = Adafruit_DotStar(NUM_PIXELS, DOTSTAR_BRG);

void setup() {
  // start the Ethernet and UDP:
  Ethernet.begin(mac, ip);
  Udp.begin(localPort);
  Serial.begin(19200);

  for (int i = 0; i < NUM_BUTTONS; i++) {
    pinMode(BUTTONS[i], INPUT_PULLUP);
    digitalWrite(BUTTONS[i], HIGH);
  }

#if defined(__AVR_ATtiny85__) && (F_CPU == 16000000L)
  clock_prescale_set(clock_div_1); // Enable 16 MHz on Trinket
#endif
  matrix.begin(); // Initialize pins for output
  matrix.show();  // Turn all LEDs off ASAP
  matrix.setTextColor(matrix.Color(255, 0, 0));
}

int pixel = 0;
int no_packet_count = 0;

// Text related vars
bool text_incoming = false;
String text;
int x    = matrix.width();

void loop() {
  if (!text_incoming && text.length() > 0) {
    matrix.fillScreen(0);
    matrix.setCursor(x, 0);
    matrix.print(text);
    if (--x < -36) {
      text.remove(0);
      x = matrix.width();
    }
    matrix.show();
    delay(100);
    return;
  }
  // if there's data available, read a packet
  int packetSize = Udp.parsePacket();
  if (packetSize) {
    no_packet_count = 0;
    // read the packet into packetBuffer
    Udp.read(packetBuffer, UDP_TX_PACKET_MAX_SIZE);

    if (packetSize == 3 &&
        packetBuffer[0] == 116 &&
        packetBuffer[1] == 120 && 
        packetBuffer[2] == 116) {
      // start of text
      text_incoming = true;
      return;   
    }

    if (packetSize == 3 &&
      packetBuffer[0] == 101 &&
      packetBuffer[1] == 111 &&
      packetBuffer[2] == 102) {
      // end of text
      text_incoming = false;
      return;
    }

    if (text_incoming &&
        packetSize > 3 &&
        packetBuffer[0] == 116 &&
        packetBuffer[1] == 120 && 
        packetBuffer[2] == 116) {
      // got text, add it to string
      text += String((char*)packetBuffer + 3);
      return;
    }

    for (int i = 0; i < packetSize; i += 3) {
      uint16_t color = matrix.Color(packetBuffer[i], packetBuffer[i + 1], packetBuffer[i + 2]);
      matrix.drawPixel(pixel % MATRIX_WIDTH, (int)(pixel / MATRIX_WIDTH), color);
      pixel++;
      if (pixel >= MATRIX_WIDTH * MATRIX_HEIGHT) {
        pixel = 0;
        matrix.show();
      }
    }

    // Read the button state
    for (int i = 0; i < NUM_BUTTONS; i++) {
      int buttonState = digitalRead(BUTTONS[i]);
      if (buttonState == LOW) {
        if (!PRESSED[i]) {
          PRESSED[i] = true;
          Udp.beginPacket(Udp.remoteIP(), Udp.remotePort());
          Udp.write("butPressed");
          String pin(i + 1);
          Udp.write(pin.c_str());
          Udp.endPacket();
        }
      } else {
        if (PRESSED[i]) {
          PRESSED[i] = false;
          Udp.beginPacket(Udp.remoteIP(), Udp.remotePort());
          Udp.write("butNotPressed");
          String pin(i + 1);
          Udp.write(pin.c_str());
          Udp.endPacket();
        }
      }
    }
  } else {
    no_packet_count++;
    if (no_packet_count == NO_PACKET_MAX) {
      // No packets received for 1 second (NO_PACKET_MAX * loop delay), reset counter and pixel position for new frame
      no_packet_count = 0;
      pixel = 0;
    }
  }
}
