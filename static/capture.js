// SOURCES: https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos
// https://github.com/mdn/samples-server/tree/master/s/webrtc-capturestill

var width = 320; // We will scale the photo width to this
var height = 0; // This will be computed based on the input stream
var streaming = false;

//Can be accessed globally, should have no issue accessing in different function
//TODO: maybe add stream values here so I can access it between functions.
var Canvas;
var photo = null;
var confirmButtonLeft = null;
var confirmButtonRight = null;
var openButton = null;
var camera = null;

//For some reason, maybe scope or nuance of JS, this is read as null anytime I am trying to access this within a function.
var displayPic = document.getElementById("display-pic");
var imgArea = document.getElementById("img-area");

// Initializes all values required for camera
function startup() {
  var video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  photo = document.getElementById("photo");

  confirmButtonLeft = document.getElementById("confirmButtonLeft");
  confirmButtonRight = document.getElementById("confirmButtonRight");
  openButton = document.getElementById("openButton");

  navigator.mediaDevices
    .getUserMedia({
      video: true,
      video: {
        frameRate: { ideal: 30, max: 60 },
        width: 1280,
        height: 720,
        facingMode: "user",
      },
      audio: false,
    })
    .then(function (stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function (err) {
      console.log("Error occurred: " + err);
    });

  video.addEventListener(
    "canplay",
    function (ev) {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);

        // At time of creation, Firefox has a bug where the height can't be read from the video, so create 4:3 picture window if no height is found.
        if (isNaN(height)) {
          height = width / (4 / 3);
        }

        video.setAttribute("width", width);
        video.setAttribute("height", height);
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        streaming = true;
      }
    },
    false
  );
}

// Function to reveal the camera overlay
function openCameraOverlay() {
  var camera = document.getElementById("camera");
  var takePhotoButton = document.getElementById("takePhotoButton");
  var closeButton = document.getElementById("closeButton");
  var cameraButtons = document.getElementById("cameraButtons");
  var retakePhotoButton = document.getElementById("retakePhotoButton");

  //reveal camera container and center
  camera.style.display = "block";
  camera.style.margin = "auto";

  //create instance of media tracks and access user camera.
  startup();

  //hide click to open button
  openButton.style.display = "none";

  //reveal take photo and close camera buttons.

  closeButton.style.display = "block";

  //revealing takePhoto conditional on if retake is present (had user issue with close camera depending on camera or canvas being present.)
  if (retakePhotoButton.style.display == "block") {
    takePhotoButton.style.display = "none";
  } else {
    takePhotoButton.style.display = "block";
  }

  //reveal and center camera buttons container
  cameraButtons.style.display = "flex";
  cameraButtons.style.margin = "auto";
}

// Function to hide the camera overlay
function closeCameraOverlay() {
  //TODO: Make sure all buttons are re-centered the same way as in the main.css file!
  cameraButtons = document.getElementById("cameraButtons");
  camera = document.getElementById("camera");

  camera.style.display = "none";
  cameraButtons.style.display = "none";
  stopMediaTracks();

  openButton.style.display = "block";
  openButton.style.margin = "auto";
}

function stopMediaTracks() {
  //Moved from restartCamera() because it should be here instead.
  let stream = video.srcObject;
  let tracks = stream.getTracks();

  //Source: https://stackoverflow.com/questions/11642926/stop-close-webcam-stream-which-is-opened-by-navigator-mediadevices-getusermedia

  stream.getTracks().forEach(function (track) {
    track.stop();
  });
}

// Take picture hides and reveals some buttons and hides the camera.
function pictureButton() {
  var takePhotoButton = document.getElementById("takePhotoButton");
  var retakePhotoButton = document.getElementById("retakePhotoButton");

  //hide take photo button.
  takePhotoButton.style.display = "none";

  photo.style.display = "block";
  confirmButtonRight.style.display = "block";
  retakePhotoButton.style.display = "block";

  //hide camera and "replace with canvas"
  video.style.display = "none";

  takepicture();
  // ev.preventDefault(); //TODO: go back and undertsand startup thoroughly!
}

