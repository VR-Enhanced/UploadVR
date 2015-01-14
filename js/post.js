function Post(content, position) {


  var self = this;


  this.blog = G.textFactory.createMesh(content, {color: new THREE.Color(0x00ff00)})
  // this.blog.doubleSided = true;
  this.blog.frustumCulled = false

  this.originalOpacity = 0.7
  var mat = new THREE.MeshBasicMaterial({
    color: 0x150026,
    transparent: true,
    opacity: this.originalOpacity,
    side: THREE.DoubleSide
  })
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

  this.hoveredOpacity = 0.97;
  this.hoveredHeight = this.blog.position.y + 10;
  this.panel.hoverOver = function() {
    G.hoveredPost = this;
    this.hover(this.hoveredHeight, this.hoveredOpacity);
  }.bind(this);

   this.panel.hoverOut = function() {
    this.hover(this.originalHeight, this.originalOpacity)
    G.hoveredPost = null;
  }.bind(this);

  this.panel.select = function() {
    this.flyIn()
  }.bind(this);

}

Post.prototype.flyIn = function(){
  var i = {
    x: this.panel.position.x,
    z: this.panel.position.z
  }

  var newPos = G.customControls.camObject().clone().translateZ(-1000)
  var f = {
    x: newPos.position.x,
    z: newPos.position.z
  }
  var flyTween = new TWEEN.Tween(i).
    to(f, 1000).
    onUpdate(function(){
      this.panel.position.set(i.x, this.panel.position.y, i.z);
    }.bind(this)).start();
    flyTween.onComplete(function(){
      this.panel.lookAt(G.customControls.camPosition());
    }.bind(this));

}

Post.prototype.hover = function(pos, opacity) {
  var i = {
    y: this.blog.position.y,
    opacity: this.panel.opacity
  };
  var f = {
    y:pos,
    opacity: opacity
  };
  var hoverTween = new TWEEN.Tween(i).
  to(f, 500).
  onUpdate(function() {
    this.blog.position.y = i.y;
    this.panel.material.opacity = i.opacity;
  }.bind(this)).start();

}


Post.prototype.scrollText = function(event) {
  this.blog.position.y -= event.deltaY / 100
}