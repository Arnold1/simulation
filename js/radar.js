function Radar() {
  var _this = this;
  _this.ctx;
  _this.sweepAngle;
  _this.sweepSpeed;
  _this.diameter;
  _this.radius;
  _this.hueStart;
  _this.hueEnd;
  _this.hueDiff;
  _this.saturation;
  _this.lightness;
  _this.sweepSize;
  _this.gradient;
  _this.rings;
  _this.lineWidth;

  var init = function(xpos, ypos) {
    _this.ctx = getRadarCanvasContext();
    _this.sweepAngle = 180;
    _this.sweepSpeed = 1.2;
    _this.diameter = 300;//580;
    _this.radius = _this.diameter / 2;
    _this.hueStart = 120;
    _this.hueEnd = 170;
    _this.hueDiff = Math.abs( _this.hueEnd - _this.hueStart );
    _this.saturation = 50;
    _this.lightness = 40;
    _this.sweepSize = 2;
    _this.gradient = _this.ctx.createLinearGradient(_this.radius, 0, 0, 0);
    _this.gradient.addColorStop(0, 'hsla( ' + _this.hueStart + ', ' + _this.saturation + '%, ' + _this.lightness + '%, 1 )');
    _this.gradient.addColorStop(1, 'hsla( ' + _this.hueEnd + ', ' + _this.saturation + '%, ' + _this.lightness + '%, 0.1 )');
    _this.rings = 4;
    _this.lineWidth = 2;
  }

  _this.renderRings = function(xpos, ypos) {
    var i;

    for (i = 0; i < _this.rings; i++) {
      _this.ctx.beginPath();
      _this.ctx.arc(_this.radius + xpos, _this.radius + ypos, (_this.radius - _this.lineWidth / 2) / _this.rings * (i + 1), 0, Math.PI, true);
      _this.ctx.strokeStyle = 'hsla(' + (_this.hueEnd - i * (_this.hueDiff / _this.rings)) + ', ' + _this.saturation + '%, ' + _this.lightness + '%, 0.1)';
      _this.ctx.lineWidth = _this.lineWidth;
      _this.ctx.stroke();
    }
  }

  _this.renderGrid = function(xpos, ypos) {
    _this.ctx.beginPath();
    _this.ctx.moveTo( _this.radius - _this.lineWidth / 2 + xpos, _this.lineWidth + ypos);
    _this.ctx.lineTo( _this.radius - _this.lineWidth / 2 + xpos, _this.diameter/2 - _this.lineWidth + ypos);
    _this.ctx.moveTo( _this.lineWidth + xpos, _this.radius - _this.lineWidth / 2 + ypos);
    _this.ctx.lineTo( _this.diameter - _this.lineWidth + xpos, _this.radius - _this.lineWidth / 2 + ypos);
    _this.ctx.strokeStyle = 'hsla( ' + ( ( _this.hueStart + _this.hueEnd ) / 2) + ', ' + _this.saturation + '%, ' + _this.lightness + '%, .03 )';
    _this.ctx.fillStyle = _this.gradient;
    _this.ctx.stroke();
  }

  _this.renderScanLines = function() {
    var i;
    var j;
    _this.ctx.beginPath();
    for( i = 0; i < _this.diameter; i += 2 ){    
      _this.ctx.moveTo( 0, i + .5 );
      _this.ctx.lineTo( _this.diameter, i + .5);
    }
    _this.ctx.lineWidth = 1;
    _this.ctx.strokeStyle = 'hsla( 0, 0%, 0%, .02 )';
    _this.ctx.globalCompositeOperation = 'source-over';
    _this.ctx.stroke();
  }


  _this.renderSweep = function(xpos, ypos) {
    _this.ctx.save();
    _this.ctx.translate(this.radius + xpos, this.radius + ypos);
    _this.ctx.rotate(dToR(_this.sweepAngle));
    _this.ctx.beginPath();
    _this.ctx.moveTo(0, 0);
    _this.ctx.arc(0, 0, _this.radius, dToR(-_this.sweepSize), dToR(_this.sweepSize), false);
    _this.ctx.closePath();
    _this.ctx.fillStyle = _this.gradient;
    _this.ctx.fill();
    _this.ctx.restore();
  }

  _this.clear = function() {
    _this.ctx.globalCompositeOperation = 'destination-out';
    _this.ctx.fillStyle = 'hsla( 0, 0%, 0%, 0.1 )';
    _this.ctx.fillRect(0, 0, _this.ctx.width, _this.ctx.height);
  }

  _this.update = function() {
    _this.sweepAngle += _this.sweepSpeed;

    if (_this.sweepAngle >= 360) {
      _this.sweepAngle = 180;
    }
  }

  _this.draw = function() {
    _this.ctx.globalCompositeOperation = 'lighter';

    _this.renderRings(500, 580);
    _this.renderGrid(500, 580);
    _this.renderSweep(500, 580);
    _this.renderScanLines();

    // x = 650
    //drawLine(_this.ctx, 650, 600, 650, 200);
    // y = 730
    //drawLine(_this.ctx, 300, 730, 800, 730);
  }

  init();
}