uniform float uTime;
uniform float uVary;
uniform vec2 uResolution;
uniform sampler2D uSampler;
varying vec2 vUv;
varying float proximityToUp;
varying vec3 vNormal;

void main() {
  vec2 coord = vec2(vUv.x, vUv.y);
  vec2 texelCoords = coord;
  vec4 texel = texture2D(uSampler, texelCoords);

  float r = vNormal.y > uVary * 20.0 ? texel.r : 1.0 - texel.r;
  float g = vNormal.y > uVary * 20.0 ? texel.g : 1.0 - texel.g;
  float b = vNormal.y > uVary * 20.0 ? texel.b : 1.0 - texel.b;
  float a = texel.a;

  gl_FragColor = vec4(
    r,
    g,
    b,
    a
  );
}