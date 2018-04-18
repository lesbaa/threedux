uniform float uTime;
uniform float uVary;
uniform vec2 uResolution;
uniform sampler2D uSamplerBump;
uniform sampler2D uSamplerColor;
varying vec2 vUv;
varying vec3 vNormal;

# define textureScale 1.0

void main() {
  float timeOffset = uTime / 120.0;
  float sinTime = 0.4 + sin(timeOffset * 10.0) / 6.0;

  float fBumpCoordX = vUv.x + vNormal.y / 2.0;
  float fBumpCoordY = vUv.y + timeOffset / 1.5;
  vec2 vBumpCoords = vec2(fBumpCoordX, fBumpCoordY);
  vec4 vBumpMap = texture2D(uSamplerBump, vBumpCoords);

  float fColorCoordX = vUv.x + vNormal.y / 2.0;
  float fColorCoordY = vUv.y + timeOffset;
  vec2 vColorCoords = vec2(fColorCoordX, fColorCoordY);
  vec4 vColorMap = texture2D(uSamplerBump, vColorCoords);

  float fColorTwoCoordX = vUv.x - timeOffset + vBumpMap.r;
  float fColorTwoCoordY = vUv.y;
  vec2 vColorTwoCoords = vec2(fColorTwoCoordX, fColorTwoCoordY);
  vec4 vColorTwoMap = texture2D(uSamplerColor, vColorTwoCoords);

  float shadow = (vNormal.x + vNormal.y + vNormal.z) / 3.0;

  float r = vColorTwoMap.r / 4.0;
  float g = vColorTwoMap.g / 5.0;
  float b = ((vColorMap.b > sinTime ? vColorTwoMap.g : vColorTwoMap.r / 3.0) + vBumpMap.b + shadow) / 3.0 + (vNormal.y / 2.0);
  float a = 1.0;

  gl_FragColor = vec4(
    r / 1.2,
    g / 1.2,
    b / 1.2,
    a
  );
}