var CustomControls;

CustomControls = (function() {
  function CustomControls() {
    G.controls = new THREE.OculusRiftControls(camera);
    // G.controls = new THREE.PointerLockControls(camera);

    // var self = G;
    // document.addEventListener('click', function(event) {
    //   if(self.controls.enabled){
    //     return
    //   }
    //   var element, havePointerLock, pointerLockChange;
    //   havePointerLock = "pointerLockElement" in document || "mozPointerLockElement" in document || "webkitPointerLockElement" in document;
    //   if (havePointerLock) {
    //     element = document.body;
    //     pointerLockChange = (function(_this) {
    //       return function(event) {
    //         if (document.pointerLockElement = element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
    //           G.controls.enabled = !self.controls.enabled;
    //         }
    //       };
    //     })(this);
    //     element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    //     element.requestPointerLock();
    //   }
    //   document.addEventListener('pointerlockchange', function() {
    //     pointerLockChange();
    //   });
    //   document.addEventListener('mozpointerlockchange', pointerLockChange, false);
    //   return document.addEventListener('webkitpointerlockchange', function() {
    //     pointerLockChange();
    //   });
    // });
  }

  CustomControls.prototype.update = function() {
    G.controls.update(G.clock.getDelta());
  };

  return CustomControls;

})();
