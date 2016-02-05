import THREE from 'three'
import dat from 'dat-gui'
import WAGNER from '@superguigui/wagner/'
import AbstractApplication from 'scripts/views/AbstractApplication'
import VelocityPass from 'scripts/postprocessing/WagnerVelocityPass'
import PositionPass from 'scripts/postprocessing/WagnerPositionPass'

const glslify = require( 'glslify' )

class Main extends AbstractApplication {

    constructor() {

	super();

	this.numParticles = 128; //power fo 2
	this.limitToBounce = 512;
	this.material = new THREE.ShaderMaterial( {

		uniforms: {

			"texture": { type: "t", value: null },
			"textureSize": { type: "f", value: this.numParticles },
			"pointSize": { type: "f", value: 1.0 }

		},
		vertexShader: glslify( './../shaders/particles.vert' ),
		fragmentShader: glslify( './../shaders/particles.frag' ),
		depthWrite: false,
		depthTest: false

	} );


	const geometry = new THREE.Geometry();

	for ( let i = 0, l = this.numParticles * this.numParticles; i < l; i ++ ) {

		let vertex = new THREE.Vector3();
		vertex.x = ( i % this.numParticles ) / this.numParticles;
		vertex.y = Math.floor( i / this.numParticles ) / this.numParticles;
		vertex.z = 0;
		geometry.vertices.push( vertex );

	}

	const particles = new THREE.PointCloud( geometry, this.material );
	particles.sortParticles = false;
	this.scene.add( particles );

	const settings = {
		useRGBA: true,
		wrapS: THREE.RepeatWrapping,
		wrapT: THREE.RepeatWrapping,
		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
		format: THREE.RGBFormat,
		type: THREE.FloatType,
		stencilBuffer: false
	};
	const settings2 = {
		useRGBA: true,
		wrapS: THREE.RepeatWrapping,
		wrapT: THREE.RepeatWrapping,
		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
		format: THREE.RGBAFormat,
		type: THREE.FloatType,
		stencilBuffer: false
	};

	this.composerVel = new WAGNER.Composer( this.renderer, settings );
	this.composerPos = new WAGNER.Composer( this.renderer, settings2 );

	this.resizePass();
	this.composerPos.reset();
	this.composerVel.reset();

	this.velPass = new VelocityPass( {
		initialData: this.getInitialVelData(),
		limitToBounce: this.limitToBounce * 0.5
	} );


	this.posPass = new PositionPass( {
		initialData: this.getInitialPosData()
	} );

	this.composerVel.setSource( this.velPass.params.initialData );
	this.composerPos.setSource( this.posPass.params.initialData );

	this.onWindowResize();

	this.animate();

    }

    resizePass() {

	this.composerPos.setSize( this.numParticles, this.numParticles );
	this.composerVel.setSize( this.numParticles, this.numParticles );

    }

    getInitialVelData() {

	const width = this.numParticles;
	const height = this.numParticles;
	const total = width * height;

	const data = new Float32Array( total * 3 );

	for ( let i = 0; i < ( total * 3 ); i += 3 ) {

		data[ i ] = ( Math.random() * 2 - 1 ) * 2;
		data[ i + 1 ] = ( Math.random() * 2 - 1 ) * 2;
		data[ i + 2 ] = ( Math.random() * 2 - 1 ) * 2;

		data[ i ] = ( Math.random() * 2  ) ;
		data[ i + 1 ] = ( Math.random() * 0  );
		data[ i + 2 ] = ( Math.random() * 0  ) ;

	}

	const texture = new THREE.DataTexture( data, width, height, THREE.RGBFormat, THREE.FloatType );
	texture.minFilter = THREE.NearestFilter;
	texture.magFilter = THREE.NearestFilter;
	texture.generateMipmaps = false;
	texture.needsUpdate = true;

	return texture;

    }

    getInitialPosData() {

	const width = this.numParticles;
	const height = this.numParticles;
	const total = width * height;
	const data = new Float32Array( total * 3 );

	for ( let i = 0; i < ( total * 3 ); i += 3 ) {

		data[ i ] = 0;//Math.random() * this.limitToBounce - this.limitToBounce * 0.5;
		data[ i + 1 ] = 0;//Math.random() * this.limitToBounce - this.limitToBounce * 0.5;
		data[ i + 2 ] = 0;//sMath.random() * this.limitToBounce - this.limitToBounce * 0.5;

	}

	const texture = new THREE.DataTexture( data, width, height, THREE.RGBFormat, THREE.FloatType );
	texture.minFilter = THREE.NearestFilter;
	texture.magFilter = THREE.NearestFilter;
	texture.generateMipmaps = false;
	texture.needsUpdate = true;

	return texture;

    }

    onWindowResize() {

	var s = 1,
	w = window.innerWidth,
	h = window.innerHeight;

	this.renderer.setSize( s * w, s * h );
	this.camera.projectionMatrix.makePerspective( this.camera.fov, w / h, this.camera.near, this.camera.far );

	this.resizePass();

	//super.onWindowResize();

    }

    animate() {


	this.velPass.params.tPos = this.composerPos.output;
	this.composerVel.pass( this.velPass );
	this.posPass.params.tVel = this.composerVel.output;
	this.composerPos.pass( this.posPass );
	this.material.uniforms.texture.value = this.composerPos.output;
	super.animate();


    }

}
export default Main;
