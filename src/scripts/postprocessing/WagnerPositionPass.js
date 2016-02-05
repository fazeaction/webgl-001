import THREE from 'three';
import Pass from '@superguigui/wagner/src/Pass';
import processShader from '@superguigui/wagner/src/utils/processShader';

const glslify = require( 'glslify' );



class PositionPass extends Pass{

	constructor( params ) {

		super();

		Object.assign( this.params, params );

		this.shader = processShader( glslify( './../../shaders/pass-through.vert' ), glslify( './../../shaders/position.frag' ) )
		this.shader.depthWrite = false;
		this.shader.depthTest = false;
		this.shader.transparent = true;
		this.shader.uniforms.tPos.value = this.params.initialData;

	}

	run ( c ) {

		this.shader.uniforms.tVel.value = this.params.tVel;
		this.shader.uniforms.tPos.value = c.output;
		c.pass( this.shader );

	}

}

export default PositionPass;
