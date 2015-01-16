function Background() {

  this.colorStart = new THREE.Color()
  this.colorStart.setRGB(Math.random(), Math.random(), Math.random())
  texture = THREE.ImageUtils.loadTexture('img/star.png')
  texture.minFilter = THREE.LinearMipMapLinearFilter;



  this.generateStars()


  this.generateLogo();



}

Background.prototype.generateStars = function() {
  this.starGroup = new SPE.Group({
    texture: texture,
    blending: THREE.AdditiveBlending,
    maxAge: 7
  });
  this.starEmitter = new SPE.Emitter({
    type: 'sphere',
    radius: 80000,
    radiusSpread: 10000,
    sizeStart: 4000,
    particleCount: 10000,
    opacityStart: 0,
    opacityMiddle: 1,
    opacityEnd: 0,
    colorStart: this.colorStart,
  })

  this.starGroup.mesh.renderDepth = 100
  scene.add(this.starGroup.mesh)
  this.starGroup.addEmitter(this.starEmitter);
}

Background.prototype.generateLogo = function() {
  this.emitters = [];
  this.emitterParams = {
    colorStart: new THREE.Color(0x14642a),
    colorMiddle: new THREE.Color(0x14642a),
    colorEnd: new THREE.Color(0xff00ff),
    accelerationSpread: new THREE.Vector3(1., 1., 1.),
    sizeStart: 10,
    opacityEnd: 0,
    particleCount: 20,
  }
  this.logoGroup = new SPE.Group({
    texture: texture,
    maxAge: 3,
    blending: THREE.NormalBlending
  });
  var textGeo = new THREE.TextGeometry("U  P  L  O  A  D     V  R", {
    size: 10,
    font: "helvetiker",
    height: 1
  });
  this.logoContainer = new THREE.Object3D();
  this.logoContainer.position.set(-50, 70, G.userStartZ - 200)
  scene.add(this.logoContainer);
  this.logoMesh = new THREE.Mesh(textGeo);
  this.logoContainer.add(this.logoMesh);
  var points = THREE.GeometryUtils.randomPointsInGeometry(this.logoMesh.geometry, 400);
  this.createEmitterPoints(points);
  this.logoGroup.mesh.renderDepth = -20
  this.logoContainer.add(this.logoGroup.mesh);

  this.logoContainer.remove(this.logoMesh);

}

Background.prototype.createEmitterPoints = function(points) {
  var emitter;
  for(var i =0; i < points.length; i++){
    emitter = new SPE.Emitter(this.emitterParams);
    emitter.position = points[i];
    this.logoGroup.addEmitter(emitter);
    this.emitters.push(emitter);
  }


}

Background.prototype.update = function() {
  this.starGroup.tick();
  this.logoGroup.tick();
}