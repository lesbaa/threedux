uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uSampler;
varying vec2 vUv;

void main() {
  vec2 coord = vec2(vUv.x, vUv.y);
  vec2 texelCoords = coord;
  vec4 texel = texture2D(uSampler, texelCoords);

  float r = texel.r;
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