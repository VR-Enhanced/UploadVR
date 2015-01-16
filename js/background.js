function Background() {

  this.colorStart = new THREE.Color()
  this.colorStart.setRGB(Math.random(), Math.random(), Math.random())
  texture = THREE.ImageUtils.loadTexture('img/star.png')
  texture.minFilter = THREE.LinearMipMapLinearFilter;

  this.starGroup = new SPE.Group({
    texture: texture,
    blending: THREE.AdditiveBlending,
    maxAge: 7
  });

  this.generateStars()
  this.starGroup.mesh.renderDepth = 100
  scene.add(this.starGroup.mesh)




}

Background.prototype.generateStars = function() {
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

  this.starGroup.addEmitter(this.starEmitter);
}

Background.prototype.update = function() {
  this.starGroup.tick();


}