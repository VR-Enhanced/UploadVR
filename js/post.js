function Post($post, index) {
	this.radius  = 600;
	var scale = 8;
	var geo = new THREE.PlaneBufferGeometry(190, 200)
	var mat = new THREE.MeshBasicMaterial({
		color: 0xff00ff,
		transparent: true,
		opacity: 0.7
	});
  this.distanceFromUser = 200;

	this.panel = new THREE.Mesh(geo, mat);
	scene.add(this.panel);
  var segment = index/G.totalPosts * (Math.PI * 2)
  var x= Math.cos(segment) * this.radius;
  var z = Math.sin(segment) * this.radius;
  this.panel.position.set(x, 100, z);
  this.panel.lookAt(new THREE.Vector3());

	this.panel.myId = _.random(1, 1000);

	var innerPanel = new THREE.Object3D();
	this.panel.add(innerPanel);
	innerPanel.html = $post[0];
	innerPanel.content = new THREE.CSS3DObject(innerPanel.html);
	innerPanel.content.scale.set(0.2, 0.2, 1);
	innerPanel.add(innerPanel.content);

	this.created = true


	G.objectControls.add(this.panel);
	this.panel.select = function() {
		this.flyIn(this.panel);
		console.log(this.panel.myId);
	}.bind(this);


}


Post.prototype.flyIn = function() {
	var fakeObject = new THREE.Object3D();
	var target = G.controls.getObject().position.clone();
	var direction = G.controls.getDirection();
	fakeObject.translateZ(direction.z * this.distanceFromUser)
	fakeObject.translateY(direction.y * this.distanceFromUser)
	fakeObject.translateX(direction.x * this.distanceFromUser)
	var i = {
		x: this.panel.position.x,
		z: this.panel.position.z
	}

	var f = {
		x: fakeObject.position.x,
		z: fakeObject.position.z
	}
	var posTween = new TWEEN.Tween(i).
	to(f, 3000).
	onUpdate(function() {
		this.panel.position.set(i.x, this.panel.position.y, i.z);
	}.bind(this)).start();

}