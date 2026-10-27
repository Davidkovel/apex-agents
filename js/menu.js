// Phone menu: the button opens and closes the header links; a tap on a link or Escape closes it.
(function () {
  var topo = document.querySelector('.topo');
  var botao = topo && topo.querySelector('.menu-botao');
  if (!botao) return;
  function abre(sim) {
    topo.classList.toggle('menu-aberto', sim);
    botao.setAttribute('aria-expanded', sim);
    botao.setAttribute('aria-label', sim ? 'Close menu' : 'Open menu');
  }
  botao.addEventListener('click', function () { abre(!topo.classList.contains('menu-aberto')); });
  topo.querySelector('nav').addEventListener('click', function (e) { if (e.target.closest('a')) abre(false); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') abre(false); });
})();
