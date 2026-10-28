/* ATAY STUDIO · interactive proposals
   #edit          -> Ayoub's builder (prices, items, add-ons per client, makes the link)
   #p=…&g=…       -> the client's proposal: sliders + toggles, live total, accept on WhatsApp
   Everything lives in the link; nothing is stored on a server. */
(()=>{
const WA_NUM="212699146214";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const app=$("#app");

/* ---------- catalogue (Ayoub can override prices in the builder) ---------- */
const CAT={
 reel:{n:["Social reel","Reel réseaux sociaux","ريل للشبكات الاجتماعية"],d:["A 30 to 90 second vertical video for Instagram, TikTok or Reels.","Une vidéo verticale de 30 à 90 secondes pour Instagram, TikTok ou Reels.","فيديو عمودي من 30 إلى 90 ثانية لإنستغرام وتيك توك."],u:[["reel","reels"],["reel","reels"],["ريل","ريلز"]],p:2500,q:3,a:1,b:12,ad:{mg:1,vfx:0,sub:0,fmt:0}},
 film:{n:["Brand film","Film de marque","فيلم للعلامة"],d:["A 1 to 3 minute film that tells your story, for web, screens and events.","Un film de 1 à 3 minutes qui raconte votre histoire, pour le web, les écrans et les événements.","فيلم من دقيقة إلى 3 دقائق يحكي قصتك، للويب والشاشات والفعاليات."],u:[["film","films"],["film","films"],["فيلم","أفلام"]],p:9000,q:1,a:1,b:3,ad:{mg:0,vfx:0,drone:0,vo:0,sub:0}},
 shoot:{n:["Shoot day","Jour de tournage","يوم تصوير"],d:["Ayoub as Director of Photography with the full camera kit, up to 10 hours on location.","Ayoub en directeur photo avec tout le matériel caméra, jusqu’à 10 heures sur place.","أيوب كمدير تصوير مع كامل معدات الكاميرا، حتى 10 ساعات في الموقع."],u:[["day","days"],["jour","jours"],["يوم","أيام"]],p:4500,q:1,a:1,b:10,ad:{drone:0,light:0,asst:0}},
 edit:{n:["Edit of your footage","Montage de vos images","مونتاج لقطاتك"],d:["You send the footage, we cut it into a finished video with music.","Vous envoyez les images, nous les montons en vidéo finie avec musique.","ترسل اللقطات ونحوّلها إلى فيديو جاهز مع الموسيقى."],u:[["video","videos"],["vidéo","vidéos"],["فيديو","فيديوهات"]],p:2000,q:1,a:1,b:10,ad:{grade:0,sound:0,mg:0,sub:0}},
 grade:{n:["Colour grading","Étalonnage","تدريج الألوان"],d:["A cinematic colour grade on your finished edit.","Un étalonnage cinéma sur votre montage final.","تدريج ألوان سينمائي لمونتاجك النهائي."],u:[["video","videos"],["vidéo","vidéos"],["فيديو","فيديوهات"]],p:1200,q:1,a:1,b:10,ad:{}},
 vfx3d:{n:["3D / VFX shot","Plan 3D / VFX","لقطة ثلاثية الأبعاد / مؤثرات"],d:["A 3D or visual effects shot: logo reveal, product in 3D, sky replacement, clean-up.","Un plan 3D ou effets visuels : logo animé, produit en 3D, remplacement de ciel, nettoyage.","لقطة ثلاثية الأبعاد أو مؤثرات: ظهور الشعار، منتج ثلاثي الأبعاد، استبدال السماء، تنظيف اللقطة."],u:[["shot","shots"],["plan","plans"],["لقطة","لقطات"]],p:1500,q:2,a:1,b:20,ad:{}},
 photo:{n:["Photo set","Série photo","جلسة صور"],d:["20 edited photos from the shoot, ready for web and print.","20 photos retouchées du tournage, prêtes pour le web et l’impression.","20 صورة معدّلة من التصوير، جاهزة للويب والطباعة."],u:[["set","sets"],["série","séries"],["جلسة","جلسات"]],p:2500,q:1,a:1,b:5,ad:{}}
};
const ADD={mg:{n:["Motion graphics","Motion design","موشن جرافيك"],p:800},vfx:{n:["Visual effects (VFX)","Effets visuels (VFX)","مؤثرات بصرية"],p:1500},sub:{n:["Subtitles","Sous-titres","ترجمة مكتوبة"],p:300},fmt:{n:["Extra format (16:9 or 1:1)","Format en plus (16:9 ou 1:1)","مقاس إضافي (16:9 أو 1:1)"],p:400},drone:{n:["Drone shots","Plans drone","لقطات بالدرون"],p:1500},vo:{n:["Voice-over","Voix off","تعليق صوتي"],p:1200},light:{n:["Lighting kit","Kit lumière","معدات الإضاءة"],p:1000},asst:{n:["Camera assistant","Assistant caméra","مساعد كاميرا"],p:800},grade:{n:["Colour grading","Étalonnage","تدريج الألوان"],p:800},sound:{n:["Sound design","Sound design","تصميم صوتي"],p:600}};
const LI={en:0,fr:1,ar:2};
/* Ayoub's own default prices, saved in his browser */
const myPrices=(()=>{try{return JSON.parse(store.get("atq:prices")||"{}")}catch(e){return{}}})();
const catP=k=>myPrices["i:"+k]??CAT[k].p, addP=k=>myPrices["a:"+k]??ADD[k].p;

/* ---------- words ---------- */
const W={
 en:{eye:"Proposal",valid:"Valid until {d}",hi:"A proposal for {c}",build:"Build your package",buildL:"Slide and tap to choose exactly what you need. The total updates as you go.",per:"per {u}",once:"once",inc:"Included",opt:"Add",on:"Added",notinc:"Not included",sum:"Your package",sub:"Subtotal",disc:"Discount {n}%",total:"Total",dep:"{n}% to start",revs:"{n} rounds of changes included",rev1:"1 round of changes included",accept:"Accept on WhatsApp",call:"Questions? Book a call",pdf:"Save as PDF",empty:"Choose at least one item to continue.",thanks:"Thank you!",thanksL:"Your choice is on its way to Ayoub on WhatsApp. He’ll confirm and send you the next steps.",next:"What happens next",from:"Ayoub Ouazzou",role:"Director of Photography · Atay Studio",expired:"This proposal expired on {d}. Message Ayoub for an updated one.",ask:"Ask for an update",less:"Fewer",more:"More",wa1:"Hi Ayoub, I accept proposal {id}{t}:",waT:"Total: {x}",waD:"To start: {x}",waL:"My selection: {l}",subT:"Subtotal",none:"No proposal here",noneL:"This page shows proposals from Atay Studio. Ask Ayoub for your personal link.",back:"Visit the studio",note:"Hi {c}, thanks for the call. Here is what I suggest for your project. Move the sliders to adjust it, the price updates as you go. When you’re happy, accept it on WhatsApp and we’ll start.",
  steps:[["Pre-production","Moodboard, shot list, locations and crew, all set before the shoot."],["The shoot","Ayoub films on location with the crew and gear the project needs."],["Edit and first cut","You watch the first cut and send your notes."],["Colour, sound and VFX","The final look: grade, sound, motion graphics and effects."],["Delivery","Final files in every format you need, ready to post."]]},
 fr:{eye:"Proposition",valid:"Valable jusqu’au {d}",hi:"Une proposition pour {c}",build:"Composez votre offre",buildL:"Faites glisser et touchez pour choisir exactement ce qu’il vous faut. Le total se met à jour en direct.",per:"par {u}",once:"une fois",inc:"Inclus",opt:"Ajouter",on:"Ajouté",notinc:"Non inclus",sum:"Votre offre",sub:"Sous-total",disc:"Remise {n} %",total:"Total",dep:"{n} % pour démarrer",revs:"{n} séries de retouches incluses",rev1:"1 série de retouches incluse",accept:"Accepter sur WhatsApp",call:"Des questions ? Réservez un appel",pdf:"Enregistrer en PDF",empty:"Choisissez au moins un élément pour continuer.",thanks:"Merci !",thanksL:"Votre choix part chez Ayoub sur WhatsApp. Il confirme et vous envoie la suite.",next:"La suite",from:"Ayoub Ouazzou",role:"Directeur photo · Atay Studio",expired:"Cette proposition a expiré le {d}. Écrivez à Ayoub pour une mise à jour.",ask:"Demander une mise à jour",less:"Moins",more:"Plus",wa1:"Bonjour Ayoub, j’accepte la proposition {id}{t} :",waT:"Total : {x}",waD:"Pour démarrer : {x}",waL:"Ma sélection : {l}",subT:"Sous-total",none:"Aucune proposition ici",noneL:"Cette page affiche les propositions d’Atay Studio. Demandez votre lien personnel à Ayoub.",back:"Voir le studio",note:"Bonjour {c}, merci pour l’appel. Voici ce que je propose pour votre projet. Ajustez avec les curseurs, le prix se met à jour en direct. Quand tout vous convient, acceptez sur WhatsApp et on démarre.",
  steps:[["Pré-production","Moodboard, découpage, lieux et équipe, tout est prêt avant le tournage."],["Le tournage","Ayoub filme sur place avec l’équipe et le matériel du projet."],["Montage et premier jet","Vous voyez le premier montage et envoyez vos retours."],["Couleur, son et VFX","Le rendu final : étalonnage, son, motion design et effets."],["Livraison","Les fichiers finaux dans tous les formats utiles, prêts à publier."]]},
 ar:{eye:"عرض",valid:"صالح حتى {d}",hi:"عرض مقدَّم إلى {c}",build:"اختر باقتك",buildL:"حرّك واضغط لتختار ما تحتاجه بالضبط. يتحدث المجموع مباشرة.",per:"لكل {u}",once:"مرة واحدة",inc:"مشمول",opt:"إضافة",on:"مُضاف",notinc:"غير مشمول",sum:"باقتك",sub:"المجموع الفرعي",disc:"خصم {n}٪",total:"المجموع",dep:"{n}٪ للبدء",revs:"{n} جولات تعديل مشمولة",rev1:"جولة تعديل واحدة مشمولة",accept:"الموافقة عبر واتساب",call:"أسئلة؟ احجز مكالمة",pdf:"حفظ كملف PDF",empty:"اختر عنصراً واحداً على الأقل للمتابعة.",thanks:"شكراً لك!",thanksL:"اختيارك في طريقه إلى أيوب عبر واتساب. سيؤكد ويرسل لك الخطوات التالية.",next:"الخطوات التالية",from:"أيوب وعزو",role:"مدير التصوير · Atay Studio",expired:"انتهت صلاحية هذا العرض في {d}. راسل أيوب للحصول على عرض محدّث.",ask:"اطلب تحديثاً",less:"أقل",more:"أكثر",wa1:"مرحباً أيوب، أوافق على العرض {id}{t}:",waT:"المجموع: {x}",waD:"للبدء: {x}",waL:"اختياري: {l}",subT:"المجموع الفرعي",none:"لا يوجد عرض هنا",noneL:"تعرض هذه الصفحة عروض Atay Studio. اطلب رابطك الخاص من أيوب.",back:"زيارة الاستوديو",note:"مرحباً {c}، شكراً على المكالمة. هذا ما أقترحه لمشروعك. حرّك المؤشرات لتعديله وسيتحدث السعر مباشرة. عندما يناسبك، وافق عبر واتساب ونبدأ.",
  steps:[["ما قبل الإنتاج","لوحة الإلهام وقائمة اللقطات والمواقع والفريق، كل شيء جاهز قبل التصوير."],["التصوير","يصوّر أيوب في الموقع مع الفريق والمعدات التي يحتاجها المشروع."],["المونتاج والنسخة الأولى","تشاهد النسخة الأولى وترسل ملاحظاتك."],["الألوان والصوت والمؤثرات","اللمسة النهائية: تدريج الألوان والصوت والموشن والمؤثرات."],["التسليم","الملفات النهائية بكل الصيغ التي تحتاجها، جاهزة للنشر."]]}
};
const tr=(l,k,v={})=>String(W[l][k]).replace(/\{(\w+)\}/g,(_,x)=>v[x]??"");
const LOC={en:"en-GB",fr:"fr-FR",ar:"ar-MA"};
function money(n,P){const v=Math.round(n),l=P.l||"en";
 if((P.cur||"MAD")==="MAD"){const s=new Intl.NumberFormat(LOC[l],{maximumFractionDigits:0}).format(v);return l==="ar"?s+" درهم":s+" DH"}
 try{return new Intl.NumberFormat(LOC[l],{style:"currency",currency:P.cur,maximumFractionDigits:0}).format(v)}catch(e){return v+" "+P.cur}}
const fmtDate=(iso,l)=>{try{return new Intl.DateTimeFormat(LOC[l],{day:"numeric",month:"long",year:"numeric"}).format(new Date(iso+"T12:00:00"))}catch(e){return iso}};
const nm=(it,l)=>it.n||(CAT[it.k]?CAT[it.k].n[LI[l]]:"Item");
const ds=(it,l)=>it.d??(CAT[it.k]?CAT[it.k].d[LI[l]]:"");
const un=(it,l,q)=>{const u=it.u?[it.u,it.u]:(CAT[it.k]?CAT[it.k].u[LI[l]]:["unit","units"]);return q===1?u[0]:u[1]};
const an=(ad,l)=>ad.n||(ADD[ad.k]?ADD[ad.k].n[LI[l]]:"Extra");

/* ---------- link encoding + signature ---------- */
const b64e=s=>{const b=new TextEncoder().encode(s);let x="";b.forEach(c=>x+=String.fromCharCode(c));return btoa(x).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")};
const b64d=s=>{s=s.replace(/-/g,"+").replace(/_/g,"/");const x=atob(s);return new TextDecoder().decode(Uint8Array.from(x,c=>c.charCodeAt(0)))};
function keyOf(){let k=store.get("atq:key");if(!k){const a=new Uint8Array(18);crypto.getRandomValues(a);k=[...a].map(x=>x.toString(36).padStart(2,"0")).join("").slice(0,24);store.set("atq:key",k)}return k}
const sign=pl=>SHA.hmac(keyOf(),pl).slice(0,16);
function pack(P){const o={v:1,id:P.id,c:P.c,cn:P.cn||undefined,t:P.t||undefined,note:P.note||undefined,l:P.l,cur:P.cur,exp:P.exp||undefined,dep:P.dep,disc:P.disc||undefined,rev:P.rev,
  it:P.it.map(it=>{const x={k:it.k,p:+it.p,q:+it.q,a:+it.a,b:+it.b};if(it.n)x.n=it.n;if(it.d!=null&&it.d!=="")x.d=it.d;if(it.u)x.u=it.u;if(it.lk)x.lk=1;
   x.ad=it.ad.filter(a=>a.s>=0).map(a=>{const y={k:a.k,p:+a.p,s:+a.s};if(a.n)y.n=a.n;if(a.o)y.o=1;return y});if(!x.ad.length)delete x.ad;return x})};
 return b64e(JSON.stringify(o))}
function unpack(s){const o=JSON.parse(b64d(s));o.it=(o.it||[]).map(it=>({...it,ad:it.ad||[]}));return o}
const BASE=()=>/atayknight\.com$/.test(location.hostname)?location.origin+"/quote/":location.href.split("#")[0];
function linkFor(P){const pl=pack(P);return BASE()+"#p="+pl+"&g="+sign(pl)}

/* ---------- maths ---------- */
const defSel=P=>({q:P.it.map(it=>+it.q),a:P.it.map(it=>it.ad.map(a=>a.s>=1))});
function calc(P,S){let sub=0;const lines=P.it.map((it,i)=>{const q=S.q[i];let t=0;const on=[];
  if(q>0){t=q*it.p;it.ad.forEach((a,j)=>{if(S.a[i][j]){t+=a.o?+a.p:a.p*q;on.push(a)}})}sub+=t;return{q,t,on}});
 const disc=Math.round(sub*(+P.disc||0)/100),total=sub-disc,dep=Math.round(total*(+P.dep||0)/100);return{lines,sub,disc,total,dep}}
const selStr=S=>S.q.map((q,i)=>q+"-"+S.a[i].map(b=>b?1:0).join("")).join(".");
function selParse(s,P){try{const S=defSel(P);s.split(".").forEach((p,i)=>{if(i>=P.it.length)return;const [q,b]=p.split("-");const it=P.it[i];S.q[i]=Math.max(+it.a,Math.min(+it.b,+q||0));(b||"").split("").forEach((c,j)=>{if(j<S.a[i].length&&it.ad[j].s<2)S.a[i][j]=c==="1"})});return S}catch(e){return defSel(P)}}

/* ---------- theme ---------- */
const de=document.documentElement;
function theme(t){if(!t){t=store.get("atay-theme");if(t!=="dark"&&t!=="light")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}de.setAttribute("data-theme",t)}
theme();
const ICON='<i class="q-ic" aria-hidden="true"></i>';
const MOON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="currentColor"/></svg>';
const WA_I='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z"/></svg>';

/* ======================================================================
   CLIENT VIEW
   ====================================================================== */
function renderClient(root,P,opt={}){
 const l=P.l||"en",T=(k,v)=>tr(l,k,v),S=opt.sel||defSel(P);
 const today=new Date().toISOString().slice(0,10),expired=P.exp&&P.exp<today&&!opt.preview;
 root.classList.add("q-root");root.classList.toggle("pv",!!opt.preview);root.setAttribute("dir",l==="ar"?"rtl":"ltr");root.setAttribute("lang",l);
 const note=(P.note&&P.note.trim())?P.note:T("note",{c:P.cn||P.c||""});
 const card=(it,i)=>{const q=S.q[i],fixed=it.lk||+it.a===+it.b,pct=fixed?100:((q-it.a)/((it.b-it.a)||1))*100;
  return `<article class="q-card${q===0?" off":""}" data-i="${i}" style="--d:${i*70}ms">
   <div class="q-ch"><div><h3>${esc(nm(it,l))}</h3><p>${esc(ds(it,l))}</p></div>
    <span class="q-pr"><b>${money(it.p,P)}</b><small>${T("per",{u:un(it,l,1)})}</small></span></div>
   ${fixed?`<p class="q-fix"><b>${q}</b> ${esc(un(it,l,q))}</p>`:
   `<div class="q-qty"><button type="button" class="q-st" data-d="-1" aria-label="${T("less")}">−</button>
     <output class="q-n"><b data-q>${q}</b> <span data-u>${esc(un(it,l,q))}</span></output>
     <button type="button" class="q-st" data-d="1" aria-label="${T("more")}">+</button>
     <input type="range" min="${it.a}" max="${it.b}" step="1" value="${q}" style="--f:${pct}%" aria-label="${esc(nm(it,l))}">
     <div class="q-ticks"><span>${it.a}</span><span>${it.b}</span></div></div>`}
   ${it.ad.length?`<div class="q-adds">${it.ad.map((a,j)=>{const inc=+a.s===2,on=S.a[i][j];
     return `<button type="button" class="q-ad${on?" on":""}${inc?" inc":""}" data-j="${j}" aria-pressed="${on}" ${inc?"aria-disabled=\"true\"":""}>
      <span class="q-ck" aria-hidden="true"></span><span class="q-an">${esc(an(a,l))}</span>
      <small>${inc?T("inc"):"+"+money(a.p,P)+" "+(a.o?T("once"):T("per",{u:un(it,l,1)}))}</small></button>`}).join("")}</div>`:""}
   <div class="q-cf"><span>${q===0?T("notinc"):T("subT")}</span><b data-st>${money(calc(P,S).lines[i].t,P)}</b></div></article>`};
 root.innerHTML=`
 ${opt.badge||""}
 <header class="q-top"><a class="q-brand" href="${opt.preview?"#":"/"}" ${opt.preview?'tabindex="-1"':""}>${ICON}<b>Atay Studio</b></a>
  <div class="q-tools">${opt.preview?"":`<div class="q-lang" role="group">${["en","fr","ar"].map(x=>`<button type="button" data-l="${x}" aria-pressed="${x===l}">${x==="ar"?"ع":x.toUpperCase()}</button>`).join("")}</div>
  <button type="button" class="q-th" aria-label="Dark mode">${MOON}</button>`}</div></header>
 <section class="q-hero q-w">
  <p class="q-eye">${T("eye")} · ${esc(P.id||"")}${P.exp?" · "+T("valid",{d:fmtDate(P.exp,l)}):""}</p>
  <h1>${T("hi",{c:`<em>${esc(P.c||"…")}</em>`})}</h1>
  ${P.t?`<p class="q-proj">${esc(P.t)}</p>`:""}
  <figure class="q-note"><img src="${opt.img||"../img/portrait.webp"}" alt="" width="52" height="52" onerror="this.style.visibility='hidden'">
   <div><blockquote>${esc(note).replace(/\n/g,"<br>")}</blockquote><figcaption><b>${T("from")}</b> · ${T("role")}</figcaption></div></figure>
  ${expired?`<p class="q-exp">${T("expired",{d:fmtDate(P.exp,l)})}</p>`:""}
 </section>
 <section class="q-build q-w">
  <div class="q-main"><h2>${T("build")}</h2><p class="q-bl">${T("buildL")}</p><div class="q-items">${P.it.map(card).join("")}</div></div>
  <aside class="q-sum" aria-live="polite"><div class="q-sc">
   <h3>${T("sum")}</h3><ul class="q-lines"></ul>
   <div class="q-tl"><div class="q-row q-subr"><span>${T("sub")}</span><b data-sub></b></div>
    ${+P.disc?`<div class="q-row q-dr"><span>${T("disc",{n:P.disc})}</span><b data-disc></b></div>`:""}
    <div class="q-big"><span>${T("total")}</span><b data-total></b></div>
    ${+P.dep?`<p class="q-dep">${T("dep",{n:P.dep})}${l==="fr"?" :":l==="ar"?":":":"} <b data-dep></b></p>`:""}
    ${P.rev!=null&&P.rev!==""?`<p class="q-rev">${+P.rev===1?T("rev1"):T("revs",{n:P.rev})}</p>`:""}</div>
   <button type="button" class="q-acc"${expired?" disabled":""}>${WA_I}<span>${T("accept")}</span></button>
   ${expired?`<a class="q-sec" href="https://wa.me/${WA_NUM}?text=${encodeURIComponent((P.id||"")+" · "+T("ask"))}" target="_blank" rel="noopener">${T("ask")}</a>`:`<a class="q-sec" href="/#book" ${opt.preview?'tabindex="-1"':""}>${T("call")}</a>`}
   <button type="button" class="q-pdf">${T("pdf")}</button>
   <p class="q-err" hidden>${T("empty")}</p></div></aside>
 </section>
 <div class="q-bar"><div><span>${T("total")}</span><b data-total2></b></div><button type="button" class="q-acc2"${expired?" disabled":""}>${WA_I}<span>${T("accept")}</span></button></div>
 <footer class="q-foot q-w"><span>${ICON} Atay Studio · Marrakech</span><a href="/" ${opt.preview?'tabindex="-1"':""}>atayknight.com</a></footer>`;

 let shown=null;
 const tween=(el,to)=>{if(!el)return;const from=+el.dataset.v||0;el.dataset.v=to;if(matchMedia("(prefers-reduced-motion: reduce)").matches||from===to||!shown){el.textContent=money(to,P);return}
  const t0=performance.now(),d=420;const step=t=>{const k=Math.min(1,(t-t0)/d),e=1-Math.pow(1-k,3);el.textContent=money(from+(to-from)*e,P);if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)};
 function update(){const C=calc(P,S);
  $$(".q-card",root).forEach((c,i)=>{const q=S.q[i];c.classList.toggle("off",q===0);const st=$("[data-st]",c);st.textContent=money(C.lines[i].t,P);
   const qb=$("[data-q]",c);if(qb){qb.textContent=q;$("[data-u]",c).textContent=un(P.it[i],l,q)}
   const r=$("input[type=range]",c);if(r){r.value=q;r.style.setProperty("--f",((q-P.it[i].a)/((P.it[i].b-P.it[i].a)||1))*100+"%")}
   $(".q-cf span",c).textContent=q===0?T("notinc"):T("subT");
   $$(".q-ad",c).forEach((b,j)=>{b.classList.toggle("on",S.a[i][j]);b.setAttribute("aria-pressed",S.a[i][j])})});
  $(".q-lines",root).innerHTML=P.it.map((it,i)=>{const L=C.lines[i];if(!L.q)return"";
   return `<li><div><b>${L.q} × ${esc(nm(it,l))}</b>${L.on.length?`<small>+ ${L.on.map(a=>esc(an(a,l))).join(", ")}</small>`:""}</div><span>${money(L.t,P)}</span></li>`}).join("");
  tween($("[data-sub]",root),C.sub);tween($("[data-disc]",root),-C.disc);tween($("[data-total]",root),C.total);tween($("[data-total2]",root),C.total);tween($("[data-dep]",root),C.dep);
  const none=C.total<=0;$$(".q-acc,.q-acc2",root).forEach(b=>b.classList.toggle("dim",none));shown=true;opt.onChange&&opt.onChange(S,C)}
 update();
 root.oninput=e=>{const r=e.target.closest("input[type=range]");if(!r)return;const i=+r.closest(".q-card").dataset.i;S.q[i]=+r.value;update()};
 root.onclick=e=>{const st=e.target.closest(".q-st");if(st){const i=+st.closest(".q-card").dataset.i,it=P.it[i];S.q[i]=Math.max(+it.a,Math.min(+it.b,S.q[i]+ +st.dataset.d));update();return}
  const ad=e.target.closest(".q-ad");if(ad&&!ad.classList.contains("inc")){const i=+ad.closest(".q-card").dataset.i,j=+ad.dataset.j;if(S.q[i]===0)S.q[i]=Math.max(1,+P.it[i].a);S.a[i][j]=!S.a[i][j];update();return}
  const lg=e.target.closest("[data-l]");if(lg){P.l=lg.dataset.l;renderClient(root,P,{...opt,sel:S});return}
  if(e.target.closest(".q-th")){const n=de.getAttribute("data-theme")==="dark"?"light":"dark";store.set("atay-theme",n);theme(n);return}
  if(e.target.closest(".q-pdf")){if(opt.preview)return;print();return}
  if(e.target.closest(".q-acc,.q-acc2")){if(opt.preview)return;accept(root,P,S);return}};
 return S}

function accept(root,P,S){const l=P.l||"en",T=(k,v)=>tr(l,k,v),C=calc(P,S);
 if(C.total<=0){const er=$(".q-err",root);er.hidden=false;$(".q-sum",root).scrollIntoView({behavior:"smooth",block:"center"});setTimeout(()=>er.hidden=true,3500);return}
 const link=location.href.split("#")[0]+"#"+new URLSearchParams(location.hash.slice(1)).toString().replace(/&?s=[^&]*/,"")+"&s="+selStr(S);
 const lines=P.it.map((it,i)=>{const L=C.lines[i];if(!L.q)return null;return "• "+L.q+" × "+nm(it,l)+(L.on.length?" (+ "+L.on.map(a=>an(a,l)).join(", ")+")":"")+": "+money(L.t,P)}).filter(Boolean);
 const msg=[T("wa1",{id:P.id||"",t:P.t?" · "+P.t:""}),...lines,"",(+P.disc?T("disc",{n:P.disc})+": -"+money(C.disc,P)+"\n":"")+T("waT",{x:money(C.total,P)}),+P.dep?T("waD",{x:money(C.dep,P)}):"","",T("waL",{l:link})].filter((x,i,a)=>!(x===""&&a[i-1]==="")).join("\n");
 window.open("https://wa.me/"+WA_NUM+"?text="+encodeURIComponent(msg),"_blank","noopener");
 const sh=document.createElement("div");sh.className="q-thx";sh.setAttribute("role","dialog");sh.setAttribute("aria-modal","true");
 sh.innerHTML=`<div class="q-tc" dir="${l==="ar"?"rtl":"ltr"}"><span class="q-ok">✓</span><h2>${T("thanks")}</h2><p>${T("thanksL")}</p>
  <h3>${T("next")}</h3><ol>${W[l].steps.map(([h,p],i)=>`<li style="--d:${200+i*90}ms"><b>${h}</b><span>${p}</span></li>`).join("")}</ol>
  <button type="button" class="q-close">OK</button></div>`;
 document.body.appendChild(sh);sh.addEventListener("click",e=>{if(e.target===sh||e.target.closest(".q-close"))sh.remove()});$(".q-close",sh).focus()}

/* ======================================================================
   BUILDER (Ayoub)
   ====================================================================== */
const newId=()=>{const a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let s="";const r=new Uint8Array(4);crypto.getRandomValues(r);r.forEach(x=>s+=a[x%a.length]);return s};
const plus=d=>{const t=new Date();t.setDate(t.getDate()+d);return t.toISOString().slice(0,10)};
function mkItem(k){const c=CAT[k];if(!c)return{k:"x",n:"New item",d:"",u:"",p:1000,q:1,a:1,b:5,lk:0,ad:[]};
 return{k,p:catP(k),q:c.q,a:c.a,b:c.b,lk:0,ad:Object.keys(ADD).map(a=>({k:a,p:addP(a),s:a in c.ad?c.ad[a]:-1,o:0}))}}
function blank(){return{id:newId(),c:"",cn:"",t:"",note:"",l:"en",cur:"MAD",exp:plus(14),dep:50,disc:0,rev:2,ph:"",it:[mkItem("reel"),mkItem("shoot")]}}
function full(P){/* re-attach every add-on so the builder can switch them on */P.it.forEach(it=>{if(!CAT[it.k])return;const have=it.ad.map(a=>a.k);Object.keys(ADD).forEach(a=>{if(!have.includes(a))it.ad.push({k:a,p:addP(a),s:-1,o:0})})});return P}
const hist=()=>{try{return JSON.parse(store.get("atq:hist")||"[]")}catch(e){return[]}};

function builder(start){
 document.title="Proposal builder · Atay Studio";de.classList.add("is-ed");de.setAttribute("dir","ltr");
 let P=start||(()=>{try{const d=JSON.parse(store.get("atq:draft")||"null");if(d&&d.it)return d}catch(e){}return blank()})();
 let dev="desk",tab="edit";
 app.innerHTML=`<header class="e-top"><div class="e-tt">${ICON}<div><b>Proposal builder</b><span>Only you see this page. Clients only get the link.</span></div></div>
  <div class="e-tb"><button type="button" class="e-btn" data-act="new">New proposal</button><button type="button" class="e-btn" data-act="hist">Sent <i class="e-hn"></i></button></div></header>
  <div class="e-tabs" role="tablist"><button type="button" role="tab" data-tab="edit" aria-selected="true">Edit</button><button type="button" role="tab" data-tab="prev" aria-selected="false">Preview</button></div>
  <div class="e-wrap"><form class="e-form" autocomplete="off" onsubmit="return false"></form>
   <div class="e-pv"><div class="e-pvt"><span>Live preview</span><div class="e-seg"><button type="button" data-dev="desk" aria-pressed="true">Desktop</button><button type="button" data-dev="phone" aria-pressed="false">Phone</button></div></div>
    <div class="e-frame"><div class="e-scr"></div></div></div></div>
  <div class="e-act"><div class="e-tot"><span>Default total</span><b></b></div>
   <button type="button" class="e-btn" data-act="copy">Copy link</button><button type="button" class="e-btn" data-act="mail">Email</button>
   <button type="button" class="e-btn e-pri" data-act="wa">${WA_I} Send on WhatsApp</button><button type="button" class="e-btn" data-act="open">Open as client</button></div>
  <div class="e-toast" role="status" aria-live="polite"></div><div class="e-modal" hidden></div>`;
 const form=$(".e-form"),scr=$(".e-scr");
 const opts=(arr,v)=>arr.map(([k,t])=>`<option value="${k}"${String(v)===String(k)?" selected":""}>${t}</option>`).join("");
 const L=P=>P.l||"en";
 function formHTML(){const l=L(P);return `
  <section class="e-sec"><h2>Client</h2>
   <label>Client or company<input data-f="c" value="${esc(P.c)}" placeholder="e.g. Visit Beni Mellal" required></label>
   <label>Contact name <em>used in the greeting</em><input data-f="cn" value="${esc(P.cn||"")}" placeholder="e.g. Kenza"></label>
   <label>Project<input data-f="t" value="${esc(P.t)}" placeholder="e.g. Summer campaign 2027"></label>
   <label>Client WhatsApp <em>optional, with country code</em><input data-f="ph" inputmode="tel" value="${esc(P.ph||"")}" placeholder="+212 6…"></label>
   <label>Your message <em>leave empty to use the standard one</em><textarea data-f="note" rows="4" placeholder="${esc(tr(l,"note",{c:P.cn||P.c||"…"}))}">${esc(P.note)}</textarea></label></section>
  <section class="e-sec"><h2>Terms</h2>
   <div class="e-row"><label>Language<select data-f="l">${opts([["en","English"],["fr","Français"],["ar","العربية"]],P.l)}</select></label>
    <label>Currency<select data-f="cur">${opts([["MAD","Dirham (DH)"],["EUR","Euro (€)"],["USD","Dollar ($)"]],P.cur)}</select></label></div>
   <div class="e-row"><label>Valid until<input type="date" data-f="exp" value="${esc(P.exp)}"></label>
    <label>Rounds of changes<input type="number" min="0" max="9" data-f="rev" data-n value="${esc(P.rev)}"></label></div>
   <label class="e-rng">Deposit to start <b>${P.dep}%</b><input type="range" min="0" max="100" step="10" data-f="dep" data-n value="${P.dep}"></label>
   <label class="e-rng">Discount <b>${P.disc||0}%</b><input type="range" min="0" max="50" step="5" data-f="disc" data-n value="${P.disc||0}"></label></section>
  <section class="e-sec"><h2>What the client can choose</h2><p class="e-hint">Set the amount they start with and the range they can slide between. Put the minimum at 0 to make an item optional.</p>
   <div class="e-items">${P.it.map((it,i)=>itemHTML(it,i)).join("")}</div>
   <div class="e-add"><select class="e-newk">${opts([...Object.keys(CAT).map(k=>[k,CAT[k].n[0]]),["x","Custom item…"]],"")}</select><button type="button" class="e-btn" data-act="additem">+ Add item</button></div></section>
  <section class="e-sec"><h2>Your prices</h2><p class="e-hint">Save the prices above as your standard rates. New proposals will start with them.</p>
   <div class="e-row2"><button type="button" class="e-btn" data-act="saveprices">Save as my standard prices</button><button type="button" class="e-btn e-ghost" data-act="resetprices">Back to the original prices</button></div></section>
  <section class="e-sec e-sm"><h2>Security</h2><p class="e-hint">Each link is signed with your private key. When a client sends their link back, open it on this device: it shows a green check if the prices are the ones you sent, or a warning if someone changed them. To check on another device, copy this key there.</p>
   <div class="e-row2"><code class="e-key">${esc(keyOf())}</code><button type="button" class="e-btn e-ghost" data-act="copykey">Copy key</button><button type="button" class="e-btn e-ghost" data-act="pastekey">Use a key from another device</button></div></section>`}
 function itemHTML(it,i){const l=L(P),cat=CAT[it.k];return `<details class="e-it" data-i="${i}" ${it._open!==false?"open":""}>
  <summary><span class="e-in">${i+1}</span><b>${esc(nm(it,l))}</b><span class="e-ip">${money(it.p,P)} · ${it.q} ${esc(un(it,l,+it.q))}</span>
   <span class="e-ib"><button type="button" class="e-ic" data-act="up" aria-label="Move up">↑</button><button type="button" class="e-ic" data-act="down" aria-label="Move down">↓</button><button type="button" class="e-ic e-del" data-act="del" aria-label="Remove">×</button></span></summary>
  <div class="e-ib2">
   <label>Name<input data-f="it.${i}.n" value="${esc(it.n||"")}" placeholder="${esc(cat?cat.n[LI[l]]:"Item name")}"></label>
   <label>Description<textarea rows="2" data-f="it.${i}.d" placeholder="${esc(cat?cat.d[LI[l]]:"What is included")}">${esc(it.d||"")}</textarea></label>
   ${cat?"":`<label>Unit<input data-f="it.${i}.u" value="${esc(it.u||"")}" placeholder="e.g. video"></label>`}
   <div class="e-row4"><label>Price each<input type="number" min="0" step="50" data-f="it.${i}.p" data-n value="${it.p}"></label>
    <label>Starts at<input type="number" min="0" data-f="it.${i}.q" data-n value="${it.q}"></label>
    <label>Min<input type="number" min="0" data-f="it.${i}.a" data-n value="${it.a}"></label>
    <label>Max<input type="number" min="0" data-f="it.${i}.b" data-n value="${it.b}"></label></div>
   <label class="e-sw"><input type="checkbox" data-f="it.${i}.lk" data-b ${it.lk?"checked":""}><span>Fixed amount (no slider)</span></label>
   <div class="e-ads"><p class="e-adh">Extras</p>${it.ad.map((a,j)=>`<div class="e-ad${a.s<0?" no":""}">
     <input data-f="it.${i}.ad.${j}.n" value="${esc(a.n||"")}" placeholder="${esc(ADD[a.k]?ADD[a.k].n[LI[l]]:"Extra name")}" aria-label="Extra name">
     <input type="number" min="0" step="50" data-f="it.${i}.ad.${j}.p" data-n value="${a.p}" aria-label="Price">
     <select data-f="it.${i}.ad.${j}.s" data-n aria-label="Offer">${opts([[-1,"Not offered"],[0,"Client can add"],[1,"Added, can remove"],[2,"Always included"]],a.s)}</select>
     <select data-f="it.${i}.ad.${j}.o" data-n aria-label="Charged">${opts([[0,"per "+un(it,"en",1)],[1,"once"]],a.o?1:0)}</select></div>`).join("")}
    <button type="button" class="e-btn e-ghost e-sm2" data-act="addextra">+ Custom extra</button></div></div></details>`}
 function drawForm(){const y=form.scrollTop;form.innerHTML=formHTML();form.scrollTop=y}
 let pvT;function preview(){clearTimeout(pvT);pvT=setTimeout(()=>{const C=renderClient(scr,JSON.parse(JSON.stringify(P)),{preview:true,img:"../img/portrait.webp",onChange:(S,C)=>{$(".e-tot b").textContent=money(C.total,P)}})},60);store.set("atq:draft",JSON.stringify(P));$(".e-hn").textContent=hist().length||""}
 function setPath(path,v){const ks=path.split(".");let o=P;for(let i=0;i<ks.length-1;i++)o=o[ks[i]];o[ks.at(-1)]=v}
 form.addEventListener("input",e=>{const f=e.target.closest("[data-f]");if(!f)return;let v=f.type==="checkbox"?(f.checked?1:0):f.value;if(f.hasAttribute("data-n"))v=v===""?"":+v;setPath(f.dataset.f,v);
  if(/^it\.\d+\.(a|b|q)$/.test(f.dataset.f)){const it=P.it[+f.dataset.f.split(".")[1]];if(it.b!==""&&it.a!==""&&+it.b<+it.a)it.b=+it.a;if(+it.q>+it.b)it.q=+it.b;if(+it.q<+it.a)it.q=+it.a}
  const lab=f.closest(".e-rng");if(lab)$("b",lab).textContent=v+"%";
  if(f.tagName==="SELECT"&&/\.s$|^l$|^cur$/.test(f.dataset.f)){if(f.dataset.f==="l"||f.dataset.f==="cur")drawForm();else f.closest(".e-ad").classList.toggle("no",+v<0)}
  const s=f.closest(".e-it");if(s&&/\.(n|p|q)$/.test(f.dataset.f)){const it=P.it[+s.dataset.i];$(".e-ib b",s)||0;s.querySelector("summary b").textContent=nm(it,L(P));s.querySelector(".e-ip").textContent=money(it.p,P)+" · "+it.q+" "+un(it,L(P),+it.q)}
  if(/^(c|cn)$/.test(f.dataset.f)){const ta=$('[data-f="note"]');if(ta)ta.placeholder=tr(L(P),"note",{c:P.cn||P.c||"…"})}
  preview()});
 form.addEventListener("toggle",e=>{const d=e.target.closest&&e.target.closest(".e-it");if(d)P.it[+d.dataset.i]._open=d.open},true);
 function toast(t){const el=$(".e-toast");el.textContent=t;el.classList.add("on");clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove("on"),2600)}
 function valid(){if(!P.c.trim()){toast("Add the client’s name first");const i=$('[data-f="c"]');tab="edit";syncTab();i.focus();return false}return true}
 function remember(url){const C=calc(P,defSel(P));const h=hist().filter(x=>x.id!==P.id);h.unshift({id:P.id,c:P.c,t:P.t,d:new Date().toISOString().slice(0,10),total:money(C.total,P),url});store.set("atq:hist",JSON.stringify(h.slice(0,60)));$(".e-hn").textContent=h.length}
 function clean(){const Q=JSON.parse(JSON.stringify(P));Q.it.forEach(it=>delete it._open);return Q}
 const sendText=url=>{const l=L(P);return ({en:`Hi ${P.cn||P.c}, here is your proposal${P.t?" for "+P.t:""}. You can adjust it and see the price live:`,fr:`Bonjour ${P.cn||P.c}, voici votre proposition${P.t?" pour "+P.t:""}. Vous pouvez l’ajuster et voir le prix en direct :`,ar:`مرحباً ${P.cn||P.c}، هذا عرضك${P.t?" لمشروع "+P.t:""}. يمكنك تعديله ورؤية السعر مباشرة:`})[l]+"\n"+url};
 document.addEventListener("click",async e=>{const b=e.target.closest("[data-act],[data-tab],[data-dev]");if(!b||!app.contains(b))return;
  if(b.dataset.tab){tab=b.dataset.tab;syncTab();return}
  if(b.dataset.dev){dev=b.dataset.dev;$$("[data-dev]").forEach(x=>x.setAttribute("aria-pressed",x===b));$(".e-frame").classList.toggle("ph",dev==="phone");return}
  const act=b.dataset.act,itEl=b.closest(".e-it"),i=itEl?+itEl.dataset.i:-1;e.preventDefault();
  if(act==="del"){P.it.splice(i,1);drawForm();preview();return}
  if(act==="up"&&i>0){[P.it[i-1],P.it[i]]=[P.it[i],P.it[i-1]];drawForm();preview();return}
  if(act==="down"&&i<P.it.length-1){[P.it[i+1],P.it[i]]=[P.it[i],P.it[i+1]];drawForm();preview();return}
  if(act==="addextra"){P.it[i].ad.push({k:"x"+Date.now().toString(36),n:"",p:500,s:0,o:0});drawForm();preview();return}
  if(act==="additem"){const k=$(".e-newk").value;P.it.forEach(x=>x._open=false);P.it.push(mkItem(k));drawForm();preview();setTimeout(()=>$$(".e-it").at(-1)?.scrollIntoView({behavior:"smooth",block:"center"}),50);return}
  if(act==="new"){if(!confirmNew())return;P=blank();drawForm();preview();toast("New proposal ready");return}
  if(act==="saveprices"){P.it.forEach(it=>{if(CAT[it.k])myPrices["i:"+it.k]=+it.p;it.ad.forEach(a=>{if(ADD[a.k])myPrices["a:"+a.k]=+a.p})});store.set("atq:prices",JSON.stringify(myPrices));toast("Saved. New proposals start with these prices.");return}
  if(act==="resetprices"){Object.keys(myPrices).forEach(k=>delete myPrices[k]);store.set("atq:prices","{}");toast("Original prices restored for new proposals");return}
  if(act==="copykey"){copy(keyOf());toast("Key copied");return}
  if(act==="pastekey"){const k=prompt("Paste the key from your other device:");if(k&&k.trim().length>=12){store.set("atq:key",k.trim());drawForm();toast("Key updated")}return}
  if(act==="hist"){showHist();return}
  if(["copy","wa","mail","open"].includes(act)){if(!valid())return;const url=linkFor(clean());remember(url);
   if(act==="copy"){copy(url);toast("Link copied. Paste it to your client.")}
   if(act==="open")window.open(url,"_blank","noopener");
   if(act==="wa"){const n=(P.ph||"").replace(/\D/g,"");window.open("https://wa.me/"+(n||"")+"?text="+encodeURIComponent(sendText(url)),"_blank","noopener")}
   if(act==="mail")location.href="mailto:?subject="+encodeURIComponent((P.t||"Proposal")+" · Atay Studio")+"&body="+encodeURIComponent(sendText(url));
   return}});
 function confirmNew(){return !P.c||confirm("Start a new proposal? The current one stays in “Sent” only if you already sent or copied it.")}
 function copy(t){if(navigator.clipboard&&isSecureContext)navigator.clipboard.writeText(t).catch(()=>fallback(t));else fallback(t)}
 function fallback(t){const ta=document.createElement("textarea");ta.value=t;ta.style.cssText="position:fixed;opacity:0";document.body.appendChild(ta);ta.select();try{document.execCommand("copy")}catch(e){}ta.remove()}
 function showHist(){const m=$(".e-modal"),h=hist();m.hidden=false;
  m.innerHTML=`<div class="e-mc" role="dialog" aria-modal="true" aria-label="Sent proposals"><div class="e-mh"><b>Sent proposals</b><button type="button" class="e-ic" data-x aria-label="Close">×</button></div>
   ${h.length?`<ul class="e-hl">${h.map((x,i)=>`<li><div><b>${esc(x.c)}</b><span>${esc(x.t||"")} · ${esc(x.id)} · ${esc(x.d)}</span></div><em>${esc(x.total)}</em>
    <a class="e-btn e-ghost" href="${esc(x.url)}" target="_blank" rel="noopener">View</a><button type="button" class="e-btn e-ghost" data-ld="${i}">Edit</button><button type="button" class="e-btn e-ghost" data-dup="${i}">Duplicate</button></li>`).join("")}</ul>`:`<p class="e-hint">Nothing sent yet. Proposals appear here when you copy or send a link.</p>`}</div>`;
  m.onclick=e=>{if(e.target===m||e.target.closest("[data-x]")){m.hidden=true;return}
   const ld=e.target.closest("[data-ld],[data-dup]");if(ld){const x=h[+(ld.dataset.ld??ld.dataset.dup)];try{const pl=new URLSearchParams(x.url.split("#")[1]).get("p");P=full(unpack(pl));P.ph=P.ph||"";if(ld.dataset.dup!=null){P.id=newId();P.c="";P.exp=plus(14)}drawForm();preview();m.hidden=true;toast(ld.dataset.dup!=null?"Copy ready: add the new client":"Loaded")}catch(err){toast("Couldn’t open that one")}}}}
 function syncTab(){$$("[data-tab]").forEach(x=>x.setAttribute("aria-selected",x.dataset.tab===tab));$(".e-wrap").dataset.tab=tab}
 P=full(P);drawForm();preview();syncTab();
}

/* ======================================================================
   ROUTER
   ====================================================================== */
function route(){const h=new URLSearchParams(location.hash.slice(1));
 if(h.has("edit")){let P=null;const e=h.get("edit");if(e){try{P=full(unpack(e))}catch(_){}}builder(P);return}
 if(h.has("p")){let P;try{P=unpack(h.get("p"))}catch(e){return nothing()}
  const pl=h.get("p"),g=h.get("g"),mine=!!store.get("atq:key");let badge="";
  if(mine){const ok=g&&sign(pl)===g;badge=`<div class="q-badge ${ok?"ok":"bad"}">${ok?"✓ Verified on your device: these are the prices you sent.":"⚠ Careful: the prices in this link were changed after you sent it."}${h.has("s")?" Showing the client’s choices.":""} <a href="#edit=${pl}">Edit</a></div>`}
  const S=h.has("s")?selParse(h.get("s"),P):null;
  document.title=(tr(P.l||"en","eye")+" · "+(P.c||"")+" · Atay Studio");de.setAttribute("lang",P.l||"en");de.setAttribute("dir",(P.l||"en")==="ar"?"rtl":"ltr");
  renderClient(app,P,{sel:S,badge});return}
 nothing()}
function nothing(){const l=(store.get("atay-lang")||"en").slice(0,2),L=W[l]?l:"en";app.className="q-root";app.setAttribute("dir",L==="ar"?"rtl":"ltr");
 app.innerHTML=`<div class="q-none">${ICON}<h1>${tr(L,"none")}</h1><p>${tr(L,"noneL")}</p><a class="q-acc" href="/">${tr(L,"back")}</a></div>`}
addEventListener("hashchange",()=>location.reload());
route();
})();
