// Automation picker: one question, one automation to start with.
// Four picks only, so the page stays light. "real" = it already runs for us today.
(function () {
  var raiz = document.querySelector('[data-escolha]');
  if (!raiz) return;

  var AUTOS = {
    respostas: { nome: 'AI assistant for your clients', faz: 'Answers in Telegram, WhatsApp, Instagram and VK day and night, and sends you only the hot leads.',
      fluxo: ['Client writes', 'AI answers and books', 'Hot lead to you'], dias: 5 },
    conteudo: { nome: 'Content on autopilot', faz: 'Comes up with ideas, makes short videos from your photos and posts them to VK, TikTok and Reels.',
      fluxo: ['Your photos', 'AI writes and edits', 'Posted on schedule'], dias: 7 },
    numeros: { nome: 'Profit report every morning', faz: 'Takes yesterday’s sales from your store and Excel and sends the profit per product to Telegram.',
      fluxo: ['Store + Excel', 'Profit per product', 'Telegram at 9:00'], dias: 3 },
    rotina: { nome: 'CRM that runs the office', faz: 'Every request becomes a task with an owner and a deadline, on every PC and phone.',
      foto: 'img/m-hub-crm.webp', real: 'Runs our own company', prova: '#hub-empresa', dias: 5 }
  };
  var resultado = raiz.querySelector('[data-resultado]');

  function desenhar() {
    var el = raiz.querySelector('input[name="dor"]:checked');
    var a = AUTOS[el ? el.value : 'respostas'];
    var topo = a.foto
      ? '<figure><img src="' + a.foto + '" alt="' + a.nome + ': a real screen" loading="lazy"></figure>'
      : '<ol class="fluxo">' + a.fluxo.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ol>';
    resultado.innerHTML =
      '<article class="melhor">' + topo +
        '<div class="melhor__txt">' +
          '<h3>' + a.nome + '</h3>' +
          '<p>' + a.faz + '</p>' +
          '<p class="melhor__meta">' + (a.real ? '<span class="real">● ' + a.real + '</span>' : '') + '<span>Live in ~' + a.dias + ' days</span></p>' +
          '<p class="acoes"><a class="botao" href="index.html#contacto">I want this</a>' +
            (a.prova ? '<a class="botao botao--vazio" href="' + a.prova + '">See it</a>' : '') + '</p>' +
        '</div>' +
      '</article>';
  }

  raiz.addEventListener('change', desenhar);
  desenhar();
})();
