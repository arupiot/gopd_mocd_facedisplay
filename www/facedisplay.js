/*
 *   MOCD face display
 */

/* booleans triggers */
var showPoints = false;
var showElements = true;
var showImage = false;
var showMesh = false;
var showBoundingBox = false;
var showHelp = false;
var useCLM = false;
var useFaceMesh = true;

/* variables */
var headImages = new Array("nothing");
var earImages = new Array("nothing");
var eyeImages = new Array("nothing");
var noseImages = new Array("nothing");
var eyebrowImages = new Array("nothing");
var lipBottomImages = new Array("nothing");
var lipTopImages = new Array("nothing"); 
// var headImage, earsImage, eyeImage, noseImage, mouthImage, eyebrowImage, lipBottomImage, lipTopImage;
var faceIndex = 1;
var maxIndex = 10;

/* media */
var myCamera;
var mv;
var aspectX=1; 
var aspectY=1;
var startSound;
var fontAstronaut;
var cnv;

/* face detection */
var facemesh; // FaceMesh
var predictions = []; // CLM

/* preload audio and font assets */
function preload() {
  soundFormats('mp3', 'ogg');
  startSound = loadSound('assets/audio/bw_mocd_avatar_tribal_drum_start');
  startSound.playMode('untilDone');
  fontAstronaut = loadFont('assets/font/astronaut.ttf');
}

function modelReady() {
    console.log("FaceMesh model ready");
}

function centerCanvas() {
    var x = (windowWidth - width) / 2;
    // var y = (windowHeight - height) / 2;
    //var y = 3 * (windowHeight - height) / 4;
    var y = windowHeight - height;
    cnv.position(x, y);
}

function setup() {
    /* create canvas */
    // loadCanvas(windowWidth, windowHeight);
    loadCanvas(640, 480);

    /* use the following line for a locally connected camera */
    // myCamera = loadCameraWH(VIDEO, windowWidth, windowHeight, true);
    myCamera = loadCameraWH(VIDEO, 640, 480, true);
    
    /* use the following line for an MJPEG video stream */
    // myCamera = loadCameraMJPEGWH("http://127.0.0.1:8002/cam.mjpg", windowWidth, windowHeight, true);
    // myCamera = loadCameraMJPEGWH("http://127.0.0.1:8080", 640, 480, true);
    // myCamera = loadCameraMJPEGWH("http://localhost:8080/video.mjpg", 640, 480, true);
    
    // myCamera.hide();

    if (useCLM) {
        /* instantiate the clm face tracker library */
        loadTracker();
    }

    if (useFaceMesh) {
        /* instantiate the facemesh tracker library */
        const faceOptions = {
            flipHorizontal: false, // boolean value for if the video should be flipped, defaults to false
            maxContinuousChecks: 5, // How many frames to go without running the bounding box detector. Only relevant if maxFaces > 1. Defaults to 5.
            detectionConfidence: 0.90, // Threshold for discarding a prediction. Defaults to 0.9.
            maxFaces: 10, // The maximum number of faces detected in the input. Should be set to the minimum number for performance. Defaults to 10.
            scoreThreshold: 0.75, // A threshold for removing multiple (likely duplicate) detections based on a "non-maximum suppression" algorithm. Defaults to 0.75.
            iouThreshold: 0.30, // A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3.
        };
        facemesh = ml5.facemesh(myCamera, faceOptions, modelReady);
        // facemesh = ml5.facemesh(myCamera, modelReady);
        /* set up an event that fills the global variable "predictions" with an array every time new predictions are made */
        facemesh.on("predict", results => {
            predictions = results;
        });
    }
    
    /* load graphic assets */
    for (let i = 1; i <= maxIndex; i++) {
        headImages.push(loadImage("assets/img/faces/head/head-"+i.toString().padStart(2,"0")+".png"));
    }
    for (let i = 1; i <= maxIndex; i++) {
        earImages.push(loadImage("assets/img/faces/ear/ear-"+i.toString().padStart(2,"0")+".png"));
    }
    for (let i = 1; i <= maxIndex; i++) {
        eyeImages.push(loadImage("assets/img/faces/eye/eye-"+i.toString().padStart(2,"0")+".png"));
    }
    for (let i = 1; i <= maxIndex; i++) {
        noseImages.push(loadImage("assets/img/faces/nose/nose-"+i.toString().padStart(2,"0")+".png"));
    }
    for (let i = 1; i <= maxIndex; i++) {
        eyebrowImages.push(loadImage("assets/img/faces/eye-brow/eye-brow-"+i.toString().padStart(2,"0")+".png"));
    }
    for (let i = 1; i <= maxIndex; i++) {
        lipBottomImages.push(loadImage("assets/img/faces/bottom-lip/bottom-lip-"+i.toString().padStart(2,"0")+".png"));
    }
    for (let i = 1; i <= maxIndex; i++) {
        lipTopImages.push(loadImage("assets/img/faces/top-lip/top-lip-"+i.toString().padStart(2,"0")+".png"));
    }

    // headImage = loadImage("assets/img/faces/head/head.png");
    // earsImage = loadImage("assets/img/faces/ears/ears.png");
    // eyeImage = loadImage("assets/img/faces/eye/eye.png");
    // noseImage = loadImage("assets/img/faces/nose/nose.png");
    // mouthImage = loadImage("assets/img/faces/mouth/mouth.png");
    // eyebrowImage = loadImage("assets/img/faces/eyebrow/eyebrow.png");
    // lipBottomImage = loadImage("assets/img/faces/bottom-lip/bottom-lip.png"); 
    // lipTopImage = loadImage("assets/img/faces/top-lip/top-lip.png");

    textFont(fontAstronaut);
    textSize(windowHeight / 40);
    textAlign(CENTER, CENTER);
    
    // var mv = document.getElementById("v");
    // console.log(mv.width+"-"+mv.height)
    
    // aspectX = windowWidth / mv.width;
    // aspectY = windowHeight / mv.height;

    cnv = getCanvas();
    centerCanvas();

}
      
