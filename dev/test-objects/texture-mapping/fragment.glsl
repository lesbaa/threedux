uniform float uTime;
uniform float uVary;
uniform vec2 uResolution;
uniform sampler2D uSampler;
varying vec2 vUv;
varying vec3 vNormal;

# define textureScale 1.0

void main() {
  float timeOffset = uTime / 120.0;
  float sinTime = sin(timeOffset * 10.0);

  float fTextOffsetY = vNormal.y > 0.001 ? -vNormal.y + 0.01 : 1.0 ;

  float fColorCoordX = 0.0;
  float fColorCoordY = fTextOffsetY;
  vec2 vColorCoords = vec2(fColorCoordX, fColorCoordY);
  vec4 vColorMap = texture2D(uSampler, vColorCoords);


  float r = vColorMap.r;
  float g = vColorMap.g;
  float b = vColorMap.b;
  float a = vColorMap.a;

  gl_FragColor = vec4(
    r / 1.2,
    g / 1.2,
    b / 1.2,
    a
  );
}