function Post(content, position) {


  var self = this;
  var geo = new THREE.Geometry();
  var str = content;

  var j = 0,
    ln = 0;

  var xSpace = 0.6;
  for (i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i);

    var cx = code % G.lettersPerSide;
    var cy = Math.floor(code / G.lettersPerSide);
    var v, t;
    var z = j * .1
    geo.vertices.push(
      new THREE.Vector3(j * xSpace + 0.05, ln * 1.1 + 0.05, z),
      new THREE.Vector3(j * xSpace + 1.05, ln * 1.1 + 0.05, z),
      new THREE.Vector3(j * xSpace + 1.05, ln * 1.1 + 1.05, z),
      new THREE.Vector3(j * xSpace + 0.05, ln * 1.1 + 1.05, z)
    );
    var face = new THREE.Face3(i * 4 + 0, i * 4 + 1, i * 4 + 2);
    geo.faces.push(face);
    face = new THREE.Face3(i * 4 + 0, i * 4 + 2, i * 4 + 3);
    geo.faces.push(face);
    var ox = (cx + 0.05) / G.lettersPerSide,
      oy = (cy + 0.05) / G.lettersPerSide,
      off = 0.9 / G.lettersPerSide;
    var sz = G.lettersPerSide * G.fontSize;
    geo.faceVertexUvs[0].push([
      new THREE.Vector2(ox, oy + off),
      new THREE.Vector2(ox + off, oy + off),
      new THREE.Vector2(ox + off, oy)
    ]);
    geo.faceVertexUvs[0].push([
      new THREE.Vector2(ox, oy + off),
      new THREE.Vector2(ox + off, oy),
      new THREE.Vector2(ox, oy)
    ]);
    if (code == 10) {
      ln--;
      j = 0;
    } else {
      j++;
    }
  }


  var width = window.innerWidth,
    height = window.innerHeight;

  var uniforms = {
    size: {
      type: "v2",
      value: new THREE.Vector2(width, height)
    },
    map: {
      type: "t",
      value: G.textMap
    },
  };

  var shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: G.shaders.vs.text,
    fragmentShader: G.shaders.fs.text
  });
  shaderMaterial.transparent = true;

  var blog = new THREE.Mesh(
    geo,
    shaderMaterial
  );
  // blog.doubleSided = true;
  blog.frustumCulled = false


  var mat = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    transparent: true,
    opacity: .07,
    side: THREE.DoubleSide
  })
  this.panel = new THREE.Mesh(new THREE.PlaneBufferGeometry(55, 1000), mat)
  this.panel.renderDepth = 10
  this.panel.position.copy(position);
  this.panel.scale.set(20, 20, 1);
  scene.add(this.panel)
  this.panel.add(blog);
  this.panel.lookAt(camera.position);
  blog.position.set(10, 20, 1);


  G.objectControls.add(this.panel);
  this.panel.select = function() {}

  this.panel.hoverOver = function() {
    G.hoveredPost = this;
    this.hover(100);
  }.bind(this)

  this.panel.hoverOut = function() {
    this.hover(-100)
    G.hoveredPost = null;

  }.bind(this)


}

Post.prototype.scrollText = function(event) {
  this.panel.position.y -= event.deltaY / 10
}

Post.prototype.hover = function(offset) {
  var i = {
    y: this.panel.position.y
  };
  var f = {
    y: this.panel.position.y + offset
  };
  var hoverTween = new TWEEN.Tween(i).
  to(f, 500).
  onUpdate(function() {
    this.panel.position.y = i.y;
  }.bind(this)).start();


}