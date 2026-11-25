// create variable to read in changes in x axis of joystick
int xAxis = A0;
// create variable to read in changes in y axis of joystick
int yAxis = A1;
// create variable to read in changes of potentiometer value to change the diameter of the circle
int dia = A2;
// create variable to control the red LED
int rLED = 11;
// create variable to keep led brightness values
int ledBrightness = 0;

// set up arduino
void setup()
{
  // initialize serial communication
  Serial.begin(9600);
  // initialize A0 as an input (x axis of joystick)
  pinMode(xAxis, INPUT);
  // initialize A1 as an input (y axis of joystick)
  pinMode(yAxis, INPUT);
  // initialize A2 as an input (value of potentiometer)
  pinMode(dia, INPUT);
  // initialize pin 11 as an output (red LED)
  pinMode(rLED, OUTPUT);
}

// main code that loops
void loop()
{
  // taken from p5 arduino ball example
  // read x axis values and prints it first on the string to send to the web
  Serial.print(analogRead(A0));
  // prints comma to separate values in the string
  Serial.print(",");
  // read y axis values and prints it second on the string to send to the web
  Serial.print(analogRead(A1));
  // prints comma to separate values in the string
  Serial.print(",");
  // read potentiometer value and prints it third on the string to send to the web
  Serial.print(analogRead(A2));
  // delay 50 milliseconds
  delay(50);

  // taken and modified from p5 arduino brightness example
  // check if there is serial data available to read
  if (Serial.available() > 0) {
    // read data from the port
    int inByte = Serial.read();
    ledBrightness = inByte;
    // if serial data is read, adds to the joystick input values above to send to web
    Serial.print(",");
    // sends the data read to the web
    Serial.println(inByte);
    // set red LED brightness based on the data received from the port
    analogWrite(rLED, inByte);
  } else {
    // if serial data is not read, adds the previous led brightness to the string above
    Serial.print(",");
    // sends the data read to the web
    Serial.println(ledBrightness);
  }
}