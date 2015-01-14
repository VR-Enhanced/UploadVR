
THREE.GLTextFactory = function(){
  this.fontSize = 64;
  this.lettersPerSide = 16;
  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = this.fontSize * this.lettersPerSide;
  var ctx = canvas.getContext('2d');
  ctx.font = this.fontSize + 'px Monospace';

  var i = 0;

  for (var y = 0; y < this.lettersPerSide; y++) {
    for (var x = 0; x < this.lettersPerSide; x += 1, i++) {
      var ch = String.fromCharCode(i);
      ctx.fillText(ch, x * this.fontSize + 10, -(8 / 32) * this.fontSize + (y + 1) * this.fontSize);
    }
  }

  this.textMap = new THREE.Texture(canvas);
  this.textMap.flipY = false;
  this.textMap.needsUpdate = true;

}

THREE.GLTextFactory.prototype.createMesh = function(content) {
  var geo = new THREE.Geometry();
  var str = content;

  var j = 0,
    ln = 0;

  var xSpace = 0.6;
  for (i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i);

    var cx = code % this.lettersPerSide;
    var cy = Math.floor(code / this.lettersPerSide);
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
    var ox = (cx + 0.05) / this.lettersPerSide,
      oy = (cy + 0.05) / this.lettersPerSide,
      off = 0.9 / this.lettersPerSide;
    var sz = this.lettersPerSide * this.fontSize;
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
      value: this.textMap
    },
  };

  var shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: G.shaders.vs.text,
    fragmentShader: G.shaders.fs.text
  });
  shaderMaterial.transparent = true;

  return new THREE.Mesh(geo, shaderMaterial);

}