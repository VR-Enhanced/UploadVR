function Post(content, position, imageURL) {


  var self = this;


  this.blog = G.textFactory.createMesh(content, {color: new THREE.Color(0x00ff00)})
  // this.blog.doubleSided = true;
  this.blog.frustumCulled = false

  this.originalOpacity = 0.2
  var mat = new THREE.MeshBasicMaterial({
    color: 0x150026,
    transparent: true,
    opacity: this.originalOpacity,
    side: THREE.DoubleSide
  });
  this.panel = new THREE.Mesh(new THREE.PlaneBufferGeometry(45, 500), mat)
  this.panel.renderDepth = 10
  this.panel.position.copy(position);
  this.panel.scale.set(20, 20, 1);
  scene.add(this.panel)
  this.panel.add(this.blog);
  this.panel.lookAt(camera.position);
  

  this.originalHeight = 10;
  this.blog.position.set(-20, this.originalHeight, .1);


  G.objectControls.add(this.panel);

  this.originalImageOpacity = 0.0;
  this.hoveredImageOpacity =  1.0;
  this.hoveredOpacity = 0.9;
  this.hoveredHeight = this.blog.position.y + 10;

  var imageScale = 10;
  if(imageURL){
    THREE.ImageUtils.loadTexture(imageURL, undefined, function(texture){
      var material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: this.originalImageOpacity
      })
      this.image = new THREE.Mesh(new THREE.PlaneBufferGeometry(texture.image.width,  texture.image.height), material)
      scene.add(this. image);
      this.image.scale.multiplyScalar(imageScale)
      this.image.position.z = -20000;
      this.image.position.y += texture.image.height/2 * imageScale
      this.image.position.x = 
      this.image.renderDepth = 10
    }.bind(this));
  }
  this.panel.hoverOver = function() {
    G.hoveredPost = this;
    this.hover(this.hoveredHeight, this.hoveredOpacity, this.hoveredImageOpacity);
  }.bind(this);

   this.panel.hoverOut = function() {
    this.hover(this.originalHeight, this.originalOpacity, this.originalImageOpacity)
    G.hoveredPost = null;
  }.bind(this);

  this.panel.select = function() {
    this.flyIn()
  }.bind(this);

}

Post.prototype.flyIn = function(){
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
    onUpdate(function(){
      this.panel.position.set(i.x, this.panel.position.y, i.z);
      this.panel.rotation.set(i.rotX, i.rotY, i.rotZ);
    }.bind(this)).start();
    flyTween.onComplete(function(){
    }.bind(this));

}

Post.prototype.hover = function(pos, opacity, imageOpacity) {
  var i = {
    y: this.blog.position.y,
    opacity: this.panel.material.opacity,
    imageOpacity: this.image.material.opacity
  };

  var f = {
    y:pos,
    opacity: opacity,
    imageOpacity: imageOpacity
  };
  var hoverTween = new TWEEN.Tween(i).
  to(f, 500).
  onUpdate(function() {
    this.blog.position.y = i.y;
    this.panel.material.opacity = i.opacity;
    this.image.material.opacity= i.imageOpacity
  }.bind(this)).start();

}


Post.prototype.scrollText = function(event) {
  this.blog.position.y -= event.deltaY / 100
}