varying vec2 vUv;
uniform vec2 size;
uniform sampler2D map;
void main() {
    vec4 diffuse = texture2D(map, vUv);

    gl_FragColor = mix(diffuse, vec4(0.0, 1.0, 0.0,diffuse.a),0.5);
}