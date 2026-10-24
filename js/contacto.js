/* Contacts, estimator and the request form (no backend: the form opens email, Telegram or WhatsApp with the text ready).
   EVERYTHING TO FILL IN IS HERE. Placeholders until the real values exist; an empty field hides that channel. */
const CONTACTO = {
  telefone: '+380 (00) 000 00 00',   // shown as written; the link uses only the digits
  email: 'hello@amg.example',
  telegram: '',      // username without @, e.g. 'amg_studio'
  whatsapp: '',      // digits with country code, e.g. '380500000000'
  viber: '',         // digits with country code
  instagram: '',     // username
  linkedin: '',      // full company page URL
  horas: 'Mon–Fri, 9:00–19:00 (Kyiv)',
  onde: 'Ukraine & EU · working worldwide, remotely',
};

/* Starting prices for the estimator (EUR) — placeholders, set the real ones. dias = typical days. */
const PRECOS = {
  servicos: [
    { id: 'landing', nome: 'Landing page', de: 450, dias: '7–10 days' },
    { id: 'site', nome: 'Company website', de: 900, dias: '2–3 weeks' },
    { id: 'loja', nome: 'Online store', de: 1500, dias: '3–5 weeks' },
    { id: 'app', nome: 'Web app / bot / AI agent', de: 2500, dias: '4–8 weeks' },
    { id: 'marca', nome: 'Logo & brand design', de: 500, dias: '1–2 weeks' },
    { id: 'ads', nome: 'Targeted ads setup', de: 350, dias: '5–7 days' },
  ],
  extras: [
    { id: 'idiomas', nome: 'Extra language', de: 150 },
    { id: 'textos', nome: 'Copywriting & photos', de: 250 },
    { id: 'urgente', nome: 'Urgent (×1.3)', fator: 1.3 },
    { id: 'suporte', nome: 'Monthly support', de: 150, mes: true },
  ],
};

