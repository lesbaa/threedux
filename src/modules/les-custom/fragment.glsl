uniform float uTime;
uniform float uExplodeAmount;
uniform sampler2D uSampler;
uniform vec2 uResolution;
// uniform vec2 mousePos;
// uniform vec2 vpSize;
varying vec2 vUv;

void main() {
  vec2 coord = vec2(gl_FragCoord.x, gl_FragCoord.y);
  vec2 texelCoords = coord / uResolution;
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
