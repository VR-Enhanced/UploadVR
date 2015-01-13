varying float vZ;
uniform float time;
uniform float effectAmount;
varying vec2 vUv;

mat3 rotateAngleAxisMatrix(float angle, vec3 axis) {
  float c = cos(angle);
  float s = sin(angle);
  float t = 1.0 - c;
  axis = normalize(axis);
  float x = axis.x, y = axis.y, z = axis.z;
  return mat3(
    t*x*x + c,    t*x*y + s*z,  t*x*z - s*y,
    t*x*y - s*z,  t*y*y + c,    t*y*z + s*x,
    t*x*z + s*y,  t*y*z - s*x,  t*z*z + c
  );
}

vec3 rotateAngleAxis(float angle, vec3 axis, vec3 v) {
  return rotateAngleAxisMatrix(angle, axis) * v;
}

void main() {
  float idx = floor(position.y/1.1)*80.0 + floor(position.x/1.1);
  vec3 corner = vec3(floor(position.x/1.1)*1.1, floor(position.y/1.1)*1.1, 0.0);
  vec3 mid = corner + vec3(0.5, 0.5, 0.0);
  vec3 rpos = rotateAngleAxis(idx+time, vec3(mod(idx,16.0), -8.0+mod(idx,15.0), 1.0), position - mid) + mid;
  vec4 fpos = vec4( mix(position,rpos,effectAmount), 1.0 );
  fpos.x += -35.0;
  fpos.z += ((sin(idx+time*2.0)))*4.2*effectAmount;
  fpos.y += ((cos(idx+time*2.0)))*4.2*effectAmount;
  vec4 mvPosition = modelViewMatrix * fpos;
  mvPosition.y += 10.0*sin(time*0.5+mvPosition.x/25.0)*effectAmount;
  mvPosition.x -= 10.0*cos(time*0.5+mvPosition.y/25.0)*effectAmount;
  vec4 p = projectionMatrix * mvPosition;
  vUv = uv;
  vZ = p.z;
  gl_Position = p;
}