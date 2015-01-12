var CustomControls;

CustomControls = (function() {
  function CustomControls() {
    this.controls = new THREE.PointerLockControls(camera);
    scene.add(this.controls.getObject());
    var self = this;
    document.addEventListener('click', function(event) {
      var element, havePointerLock, pointerLockChange;
      havePointerLock = "pointerLockElement" in document || "mozPointerLockElement" in document || "webkitPointerLockElement" in document;
      if (havePointerLock) {
        element = document.body;
        pointerLockChange = (function(_this) {
          return function(event) {
            if (document.pointerLockElement = element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
              self.controls.enabled = !self.controls.enabled;
            }
          };
        })(this);
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();
      }
      document.addEventListener('pointerlockchange', function() {
        pointerLockChange();
        return false;
      });
      document.addEventListener('mozpointerlockchange', pointerLockChange, false);
      return document.addEventListener('webkitpointerlockchange', function() {
        pointerLockChange();
        return false;
      });
    });
  }

  CustomControls.prototype.update = function() {
    this.controls.update();
  };

  return CustomControls;

})();
