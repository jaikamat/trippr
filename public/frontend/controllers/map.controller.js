app.controller("MapController", function ($scope) {

  $scope.$on("$destroy", function () {
    console.log("trip state scope destroyed!")
    htracker.stop();
    var mediaStream = htracker.stream;
    mediaStream.getVideoTracks()[0].stop();
    document.removeEventListener("facetrackingEvent", faceTrackingEvent);
    document.removeEventListener("headtrackrStatus", headTrackrStatus);
    document.removeEventListener("headtrackingEvent", headTrackingEvent);
  })

  var faceFound = false;
  var zfound = false;
  var initialX = 0;
  var initialY = 0;
  var initialZ = 0;
  var varianceX = 0;
  var varianceX = 0;
  var varianceZ = 0;
  var Zcounter = 0;
  var currentHeading = 0;
  var currentPitch = 0;
  var currentZoom = 1;
  var panorama;

  function difference(link) {
    var diff = Math.abs(panorama.pov.heading % 360 - link.heading);
    if(diff > 180)
       diff = Math.abs(360 - diff);

    return diff;
  }

  function moveForward () {
    var current;
    for (var i = 0; i < panorama.links.length; i++) {
      var differ = difference(panorama.links[i]);
      if (current == undefined) {
        current = panorama.links[i]
      }
      if (difference(current) > difference(panorama.links[i])) {
        current = panorama.links[i]
      }
    }
    panorama.setPano(current.pano);
  }

  initializePanorama = function initializePanorama () {
    var fenway = { lat: 37.820166, lng: -122.478255 };
    var mapOptions = {
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
      zoomControl: false,
      draggable: false,
      rotateControl: false,
      scrollwheel: false,
      navigationControl: false
      // NOTE: Turning webgl on increases performace when /in/ a pano,
      // but greatly decreases user performance when shifting to new links
      // mode: "webgl"
    }
    panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), mapOptions);
    currentHeading = 0;
    currentPitch = 0;
    currentZoom = 1;
    panorama = panorama;
  }

  function drawRectangle (canvasContext, dataToUse) {
    canvasContext.strokeStyle = '#00ff00';
    canvasContext.strokeRect(dataToUse.x - dataToUse.width/2, dataToUse.y - dataToUse.height/2, dataToUse.width, dataToUse.height);
    canvasContext.font = '11px Helvetica';
    canvasContext.fillStyle = "#ffffff";
  }

  function setup () {
    this.canvas = document.getElementById("inputCanvas");
    this.context = canvas.getContext("2d");
    this.videoInput = document.getElementById('inputVideo');
    this.canvasInput = document.getElementById('inputCanvas');
    this.mapDiv = document.getElementById("theMapDiv");

    this.htracker = new headtrackr.Tracker();
    this.htracker.init(videoInput, canvasInput);
    this.htracker.start();
  }

  $scope.load = function () {
    $("#myModal").modal();
    $('#myModal').on('hidden.bs.modal', function () {

    function headTrackrStatus (event) {
      if (event.status === "lost") {
        faceFound = false;
        zfound = false;
      }
    }

    function faceTrackingEvent (event) {
      if (!faceFound) {
        initialX = event.x;
        initialY = event.y;
        faceFound = true;
      }
      drawRectangle(context, event)

      // calculate the difference in x and y from the initial
      varianceX = event.x - initialX;
      varianceY = initialY - event.y;

      // reset the current heading and pitch
      currentHeading = currentHeading + varianceX / 15; // this number is arbitrary
      currentPitch = currentPitch + varianceY / 5

      // this writes the new heading and pitch based on camera
      panorama.setPov({
        heading: -currentHeading,
        pitch: 0/*currentPitch*/,
        zoom: currentZoom
      })
    }

    function headTrackingEvent (event) {
      if (!zfound) {
        initialZ = event.z;
        zfound = true;
      }
      varianceZ = (initialZ - event.z);
      // this smoothes the transition from zoom to zoom
      if (varianceZ >= 12) {
        Zcounter += 1;
        if (Zcounter > 5) {
          moveForward();
          Zcounter = 0;
        }
      }
    }

    setup();
    document.addEventListener("headtrackrStatus", headTrackrStatus);
    document.addEventListener("facetrackingEvent", faceTrackingEvent);
    document.addEventListener("headtrackingEvent", headTrackingEvent);

    // TODO: fix state change event destruction error
    })
  }
})