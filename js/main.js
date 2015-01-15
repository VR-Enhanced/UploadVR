	var scene, renderer, camera, vrControls, container, effect, stats, background;
	var water, mirrorMesh, waterNormals;
	var posts;
	var oceanSize = 20000;
	var timeInc = 1 / 60;
	G.clock = new THREE.Clock();
	G.shaders = new ShaderLoader('shaders');
	G.bgColor = new THREE.Color().setHex(0x060009)



	G.rf = THREE.Math.randFloat;

	TWEEN.origTween = TWEEN.Tween;
	TWEEN.Tween = function(options) {
		return new TWEEN.origTween(options).
		easing(TWEEN.Easing.Cubic.Out);
	};



	G.shaders.load('vs-text', 'text', 'vertex');
	G.shaders.load('fs-text', 'text', 'fragment');

	G.shaders.shaderSetLoaded = function() {
		init();
		animate();
	}


	function init() {


		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerWidth, 1, 200000);
		scene = new THREE.Scene();
		scene.add(camera);
		renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		renderer.setClearColor(G.bgColor)
		renderer.domElement.style.position = "absolute";
		document.body.appendChild(renderer.domElement);

		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';

		document.body.appendChild(stats.domElement);



		G.customControls = new CustomControls();
		G.objectControls = new ObjectControls(camera);

		effect = new THREE.VREffect(renderer, function(msg) {
			if (msg !== undefined) {
				console.log(msg)
			}
		});



		waterNormals = new THREE.ImageUtils.loadTexture('img/waternormals.jpg');
		waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

		water = new THREE.Water(renderer, camera, scene, {
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: waterNormals,
			alpha: 0.7,
			waterColor: 0x001e0f,
			distortionScale: 30.0,
		});

		mirrorMesh = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(oceanSize, oceanSize),
			water.material
		);
		mirrorMesh.renderDepth = 10
		mirrorMesh.add(water);
		mirrorMesh.rotation.x = -Math.PI * 0.5;
		scene.add(mirrorMesh);
		G.objectControls.add(mirrorMesh)

		posts = new Posts();
		background = new Background();

		var cursor = new THREE.Mesh(new THREE.SphereGeometry(.02, 32));
		cursor.translateZ(-5)
		camera.add(cursor);
		onResize();
	}

	function animate() {

		requestAnimationFrame(animate);
		water.material.uniforms.time.value += timeInc;
		water.render();
		effect.render(scene, camera);
		G.customControls.update();
		G.objectControls.update();
		TWEEN.update();
		stats.update();
		background.update();
	}

	function onResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		effect.setSize(window.innerWidth, window.innerHeight);

	}

	window.addEventListener('resize', onResize, false);



	function map(value, min1, max1, min2, max2) {
		return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
	}

	function onkey(event) {

		if (event.charCode == 'f'.charCodeAt(0)) {
			effect.setFullScreen(true);
		}
	};
	window.addEventListener("keypress", onkey, true);