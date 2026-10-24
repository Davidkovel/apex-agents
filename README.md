# Apex Agents — studio site

Agency site: websites, software, design and targeted ads. The hero is a scroll journey through screenshots of our real
projects (engine `js/scroll.js` from the `site-scroll-infinito` skill), then the work, services, numbers, process and a
contact form with no backend.

- Plain HTML + CSS + JS, no build. Run locally: `python -m http.server 8791` → http://127.0.0.1:8791/
- **Contacts**: the top of `js/contacto.js` (`CONTACTO`). Placeholders now; empty = hidden. Every `form.pedido` (request, free audit, job application) sends its text to Telegram/WhatsApp/email from there.
- **Brands strip**: only real clients; add an `<li>` in `.marcas__trilho` (index.html) when a project is done.
- Still a draft: `noindex` in `index.html` until the name, contacts and domain are final.
- Screenshots in `img/` (desktop 1440×900, `-800` for the journey, `-tel` phone).
