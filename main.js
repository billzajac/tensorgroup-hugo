/* ============================================================
   Tensor Group — main.js
   1) Hero "tensor" canvas: a slowly rotating wireframe cube with
      orange force-vectors + drifting particle field.
   2) Scroll reveal (IntersectionObserver).
   3) Nav condense on scroll.
   All animation is disabled under prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 2) Scroll reveal ---------- */
  (function scrollReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- 3) Nav condense ---------- */
  (function navCondense() {
    var nav = document.getElementById("nav");
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle("nav--scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  })();

  /* ---------- 1) Hero tensor canvas ---------- */
  (function heroTensor() {
    if (reduceMotion) return;
    var canvas = document.getElementById("hero-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var ACCENT = "245,147,30";   // orange rgb
    var LINE = "255,255,255";    // wireframe rgb
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;
    var particles = [];
    var running = true;
    var rafId = null;
    var t = 0;

    // Unit cube vertices centered at origin
    var CUBE = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]
    ];
    var EDGES = [
      [0,1],[1,2],[2,3],[3,0],
      [4,5],[5,6],[6,7],[7,4],
      [0,4],[1,5],[2,6],[3,7]
    ];
    // Axis force-vectors (from origin)
    var AXES = [[1.9,0,0],[0,-1.9,0],[0,0,1.9]];

    function rotate(p, ax, ay) {
      var cx = Math.cos(ax), sx = Math.sin(ax);
      var cy = Math.cos(ay), sy = Math.sin(ay);
      var x = p[0], y = p[1], z = p[2];
      // rotate Y
      var x1 = x * cy - z * sy, z1 = x * sy + z * cy;
      // rotate X
      var y2 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
      return [x1, y2, z2];
    }

    function project(p, cxp, cyp, scale) {
      var persp = 3.2 / (3.2 + p[2]); // simple perspective
      return [cxp + p[0] * scale * persp, cyp + p[1] * scale * persp, persp];
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    }

    function buildParticles() {
      var count = Math.max(18, Math.min(46, Math.round((W * H) / 34000)));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: rand(0, W), y: rand(0, H),
          vx: rand(-0.12, 0.12), vy: rand(-0.12, 0.12),
          r: rand(0.6, 1.8),
          o: rand(0.15, 0.5),
          accent: Math.random() < 0.28
        });
      }
    }
    function rand(a, b) { return a + Math.random() * (b - a); }

    function drawArrow(x1, y1, x2, y2, rgb, alpha, width) {
      ctx.strokeStyle = "rgba(" + rgb + "," + alpha + ")";
      ctx.fillStyle = "rgba(" + rgb + "," + alpha + ")";
      ctx.lineWidth = width;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      var ang = Math.atan2(y2 - y1, x2 - x1), hl = 7;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - hl * Math.cos(ang - 0.4), y2 - hl * Math.sin(ang - 0.4));
      ctx.lineTo(x2 - hl * Math.cos(ang + 0.4), y2 - hl * Math.sin(ang + 0.4));
      ctx.closePath(); ctx.fill();
    }

    function frame() {
      if (!running) return;
      t += 0.0032;
      ctx.clearRect(0, 0, W, H);

      // --- particle field + faint network ---
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 12000) {
            var a = (1 - d2 / 12000) * 0.10;
            ctx.strokeStyle = "rgba(" + LINE + "," + a + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(" + (p.accent ? ACCENT : LINE) + "," + p.o + ")";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }

      // --- rotating tensor cube (upper-right, responsive placement) ---
      var scale = Math.min(W, H) * (W < 720 ? 0.16 : 0.15);
      var cxp = W > 720 ? W * 0.74 : W * 0.5;
      var cyp = W > 720 ? H * 0.42 : H * 0.32;
      var ax = t * 0.6, ay = t;

      var pts = CUBE.map(function (v) { return project(rotate(v, ax, ay), cxp, cyp, scale); });
      // edges
      ctx.lineWidth = 1;
      for (var e = 0; e < EDGES.length; e++) {
        var a1 = pts[EDGES[e][0]], b1 = pts[EDGES[e][1]];
        var depth = (a1[2] + b1[2]) / 2;
        ctx.strokeStyle = "rgba(" + LINE + "," + (0.10 + depth * 0.10).toFixed(3) + ")";
        ctx.beginPath(); ctx.moveTo(a1[0], a1[1]); ctx.lineTo(b1[0], b1[1]); ctx.stroke();
      }
      // vertices
      for (var vi = 0; vi < pts.length; vi++) {
        ctx.fillStyle = "rgba(" + LINE + ",0.35)";
        ctx.beginPath(); ctx.arc(pts[vi][0], pts[vi][1], 1.6, 0, Math.PI * 2); ctx.fill();
      }
      // orange force-vectors from center
      var origin = project(rotate([0,0,0], ax, ay), cxp, cyp, scale);
      for (var k = 0; k < AXES.length; k++) {
        var tip = project(rotate(AXES[k], ax, ay), cxp, cyp, scale);
        drawArrow(origin[0], origin[1], tip[0], tip[1], ACCENT, 0.55, 1.6);
      }

      rafId = requestAnimationFrame(frame);
    }

    function start() { if (!running) { running = true; rafId = requestAnimationFrame(frame); } }
    function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = null; }

    // pause when tab hidden
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });
    // pause when hero scrolled out of view
    if ("IntersectionObserver" in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { en.isIntersecting ? start() : stop(); });
      }, { threshold: 0.01 });
      vio.observe(canvas);
    }

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    resize();
    rafId = requestAnimationFrame(frame);
  })();
})();
