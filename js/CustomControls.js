var CustomControls;
G.userHeight = 200;

CustomControls = (function() {
  function CustomControls() {
    G.speed = 8000;
    var userStartZ = 5000;
    var vrInput;
    var onVRDevices = function(devices) {

      for (var i = 0; i < devices.length; i++) {

        var device = devices[i];

        if (device instanceof PositionSensorVRDevice) {

          vrInput = devices[i];
          G.controls = new THREE.OculusRiftControls(camera, vrInput)
          G.controls.zeroSensor();
          return; // We keep the first we encounter

        }

      }
    };

    if (navigator.getVRDevices !== undefined) {
      this.setPosition(new THREE.Vector3(0, G.userHeight, userStartZ))
      navigator.getVRDevices().then(onVRDevices);


    } else {
      G.pointerLock = true;
      G.controls = new THREE.PointerLockControls(camera);
      this.setPosition(new THREE.Vector3(0, G.userHeight, userStartZ))
      scene.add(G.controls.getObject());
      document.addEventListener('click', function(event) {
        if (G.controls.enabled) {
          return
        }
        var element, havePointerLock, pointerLockChange;
        havePointerLock = "pointerLockElement" in document || "mozPointerLockElement" in document || "webkitPointerLockElement" in document;
        if (havePointerLock) {
          element = document.body;
          pointerLockChange = (function(_this) {
            return function(event) {
              if (document.pointerLockElement = element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                G.controls.enabled = !G.controls.enabled;
              }
            };
          })(this);
          element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
          element.requestPointerLock();
        }
        document.addEventListener('pointerlockchange', function() {
          pointerLockChange();
        });
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', function() {
          pointerLockChange();
        });
      });

    }

  }


  CustomControls.prototype.update = function() {
    if (G.controls) {
      G.controls.update();
    }
  };

  CustomControls.prototype.camPosition = function() {
    if (G.pointerLock) {
      return G.controls.getObject().position;
    } else {
      return camera.position
    }
  }

  CustomControls.prototype.setPosition = function(position){
    if(G.pointerLock) {
      G.controls.getObject().position.copy(position);
    } else {
      camera.position.copy(position)
    }

  }

  CustomControls.prototype.camObject = function(){
     if (G.pointerLock) {
      return G.controls.getObject();
    } else {
      return camera
    }
  }

  CustomControls.prototype.camDirection = function() {
    if (G.pointerLock) {
      return G.controls.getDirection();

    } else {
      var lookAt = new THREE.Vector3(0, 0, -1);
      lookAt.applyQuaternion(camera.quaternion);
      return lookAt;
    }
  }

  return CustomControls;

})();