// The baud rate in my Arduino sketch
const BAUD_RATE = 9600;
// contrains the minimum size of the circle's diameter
const MIN_DIAMETER = 10;
// contrains the maximum size of the circle's diameter
const MAX_DIAMETER = 50;
// Declare global variables of web port and buttons (Taken & modified from p5 adruino ball example)
let port, connectBtn, decLEDBtn, incLEDBtn;
// declare global variable for LED brightness
let brightness = 0;

function setup() {
  setupSerial(); // Run our serial setup function (below)

  // Create a canvas that is the size of our browser window.
  // windowWidth and windowHeight are p5 variables
  createCanvas(windowWidth, windowHeight);

  // create button for decreasing LED brightness
  decLEDBtn = createButton("Decrease LED Brightness");
  // set button position below the connect button
  decLEDBtn.position(5, 100); 

  // create button for increasing LED brightness
  incLEDBtn = createButton("Increase LED Brightness");
  // set button position below the decrease button
  incLEDBtn.position(5, 150);
}

function draw() {
  // taken from p5 adruino ball example
  // Check whether the port is open (see checkPort function below)
  const portIsOpen = checkPort(); 
  // If the port is not open, exit the draw loop
  if (!portIsOpen) return; 

  // Read from the port until the newline
  let str = port.readUntil("\n"); 
  // If we didn't read anything, return.
  if (str.length == 0) return; 

  // Trim whitespace and split on commas
  let arr = str.trim().split(","); // Trim whitespace and split on commas

  // Convert the first array element to a number and map it to the desired range on the x axis
  let x = map(Number(arr[0]), 512, 1023, 0, windowWidth);
  // Convert the second array element to a number and map it to the desired range on the y axis
  let y = map(Number(arr[1]), 512, 1023, 0, windowHeight);
  // Convert the third array element to a number and map it to the diamater size
  let diameter = map(Number(arr[2]), 512, 1023, MIN_DIAMETER, MAX_DIAMETER);
  // the next three lines are lines that i added
  // Convert the fourth array element to a number and set it to the brightness variable
  brightness = Number(arr[3]);
  // when button is clicked, the brightness variable decreases
  decLEDBtn.mouseClicked(onDecBtnClicked);
  // when button is clicked, the brightness variable increases
  incLEDBtn.mouseClicked(onIncBtnClicked);
  
  //Set the background to teal (taken from p5 adruino ball example)
  background("teal");
  // Draw a circle using our readings
  circle(x, y, diameter);
}

// create an action for the event for when the decrease button is clicked
function onDecBtnClicked() {
  // if the brightness is 0 or less, return and do not decrease the brightness further
  if (brightness <=0) return;

  // decrease the brightness by 30
  brightness = brightness - 30;
  // constrain the brightness to ensure it doesn't go below 0 or above 255
  brightness = constrain(brightness, 0, 255);

  // Send the value as a single byte
  port.write([brightness]);
}

// create an action for the event for when the increase button is clicked
function onIncBtnClicked() {
  // if the brightness is 255 or more, return and do not increase the brightness further
  if (brightness >= 255) return;

  // increase the brightness by 30
  brightness = brightness + 30;
  // constrain the brightness to ensure it doesn't go below 0 or above 255
  brightness = constrain(brightness, 0, 255);

  // Send the value as a single byte
  port.write([brightness]);
}

// Three helper functions for managing the serial connection. (taken from p5 adruino ball example)

function setupSerial() {
  port = createSerial();

  // Check to see if there are any ports we have used previously
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    // If there are ports we've used, open the first one
    port.open(usedPorts[0], BAUD_RATE);
  }

  // create a connect button
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(5, 5); // Position the button in the top left of the screen.
  connectBtn.mouseClicked(onConnectButtonClicked); // When the button is clicked, run the onConnectButtonClicked function
}

function checkPort() {
  if (!port.opened()) {
    // If the port is not open, change button text
    connectBtn.html("Connect to Arduino");
    // Set background to gray
    background("gray");
    return false;
  } else {
    // Otherwise we are connected
    connectBtn.html("Disconnect");

    return true;
  }
}

function onConnectButtonClicked() {
  // When the connect button is clicked
  if (!port.opened()) {
    // If the port is not opened, we open it
    port.open(BAUD_RATE);
  } else {
    // Otherwise, we close it!
    port.close();
  }
}