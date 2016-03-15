// https://jsfiddle.net/98xek7x0/1/
var radar;
var planes;
var radarcanvas;
var outputcanvas;
var infocanvas;
var outputctx;
var radarctx;
var infoctx;
var WIDTH;
var resratio;
var dialogOpened;
var selectedPlane;

$(document).ready(function() {
  initResRatio();
  initCanvas();
  allocObjects();
  createEventListeners();
  createPlanes();
  animate();
  resizeCanvas(); // Draw canvas border for the first time.
});

function animate() {
  requestAnimFrame(animate);

  outputctx.fillRect(0, 0, outputcanvas.width, outputcanvas.height);

  clearOutputCanvas();
  radar.clear();
  radar.update();
  draw();
  updatePlaneInfoDialog();

  outputctx.drawImage(radarcanvas, 0, 0);
  //outputctx.drawImage(radarcanvas,0,0,radarcanvas.width,radarcanvas.height,0,0,outputcanvas.width,outputcanvas.height);
}

window.countFPS = (function() {
  var lastLoop = (new Date()).getMilliseconds();
  var count = 1;
  var fps = 0;

  return function() {
    var currentLoop = (new Date()).getMilliseconds();
    if (lastLoop > currentLoop) {
      fps = count;
      count = 1;
    } else {
      count += 1;
    }
    lastLoop = currentLoop;
    return fps;
  };
}());

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( /* function */ callback, /* DOMElement */ element) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

function initResRatio() {
  WIDTH = $('#myCanvas').attr('width');
  resratio = WIDTH / $('#myCanvas').width();
}

function initCanvas() {
  outputcanvas = document.getElementById("myCanvas");
  outputcanvas.width = outputcanvas.scrollWidth;
  outputcanvas.height = outputcanvas.scrollHeight;

  radarcanvas = document.createElement("canvas");
  radarcanvas.width = outputcanvas.width;
  radarcanvas.height = outputcanvas.height;

  outputctx = outputcanvas.getContext("2d");
  outputctx.width = outputcanvas.width;
  outputctx.height = outputcanvas.height;

  radarctx = radarcanvas.getContext("2d");
  radarctx.width = outputcanvas.width;
  radarctx.height = outputcanvas.height;
}

function allocObjects() {
  radar = new Radar();
  planes = new Array();
}

function createEventListeners() {
  // form submit delegation
  $(document).on("submit", '.myForm', readPlaneInfoParams);

  // mousedown listener
  outputcanvas.addEventListener('mousedown', function(evt) {
    var mousePos = getMousePos(outputcanvas, evt);
    
    if (isMouseInArea(mousePos.x, mousePos.y)) {
      selectPlane(selectedPlane);
      createPlaneInfoDlg();
    } else {
      selectedPlane = -1;
      selectPlane(selectedPlane);
    }
  }, false);

  // keypress listener
  window.addEventListener("keypress", function(evt) {
    if (evt.keyCode == 100) { // key == d
      if (selectedPlane >= 0) {
        planes[selectedPlane].setDeactivate();
      }
    }
  }, false);

  window.setInterval(updatePlanePos, 1000);
  window.addEventListener('resize', resizeCanvas, false);
}

function selectPlane(planeId) {
  for (var p in planes) {
    if (p == planeId) {
      planes[p].setSelection(true);
    } else {
      planes[p].setSelection(false);
    }
  }
}

function createPlaneInfoDlg() {
  if (!dialogOpened) {
    dialogOpened = true;
  }
  else {
    return;
  }

  var offset = Math.abs($(window).height() - $('#myCanvas').height());

  $('<div id="msg_dialog"></div>').dialog({
    modal: false,
    height: 350,
    width: 220,
    draggable: true,
    resizable: false,
    closeOnEscape: true,
    title: "Aircraft Parameter",
    dialogClass: 'ui-widget-overlay',
    position: {
      my: 'left bottom',
      at: 'left bottom-' + offset
    },

    open: function(event, ui) {
      $(this).find("[type=submit]").hide();
      $(this).html($('#dialog-template').html());
    },
    close: function() {
      $("#msg_dialog").remove();
      dialogOpened = false;
    },
    buttons: [{
      text: "Ok",
      click: $.noop,
      type: "submit",
      //form: "myForm", // <-- Make the association
      click: function() {
        $(this).dialog("close");
        $("#msg_dialog").remove();
        dialogOpened = false;
      }
    }]
  }); //end confirm dialog*/
}

function readPlaneInfoParams(e) {
  e.preventDefault();
  var currentId = $(e.currentTarget).data('id');
  console.log(currentId);
}

function updatePlaneInfoDialog() {
  if (dialogOpened) {
    var str1 = 'Plane Code: ' + planes[selectedPlane].getCode();
    $('#aircraftId').text(str1);

    var str2 = 'Altitude: ' + planes[selectedPlane].getAltitude();
    $('#altitude').text(str2);

    var str3 = 'Speed: ' + planes[selectedPlane].getSpeed();
    $('#speed').text(str3);

    var str4 = 'Heading: ' + planes[selectedPlane].getDirection(650, 730) + ' deg';
    $('#heading').text(str4);

    var str5 = 'Distance: ' + planes[selectedPlane].getDistance(650, 730);
    $('#distance').text(str5);

    //$('#iff').val("blabal");
  }
}

function createPlanes() {
  var p1 = new Plane(0, rand(100, 360), "WT-2341", 8000);
  var p2 = new Plane(0, rand(100, 360), "CS-7211", 3000);
  var p3 = new Plane(0, rand(100, 360), "AT-7070", 2000);

  planes.push(p1);
  planes.push(p2);
  planes.push(p3);

  return planes
}

function draw() {
  //re draw the radar
  radar.draw();

  //draw planes
  for (var p in planes) {
    if (planes[p].isActive()) {
      planes[p].draw();
    }
  }
}

function updatePlanePos() {
  var headingAngleMin = 0;
  var headingAngleMax = 100;
  var maxIncLen = 1;

  for (var p in planes) {
    if (planes[p].isActive()) {
      var heading = rand(headingAngleMin, headingAngleMax);
      var headingRand = dToR(heading);
      var xInc = Math.cos(headingRand) * maxIncLen;
      var yInc = Math.sin(headingRand) * maxIncLen;

      planes[p].move(xInc, yInc);
    }

    //planes[p].rotate(10);
  }
}

function resizeCanvas() {
  var widthToHeight = outputcanvas.width / outputcanvas.height;
  var newWidth = window.innerWidth;
  var newHeight = window.innerHeight;
  var newWidthToHeight = newWidth / newHeight;

  if (newWidthToHeight > widthToHeight) {
    newWidth = newHeight * widthToHeight;
    canvasesdiv.style.height = newHeight + 'px';
    canvasesdiv.style.width = newWidth + 'px';
  } else {
    newHeight = newWidth / widthToHeight;
    canvasesdiv.style.width = newWidth + 'px';
    canvasesdiv.style.height = newHeight + 'px';
  }

  outputcanvas.style.width = newWidth + 'px';
  outputcanvas.style.height = newHeight + 'px';
  radarcanvas.style.width = newWidth + 'px';
  radarcanvas.style.height = newHeight + 'px';

  resratio = WIDTH / newWidth;

  draw();
}