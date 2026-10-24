/* AMG site: contacts, estimator, menu, reveal and the request form (no backend: the form opens Telegram, WhatsApp or email
   with the text ready). EVERYTHING TO FILL IN IS IN THE TWO OBJECTS BELOW. Empty field = that channel is hidden. */
const CONTACTO = {
  telefone: '+380 (00) 000 00 00',   // shown as written; the link uses only the digits
  email: 'hello@amg.example',
  telegram: '',      // username without @, e.g. 'amg_agency'
  whatsapp: '',      // digits with country code, e.g. '380500000000'
  viber: '',         // digits with country code
  instagram: '',     // username
  linkedin: '',      // full company page URL
  horas: 'Mon–Fri, 9:00–19:00 (Kyiv)',
  onde: 'Ukraine & EU · working worldwide, remotely',
};

/* Starting prices for the estimator (EUR) — placeholders, set the real ones (keep them equal to build.py). */
const PRECOS = {
  servicos: [
    { id: 'landing', nome: 'Landing page', de: 450, dias: '7–10 days' },
    { id: 'site', nome: 'Corporate website', de: 900, dias: '2–4 weeks' },
    { id: 'loja', nome: 'Online store', de: 1500, dias: '3–5 weeks' },
    { id: 'marca', nome: 'Logo & brand identity', de: 500, dias: '1–3 weeks' },
    { id: 'bot', nome: 'Telegram bot / automation', de: 600, dias: '1–3 weeks' },
    { id: 'app', nome: 'Web app / AI agent', de: 1500, dias: '2–10 weeks' },
    { id: 'ads', nome: 'Targeted ads setup', de: 350, dias: '5–7 days' },
    { id: 'design', nome: 'UI/UX & creatives', de: 300, dias: 'from 3 days' },
  ],
  extras: [
    { id: 'idiomas', nome: 'Extra language', de: 150 },
    { id: 'textos', nome: 'Copywriting & photos', de: 250 },
    { id: 'marca', nome: 'Logo for the project', de: 300 },
    { id: 'urgente', nome: 'Urgent (×1.3)', fator: 1.3 },
    { id: 'suporte', nome: 'Monthly support', de: 150, mes: true },
  ],
};

