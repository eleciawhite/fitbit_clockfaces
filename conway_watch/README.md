# Conway_watch
This creates Versa watch face that shows the time and then dissolves it into Conway's game of life.

The screen is broken into 100 pixels: 10x10. Each of these conway-pixels which are 30x30 screen-pixels. The time is then put on the screen using a 3x5 font. After 1s, these pixels are used to seed a game of life.

The pixels currently show as mostly opaque, circular points that slightly overlap.