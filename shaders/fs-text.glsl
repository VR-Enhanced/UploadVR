varying float vZ;
varying vec2 vUv;
uniform vec2 size;
uniform sampler2D map;
void main() {
    vec2 d = gl_FragCoord.xy - (0.5)*size*vec2(1.0, 1.0);
    vec4 diffuse = texture2D(map, vUv);
    float a = 0.0;
    d = vec2( d.x*cos(a) + d.y*sin(a),
             -d.x*sin(a) + d.y*cos(a));
    vec2 rg = vec2(0.0)+abs(d)/(0.5*size);
    float b = abs(vZ) / 540.0;
    gl_FragColor = mix(diffuse, vec4(0.0, 1.0, 0.0,diffuse.a),0.5);
}