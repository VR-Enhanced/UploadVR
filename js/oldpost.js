function OldPost($post, index) {
  this.radius  = 600;
  this.fakeObject = new THREE.Object3D();
  var scale = 8;
  var geo = new THREE.PlaneBufferGeometry(190, 200)
  var mat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.7
  });
  this.distanceFromUser = 200;

  this.panel = new THREE.Mesh(geo, mat);
  scene.add(this.panel);
  var segment = index/G.totalPosts * (Math.PI * 2)
  var x= Math.cos(segment) * this.radius;
  var z = Math.sin(segment) * this.radius;
  this.panel.position.set(x, 50, z);

  this.panel.myId = index;

  var innerPanel = new THREE.Object3D();
  this.panel.add(innerPanel);
  innerPanel.html = $post[0];
  innerPanel.content = new THREE.CSS3DObject(innerPanel.html);
  innerPanel.content.scale.set(.1, .1, 1);
  innerPanel.add(innerPanel.content);

  this.created = true

  this.panel.lookAt(new THREE.Vector3());

  G.objectControls.add(this.panel);
  this.panel.select = function() {
    console.log('select')   
    this.flyIn(this.panel);
  }.bind(this);


}


Post.prototype.flyIn = function() {


  var i = {
    x: this.panel.position.x,
    z: this.panel.position.z
  }

  var f = {
    x: camera.position.x,
    z: camera.position.z - 50
  }
  var posTween = new TWEEN.Tween(i).
  to(f, 3000).
  onUpdate(function() {
    this.panel.position.set(i.x, this.panel.position.y, i.z);
  }.bind(this)).start();

}