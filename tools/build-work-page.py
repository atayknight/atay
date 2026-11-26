#!/usr/bin/env python3
"""Builds public/work/index.html (the All work page) from the project list in public/index.html.
Run after adding or changing projects:  python3 tools/build-work-page.py"""
import json, subprocess, os, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = json.loads(subprocess.check_output(['node', os.path.join(ROOT, 'tools/work-data.js')]))
e = lambda x: html.escape(str(x), quote=True)

CATS = [
 ("film", "Cinematography", "Brand, corporate and tourism films, shot as Director of Photography and graded in-house."),
 ("travel", "Tourism & travel", "Reels and films for tourism boards, hotels and destinations across Morocco."),
 ("ad", "Commercial", "Campaigns and social content for brands, telecoms and creators."),
 ("vfx", "3D & VFX", "Compositing, 3D and motion for festivals, brands and LED screens."),
]
vert = lambda p: p["ar"] == "9:16"
def fmt(p):
    if p.get("fmt"): return p["fmt"]
    return "Reel · 9:16" if vert(p) else p["ar"]
def tc(s):
    return f"{s//60}:{s%60:02d}" if s else ""

PLAY = '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M4 2.5v11l9.5-5.5z"/></svg>'
def card(p, i):
    v = vert(p); clip = p.get("clip")
    dur = tc(p.get("dur") or 0)
    vid = f'<video muted playsinline loop preload="none" data-src="/reel/{e(clip)}.mp4"></video>' if clip else ""
    return (f'<a class="wc {"v" if v else "h"}" href="/work/{e(p["slug"])}/" data-f="{"reel" if v else "film"}" style="--i:{min(i,10)}">'
            f'<span class="wm" style="--ar:{"9/16" if v else "16/9"}"><img src="/img/{e(p["id"])}.webp" alt="{e(p["t"])}" loading="{"eager" if i < 3 else "lazy"}" decoding="async">{vid}'
            f'<span class="wtag"><i></i>{e(fmt(p))}{(" · " + dur) if dur and not p.get("fmt") else ""}</span>'
            f'<span class="wplay">{PLAY}</span></span>'
            f'<span class="wt"><b>{e(p["t"])}</b><small>{e(p["client"])}</small><span class="roles">{"".join(f"<em>{e(r)}</em>" for r in p["role"])}</span></span></a>')

sections = []
for k, name, desc in CATS:
    L = [p for p in P if p["cat"] == k]
    if not L: continue
    nf = sum(1 for p in L if not vert(p)); nr = len(L) - nf
    parts = []
    if nf: parts.append(f"{nf} film{'s' if nf > 1 else ''}")
    if nr: parts.append(f"{nr} reel{'s' if nr > 1 else ''}")
    sections.append(f'''<section class="cat" id="{k}" data-cat="{k}">
  <div class="cat-h"><div><span class="cat-n">0{len(sections)+1}</span><h2>{e(name)}</h2><p>{e(desc)}</p></div><span class="cat-c">{" · ".join(parts)}</span></div>
  <div class="grid">{"".join(card(p, i) for i, p in enumerate(L))}</div>
 </section>''')

clients = len({p["client"].split(" × ")[0] for p in P})
chips = "".join(f'<button type="button" data-k="{k}" aria-pressed="false">{e(n)}<small>{sum(1 for p in P if p["cat"] == k)}</small></button>' for k, n, _ in CATS)
nreel = sum(1 for p in P if vert(p))
ld = {"@context": "https://schema.org", "@type": "CollectionPage", "name": "All work · Atay Studio", "url": "https://atayknight.com/work/",
      "about": "Cinematography, editing, colour grading and VFX by Atay Studio, Ayoub Ouazzou, in Marrakech",
      "hasPart": [{"@type": "CreativeWork", "name": p["t"], "url": f'https://atayknight.com/work/{p["slug"]}/'} for p in P]}

page = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><script>if(location.protocol==="http:"&&/atayknight\\.com$/.test(location.hostname))location.replace("https://"+location.host+location.pathname+location.search+location.hash)</script>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>All work · Atay Studio | Films, reels, commercials and VFX by Ayoub Ouazzou</title>
<meta name="description" content="{len(P)} projects by Atay Studio, Marrakech: cinematography, tourism films and reels, commercials and 3D/VFX for brands like INWI, Lenovo and III Points.">
<link rel="canonical" href="https://atayknight.com/work/">
<meta property="og:type" content="website"><meta property="og:site_name" content="Atay Studio"><meta property="og:title" content="All work · Atay Studio"><meta property="og:url" content="https://atayknight.com/work/"><meta property="og:image" content="https://atayknight.com/og.jpg"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="/brand/icon.svg"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,500..900&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap">
<script>(function(){{var t;try{{t=localStorage.getItem("atay-theme")}}catch(e){{}}if(t!=="dark"&&t!=="light")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}})()</script>
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
<style>
:root{{--bg:#F5F5F7;--panel:#fff;--ink:#1D1D1F;--muted:#6E6E73;--line:#D2D2D7;--blue:#3D6BE0;--blue-ink:#3D6BE0;--red:#FF3D5A;--glass:rgba(245,245,247,.78);
 --display:"Archivo","Arial Narrow",system-ui,sans-serif;--body:"Geist",system-ui,-apple-system,"Segoe UI",sans-serif;--mono:"Geist Mono",ui-monospace,Menlo,monospace;--ease:cubic-bezier(.2,.8,.2,1)}}
