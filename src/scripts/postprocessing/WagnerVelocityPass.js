import THREE from 'three';
import Pass from '@superguigui/wagner/src/Pass';
import processShader from '@superguigui/wagner/src/utils/processShader';

const glslify = require( 'glslify' );

class VelocityPass extends Pass {

	constructor( params ) {

		super();

		Object.assign( this.params, params );

		this.shader = processShader( glslify( './../../shaders/pass-through.vert' ), glslify( './../../shaders/velocity.frag' ) )
		this.shader.depthWrite = false;
		this.shader.depthTest = false;
		this.shader.transparent = true;
		this.shader.uniforms.limitToBounce.value = this.params.limitToBounce;
		this.shader.uniforms.tVel.value = this.params.initialData;

	}

	run ( c ) {

		this.shader.uniforms.tPos.value = this.params.tPos;
		this.shader.uniforms.tVel.value = c.output;
		c.pass( this.shader );

	}

}

export default VelocityPass;
