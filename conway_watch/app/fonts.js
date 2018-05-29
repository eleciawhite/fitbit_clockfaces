  

// 3x6 fonts

const fontwidth = 3
const fontheight = 6
const font3x6numbers[] = [
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
const font3x6colon=[0x00,0x50,0x00]; /* : */


function DisplayDrawPixel (x, y, on)
{
  
}
function DisplayDrawDigit( x, y, digit )
{
   var num = font3x6numbers[digit]
  
    for (var xoffset = 0; xoffset < fontwidth; xoffset++)
    {
        for (var yoffset = 0; yoffset < fontheight; yoffset++)
        {
            var bit = 0x00;
            bit = (num[xoffset] << (8 - yoffset));     // Shift current row bit left
            bit = (bit >> 7);                
            DisplayDrawPixel(x + xoffset, y + yoffset, bit);
        }
    }
    return x + fontwidth + 1;
}

