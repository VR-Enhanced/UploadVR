function Post(content, position, imageURL) {


  var self = this;


  this.blog = G.textFactory.createMesh(content, {
      color: new THREE.Color(0x00ff00)
    })
    // this.blog.doubleSided = true;
  this.blog.frustumCulled = false

  this.originalOpacity = 0.2
  var mat = new THREE.MeshBasicMaterial({
    color: 0x150026,
    transparent: true,
    opacity: this.originalOpacity,
    side: THREE.DoubleSide
  });
  this.panel = new THREE.Mesh(new THREE.PlaneBufferGeometry(90, 500), mat)
  this.panel.renderDepth = 10
  this.panel.position.copy(position);
  this.panel.scale.set(20, 20, 1);
  scene.add(this.panel)
  this.panel.add(this.blog);
  this.panel.lookAt(camera.position);
  this.blog.scale.set(2, 2, 1)

  this.originalHeight = 10;
  this.blog.position.set(-40, this.originalHeight, .1);


  G.objectControls.add(this.panel);

  this.originalImageOpacity = 0.0;
  this.hoveredImageOpacity = 1.0;
  this.hoveredOpacity = 0.9;
  this.hoveredHeight = this.blog.position.y + 10;

  if (imageURL) {
    THREE.ImageUtils.loadTexture(imageURL, undefined, function(texture) {
      var material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: this.originalImageOpacity,
        side: THREE.DoubleSide,
      })

      var imageScale = 15;
      var radius = 1100;
      //SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
      var geo =  new THREE.SphereGeometry(radius, 16, 8, -Math.PI * 1.2, Math.PI * 1.6, 1, 1.2);
      this.skyImage = new THREE.Mesh(geo, material);
      this.skyImage.rotation.y += 0.2
      this.skyImage.doubleSided = true;
      // this.skyImage.position.z = -5000
      this.skyImage.scale.multiplyScalar(imageScale)
      this.skyImage.position.y = (radius/2 * imageScale)
      this.skyImage.renderDepth = 10
      scene.add(this.skyImage)
    }.bind(this));


  }
  this.panel.hoverOver = function() {
    //fade old Image
    if(G.hoveredPost){
      console.log('FADE')
      G.hoveredPost.hover(G.hoveredPost.originalHeight, G.hoveredPost.originalOpacity, G.hoveredPost.originalImageOpacity);
    }
    G.hoveredPost = this;

    this.hover(this.hoveredHeight, this.hoveredOpacity, this.hoveredImageOpacity);
  }.bind(this);

  this.panel.hoverOut = function() {
    this.hover(this.originalHeight, this.originalOpacity, this.hoveredImageOpacity)
    // G.hoveredPost = null;
  }.bind(this);

  this.panel.select = function() {
    // this.flyIn() 
  }.bind(this);

}

Post.prototype.flyIn = function() {
  var i = {
    x: this.panel.position.x,
    z: this.panel.position.z,
    rotY: this.panel.rotation.y,
    rotX: this.panel.rotation.x,
    rotZ: this.panel.rotation.z,
  }

  var target = G.customControls.camObject().clone().translateZ(-1000)
  var f = {
    x: target.position.x,
    z: target.position.z,
    rotY: target.rotation.y,
    rotX: target.rotation.x,
    rotZ: target.rotation.z,
  }
  var flyTween = new TWEEN.Tween(i).
  to(f, 1000).
  onUpdate(function() {
    this.panel.position.set(i.x, this.panel.position.y, i.z);
    this.panel.rotation.set(i.rotX, i.rotY, i.rotZ);
  }.bind(this)).start();
  flyTween.onComplete(function() {}.bind(this));

}

Post.prototype.hover = function(pos, opacity, imageOpacity) {
  var i = {
    y: this.blog.position.y,
    opacity: this.panel.material.opacity,
    imageOpacity: this.skyImage.material.opacity
  };

  var f = {
    y: pos,
    opacity: opacity,
    imageOpacity: imageOpacity
  };
  var hoverTween = new TWEEN.Tween(i).
  to(f, 500).
  onUpdate(function() {
    this.blog.position.y = i.y;
    this.panel.material.opacity = i.opacity;
    this.skyImage.material.opacity = i.imageOpacity
  }.bind(this)).start();

}


Post.prototype.scrollText = function(event) {
  this.blog.position.y -= event.deltaY / 100
}