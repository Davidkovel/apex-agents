"""Builds the static pages of the AMG site: python build.py  ->  index.html, services.html, service-*.html, ...
Header, footer and the call-to-action live here once; contacts and estimator prices live in js/site.js.
To change a text: edit it here and run the script again. The output is plain HTML (GitHub Pages ready)."""
from pathlib import Path
from html import escape

AQUI = Path(__file__).parent

# ---------------------------------------------------------------- icons (24x24 stroke)
IC = {
    'layout': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 20V9"/>',
    'globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    'cart': '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L22 7H6"/>',
    'refresh': '<path d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5"/>',
    'pen': '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    'book': '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14ZM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    'image': '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
    'code': '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    'bot': '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9 13v2M15 13v2M2 14h2M20 14h2"/><circle cx="12" cy="3" r="1"/>',
    'cpu': '<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4"/>',
    'chart': '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
    'megaphone': '<path d="m3 11 15-6v14L3 13v-2ZM11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    'search': '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    'chat': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/>',
    'clipboard': '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    'user': '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    'rocket': '<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1ZM12 15l-3-3a22 22 0 0 1 2-4A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2Z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/>',
    'phone': '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/>',
    'mail': '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    'pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    'target': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    'briefcase': '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    'handshake': '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a3 3 0 0 0-4.2 0l-.9.9a1 1 0 1 1-3-3l2.8-2.8a5.8 5.8 0 0 1 7 .9L21 7M3 7l4 4M2 13l6 6"/>',
}


def ic(nome, cls='icone'):
    return f'<svg class="{cls}" viewBox="0 0 24 24" aria-hidden="true">{IC[nome]}</svg>'


# ---------------------------------------------------------------- services (one page each)
PASSOS_PADRAO = [
    ('clipboard', 'Brief', 'A short call: your business, your client, the goal, the deadline. We fix the price before we start.'),
    ('layout', 'Prototype', 'You see the structure and the first screens on your phone early and say what to change.'),
    ('code', 'Build', 'Design, code and texts together. One manager, one chat, progress you can open any day.'),
    ('rocket', 'Launch & support', 'We publish, connect analytics and stay with you: fixes, updates and growth.'),
]

