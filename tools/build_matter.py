"""Build assets/data/matter.bin: point states for the BioInfoX WebGL scene.

Usage:  pip install MDAnalysis
        pip download --no-deps MDAnalysisTests && tar xzf mdanalysistests-*.tar.gz
        python3 tools/build_matter.py <path to MDAnalysisTests/data/> [output file]

Layout (little endian):
  header  : 4 x uint32  magic 'BIOX', N points, S states, F trajectory frames
  per state s (F trajectory frames first, then the other states):
      N*3 int16 positions (value / 8000 -> scene units)
      N   uint8 colour index (0 paper, 1 red, 2 highlight, 3 slate)
  per state s: uint32 edge count E, then E*2 uint16 point indices (trajectory frames > 0 carry none)
"""
import struct, warnings, math
import numpy as np
import MDAnalysis as mda
from MDAnalysis.analysis import align

warnings.filterwarnings('ignore')
rng = np.random.default_rng(7)
import sys, os
DATA = os.path.join(sys.argv[1], '') if len(sys.argv) > 1 else 'MDAnalysisTests/data/'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'data', 'matter.bin')

# ---------- adenylate kinase transition (real DIMS trajectory, heavy atoms) ----------
u = mda.Universe(DATA + 'adk.psf', DATA + 'adk_dims.dcd')
ref = mda.Universe(DATA + 'adk.psf', DATA + 'adk_dims.dcd')
heavy = u.select_atoms('not name H*')
N = len(heavy)
align.AlignTraj(u, ref, select='name CA', in_memory=True).run()
frames_idx = np.linspace(0, len(u.trajectory) - 1, 12).round().astype(int)
traj = []
for fi in frames_idx:
    u.trajectory[fi]
    traj.append(heavy.positions.copy())
traj = np.array(traj, dtype=np.float64)
centre = traj[0].mean(axis=0)
traj -= centre
scale = 1.0 / np.percentile(np.linalg.norm(traj[0], axis=1), 96)
traj *= scale
elem = [n[0] for n in heavy.names]
prot_col = np.array([{'C': 0, 'O': 1, 'N': 3, 'S': 2}.get(e, 0) for e in elem], dtype=np.uint8)
# covalent bonds from the topology, heavy atoms only
hidx = {a.index: i for i, a in enumerate(heavy)}
prot_edges = sorted({tuple(sorted((hidx[b.atoms[0].index], hidx[b.atoms[1].index])))
                     for b in u.bonds if b.atoms[0].index in hidx and b.atoms[1].index in hidx})

def normalise(p, r=1.0):
    p = p - p.mean(axis=0)
    return p * (r / np.percentile(np.linalg.norm(p, axis=1), 96))

def fit(p, col, edges=()):
    """Pad or trim a state to exactly N points; extra points sit on existing ones."""
    p = np.asarray(p, float); col = np.asarray(col, np.uint8)
    if len(p) > N:
        keep = np.sort(rng.choice(len(p), N, replace=False))
        remap = -np.ones(len(p), int); remap[keep] = np.arange(N)
        edges = [(remap[a], remap[b]) for a, b in edges if remap[a] >= 0 and remap[b] >= 0]
        p, col = p[keep], col[keep]
    elif len(p) < N:
        extra = rng.choice(len(p), N - len(p))
        p = np.vstack([p, p[extra] + rng.normal(0, 0.004, (len(extra), 3))])
        col = np.concatenate([col, col[extra]])
    return p, col, list(edges)

# ---------- ligand-protected gold nanoparticle: Mackay icosahedron, 7 shells = 1415 Au ----------
phi = (1 + 5 ** 0.5) / 2
V = np.array([[-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0], [0, -1, phi], [0, 1, phi],
              [0, -1, -phi], [0, 1, -phi], [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]], float)
V /= np.linalg.norm(V[0])
faces = []
for i in range(12):
    for j in range(i + 1, 12):
        for k in range(j + 1, 12):
            d = [np.linalg.norm(V[a] - V[b]) for a, b in ((i, j), (j, k), (i, k))]
            if all(abs(x - d[0]) < 1e-6 for x in d) and d[0] < 1.2:
                faces.append((i, j, k))
au = {(0, 0, 0)}
for n in range(1, 8):
    for (a, b, c) in faces:
        for i in range(n + 1):
            for j in range(n + 1 - i):
                q = (V[a] * (n - i - j) + V[b] * i + V[c] * j)
                au.add(tuple(np.round(q, 5)))
