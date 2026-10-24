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

  // ---- what we do: tabs ----
  $$('[data-aba]').forEach((b) => b.addEventListener('click', () => {
    $$('[data-aba]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    $$('[data-painel]').forEach((p) => {
      p.hidden = p.dataset.painel !== b.dataset.aba;
    });
  }));

  // ---- buttons that pre-pick a service in the request form ----
  const form = $('#pedido');
  $$('[data-servico]').forEach((a) => a.addEventListener('click', () => {
    const c = form && form.querySelector(`input[name="servico"][value="${a.dataset.servico}"]`);
    if (c) c.checked = true;
  }));

  // ---- every form.pedido (project request, free audit, job application): the text goes to the chat or email ----
  const ROTULOS = { nome: 'Name', empresa: 'Company', site: 'Website / Instagram', contacto: 'Contact', orcamento: 'Budget', portfolio: 'Portfolio' };
  $$('form.pedido').forEach((f) => f.addEventListener('submit', (e) => {
    e.preventDefault();
    const estado = f.querySelector('.pedido__estado');
    const falta = [...f.querySelectorAll('[required]')].filter((i) => { const v = !i.value.trim(); i.setAttribute('aria-invalid', String(v)); return v; });
    if (falta.length) { estado.textContent = 'Fill in the marked fields so we can answer you.'; falta[0].focus(); return; }
    const d = new FormData(f);
    const linhas = [f.dataset.assunto || 'New project request — AMG'];
    for (const [k, r] of Object.entries(ROTULOS)) if (d.get(k)) linhas.push(r + ': ' + d.get(k).trim());
    if (d.getAll('servico').length) linhas.push((f.dataset.rotulo || 'Needs') + ': ' + d.getAll('servico').join(', '));
    if ((d.get('mensagem') || '').trim()) linhas.push('', d.get('mensagem').trim());
    const texto = linhas.join('\n');
    const quem = (d.get('nome') || d.get('empresa') || d.get('site') || '').trim();

    if (CONTACTO.telegram) {
      window.open(`https://t.me/${CONTACTO.telegram}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
      estado.textContent = 'Telegram opened with your message ready — just press send.';
    } else if (CONTACTO.whatsapp) {
      window.open(`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
      estado.textContent = 'WhatsApp opened with your message ready — just press send.';
    } else if (CONTACTO.email && !CONTACTO.email.endsWith('.example')) {
      location.href = `mailto:${CONTACTO.email}?subject=${encodeURIComponent((f.dataset.assunto || 'Project request') + ' — ' + quem)}&body=${encodeURIComponent(texto)}`;
      estado.textContent = 'Your email app opened with the message ready — just press send.';
    } else {
      estado.textContent = 'Thanks! Our contact channels are being set up — please come back soon.';
    }
  }));
})();
