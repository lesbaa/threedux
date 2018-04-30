uniform float uTime;
uniform float uVary;
uniform vec2 uResolution;
uniform vec2 uPointOne;
uniform vec2 uPointTwo;
uniform vec2 uPointThree;
uniform vec2 uPointFour;

varying vec2 vUv;

# define THRESH 0.335

float random(vec2 c){
  return fract(sin(dot( c.xy, vec2(12.9898,78.233))) * 43758.5453);
}

bool isWithinRange(vec2 p, vec2 t, float range) {
  return distance(p, t) < range;
}

void main() {
  
  float sinT = sin(uTime / 5.0) / 5.0;
  float cosT = cos(uTime / 5.0) / 5.0;
  
  vec2 pointOne = vec2(uPointOne.y + sinT, uPointOne.y + cosT);
  vec2 pointTwo = vec2(uPointTwo.y + cosT, uPointTwo.y + sinT);
  vec2 pointThree = vec2(uPointThree.y + cosT, uPointThree.y + cosT);
  vec2 pointFour = vec2(uPointFour.y + cosT, uPointFour.y + sinT);

  float distOne = sqrt(distance(pointOne, vUv.xy));
  float distTwo = sqrt(distance(pointTwo, vUv.xy));
  float distThree = sqrt(distance(pointThree, vUv.xy));
  float distFour = sqrt(distance(pointFour, vUv.xy));

  float r = distOne + distTwo + distThree + distFour;
  float g = distOne + distTwo + distThree;
  float b = distOne + distTwo;

  gl_FragColor = vec4(
    r / 4.0 > THRESH ? 1.0 : 0.3 ,
    g / 3.0 > THRESH ? 1.0 : 0.3 ,
    b / 2.0 > THRESH ? 1.0 : 0.3 ,
    1.0
  );
}