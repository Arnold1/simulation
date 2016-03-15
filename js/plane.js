function Coordinates(x, y) {
  this.x = x;
  this.y = y;
}

function Plane(x, y, code, altitude) {
  var _this = this;
  _this.x = -1000;
  _this.y = -1000;
  _this.xOld = 0;
  _this.yOld = 0;
  _this.h = 5;
  _this.w = 5;
  _this.code = "";
  _this.speed = 100;
  _this.altitude = 0;
  _this.isSelected = false;
  _this.active = true;
  _this.ctx;

  var init = function() {
    _this.x = x;
    _this.y = y;
    _this.code = code;
    _this.altitude = altitude;
    _this.ctx = getOutputCanvasContext();
  }

  this.calcHeadingPos = function(HeadingLen, x, y, xOld, yOld) {
    var headingAngle = Math.atan2(y - yOld, x - xOld);
    var yInc = Math.sin(headingAngle) * HeadingLen;
    var xInc = Math.cos(headingAngle) * HeadingLen;
    var HeadingXPos = x + xInc;
    var HeadingYPos = y + yInc;
    return new Coordinates(HeadingXPos, HeadingYPos);
  }

  this.setDeactivate = function() {
    _this.active = false;
  }

  this.isActive = function() {
    return _this.active == true;
  }

  this.setSelection = function(selected) {
    _this.isSelected = selected;
  }

  this.getCode = function() {
    return _this.code;
  }

  this.getAltitude = function() {
    return _this.altitude;
  }

  this.getSpeed = function() {
    return _this.speed;
  }

  this.getDistance = function(targetX, targetY) {
    var dx = Math.abs(targetX - _this.x);
    var dy = Math.abs(targetY - _this.y);
    return Math.sqrt(dx * dx + dy * dy).toFixed(2);
  }

  this.getDirection = function(targetX, targetY) {
    var headingAngle = Math.atan2(_this.y - _this.yOld, _this.x - _this.xOld);
    var theta_radians = Math.atan2(targetY - _this.y, targetX - _this.x);
    return rToD(theta_radians-headingAngle).toFixed(2);
  }

  this.draw = function() {
    // draw selection box
    _this.ctx.save();
    _this.ctx.setLineDash([5,2]);
    _this.ctx.fillStyle = "#ffffff";
    _this.ctx.fillRect(_this.x, _this.y, _this.h, _this.w);
    if (_this.isSelected) {
      _this.ctx.strokeStyle = "#f00";
    }
    else {
      _this.ctx.strokeStyle = "#fff";
    }
    _this.ctx.strokeRect(_this.x - _this.h/2, _this.y - _this.w/2, _this.h * 2, _this.w * 2);
    _this.ctx.restore();

    // draw heading direction
    if (_this.xOld > 0) {
      var headingPos = _this.calcHeadingPos(20, _this.x, _this.y, _this.xOld, _this.yOld);

      _this.ctx.beginPath();
      _this.ctx.moveTo(_this.x + _this.w / 2, _this.y + _this.h / 2);
      _this.ctx.lineTo(headingPos.x + _this.w / 2, headingPos.y + _this.h / 2);
      _this.ctx.strokeStyle = '#ffffff';
      _this.ctx.stroke();
    }

    // draw box which represents the plane, with show plane id as text
    _this.ctx.fillStyle = "#ffffff";
    _this.ctx.font = "10px Arial";
    _this.ctx.fillText(_this.code, _this.x + _this.w * 2, _this.y + _this.h);
  }

  this.move = function(xInc, yInc) {
    _this.xOld = _this.x;
    _this.yOld = _this.y;

    _this.x += xInc;
    _this.y += yInc;

    // update pos if plane pos reaches the screen size
    if (_this.x > _this.ctx.width) {
      _this.x = 0;
    } else if (_this.x < 0) {
      _this.x = _this.ctx.width;
    }

    if (_this.y > _this.ctx.height) {
      _this.y = 0;
    } else if (_this.y < 0) {
      _this.y = _this.ctx.height;
    }
  }

  // reference: http://www.gamefromscratch.com/post/2012/11/24/GameDev-math-recipes-Rotating-one-point-around-another-point.aspx
  this.rotate = function(angle) {
    var angleRad = dToR(angle);
    var centerX = 290;
    var centerY = 290;

    _this.xOld = _this.x;
    _this.yOld = _this.y;

    _this.x = Math.cos(angleRad) * (_this.xOld - centerX) - Math.sin(angleRad) * (_this.y - centerY) + centerX;
    _this.y = Math.sin(angleRad) * (_this.xOld - centerX) + Math.cos(angleRad) * (_this.y - centerY) + centerY;
  }

  init();
}