SERVICOS = [
    dict(slug='landing-page', cat='Websites', ic='layout', nome='Landing page',
         curto='One page that turns ad traffic into requests.',
         h1='Landing pages that <em>bring requests</em>',
         intro='A landing page has one job: make a visitor leave a request. We plan the offer, write the text, design for the phone first and connect it to your ads and your CRM or messenger.',
         inclui=['Offer and page structure built from your real clients', 'Copywriting in English, Ukrainian or Russian', 'Phone-first design with your brand', 'Request form to Telegram, email or CRM', 'Analytics: Google Analytics, Meta Pixel, goals', 'Fast hosting and your domain connected'],
         de=450, prazo='7–10 days',
         faq=[('Do you write the texts?', 'Yes. We write them from a short interview with you — you only correct facts.'),
              ('Can it work with my ads?', 'That is what it is for. We connect the pixel and the conversion goals so the ads learn on real requests.'),
              ('What if I need changes later?', 'Small edits in the first month are free; after that we work by the hour or on monthly support.')]),
    dict(slug='corporate-website', cat='Websites', ic='globe', nome='Corporate website',
         curto='A multi-page company site that makes you look as big as you are.',
         h1='Company websites that <em>build trust</em>',
         intro='Services, cases, team, careers and contacts — the site a client checks before signing. Clear structure, fast pages, SEO basics and an admin you can edit yourself.',
         inclui=['Site structure and navigation planned for your clients', 'Pages: home, services, cases, about, careers, contacts', 'Multi-language versions', 'SEO basics: titles, sitemap, fast loading', 'Forms connected to email, Telegram or CRM', 'Training: how to edit texts and add cases'],
         de=900, prazo='2–4 weeks',
         faq=[('Can you move my old site?', 'Yes, we keep the useful content and the links Google already knows.'),
              ('Will I be able to edit it?', 'Yes — either a simple admin panel or a file-based setup we show you how to use.')]),
    dict(slug='online-store', cat='Websites', ic='cart', nome='Online store',
         curto='Shopify or custom store with payments, delivery and product pages that sell.',
         h1='Online stores that <em>sell</em>',
         intro='From the catalogue to the checkout: product pages that answer the questions, kits and bundles that raise the order value, payments and delivery connected.',
         inclui=['Shopify theme or custom store', 'Product pages, bundles and upsells', 'Payments, delivery and taxes set up', 'Product photos and descriptions', 'Email and abandoned-cart flows', 'Ads catalogue for Meta and Google'],
         de=1500, prazo='3–5 weeks',
         faq=[('Shopify or custom?', 'Shopify for most stores — fast to launch and easy to run. Custom when you have special logic or high volume.')]),
    dict(slug='website-redesign', cat='Websites', ic='refresh', nome='Website redesign',
         curto='Your old site rebuilt to look premium and convert better.',
         h1='Redesign: from old site to <em>premium</em>',
         intro='We read your current site, keep what works and rebuild the rest around one strong idea that comes from your business — like the Ferreras rebuild.',
         inclui=['Audit of the current site and analytics', 'New concept and visual direction', 'Rewritten texts with one hook per screen', 'Phone layout of its own', 'SEO-safe migration with redirects'],
         de=1100, prazo='3–4 weeks',
         faq=[('Will I lose my Google positions?', 'No — we keep the URLs or redirect them, and check after the launch.')]),
    dict(slug='branding', cat='Brand & design', ic='pen', nome='Logo & brand identity',
         curto='Name, logo, colours and fonts — a brand people remember.',
         h1='A brand people <em>remember</em>',
         intro='We start from what makes you different, then build the logo, colours, fonts and the rules that keep everything looking like one company — from Instagram to the invoice.',
         inclui=['Research: market, competitors, your clients', 'Logo in 2–3 directions, then one refined', 'Colours, fonts and graphic elements', 'Business card, social media and presentation templates', 'Short brand guide (PDF)', 'All source files'],
         de=500, prazo='1–3 weeks',
         faq=[('How many logo options?', 'Two or three directions, then we refine the one you pick — not twenty random variants.'),
              ('Can you name the brand too?', 'Yes, naming with domain and trademark checks is an option.')]),
    dict(slug='brand-book', cat='Brand & design', ic='book', nome='Brand book',
         curto='The full rulebook so every designer gets your brand right.',
         h1='Brand book: <em>one look</em> everywhere',
         intro='When several people make your materials, the brand starts to drift. A brand book fixes it: logo use, colours, typography, tone of voice, photo style and examples.',
         inclui=['Logo rules and clear space', 'Colour and typography system', 'Tone of voice with examples', 'Photo and illustration style', 'Templates for the most used materials'],
         de=700, prazo='2–3 weeks', faq=[]),
    dict(slug='design', cat='Brand & design', ic='image', nome='UI/UX & ad creatives',
         curto='Interfaces for apps and sites, creatives for ads and social media.',
         h1='Design that <em>works</em>, not just looks good',
         intro='App and website interfaces, presentations, packaging, social media and ad creatives — all in your brand and made to be clicked.',
         inclui=['UI/UX for web and mobile apps (Figma)', 'Ad creatives: static, carousels, short video', 'Social media templates', 'Presentations and pitch decks', 'Packaging and print'],
         de=300, prazo='from 3 days', faq=[]),
    dict(slug='web-apps', cat='Software', ic='code', nome='Web apps & dashboards',
         curto='Internal tools, client portals and dashboards built around your process.',
         h1='Software built around <em>your process</em>',
         intro='Spreadsheets and chats stop scaling. We build the tool your team actually needs: client portals, CRMs, dashboards, booking systems — with the integrations you already use.',
         inclui=['Process analysis and technical plan', 'Web app for desktop and phone', 'Integrations: payments, CRM, Google, 1C, APIs', 'Roles, access and data security', 'Hosting, backups and monitoring', 'Support and new features monthly'],
         de=2500, prazo='4–10 weeks',
         faq=[('Who owns the code?', 'You do. The code and the accounts are transferred to you.')]),
    dict(slug='bots-automation', cat='Software', ic='bot', nome='Telegram bots & automation',
         curto='Bots that take orders, answer clients and do the routine for you.',
         h1='Bots and automation that <em>save hours</em>',
         intro='Telegram bots for orders, bookings, support and alerts; automations that move data between your services so nobody copies it by hand.',
         inclui=['Telegram / WhatsApp bots', 'Order, booking and payment flows', 'Alerts and reports to your phone', 'Integrations with Google Sheets, CRM, websites', 'Admin panel to manage the bot'],
         de=600, prazo='1–3 weeks', faq=[]),
    dict(slug='ai-agents', cat='Software', ic='cpu', nome='AI agents',
         curto='AI that works inside your business: support, sales, research, content.',
         h1='AI agents that <em>do the work</em>',
         intro='We run our own company with AI agents — they take tasks, work in departments and report back. We build the same for you: support agents, sales assistants, research and content pipelines.',
         inclui=['Audit: which tasks AI can take over', 'Agents connected to your data and tools', 'Support and sales assistants', 'Research, reports and content pipelines', 'Control panel: what each agent did and why'],
         de=1500, prazo='2–6 weeks', faq=[]),
    dict(slug='targeted-ads', cat='Marketing', ic='target', nome='Targeted ads',
         curto='Meta, TikTok and Google campaigns aimed at the people who buy.',
         h1='Targeted ads that <em>pay back</em>',
         intro='We set up and run Meta (Facebook, Instagram), TikTok and Google campaigns with the creatives and the landing page they need — and report in money, not in likes.',
         inclui=['Audience and competitor research', 'Pixel, conversions and analytics set up', 'Creatives and ad texts', 'Campaign launch and daily optimisation', 'Weekly report: spend, requests, cost per request'],
         de=350, prazo='launch in 5–7 days',
         faq=[('What budget do I need?', 'It depends on the niche; we usually start testing from $10–20 a day and scale what works.')]),
    dict(slug='smm-seo', cat='Marketing', ic='megaphone', nome='SMM & SEO',
         curto='Content plan, posts and search optimisation that keep clients coming.',
         h1='Content and search that <em>keep clients coming</em>',
         intro='A content plan and posts in your brand, and SEO work that brings clients from Google month after month.',
         inclui=['Content strategy and monthly plan', 'Posts, reels scripts and design', 'SEO audit and technical fixes', 'Articles and landing pages for search', 'Monthly report'],
         de=400, prazo='monthly', faq=[]),
]
CATS = ['Websites', 'Brand & design', 'Software', 'Marketing']

