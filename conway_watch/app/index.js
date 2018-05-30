// Conway' Game of Life watch face
// Conway implementation mooched from http://jsfiddle.net/ankr/tgjLA/
// Note for size reasons, I ended up doing an in-place
// modify instead of a finish-board then updates the whole time step
// I know this makes it not really Conway's Game of Life but it is still amusing.

import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";

import { display } from "display";

// Update the clock every second
clock.granularity = "seconds";

// Constants for describing the conway-pixels in terms of screen pixels
const arraysize = 10;
const pixwidth = 30;
const pixheight = 30;

// These variables hold the game of life and it representation on the screen
var conwaycells = [];
var conwaypix = [];

// *************************** CONWAY ***********************************/

// in the very first initialization, we need to create the cells array
// Create a grid of pixels and set their sizes programmatically
function first_conway_init() {
  console.log("First Conway Init");
  for (var i = 0; i < arraysize; i++) {
    conwaycells[i] = [];
    conwaypix[i] = [];
    var pixname = "p" + i;
    for (var j = 0; j < arraysize; j++) {
      conwaycells[i][j] = 0;
      conwaypix[i][j] = document.getElementById(pixname + j);
      conwaypix[i][j].r = pixwidth * 0.6;
      conwaypix[i][j].cx = i * pixwidth + pixwidth / 2;
      conwaypix[i][j].cy = j * pixheight + pixheight / 2;
      conwaypix[i][j].style.opacity = 0;
    }
  }
}

// clear the conway cells every time the system turns on
function init_conway() {
  for (var i = 0; i < arraysize; i++) {
    for (var j = 0; j < arraysize; j++) {
      conwaycells[i][j] = 0;
    }
  }
}

function set_conway(x, y, on) {
  if (on) {
    conwaycells[x][y] = 1;
  } else {
    conwaycells[x][y] = 0;
  }
}

function update_conway() {

  // Return number of alive neighbours for a cell
  function _countNeighbours(x, y) {
    var amount = 0;

    function _isFilled(x, y) {
      return conwaycells[x] && conwaycells[x][y];
    }

    if (_isFilled(x - 1, y - 1)) amount++;
    if (_isFilled(x, y - 1)) amount++;
    if (_isFilled(x + 1, y - 1)) amount++;
    if (_isFilled(x - 1, y)) amount++;
    if (_isFilled(x + 1, y)) amount++;
    if (_isFilled(x - 1, y + 1)) amount++;
    if (_isFilled(x, y + 1)) amount++;
    if (_isFilled(x + 1, y + 1)) amount++;

    return amount;
  }

  for (var i = 0; i < arraysize; i++) {
    for (var j = 0; j < arraysize; j++) {
      var alive = 0,
        count = _countNeighbours(i, j);

      if (conwaycells[i][j] > 0) {
        alive = count === 2 || count === 3 ? 1 : 0;
      } else {
        alive = count === 3 ? 1 : 0;
      }
      if (conwaycells[i][j] != alive) { // cell has changed
        // NOTE: updating conwaycells breaks conway rules by 
        // updating in place but is it a great deal faster on the watch
        conwaycells[i][j] = alive;      
        // it might be nice to have the drawing be separate from the algorithm
        // but it is much faster to go through the array only once
        drawpix(i, j, alive);
      }
    }
  }
}
/********************************** FONTS ************************************/
// 3x5 fonts
const fontwidth = 3;
const fontheight = 5;
const spacebetween = 1;
const font3x5numbers = [
  [0x38, 0x44, 0x38], /* 0 */
  [0x00, 0x7C, 0x00], /* 1 */
  [0x64, 0x54, 0x48], /* 2 */
  [0x44, 0x54, 0x28], /* 3 */
  [0x1C, 0x10, 0x7C], /* 4 */
  [0x4C, 0x54, 0x24], /* 5 */
  [0x38, 0x54, 0x20], /* 6 */
  [0x04, 0x74, 0x0C], /* 7 */
  [0x28, 0x54, 0x28], /* 8 */
  [0x08, 0x54, 0x38], /* 9 */
];

function drawpix(x, y, on) {
  x = x.toFixed()
  y = y.toFixed()
  if (on) {
    conwaypix[x][y].style.opacity = 0.7;
  } else {
    conwaypix[x][y].style.opacity = 0;
  }
}
function drawnumber(x, y, digit) {
  var d = digit.toFixed();
  var num = font3x5numbers[d];
  for (var xoffset = 0; xoffset < fontwidth; xoffset++) {
    for (var yoffset = 0; yoffset < fontheight; yoffset++) {
      var bit = 0x00;
      bit = (num[xoffset] << (fontheight - yoffset));     // Shift current row bit left
      bit = (bit >> 7) & 0x1;
      var xoff = x + xoffset;
      var yoff = y + yoffset;
      set_conway(x + xoffset, y + yoffset, bit);
    }
  }
  return x + fontwidth + spacebetween;
}
/********************************** main running  ************************************/

var delaydisplayconway = 0;
first_conway_init();

// draw the contents of conwaycells to the screen (conwaypix)
function displayconwaypix(){
  for (var i = 0; i < arraysize; i++) {
    for (var j = 0; j < arraysize; j++) {
        drawpix(i, j, conwaycells[i][j]);
    }
  }
}

// draw time to blanked conwaycells then display it
function display_time(evt) {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  var x = 0;
  init_conway();
  x = drawnumber(x, 0, Math.floor(hours / 10));
  x = drawnumber(x, 0, hours % 10);
  x = 3
  x = drawnumber(x, 5, Math.floor(mins / 10));
  x = drawnumber(x, 5, mins % 10);
  displayconwaypix();
}
// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  if (delaydisplayconway > 1) {
    update_conway();
  } else {
    display_time(evt);
  }
  delaydisplayconway++;
}

// when the display turns on, set system to display time
display.onchange = function() {
  if (display.on) {
    delaydisplayconway = 0;
  }
}

