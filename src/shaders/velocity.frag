varying vec2 vUv;
uniform sampler2D tVel;
uniform sampler2D tPos;
uniform float limitToBounce;


#pragma glslify: curlNoise = require(./curl.glsl)

void main() {

	vec3 pos = texture2D( tPos, vUv ).xyz;
	vec3 vel = texture2D( tVel, vUv ).xyz;

	vec3 curl = curlNoise( pos.xyz * .015 );

	vel += curl * .07;
    vel *= .95; // dampening

	/*if ((pos.x > limitToBounce) || (pos.x < -limitToBounce)) {
		vel.x *= -1.0;
	}

	if ((pos.y > limitToBounce) || (pos.y < -limitToBounce)) {
		vel.y *= -1.0;
	}

	if ((pos.z > limitToBounce) || (pos.z < -limitToBounce)) {
		vel.z *= -1.0;
	}*/

	gl_FragColor = vec4(vel, 1.0);

}