au = np.array(sorted(au))
assert len(au) == 1415, len(au)
r_au = np.linalg.norm(au, axis=1)
surface = np.where(r_au > r_au.max() * 0.8)[0]
lig_n = N - len(au)
anchors = rng.choice(surface, lig_n // 2, replace=False)
lig, lig_col, gold_edges = [], [], []
for k, a in enumerate(anchors):
    d = au[a] / np.linalg.norm(au[a])
    s = au[a] + d * 0.9          # thiolate sulphur
    c = au[a] + d * 2.1          # first carbon of the chain
    lig += [s, c]; lig_col += [1, 0]
    si = len(au) + 2 * k
    gold_edges += [(int(a), si), (si, si + 1)]
gold = np.vstack([au, lig])
gold_col = np.concatenate([np.full(len(au), 2), lig_col]).astype(np.uint8)
gold = normalise(gold, 0.95)
gold, gold_col, gold_edges = fit(gold, gold_col, gold_edges)

# ---------- B-DNA, 34 base pairs: 3.38 Å rise, 36° twist, phosphates at 8.9 Å ----------
bp = 34
dna, dna_col, dna_edges = [], [], []
per_bp = N // bp
prevP = [None, None]
for i in range(bp):
    z = i * 3.38
    t = math.radians(36 * i)
    ang = [t, t + math.radians(144)]          # minor-groove offset between strands
    Pidx = []
    for s in (0, 1):
        P = np.array([8.9 * math.cos(ang[s]), 8.9 * math.sin(ang[s]), z + (0 if s == 0 else 1.2)])
        Pidx.append(len(dna)); dna.append(P); dna_col.append(1)
        for k in range(3):                     # sugar ring points
            rr = 7.6 - k * 0.6
            dna.append(np.array([rr * math.cos(ang[s] + 0.12 * (k + 1)), rr * math.sin(ang[s] + 0.12 * (k + 1)), z + 0.6]))
            dna_col.append(0)
        if prevP[s] is not None:
            dna_edges.append((prevP[s], Pidx[s]))
        prevP[s] = Pidx[s]
    a = np.array(dna[Pidx[0] + 3]); b = np.array(dna[Pidx[1] + 3])
    rung = per_bp - 8
    first = len(dna)
    for k in range(rung):                      # stacked base pair between the strands
        f = (k + 0.5) / rung
        dna.append(a + (b - a) * f + rng.normal(0, 0.12, 3)); dna_col.append(3 if f < 0.5 else 0)
    dna_edges += [(Pidx[0] + 3, first), (first + rung - 1, Pidx[1] + 3)]
dna = np.array(dna)
dna = dna[:, [0, 2, 1]]                        # stand the helix upright (y axis)
dna = normalise(dna, 1.3)
tilt = 0.32                                    # lean the helix for depth
dna = dna @ np.array([[math.cos(tilt), -math.sin(tilt), 0], [math.sin(tilt), math.cos(tilt), 0], [0, 0, 1]]).T
dna, dna_col, dna_edges = fit(dna, dna_col, dna_edges)

# ---------- target interaction network: 8 communities around hub targets ----------
net, net_col, net_edges = [], [], []
ga = math.pi * (3 - 5 ** 0.5)
centres = np.array([[math.cos(ga * k) * math.sqrt(1 - (1 - 2 * (k + .5) / 8) ** 2), 1 - 2 * (k + .5) / 8,
                     math.sin(ga * k) * math.sqrt(1 - (1 - 2 * (k + .5) / 8) ** 2)] for k in range(8)]) * 0.62
hubs = []
for c in range(8):
    hubs.append(len(net)); net.append(centres[c]); net_col.append(1)
per = (N - 8) // 8
for c in range(8):
    for k in range(per):
        hub = k < 16                           # the hub target is drawn as a dense red node
        p = centres[c] + (rng.normal(0, 0.022, 3) if hub else rng.normal(0, 0.075, 3) * (1 + 1.6 * rng.random() ** 3))
        idx = len(net); net.append(p); net_col.append(1 if hub else (0 if rng.random() > 0.08 else 2))
        if rng.random() < 0.35:
            net_edges.append((hubs[c], idx))
        elif idx > hubs[c] + 2 and rng.random() < 0.5:
            net_edges.append((idx - 1 - int(rng.integers(0, 2)), idx))
for a in range(8):
    for b in range(a + 1, 8):
        if rng.random() < 0.45:
            net_edges.append((hubs[a], hubs[b]))
net = np.array(net) - np.array(net).mean(axis=0)
net, net_col, net_edges = fit(net, net_col, net_edges)

# ---------- DPPC vesicle (real coarse-grained head groups) with tails toward the midplane ----------
v = mda.Universe(DATA + 'dppc_vesicle_hg.gro')
heads = v.atoms.positions.astype(float)
# drop head groups wrapped across the periodic box: keep the connected main vesicle
c0 = np.median(heads, axis=0)
for _ in range(3):
    d0 = np.linalg.norm(heads - c0, axis=1)
    heads = heads[d0 < np.median(d0) * 1.6]
    c0 = heads.mean(axis=0)
heads -= heads.mean(axis=0)
rh = np.linalg.norm(heads, axis=1)
mid = np.median(rh)
ves = [h for h in heads]; ves_col = [1 if r > mid else 0 for r in rh]; ves_edges = []
tails = N - len(heads)
pick = rng.choice(len(heads), tails, replace=False)
for k, i in enumerate(pick):
    d = heads[i] / rh[i]
    inward = -1 if rh[i] > mid else 1
    ves.append(heads[i] + d * inward * rng.uniform(6, 14))
    ves_col.append(3)
    ves_edges.append((int(i), len(heads) + k))
ves = normalise(np.array(ves), 1.0)
ves, ves_col, ves_edges = fit(ves, ves_col, ves_edges)

# ---------- BioInfoX mark: the 13 nodes and 24 links of the logo ----------
nodes = [(36, 34, 1), (74, 72, 0), (100, 66, 0), (126, 72, 0), (164, 34, 1), (156, 96, 0), (144, 124, 0),
         (100, 176, 1), (56, 124, 0), (44, 96, 0), (76, 102, 1), (124, 102, 1), (100, 134, 0)]
links = [(0, 1), (1, 2), (2, 3), (3, 4), (4, 5), (5, 6), (6, 7), (7, 8), (8, 9), (9, 0), (1, 9), (3, 5), (10, 11),
         (10, 1), (10, 9), (11, 3), (11, 5), (2, 10), (2, 11), (10, 12), (11, 12), (12, 7), (6, 11), (8, 10)]
xy = {i: np.array([(x - 100) / 75.0, -(y - 105) / 75.0, 0]) for i, (x, y, _) in enumerate(nodes)}
logo, logo_col, logo_edges = [], [], []
node_pts = int(N * 0.55)
for i, (x, y, red) in enumerate(nodes):
    cnt = node_pts // 13 * (14 if red else 10) // 12
    for k in range(cnt):
        d = rng.normal(0, 1, 3); d /= np.linalg.norm(d)
        logo.append(xy[i] + d * (0.11 if red else 0.085) * rng.random() ** 0.33)
        logo_col.append(1 if red else 0)
rest = N - len(logo)
per_link = rest // len(links)
for (a, b) in links:
    for k in range(per_link):
        f = (k + 0.5) / per_link
        logo.append(xy[a] + (xy[b] - xy[a]) * f + rng.normal(0, 0.008, 3)); logo_col.append(3)
logo = np.array(logo) * 0.95
logo, logo_col, logo_edges = fit(logo, logo_col, [])

# ---------- order every non-protein state so morphs travel short, organic paths ----------
def order_like(target, base):
    """Assign target points to base points by sorting both along the same spatial key."""
    def key(p):
        return np.lexsort((np.arctan2(p[:, 2], p[:, 0]), np.round(p[:, 1] * 6)))
    kb, kt = key(base), key(target)
    perm = np.empty(N, int); perm[kb] = kt
    return perm

states = []
for k, f in enumerate(traj):
    states.append((f, prot_col, prot_edges if k == 0 else []))
for p, c, e in [(gold, gold_col, gold_edges), (dna, dna_col, dna_edges), (net, net_col, net_edges),
                (ves, ves_col, ves_edges), (logo, logo_col, logo_edges)]:
    perm = order_like(p, traj[0])            # perm[i] = which target point goes to slot i
    inv = np.empty(N, int); inv[perm] = np.arange(N)
    e2 = [(int(inv[a]), int(inv[b])) for a, b in e]
    states.append((p[perm], c[perm], e2))

import os
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, 'wb') as fh:
    fh.write(b'BIOX'); fh.write(struct.pack('<III', N, len(states), len(traj)))
    for p, c, e in states:
        q = np.clip(np.round(np.asarray(p) * 8000), -32767, 32767).astype('<i2')
        fh.write(q.tobytes()); fh.write(np.asarray(c, np.uint8).tobytes())
    for p, c, e in states:
        fh.write(struct.pack('<I', len(e)))
        fh.write(np.asarray(e, '<u2').reshape(-1).tobytes())
print('N', N, 'states', len(states), 'bytes', os.path.getsize(OUT),
      'edges', [len(s[2]) for s in states][-6:])
