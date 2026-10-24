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

  // ---- what we do: tabs; the big sentence above follows the open tab ----
  const frase = $('#fazemos-frase');
  $$('[data-aba]').forEach((b) => b.addEventListener('click', () => {
    $$('[data-aba]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    $$('[data-painel]').forEach((p) => {
      p.hidden = p.dataset.painel !== b.dataset.aba;
      if (!p.hidden && frase) { frase.classList.remove('troca'); void frase.offsetWidth; frase.textContent = p.dataset.frase; frase.classList.add('troca'); }
    });
  }));
  const primeiro = $('[data-painel]:not([hidden])'); if (primeiro && frase) frase.textContent = primeiro.dataset.frase;

  // ---- first-project offer: open the chat with the text ready, or fill the form ----
  const promo = 'Hi! I would like the −10% on my first project.';
  $$('[data-promo]').forEach((a) => {
    if (CONTACTO.telegram) { a.href = `https://t.me/${CONTACTO.telegram}?text=${encodeURIComponent(promo)}`; a.target = '_blank'; a.rel = 'noopener'; return; }
    a.addEventListener('click', () => { const m = document.querySelector('#pedido textarea[name="mensagem"]'); if (m && !m.value.includes(promo)) m.value = (promo + '\n' + m.value).trim(); });
  });

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
