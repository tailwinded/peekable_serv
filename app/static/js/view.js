/* Author: YOUR NAME HERE
*/

counter = 0;
my_i = 1;
scale = 1;
volume = 0;
// Create a rectangle shaped path with its top left point at
// {x: 75, y: 75} and a size of {width: 75, height: 75}
var topLeft = new Point(175, 175);
var size = new Size(175, 175);
var path = new Path.Rectangle(topLeft, size);

path.strokeColor = 'blue';

function onFrame(event) {
    // Each frame, rotate the path by 3 degrees:
    volume+=0.01;
    path.scale(volume/scale);
    scale = volume;

    if (volume > 0.3) {
      path.strokeColor = 'blue';
    } else {
      path.strokeColor = 'red';
    }
    path.rotate(3);
    console.log('frame');
}