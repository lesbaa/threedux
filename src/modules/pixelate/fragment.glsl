uniform sampler2D tDiffuse;
uniform vec2 viewportSize;
varying vec2 vUv;
uniform float tileSize;

void main() {
	float numSqrs = 1.0 / tileSize;
	float aspectRatio = viewportSize.x / viewportSize.y;
	float u = floor( vUv.x / numSqrs ) * numSqrs;
	numSqrs = aspectRatio / tileSize;
	float v = floor( vUv.y / numSqrs ) * numSqrs;
  vec4 color = texture2D( tDiffuse, vec2( u, v ) );
	gl_FragColor = vec4(color.rgba);

}