# ---------------------------------------------------------------- cases (real work, real screenshots)
CASOS = [
    dict(nome='Ferreras', titulo='Ferreras — premium site for a luxury marketing agency', img='ferreras', tel=True,
         tags=['Website redesign', 'Brand', 'Video'],
         texto='Barcelona agency for luxury brands. The old site looked like a template; we rebuilt it around one idea — a watch dial that tells the 24 hours of the agency.',
         feito=['Concept and art direction', 'Video-first hero, one hook per screen', 'Phone layout of its own', 'Brief form without backend']),
    dict(nome='BareDesk', titulo='BareDesk — online store that sells desk kits', img='baredesk', tel=True,
         tags=['Online store', 'Brand'],
         texto='Desk accessories store for Europe. Instead of single items it sells kits, so the average order is bigger; the kit builds itself on the photo as you choose.',
         feito=['Brand and store theme', 'Kits and bundles logic', 'Product pages and photos']),
    dict(nome='Dipfare', titulo='Dipfare — flight deals web app', img='dipfare', tel=True,
         tags=['Web app', 'Data'],
         texto='Real airline fares caught when they dip: trip ideas by budget, an interactive globe and price alerts.',
         feito=['Product design', 'Fare data pipeline', 'Interactive globe and alerts']),
    dict(nome='First Minute', titulo='First Minute — news-to-gold forecasts', img='firstminute', tel=True,
         tags=['Fintech', 'Subscription'],
         texto='Before every US release it says in plain words where gold went the last times, built on minute data since 2018.',
         feito=['Landing and subscription', 'Data research', 'EN / RU versions']),
    dict(nome='Trading room', titulo='Trading room — markets in one dashboard', img='hub-trading', tel=False,
         tags=['Software', 'Dashboard'],
         texto='Live prices, news reaction, strategy backtests and broker accounts with prop-firm guard rails, in one screen.',
         feito=['Real-time data', 'Backtests', 'MetaTrader integration']),
    dict(nome='AMG Hub', titulo='AMG Hub — an office run by AI agents', img='hub-empresa', tel=False,
         tags=['Software', 'AI agents'],
         texto='Our own platform: tasks go to AI departments, every PC syncs, phones get the push. The same engine can run your back office.',
         feito=['AI agents in departments', 'Sync between offices', 'Desktop widget + phone app']),
]

# brands strip — PLACEHOLDERS until the real client list arrives (name, shape of the mark)
MARCAS = [('Brand One', '50%'), ('Northwind', '4px'), ('Lumen', '50% 0'), ('Atlas Co', '6px 50%'), ('Vertex', '50%'),
          ('Kyiv Foods', '3px'), ('Orbit', '50%'), ('Nova Clinic', '50% 50% 0 50%'), ('Helix', '4px'), ('Blue Harbor', '50%')]

# ---------------------------------------------------------------- layout pieces
NAV = [('about.html', 'About us'), ('services.html', 'Services'), ('projects.html', 'Projects'), ('career.html', 'Career'), ('contacts.html', 'Contacts')]


def head(titulo, desc):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{escape(titulo)}</title>
<meta name="description" content="{escape(desc)}">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#ffffff">
<meta property="og:title" content="{escape(titulo)}">
<meta property="og:description" content="{escape(desc)}">
<meta property="og:image" content="img/ferreras.webp">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='9' fill='%232f45ff'/%3E%3Ctext x='16' y='21.5' font-family='Arial' font-weight='800' font-size='12' fill='white' text-anchor='middle'%3EAMG%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="estilo.css">
<script defer src="js/site.js"></script>
</head>
<body>
<a class="saltar" href="#conteudo">Skip to content</a>
'''


def header(ativo):
    sub = ''.join(f'<a href="service-{s["slug"]}.html">{ic(s["ic"])}{s["nome"]}</a>' for s in SERVICOS)
    itens = []
    for href, nome in NAV:
        cur = ' aria-current="page"' if href == ativo else ''
        if href == 'services.html':
            itens.append(f'<div class="menu__grupo"><a href="{href}"{cur}>{nome}</a><div class="submenu">{sub}</div></div>')
        else:
            itens.append(f'<a href="{href}"{cur}>{nome}</a>')
    return f'''<header class="topo">
  <div class="caixa topo__in">
    <a class="marca" href="index.html" aria-label="AMG, home"><span class="marca__sinal">AMG</span><span>AMG <small>digital agency</small></span></a>
    <nav class="menu" id="menu" aria-label="Main">
      {''.join(itens)}
      <div class="menu__extra"><a class="topo__tel" data-tel href="contacts.html">+380 (00) 000 00 00</a><a class="botao" href="contacts.html#pedido">Start a project</a></div>
    </nav>
    <a class="topo__tel" data-tel href="contacts.html">+380 (00) 000 00 00</a>
    <a class="botao" href="contacts.html#pedido">Start a project</a>
    <button class="burger" type="button" aria-label="Menu" aria-controls="menu" aria-expanded="false"><i></i></button>
  </div>
