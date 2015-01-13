function Post(content, position) {
 


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

  var book = new THREE.Mesh(
    geo,
    shaderMaterial
  );
  book.doubleSided = true;
  book.frustumCalled = false


  var mat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: .05
  })
  var panel = new THREE.Mesh(new THREE.PlaneBufferGeometry(50, 70), mat)
  panel.position.copy(position);
  panel.scale.set(20,20,1);
  scene.add(panel)
  panel.add(book);
  panel.lookAt(camera.position);
  book.position.set(10, 20, 0);


  G.objectControls.add(panel);
  panel.select = function(){
    console.log('yaah');
  }

  function onMouseWheel(event){
    panel.position.y -= event.deltaY/10
    preventDefault(event);
  }

  function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
      e.preventDefault();
    e.returnValue = false;
  }

  document.addEventListener('wheel', onMouseWheel, false);



}