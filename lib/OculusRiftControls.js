/**
 * @author dmarcos / https://github.com/dmarcos
 * @author mrdoob / http://mrdoob.com
 */

THREE.OculusRiftControls = function(object, callback) {

	var scope = this;

	var vrInput;

	var moveForward, moveBackward, moveLeft, moveRight;

	var velocity = new THREE.Vector3();

	var prevTime = performance.now();
	this.speed = 2000;

	var onVRDevices = function(devices) {

		for (var i = 0; i < devices.length; i++) {

			var device = devices[i];

			if (device instanceof PositionSensorVRDevice) {

				vrInput = devices[i];
				return; // We keep the first we encounter

			}

		}
		if (callback !== undefined) {

			callback('HMD not available');

		}

	};

	if (navigator.getVRDevices !== undefined) {

		navigator.getVRDevices().then(onVRDevices);

	} else if (callback !== undefined) {

		callback('Your browser is not VR Ready');

	}

	// the Rift SDK returns the position in meters
	// this scale factor allows the user to define how meters
	// are converted to scene units.
	this.scale = 1;

	var onKeyDown = function(event) {
		console.log(event)
		switch (event.keyCode) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true;
				break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if (canJump === true) velocity.y += 350;
				canJump = false;
				break;
			case 16:
			  this.speed *=4;
			  break;

		}

	};

	var onKeyUp = function(event) {

		switch (event.keyCode) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;
			case 16:
			  this.speed /=4;
			  break;

		}

	};


	this.update = function() {

		if (vrInput === undefined) return;

		var state = vrInput.getState();

		if (state.orientation !== null) {

			object.quaternion.copy(state.orientation);

		}

		var time = performance.now();
		var delta = (time - prevTime) / 1000;
		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;
		if (moveForward) velocity.z -= this.speed * delta;
		if (moveBackward) velocity.z += this.speed * delta;
		if (moveLeft) velocity.x -= this.speed* delta;
		if (moveRight) velocity.x += this.speed * delta;
		object.position.y = 10;

		camera.translateZ(velocity.z * delta);
		camera.translateX(velocity.x * delta);
		prevTime = time;

	};

	this.zeroSensor = function() {

		if (vrInput === undefined) return;

		vrInput.zeroSensor();

	};

	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);
};