</header>
<main id="conteudo">
'''


def chamada(titulo='Didn’t find what you were looking for?', texto='Describe the task in your own words — we will tell you honestly whether we are the right team, how we would do it and what it costs.'):
    return f'''<section class="chamada"><div class="caixa"><div class="chamada__cartao aparece">
  <h2>{titulo}</h2>
  <p>{texto}</p>
  <div class="heroi__acoes"><a class="botao botao--escuro" href="contacts.html#pedido">Contact us</a></div>
  <p class="chamada__linha"><a data-tel href="contacts.html">+380 (00) 000 00 00</a><a data-email href="contacts.html">hello@amg.example</a></p>
</div></div></section>
'''


def footer():
    serv = ''.join(f'<a href="service-{s["slug"]}.html">{s["nome"]}</a>' for s in SERVICOS[:7])
    serv2 = ''.join(f'<a href="service-{s["slug"]}.html">{s["nome"]}</a>' for s in SERVICOS[7:])
    return f'''</main>
<footer class="rodape">
  <div class="caixa">
    <div class="rodape__grelha">
      <div class="rodape__marca">
        <a class="marca" href="index.html"><span class="marca__sinal">AMG</span><span>AMG</span></a>
        <p>Digital agency: websites, brand design, software and targeted ads for small business, companies and agencies.</p>
        <p class="rodape__redes" data-redes></p>
      </div>
      <nav aria-label="Company"><b>Company</b><a href="about.html">About us</a><a href="projects.html">Projects</a><a href="career.html">Career</a><a href="contacts.html">Contacts</a></nav>
      <nav aria-label="Websites and design"><b>Services</b>{serv}</nav>
      <nav aria-label="Software and marketing"><b>&nbsp;</b>{serv2}</nav>
      <div class="rodape__col"><b>Contacts</b><a data-tel href="contacts.html">+380 (00) 000 00 00</a><a data-email href="contacts.html">hello@amg.example</a><span class="rodape__horas" data-horas>Mon–Fri, 9:00–19:00 (Kyiv)</span></div>
    </div>
    <div class="rodape__fim"><span>© <span data-ano>2026</span> AMG digital agency</span><a href="#conteudo">Back to top ↑</a></div>
  </div>
</footer>
</body>
</html>
'''


def pagina_topo(h1, sub, migalhas, extra=''):
    mig = '<a href="index.html">Home</a>' + ''.join(f'<span>{m}</span>' for m in migalhas)
    return f'''<section class="pagina-topo"><div class="caixa">
  <nav class="migalhas" aria-label="Breadcrumbs">{mig}</nav>
  <h1>{h1}</h1>
  <p class="sub">{sub}</p>
  {extra}
</div></section>
'''


# ---------------------------------------------------------------- reusable blocks
def bloco_marcas():
    itens = ''.join(f'<li><span class="logo" style="--forma:{f}"><i></i>{n}</span></li>' for n, f in MARCAS)
    return f'''<section class="marcas" aria-label="Brands that trust us">
  <p class="marcas__titulo">Brands that trust us</p>
  <!-- PLACEHOLDER logos: replace MARCAS in build.py with the real clients (an <img> per logo is fine) -->
  <div class="marcas__faixa"><ul class="marcas__trilho">{itens}</ul></div>
</section>
'''


def bloco_servicos_escuro(titulo='Everything a business needs <em>to sell online</em>'):
    cel = ''.join(f'<a href="service-{s["slug"]}.html">{ic(s["ic"])}<b>{s["nome"]}</b><small>{s["curto"]}</small></a>' for s in SERVICOS)
    return f'''<section class="secao servicos-escuro" id="servicos"><div class="caixa">
  <div class="cabeca"><div><p class="chapeu">Services</p><h2 class="titulo">{titulo}</h2></div>
  <a class="botao botao--branco" href="services.html">All services</a></div>
  <div class="grelha-escura">{cel}</div>
</div></section>
'''


def bloco_passos(passos=PASSOS_PADRAO, titulo='Smooth cooperation <em>in one touch</em>', chapeu='How we work'):
    li = ''.join(f'<li><span class="cartao__ic">{ic(i)}</span><b>{t}</b><p>{p}</p></li>' for i, t, p in passos)
    return f'''<section class="secao"><div class="caixa">
  <div class="cabeca"><div><p class="chapeu">{chapeu}</p><h2 class="titulo">{titulo}</h2></div></div>
  <ol class="passos aparece">{li}</ol>
</div></section>
'''


def caso_html(c):
    tel = f'<img class="caso__tel" src="img/{c["img"]}-tel.webp" alt="" width="390" height="780" loading="lazy">' if c['tel'] else ''
    tags = ''.join(f'<span>{t}</span>' for t in c['tags'])
    feito = ''.join(f'<li>{f}</li>' for f in c['feito'])
    return f'''<article class="caso aparece">
  <figure><img src="img/{c["img"]}.webp" alt="{escape(c["titulo"])}" width="1440" height="900" loading="lazy">{tel}</figure>
  <div class="caso__txt"><p class="etiquetas">{tags}</p><h3>{c["titulo"]}</h3><p>{c["texto"]}</p><ul class="caso__feito">{feito}</ul></div>
