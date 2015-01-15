function Post(content, position, imageURL, videoURL) {


  var self = this;

  this.distanceFromUser = 1300
  this.blog = G.textFactory.createMesh(content, {
      color: new THREE.Color(0x00ff00)
    })
  this.blog.frustumCulled = false
  this.videoURL = videoURL;
  this.originalOpacity = 0.2
  var mat = new THREE.MeshBasicMaterial({
    color: 0x150026,
    transparent: true,
    opacity: this.originalOpacity,
    side: THREE.DoubleSide
  });
  this.panel = new THREE.Mesh(new THREE.PlaneBufferGeometry(90, 500), mat)
  this.panel.renderDepth = 9
  this.panel.position.copy(position);
  this.panel.scale.set(20, 20, 1);
  scene.add(this.panel)
  this.panel.add(this.blog);
  this.panel.lookAt(new THREE.Vector3());
  this.originalPosition = this.panel.position.clone();
  this.originalRotation = this.panel.rotation.clone();
  this.blog.scale.set(2, 2, 1)

  this.originalHeight = 10;
  this.blog.position.set(-30, this.originalHeight, .1);


  G.objectControls.add(this.panel);

  this.originalImageOpacity = 0.0;
  this.hoveredImageOpacity = 1.0;
  this.hoveredOpacity = 0.9;
  this.hoveredHeight = this.blog.position.y + 10;
  var imageMaterial;
  if (imageURL) {

    imageMaterial = new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture(imageURL),
      transparent: true,
      opacity: this.originalImageOpacity,
      side: THREE.BackSide
    });
  } else if (videoURL) {
    this.video = document.createElement('video');

    this.video.src = videoURL
    this.video.loop = "loop";

    var texture = new THREE.VideoTexture(this.video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    imageMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: this.originalImageOpacity,
      side: THREE.BackSide
    });


  }

  var imageScale = 1.0;
  var radius = 40000;
  //SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
  // var geo = new THREE.SphereGeometry(radius, 64, 16, Math.PI - .6, Math.PI * 1.8, 0.4, Math.PI * 0.55);
  var geo = new THREE.SphereGeometry(radius, 64, 16, -Math.PI * 1.2, Math.PI * 1.8, 0.4, Math.PI * 0.55);
  this.skyImage = new THREE.Mesh(geo, imageMaterial);
  // this.skyImage.position.z = -15000
  this.skyImage.renderDepth = 10;
  this.skyImage.rotation.y = -0.3
  this.skyImage.scale.multiplyScalar(imageScale)
  this.skyImage.position.y = (radius / 2 * imageScale)
  scene.add(this.skyImage)
  this.panel.hoverOver = function() {
    //fade old Image
    if (G.hoveredPost) {
      G.hoveredPost.hover(G.hoveredPost.originalHeight, G.hoveredPost.originalOpacity, G.hoveredPost.originalImageOpacity);
      //the old post is a video, we want to stop that!
      if(G.hoveredPost.video){
        G.hoveredPost.video.pause()
      }
    }
    //if new post is video, we want to play
    if(this.video){
      this.video.play();
    }
    G.hoveredPost = this;

    this.hover(this.hoveredHeight, this.hoveredOpacity, this.hoveredImageOpacity);
  }.bind(this);
 

  this.panel.hoverOut = function() {
    this.hover(this.originalHeight, this.originalOpacity, this.hoveredImageOpacity)
    if(!this.flying){
      this.fly(this.originalPosition, this.originalRotation)
    }
  }.bind(this);

  this.panel.select = function() {
    var target = G.customControls.camObject().clone().translateZ(-this.distanceFromUser);
    this.fly(target.position, target.rotation) 
  }.bind(this);


}

Post.prototype.fly = function(position, rotation) {
  var i = {
    x: this.panel.position.x,
    z: this.panel.position.z,
    rotY: this.panel.rotation.y,
    rotX: this.panel.rotation.x,
    rotZ: this.panel.rotation.z,
  }

  var f = {
    x: position.x,
    z: position.z,
    rotY: rotation.y,
    rotX: rotation.x,
    rotZ: rotation.z,
  }
  this.flying = true;
  var flyTween = new TWEEN.Tween(i).
  to(f, 1000).
  onUpdate(function() {
    this.panel.position.set(i.x, this.panel.position.y, i.z);
    this.panel.rotation.set(0, i.rotY, 0);
  }.bind(this)).start();
  flyTween.onComplete(function() {
    this.flying = false;
  }.bind(this));

}

Post.prototype.hover = function(pos, opacity, imageOpacity) {
  if (!this.skyImage) return
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