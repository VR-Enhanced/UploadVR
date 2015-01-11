var scene, renderer, camera, vrControls, customControls, container, effect;
var water, mirrorMesh, waterNormals;
var oceanSize = 20000;
var timeInc = 1/60;



init()
animate()

function init() {


	camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerWidth, 1, 20000);
	camera.position.set(0, 10, 0);
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setClearColor(0x00416e)
	document.body.appendChild(renderer.domElement);


  //Apply VR Headset positional data to camera
	vrControls = new THREE.VRControls(camera);
	customControls = new CustomControls();

	effect = new THREE.VREffect(renderer, function(msg){
		console.log(msg)
	});
	effect.setSize(window.innerWidth, window.innerHeight);


	waterNormals = new THREE.ImageUtils.loadTexture('img/waternormals.jpg');
	waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

	water = new THREE.Water(renderer, camera, scene, {
		textureWidth: 512,
		textureHeight: 512,
		waterNormals: waterNormals,
		alpha: 1.0,

		waterColor: 0x001e0f,
		distortionScale: 50.0,
	});

	mirrorMesh = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(oceanSize, oceanSize),
		water.material
	);

	mirrorMesh.add(water);
	mirrorMesh.rotation.x = -Math.PI * 0.5;
	scene.add(mirrorMesh);
}

function animate() {

	requestAnimationFrame(animate);
	water.material.uniforms.time.value += timeInc;
	water.render();
	effect.render(scene, camera);
	customControls.update();
	vrControls.update();

}

function onResize() {
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
	effect.setSize(window.innerWidth, window.innerHeight);

}

window.addEventListener('resize', onResize, false);



function map(value, min1, max1, min2, max2) {
	return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
}