(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  $$('[data-ano]').forEach((e) => { e.textContent = new Date().getFullYear(); });

  // ---- header: border after scrolling, burger menu ----
  const topo = $('.topo');
  const marca = () => topo && topo.classList.toggle('rolou', scrollY > 8);
  addEventListener('scroll', marca, { passive: true }); marca();
  const burger = $('.burger');
  if (burger) burger.addEventListener('click', () => {
    const aberto = document.body.classList.toggle('menu-aberto');
    burger.setAttribute('aria-expanded', String(aberto));
    document.body.style.overflow = aberto ? 'hidden' : '';
  });

  // ---- contacts everywhere ----
  const digitos = CONTACTO.telefone.replace(/[^\d+]/g, '');
  $$('[data-tel]').forEach((a) => { if (!CONTACTO.telefone) return a.remove(); a.textContent = CONTACTO.telefone; a.href = 'tel:' + digitos; });
  $$('[data-email]').forEach((a) => { if (!CONTACTO.email) return a.remove(); a.textContent = CONTACTO.email; a.href = 'mailto:' + CONTACTO.email; });
  $$('[data-horas]').forEach((e) => { e.textContent = CONTACTO.horas; });
  $$('[data-onde]').forEach((e) => { e.textContent = CONTACTO.onde; });
  $$('[data-cv]').forEach((a) => { a.href = `mailto:${CONTACTO.email}?subject=${encodeURIComponent('CV — ' + a.dataset.cv)}`; });
  const mens = [
    CONTACTO.telegram && ['Telegram', 'https://t.me/' + CONTACTO.telegram],
    CONTACTO.whatsapp && ['WhatsApp', 'https://wa.me/' + CONTACTO.whatsapp],
    CONTACTO.viber && ['Viber', 'viber://chat?number=%2B' + CONTACTO.viber],
  ].filter(Boolean);
  const pill = ([t, h]) => `<a class="pill" href="${h}" target="_blank" rel="noopener">${t}</a>`;
  $$('[data-mensageiros]').forEach((e) => { e.innerHTML = mens.length ? mens.map(pill).join('') : '<b>Telegram · WhatsApp · Viber</b>'; });
  const redes = [CONTACTO.instagram && ['Instagram', 'https://instagram.com/' + CONTACTO.instagram], CONTACTO.linkedin && ['LinkedIn', CONTACTO.linkedin], ...mens].filter(Boolean);
  $$('[data-redes]').forEach((e) => { e.innerHTML = redes.map(pill).join(''); });

  // ---- brands strip: a second copy so the -50% loop has no seam ----
  const trilho = $('.marcas__trilho');
  if (trilho) [...trilho.children].forEach((li) => { const c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); trilho.append(c); });

  // ---- reveal on scroll ----
  const io = 'IntersectionObserver' in window && new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('.aparece').forEach((el) => (io ? io.observe(el) : el.classList.add('visto')));

  // ---- estimator ----
  const form = $('#pedido');
  const calc = $('#calc');
  if (calc) {
    const caixa = (tipo, o) => `<label class="opcao"><input type="${tipo}" name="${tipo === 'radio' ? 'servico' : 'extra'}" value="${o.id}">
      <span><b>${o.nome}</b><small>${o.fator ? '×' + o.fator : 'from €' + o.de.toLocaleString('en') + (o.mes ? '/mo' : '')}</small></span></label>`;
    $('#calc-servicos').innerHTML = PRECOS.servicos.map((o) => caixa('radio', o)).join('');
    $('#calc-extras').innerHTML = PRECOS.extras.map((o) => caixa('checkbox', o)).join('');
    const total = $('#calc-total'), prazo = $('#calc-prazo'), pedir = $('#calc-pedir');
    calc.addEventListener('change', () => {
      const s = PRECOS.servicos.find((o) => o.id === calc.servico.value);
      const ex = $$('#calc-extras input:checked').map((i) => PRECOS.extras.find((o) => o.id === i.value));
      if (!s) return;
      let v = s.de + ex.filter((o) => o.de && !o.mes).reduce((a, o) => a + o.de, 0);
      ex.filter((o) => o.fator).forEach((o) => { v *= o.fator; });
      const mes = ex.find((o) => o.mes);
      total.textContent = '€' + (Math.round(v / 10) * 10).toLocaleString('en');
      prazo.textContent = s.dias + (mes ? ` · + €${mes.de}/mo support` : '');
      const resumo = `${s.nome}${ex.length ? ' + ' + ex.map((o) => o.nome).join(', ') : ''} — estimate from ${total.textContent}`;
      // on the home page the form is on the same page; elsewhere the summary travels in the link
      pedir.href = form ? '#pedido' : 'contacts.html?estimate=' + encodeURIComponent(resumo) + '#pedido';
      pedir.dataset.resumo = resumo;
    });
    pedir.addEventListener('click', () => {
      const m = form && form.mensagem;
      if (m && pedir.dataset.resumo && !m.value.includes(pedir.dataset.resumo)) m.value = (pedir.dataset.resumo + '\n' + m.value).trim();
    });
  }

  // ---- buttons that pre-pick a service; ?estimate= and ?service= fill the form on the contacts page ----
  const marcar = (v) => { const c = form && form.querySelector(`input[name="servico"][value="${v}"]`); if (c) c.checked = true; };
  $$('[data-servico]').forEach((a) => a.addEventListener('click', () => {
    if (form) return marcar(a.dataset.servico);
    if (a.href.includes('contacts.html')) a.href = 'contacts.html?service=' + encodeURIComponent(a.dataset.servico) + '#pedido';
  }));
  const q = new URLSearchParams(location.search);
  if (form && q.get('service')) {
    marcar(q.get('service'));
    if (!form.querySelector('input[name="servico"]:checked')) form.mensagem.value = 'Service: ' + q.get('service');
  }
  if (form && q.get('estimate')) form.mensagem.value = (q.get('estimate') + '\n' + form.mensagem.value).trim();

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
      'New project request — AMG',
      'Name: ' + nome,
      d.get('empresa') ? 'Company: ' + d.get('empresa') : '',
      'Contact: ' + contacto,
      'Needs: ' + (d.getAll('servico').join(', ') || 'not chosen'),
      'Budget: ' + (d.get('orcamento') || 'not sure yet'),
      '',
      (d.get('mensagem') || '').trim(),
    ].filter((l, i) => l !== '' || i === 6).join('\n');
    if (CONTACTO.telegram) {
      window.open(`https://t.me/${CONTACTO.telegram}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
      estado.textContent = 'Telegram opened with the request ready — just press send.';
    } else if (CONTACTO.whatsapp) {
      window.open(`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
      estado.textContent = 'WhatsApp opened with the request ready — just press send.';
    } else if (CONTACTO.email && !CONTACTO.email.endsWith('.example')) {
      location.href = `mailto:${CONTACTO.email}?subject=${encodeURIComponent('Project request — ' + nome)}&body=${encodeURIComponent(texto)}`;
      estado.textContent = 'Your email app opened with the request ready — just press send.';
    } else {
      estado.textContent = 'Thanks! Our contact channels are being set up — please come back soon.';
    }
  });
})();
