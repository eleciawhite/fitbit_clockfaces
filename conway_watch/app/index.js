// Conway game of life watch
// Conway implementation mooched from http://jsfiddle.net/ankr/tgjLA/
// Note for size reasons, I ended up doing an in-place
// modify instead of a finish-board then update the whole time step

import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";

// Update the clock every minute
clock.granularity = "seconds";

var cells = [];
var screenPix = [];

// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");

const arraysize = 10;
const pixwidth = 30;
const pixheight = 30;

init_conway();
init_display();

function init_conway() {
    for (var i=0; i<arraysize; i++) {
        cells[i] = [];
        for (var j=0; j<arraysize; j++) {
            cells[i][j] = 0;
        }
    }    
}
function set_conway(x, y, on) {
  if (on) {
    cells[x][y] = 1;
  } else {
    cells[x][y] = 0;    
  }
    
}
function init_display() {
  console.log("init_display")
  for (var i = 0; i < arraysize; i++) {
    screenPix[i] = [];
    var pixname = "p" + i;
    for (var j=0; j< arraysize; j++) {
      screenPix[i][j] = document.getElementById(pixname + j); 
      screenPix[i][j].width = pixwidth;
      screenPix[i][j].height = pixheight;
      screenPix[i][j].x = i * pixwidth;
      screenPix[i][j].y = j * pixheight;
      screenPix[i][j].style.opacity = 0.5; 
    }
  }
}


function update_conway() {
    
    /**
     * Return amount of alive neighbours for a cell
     */
    function _countNeighbours(x, y) {
        var amount = 0;
        
        function _isFilled(x, y) {
            return cells[x] && cells[x][y];
        }
        
        if (_isFilled(x-1, y-1)) amount++;
        if (_isFilled(x,   y-1)) amount++;
        if (_isFilled(x+1, y-1)) amount++;
        if (_isFilled(x-1, y  )) amount++;
        if (_isFilled(x+1, y  )) amount++;
        if (_isFilled(x-1, y+1)) amount++;
        if (_isFilled(x,   y+1)) amount++;
        if (_isFilled(x+1, y+1)) amount++;
        
        return amount;
    }
    
    for (var i = 0; i < arraysize; i++) {
      for (var j=0; j< arraysize; j++) {
        var alive = 0,
            count = _countNeighbours(i, j);

        if (cells[i][j] > 0) {
            alive = count === 2 || count === 3 ? 1 : 0;
        } else {
            alive = count === 3 ? 1 : 0;
        }
        if (cells[i][j] != alive) { // changed
            DisplayDrawPixel(i, j, alive);
            cells[i][j] = alive;
        }        
      }
    }
//    cells = result;
//    draw_conway();
}

/**
 * Draw cells on canvas
 */
function draw_conway() {
  for (var i = 0; i < arraysize; i++) {
    for (var j=0; j< arraysize; j++) {
      DisplayDrawPixel(i, j, (cells[i][j] == 0));
    } 
  }     
}

  

// 3x6 fonts

const fontwidth = 3
const fontheight = 5
const font3x5numbers = [
    [0x38,0x44,0x38], /* 0 */
    [0x00,0x7C,0x00], /* 1 */
    [0x64,0x54,0x48], /* 2 */
    [0x44,0x54,0x28], /* 3 */
    [0x1C,0x10,0x7C], /* 4 */
    [0x4C,0x54,0x24], /* 5 */
    [0x38,0x54,0x20], /* 6 */
    [0x04,0x74,0x0C], /* 7 */
    [0x28,0x54,0x28], /* 8 */
    [0x08,0x54,0x38], /* 9 */
     ]; 
const font3x5colon=[0x00,0x50,0x00]; /* : */


function DisplayDrawPixel (x, y, on)
{
  x = x.toFixed()
  y = y.toFixed()
  if (on) {
    screenPix[x][y].style.opacity = 1;
  } else {
    screenPix[x][y].style.opacity = 0;    
  }
}
function DisplayDrawDigit( x, y, digit )
{
   var d = digit.toFixed();
   var num = font3x5numbers[d];
    for (var xoffset = 0; xoffset < fontwidth; xoffset++)
    {
        for (var yoffset = 0; yoffset < fontheight; yoffset++)
        {
            var bit = 0x00;
            bit = (num[xoffset] << (fontheight - yoffset));     // Shift current row bit left
            bit = (bit >> 7) & 0x1;                
            var xoff = x + xoffset;
            var yoff = y + yoffset;
            DisplayDrawPixel(x + xoffset, y + yoffset, bit);
            set_conway(x + xoffset, y + yoffset, bit);
        }
    }
    return x + fontwidth + 1;
}


function display_time(evt)
{
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
  //myLabel.text = `${hours}:${mins}`;
  var x = 1;
  x = DisplayDrawDigit(x, 0, hours/10);
  x = DisplayDrawDigit(x, 0, hours%10);
  x = 2
  x = DisplayDrawDigit(x, 5, mins/10);
  x = DisplayDrawDigit(x, 5, mins%10);  
}
var displayTime = true;
// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  if (displayTime == true) {
//    display_time(evt);
    displayTime = false;  
  var x = 0
  x = DisplayDrawDigit(x, 0, 1);
  x = DisplayDrawDigit(x, 0, 2);

  x = 3
  x = DisplayDrawDigit(x, 5, 2);
  x = DisplayDrawDigit(x, 5, 8);
  } else {
    update_conway();
  }
}
