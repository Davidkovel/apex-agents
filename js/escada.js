// A ESCADA: the method as six floating gold steps (section .escada, a [data-cena] of scroll.js).
// The engine shows the texts ([data-beat]); this file draws the stairs once and, with the same inertia as the engine,
// moves the TEN FOLD mark up them, draws its trail (the growth line), lights each step it reaches and counts 1× → 10×.
// One rAF, no layout reads in it (the section box is measured on resize/load), DOM written only when a value changes.
(function () {
  var sec = document.querySelector(".escada");
  if (!sec) return;
  var NS = "http://www.w3.org/2000/svg";
  var svg = sec.querySelector(".escada__svg");
  var gGrelha = svg.querySelector("[data-grelha]"), gDegraus = svg.querySelector("[data-degraus]");
  var rasto = svg.querySelector("[data-rasto]"), rastoSombra = svg.querySelector("[data-rasto-sombra]");
  var alpinista = svg.querySelector("[data-alpinista]"), topoLuz = svg.querySelector("[data-topo-luz]");
  var vezes = sec.querySelector("[data-vezes]");
  var quieto = /[?&]quieto=1(&|$)/.test(location.search);   // read like scroll.js does: it may not have marked <html> yet

  // ---------- geometry (viewBox 1200 × 820) ----------
  // the phone gets a steeper, narrower staircase so it fills the screen instead of a thin strip
  var tel = matchMedia("(max-width: 760px)").matches;
  var BASE = 760, N = 6, X0 = tel ? 120 : 150, PASSO = tel ? 112 : 160, LARG = tel ? 104 : 150, SOBE = 100, FUNDO = tel ? 20 : 26, ALTO = 16, SALTO = 46;
  if (tel) svg.setAttribute("viewBox", "40 110 860 720");
  // the timeline: intro until .07, then each step owns .145 of the scene; the climb takes the first 45% of it
  var INICIO = 0.07, JANELA = 0.145, ANDA = 0.45, FIM = 0.94;

  function el(nome, at, pai) {
    var e = document.createElementNS(NS, nome);
    for (var k in at) e.setAttribute(k, at[k]);
    if (pai) pai.appendChild(e);
    return e;
  }

  // the chart behind: 1× at the floor, 10× at the top step
  var yTopo = BASE - N * SOBE;
  for (var v = 1; v <= 10; v++) {
    var y = BASE - ((v - 1) / 9) * (BASE - yTopo);
    el("line", { x1: 92, x2: tel ? 900 : 1150, y1: y, y2: y, class: "escada__linha" + (v === 1 || v === 10 ? " escada__linha--forte" : "") }, gGrelha);
    var t = el("text", { x: 76, y: y + 5, class: "escada__eixo" }, gGrelha);
    t.textContent = v + "×";
  }

  // the steps: a gold bar down to the floor (the chart), the slab (front + top, dark until reached) and its number
  var degraus = [], pts = [{ x: 96, y: BASE }];
  for (var i = 0; i < N; i++) {
    var x = X0 + i * PASSO, yt = BASE - (i + 1) * SOBE;
    var g = el("g", { class: "escada__degrau" }, gDegraus);
    el("rect", { x: x + 10, y: yt + ALTO, width: LARG - 20, height: BASE - yt - ALTO, fill: "url(#es-barra)", class: "escada__barra" }, g);
    var topo = (x) + "," + yt + " " + (x + LARG) + "," + yt + " " + (x + LARG + FUNDO) + "," + (yt - ALTO) + " " + (x + FUNDO) + "," + (yt - ALTO);
    el("polygon", { points: topo, fill: "url(#es-apagado)", class: "escada__tampo" }, g);
    el("polygon", { points: topo, fill: "url(#es-ouro)", class: "escada__tampo-ouro" }, g);
    el("rect", { x: x, y: yt, width: LARG, height: ALTO, fill: "url(#es-frente)", class: "escada__frente" }, g);
    el("line", { x1: x, y1: yt + .5, x2: x + LARG, y2: yt + .5, class: "escada__aresta" }, g);
    var n = el("text", { x: x + LARG / 2, y: yt + ALTO + 34, class: "escada__num" }, g);
    n.textContent = "0" + (i + 1);
    degraus.push(g);
    pts.push({ x: x + LARG / 2 + FUNDO / 2, y: yt - ALTO / 2 - 1 });
  }

  // the trail: straight segments from step to step (a growth line); dashes reveal it as far as the climber has gone
  var d = "M" + pts[0].x + " " + pts[0].y, cum = [0];
  for (var j = 1; j < pts.length; j++) {
    d += " L" + pts[j].x + " " + pts[j].y;
    cum.push(cum[j - 1] + Math.hypot(pts[j].x - pts[j - 1].x, pts[j].y - pts[j - 1].y));
  }
  var TOTAL = cum[cum.length - 1];
  [rasto, rastoSombra].forEach(function (r) { r.setAttribute("d", d); r.style.strokeDasharray = TOTAL + " " + TOTAL; r.style.strokeDashoffset = TOTAL; });

  // the light at the top: two rings that open when the climber arrives
  var cTopo = pts[pts.length - 1];
  el("circle", { cx: cTopo.x, cy: cTopo.y - 20, r: 40, class: "escada__anel" }, topoLuz);
  el("circle", { cx: cTopo.x, cy: cTopo.y - 20, r: 40, class: "escada__anel escada__anel--b" }, topoLuz);

  // ---------- the climb ----------
  var suave = function (k) { return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
  function onde(p) {                                   // p (0..1 of the scene) → position on the stairs (0..6)
    if (p <= INICIO) return 0;
    var k = Math.min(N - 1, Math.floor((p - INICIO) / JANELA));
    var t = ((p - INICIO) - k * JANELA) / (JANELA * ANDA);
    return k + suave(Math.max(0, Math.min(1, t)));
  }

  var top = 0, alt = 1, vh = innerHeight;
  function mede() {
    var r = sec.getBoundingClientRect();
    top = r.top + scrollY; alt = sec.offsetHeight; vh = innerHeight;
  }
  mede();
  addEventListener("resize", mede, { passive: true });
  addEventListener("load", mede);
  if (window.ResizeObserver) new ResizeObserver(mede).observe(document.body);

  var ps = -1, ant = { pos: -1, aceso: -1, vezes: "", topo: null };
  function desenha(p) {
    var pos = onde(p);
    if (Math.abs(pos - ant.pos) > 0.0004) {
      ant.pos = pos;
      var k = Math.min(N - 1, Math.floor(pos)), t = pos - k;
      if (pos >= N) { k = N - 1; t = 1; }
      var a = pts[k], b = pts[k + 1];
      var x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t - Math.sin(Math.PI * t) * SALTO;
      alpinista.setAttribute("transform", "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ")");
      var feito = cum[k] + (cum[k + 1] - cum[k]) * t;
      var off = (TOTAL - feito).toFixed(1);
      rasto.style.strokeDashoffset = off; rastoSombra.style.strokeDashoffset = off;
      var s = String(Math.round(1 + 9 * pos / N));
      if (s !== ant.vezes) { ant.vezes = s; vezes.textContent = s; }
    }
    var acesos = Math.floor(pos + 0.02);
    if (acesos !== ant.aceso) {
      ant.aceso = acesos;
      for (var i = 0; i < N; i++) degraus[i].classList.toggle("aceso", i < acesos);
    }
    var noTopo = p >= FIM - 0.01;
    if (noTopo !== ant.topo) { ant.topo = noTopo; svg.classList.toggle("no-topo", noTopo); }
  }

  if (quieto) { desenha(1); return; }

  var tAnt = 0;
  function quadro(tm) {
    requestAnimationFrame(quadro);
    var dt = tAnt ? Math.min(100, tm - tAnt) : 16.67; tAnt = tm;
    var y = window.AMG_SCROLL ? window.AMG_SCROLL.ecra.y : scrollY;
    if (y + vh < top - vh * 0.5 || y > top + alt + vh * 0.5) return;   // far from the stairs: nothing to do
    var p = Math.max(0, Math.min(1, (y - top) / Math.max(1, alt - vh)));
    if (ps < 0) ps = p;
    else { ps += (p - ps) * (1 - Math.pow(1 - 0.14, dt / 16.67)); if (Math.abs(p - ps) < 0.0003) ps = p; }   // same weight as the engine
    desenha(ps);
  }
  desenha(0);
  requestAnimationFrame(quadro);
})();
