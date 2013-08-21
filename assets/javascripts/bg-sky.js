/**
 * @file
 * JS for Radix Starter.
 */
(function ($) {
  
  // Start timer interval on load
  $(document).ready(function() {
    console.log(getColours(new Date()));
    
    var iJK_timer = setInterval(function() {
      var c = getColours(new Date());
      console.log(c);

      $('#primary-page').css('background-color', c[0]);
      /*.css('filter','progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#FFFFFF\', endColorstr=\'#'+event.backgroundColor+'\', gradientType=1)')
      .css('background-image','-webkit-gradient(linear, left top, right bottom, color-stop(0.1, #FFFFFF), color-stop(0.99, #'+event.backgroundColor+'))')
      .css('background-image','-moz-linear-gradient(top left, #FFFFFF 0%, #'+event.backgroundColor+' 100%)')
      .css('background-image','-o-linear-gradient(top left, #FFFFFF 0%, #'+event.backgroundColor+' 100%)')
      .css('background-image','linear-gradient(top left, #FFFFFF 0%, #'+event.backgroundColor+' 100%)')*/
      
      c[4]
      $('#grass-bright').css('opacity', c[4]);
      $('#grass-dark').css('opacity', 1 - c[4]);
    }, 5000);
  });

function baisInt(a, b, weight) {
    return Math.round((a * (1 - weight)) + (b * weight));
}
function biasFloat(a, b, weight) {
    return (a * (1 - weight)) + (b * weight);
}


/**
 * Returns current position of year cycle (0 = start, 1 = end)
 * d is a Date object
 */
function progressOfYear(d) {
  var yn = d.getFullYear();
  var mn = d.getMonth();
  var dn = d.getDate();
  var d1 = new Date(yn,0,1,12,0,0); // noon on Jan. 1
  var d2 = new Date(yn,mn,dn,12,0,0); // noon on input date
  var ddiff = Math.round((d2-d1)/864e5);
  if ((yn%4 == 0) && (yn%100 != 0 || yn%400 == 0)) {
    // leap year
    return (ddiff + 1) / 366;
  }
  // non-leap year
  return (ddiff + 1) / 365;
}

/**
 * Returns current position of day cycle (0 = start, 1 = end)
 * d is a Date object
 */
function progressOfDay(d) {
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds() / 60;
  return (h * 60 + m + s) / 1440;
}

/**
 * Returns current 'brightness' of sun, 0 to 4
 * progressOfDay is a value 0-1 from progressOfDay()
 */
function getSolarPosition(progDay) {
  return Math.abs(Math.sin(1 * Math.PI * (720 * progDay + .5)) * 4);
}

function getColours(d) {
    var pos = getSolarPosition(progressOfDay(d));
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
      biasFloat(coloursTop[first][3], coloursHorizon[second][3], bias)
    ];
  return colours;
}


  // offset calendar -> tropical year = -0.028044764
  //var dc = progDay - 0.028044764;


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
  [144, 206, 255, 1.0], 
  [ 98, 186, 255, 0.9], 
  [ 96,  96, 196, 0.6],
  [ 53, 149, 253, 0.2],
  [  0,  43,  97, 0.0]
];
var coloursHigh = [
  [144, 206, 255], //$skyBlue-2:             #adddff;
  [ 98, 186, 255], 
  [ 96,  96, 196],
  [ 53, 149, 253],
  [  0,  43,  97]
];
var coloursLow = [
  [144, 206, 255], //$skyBlue-3:             #dbf0ff;
  [ 98, 186, 255], 
  [ 96,  96, 196],
  [ 53, 149, 253],
  [  0,  43,  97]
];
var coloursHorizon = [
  [144, 206, 255], //$skyBlue-4:             #EDF6FC;
  [ 98, 186, 255], 
  [ 96,  96, 196],
  [ 53, 149, 253],
  [  0,  43,  97]
];


})(jQuery);