</article>'''


def bloco_calc():
    return '''<section class="secao" id="calculadora"><div class="caixa"><div class="calc aparece">
  <div class="calc__esq">
    <p class="chapeu">Estimator</p>
    <h2>Find out the cost of your project in a few clicks</h2>
    <p class="sub">Choose the service and the extras. You get a starting price now; the exact one comes after a 15-minute brief.</p>
    <div class="calc__total" aria-live="polite"><span>from</span><b id="calc-total">€0</b><small id="calc-prazo">Choose a service</small></div>
    <a class="botao" href="contacts.html#pedido" id="calc-pedir">Get the exact price</a>
    <p class="calc__nota">Prices are starting points without VAT; the final price is fixed in the contract before we start.</p>
  </div>
  <form class="calc__opcoes" id="calc" aria-label="Estimator options">
    <fieldset><legend>Select a service</legend><div class="calc__lista" id="calc-servicos"></div></fieldset>
    <fieldset><legend>Extras</legend><div class="calc__lista" id="calc-extras"></div></fieldset>
  </form>
</div></div></section>
'''


def formulario(titulo='Have a project? Let’s talk', sub='Leave your contacts — your manager writes back within one working day to discuss the details.'):
    chips = ''.join(f'<label><input type="checkbox" name="servico" value="{v}"><span>{v}</span></label>'
                    for v in ['Website', 'Landing page', 'Brand & design', 'Software / bot', 'AI agents', 'Targeted ads', 'Corporate team', 'Partnership'])
    return f'''<form class="pedido aparece" id="pedido" novalidate>
  <div><h3>{titulo}</h3><p class="sub" style="margin-top:.4rem">{sub}</p></div>
  <fieldset class="chips"><legend>What do you need?</legend>{chips}</fieldset>
  <div class="campos">
    <label class="campo"><span>Your name *</span><input name="nome" autocomplete="name" required></label>
    <label class="campo"><span>Company</span><input name="empresa" autocomplete="organization"></label>
    <label class="campo"><span>Phone, email or Telegram *</span><input name="contacto" autocomplete="email" required></label>
    <label class="campo"><span>Budget</span><select name="orcamento"><option value="">Not sure yet</option><option>Under €1,000</option><option>€1,000 – €3,000</option><option>€3,000 – €10,000</option><option>€10,000+</option></select></label>
  </div>
  <label class="campo"><span>About the project</span><textarea name="mensagem" rows="4" placeholder="What you sell, who buys it, a link to your current site…"></textarea></label>
  <button class="botao" type="submit">Send the request</button>
  <p class="pedido__estado" id="estado" role="status"></p>
  <p class="pedido__legal">By sending the form you agree that we use your contacts only to answer you.</p>
</form>'''


def lista_contactos():
    return f'''<ul class="contactos" id="contactos">
  <li><span class="cartao__ic">{ic('phone')}</span><span><small>Phone</small><a data-tel href="#">+380 (00) 000 00 00</a></span></li>
  <li><span class="cartao__ic">{ic('mail')}</span><span><small>Email</small><a data-email href="#">hello@amg.example</a></span></li>
  <li><span class="cartao__ic">{ic('chat')}</span><span><small>Messengers</small><span class="mens" data-mensageiros></span></span></li>
  <li><span class="cartao__ic">{ic('clock')}</span><span><small>Hours</small><b data-horas>Mon–Fri, 9:00–19:00 (Kyiv)</b></span></li>
  <li><span class="cartao__ic">{ic('pin')}</span><span><small>Where</small><b data-onde>Ukraine &amp; EU · working worldwide, remotely</b></span></li>
</ul>'''


PUBLICOS = f'''<section class="secao secao--suave" id="cooperacao"><div class="caixa">
  <div class="cabeca cabeca--centro"><p class="chapeu">Cooperation</p><h2 class="titulo">Choose how you want to <em>work with us</em></h2></div>
  <div class="publicos">
    <article class="publico aparece">
      <p class="publico__tag">Startups &amp; small business</p><h3>Launch and start selling</h3>
      <ul class="lista-check"><li>Landing page or store in weeks, not months</li><li>Logo, brand and the first ad campaign</li><li>Fixed price agreed before we start</li><li>Pay in stages, as the work is delivered</li></ul>
      <a class="botao botao--branco" href="index.html#calculadora">Estimate my project</a>
    </article>
    <article class="publico publico--destaque aparece">
      <p class="publico__tag">Companies &amp; corporations</p><h3>A team that plugs into yours</h3>
      <ul class="lista-check"><li>Dedicated project manager and one shared chat</li><li>NDA, contract and invoices for your accounting</li><li>Internal software: dashboards, bots, AI agents, integrations</li><li>Support and new features every month (SLA)</li></ul>
      <a class="botao botao--branco" href="contacts.html#pedido" data-servico="Corporate team">Discuss cooperation</a>
    </article>
    <article class="publico aparece">
      <p class="publico__tag">Agencies &amp; partners</p><h3>Extra hands, your brand</h3>
      <ul class="lista-check"><li>White-label development and design for your clients</li><li>Outsourcing or outstaff: one specialist or the whole team</li><li>Your process, your tools, your deadlines</li><li>Referral fee for the clients you bring</li></ul>
      <a class="botao botao--branco" href="contacts.html#pedido" data-servico="Partnership">Become a partner</a>
    </article>
  </div>
