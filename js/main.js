	var scene, renderer, cssRenderer, camera, vrControls, customControls, container, effect;
	var water, mirrorMesh, waterNormals;
	var posts;
	var oceanSize = 20000;
	var timeInc = 1 / 60;

$(document).ready(function() {



	init();
	animate();

	function init() {


		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerWidth, 1, 20000);
		camera.position.set(0, 10, 0);
		scene = new THREE.Scene();
		scene.add(camera);
		renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		renderer.setClearColor(0x00416e)
		renderer.domElement.style.position = "absolute";
		document.body.appendChild(renderer.domElement);


		//Apply VR Headset positional data to camera
		vrControls = new THREE.VRControls(camera);
		customControls = new CustomControls();
		G.objectControls = new ObjectControls(camera);

		effect = new THREE.VREffect(renderer, function(msg) {
			console.log(msg)
		});

		cssRenderer = new THREE.CSS3DRenderer();
		cssRenderer.domElement.style.position = 'fixed';
		document.body.appendChild(cssRenderer.domElement);


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
		mirrorMesh.renderDepth = 10
		mirrorMesh.add(water);
		mirrorMesh.rotation.x = -Math.PI * 0.5;
		scene.add(mirrorMesh);

		posts = new Posts();

		var cursor = new THREE.Mesh(new THREE.SphereGeometry(.01, 32));
		cursor.translateZ(-2)
		camera.add(cursor);
	}

	function animate() {

		requestAnimationFrame(animate);
		water.material.uniforms.time.value += timeInc;
		water.render();
		effect.render(scene, camera);
		cssRenderer.render(scene, camera);
		customControls.update();
		vrControls.update();
		G.objectControls.update();

	}

	function onResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		effect.setSize(window.innerWidth, window.innerHeight);
		cssRenderer.setSize(window.innerWidth, window.innerHeight);

	}

	window.addEventListener('resize', onResize, false);
	onResize();



	function map(value, min1, max1, min2, max2) {
		return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
	}
})