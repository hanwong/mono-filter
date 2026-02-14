export const GRAIN_SHADER = `
uniform float intensity;

vec4 main(vec2 pos) {
  // Coarser grain (2x2 pixel blocks) for better visibility
  vec2 p = floor(pos / 2.0);
  float noise = fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  
  // Mix 0.5 (neutral for overlay) with noise based on intensity
  // Boost intensity slightly to ensure visibility
  float gray = mix(0.5, noise, intensity);
  return vec4(gray, gray, gray, 1.0);
}
`;

export const VIGNETTE_SHADER = `
uniform vec2 resolution;
uniform float intensity;

vec4 main(vec2 pos) {
  vec2 center = resolution * 0.5;
  float d = distance(pos, center);
  float maxDist = length(center);
  
  // Start darkening earlier (0.3)
  float val = smoothstep(0.3, 1.0, d / maxDist);
  
  // Alpha scaled by intensity
  float alpha = val * intensity;
  return vec4(0.0, 0.0, 0.0, alpha);
}
`;
