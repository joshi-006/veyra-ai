export const streamVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uEmotionEnergy;
  uniform float uTransform;

  attribute float aOffset;
  attribute float aLane;

  varying float vAlpha;
  varying float vEnergy;

  void main() {
    vec3 pos = position;

    float flow = mod(aOffset + uTime * (0.4 + uEmotionEnergy * 0.6), 1.0);
    pos.x = (flow - 0.5) * 9.0;

    float wobble = sin(flow * 18.0 + uTime * 2.0 + aLane * 6.28) * (0.18 + uEmotionEnergy * 0.35);
    pos.y = aLane * 1.4 + wobble * mix(1.0, 1.8, uTransform);

    float depthWobble = cos(flow * 11.0 - uTime * 1.4 + aLane * 3.1);
    pos.z = depthWobble * 0.6;

    vAlpha = smoothstep(0.0, 0.12, flow) * smoothstep(1.0, 0.85, flow);
    vEnergy = uEmotionEnergy;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float size = mix(2.0, 5.0, uEmotionEnergy) * (1.0 + wobble * 0.4);
    gl_PointSize = size * (260.0 / -mvPosition.z);
  }
`;

export const streamFragmentShader = /* glsl */ `
  uniform vec3 uColorLow;
  uniform vec3 uColorHigh;
  varying float vAlpha;
  varying float vEnergy;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
    vec3 color = mix(uColorLow, uColorHigh, vEnergy);
    gl_FragColor = vec4(color, alpha * 0.85);
  }
`;
