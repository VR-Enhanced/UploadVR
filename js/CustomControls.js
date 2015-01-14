var CustomControls;

CustomControls = (function() {
  function CustomControls() {
    G.speed = 8000;
    var vrInput;
    var onVRDevices = function(devices) {

      for (var i = 0; i < devices.length; i++) {

        var device = devices[i];

        if (device instanceof PositionSensorVRDevice) {

          vrInput = devices[i];
          G.controls = new THREE.OculusRiftControls(camera, vrInput)
          return; // We keep the first we encounter

        }

      }
    };

    if (navigator.getVRDevices !== undefined) {

      navigator.getVRDevices().then(onVRDevices);


    } else {
      G.pointerLock = true;
      console.log('Your browser is not VR Ready');
      G.controls = new THREE.PointerLockControls(camera);
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

  return CustomControls;

})();