function restartCamera() {
  if (failFlag) {
    document.getElementById("failWarning").style.display = "none";
    failFlag = false;
  }
  var retakePhotoButton = document.getElementById("retakePhotoButton");
  var takePhotoButton = document.getElementById("takePhotoButton");

  //hide the following: canvas, retake button and confirm button.
  photo.style.display = "none";
  confirmButtonRight.style.display = "none";
  retakePhotoButton.style.display = "none";

  //show the following buttons: video and take picture button.
  video.style.display = "block";
  takePhotoButton.style.display = "block";

  // stopMediaTracks(); //Redundant, stopTracks is added to take photo

  //Restarting camera, Re-using lines in startup().

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(function (stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function (err) {
      console.log("Error occurred: " + err);
    });

  video.addEventListener("canplay", function (ev) {
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth / width);

      if (isNaN(height)) {
        height = width / (4 / 3);
      }

      video.setAttribute("width", width);
      video.setAttribute("height", height);
      canvas.setAttribute("width", width);
      canvas.setAttribute("height", height);
      streaming = true;
    }
  });
}

// Fill the photo with an indication that none has been
// captured.

function clearphoto() {
  var context = canvas.getContext("2d");
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // var data = canvas.toDataURL("image/png");
  // photo.setAttribute("src", data);
  //replaced with BLOb function.
  canvas.toBlob(function (blob) {
    data = URL.createObjectURL(blob);
    photo.setAttribute("src", data);
  });
}

var takePictureBLObURL, takePictureBLOb;
function takepicture() {
  var context = canvas.getContext("2d");
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    canvas.toBlob(function (blob) {
      takePictureBLOb = blob;
      takePictureBLObURL = URL.createObjectURL(blob);
      photo.src = takePictureBLObURL;
      // alt ver of same thing : photo.setAttribute("src", takePictureBLObURL);
      // console.log("Result of convert canvas to BLOb: ", takePictureBLOb);
      console.log("BLObURL: ", takePictureBLObURL);
    });
  } else {
    clearphoto();
  }
  stopMediaTracks();
}

//SOURCE: https://talkerscode.com/howto/upload-image-in-html-and-display.php
// https://www.youtube.com/watch?v=EPlXPdNvQEY
var fileUploadBLObURL, fileUploadBLOb;
function uploadAndDisplayImage(event) {
  if (failFlag) {
    document.getElementById("failWarning").style.display = "none";
    failFlag = false;
  }
  //Handling image conversion to BLOb.
  var imageToSend = document.getElementById("display-pic");

  file = event.target.files[0];
  // Convert file to Blob
  fileUploadBLOb = new Blob([file], { type: file.type });
  console.log("blob: ", fileUploadBLOb);
  fileUploadBLObURL = URL.createObjectURL(event.target.files[0]);
  imageToSend.src = fileUploadBLObURL;
  console.log(
    "Result of BLOb conversion to URL (display-pic source): ",
    fileUploadBLObURL
  );
  // console.log("imageToSend is actually: ", imageToSend); //<img id="display-pic" width="198" src="blob:http://127.0.0.1:5000/d6cc1045-2909-4c8f-a149-58d76c1b4ea2">

  //Style changes to hide and reveal relevant buttons.
  var uploadButton = document.getElementById("upload");
  var modifyAndConfirmContainer = document.getElementById(
    "modify-and-confirm-container"
  );
  confirmButtonLeft = document.getElementById("confirmButtonLeft");
  var retryButton = document.getElementById("retryButton");

  displayPic = document.getElementById("display-pic");
  imgArea = document.getElementById("img-area");

  uploadButton.style.display = "none";

  confirmButtonLeft.style.display = "block";
  confirmButtonLeft.style.margin = "auto";

  //next up: Centering the display pic button.
  displayPic.style.display = "flex";
  displayPic.style.margin = "auto";

  modifyAndConfirmContainer.style.justifyContent = "center";
}

// var blob;
// function imageDataToURL(input) {
//   // alert("image loaded, conversion function reached.");
//   var file = input.files[0]; //first element in "list of files"
//   var reader = new FileReader(); //instance
//   // reader.onloadend = () => {
//   //   console.log(reader.result);
//   reader.readAsDataURL(file);
//   blob = new Blob([reader.result], { type: file.type });
//   // };
// }

async function sendImageAsBLOb(BLObToSend) {
  try {
    const formData = new FormData();
    formData.append("file", BLObToSend);

    console.log("Blob to send: ", BLObToSend);
    console.log(formData);

    const response = await fetch("http://localhost:5000/preprocess-image", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("HTTP Error Code: " + response.status);
    }
    const data = await response.json();
    getResults(data);
  } catch (error) {
    console.error("Error: ", error);
    badResult();
  }
}