function draw() {
    if (useCLM) {
        getPositions();
    }
    clear();
    imageMode(CENTER);
    // if (showImage == true) image(myCamera,windowWidth/2,windowHeight/2,windowWidth,windowHeight); //myCamera.show();
    if (showImage == true) image(myCamera,myCamera.width/2,myCamera.height/2,myCamera.width,myCamera.height); //myCamera.show();

    // if (showImage == false) myCamera.hide();
    if (showElements == true) drawElements();
    if (useCLM) {
        if (showPoints == true) drawPoints();
    }
    if (useFaceMesh) {
        drawFaceMeshPoints();
    }
    if (showHelp) {
        colorMode(RGB);
        fill(255,255,255);
        text('"i": image / "e" elements / "m": mesh / "0-9": face styles', myCamera.width/2, myCamera.height-myCamera.height/20*2);  
        // text('"i": image / "p": points / "e" elements / "m": mesh', myCamera.width/2, myCamera.height-myCamera.height/20*2);  
        // text('"i": image / "p": points / "e" elements / "m": mesh', myCamera.width/2, myCamera.height-myCamera.height/20*2);  
    }
}

// a function to draw ellipses over the detected keypoints
function drawFaceMeshPoints() {
    for (let i = 0; i < predictions.length; i += 1) {
      // const keypoints = predictions[i].scaledMesh;
      const keypoints = predictions[i].scaledMesh;
      const boundingBox = predictions[i].boundingBox;
      // console.log(boundingBox);

      if (showBoundingBox) {
        // draw the bounding box
        noFill();
        stroke(0,50,125);
        const [x1, y1] = boundingBox.topLeft[0];
        const [x2, y2] = boundingBox.bottomRight[0];
        rect(x1, y1, x2-x1, y2-y1);
      }

      // draw facial keypoints
      // fill(255, 255, 255);
      if (showMesh == true) {
        for (let j = 0; j < keypoints.length; j += 1) {
            // const [x, y] = keypoints[j];
            const [x, y, z] = keypoints[j];
            // console.log(keypoints[j]);
            colorMode(HSB);
            noStroke();
            fill(200, 100, map(z, -70, 70, 100, 0));
            ellipse(x, y, 5);
        }
      }
    }
    colorMode(RGB);
    noFill();
    stroke(0,50,125);

    drawFaceMeshFeatures();
}

