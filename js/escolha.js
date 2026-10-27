// Automation picker: the visitor answers two questions, we show the one automation to start with.
// How the best one is chosen: it must hit the biggest time leak (x3), fit the business (x2),
// a version already running counts +1, and on a tie the one that launches sooner wins.
// "real" = we run it today or built it for a client; everything else is honestly marked "built for you".
(function () {
  var raiz = document.querySelector('[data-escolha]');
  if (!raiz) return;

  var AUTOS = [
    { id: 'assistente', fluxo: ['Telegram · WhatsApp · Instagram · VK','AI answers and books','Hot lead to you'], nome: 'AI assistant that answers your clients', faz: 'Replies in Telegram, WhatsApp, Instagram and VK day and night, sends prices, books calls and hands a hot client to a person.',
      semana: ['Answers the 20 questions you get every day', 'Books calls into your calendar', 'Sends you each hot lead in Telegram'],
      tipos: ['loja', 'servicos', 'equipa'], dores: { respostas: 3, clientes: 1 }, dias: 5 },
    { id: 'conteudo', fluxo: ['Your photos and offers','AI writes and edits','VK · TikTok · Reels'], nome: 'Content factory', faz: 'Comes up with post and video ideas, makes short videos from your photos and posts them to VK, TikTok and Reels on schedule.',
      semana: ['A month of post ideas in your tone', 'Short videos made from your photos', 'Posting on autopilot, report every Monday'],
      tipos: ['loja', 'servicos', 'equipa'], dores: { conteudo: 3, clientes: 1 }, dias: 7 },
    { id: 'lucro', fluxo: ['Store + Excel','Profit per product','Telegram, every morning'], nome: 'Daily profit report', faz: 'Every morning it takes yesterday’s sales from your store and Excel, counts the profit per product and sends the result to Telegram.',
      semana: ['Your sales, costs and ads in one sheet', 'Profit per product, not just revenue', 'One message every morning: what earned, what lost'],
      tipos: ['loja', 'trading'], dores: { numeros: 3 }, dias: 3 },
    { id: 'produtos', fluxo: ['Marketplaces + suppliers','Rising demand + margin','Shortlist every week'], nome: 'Product finder', faz: 'Watches marketplaces and suppliers, finds products whose demand is rising and counts the margin before you buy stock.',
      semana: ['A shortlist of rising products in your niche', 'Supplier price and margin for each', 'New finds sent to you every week'],
      tipos: ['loja'], dores: { clientes: 2, numeros: 1 }, dias: 7 },
    { id: 'ads', fluxo: ['Your products','Ads written and tested','Losers off, winners up'], nome: 'Meta Ads on autopilot', faz: 'Writes ad texts and creatives for your products, switches off ads that lose money and gives more budget to the ones that sell.',
      semana: ['Ad texts and creatives for your best products', 'Rules that pause losing ads', 'A daily line: spent, earned, what changed'],
      tipos: ['loja', 'servicos'], dores: { ads: 3, clientes: 1 }, dias: 7 },
    { id: 'carrinho', fluxo: ['Left without paying','Reminder, then discount','Order back'], nome: 'Abandoned bag recovery', faz: 'When someone leaves without paying, it sends a reminder with the product photo, and a small discount if they still do not buy.',
      semana: ['Reminder by email or messenger after 1 hour', 'Second message with a discount after a day', 'A count of orders it brought back'],
      tipos: ['loja'], dores: { clientes: 2, ads: 1 }, dias: 3 },
    { id: 'crm', nome: 'CRM that runs the office', faz: 'Every request becomes a task with an owner and a deadline; tasks move between departments on their own; PC and phone stay in sync.',
      semana: ['Every request from chats and forms in one place', 'Owners and deadlines, nothing slips', 'Push on the phone when something needs you'],
      tipos: ['servicos', 'equipa', 'loja'], dores: { rotina: 3, respostas: 1 }, dias: 5,
      real: 'Runs our own company', foto: 'img/m-hub-crm.webp', prova: '#hub-empresa' },
    { id: 'alertas', nome: 'Telegram alerts bot', faz: 'Watches the numbers that matter to you and sends a picture to Telegram the moment something happens, so you decide in seconds.',
      semana: ['The signals you check by hand, watched 24/7', 'A chart picture, not a wall of numbers', 'Only the alerts worth your time'],
      tipos: ['trading', 'equipa'], dores: { numeros: 2, rotina: 1 }, dias: 5,
      real: 'Live product, used every day', foto: 'img/c-sinais.webp', prova: '#sinais' },
    { id: 'trading', nome: 'Trading automation', faz: 'Bots that open and close trades by your rules: entry, take-profit, stop-loss and size for every trade, with limits that protect the deposit.',
      semana: ['Your rules written as a bot', 'Risk limits per trade and per day', 'Every trade reported to Telegram'],
      tipos: ['trading'], dores: { rotina: 2, numeros: 1 }, dias: 10,
      real: 'Live on a real exchange account', foto: 'img/hub-trading-800.webp', prova: '#trading' },
    { id: 'anuncios', fluxo: ['One sheet of listings','Posted and bumped','Top of OLX all day'], nome: 'Listing auto-posting', faz: 'Keeps your listings at the top of OLX and other boards all day, without paying for promotion.',
      semana: ['All your listings posted from one sheet', 'Bumped to the top on schedule', 'More views and calls, zero promotion fees'],
      tipos: ['loja', 'servicos'], dores: { clientes: 2, ads: 2 }, dias: 3,
      real: 'Done for a client', prova: '#olx' },
    { id: 'pedidos', fluxo: ['Freelance sites + boards','Orders that fit you','Alert in a minute'], nome: 'New-order finder', faz: 'Watches freelance sites and boards for new orders that fit you and alerts the team at once, so you reply first.',
      semana: ['The sites where your clients post, watched 24/7', 'Only orders that fit your service', 'An alert the minute one appears'],
      tipos: ['servicos', 'equipa'], dores: { clientes: 3 }, dias: 5,
      real: 'Runs our own company' }
  ];

  var resultado = raiz.querySelector('[data-resultado]');

  function valor(nome) {
    var el = raiz.querySelector('input[name="' + nome + '"]:checked');
    return el ? el.value : null;
  }

  function pontos(a, tipo, dor) {
    return (a.dores[dor] || 0) * 3 + (a.tipos.indexOf(tipo) >= 0 ? 2 : 0) + (a.real ? 1 : 0);
  }

  function ordenar(tipo, dor) {
    return AUTOS.slice().sort(function (x, y) {
      return pontos(y, tipo, dor) - pontos(x, tipo, dor) || x.dias - y.dias;
    });
  }

  function porque(a, tipo, dor) {
    var partes = [];
    if (a.dores[dor] >= 3) partes.push('it hits your biggest time leak head-on');
    else if (a.dores[dor]) partes.push('it cuts the leak you picked');
    if (a.tipos.indexOf(tipo) >= 0) partes.push('it fits your kind of business');
    partes.push('it can be live in about ' + a.dias + ' days');
    return 'Why this one first: ' + partes.join(', ') + '.';
  }

  function desenhar(foco) {
    var tipo = valor('tipo'), dor = valor('dor');
    if (!tipo || !dor) return;
    var lista = ordenar(tipo, dor);
    var a = foco ? AUTOS.filter(function (x) { return x.id === foco; })[0] : lista[0];
    var outros = lista.filter(function (x) { return x !== a; }).slice(0, 2);
    var foto = a.foto
      ? '<img src="' + a.foto + '" alt="' + a.nome + ': a real screen" loading="lazy">'
      : '<ol class="fluxo">' + a.fluxo.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ol>';
    resultado.innerHTML =
      '<article class="melhor" aria-live="polite">' +
        '<figure>' + foto + '</figure>' +
        '<div class="melhor__txt">' +
          '<span class="melhor__selo">' + (foco ? 'Your pick' : 'Start with this') + '</span>' +
          '<h3>' + a.nome + '</h3>' +
          '<p>' + a.faz + '</p>' +
          '<p class="melhor__porque">' + porque(a, tipo, dor) + '</p>' +
          '<ul>' + a.semana.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>' +
          '<p class="melhor__meta">' +
            (a.real ? '<span class="real">● ' + a.real + '</span>' : '<span>Built for you</span>') +
            '<span>Live in ~' + a.dias + ' days</span></p>' +
          '<p class="acoes"><a class="botao" href="index.html#contacto">I want this one</a>' +
            (a.prova ? '<a class="botao botao--vazio" href="' + a.prova + '">See the real case</a>' : '') + '</p>' +
        '</div>' +
      '</article>' +
      '<div class="tambem">' + outros.map(function (o) {
        return '<button type="button" data-ver-auto="' + o.id + '"><small>Also fits</small><b>' + o.nome + '</b></button>';
      }).join('') + '</div>';
  }

  raiz.addEventListener('change', function () { desenhar(); });
  raiz.addEventListener('click', function (e) {
    var b = e.target.closest('[data-ver-auto]');
    if (b) desenhar(b.getAttribute('data-ver-auto'));
  });
  desenhar();
})();
