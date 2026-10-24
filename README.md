# AMG — studio site

Agency site: websites, software, design and targeted ads. The hero is a scroll journey through screenshots of our real
projects (engine `js/scroll.js` from the `site-scroll-infinito` skill), then the work, services, numbers, process and a
contact form with no backend.

- Plain HTML + CSS + JS, no build. Run locally: `python -m http.server 8791` → http://127.0.0.1:8791/
- **Contacts and prices**: all in the top of `js/contacto.js` — `CONTACTO` (phone, email, Telegram, WhatsApp, Viber, socials, hours) and `PRECOS` (estimator starting prices). Placeholders now; empty = hidden.
- **Brands strip**: only real clients; add an `<li>` in `.marcas__trilho` (index.html) when a project is done.
- Still a draft: `noindex` in `index.html` until the name, contacts and domain are final.
- Screenshots in `img/` (desktop 1440×900, `-800` for the journey, `-tel` phone).