function drawFaceMeshFeatures() {
    // console.log(predictions.length);
    for (let i = 0; i < predictions.length; i += 1) {
        const keypoints = predictions[i].scaledMesh;
        // console.log(keypoints);

        const annotations = predictions[i].annotations;

        // console.log(annotations);
        
        const silhouette = annotations.silhouette; // polygon
        drawFeatureLine(silhouette, true);

        const lipsLowerInner = annotations.lipsLowerInner; // polygon
        drawFeatureLine(lipsLowerInner, true);

        const lipsLowerOuter = annotations.lipsLowerOuter; // polygon
        drawFeatureLine(lipsLowerOuter, false);

        const lipsUpperInner = annotations.lipsUpperInner; // polygon
        drawFeatureLine(lipsUpperInner, false); 

        const lipsUpperOuter = annotations.lipsUpperOuter; // polygon
        drawFeatureLine(lipsUpperOuter, false);

        const leftEyeLower0 = annotations.leftEyeLower0; // polygon
        drawFeatureLine(leftEyeLower0, false);
        
        const leftEyeLower1 = annotations.leftEyeLower1; // polygon
        drawFeatureLine(leftEyeLower1, false);

        const leftEyeLower2 = annotations.leftEyeLower2; // polygon
        drawFeatureLine(leftEyeLower2, false);

        const leftEyeLower3 = annotations.leftEyeLower3; // polygon
        drawFeatureLine(leftEyeLower3, false);

        const leftEyeUpper0 = annotations.leftEyeUpper0; // polygon
        drawFeatureLine(leftEyeUpper0, false);

        const leftEyeUpper1 = annotations.leftEyeUpper1; // polygon
        drawFeatureLine(leftEyeUpper1, false);

        const leftEyeUpper2 = annotations.leftEyeUpper2; // polygon
        drawFeatureLine(leftEyeUpper2, false);

        const rightEyeLower0 = annotations.rightEyeLower0; // polygon
        drawFeatureLine(rightEyeLower0, false);

        const rightEyeLower1 = annotations.rightEyeLower1; // polygon
        drawFeatureLine(rightEyeLower1, false);

        const rightEyeLower2 = annotations.rightEyeLower2; // polygon
        drawFeatureLine(rightEyeLower2, false);

        const rightEyeLower3 = annotations.rightEyeLower3; // polygon
        drawFeatureLine(rightEyeLower3, false);

        const rightEyeUpper0 = annotations.rightEyeUpper0; // polygon
        drawFeatureLine(rightEyeUpper0, false);

        const rightEyeUpper1 = annotations.rightEyeUpper1; // polygon
        drawFeatureLine(rightEyeUpper1, false);

        const rightEyeUpper2 = annotations.rightEyeUpper2; // polygon
        drawFeatureLine(rightEyeUpper2, false);

        const leftEyebrowLower = annotations.leftEyebrowLower; // polygon
        drawFeatureLine(leftEyebrowLower, false);

        const leftEyebrowUpper = annotations.leftEyebrowUpper; // polygon
        drawFeatureLine(leftEyebrowUpper, false);

        const rightEyebrowLower = annotations.rightEyebrowLower; // polygon
        drawFeatureLine(rightEyebrowLower, false);

        const rightEyebrowUpper = annotations.rightEyebrowUpper; // polygon
        drawFeatureLine(rightEyebrowUpper, false);

        const noseBottom = annotations.noseBottom; // point
        const noseTip = annotations.noseTip; // point        
        const noseLeftCorner = annotations.noseLeftCorner; // point
        const noseRightCorner = annotations.noseRightCorner; // point
        
        const midwayBetweenEyes = annotations.midwayBetweenEyes; // point
        const leftCheek = annotations.leftCheek; // point
        const rightCheek  = annotations.rightCheek; // point

        drawFeaturePoint(noseBottom, 6);
        drawFeaturePoint(noseTip, 6);
        drawFeaturePoint(noseLeftCorner, 6);
        drawFeaturePoint(noseRightCorner, 6);
        drawFeaturePoint(midwayBetweenEyes, 6);
        drawFeaturePoint(leftCheek, 6);
        drawFeaturePoint(rightCheek, 6);

        if (showElements == true) {
            imageMode(CENTER);
            var p1 = createVector(keypoints[152][0], keypoints[152][1] ); // chin
            var p2 = createVector(midwayBetweenEyes[0][0], midwayBetweenEyes[0][1] ); // upper nose point
            var angleRad = Math.atan2(p2.y - p1.y, p2.x - p1.x); // rotation angle
            var mSize = p1.dist(p2)*2; // face/mesh size
            // console.log(p1);
            // console.log(p2);
            // console.log("angle: " + angleRad);
            // console.log("size: " + mSize);

            // head
            drawFeatureElement(keypoints[164], false, 3.1415-angleRad, mSize, headImages[faceIndex]);

            // left ear
            drawFeatureElement(keypoints[234], false, angleRad, mSize, earImages[faceIndex]);

            // right ear
            drawFeatureElement(keypoints[454], true, 3.1415-angleRad, mSize, earImages[faceIndex]);

            // left eye
            drawFeatureElement(keypoints[159], false, angleRad, mSize, eyeImages[faceIndex]);

            // right eye
            drawFeatureElement(keypoints[386], true, 3.1415-angleRad, mSize, eyeImages[faceIndex]);

            // left eyebrow
            drawFeatureElement(keypoints[223], false, angleRad, mSize, eyebrowImages[faceIndex]);

            // right eyebrow
            drawFeatureElement(keypoints[443], true, 3.1415-angleRad, mSize, eyebrowImages[faceIndex]);

            // upper lip
            drawFeatureElement(keypoints[11], false, 3.1415-angleRad, mSize, lipTopImages[faceIndex]);

            // bottom lip
            drawFeatureElement(keypoints[16], true, angleRad, mSize, lipBottomImages[faceIndex]);

            // nose
            drawFeatureElement(noseTip[0], false, 3.1415-angleRad, mSize, noseImages[faceIndex]);

        }
        
    }
}

