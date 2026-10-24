# AMG — agency site

Multi-page site of the AMG digital agency (structure modelled on mk-translations.ua): home, services + one page per
service, projects, about, career, contacts. Plain HTML + CSS + JS, no npm — GitHub Pages ready.

- **Edit texts, services, cases, brands**: `build.py`, then `python build.py` (rewrites every `.html`).
- **Contacts and estimator prices**: the top of `js/site.js` (`CONTACTO`, `PRECOS`). Placeholders now; empty = hidden.
- **Brands strip**: `MARCAS` in `build.py` holds PLACEHOLDER names until the real client list arrives.
- Run locally: `python -m http.server 8791` → http://127.0.0.1:8791/
- Draft: `noindex` in every page until the name, contacts and domain are final.
