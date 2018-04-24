uniform float uTime;
uniform float uVary;
uniform vec2 uResolution;
uniform sampler2D uSamplerColor;

varying vec2 vUv;

# define textureScale 1.0

float random(vec2 c){
  return fract(sin(dot( c.xy, vec2(12.9898,78.233))) * 43758.5453);
}


void main() {
  
  vec4 texel = texture2D(uSamplerColor, vUv.xy);
  
  float x = 1.0 - vUv.x * 50.0;
  float y = 1.0 - vUv.y * 50.0;
  float xPy = x + y;
  float xy = x * y;
  float xOy = x / y;

  float r = sin(xPy / 10.0) + sin(y / 22.0 + y) + cos(y / 50.0) + sin(x / 9.0) + cos(xy / 13.0 + uTime / 30.0) + sin(y / 25.0 + sin(uTime / 14.0)) + cos(x) - sin(y / 2.0);
  float g = sin(xOy / 10.0) + sin(x / 22.0 + x) + cos(x / 30.0) + sin(y / 7.0) + sin(xOy / 13.0 + uTime / 30.0) + cos(y / 25.0 + sin(x + uTime / 50.0 + sin(y / xy))) + cos(x) - sin(xy / 22.0);
  float b = sin(xPy / 15.0) + sin(x / 30.0 + y) + cos(y / 40.0) + sin(y / 10.0) + sin(x + uTime / 30.0) + cos(y / 25.0 + sin(x + uTime / 40.0 + sin(y / xy))) + cos(x) - sin(xy / 22.0);
  
  r = r < 0.5 ? 1.0 : 0.0;
  g = g > 0.5 ? 1.0 : 0.0;
  b = b < 0.5 ? 1.0 : 0.0;

  gl_FragColor = vec4(
    (r + texel.r / 2.0),
    (g + texel.g / 2.0),
    (b + texel.b / 2.0),
    1.0
  );
}