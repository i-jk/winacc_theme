/**
 * @file
 * JS for Radix Starter.
 */
(function ($) {
  
  // Start timer interval on load
  $(document).ready(function() {
    console.log(getColour(new Date()));
    
    var iJK_timer = setInterval(function() {
      var c = getColour(new Date());
      console.log(c);
      //jQuery('#primary-page').css('background-image','linear-gradient(top, #FFFFFF 0%, #245263 100%)');
      //jQuery('#primary-page').css('background-color', c);
    }, 5000);
  });

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
  return Math.abs(Math.sin(1 * Math.PI * (progDay + .5)) * 4);
}

function getColour(d) {
    var pos = getSolarPosition(progressOfDay(d));
    var first = Math.floor(pos);
    var second = Math.ceil(pos)
    var bias = (pos - first);
    return 'rgb('
        + weighted(colours[first][0], colours[second][0], bias) + ', '
        + weighted(colours[first][1], colours[second][1], bias) + ', '
        + weighted(colours[first][2], colours[second][2], bias) + ')'
}

function weighted(a, b, weight) {
    return Math.round((a * (1 - weight)) + (b * weight));
}
  // offset calendar -> tropical year = -0.028044764
  //var dc = progDay - 0.028044764;



var colours = [
  [196, 196, 255], // 0 = midday
  [128, 128, 255], // 1 = 10:04:11, 13:55:50
  [96, 96, 196],     // 2 = 08:00:00, 16:00:00
  [24, 16, 128],      // 3 = 05:31:16, 18:28:44
  [0, 0, 64]        // 4 = midnight
];
/*
console.log( getColour(new Date('2013 nov 00:00:00 GMT')) );
console.log( getColour(new Date('2013 nov 03:00:00 GMT')) );
console.log( getColour(new Date('2013 nov 06:00:00 GMT')) );
console.log( getColour(new Date('2013 nov 10:00:00 GMT')) );
console.log('n', getColour(new Date('2013 nov 12:00:00 GMT')) );
console.log( getColour(new Date('2013 nov 15:00:00 GMT')) );
console.log( getColour(new Date('2013 nov 18:00:00 GMT')) );
console.log( getColour(new Date('2013 nov 21:00:00 GMT')) );
console.log( getColour(new Date('2013 nov 23:59:00 GMT')) );


.css('filter','progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#FFFFFF\', endColorstr=\'#'+event.backgroundColor+'\', gradientType=1)')
.css('background-image','-webkit-gradient(linear, left top, right bottom, color-stop(0.1, #FFFFFF), color-stop(0.99, #'+event.backgroundColor+'))')
.css('background-image','-moz-linear-gradient(top left, #FFFFFF 0%, #'+event.backgroundColor+' 100%)')
.css('background-image','-o-linear-gradient(top left, #FFFFFF 0%, #'+event.backgroundColor+' 100%)')
.css('background-image','linear-gradient(top left, #FFFFFF 0%, #'+event.backgroundColor+' 100%)')
*/

})(jQuery);
