export default function isEqual( x1, y1, z1, x2, y2, z2 ) {
  var delta = 0.000001;
  return Math.abs( x2 - x1 ) < delta &&
      Math.abs( y2 - y1 ) < delta &&
      Math.abs( z2 - z1 ) < delta;
}