</div></section>
'''

PORQUE = [
    ('users', 'One team for everything', 'Site, brand, software and ads from the same people — nothing gets lost between contractors.'),
    ('clock', 'Fast start', 'A landing page in 7–10 days, a brand in 1–3 weeks. Clear deadlines in the contract.'),
    ('shield', 'Fixed price, NDA', 'The price is agreed before we start. NDA and contract on request.'),
    ('cpu', 'AI in our own work', 'We run our company with AI agents — so we build faster and can build the same for you.'),
    ('chart', 'Results in money', 'We measure requests and sales, not likes. Analytics is part of every project.'),
    ('chat', 'Always in touch', 'One manager in your messenger, answers the same day.'),
]


def bloco_porque():
    cards = ''.join(f'<article class="cartao aparece"><span class="cartao__ic">{ic(i)}</span><h3>{t}</h3><p>{p}</p></article>' for i, t, p in PORQUE)
    return f'''<section class="secao"><div class="caixa">
  <div class="cabeca"><div><p class="chapeu">Why AMG</p><h2 class="titulo">Why clients trust their projects <em>to our team</em></h2></div></div>
  <div class="grelha grelha--3">{cards}</div>
</div></section>
'''


# ---------------------------------------------------------------- pages
def pagina_inicio():
    etq = [('layout', 'Websites &amp; landing pages', 'service-landing-page.html', 'left:6%;top:20%', '-4deg', '0s'),
           ('pen', 'Logo &amp; brand identity', 'service-branding.html', 'left:9%;top:52%', '3deg', '1.5s'),
           ('cpu', 'Software, bots &amp; AI agents', 'service-ai-agents.html', 'right:6%;top:18%', '4deg', '.8s'),
           ('target', 'Targeted ads', 'service-targeted-ads.html', 'right:10%;top:52%', '-3deg', '2.2s')]
    tags = ''.join(f'<a class="etiqueta" href="{h}" style="{pos};--r:{r};--d:{d}"><span>{ic(i)}</span><span>{t}</span></a>' for i, t, h, pos, r, d in etq)
    casos = ''.join(caso_html(c) for c in CASOS[:3])
    return head('AMG — digital agency: websites, brands, software, ads', 'AMG builds websites, landing pages, brands, software and AI agents, and runs targeted ads that bring clients.') + header('index.html') + f'''
<section class="heroi">
  {tags}
  <div class="caixa heroi__in">
    <p class="chapeu">AMG · digital agency</p>
    <h1>Digital agency <em>that brings clients</em></h1>
    <p class="sub">Websites, landing pages, brand identity, software and targeted ads for companies and private clients. Clear prices, fixed deadlines, one team.</p>
    <div class="heroi__acoes"><a class="botao" href="#cooperacao" data-servico="Corporate team">For companies</a><a class="botao botao--branco" href="#calculadora">For startups &amp; small business</a></div>
  </div>
</section>
{bloco_marcas()}
{bloco_calc()}
{bloco_porque()}
{bloco_servicos_escuro()}
{PUBLICOS}
<section class="secao"><div class="caixa ligar">
  <div>
    <figure class="citacao aparece">
      <blockquote>“Our goal is simple: every site, brand and bot we make has to bring our client money — or we have not finished.”</blockquote>
      <figcaption><b>AMG founders</b>Websites · software · marketing</figcaption>
    </figure>
    {lista_contactos()}
  </div>
  {formulario('Tight deadline? Contact us!', 'Send your details — your manager will contact you shortly to discuss the project.')}
</div></section>
{bloco_passos()}
<section class="secao secao--suave"><div class="caixa">
  <div class="cabeca"><div><p class="chapeu">Projects</p><h2 class="titulo">Recent <em>cases</em></h2></div><a class="botao botao--branco" href="projects.html">All projects</a></div>
  <div class="casos">{casos}</div>
