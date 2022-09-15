varying vec2 vUv;
varying float vRandom;

#define PI 3.1415926535897932384626433832795

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid){
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

vec4 permute(vec4 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main() {
    // 3
    // float strength = vUv.x - 0.5;

    // 4
    // float strength = vUv.y;

    // 5
    // float strength = 1.0 - vUv.y;

    // 6
    // float strength = vUv.y * 10.0;

    // 7
    // float strength = mod(vUv.y * 10.0, 1.0);

    // 8
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.5, strength);

    // 9
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.8, strength);

    // 10
    // float strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.8, strength);

    // 11
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0));

    // 12
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // 13
    // float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // 14
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // float barY = step(0.4, mod(vUv.y * 10.0, 1.0));
    // barY *= step(0.8, mod(vUv.x * 10.0, 1.0));

    // float strength = barX + barY;

    // 15
    // float barX = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));

    // float barY = step(0.4, mod(vUv.y * 10.0, 1.0));
    // barY *= step(0.8, mod(vUv.x * 10.0, 1.0));

    // float strength = barX + barY;

    // 16
    // float strength = abs(vUv.x - 0.5);

    // 17
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // 18
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // 19
    // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    // 20
    // float strength = step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    // 21
    // float strength = (floor(vUv.x * 10.0) / 10.0);

    // 22
    // float strength = (floor(vUv.x * 10.0) / 10.0);
    // strength *= floor(vUv.y * 10.0) / 10.0;

    // 23
    // float strength = random(vUv);

    // 24
    // vec2 gridUv = vec2(
    //     floor(vUv.x * 10.0) / 10.0,
    //     floor(vUv.y * 10.0) / 10.0
    // );
    // float strength = random(gridUv);

    // 25
    // vec2 gridUv = vec2(
    //     floor(vUv.x * 10.0) / 10.0,
    //     floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0
    // );
    // float strength = random(gridUv);

    // 26
    // float strength = length(vUv - 0.5); // method 1
    // float strength = distance(vUv, vec2(0.5)); // method 2

    // 27
    // float strength = 1.0 - distance(vUv, vec2(0.5));

    // 28
    // float strength = 0.015 / distance(vUv, vec2(0.5));

    // 29
    // vec2 lightUvX = vec2( vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25 );
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    // vec2 lightUvY = vec2( vUv.y * 0.1 + 0.45, vUv.x * 0.5 + 0.25 );
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5));
    // float strength = lightX * lightY;

    // 30
    // vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));

    // vec2 lightUvX = vec2( rotatedUv.x * 0.1 + 0.45, rotatedUv.y * 0.5 + 0.25 );
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    // vec2 lightUvY = vec2( rotatedUv.y * 0.1 + 0.45, rotatedUv.x * 0.5 + 0.25 );
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5));
    // float strength = lightX * lightY;

    // 31
    // float strength = step(0.25, distance(vUv, vec2(0.5)));

    // 32
    // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    // 33
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    // 34
    // vec2 waveUv = vec2(
    //     vUv.x,
    //     sin(vUv.x * 30.0) * 0.1 + vUv.y
    //     );
    // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    // 35
    // vec2 waveUv = vec2(
    //     sin(vUv.y * 30.0) * 0.1 + vUv.x,
    //     sin(vUv.x * 30.0) * 0.1 + vUv.y
    //     );
    // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    // 36
    // vec2 waveUv = vec2(
    //     sin(vUv.y * 100.0) * 0.1 + vUv.x,
    //     sin(vUv.x * 100.0) * 0.1 + vUv.y
    //     );
    // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    // 37
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;

    // 38
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength = angle;

    // 39
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = angle;

    // 40
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // angle *= 20.0;
    // float strength = mod(angle, 1.0);

    // 41
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = sin(angle *  50.0);

    // 42
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float sinusID = sin(angle *  100.0);

    // float radius = 0.25 + sinusID * 0.02;
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

    // 43
    // float strength = cnoise(vUv * 10.0);

    // 44
    // float strength = step(0.0, cnoise(vUv * 10.0));

    // 45
    // float strength = 1.0 - abs(cnoise(vUv * 10.0));

    // 46
    // float strength = sin(cnoise(vUv * 10.0) * 20.0);

    // 47
    vec2 random = vec2(
        vUv.x * (vRandom * 2.0),
        vUv.y * (vRandom * 2.0)
    );

    float strength = step(sin(vRandom), sin(cnoise(random * (vRandom * 10.0)) * (vRandom * 30.0)));

    // clamp strength
    // strength = clamp(strength,  0.0, 1.0);

    // color version
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(random, 6.0);
    vec3 mixedColor = mix(blackColor, uvColor, strength);
    gl_FragColor = vec4(mixedColor, 1.0);
}