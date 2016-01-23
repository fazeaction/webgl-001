uniform sampler2D texture;
uniform float textureSize;
uniform vec2 windowSize;
uniform float pointSize;

void main() {

    vec2 uv = position.xy + vec2( 0.5 / textureSize, 0.5 / textureSize );

    vec3 positionSimulation = texture2D( texture, uv ).rgb ;

    gl_PointSize = pointSize;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(positionSimulation,1.0);

}