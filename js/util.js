/*****************************************/
//Utility
function getRadarCanvasContext() {
  return radarctx;
}

function getOutputCanvasContext() {
  return outputctx;
}

function clearOutputCanvas() {
  outputctx.clearRect(0, 0, outputcanvas.width, outputcanvas.height);
}

function drawCircle(mycanvas, x, y, r) {
  mycanvas.beginPath();
  mycanvas.strokeStyle = "#46A546";
  mycanvas.arc(x, y, r, 0, 2.0 * Math.PI);
  mycanvas.stroke();
}

function drawText(mycanvas, message) {
  mycanvas.font = "30px Arial Narrow";
  mycanvas.fillText(message, 50, 50);
}

function displayText(mycanvas, msg, offset) {
  mycanvas.fillStyle = "#ffffff";
  mycanvas.font = "30px Arial";
  mycanvas.fillText(msg, 10, offset);
}

function drawLine(mycanvas, x, y, x2, y2) {
  mycanvas.strokeStyle = "#46A546";
  mycanvas.beginPath();
  mycanvas.moveTo(x, y);
  mycanvas.lineTo(x2, y2);
  mycanvas.stroke();
}

function dToR(degrees) {
  return degrees * (Math.PI / 180);
}

function rToD(radians) {
  return radians * (180 / Math.PI);
}

function rand(min, max) {
  return Math.floor((Math.random() * max) + min);
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: (evt.clientX - rect.left) * resratio,
    y: (evt.clientY - rect.top) * resratio
  };
}

function isMouseInArea(mouseX, mouseY) {
  var l = planes.length;

  for (var i = l - 1; i >= 0; i--) {
    if (mouseX >= (planes[i].x) && mouseX < (planes[i].x + planes[i].w) && 
        mouseY >= (planes[i].y) && mouseY < (planes[i].y + planes[i].h)) {
      selectedPlane = i; // todo dont use golbal vars!
      return true;
    }
  }

  return false;
}