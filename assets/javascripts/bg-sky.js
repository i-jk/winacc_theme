/**
 * @file
 * JS for Radix Starter.
 */

/** Global settings */
var iJK_Sky = {
  speed: 1, //seconds per second
  refreshRate: 20, // seconds
  maxHoursSolstice: 4,
  date: new Date(),
  // colours: (TODO),
  timer: null,
  step: function () {
    this.date.setSeconds(this.date.getSeconds() + this.speed);
  },

  setSpeed: function (speed) {
    this.speed  = speed;
    this.stop;
    this.start;
  },


  /**
   * Detect Daylight Savings - from: http://stackoverflow.com/a/11888430
   */
  stdTimezoneOffset: function (d) {
    var jan = new Date(d.getFullYear(), 0, 1);
    var jul = new Date(d.getFullYear(), 6, 1);
    return Math.min(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  },

  isDST: function (d) {
    return d.getTimezoneOffset() < this.stdTimezoneOffset(d);
  },


  /**
   * d is a Date.
   */
  yearUnitInterval: function(d) {
    var yn = d.getFullYear();
    var mn = d.getMonth();
    var dn = d.getDate();
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
  },


  /**
   * d is a Date.
   */
  dayUnitInterval: function(d) {
    var h = d.getHours();
    // adjust for Daylight Saving Hours
    if (this.isDST(d)) {
      h--;
    }
    var m = d.getMinutes();
    var s = d.getSeconds() / 60;
    return ((h * 60 + m + s) / 1440);
  },

  baisInt: function (a, b, weight) {
      return Math.round((a * (1 - weight)) + (b * weight));
  },

  biasFloat: function (a, b, weight) {
      return (a * (1 - weight)) + (b * weight);
  },


  /**
   * Set sky colours.
   */
  setBackground: function(c, $) {

    if (Modernizr.cssgradients) {
      // Good browser
      $('#primary-page')
        // Webkit new
        .css('background-image', '-webkit-linear-gradient(top, ' + c[0] + ' 0%, ' + c[1] + ' 40%, ' + c[2] + ' 70%, ' + c[3] + ' 100%)')
      ;
      /* OTHERS TODO
      .css('background-image','-webkit-gradient(linear, left top, right bottom, color-stop(0.1, #FFFFFF), color-stop(0.99, #'+event.backgroundColor+'))')
      .css('background-image','-moz-linear-gradient(top left, #FFFFFF 0%, #'+event.backgroundColor+' 100%)')
      .css('background-image','-o-linear-gradient(top left, #FFFFFF 0%, #'+event.backgroundColor+' 100%)')
      .css('background-image','linear-gradient(top left, #FFFFFF 0%, #'+event.backgroundColor+' 100%)')
      */
    }
    else {
      // old browsers only get single colour bg change
      $('#primary-page').css('background-color', c[1]);
    }

    // Set grass
    $('#grass-bright').css('opacity', c[4]);
    $('#grass-dark').css('opacity', 1 - c[4]);
  },


  /**
   * Returns current 'brightness' of sun, 0 to 4
   * d is a Date object.
   *
   * @todo abstract out the number (4) of steps that map to the colours
   */
  getSolarPosition: function (d) {
    const colorSceneCount = 4;
    const speed = 1;//1440;
    // Convert yearUnitInterval into hours change -- for Winchester, UK
    // there's ~4 hours diff winter/summer from Equinox with 12h days.
    var dayPos = 1 - Math.sin(Math.PI * speed * (1 - this.dayUnitInterval(d)));
    var yearPos = 1 - Math.cos(2 * Math.PI * this.yearUnitInterval(d) + Math.PI);
    var sunPos = dayPos + (yearPos / 24 * 4);

    // Map sun pos to colour scene position.
    sunPos =  sunPos * colorSceneCount;
    if (sunPos > colorSceneCount) { return colorSceneCount; }
    if (sunPos < 0) { return 0; }
    return sunPos;
  },


  /**
   * Gets the CSS3 colour gradient rgb stops based on Date d.
   */
  getColours: function (d) {

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
      [233, 128,  31],
      [100,  91,  72],
      [ 39,  60,  77]
    ];

    var pos = this.getSolarPosition(d);
    var first = Math.floor(pos);
    var second = Math.ceil(pos)
    var bias = (pos - first);
    var colours = [
      // [0] coloursTop
      'rgb('
        + this.baisInt(coloursTop[first][0], coloursTop[second][0], bias) + ', '
        + this.baisInt(coloursTop[first][1], coloursTop[second][1], bias) + ', '
        + this.baisInt(coloursTop[first][2], coloursTop[second][2], bias) + ')',
       // [1] coloursHigh
      'rgb('
        + this.baisInt(coloursHigh[first][0], coloursHigh[second][0], bias) + ', '
        + this.baisInt(coloursHigh[first][1], coloursHigh[second][1], bias) + ', '
        + this.baisInt(coloursHigh[first][2], coloursHigh[second][2], bias) + ')',
      // [2] coloursLow
      'rgb('
        + this.baisInt(coloursLow[first][0], coloursLow[second][0], bias) + ', '
        + this.baisInt(coloursLow[first][1], coloursLow[second][1], bias) + ', '
        + this.baisInt(coloursLow[first][2], coloursLow[second][2], bias) + ')',
      // [3] coloursHorizon
      'rgb('
        + this.baisInt(coloursHorizon[first][0], coloursHorizon[second][0], bias) + ', '
        + this.baisInt(coloursHorizon[first][1], coloursHorizon[second][1], bias) + ', '
        + this.baisInt(coloursHorizon[first][2], coloursHorizon[second][2], bias) + ')',
      // [4] opacity of grass
      this.biasFloat(coloursTop[first][3], coloursTop[second][3], bias)
    ];
    return colours;
  }

};

(function ($) {


  // on load
  $(document).ready(function() {
    // Bail if no support for opacity...
    // @see http://caniuse.com/css-opacity: 87% browsers OK in August 2013.
    if (!Modernizr.opacity) return;

    // OK, set background ASAP.
    var d = iJK_Sky.date;
    var c = iJK_Sky.getColours(d);
    iJK_Sky.setBackground(c, $);

    // Begin timed bg change.
    var iJK_timer = setInterval(function() {
      iJK_Sky.step();
      c = iJK_Sky.getColours(iJK_Sky.date);
      iJK_Sky.setBackground(c, $);
    }, iJK_Sky.refreshRate * 1000);
  });

})(jQuery);
