export const meshVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseInfluence;

  attribute float aPhase;
  attribute float aSpeed;
  attribute vec3 aHomePosition;

  varying float vPulse;
  varying float vDepth;

  void main() {
    vec3 pos = aHomePosition;

    // Ambient drift — slow, organic, never settles
    pos.x += sin(uTime * aSpeed + aPhase) * 0.18;
    pos.y += cos(uTime * aSpeed * 0.8 + aPhase * 1.3) * 0.18;
    pos.z += sin(uTime * aSpeed * 0.6 + aPhase * 0.7) * 0.12;

    // Mouse attraction — nodes subtly lean toward the cursor in view space
    vec4 viewPos = modelViewMatrix * vec4(pos, 1.0);
    vec2 screenPos = viewPos.xy / max(abs(viewPos.z), 0.001);
    vec2 toMouse = uMouse - screenPos * 0.4;
    float dist = length(toMouse);
    float pull = smoothstep(2.4, 0.0, dist) * uMouseInfluence;
    viewPos.xy += toMouse * pull * 0.16;

    vDepth = -viewPos.z;
    vPulse = 0.5 + 0.5 * sin(uTime * 1.6 + aPhase * 4.0);

    gl_Position = projectionMatrix * viewPos;

    float size = mix(1.4, 3.2, vPulse) * (1.0 + pull * 1.6);
    gl_PointSize = size * (300.0 / vDepth);
  }
`;

export const meshFragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying float vPulse;
  varying float vDepth;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.0, d);
    alpha *= smoothstep(60.0, 8.0, vDepth);

    vec3 color = mix(uColorA, uColorB, vPulse);
    gl_FragColor = vec4(color, alpha * (0.45 + vPulse * 0.4));
  }
`;

/**
 * Connection lines pulse light along their length using a travelling
 * sine band rather than a flat color — this is the "light flows through
 * pathways" behaviour from the brief.
 */
export const lineVertexShader = /* glsl */ `
  uniform float uTime;
  attribute float aLineId;
  attribute float aProgress;
  varying float vProgress;
  varying float vLineId;

  void main() {
    vProgress = aProgress;
    vLineId = aLineId;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const lineFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying float vProgress;
  varying float vLineId;

  void main() {
    float speed = 0.35;
    float band = fract(vProgress * 1.0 - uTime * speed + vLineId * 13.7);
    float pulse = smoothstep(0.06, 0.0, abs(band - 0.5)) ;
    float base = 0.05;
    float alpha = base + pulse * 0.85;
    gl_FragColor = vec4(uColor, alpha * 0.5);
  }
`;
