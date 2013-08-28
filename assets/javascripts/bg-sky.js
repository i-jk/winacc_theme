/**
 * @file
 * JS for Radix Starter.
 */
 

(function ($) {
  
  
  /**
   * Detect Daylight Savings - from: http://stackoverflow.com/a/11888430
   */
  Date.prototype.stdTimezoneOffset = function() {
      var jan = new Date(this.getFullYear(), 0, 1);
      var jul = new Date(this.getFullYear(), 6, 1);
      return Math.min(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  }

  Date.prototype.dst = function() {
      return this.getTimezoneOffset() < this.stdTimezoneOffset();
  }

  Date.prototype.yearUnitInterval = function() {
    var yn = this.getFullYear();
    var mn = this.getMonth();
    var dn = this.getDate();
    var d1 = new Date(yn,0,1,12,0,0); // noon on Jan. 1
    var d2 = new Date(yn,mn,dn,12,0,0); // noon on input date
    var ddiff = Math.round((d2-d1)/864e5);
    // Solar vs calendar offset (tropical year)
    const tropicalYearOffset = -0.028044764;
    var daysInYear = 365;
    if ((yn%4 == 0) && (yn%100 != 0 || yn%400 == 0)) {
      daysInYear = 366; // leap year
    }
    return ((ddiff + 1) / daysInYear) + tropicalYearOffset;
  }

  Date.prototype.dayUnitInterval = function() {
    var h = this.getHours();
    // adjust for Daylight Saving Hours
    if (this.dst()) {
      h--;
    }
    var m = this.getMinutes();
    var s = this.getSeconds() / 60;
    return (h * 60 + m + s) / 1440;
  }
  
  // on load
  $(document).ready(function() {
    // Bail if no support for opacity...
    // @see http://caniuse.com/css-opacity: 87% browsers OK in August 2013.
    if (!Modernizr.opacity) return;
    
    // OK, set background ASAP.
    setBackground(getColours(new Date()));
    
    // Begin timed bg change.
    var iJK_timer = setInterval(function() {
      var c = getColours(new Date());
      // console.log(c);
      setBackground(c);
      
      /*.css('filter','progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#FFFFFF\', endColorstr=\'#'+event.backgroundColor+'\', gradientType=1)')
      .css('background-image','-webkit-gradient(linear, left top, right bottom, color-stop(0.1, #FFFFFF), color-stop(0.99, #'+event.backgroundColor+'))')
      .css('background-image','-moz-linear-gradient(top left, #FFFFFF 0%, #'+event.backgroundColor+' 100%)')
      .css('background-image','-o-linear-gradient(top left, #FFFFFF 0%, #'+event.backgroundColor+' 100%)')
      .css('background-image','linear-gradient(top left, #FFFFFF 0%, #'+event.backgroundColor+' 100%)')*/
    }, 15000);
  });

function setBackground(c) {
  // Set sky colours.
  if (Modernizr.cssgradients) {
    // Good browser
    $('#primary-page')
      // Webkit new
      .css('background-image', '-webkit-linear-gradient(top, ' + c[0] + ' 0%, ' + c[1] + ' 40%, ' + c[2] + ' 70%, ' + c[3] + ' 100%)')
    ;
  }
  else {
    // old browsers only get single colour bg change
    $('#primary-page').css('background-color', c[1]);
  }
  
  // Set grass
  $('#grass-bright').css('opacity', c[4]);
  $('#grass-dark').css('opacity', 1 - c[4]);
}

function baisInt(a, b, weight) {
    return Math.round((a * (1 - weight)) + (b * weight));
}
function biasFloat(a, b, weight) {
    return (a * (1 - weight)) + (b * weight);
}


/**
 * Returns current 'brightness' of sun, 0 to 4
 * d is a Date object.
 * 
 * @todo abstract out the number (4) of steps that map to the colours
 */
function getSolarPosition(d) {
  // dayUnitInterval is a value 0-1 from Date.dayUnitInterval().
  // Convert d.yearUnitInterval into hours change -- for Winchester, UK
  // there's ~8 hours diff winter->summer (Equinox having 12h days)
  var hoursChange = (d.yearUnitInterval * 8) - 4;
  return Math.abs(Math.sin(1 * Math.PI * (d.dayUnitInterval(d) + .5)) * 4);
}

/**
 * Gets the CSS3 colour gradient rgb stops based on Date d.
 */
function getColours(d) {
    var pos = getSolarPosition(d.dayUnitInterval());
    var first = Math.floor(pos);
    var second = Math.ceil(pos)
    var bias = (pos - first);
    var colours = [
      // [0] coloursTop
      'rgb('
        + baisInt(coloursTop[first][0], coloursTop[second][0], bias) + ', '
        + baisInt(coloursTop[first][1], coloursTop[second][1], bias) + ', '
        + baisInt(coloursTop[first][2], coloursTop[second][2], bias) + ')',
       // [1] coloursHigh
      'rgb('
        + baisInt(coloursHigh[first][0], coloursHigh[second][0], bias) + ', '
        + baisInt(coloursHigh[first][1], coloursHigh[second][1], bias) + ', '
        + baisInt(coloursHigh[first][2], coloursHigh[second][2], bias) + ')',
      // [2] coloursLow
      'rgb('
        + baisInt(coloursLow[first][0], coloursLow[second][0], bias) + ', '
        + baisInt(coloursLow[first][1], coloursLow[second][1], bias) + ', '
        + baisInt(coloursLow[first][2], coloursLow[second][2], bias) + ')',
      // [3] coloursHorizon
      'rgb(' 
        + baisInt(coloursHorizon[first][0], coloursHorizon[second][0], bias) + ', '
        + baisInt(coloursHorizon[first][1], coloursHorizon[second][1], bias) + ', '
        + baisInt(coloursHorizon[first][2], coloursHorizon[second][2], bias) + ')',
      // [4] opacity of grass
      biasFloat(coloursTop[first][3], coloursTop[second][3], bias)
    ];
  return colours;
}




/** 
 * Colors arrays for background sky gradient...
 * 
 * Each variable is for a point on the gradient:
 *  Top = 0%
 *  High = 50%
 *  Low = 80%
 *  Horizon = 100%
 * 
 * Each set of values is Red, Green, Blue for each of the times outlined below.
 * The forth value in coloursTop is the opacity of the grass layers.
 * 
 * Times/index:
 *  0 = midday
 *  1 = 10:04:11, 13:55:50
 *  2 = 08:00:00, 16:00:00
 *  3 = 05:31:16, 18:28:44
 *  4 = midnight
 */
var coloursTop = [
  [150, 209, 255, 1.0], 
  [ 98, 186, 255, 0.75], 
  [ 74, 136, 185, 0.4],
  [  2,  27,  48, 0.1],
  [  0,   5,  14, 0.0]
];
var coloursHigh = [
  [173, 221, 255],
  [ 98, 186, 255], 
  [ 97, 167, 216],
  [  5,  38,  60],
  [  0,  15,  37]
];
var coloursLow = [
  [219, 240, 255],
  [142, 208, 255], 
  [194, 189, 152],
  [ 43,  60,  73],
  [  8,  36,  66]
];
var coloursHorizon = [
  [237, 246, 252],
  [199, 231, 255], 
  [255, 139,  32],
  [122,  94,  83],
  [ 39,  60,  77]
];


})(jQuery);
