const config = require('../config');

module.exports = function(canvas, width, height, x = 0, y = 0) {
  var {width: newWidth, height: newHeight} = config.matrix;
  var newCanvas = $("<canvas>")
      .attr("width", newWidth)
      .attr("height", newHeight)[0];
  newCanvas.getContext("2d").drawImage(canvas, x, y, width, height, 0, 0, newWidth, newHeight);
  return newCanvas.getContext("2d").getImageData(0, 0, newWidth, newHeight);
}
