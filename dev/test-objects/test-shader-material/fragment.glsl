uniform float uTime;
uniform float uVary;
uniform vec2 uResolution;
uniform sampler2D uSampler;
varying vec2 vUv;

void main() {
  vec2 coord = vec2(vUv.x, vUv.y + uVary);
  vec2 texelCoords = coord;
  vec4 texel = texture2D(uSampler, texelCoords);

  float r = sin(uTime * 2.0);
  float g = texel.g;
  float b = texel.b;
  float a = texel.a;

  gl_FragColor = vec4(
    r,
    g,
    b,
    a
  );
}