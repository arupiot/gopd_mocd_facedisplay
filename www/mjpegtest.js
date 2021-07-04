var WIDTH = 640;
var HEIGHT = 480;
var CAMERA_IP = "127.0.0.1";
var CAMERA_PORT = "8080"
var CAMERA_URL = "";

var LEFT = "LEFT";
var RIGHT = "RIGHT";

var imageStream = null;

function setup() {
  CAMERA_URL = "http://" + CAMERA_IP + ":" + CAMERA_PORT;
  
  createCanvas(WIDTH, HEIGHT);
  imageStream = createImg(CAMERA_URL);
  imageStream.hide();
}

function draw() {
  background(220);
  if (imageStream) {
    image(imageStream, 0, 0); 
  }
}



