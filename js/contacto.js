/* Contact form with no backend: it builds the message and opens the client's email app or Telegram.
   Fill in the real channels here (empty = that channel is hidden). */
const CONTACTO = {
  email: '',      // e.g. 'hello@amg.studio'
  telegram: '',   // username without @, e.g. 'amg_studio'
  whatsapp: '',   // number with country code, digits only, e.g. '351900000000'
};

(() => {
  const form = document.getElementById('pedido');
  const estado = document.getElementById('estado');
  const canais = document.getElementById('canais');
  document.getElementById('ano').textContent = new Date().getFullYear();

  const links = [];
  if (CONTACTO.telegram) links.push(['Telegram', 'https://t.me/' + CONTACTO.telegram]);
  if (CONTACTO.whatsapp) links.push(['WhatsApp', 'https://wa.me/' + CONTACTO.whatsapp]);
  if (CONTACTO.email) links.push([CONTACTO.email, 'mailto:' + CONTACTO.email]);
  canais.innerHTML = links.map(([t, h]) => `<a class="botao botao--vazio" href="${h}" target="_blank" rel="noopener">${t}</a>`).join('');

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
      'Contact: ' + contacto,
      'Needs: ' + (d.getAll('servico').join(', ') || 'not chosen'),
      'Budget: ' + (d.get('orcamento') || 'not sure yet'),
      '',
      (d.get('mensagem') || '').trim(),
    ].join('\n');

    if (CONTACTO.email) {
      location.href = `mailto:${CONTACTO.email}?subject=${encodeURIComponent('Project request — ' + nome)}&body=${encodeURIComponent(texto)}`;
      estado.textContent = 'Your email app opened with the request ready — just press send.';
    } else if (CONTACTO.telegram) {
      window.open(`https://t.me/${CONTACTO.telegram}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
      estado.textContent = 'Telegram opened with the request ready — just press send.';
    } else if (CONTACTO.whatsapp) {
      window.open(`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
      estado.textContent = 'WhatsApp opened with the request ready — just press send.';
    } else {
      estado.textContent = 'Thanks! Contact channels are being set up — please come back soon.';
    }
  });
})();
