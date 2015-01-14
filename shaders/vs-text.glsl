  varying vec2 vUv;



  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vec4 p = projectionMatrix * mvPosition;
    vUv = uv;
    gl_Position = p;
  }