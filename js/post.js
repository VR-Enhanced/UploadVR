function Post(content) {
  var xSpace = 0.6;
  var fontSize = 64;
  var lettersPerSide = 16;
  var c = document.createElement('canvas');
  c.width = c.height = fontSize * lettersPerSide;
  var ctx = c.getContext('2d');
  ctx.font = fontSize + 'px Monospace';

  var i = 0;

  for (var y = 0; y < lettersPerSide; y++) {
    for (var x = 0; x < lettersPerSide; x += 1, i++) {
      var ch = String.fromCharCode(i);
      ctx.fillText(ch, x * fontSize, -(8 / 32) * fontSize + (y + 1) * fontSize);
    }
  }

  var tex = new THREE.Texture(c);
  tex.flipY = false;
  tex.needsUpdate = true;



  var geo = new THREE.Geometry();
  var str = BOOK;

  var j = 0,
    ln = 0;

  for (i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i);

    var cx = code % lettersPerSide;
    var cy = Math.floor(code / lettersPerSide);
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
    var ox = (cx + 0.05) / lettersPerSide,
      oy = (cy + 0.05) / lettersPerSide,
      off = 0.9 / lettersPerSide;
    var sz = lettersPerSide * fontSize;
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

  var top = new THREE.Object3D();

  var width = window.innerWidth,
    height = window.innerHeight;

  var uniforms = {
    size: {
      type: "v2",
      value: new THREE.Vector2(width, height)
    },
    map: {
      type: "t",
      value: tex
    },
  };

  var shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: G.shaders.vs.text,
    fragmentShader: G.shaders.fs.text
  });
  shaderMaterial.transparent = true;

  var book = new THREE.Mesh(
    geo,
    shaderMaterial
  );
  book.doubleSided = true;
  book.position.set(0, 200, -500);
  top.add(book);
  book.scale.set(10, 10, 1)
  book.frustumCalled = false

  scene.add(top);

  function onMouseWheel(event){
    console.log('yaaa')
    top.position.y += 1;
    preventDefault(event);
  }

  function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
      e.preventDefault();
    e.returnValue = false;
  }

  document.addEventListener('mousewheel', onMouseWheel, false);
  document.addEventListener('DOMMouseScroll', onMouseWheel, false); // firefox



}