function drawFeatureLine(feature, closed) {
    if (showMesh == true) {
        for (let i = 0; i < feature.length; i += 1) {
            noFill();
            stroke(0,50,125);
            if (i<(feature.length-1)) {
                const [x1, y1] = feature[i];
                const [x2, y2] = feature[i+1];
                line(x1*aspectX,y1*aspectY,x2*aspectX,y2*aspectY);
            } else {
                const [x1, y1] = feature[i];
                const [x2, y2] = feature[0];
                if (closed == true) line(x1*aspectX,y1*aspectY,x2*aspectX,y2*aspectY);
            }
        }
    }
}

function drawFeaturePoint(feature, size) {
    if (showMesh == true) {
        for (let i = 0; i < feature.length; i += 1) {
            const [x, y] = feature[i]
            noStroke();
            fill(0, 50, 125);
            ellipse(x*aspectX, y*aspectY, size, size);
        }
    }
}

function drawFeatureElement(element, mirror, angleRad, mSize, imageName) {
    push();        
    // console.log("element: " + element);
    const[ x, y, z ] = element;
    // console.log(x+"/"+y)
    translate(x,y); 
    if (mirror == true) {
        scale(-1, 1);
    }
    rotate(-angleRad -PI/2);
    image(imageName,0,0,mSize/1,mSize/1);
    pop();
}

