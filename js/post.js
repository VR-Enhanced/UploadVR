function Post(content, tag, position, imageURL, videoURL) {


  var self = this;
  this.textMargin = 2;
  this.xTranslation = 10;
  this.originalImageOpacity = 0.0;
  this.scrollFactor = .05
  this.hoveredImageOpacity = 1.0;

  this.originalPanelOpacity = 0.6
  this.hoveredPanelOpacity = 0.9;

  this.originalHeight = position.y -50 ;
  this.hoveredHeight = this.originalHeight + 100;
  this.blogHoveredHeightFactor = .2
  this.panelColor = new THREE.Color(0x300042)

  this.panelWidth = 100;
  this.panelHeight = 220;

  this.textColor = new THREE.Color(0x3ca95a)
  this.cutoffHoverPoint = this.panelHeight/2 + 10;

  //point at which if user hovers off panel, it wont fly back to place
  this.distanceFromUser = 100
  this.blog = G.textFactory.createMesh(content, {
    color: this.textColor
  })
  this.blog.frustumCulled = false
  this.videoURL = videoURL;





  var panelMaterial = new THREE.MeshBasicMaterial({
    color: this.panelColor,
    transparent: true,
    opacity: this.originalPanelOpacity,
    side: THREE.DoubleSide
  });
  this.panel = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.panelWidth, this.panelHeight), panelMaterial)
  this.panel.renderDepth = 9
  this.panel.position.copy(position);
  scene.add(this.panel)
  this.panel.add(this.blog);
  this.panel.lookAt(new THREE.Vector3());
  this.originalPosition = this.panel.position.clone();
  this.originalRotation = this.panel.rotation.clone();
  this.panel.position.y = this.originalHeight;

  this.blog.position.set(-this.panelWidth/2 + this.textMargin , this.originalHeight, .1);
  this.blog.scale.set(4, 4, 1)
  var tagline = G.textFactory.createMesh(tag, {
    color: this.textColor
  });
  this.panel.add(tagline);
  tagline.position.set(-this.panelWidth/2, this.cutoffHoverPoint, 10)
  tagline.scale.multiplyScalar(17)


  G.objectControls.add(this.panel);


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
  var radius = 100000;
  //SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
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
      G.hoveredPost.hover(G.hoveredPost.originalHeight, G.hoveredPost.originalPanelOpacity, G.hoveredPost.originalImageOpacity);
      //the old post is a video, we want to stop that!
      if (G.hoveredPost.video) {
        G.hoveredPost.video.pause()
      }
    }
    //if new post is video, we want to play
    if (this.video) {
      this.video.play();
    }
    G.hoveredPost = this;

    this.hover(this.hoveredHeight, this.hoveredPanelOpacity, this.hoveredImageOpacity);
  }.bind(this);


  this.panel.hoverOut = function() {
    if( this.outOfPlace && G.objectControls.intersectedPoint.y > this.cutoffHoverPoint){
      return;
    }
    this.hover(this.originalHeight, this.originalPanelOpacity, this.hoveredImageOpacity)
    if (!this.flying) {
      this.fly(this.originalPosition, this.originalRotation, false)
    }
  }.bind(this);

  this.panel.select = function() {
    var target = G.customControls.camObject().clone().translateZ(-this.distanceFromUser);
    target.translateX(this.xTranslation);
    this.fly(target.position, target.rotation, true)
  }.bind(this);

}

Post.prototype.fly = function(position, rotation, newPlace) {
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
    //prevents unwanted snapping
    this.outOfPlace = newPlace;
  }.bind(this));

}

Post.prototype.hover = function(pos, opacity, imageOpacity) {
  if (!this.skyImage) return
  var i = {
    y: this.panel.position.y,
    opacity: this.panel.material.opacity,
    imageOpacity: this.skyImage.material.opacity
  };

  var f = {
    y: pos,
    opacity: opacity,
    imageOpacity: imageOpacity
  };
  var hoverTween = new TWEEN.Tween(i).
  to(f, 1300).
  onUpdate(function() {
    this.panel.position.y = i.y;
    this.blog.position.y = i.y * this.blogHoveredHeightFactor;
    this.panel.material.opacity = i.opacity;
    this.skyImage.material.opacity = i.imageOpacity
  }.bind(this)).start();
}



Post.prototype.scrollText = function(event) {
  this.blog.position.y -= event.deltaY * this.scrollFactor;
}