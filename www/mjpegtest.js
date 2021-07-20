// var WIDTH = 640;
// var HEIGHT = 480;
// var CAMERA_IP = "127.0.0.1";
// var CAMERA_PORT = "8080"
// var CAMERA_URL = "http://localhost:8080/video.mjpg";

// var LEFT = "LEFT";
// var RIGHT = "RIGHT";

// var myCamera = null;
// var canvas;

// var facemesh; // FaceMesh
// let predictions = [];

// function modelReady() {
//   console.log("FaceMesh model ready");
// }

// function loadCanvas(w, h) {
//   canvas = createCanvas(w, h);
//   canvas.position(0,0);
// }

// // function centerCanvas() {
// //   var x = (windowWidth - width) / 2;
// //   // var y = (windowHeight - height) / 2;
// //   //var y = 3 * (windowHeight - height) / 4;
// //   var y = windowHeight - height;
// //   canvas.position(x, y);
// // }

// function setup() {
//   // CAMERA_URL = "http://" + CAMERA_IP + ":" + CAMERA_PORT;
  
//   createCanvas(WIDTH, HEIGHT);
//   myCamera = createImg(CAMERA_URL, imageReady);
//   myCamera.hide();

//   // facemesh = ml5.facemesh(myCamera, modelReady);
//   //       // facemesh = ml5.facemesh(myCamera, modelReady);
//   //       /* set up an event that fills the global variable "predictions" with an array every time new predictions are made */
//   // facemesh.on("predict", results => {
//   //     predictions = results;
//   // });
// }

// function imageReady() {
//   facemesh = ml5.facemesh(modelReady);

//   facemesh.on("predict", results => {
//     predictions = results;
//   });
// }

// function draw() {
//   background(220);
//   if (myCamera) {
//     image(myCamera, 0, 0); 
//   }
//   if (predictions.length > 0) {
//     drawKeypoints();
//   }
// }



// function drawKeypoints() {
//   for (let i = 0; i < predictions.length; i += 1) {
//     const keypoints = predictions[i].scaledMesh;

//     // Draw facial keypoints.
//     for (let j = 0; j < keypoints.length; j += 1) {
//       const [x, y] = keypoints[j];

//       fill(0, 255, 0);
//       ellipse(x, y, 5, 5);
//     }
//   }
// }


let facemesh;
let predictions = [];
let img;

function setup() {
  // Create a canvas that's at least the size of the image.
  createCanvas(640, 480);

  // create an image using the p5 dom library
  // call modelReady() when it is loaded
  // img = createImg("http://localhost:8080/video.mjpg", imageReady);
  img = createImg("http://localhost:8001/stream/video.mjpeg", imageReady);
  // set the image size to the size of the canvas

  img.hide(); // hide the image in the browser
  // frameRate(1); // set the frameRate to 1 since we don't need it to be running quickly in this case
}

// when the image is ready, then load up poseNet
function imageReady() {
  facemesh = ml5.facemesh(modelReady);

  facemesh.on("predict", results => {
    predictions = results;
  });
}

// when poseNet is ready, do the detection
function modelReady() {
  console.log("Model ready!");
  facemesh.predict(img);
}

// draw() will not show anything until poses are found
function draw() {
  image(img, 0, 0, width, height);
  if (predictions.length > 0) {
    
    drawKeypoints();
    // noLoop(); // stop looping when the poses are estimated
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const keypoints = predictions[i].scaledMesh;

    // Draw facial keypoints.
    for (let j = 0; j < keypoints.length; j += 1) {
      const [x, y] = keypoints[j];

      fill(0, 255, 0);
      ellipse(x, y, 5, 5);
    }
  }
}