</div></section>
{chamada()}''' + footer()


def pagina_servicos():
    blocos = ''
    for cat in CATS:
        cards = ''.join(f'<a class="cartao aparece" href="service-{s["slug"]}.html"><span class="cartao__ic">{ic(s["ic"])}</span><h3>{s["nome"]}</h3><p>{s["curto"]}</p><span class="cartao__mais">from €{s["de"]:,} · {s["prazo"]} →</span></a>'
                        for s in SERVICOS if s['cat'] == cat)
        blocos += f'<section class="secao" style="padding-block:2.5rem"><div class="caixa"><h2 class="titulo" style="font-size:1.6rem;margin-bottom:1.4rem">{cat}</h2><div class="grelha">{cards}</div></div></section>'
    return head('Services — AMG digital agency', 'Websites, landing pages, online stores, brand identity, design, software, bots, AI agents, targeted ads, SMM and SEO.') + header('services.html') + \
        pagina_topo('Services for your <em>business</em>', 'From the first landing page to the software your company runs on. Pick a service to see what is included, the price and the timeline.', ['Services']) + \
        blocos + bloco_calc() + bloco_passos() + chamada() + footer()


def pagina_servico(s):
    inclui = ''.join(f'<li>{x}</li>' for x in s['inclui'])
    faq = ''.join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in s['faq'])
    faq_bloco = f'<section class="secao secao--suave"><div class="caixa"><div class="cabeca"><div><p class="chapeu">FAQ</p><h2 class="titulo">Questions about {s["nome"].lower()}</h2></div></div><div class="faq">{faq}</div></div></section>' if s['faq'] else ''
    casos = [c for c in CASOS if any(t.lower() in (s['nome'] + ' ' + s['cat']).lower() or s['cat'].split()[0].lower() in t.lower() for t in c['tags'])][:2] or CASOS[:2]
    outros = ''.join(f'<a class="cartao" href="service-{o["slug"]}.html"><span class="cartao__ic">{ic(o["ic"])}</span><h3>{o["nome"]}</h3><p>{o["curto"]}</p></a>'
                     for o in SERVICOS if o['cat'] == s['cat'] and o is not s)[:3000]
    factos = f'<div class="factos"><div class="facto"><small>Price</small><b>from €{s["de"]:,}</b></div><div class="facto"><small>Timeline</small><b>{s["prazo"]}</b></div><div class="facto"><small>Category</small><b>{s["cat"]}</b></div></div>'
    acoes = f'<div class="heroi__acoes" style="justify-content:flex-start"><a class="botao" href="contacts.html#pedido" data-servico="{s["nome"]}">Order {s["nome"].lower()}</a><a class="botao botao--branco" href="index.html#calculadora">Estimate the cost</a></div>'
    return head(f'{s["nome"]} — AMG digital agency', s['curto']) + header('services.html') + \
        pagina_topo(s['h1'], s['intro'], [f'<a href="services.html">Services</a>', s['nome']], factos + acoes) + f'''
<section class="secao"><div class="caixa duas">
  <div class="aparece"><p class="chapeu">What you get</p><h2 class="titulo">What is included</h2><ul class="lista-check">{inclui}</ul></div>
  <div class="aparece">{caso_html(casos[0]).replace('class="caso aparece"', 'class="caso" style="grid-template-columns:1fr"')}</div>
</div></section>
{bloco_passos(titulo=f'How we make your {s["nome"].lower()}')}
{faq_bloco}
<section class="secao"><div class="caixa"><div class="cabeca"><div><p class="chapeu">{s["cat"]}</p><h2 class="titulo">Related services</h2></div><a class="botao botao--branco" href="services.html">All services</a></div><div class="grelha">{outros}</div></div></section>
{chamada(f'Ready to start your {s["nome"].lower()}?', 'Tell us about your business — we answer within one working day with a plan, a price and a deadline.')}''' + footer()


def pagina_projetos():
    casos = ''.join(caso_html(c) for c in CASOS)
    return head('Projects — AMG digital agency', 'Websites, stores, web apps and software we built: Ferreras, BareDesk, Dipfare, First Minute and more.') + header('projects.html') + \
        pagina_topo('Projects we are <em>proud of</em>', 'Real products and real screens — no mock-ups. Each one is live and in use.', ['Projects']) + \
        f'<section class="secao" style="padding-top:2rem"><div class="caixa casos">{casos}</div></section>' + chamada('Want a project like these?') + footer()


def pagina_sobre():
    valores = [('target', 'Result first', 'A project is finished when it brings requests or saves hours — not when the files are sent.'),
               ('handshake', 'Honest from the start', 'If we are not the right team for the task, we say so in the first call.'),
               ('rocket', 'Ship, then improve', 'We launch early, measure and improve with real data instead of guessing.'),
               ('cpu', 'Builders, not resellers', 'We design and code ourselves, and use AI agents to move faster.')]
    v = ''.join(f'<article class="cartao aparece"><span class="cartao__ic">{ic(i)}</span><h3>{t}</h3><p>{p}</p></article>' for i, t, p in valores)
    equipa = [('D', 'Development', 'Websites, web apps, bots and AI agents. Front-end, back-end, integrations.'),
              ('B', 'Brand & design', 'Logos, identities, interfaces and ad creatives.'),
              ('M', 'Marketing', 'Targeted ads, analytics, content and SEO.')]
    e = ''.join(f'<article class="pessoa aparece"><span class="pessoa__foto">{l}</span><h3>{t}</h3><p>{p}</p></article>' for l, t, p in equipa)
    return head('About us — AMG digital agency', 'AMG is a digital agency from Ukraine: websites, brands, software and ads, built by one team.') + header('about.html') + \
        pagina_topo('We build what <em>brings clients</em>', 'AMG is a digital agency from Ukraine working with companies in Europe and worldwide. Developers, designers and marketers in one team — and AI agents doing the routine.', ['About us']) + f'''
