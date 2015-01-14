function Post(content, position) {


  var self = this;


  this.blog = G.textFactory.createMesh(content)
  // this.blog.doubleSided = true;
  this.blog.frustumCulled = false

  this.originalOpacity = 0.07
  var mat = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
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
  this.blog.position.set(15, this.originalHeight, .1);


  G.objectControls.add(this.panel);

  this.hoveredOpacity = this.panel.material.opacity + 0.04;
  this.hoveredHeight = this.blog.position.y + 10;
  this.panel.hoverOver = function() {
    G.hoveredPost = this;
    this.hover(this.hoveredHeight, this.hoveredOpacity);
  }.bind(this)

   this.panel.hoverOut = function() {
    this.hover(this.originalHeight, this.originalOpacity)
    G.hoveredPost = null;
  }.bind(this)

  this.panel.select = function() {}

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