async function filePostImage() {
  //handled this way to avoid modifying function to prevent default.
  let button = document.getElementById("confirmButtonLeft");
  button.disabled = true;

  try {
    await sendImageAsBLOb(fileUploadBLOb);
    button.disabled = false;
  } catch (error) {
    console.error("Error:", error);
    button.disabled = false;
  }
}

async function cameraPostImage() {
  if (failFlag) {
    document.getElementById("failWarning").style.display = "none";
    failFlag = false;
  }
  let button = document.getElementById("confirmButtonRight");
  button.disabled = true;
  try {
    await sendImageAsBLOb(takePictureBLOb);
    button.disabled = false;
  } catch (error) {
    console.error("Error:", error);
    button.disabled = false;
  }
}
var failFlag = false;
function badResult() {
  if (failFlag) {
    console.log("already reached once. no need to do again.");
    document.getElementById("failWarning").style.display = "none";
    failFlag = false;
    // return;
  }
  createdDiv = document.createElement("div");
  createdDiv.id = "failWarning";
  text = "Face not found in image!";
  textNode = document.createTextNode(text);
  createdDiv.appendChild(textNode);
  createdDiv.style.color = "red";

  upload = document.getElementById("upload");
  target = document.getElementById("table");

  target.before(createdDiv);
  upload.style.display = "block";
  upload.style.margin = "auto";
  createdDiv.style.display = "block";
  createdDiv.style.margin = "auto";
  createdDiv.style.textAlign = "center";
  createdDiv.style.fontWeight = "bold";
  console.log("Error sucessfully returned.");
  failFlag = true;
}
function intToRange(num) {
  let rangeBottom = Math.floor(num / 10) * 10;
  let rangeTop = rangeBottom + 10;
  return `${rangeBottom}-${rangeTop}`;
}

function getResults(data) {
  //grab each result, pass the result into a variable
  var age_pred, gender_pred, image;
  for (x in data) {
    age_pred = Math.floor(data[x]["age_pred"]);
    age_range = intToRange(age_pred);
    gender_pred = data[x]["gender_pred"];
    image = data[x]["cropped_image"];
    const text = `Person ${
      parseInt(x) + 1
    } is estimated to be ${age_range} years old. They might be a ${gender_pred}.`;
    createAndShowResult(text, image);

    //generate canvas element. put the elements into the appropriate category.
    console.log(text);
  }
  //show try again button. or simply make it a refresh the page.
  table = document.getElementById("table");
  tryAgainButton = document.getElementById("tryAgain");
  table.style.display = "none";
  tryAgainButton.style.display = "flex";
  tryAgainButton.style.margin = "auto";
}

function createAndShowResult(text, image) {
  // hide table
  //throw up large canvas and div underneath
  //person x, attach data[x]["cropped_image"] to a created canvas element.
  //add text into each div that contains the canvas.
  //const text = "person", x ," is estimated to be ", age_pred ," years old. They might be a ", gender_pred, "."
  //show each image and results. "Person captured"

  //Source: https://www.w3schools.com/jsref/met_document_createelement.asp

  const targetDiv = document.createElement("div");
  targetDiv.id = "sucessfulResponse";
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");

  canvas.width = image[0].length;
  canvas.height = image.length;

  for (let y = 0; y < image.length; y++) {
    for (let x = 0; x < image[y].length; x++) {
      const pixel = image[y][x];
      context.fillStyle = `rgb(${pixel[2]}, ${pixel[1]}, ${pixel[0]})`; //rgb order backwards because opencv reverses colour channel and this modification is quicker than changing my function response.
      context.fillRect(x, y, 1, 1);
    }
  }
  //insert results into document and hide table
  targetDiv.appendChild(canvas);
  //textNode => https://stackoverflow.com/questions/5677799/how-to-append-text-to-a-div-element
  textNode = document.createTextNode(text);
  targetDiv.appendChild(textNode);
  table = document.getElementById("table");

  table.before(targetDiv);
  //inefficent, hides table every time this is called.

  targetDiv.style.display = "flex";
  targetDiv.style.margin = "auto";
  targetDiv.style.textAlign = "center";
}

function restartSite() {
  location.reload();
}
