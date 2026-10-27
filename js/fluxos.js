// Workflows drawn like an n8n canvas: automation use cases on projects.html, our process on index.html.
// Pick a tab, press Run: every node lights up in turn and shows what it produced.
// The outputs are sample data; the steps are the ones we really go through.
(function () {
  var CONJUNTOS = {};
  CONJUNTOS.automacao = [
    { id: 'assistente', aba: 'AI assistant', titulo: 'Reply to every client in seconds',
      nos: [
        { i: '💬', nome: 'New message', app: 'Telegram · WhatsApp · Instagram', saida: '“Do you have it in size M?”', gatilho: true },
        { i: '✦', nome: 'Understand the question', app: 'AI', saida: 'Intent: size and price' },
        { i: '▦', nome: 'Check stock', app: 'Shopify', saida: 'Size M: 3 in stock, €48' },
        { i: '↩', nome: 'Reply to the client', app: 'Same chat', saida: 'Sent in 4 sec, 03:12 at night' },
        { i: '☑', nome: 'Hot lead to CRM', app: 'CRM + Telegram', saida: 'Task for the manager, call at 10:00' }
      ],
      ganho: '≈ €450 a month back', conta: '30 messages a day × 3 min = 45 hours a month at €10/h' },
    { id: 'conteudo', aba: 'Content', titulo: 'Posts and videos every week, without you',
      nos: [
        { i: '⏱', nome: 'Every Monday 9:00', app: 'Schedule', saida: 'Week 44 started', gatilho: true },
        { i: '✦', nome: 'Ideas from your products', app: 'AI', saida: '7 post ideas in your tone' },
        { i: '▶', nome: 'Video from your photos', app: 'Video render', saida: '3 short videos, 9:16' },
        { i: '✎', nome: 'Captions and hashtags', app: 'AI', saida: '7 captions written' },
        { i: '⇪', nome: 'Post on schedule', app: 'VK · TikTok · Reels', saida: '7 posts queued for the week' }
      ],
      ganho: '≈ €300 a month back', conta: '30 posts a month × 1 hour each = 30 hours at €10/h' },
    { id: 'lucro', aba: 'Profit report', titulo: 'Know your profit every morning',
      nos: [
        { i: '⏱', nome: 'Every day 9:00', app: 'Schedule', saida: 'Report for yesterday', gatilho: true },
        { i: '🛒', nome: 'Orders', app: 'Shopify', saida: '42 orders, €3,180' },
        { i: '▦', nome: 'Costs', app: 'Excel · Google Sheets', saida: 'Cost of goods €1,620' },
        { i: '◎', nome: 'Ad spend', app: 'Meta Ads', saida: 'Spend €720, 1 ad losing' },
        { i: 'Σ', nome: 'Profit per product', app: 'Calculation', saida: 'Profit +€840, best item +€310' },
        { i: '✈', nome: 'Message to you', app: 'Telegram', saida: '“Yesterday +€840. Turn off ad B”' }
      ],
      ganho: '≈ €120 saved on every bad ad', conta: 'An ad losing €20 a day, stopped on day 1 instead of day 7' },
    { id: 'ads', aba: 'Ads guard', titulo: 'Switch off ads that lose money',
      nos: [
        { i: '⏱', nome: 'Every hour', app: 'Schedule', saida: 'Checking 12 ads', gatilho: true },
        { i: '◎', nome: 'Ad results', app: 'Meta Ads', saida: 'Spend and sales per ad' },
        { i: '⑂', nome: 'Losing for 24 h?', app: 'Rule', saida: 'Ad B: spent €38, sold €0' },
        { i: '⏸', nome: 'Pause the ad', app: 'Meta Ads', saida: 'Ad B paused' },
        { i: '✈', nome: 'Tell you why', app: 'Telegram', saida: '“Paused ad B: €38, 0 sales”' }
      ],
      ganho: '≈ €400 a month kept', conta: '2 losing ads a month caught 10 days earlier at €20 a day' },
    { id: 'crm', aba: 'Leads → CRM', titulo: 'No request gets forgotten',
      nos: [
        { i: '✉', nome: 'New request', app: 'Site form · chat', saida: 'Ana, wants a website', gatilho: true },
        { i: '✦', nome: 'Sort the request', app: 'AI', saida: 'Website, budget €2–3k, urgent' },
        { i: '☑', nome: 'Task with an owner', app: 'CRM', saida: 'Owner: Marco, due today 15:00' },
        { i: '⑂', nome: 'Untouched for 2 h?', app: 'Rule', saida: 'Yes, nobody replied' },
        { i: '🔔', nome: 'Remind the team', app: 'Phone push', saida: 'Marco called Ana at 14:20' }
      ],
      ganho: '≈ €800 a month kept', conta: '1 forgotten request a week × a €200 order', prova: '#hub-empresa' }
  ];
  CONJUNTOS.processo = [
    { id: 'processo', titulo: 'From your first message to a site that brings clients',
      nos: [
        { i: '✉', nome: 'Your message', app: 'Telegram · form · call', saida: 'We reply within 2 hours', gatilho: true },
        { i: '✎', nome: 'Brief & plan', app: '30-min call', saida: 'Goals, pages, budget and dates on one page' },
        { i: '☺', nome: 'One person in charge', app: 'Your manager', saida: 'One contact from start to finish' },
        { i: '▢', nome: 'Prototype early', app: 'Clickable design', saida: 'You see the site before it is built' },
        { i: '⇪', nome: 'Launch', app: 'Your domain', saida: 'Fast on every device, found on Google' },
        { i: '↗', nome: 'Grow', app: 'Ads · SEO · automation', saida: 'Requests, measured in money' }
      ],
      ganho: 'One team, one manager, one channel', conta: 'Design, build, launch and ads in one place', semNota: true,
      cta: 'Start with a free brief', ctaHref: '#contacto' }
  ];

  document.querySelectorAll('[data-fluxos]').forEach(function (raiz) {
    var lista = CONJUNTOS[raiz.getAttribute('data-fluxos')];
    if (lista) iniciar(raiz, lista);
  });

  function iniciar(raiz, FLUXOS) {

  var abas = raiz.querySelector('[data-abas]');
  var nos = raiz.querySelector('[data-nos]');
  var titulo = raiz.querySelector('[data-titulo]');
  var estado = raiz.querySelector('[data-estado]');
  var correr = raiz.querySelector('[data-correr]');
  var ganho = raiz.querySelector('[data-ganho]');
  var acoes = raiz.querySelector('[data-acoes]');
  var atual = FLUXOS[0];
  var relogios = [];

  if (FLUXOS.length < 2) abas.hidden = true;
  abas.innerHTML = FLUXOS.map(function (f, k) {
    return '<button type="button" role="tab" data-aba="' + k + '" aria-selected="' + (k === 0) + '">' + f.aba + '</button>';
  }).join('');

  function parar() {
    relogios.forEach(clearTimeout);
    relogios = [];
  }

  function desenhar(f) {
    parar();
    atual = f;
    titulo.textContent = f.titulo;
    estado.textContent = 'Ready';
    estado.className = 'fx__estado';
    correr.disabled = false;
    nos.innerHTML = f.nos.map(function (n) {
      return '<li class="no' + (n.gatilho ? ' no--gatilho' : '') + '">' +
        '<span class="no__caixa" aria-hidden="true">' + n.i + '</span>' +
        '<span class="no__nome">' + n.nome + '</span>' +
        '<span class="no__app">' + n.app + '</span>' +
        '<span class="no__saida">' + n.saida + '</span></li>';
    }).join('');
    ganho.innerHTML = f.ganho + '<small>' + f.conta + (f.semNota ? '' : ' · worked example') + '</small>';
    acoes.innerHTML = '<a class="botao" href="' + (f.ctaHref || 'index.html#contacto') + '">' + (f.cta || 'I want this flow') + '</a>' +
      (f.prova ? '<a class="botao botao--vazio" href="' + f.prova + '">See it in our CRM</a>' : '');
  }

  function executar() {
    parar();
    var itens = nos.querySelectorAll('.no');
    itens.forEach(function (li) { li.classList.remove('corre', 'feito'); });
    correr.disabled = true;
    estado.textContent = 'Running…';
    estado.className = 'fx__estado';
    var passo = 900;
    itens.forEach(function (li, k) {
      relogios.push(setTimeout(function () { li.classList.add('corre'); }, k * passo));
      relogios.push(setTimeout(function () { li.classList.remove('corre'); li.classList.add('feito'); }, k * passo + passo * .7));
    });
    relogios.push(setTimeout(function () {
      estado.textContent = '✓ Done in ' + (1 + Math.round(itens.length * .6)) + ' sec';
      estado.className = 'fx__estado ok';
      correr.disabled = false;
    }, itens.length * passo));
  }

  abas.addEventListener('click', function (e) {
    var b = e.target.closest('[data-aba]');
    if (!b) return;
    abas.querySelectorAll('[data-aba]').forEach(function (x) { x.setAttribute('aria-selected', x === b); });
    desenhar(FLUXOS[+b.getAttribute('data-aba')]);
    executar();
  });
  correr.addEventListener('click', executar);

  desenhar(atual);
  // first run starts by itself when the canvas comes into view
  var io = new IntersectionObserver(function (es) {
    if (es[0].isIntersecting) { executar(); io.disconnect(); }
  }, { threshold: .4 });
  io.observe(nos);
  }
})();
