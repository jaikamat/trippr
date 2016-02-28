// SET GLOBAL OBJECT THAT BOTH FUNCTIONS CAN PUSH AND PULL HEADINGS TO!
var global = {
    faceFound: false,
    zfound: false,
    initialX: 0,
    initialY: 0,
    initialZ: 0,
    varianceX: 0,
    varianceX: 0,
    varianceZ: 0,
    Zcounter: 0
};

var thisistheplace;

// function returnRandomLatLong () {
//   var obj = {};
//   obj.lat = Math.random() * (85 * 2) - 85;
//   obj.lng = Math.random() * (180 * 2) - 180;
//   return obj;
// }

// var astorPlace = new google.maps.LatLng(40.729884, -73.990988);
// var webService = new google.maps.StreetViewService();  
// /**Check in a perimeter of 50 meters**/ 
// var checkaround = 50;
// /** checkNearestStreetView is a valid callback function **/
// webService.getPanoramaByLocation(astorPlace, checkaround, checkNearestStreetView);

// function checkNearestStreetView(panoData){
//     if(panoData){
//          if(panoData.location){
//             if(panoData.location.latLng){
//                 thisistheplace = panoData.location.latLng
                // console.log(thisistheplace);
//             }
//         }
//     }
//     /** Else do something... **/
// }

function difference(link) {
  var diff = Math.abs(global.panorama.pov.heading % 360 - link.heading);
  if(diff > 180)
     diff = Math.abs(360 - diff);

  return diff;
}

function moveForward () {
  var current;
  for (var i = 0; i < global.panorama.links.length; i++) {
    var differ = difference(global.panorama.links[i]);
    if (current == undefined) {
      current = global.panorama.links[i]
    }
    if (difference(current) > difference(global.panorama.links[i])) {
      current = global.panorama.links[i]
    }
  }
  global.panorama.setPano(current.pano);
}

function initializePanorama () {
  //var place = returnRandomLatLong();

  var fenway = {lat: 37.820166, lng: -122.478255};
  var panorama = new google.maps.StreetViewPanorama(
    document.getElementById('pano'), {
      position: fenway,
      pov: {
        heading: 0,
        pitch: 0,
        zoom: 1
      },
      // linksControl: false,
      panControl: false,
      fullscreenControl: false,
      addressControl: false,
      zoomControl: false
    }
  );
  global.currentHeading = 0;
  global.currentPitch = 0;
  global.currentZoom = 1;
  global.panorama = panorama;
}

function drawRectangle (canvasContext, dataToUse) {
  // work into a rectangleDraw function?
  canvasContext.strokeStyle = '#00ff00';
  canvasContext.strokeRect(dataToUse.x - dataToUse.width/2, dataToUse.y - dataToUse.height/2, dataToUse.width, dataToUse.height);
  canvasContext.font = '11px Helvetica';
  canvasContext.fillStyle = "#ffffff";
  //canvasContext.fillText('x: ' + dataToUse.x + 'px', dataToUse.x - dataToUse.width/2 + dataToUse.width + 5, dataToUse.y + 11);
  //canvasContext.fillText('y: ' + dataToUse.y + 'px', dataToUse.x - dataToUse.width/2 + dataToUse.width + 5, dataToUse.y + 22);
}

  window.onload = function () {
    $("#myModal").modal();
    $('#myModal').on('hidden.bs.modal', function () {
      var canvas = document.getElementById("inputCanvas");
      var context = canvas.getContext("2d");
      var videoInput = document.getElementById('inputVideo');
      var canvasInput = document.getElementById('inputCanvas');

      var htracker = new headtrackr.Tracker();
      htracker.init(videoInput, canvasInput);
      htracker.start();

      document.addEventListener("headtrackrStatus", function (event) {
        //console.log(event);
        if (event.status === "lost") {
          global.facefound = false;
          global.zfound = false;
        }
      })

      document.addEventListener("facetrackingEvent", function (event) {
        if (!global.facefound) {
          global.initialX = event.x;
          global.initialY = event.y;
          global.facefound = true;
        }
          drawRectangle(context, event)
          //console.log(event);

        // calculate the difference in x and y from the initial
          global.varianceX = event.x - global.initialX;
          global.varianceY = global.initialY - event.y;

          // reset the current heading and pitch
          global.currentHeading = global.currentHeading + global.varianceX / 15; // this number is arbitrary
          global.currentPitch = global.currentPitch + global.varianceY / 5

          // this writes the new heading and pitch based on camera
          global.panorama.setPov({
            heading: -global.currentHeading,
            pitch: 0/*global.currentPitch*/,
            zoom: global.currentZoom
          })
        }
      );

      document.addEventListener("headtrackingEvent", function (event) {
        //console.log(event);
        if (!global.zfound) {
          global.initialZ = event.z;
          global.zfound = true;
        }
        global.varianceZ = (global.initialZ - event.z);
        // this smoothes the transition from zoom to zoom
        if (global.varianceZ >= 12) {
          global.Zcounter += 1;
          if (global.Zcounter > 5) {
            moveForward();
            global.Zcounter = 0;
          }
        // } else if (global.varianceZ < -5) {
        //   global.Zcounter -= 1;
        //   if (global.Zcounter < -20) {
        //     global.currentZoom = 0;
        //   }
        // } else {
        //   global.Zcounter = 0;
        //   global.currentZoom = 1;
        }
        // else {
        //   global.Zcounter = 0;
        // }
        console.log(global.varianceZ);
      })

      //console.log(global.panorama.links[0])

    // this is the modal parenthesis  
    // Office Hours:
    // should I finish this and polish it for employers?
    // additional functonality
    // how to integrate a database?
    // if Dan knows some cool stuff about Cardboard
    // can I integrate this with cardboard somehow to make the context
    // of the app known?
    })
  }