<section class="secao"><div class="caixa">
  <div class="numeros">
    <div class="numero aparece"><b>{len(CASOS)}</b><span>live products in our portfolio</span></div>
    <div class="numero aparece"><b>{len(SERVICOS)}</b><span>services from one team</span></div>
    <div class="numero aparece"><b>36</b><span>in-house playbooks our team and AI agents follow</span></div>
    <div class="numero aparece"><b>1</b><span>manager and one chat per project</span></div>
  </div>
</div></section>
<section class="secao secao--suave"><div class="caixa">
  <div class="cabeca"><div><p class="chapeu">Our values</p><h2 class="titulo">How we <em>work</em></h2></div></div>
  <div class="grelha">{v}</div>
</div></section>
<section class="secao"><div class="caixa">
  <div class="cabeca"><div><p class="chapeu">Team</p><h2 class="titulo">Three directions, <em>one team</em></h2></div><a class="botao botao--branco" href="career.html">Join us</a></div>
  <div class="equipa">{e}</div>
</div></section>
{bloco_passos()}
{chamada()}''' + footer()


def pagina_carreira():
    vagas = [('Front-end developer', 'Remote · full-time or project', 'HTML/CSS/JS, React or Next.js. Fast, clean, phone-first sites and web apps.', ['Development', 'Remote']),
             ('UI/UX designer', 'Remote · project-based', 'Figma, landing pages, brand identities and ad creatives with a strong portfolio.', ['Design', 'Remote']),
             ('Media buyer (targeted ads)', 'Remote · part-time', 'Meta and TikTok ads with results you can show in money.', ['Marketing', 'Remote']),
             ('Sales / account manager', 'Remote · commission + base', 'Finds clients in Europe and Ukraine, runs the first call, keeps the client happy.', ['Sales', 'English'])]
    v = ''.join(f'<article class="vaga aparece"><div><h3>{t}</h3><p>{w} — {d}</p><p class="etiquetas">{"".join(f"<span>{x}</span>" for x in tags)}</p></div><a class="botao" href="mailto:" data-cv="{escape(t)}">Apply</a></article>' for t, w, d, tags in vagas)
    porque = [('globe', 'Remote, worldwide', 'Work from anywhere, flexible hours, one weekly sync.'),
              ('cpu', 'AI-first company', 'Our own AI agents take the routine; you do the interesting part.'),
              ('rocket', 'Real products', 'Every project ships and goes into your portfolio.'),
              ('chart', 'Grow with us', 'Pay that grows with the projects you lead.')]
    p = ''.join(f'<article class="cartao aparece"><span class="cartao__ic">{ic(i)}</span><h3>{t}</h3><p>{d}</p></article>' for i, t, d in porque)
    return head('Career — AMG digital agency', 'Join AMG: developers, designers, media buyers and sales managers, remote.') + header('career.html') + \
        pagina_topo('Build with <em>us</em>', 'We are growing and looking for people who like to ship. Remote, flexible, real products.', ['Career']) + f'''
<section class="secao" style="padding-top:2rem"><div class="caixa">
  <div class="cabeca"><div><p class="chapeu">Open positions</p><h2 class="titulo">Who we are <em>looking for</em></h2></div></div>
  <div class="grelha" style="grid-template-columns:1fr">{v}</div>
  <p class="sub">No position for you? Send your CV and portfolio anyway to <a data-email href="#">hello@amg.example</a> — we read everything.</p>
</div></section>
<section class="secao secao--suave"><div class="caixa">
  <div class="cabeca"><div><p class="chapeu">Why AMG</p><h2 class="titulo">Why people <em>work with us</em></h2></div></div>
  <div class="grelha">{p}</div>
</div></section>
{chamada('Not a job seeker, but have a project?', 'We are happy to help — tell us about it.')}''' + footer()


def pagina_contactos():
    return head('Contacts — AMG digital agency', 'Phone, email, messengers and a request form. AMG answers within one working day.') + header('contacts.html') + \
        pagina_topo('Contacts', 'Call, write in your messenger or send the form — your manager answers within one working day.', ['Contacts']) + f'''
<section class="secao" style="padding-top:2rem"><div class="caixa ligar">
  <div>
    <h2 class="titulo" style="font-size:1.8rem">How to reach us</h2>
    {lista_contactos()}
    <div class="cartao" style="margin-top:1.2rem"><span class="cartao__ic">{ic('briefcase')}</span><h3>For companies and partners</h3><p>Contracts, NDA, invoices, white-label and outstaff — write “Corporate” or “Partnership” in the form and the right person answers.</p></div>
  </div>
  {formulario()}
</div></section>
{bloco_passos()}''' + footer()


PAGINAS = {
    'index.html': pagina_inicio,
    'services.html': pagina_servicos,
    'projects.html': pagina_projetos,
    'about.html': pagina_sobre,
    'career.html': pagina_carreira,
    'contacts.html': pagina_contactos,
}

if __name__ == '__main__':
    for nome, fn in PAGINAS.items():
        (AQUI / nome).write_text(fn(), encoding='utf-8')
    for s in SERVICOS:
        (AQUI / f'service-{s["slug"]}.html').write_text(pagina_servico(s), encoding='utf-8')
    print(f'{len(PAGINAS) + len(SERVICOS)} pages written')
