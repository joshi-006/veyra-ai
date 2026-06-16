import * as THREE from "three";

export interface NeuralMeshGeometry {
  points: THREE.BufferGeometry;
  lines: THREE.BufferGeometry;
}

/**
 * Builds an organic, non-uniform point field (a "communication network")
 * and a set of curved connection paths between nearby points. Positions
 * are jittered with layered noise so the field reads as alive rather than
 * a geometric primitive (no sphere/cube silhouette).
 */
export function buildNeuralMesh({
  count = 2200,
  radius = 6.5,
  connectionDistance = 1.35,
  maxConnectionsPerPoint = 3,
}: {
  count?: number;
  radius?: number;
  connectionDistance?: number;
  maxConnectionsPerPoint?: number;
} = {}): NeuralMeshGeometry {
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Layered, lumpy distribution rather than a clean sphere surface —
    // pulls samples toward a flattened, irregular volume.
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);

    const lump = 0.55 + 0.45 * Math.sin(theta * 3.0 + phi * 2.0);
    const r = radius * (0.35 + 0.65 * Math.pow(Math.random(), 0.6)) * lump;

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta) * 0.62; // flatten vertically
    const z = r * Math.cos(phi) * 0.85;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    phases[i] = Math.random() * Math.PI * 2;
    speeds[i] = 0.15 + Math.random() * 0.35;
  }

  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pointsGeo.setAttribute(
    "aHomePosition",
    new THREE.BufferAttribute(positions.slice(), 3)
  );
  pointsGeo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  pointsGeo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));

  // Spatial hash for nearest-neighbour connection search (avoids O(n^2) blowup)
  const cellSize = connectionDistance;
  const grid = new Map<string, number[]>();
  const cellKey = (x: number, y: number, z: number) =>
    `${Math.floor(x / cellSize)}_${Math.floor(y / cellSize)}_${Math.floor(
      z / cellSize
    )}`;

  for (let i = 0; i < count; i++) {
    const key = cellKey(
      positions[i * 3],
      positions[i * 3 + 1],
      positions[i * 3 + 2]
    );
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key)!.push(i);
  }

  const linePositions: number[] = [];
  const lineIds: number[] = [];
  const lineProgress: number[] = [];
  let lineCounter = 0;

  for (let i = 0; i < count; i++) {
    const px = positions[i * 3];
    const py = positions[i * 3 + 1];
    const pz = positions[i * 3 + 2];
    const cx = Math.floor(px / cellSize);
    const cy = Math.floor(py / cellSize);
    const cz = Math.floor(pz / cellSize);

    const candidates: { j: number; d: number }[] = [];

    for (let ox = -1; ox <= 1; ox++) {
      for (let oy = -1; oy <= 1; oy++) {
        for (let oz = -1; oz <= 1; oz++) {
          const key = `${cx + ox}_${cy + oy}_${cz + oz}`;
          const bucket = grid.get(key);
          if (!bucket) continue;
          for (const j of bucket) {
            if (j <= i) continue;
            const dx = positions[j * 3] - px;
            const dy = positions[j * 3 + 1] - py;
            const dz = positions[j * 3 + 2] - pz;
            const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (d < connectionDistance) candidates.push({ j, d });
          }
        }
      }
    }

    candidates.sort((a, b) => a.d - b.d);
    const chosen = candidates.slice(0, maxConnectionsPerPoint);

    for (const { j } of chosen) {
      const jx = positions[j * 3];
      const jy = positions[j * 3 + 1];
      const jz = positions[j * 3 + 2];

      // Curve the connection slightly through a midpoint offset so paths
      // read as flowing rather than rigid straight wires.
      const mx = (px + jx) / 2 + (Math.random() - 0.5) * 0.18;
      const my = (py + jy) / 2 + (Math.random() - 0.5) * 0.18;
      const mz = (pz + jz) / 2 + (Math.random() - 0.5) * 0.18;

      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(px, py, pz),
        new THREE.Vector3(mx, my, mz),
        new THREE.Vector3(jx, jy, jz)
      );
      const segments = 8;
      const pts = curve.getPoints(segments);

      for (let s = 0; s < pts.length; s++) {
        linePositions.push(pts[s].x, pts[s].y, pts[s].z);
        lineIds.push(lineCounter);
        lineProgress.push(s / segments);
      }
      lineCounter++;
    }
  }

  const linesGeo = new THREE.BufferGeometry();
  linesGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(linePositions), 3)
  );
  linesGeo.setAttribute(
    "aLineId",
    new THREE.BufferAttribute(new Float32Array(lineIds), 1)
  );
  linesGeo.setAttribute(
    "aProgress",
    new THREE.BufferAttribute(new Float32Array(lineProgress), 1)
  );

  return { points: pointsGeo, lines: linesGeo };
}
