/* BioInfoX matter: one cloud of 1,656 points that takes the shape of real structures.
   States: adenylate kinase (12 frames of its open-to-closed transition), a thiolate-protected
   gold nanoparticle, B-DNA, a target network, a DPPC vesicle and the BioInfoX node mark. */
(function () {
  'use strict';
  var NAMES = ['protein', 'gold', 'dna', 'network', 'vesicle', 'mark'];
  var PALETTE = [[0.93, 0.94, 0.95], [0.94, 0.11, 0.2], [1.0, 0.78, 0.17], [0.54, 0.57, 0.61]];
  var BG = [0.082, 0.086, 0.106];
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dataPromise = null;

  function load(url) {
    if (dataPromise) return dataPromise;
    dataPromise = fetch(url).then(function (r) {
      if (!r.ok) throw new Error('matter data ' + r.status);
      return r.arrayBuffer();
    }).then(parse);
    return dataPromise;
  }

  function parse(buf) {
    var dv = new DataView(buf);
    var N = dv.getUint32(4, true), S = dv.getUint32(8, true), F = dv.getUint32(12, true);
    var off = 16, pos = [], col = [], edges = [];
    for (var s = 0; s < S; s++) {
      var q = new Int16Array(buf.slice(off, off + N * 6)); off += N * 6;
      var p = new Float32Array(N * 3);
      for (var i = 0; i < N * 3; i++) p[i] = q[i] / 8000;
      pos.push(p);
      col.push(new Uint8Array(buf.slice(off, off + N))); off += N;
    }
    for (s = 0; s < S; s++) {
      var E = dv.getUint32(off, true); off += 4;
      edges.push(new Uint16Array(buf.slice(off, off + E * 4))); off += E * 4;
    }
    return { N: N, F: F, pos: pos, col: col, edges: edges };
  }

  var VS = [
    'attribute vec3 aPos; attribute vec3 aCol; attribute float aSeed;',
    'uniform float uTime, uScale, uAspect, uSize, uJitter, uViewH;',
    'uniform mat3 uRot; uniform vec2 uOffset, uMouse; uniform float uRepel;',
    'varying vec3 vCol; varying float vFog;',
    'void main(){',
    '  vec3 p = aPos;',
    '  p += uJitter * vec3(sin(uTime*3.1+aSeed*13.0), sin(uTime*2.7+aSeed*7.0), cos(uTime*3.3+aSeed*5.0));',
    '  p = uRot * (p * uScale);',
    '  float w = 3.4 - p.z;',
    '  vec2 s = p.xy * (2.6 / w);',
    '  s.x /= uAspect;',
    '  s += uOffset;',
    '  vec2 d = vec2((s.x - uMouse.x) * uAspect, s.y - uMouse.y);',
    '  float l = length(d);',
    '  s += uRepel * normalize(d + 1e-5) * smoothstep(0.28, 0.0, l) * 0.09 * vec2(1.0/uAspect, 1.0);',
    '  gl_Position = vec4(s, -p.z * 0.25, 1.0);',
    '  gl_PointSize = uSize * uViewH * (2.6 / w) / 1000.0;',
    '  vCol = aCol;',
    '  vFog = clamp((p.z + 1.2) / 2.4, 0.0, 1.0);',
    '}'
  ].join('\n');
  var FS = [
    'precision mediump float;',
    'varying vec3 vCol; varying float vFog; uniform vec3 uBg;',
    'void main(){',
    '  vec2 c = gl_PointCoord * 2.0 - 1.0; c.y = -c.y;',
    '  float r2 = dot(c, c); if (r2 > 1.0) discard;',
    '  vec3 n = vec3(c, sqrt(1.0 - r2));',
    '  float diff = max(dot(n, normalize(vec3(-0.45, 0.6, 0.75))), 0.0);',
    '  float spec = pow(max(dot(n, normalize(vec3(-0.2, 0.35, 1.0))), 0.0), 28.0);',
    '  float rim = pow(1.0 - n.z, 2.5);',
    '  vec3 col = vCol * (0.22 + 0.85 * diff) + spec * 0.35 + rim * vec3(0.94,0.11,0.2) * 0.25;',
    '  col = mix(uBg, col, 0.25 + 0.75 * vFog);',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');
  var LVS = [
    'attribute vec3 aPos; attribute vec3 aCol; attribute float aSeed;',
    'uniform float uTime, uScale, uAspect, uJitter;',
    'uniform mat3 uRot; uniform vec2 uOffset, uMouse; uniform float uRepel;',
    'varying float vFog;',
    'void main(){',
    '  vec3 p = aPos;',
    '  p += uJitter * vec3(sin(uTime*3.1+aSeed*13.0), sin(uTime*2.7+aSeed*7.0), cos(uTime*3.3+aSeed*5.0));',
    '  p = uRot * (p * uScale);',
    '  float w = 3.4 - p.z; vec2 s = p.xy * (2.6 / w); s.x /= uAspect; s += uOffset;',
    '  vec2 d = vec2((s.x - uMouse.x) * uAspect, s.y - uMouse.y); float l = length(d);',
    '  s += uRepel * normalize(d + 1e-5) * smoothstep(0.28, 0.0, l) * 0.09 * vec2(1.0/uAspect, 1.0);',
    '  gl_Position = vec4(s, -p.z * 0.25 + 0.002, 1.0);',
    '  vFog = clamp((p.z + 1.2) / 2.4, 0.0, 1.0);',
    '}'
  ].join('\n');
  var LFS = 'precision mediump float; varying float vFog; uniform float uAlpha; void main(){ gl_FragColor = vec4(0.62,0.65,0.7, uAlpha * (0.2 + 0.8 * vFog)); }';

  function compile(gl, vs, fs) {
    function sh(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    }
    var p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'aPos'); gl.bindAttribLocation(p, 1, 'aCol'); gl.bindAttribLocation(p, 2, 'aSeed');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    var u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) { var name = gl.getActiveUniform(p, i).name; u[name] = gl.getUniformLocation(p, name); }
    return { p: p, u: u };
  }

  function rotMat(rx, ry) {
    var cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
    return new Float32Array([cy, sx * sy, -cx * sy, 0, cx, sx, sy, -sx * cy, cx * cy]);
  }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

  /* opts: canvas, url, chapters (NodeList with data-matter, data-mx, data-my, data-ms) or state, onReady */
  function Scene(opts) {
    var canvas = opts.canvas;
    var gl = canvas.getContext('webgl', { antialias: true, alpha: false, powerPreference: 'high-performance' });
    if (!gl) { document.documentElement.classList.add('no-gl'); return; }
    var self = this, D, N, seeds, delay, scatter, posBuf, colBuf, seedBuf, edgeBufs = [], pos, colr;
    var prog, lprog, visible = true, running = false, t0 = performance.now();
    var mouse = [9, 9], mouseT = [9, 9], rot = [0, 0], rotT = [0, 0];
    var cur = { a: 0, b: 0, t: 0, mx: 0, my: 0, ms: 1, spin: 1 }, smooth = null;
    var chapters = opts.chapters ? Array.prototype.slice.call(opts.chapters) : null;

    function stateIndex(name) {
      var k = NAMES.indexOf(name); return k < 0 ? 0 : k;   // 0 = protein trajectory
    }
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = canvas.clientWidth, h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr)); canvas.height = Math.max(1, Math.round(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function target() {
      if (!chapters) {
        var c = opts.config || {};
        return { a: stateIndex(opts.state), b: stateIndex(opts.state), t: 0, mx: c.mx || 0, my: c.my || 0, ms: c.ms || 1 };
      }
      var vh = window.innerHeight, y = window.scrollY, anchors = chapters.map(function (el) {
        var r = el.getBoundingClientRect(); return r.top + y + r.height / 2 - vh / 2;
      });
      var k = 0;
      while (k < anchors.length - 1 && y >= anchors[k + 1]) k++;
      var a = chapters[k], b = chapters[Math.min(k + 1, chapters.length - 1)];
      var span = anchors[Math.min(k + 1, anchors.length - 1)] - anchors[k];
      var t = span > 0 ? clamp(((y - anchors[k]) / span - 0.3) / 0.5) : 0;
      if (y < anchors[0]) t = 0;
      function num(el, key, d) { var v = parseFloat(el.getAttribute('data-' + key)); return isNaN(v) ? d : v; }
      var e = ease(t);
      return {
        a: stateIndex(a.getAttribute('data-matter')), b: stateIndex(b.getAttribute('data-matter')), t: t,
        mx: num(a, 'mx', 0) + (num(b, 'mx', 0) - num(a, 'mx', 0)) * e,
        my: num(a, 'my', 0) + (num(b, 'my', 0) - num(a, 'my', 0)) * e,
        ms: num(a, 'ms', 1) + (num(b, 'ms', 1) - num(a, 'ms', 1)) * e
      };
    }

    function shape(stateIdx, time, out) {
      if (stateIdx === 0) {                    // protein: walk the real trajectory back and forth
        var F = D.F, f = reduce ? 0 : (Math.sin(time * 0.32 - Math.PI / 2) + 1) / 2 * (F - 1);
        var i0 = Math.floor(f), i1 = Math.min(i0 + 1, F - 1), w = f - i0;
        var A = D.pos[i0], B = D.pos[i1];
        for (var i = 0; i < N * 3; i++) out[i] = A[i] + (B[i] - A[i]) * w;
        return D.col[0];
      }
      var s = D.F - 1 + stateIdx, P = D.pos[s];
      out.set(P);
      return D.col[s];
    }

    var bufA, bufB;
    function frame(now) {
      if (!running) return;
      requestAnimationFrame(frame);
      if (!visible) return;
      var time = (now - t0) / 1000;
      var tg = target();
      if (!smooth) smooth = tg;
      var k = reduce ? 1 : 0.075;
      if (tg.a !== smooth.a || tg.b !== smooth.b) { smooth.a = tg.a; smooth.b = tg.b; smooth.t = tg.t; }
      smooth.t += (tg.t - smooth.t) * k * 1.4;
      smooth.mx += (tg.mx - smooth.mx) * k; smooth.my += (tg.my - smooth.my) * k; smooth.ms += (tg.ms - smooth.ms) * k;
      var ca = shape(smooth.a, time, bufA), cb = smooth.a === smooth.b ? ca : shape(smooth.b, time, bufB);
      var T = smooth.t;
      for (var i = 0; i < N; i++) {
        var ti = smooth.a === smooth.b ? 0 : ease(clamp(T * 1.5 - delay[i] * 0.5));
        var sc = Math.sin(ti * Math.PI) * 0.55;
        var j = i * 3, src = smooth.a === smooth.b ? bufA : null;
        for (var c = 0; c < 3; c++) {
          var a = bufA[j + c], b = src ? a : bufB[j + c];
          pos[j + c] = a + (b - a) * ti + scatter[j + c] * sc;
          var pa = PALETTE[ca[i]][c], pb = PALETTE[cb[i]][c];
          colr[j + c] = pa + (pb - pa) * ti;
        }
      }
      mouse[0] += (mouseT[0] - mouse[0]) * 0.12; mouse[1] += (mouseT[1] - mouse[1]) * 0.12;
      rot[0] += (rotT[0] - rot[0]) * 0.05; rot[1] += (rotT[1] - rot[1]) * 0.05;
      var markW = (smooth.a === 5 ? 1 - ease(T) : 0) + (smooth.b === 5 ? ease(T) : 0);
      if (smooth.a === smooth.b) markW = smooth.a === 5 ? 1 : 0;
      var spin = reduce ? 0 : time * 0.16 * (1 - markW);
      var wobble = markW * Math.sin(time * 0.5) * 0.18;
      var R = rotMat(rot[1] * 0.35 + 0.18 * (1 - markW), spin + wobble + rot[0] * 0.6);

      gl.clearColor(BG[0], BG[1], BG[2], 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf); gl.bufferSubData(gl.ARRAY_BUFFER, 0, pos);
      gl.bindBuffer(gl.ARRAY_BUFFER, colBuf); gl.bufferSubData(gl.ARRAY_BUFFER, 0, colr);
      var aspect = canvas.width / canvas.height;
      var narrow = aspect < 0.9;
      var scale = narrow ? Math.min(0.9, smooth.ms * 1.12 * aspect) : smooth.ms * 0.9;
      var off = narrow ? [0, opts.chapters ? 0.44 : 0.3] : [smooth.mx, smooth.my];
      function common(pr) {
        gl.useProgram(pr.p);
        gl.uniform1f(pr.u.uTime, time); gl.uniform1f(pr.u.uScale, scale); gl.uniform1f(pr.u.uAspect, aspect);
        gl.uniform1f(pr.u.uJitter, reduce ? 0 : 0.0045 + (1 - markW) * 0.003);
        gl.uniformMatrix3fv(pr.u.uRot, false, R); gl.uniform2f(pr.u.uOffset, off[0], off[1]);
        gl.uniform2f(pr.u.uMouse, mouse[0], mouse[1]); gl.uniform1f(pr.u.uRepel, reduce ? 0 : 1);
      }
      // bonds and links
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false);
      common(lprog);
      var la = smooth.a === smooth.b ? 1 : Math.pow(1 - ease(T), 4), lb = smooth.a === smooth.b ? 0 : Math.pow(ease(T), 4);
      [[smooth.a, la], [smooth.b, lb]].forEach(function (pair) {
        var e = edgeBufs[pair[0]]; if (!e || !e.n || pair[1] < 0.01) return;
        gl.uniform1f(lprog.u.uAlpha, pair[1] * (pair[0] === 0 ? 0.32 : 0.5));
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, e.b); gl.drawElements(gl.LINES, e.n, gl.UNSIGNED_SHORT, 0);
      });
      gl.disable(gl.BLEND); gl.depthMask(true);
      common(prog);
      gl.uniform3f(prog.u.uBg, BG[0], BG[1], BG[2]);
      gl.uniform1f(prog.u.uViewH, canvas.height);
      gl.uniform1f(prog.u.uSize, (opts.size || 26) * scale * (smooth.a === 3 || smooth.b === 3 ? 0.85 : 1));
      gl.drawArrays(gl.POINTS, 0, N);
      if (!self.ready) { self.ready = true; if (opts.onReady) opts.onReady(); }
    }

    load(opts.url).then(function (d) {
      D = d; N = d.N;
      try { prog = compile(gl, VS, FS); lprog = compile(gl, LVS, LFS); }
      catch (err) { document.documentElement.classList.add('no-gl'); return; }
      pos = new Float32Array(N * 3); colr = new Float32Array(N * 3);
      bufA = new Float32Array(N * 3); bufB = new Float32Array(N * 3);
      seeds = new Float32Array(N); delay = new Float32Array(N); scatter = new Float32Array(N * 3);
      for (var i = 0; i < N; i++) {
        seeds[i] = Math.random(); delay[i] = Math.random();
        var x = Math.random() * 2 - 1, y = Math.random() * 2 - 1, z = Math.random() * 2 - 1, l = Math.sqrt(x * x + y * y + z * z) || 1;
        var m = 0.4 + Math.random() * 0.6;
        scatter[i * 3] = x / l * m; scatter[i * 3 + 1] = y / l * m; scatter[i * 3 + 2] = z / l * m;
      }
      posBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, posBuf); gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(0);
      colBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, colBuf); gl.bufferData(gl.ARRAY_BUFFER, colr, gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(1);
      seedBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, seedBuf); gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
      gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(2);
      for (var s = 0; s < NAMES.length; s++) {
        var e = d.edges[s === 0 ? 0 : d.F - 1 + s];
        var b = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, e, gl.STATIC_DRAW);
        edgeBufs.push({ b: b, n: e.length });
      }
      gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
      resize();
      running = true; requestAnimationFrame(frame);
    }).catch(function () { document.documentElement.classList.add('no-gl'); });

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var r = canvas.getBoundingClientRect();
      mouseT[0] = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouseT[1] = -(((e.clientY - r.top) / r.height) * 2 - 1);
      rotT[0] = (e.clientX / window.innerWidth) * 2 - 1;
      rotT[1] = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
    document.addEventListener('mouseleave', function () { mouseT = [9, 9]; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(canvas);
    }
  }

  window.BioMatter = {
    mount: function (canvas, opts) { opts = opts || {}; opts.canvas = canvas; return new Scene(opts); }
  };
})();
