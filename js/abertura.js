/* Opening (~2 s): the Apex mark draws itself, frames rush past as the tunnel opens,
   then the mark flies into the header (FLIP) and the scroll is released.
   Reduced motion or any error: straight to the final state. Safety release at 6 s. */
(function () {
  const ab = document.getElementById('abertura');
  const root = document.documentElement, body = document.body;
  const fim = () => {
    root.style.overflow = ''; body.classList.remove('a-abrir');
    if (ab) ab.remove();
    window.dispatchEvent(new Event('aberto'));
  };
  if (!ab || matchMedia('(prefers-reduced-motion: reduce)').matches) return fim();
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const hash = location.hash; scrollTo(0, 0);
  root.style.overflow = 'hidden';
  const seguro = setTimeout(fim, 6000);

  setTimeout(() => {
    const marca = ab.querySelector('.abertura__a'), alvo = document.querySelector('.topo .marca svg');
    const de = marca.getBoundingClientRect(), para = alvo && alvo.getBoundingClientRect();
    ab.classList.add('voa');
    if (para) {
      const dx = para.left + para.width / 2 - (de.left + de.width / 2), dy = para.top + para.height / 2 - (de.top + de.height / 2);
      marca.style.transform = `translate3d(${dx}px,${dy}px,0) scale(${para.width / de.width})`;
    }
    setTimeout(() => {
      body.classList.remove('a-abrir'); ab.classList.add('fim');
      setTimeout(() => {
        clearTimeout(seguro); fim();
        if (hash && hash !== '#viagem') { const el = document.querySelector(hash); if (el) el.scrollIntoView(); }
      }, 550);
    }, 500);
  }, 1500);
})();