html[data-theme=dark]{{--bg:#07040F;--panel:#0E0A1F;--ink:#F2F0FF;--muted:#9C97C2;--line:#1F2A55;--blue-ink:#7FA4F0;--glass:rgba(7,4,15,.72);color-scheme:dark}}
*{{box-sizing:border-box}}html{{scroll-behavior:smooth}}@media (prefers-reduced-motion:reduce){{html{{scroll-behavior:auto}}}}
body{{margin:0;background:var(--bg);color:var(--ink);font:400 16px/1.55 var(--body);-webkit-font-smoothing:antialiased;overflow-x:hidden}}
a{{color:inherit}}img{{display:block;max-width:100%}}
.wrap{{max-width:1280px;margin:0 auto;padding:0 max(16px,env(safe-area-inset-left,0px))}}@media (min-width:720px){{.wrap{{padding:0 32px}}}}
/* header */
.top{{position:sticky;top:0;z-index:20;background:var(--glass);-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid var(--line)}}
.top .wrap{{display:flex;align-items:center;gap:18px;height:60px}}
.brand{{display:flex;align-items:center;gap:10px;text-decoration:none;font:800 15px/1 var(--body);letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}}
.brand img{{width:24px;height:24px}}
.nav{{display:flex;gap:4px;margin-left:auto}}
.nav a{{text-decoration:none;padding:8px 12px;border-radius:999px;font:500 14px/1 var(--body);color:var(--muted)}}.nav a:hover{{color:var(--ink)}}
.nav a[aria-current]{{background:var(--panel);color:var(--ink);box-shadow:0 0 0 1px var(--line)}}
.th{{all:unset;cursor:pointer;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;border:1px solid var(--line);color:var(--ink)}}.th svg{{width:16px;height:16px}}
.cta{{flex:none;text-decoration:none;padding:10px 16px;border-radius:999px;background:var(--blue);color:#fff;font:600 14px/1 var(--body);white-space:nowrap}}
@media (max-width:860px){{.nav{{display:none}}.th{{margin-left:auto}}}}@media (max-width:420px){{.brand{{font-size:13px}}.cta{{padding:9px 12px;font-size:13px}}}}
/* hero */
.hero{{padding-top:clamp(48px,8vw,110px);padding-bottom:clamp(26px,4vw,44px)}}
.eb{{font:500 12px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--blue-ink)}}
h1{{margin:14px 0 0;font:900 clamp(56px,11vw,150px)/.86 var(--display);font-stretch:75%;text-transform:uppercase;letter-spacing:-.01em}}
.lead{{max-width:620px;margin:20px 0 0;color:var(--muted);font-size:clamp(17px,1.6vw,20px)}}
.stats{{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}}
.stats span{{padding:10px 14px;border-radius:14px;background:var(--panel);box-shadow:0 0 0 1px var(--line);font:500 13px/1 var(--body);color:var(--muted)}}.stats b{{color:var(--ink);font-weight:700;margin-right:4px}}
/* filter bar */
.bar{{position:sticky;top:60px;z-index:15;background:var(--glass);-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid var(--line)}}
.bar .wrap{{display:flex;align-items:center;gap:14px;padding-top:12px;padding-bottom:12px}}
.chips{{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;flex:1;min-width:0}}.chips::-webkit-scrollbar{{display:none}}
.chips button,.seg button{{all:unset;cursor:pointer;flex:none;display:inline-flex;align-items:center;gap:8px;padding:10px 15px;border-radius:999px;border:1px solid var(--line);background:var(--panel);color:var(--muted);font:600 14px/1 var(--body);white-space:nowrap}}
.chips small{{font:500 11px/1 var(--mono);opacity:.75}}
.chips button[aria-pressed=true],.seg button[aria-pressed=true]{{background:var(--ink);border-color:var(--ink);color:var(--bg)}}
.seg{{display:flex;gap:4px;padding:3px;border-radius:999px;border:1px solid var(--line);background:var(--panel)}}.seg button{{border:0;padding:8px 13px;font-size:13px}}
@media (max-width:760px){{.bar .wrap{{flex-direction:column;align-items:stretch;gap:10px}}.chips{{margin:0 -16px;padding:0 16px}}.seg{{align-self:flex-start}}}}
/* sections */
.cat{{padding:clamp(48px,6vw,84px) 0 0;scroll-margin-top:130px}}
.cat[hidden]{{display:none}}
.cat-h{{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:clamp(20px,2.4vw,30px);padding-bottom:18px;border-bottom:1px solid var(--line)}}
.cat-n{{font:500 12px/1 var(--mono);color:var(--blue-ink);letter-spacing:.1em}}
.cat h2{{margin:8px 0 0;font:900 clamp(34px,5vw,64px)/.9 var(--display);font-stretch:75%;text-transform:uppercase}}
.cat p{{margin:10px 0 0;color:var(--muted);max-width:560px}}
.cat-c{{font:500 12px/1.4 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--muted);white-space:nowrap}}
@media (max-width:760px){{.cat-h{{flex-direction:column;align-items:flex-start;gap:10px}}}}
/* masonry grid, real formats */
.grid{{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:2px;grid-auto-flow:row dense;column-gap:clamp(14px,1.6vw,22px);align-items:start}}
.wc{{display:flex;flex-direction:column;gap:12px;min-width:0;padding-bottom:clamp(22px,2.4vw,32px);text-decoration:none;grid-column:span 1;-webkit-tap-highlight-color:transparent;animation:in .7s var(--ease) both;animation-delay:calc(var(--i,0) * 45ms)}}
.wc.h{{grid-column:span 2}}.wc[hidden]{{display:none}}
@keyframes in{{from{{opacity:0;transform:translateY(16px)}}}}
@media (prefers-reduced-motion:reduce){{.wc{{animation:none}}}}
.wm{{position:relative;display:block;width:100%;aspect-ratio:var(--ar);border-radius:14px;overflow:hidden;background:#05060A;isolation:isolate;box-shadow:0 0 0 1px rgba(127,164,240,.12),0 18px 40px -24px rgba(0,0,0,.7);transition:box-shadow .4s,transform .5s var(--ease)}}
.wm img,.wm video{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1.2s var(--ease),opacity .5s}}
.wm video{{opacity:0}}.wc.play .wm video{{opacity:1}}
.wm::after{{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(4,5,10,.35),rgba(4,5,10,0) 26%,rgba(4,5,10,0) 66%,rgba(4,5,10,.45));pointer-events:none;z-index:1}}
.wtag{{position:absolute;left:12px;top:12px;z-index:2;display:inline-flex;align-items:center;gap:7px;padding:6px 9px 5px;border-radius:999px;background:rgba(6,7,12,.62);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#E9ECF5;font:500 10px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;max-width:calc(100% - 24px);white-space:nowrap;overflow:hidden}}
.wtag i{{flex:none;width:6px;height:6px;border-radius:50%;background:var(--red);box-shadow:0 0 8px var(--red)}}
.wplay{{position:absolute;right:12px;bottom:12px;z-index:2;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:#fff;color:#0B0E18;transform:scale(.6);opacity:0;transition:transform .45s var(--ease),opacity .3s}}.wplay svg{{width:14px;height:14px;margin-left:2px}}
.wt{{display:flex;flex-direction:column;gap:5px;padding:0 2px;min-width:0}}
.wt b{{font:700 16px/1.25 var(--body);color:var(--ink)}}
.wt small{{font:500 11px/1.4 var(--mono);letter-spacing:.07em;text-transform:uppercase;color:var(--muted)}}
.roles{{display:flex;flex-wrap:wrap;gap:5px;margin-top:3px}}.roles em{{font:500 11px/1 var(--body);font-style:normal;padding:5px 8px;border-radius:999px;border:1px solid var(--line);color:var(--muted)}}
@media (hover:hover) and (pointer:fine){{.wc:hover .wm{{box-shadow:0 0 0 1px rgba(127,164,240,.5),0 24px 50px -20px rgba(59,102,214,.55);transform:translateY(-3px)}}.wc:hover .wm img{{transform:scale(1.04)}}.wc:hover .wplay{{transform:none;opacity:1}}}}
.wc:focus-visible{{outline:none}}.wc:focus-visible .wm{{outline:2px solid var(--blue-ink);outline-offset:3px}}
@media (max-width:900px){{.grid{{grid-template-columns:repeat(2,minmax(0,1fr))}}}}
@media (max-width:760px){{.grid{{column-gap:12px}}.wc{{gap:9px;padding-bottom:20px}}.wm{{border-radius:12px}}.wt b{{font-size:14px}}.wt small{{font-size:10px}}.roles em{{font-size:10px;padding:4px 7px}}.wc.v .wtag{{font-size:0;gap:0;padding:6px}}}}
.empty{{padding:60px 0;color:var(--muted);text-align:center}}
/* closing band */
.band{{margin:clamp(56px,8vw,110px) 0 0;border-radius:28px;padding:clamp(32px,6vw,64px);text-align:center;color:#fff;background:radial-gradient(120% 90% at 50% 0%,#5A86F0,#3D6BE0 35%,#264D95 75%,#18306A)}}
.band h2{{margin:0;font:900 clamp(36px,6vw,72px)/.9 var(--display);font-stretch:75%;text-transform:uppercase}}
.band p{{margin:16px auto 24px;max-width:520px;color:rgba(255,255,255,.85)}}
.band a{{display:inline-block;margin:4px;padding:13px 22px;border-radius:999px;background:#fff;color:#18306A;text-decoration:none;font-weight:600}}.band a.o{{background:transparent;color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.6)}}
footer{{margin-top:56px;border-top:1px solid var(--line);padding:26px 0 40px;color:var(--muted);font-size:13px}}footer .wrap{{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}}footer a{{text-decoration:none}}
</style>
</head>
<body>
<header class="top"><div class="wrap"><a class="brand" href="/"><img src="/brand/icon.svg" alt="">Atay Studio</a>
 <nav class="nav" aria-label="Main"><a href="/">Home</a><a href="/work/" aria-current="page">Work</a><a href="/#clients">Clients</a><a href="/#studio">Profile</a><a href="/#book">Book a call</a><a href="/#contact">Contact</a></nav>
 <button class="th" type="button" aria-label="Switch light or dark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button>
 <a class="cta" href="/#book">Start a project</a></div></header>
<main>
 <section class="hero wrap"><div class="eb">Portfolio · Atay Studio · Marrakech</div><h1>All work</h1>
  <p class="lead">Films, reels, commercials and VFX for brands, festivals and tourism boards. Every piece is shot, edited, graded and finished by Atay Studio.</p>
  <div class="stats"><span><b>{len(P)}</b>projects</span><span><b>{len(P)-nreel}</b>films</span><span><b>{nreel}</b>reels</span><span><b>4</b>crafts · shoot, edit, colour, VFX</span></div></section>
 <div class="bar"><div class="wrap"><div class="chips" role="group" aria-label="Category"><button type="button" data-k="all" aria-pressed="true">All<small>{len(P)}</small></button>{chips}</div>
  <div class="seg" role="group" aria-label="Format"><button type="button" data-f="all" aria-pressed="true">All formats</button><button type="button" data-f="film" aria-pressed="false">Films 16:9</button><button type="button" data-f="reel" aria-pressed="false">Reels 9:16</button></div></div></div>
 <div class="wrap">
 {"".join(sections)}
 <p class="empty" hidden>No projects in this format yet.</p>
 <div class="band"><h2>Your project next?</h2><p>Tell Ayoub the idea, the dates and the place. He replies with ideas and a quote made for your project.</p><a href="/#book">Book a call</a><a class="o" href="https://wa.me/212699146214?text=Hi%20Atay%20Studio,%20I%20saw%20your%20work%20and%20I%27d%20like%20to%20talk%20about%20a%20project." target="_blank" rel="noopener">WhatsApp</a></div>
 </div>
</main>
<footer><div class="wrap"><span>© Atay Studio · Ayoub Ouazzou · Marrakech, Morocco</span><span><a href="/">atayknight.com</a> · <a href="https://www.instagram.com/atay_knight/" target="_blank" rel="noopener">Instagram</a> · <a href="https://vimeo.com/ayoubouazzou" target="_blank" rel="noopener">Vimeo</a></span></div></footer>
<script>
(()=>{{const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const RM=matchMedia("(prefers-reduced-motion: reduce)").matches,HOVER=matchMedia("(hover: hover) and (pointer: fine)").matches;
 /* theme */
 $(".th").addEventListener("click",()=>{{const d=document.documentElement,n=d.getAttribute("data-theme")==="dark"?"light":"dark";d.setAttribute("data-theme",n);try{{localStorage.setItem("atay-theme",n)}}catch(e){{}}}});
 /* masonry: each card spans as many 2px rows as it is tall */
 const ro=new ResizeObserver(es=>es.forEach(e=>{{const el=e.target;if(!el.hidden)el.style.gridRowEnd="span "+Math.max(1,Math.ceil(el.getBoundingClientRect().height/2))}}));
 $$(".wc").forEach(c=>ro.observe(c));
 /* filters */
 let cat="all",fm="all";
 const apply=()=>{{let any=false;$$(".cat").forEach(s=>{{let n=0;$$(".wc",s).forEach(c=>{{const ok=fm==="all"||c.dataset.f===fm;c.hidden=!ok;if(ok)n++}});s.hidden=!(cat==="all"||s.dataset.cat===cat)||!n;if(!s.hidden)any=true}});$(".empty").hidden=any;
  $$(".chips button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.k===cat));$$(".seg button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.f===fm));
  try{{history.replaceState(null,"",cat==="all"?location.pathname:"#"+cat)}}catch(e){{}}}};
 $(".chips").addEventListener("click",e=>{{const b=e.target.closest("button");if(!b)return;cat=b.dataset.k;apply();b.scrollIntoView({{block:"nearest",inline:"center",behavior:RM?"auto":"smooth"}});const t=$(".hero");scrollTo({{top:t.offsetTop+t.offsetHeight-60,behavior:RM?"auto":"smooth"}})}});
 $(".seg").addEventListener("click",e=>{{const b=e.target.closest("button");if(!b)return;fm=b.dataset.f;apply()}});
 const h=location.hash.slice(1);if(["film","travel","ad","vfx"].includes(h)){{cat=h;apply()}}
 /* hover previews */
 if(HOVER&&!RM)$$(".wc").forEach(c=>{{const v=$("video",c);if(!v)return;c.addEventListener("pointerenter",()=>{{if(!v.src)v.src=v.dataset.src;v.play().then(()=>c.classList.add("play")).catch(()=>{{}})}});c.addEventListener("pointerleave",()=>{{v.pause();c.classList.remove("play")}})}});
}})();
</script>
</body>
</html>
'''
out = os.path.join(ROOT, 'public/work/index.html')
open(out, 'w', encoding='utf-8').write(page)
print('wrote', out, len(P), 'projects')
