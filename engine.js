// Orapa Mine engine: geometry, placement, ray tracing.
// Board: 10 columns (x 0..10) by 8 rows (y 0..8), y grows downward.
// Each cell is split into 4 quarter triangles by its diagonals: N=0, E=1, S=2, W=3.
// Every gem has integer vertices and 0/45/90 degree edges, so it is exactly a union of quarters.
var Orapa = (function () {
  var W = 10, H = 8;
  var DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];
  var ROWS = 'ABCDEFGH', BOTTOM = 'IJKLMNOPQR';

  var TYPES = {
    red:     { name: 'rouge',       code: 'R', poly: [[0,1],[1,0],[3,0],[2,1]] },
    yellow:  { name: 'jaune',       code: 'Y', poly: [[0,0],[2,0],[0,2]] },
    blue:    { name: 'bleue',       code: 'B', poly: [[0,0],[4,0],[2,2]] },
    wbig:    { name: 'blanche',     code: 'W', poly: [[0,0],[4,0],[2,2]] },
    wsmall:  { name: 'blanche',     code: 'W', poly: [[1,0],[2,1],[1,2],[0,1]] },
    diamond: { name: 'diamant',     code: 'D', poly: [[0,0],[2,0],[1,1]] },
    black:   { name: 'corps noir',  code: 'K', poly: [[0,0],[2,0],[2,1],[0,1]] }
  };

  var MIX = {
    '': 'transparent', R: 'rouge', B: 'bleu', Y: 'jaune', W: 'blanc',
    BR: 'violet', BW: 'bleu clair', BY: 'vert', RW: 'rose', RY: 'orange', WY: 'jaune clair',
    BRW: 'violet clair', BRY: 'noir', BWY: 'vert clair', RWY: 'orange clair', BRWY: 'gris'
  };

  function normalize(pts) {
    var mx = Infinity, my = Infinity;
    pts.forEach(function (p) { mx = Math.min(mx, p[0]); my = Math.min(my, p[1]); });
    return pts.map(function (p) { return [p[0] - mx, p[1] - my]; });
  }
  function key(pts) {
    return pts.map(function (p) { return p[0] + ',' + p[1]; }).sort().join(';');
  }
  // All distinct orientations (rotations and mirrors) of a polygon.
  var orientCache = {};
  function orientations(type) {
    if (orientCache[type]) return orientCache[type];
    var base = TYPES[type].poly, seen = {}, out = [];
    var tf = [
      function (x, y) { return [x, y]; }, function (x, y) { return [-y, x]; },
      function (x, y) { return [-x, -y]; }, function (x, y) { return [y, -x]; },
      function (x, y) { return [-x, y]; }, function (x, y) { return [y, x]; },
      function (x, y) { return [x, -y]; }, function (x, y) { return [-y, -x]; }
    ];
    tf.forEach(function (f) {
      var p = normalize(base.map(function (v) { return f(v[0], v[1]); }));
      var k = key(p);
      if (!seen[k]) { seen[k] = 1; out.push(p); }
    });
    orientCache[type] = out;
    return out;
  }
  function size(pts) {
    var w = 0, h = 0;
    pts.forEach(function (p) { w = Math.max(w, p[0]); h = Math.max(h, p[1]); });
    return [w, h];
  }
  function inPoly(px, py, poly) {
    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }
  var QC = [[0.5, 1 / 6], [5 / 6, 0.5], [0.5, 5 / 6], [1 / 6, 0.5]];
  // Quarters covered by an absolute polygon: array of "x,y,q" ints encoded as x*32+y*4+q
  function quarters(abs) {
    var s = size(abs), res = [];
    for (var x = 0; x < W; x++) for (var y = 0; y < H; y++) for (var q = 0; q < 4; q++) {
      if (inPoly(x + QC[q][0], y + QC[q][1], abs)) res.push(x * 32 + y * 4 + q);
    }
    return res;
  }
  function place(type, oi, ox, oy) {
    var o = orientations(type)[oi];
    var abs = o.map(function (p) { return [p[0] + ox, p[1] + oy]; });
    return { type: type, o: oi, x: ox, y: oy, poly: abs, q: quarters(abs) };
  }
  function fits(type, oi, ox, oy) {
    var s = size(orientations(type)[oi]);
    return ox >= 0 && oy >= 0 && ox + s[0] <= W && oy + s[1] <= H;
  }

  function emptyOcc() { var a = new Int8Array(W * H * 4); a.fill(-1); return a; }
  function idx(x, y, q) { return (x * H + y) * 4 + q; }
  function buildOcc(pieces) {
    var occ = emptyOcc();
    pieces.forEach(function (p, i) {
      p.q.forEach(function (c) { var x = c >> 5, y = (c >> 2) & 7, q = c & 3; occ[idx(x, y, q)] = i; });
    });
    return occ;
  }
  function getOcc(occ, x, y, q) {
    if (x < 0 || y < 0 || x >= W || y >= H) return -1;
    return occ[idx(x, y, q)];
  }
  // Can piece p (index i) join occupancy without overlapping or sharing an edge with another gem?
  function compatible(occ, p, i) {
    for (var k = 0; k < p.q.length; k++) {
      var c = p.q[k], x = c >> 5, y = (c >> 2) & 7, q = c & 3;
      var o = occ[idx(x, y, q)];
      if (o !== -1 && o !== i) return false;
      var nb = [[x, y, (q + 1) % 4], [x, y, (q + 3) % 4], [x + DX[q], y + DY[q], (q + 2) % 4]];
      for (var n = 0; n < 3; n++) {
        var v = getOcc(occ, nb[n][0], nb[n][1], nb[n][2]);
        if (v !== -1 && v !== i) return false;
      }
    }
    return true;
  }

  // Entry points
  var ENTRIES = [];
  for (var i = 0; i < W; i++) ENTRIES.push({ label: String(i + 1), x: i, y: 0, d: 2, side: 'top', pos: i });
  for (var j = 0; j < H; j++) ENTRIES.push({ label: String(11 + j), x: W - 1, y: j, d: 3, side: 'right', pos: j });
  for (i = 0; i < W; i++) ENTRIES.push({ label: BOTTOM[i], x: i, y: H - 1, d: 0, side: 'bottom', pos: i });
  for (j = 0; j < H; j++) ENTRIES.push({ label: ROWS[j], x: 0, y: j, d: 1, side: 'left', pos: j });
  var ENTRY_BY = {};
  ENTRIES.forEach(function (e) { ENTRY_BY[e.label] = e; });

  function exitLabel(x, y, d) {
    if (d === 0) return String(x + 1);
    if (d === 2) return BOTTOM[x];
    if (d === 1) return String(11 + y);
    return ROWS[y];
  }

  // Trace a ray. Returns {exit, colorName, absorbed, hits:[pieceIndex...], path:[[x,y]...]}
  function trace(pieces, occ, label) {
    var e = ENTRY_BY[label];
    var x = e.x, y = e.y, d = e.d;
    var hits = [], path = [];
    var sx = e.side === 'left' ? 0 : e.side === 'right' ? W : x + 0.5;
    var sy = e.side === 'top' ? 0 : e.side === 'bottom' ? H : y + 0.5;
    path.push([sx, sy]);
    var seen = {};
    function hit(pi) {
      hits.push(pi);
      return pieces[pi].type === 'black';
    }
    function out(px, py, pd) {
      path.push([px + 0.5 + DX[pd] * 0.5, py + 0.5 + DY[pd] * 0.5]);
      return finish(exitLabel(px, py, pd), false);
    }
    function finish(exit, absorbed) {
      var codes = {};
      hits.forEach(function (pi) { var c = TYPES[pieces[pi].type].code; if ('RBYW'.indexOf(c) >= 0) codes[c] = 1; });
      var k = Object.keys(codes).sort().join('');
      return { entry: label, exit: exit, absorbed: absorbed, colorName: MIX[k], colorKey: k, hits: hits, path: path };
    }
    for (var step = 0; step < 1000; step++) {
      var st = x + ',' + y + ',' + d;
      if (seen[st]) return finish(null, true); // closed loop: treat as absorbed (should not happen)
      seen[st] = 1;
      var qin = (d + 2) % 4;
      var o = occ[idx(x, y, qin)];
      if (o !== -1) {
        // Axis-aligned face on the boundary we are crossing: bounce straight back.
        path.push([x + 0.5 + DX[qin] * 0.5, y + 0.5 + DY[qin] * 0.5]);
        if (hit(o)) return finish(null, true);
        d = qin;
        var nx = x + DX[d], ny = y + DY[d];
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) { path.push([x + 0.5 + DX[d] * 0.5, y + 0.5 + DY[d] * 0.5]); return finish(exitLabel(x, y, d), false); }
        x = nx; y = ny;
        continue;
      }
      var ot = occ[idx(x, y, d)];
      if (ot !== -1) {
        // Diagonal face through the cell centre: turn 90 degrees toward the free side.
        path.push([x + 0.5, y + 0.5]);
        if (hit(ot)) return finish(null, true);
        var l = (d + 3) % 4, r = (d + 1) % 4;
        var lf = occ[idx(x, y, l)] === -1, rf = occ[idx(x, y, r)] === -1;
        if (lf && !rf) d = l; else if (rf && !lf) d = r; else d = qin;
      }
      var nx2 = x + DX[d], ny2 = y + DY[d];
      if (nx2 < 0 || ny2 < 0 || nx2 >= W || ny2 >= H) return out(x, y, d);
      x = nx2; y = ny2;
    }
    return finish(null, true);
  }

  function cellLabel(x, y) { return ROWS[y] + (x + 1); }
  function whatAt(pieces, occ, x, y) {
    for (var q = 0; q < 4; q++) { var o = occ[idx(x, y, q)]; if (o !== -1) return pieces[o].type; }
    return null;
  }

  // Every gem must be the first thing some ray hits (not fully hidden from the edges).
  function allVisible(pieces, occ) {
    var vis = pieces.map(function () { return false; });
    ENTRIES.forEach(function (e) {
      var r = trace(pieces, occ, e.label);
      if (r.hits.length) vis[r.hits[0]] = true;
    });
    return vis.every(Boolean);
  }

  function shuffle(a, rnd) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function allPlacements(type) {
    var res = [];
    orientations(type).forEach(function (o, oi) {
      var s = size(o);
      for (var x = 0; x + s[0] <= W; x++) for (var y = 0; y + s[1] <= H; y++) res.push([oi, x, y]);
    });
    return res;
  }

  function generate(types, rnd) {
    rnd = rnd || Math.random;
    for (var attempt = 0; attempt < 500; attempt++) {
      var pieces = [], occ = emptyOcc(), ok = true;
      for (var t = 0; t < types.length; t++) {
        var opts = shuffle(allPlacements(types[t]), rnd), placed = false;
        for (var k = 0; k < opts.length; k++) {
          var p = place(types[t], opts[k][0], opts[k][1], opts[k][2]);
          if (compatible(occ, p, pieces.length)) {
            p.q.forEach(function (c) { occ[idx(c >> 5, (c >> 2) & 7, c & 3)] = pieces.length; });
            pieces.push(p); placed = true; break;
          }
        }
        if (!placed) { ok = false; break; }
      }
      if (ok && allVisible(pieces, occ)) return pieces;
    }
    throw new Error('Impossible de générer une mine');
  }

  // Compare a proposal with the solution: same gem types on exactly the same quarters.
  function sameLayout(sol, prop) {
    if (sol.length !== prop.length) return false;
    function sig(list) {
      return list.map(function (p) { return TYPES[p.type].code + ':' + p.q.slice().sort(function (a, b) { return a - b; }).join(','); }).sort().join('|');
    }
    return sig(sol) === sig(prop);
  }

  return {
    W: W, H: H, ROWS: ROWS, BOTTOM: BOTTOM, TYPES: TYPES, MIX: MIX, ENTRIES: ENTRIES,
    orientations: orientations, size: size, place: place, fits: fits, buildOcc: buildOcc,
    compatible: compatible, trace: trace, whatAt: whatAt, cellLabel: cellLabel,
    generate: generate, sameLayout: sameLayout, allVisible: allVisible
  };
})();
if (typeof module !== 'undefined') module.exports = Orapa;