function drawElements() {
    if (useCLM) {
        if(positions.length > 0) {
            // startSound.play();

            var p1 = createVector(positions[7][0], positions[7][1] ); // chin
            var p2 = createVector(positions[33][0], positions[33][1] ); // upper nose point
            
            var headpos = createVector(positions[33][0],positions[33][1]);
            var earspos = createVector(positions[62][0],positions[62][1]);
            var eye1pos = createVector(positions[27][0],positions[27][1]);
            var eye2pos = createVector(positions[32][0],positions[32][1]);
            var nosepos = createVector(positions[41][0],positions[41][1]);
            // var mouthpos = createVector(positions[57][0],positions[57][1]);   
            var eyebrow1pos = createVector(positions[21][0],positions[21][1]);
            var eyebrow2pos = createVector(positions[17][0],positions[17][1]);
            var liptoppos = createVector(positions[47][0],positions[47][1]);
            var lipbottompos = createVector(positions[53][0],positions[53][1]);
            
            stroke(0,50,125);
            // line(p1.x,p1.y,p2.x, p2.y);
            
            noFill();
            
            // stroke(0,255,0);
            // ellipse(eye1pos.x,eye1pos.y,10,10);
            // ellipse(eye2pos.x, eye2pos.y,10,10);
            // ellipse(mouthpos.x, mouthpos.y,10,10);
            
            // stroke(0,0,255);
            // ellipse(nosepos.x, nosepos.y,10,10);
            // ellipse(headpos.x, headpos.y,10,10);
            
            
            // angle in radians
            var angleRad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            var mSize = p1.dist(p2);
            
            imageMode(CENTER);
            
            push();
            translate(headpos.x,headpos.y); 
            rotate(angleRad + PI/2);
            image(headImages[faceIndex],0,0,mSize/2,mSize/2);
            // image(headImage,0,0,mSize/1,mSize/1);
            pop();
    
            push();
            translate(earspos.x,earspos.y); 
            rotate(angleRad + PI/2);
            image(earImages[faceIndex],0,0,mSize/2,mSize/2);
            // image(earsImage,0,0,mSize/1,mSize/1);
            pop();
    
            push();
            translate(eye1pos.x,eye1pos.y); 
            rotate(angleRad + PI/2);
            image(eyeImages[faceIndex],0,0,mSize/2,mSize/2);
            // image(eyeImage,0,0,mSize/1,mSize/1);
            pop();
            
            push();        
            translate(eye2pos.x,eye2pos.y); 
            scale(-1, 1);
            rotate(-angleRad -PI/2);
            image(eyeImages[faceIndex],0,0,mSize/2,mSize/2);
            // image(eyeImage,0,0,mSize/1,mSize/1);
            pop();
    
            push();
            translate(eyebrow1pos.x,eyebrow1pos.y); 
            rotate(angleRad + PI/2);
            image(eyebrowImages[faceIndex],0,0,mSize/2,mSize/2);
            // image(eyebrowImage,0,0,mSize/1,mSize/1);
            pop();
            
            push();        
            translate(eyebrow2pos.x,eyebrow2pos.y); 
            scale(-1, 1);
            rotate(-angleRad -PI/2);
            image(eyebrowImages[faceIndex],0,0,mSize/2,mSize/2);
            // image(eyebrowImage,0,0,mSize/1,mSize/1);
            pop();
            
            // push();
            // translate(mouthpos.x,mouthpos.y); 
            // rotate(angleRad + PI/2);
            // image(mouthImages[faceIndex],0,0,mSize*2,mSize*2);
            // pop();
    
            push();
            translate(liptoppos.x,liptoppos.y); 
            rotate(angleRad + PI/2);
            image(lipTopImages[faceIndex],0,0,mSize/2,mSize/2);
            // image(lipTopImage,0,0,mSize/1,mSize/1);
            pop();
    
            push();
            translate(lipbottompos.x,lipbottompos.y); 
            rotate(angleRad + PI/2);
            image(lipBottomImages[faceIndex],0,0,mSize/2,mSize/2);
            // image(lipBottomImage,0,0,mSize/1,mSize/1);
            pop();
            
            push();
            translate(nosepos.x,nosepos.y+10); 
            rotate(angleRad + PI/2);
            image(noseImages[faceIndex],0,0,mSize,mSize);
            // image(noseImage,0,0,mSize/1,mSize/1);
            pop();     
        }
    }
}

function drawPoints() {
    if (useCLM) {
        for (var i=0; i<positions.length -1; i++) {
            // set the color of the ellipse based on position on screen
            fill(map(positions[i][0], width*0.33, width*0.66, 0, 255), map(positions[i][1], height*0.33, height*0.66, 0, 100), 0);
            
            // draw ellipse
            noStroke();
            ellipse(positions[i][0], positions[i][1], 10, 10);
            
            // draw line
            stroke(map(positions[i][0], width*0.33, width*0.66, 0, 255), map(positions[i][1], height*0.33, height*0.66, 0, 100), 0,50);
            // stroke(255);
            line(positions[i][0], positions[i][1], positions[i+1][0], positions[i+1][1]);
        }
    }
}


function keyPressed() {
    if (keyCode === 80) { // P
        showPoints = !showPoints;
    } else if (keyCode === 66) { // B
        showBoundingBox = !showBoundingBox;
    } else if (keyCode === 69) { // E
        showElements = !showElements;
    } else if (keyCode === 72) { // H
        showHelp = !showHelp;
    } else if (keyCode === 73) { // I
        showImage = !showImage;
    } else if (keyCode === 77) { // M
        showMesh = !showMesh;
    }  else if (keyCode === 48) { // 0
        faceIndex = 10;
    }  else if (keyCode === 49) { // 1
        faceIndex = 1;
    } else if (keyCode === 50) { // 2
        faceIndex = 2;
    } else if (keyCode === 51) { // 3
        faceIndex = 3;
    } else if (keyCode === 52) { // 4
        faceIndex = 4;
    } else if (keyCode === 53) { // 5
        faceIndex = 5;
    } else if (keyCode === 54) { // 6
        faceIndex = 6;
    } else if (keyCode === 55) { // 7
        faceIndex = 7;
    } else if (keyCode === 56) { // 8
        faceIndex = 8;
    } else if (keyCode === 57) { // 9
        faceIndex = 9;
    }    
    return false; // prevent any default behavior
}

function windowResized() {
    centerCanvas();
}