(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const ano = $('#ano'); if (ano) ano.textContent = new Date().getFullYear();

  // ---- contacts everywhere on the page ----
  const digitos = CONTACTO.telefone.replace(/[^\d+]/g, '');
  $$('[data-tel]').forEach((a) => { if (!CONTACTO.telefone) return a.remove(); a.textContent = CONTACTO.telefone; a.href = 'tel:' + digitos; });
  $$('[data-email]').forEach((a) => { if (!CONTACTO.email) return a.remove(); a.textContent = CONTACTO.email; a.href = 'mailto:' + CONTACTO.email; });
  $$('[data-horas]').forEach((e) => { e.textContent = CONTACTO.horas; });
  $$('[data-onde]').forEach((e) => { e.textContent = CONTACTO.onde; });
  const mens = [
    CONTACTO.telegram && ['Telegram', 'https://t.me/' + CONTACTO.telegram],
    CONTACTO.whatsapp && ['WhatsApp', 'https://wa.me/' + CONTACTO.whatsapp],
    CONTACTO.viber && ['Viber', 'viber://chat?number=%2B' + CONTACTO.viber],
  ].filter(Boolean);
  const pill = ([t, h]) => `<a class="pill" href="${h}" target="_blank" rel="noopener">${t}</a>`;
  $$('[data-mensageiros]').forEach((e) => { e.innerHTML = mens.length ? mens.map(pill).join('') : 'Telegram · WhatsApp · Viber — links coming soon'; });
  const redes = [
    CONTACTO.instagram && ['Instagram', 'https://instagram.com/' + CONTACTO.instagram],
    CONTACTO.linkedin && ['LinkedIn', CONTACTO.linkedin],
    ...mens,
  ].filter(Boolean);
  $$('[data-redes]').forEach((e) => { e.innerHTML = redes.map(pill).join(''); });

  // ---- brands strip: a second copy so the -50% loop has no seam ----
  const trilho = $('.marcas__trilho');
  if (trilho) [...trilho.children].forEach((li) => { const c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.querySelectorAll('a').forEach((a) => a.tabIndex = -1); trilho.append(c); });

  // ---- estimator ----
  const caixa = (tipo, o) => `<label class="opcao"><input type="${tipo}" name="${tipo === 'radio' ? 'servico' : 'extra'}" value="${o.id}">
    <span><b>${o.nome}</b><small>${o.fator ? '×' + o.fator : 'from €' + o.de.toLocaleString('en') + (o.mes ? '/mo' : '')}</small></span></label>`;
  const calc = $('#calc');
  if (calc) {
    $('#calc-servicos').innerHTML = PRECOS.servicos.map((o) => caixa('radio', o)).join('');
    $('#calc-extras').innerHTML = PRECOS.extras.map((o) => caixa('checkbox', o)).join('');
    const total = $('#calc-total'), prazo = $('#calc-prazo');
    const conta = () => {
      const s = PRECOS.servicos.find((o) => o.id === calc.servico.value);
      const ex = $$('#calc-extras input:checked').map((i) => PRECOS.extras.find((o) => o.id === i.value));
      if (!s) { total.textContent = '€0'; prazo.textContent = 'Choose a service'; return; }
      let v = s.de + ex.filter((o) => o.de && !o.mes).reduce((a, o) => a + o.de, 0);
      ex.filter((o) => o.fator).forEach((o) => { v *= o.fator; });
      const mes = ex.find((o) => o.mes);
      total.textContent = '€' + (Math.round(v / 10) * 10).toLocaleString('en');
      prazo.textContent = s.dias + (mes ? ` · + €${mes.de}/mo support` : '');
      calc.dataset.resumo = `${s.nome}${ex.length ? ' + ' + ex.map((o) => o.nome).join(', ') : ''} — estimate from ${total.textContent}`;
    };
    calc.addEventListener('change', conta);
    $('#calc-pedir').addEventListener('click', () => {
      const m = form && form.mensagem;
      if (m && calc.dataset.resumo && !m.value.includes(calc.dataset.resumo)) m.value = (calc.dataset.resumo + '\n' + m.value).trim();
    });
  }

  // ---- buttons that pre-pick a service in the form ----
  const form = $('#pedido');
  $$('[data-servico]').forEach((a) => a.addEventListener('click', () => {
    const c = form && form.querySelector(`input[name="servico"][value="${a.dataset.servico}"]`);
    if (c) c.checked = true;
  }));
  const fig = document.querySelector('.ano-fim'); if (fig) fig.textContent = new Date().getFullYear();

  // ---- the request form ----
  if (!form) return;
  const estado = $('#estado');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const nome = (d.get('nome') || '').trim();
    const contacto = (d.get('contacto') || '').trim();
    form.nome.setAttribute('aria-invalid', String(!nome));
    form.contacto.setAttribute('aria-invalid', String(!contacto));
    if (!nome || !contacto) { estado.textContent = 'Add your name and how we can reach you.'; return; }

    const texto = [
      form.dataset.assunto || 'New project request — AMG',
      'Name: ' + nome,
      'Contact: ' + contacto,
      (form.dataset.rotulo || 'Needs') + ': ' + (d.getAll('servico').join(', ') || 'not chosen'),
      d.has('orcamento') ? 'Budget: ' + (d.get('orcamento') || 'not sure yet') : '',
      d.get('portfolio') ? 'Portfolio: ' + d.get('portfolio') : '',
      '',
      (d.get('mensagem') || '').trim(),
    ].join('\n');

    if (CONTACTO.telegram) {
      window.open(`https://t.me/${CONTACTO.telegram}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
      estado.textContent = 'Telegram opened with the request ready — just press send.';
    } else if (CONTACTO.whatsapp) {
      window.open(`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
      estado.textContent = 'WhatsApp opened with the request ready — just press send.';
    } else if (CONTACTO.email && !CONTACTO.email.endsWith('.example')) {
      location.href = `mailto:${CONTACTO.email}?subject=${encodeURIComponent((form.dataset.assunto || 'Project request') + ' — ' + nome)}&body=${encodeURIComponent(texto)}`;
      estado.textContent = 'Your email app opened with the request ready — just press send.';
    } else {
      estado.textContent = 'Thanks! Our contact channels are being set up — please come back soon.';
    }
  });
})();
