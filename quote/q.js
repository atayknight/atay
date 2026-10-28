/* ATAY STUDIO · project planner
   #edit      -> Ayoub's one-screen link maker (+ "My prices")
   #p=…&g=…   -> the client's step-by-step flow: film or remote → what → how many → when → price → WhatsApp
   Everything lives in the link; nothing is stored on a server. */
(()=>{
const WA_NUM="212699146214";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const app=$("#app"),de=document.documentElement,LI={en:0,fr:1,ar:2};
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- services ---------- */
const IC={
 reel:'<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 9.5v5l4-2.5z"/>',
 film:'<path d="M3 9h18v11H3z"/><path d="M3 9l2.5-5 3.5 1-2.5 5M9 5l3.5 1-2.5 4M15 6.5l3.5 1-1.5 1.5"/>',
 shoot:'<rect x="2.5" y="7" width="13" height="10" rx="2"/><path d="M15.5 10.5l6-3v9l-6-3"/>',
 photo:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="12" cy="12" r="3.5"/><path d="M7 5l1.5-2h7L17 5"/>',
 edit:'<path d="M3 7h18M3 12h18M3 17h18"/><rect x="6" y="5" width="5" height="4" rx="1"/><rect x="12" y="10" width="6" height="4" rx="1"/><rect x="4" y="15" width="7" height="4" rx="1"/>',
 grade:'<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" opacity=".35"/><circle cx="12" cy="12" r="3"/>',
 vfx:'<path d="M12 2.5l2.3 6.2 6.2 2.3-6.2 2.3L12 19.5l-2.3-6.2-6.2-2.3 6.2-2.3z"/><path d="M19 17l.8 2.2 2.2.8-2.2.8L19 23l-.8-2.2-2.2-.8 2.2-.8z"/>',
 d3:'<path d="M12 2.5l8.5 4.8v9.4L12 21.5l-8.5-4.8V7.3z"/><path d="M12 12l8.5-4.7M12 12v9.5M12 12L3.5 7.3"/>',
 mg:'<path d="M4 18c3-9 7-12 16-12"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="6" r="2"/><path d="M9 20h11"/>',
 film2:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="6.5" r="1.6"/><circle cx="12" cy="17.5" r="1.6"/><circle cx="6.5" cy="12" r="1.6"/><circle cx="17.5" cy="12" r="1.6"/>',
 remote:'<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M9 10.5l2 2 4-4"/>'};
const svg=(k,c="")=>`<svg viewBox="0 0 24 24" class="${c}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k]}</svg>`;
/* m: "f" = filmed on location, "r" = remote (client sends footage) */
const SV={
 reel:{m:"f",n:["Social reels","Reels réseaux sociaux","ريلز للشبكات الاجتماعية"],q:["How many reels?","Combien de reels ?","كم ريل تحتاج؟"],d:["30 to 90 second vertical videos for Instagram and TikTok.","Vidéos verticales de 30 à 90 secondes pour Instagram et TikTok.","فيديوهات عمودية من 30 إلى 90 ثانية لإنستغرام وتيك توك."],u:[["reel","reels"],["reel","reels"],["ريل","ريلز"]],p:2500,def:3,max:12,x:["mg","vfx","sub"]},
 film:{m:"f",n:["Brand film","Film de marque","فيلم للعلامة"],q:["How many films?","Combien de films ?","كم فيلماً تحتاج؟"],d:["A 1 to 3 minute film that tells your story.","Un film de 1 à 3 minutes qui raconte votre histoire.","فيلم من دقيقة إلى 3 دقائق يحكي قصتك."],u:[["film","films"],["film","films"],["فيلم","أفلام"]],p:9000,def:1,max:3,x:["mg","vfx","drone","vo"]},
 shoot:{m:"f",n:["Filming only","Tournage seul","تصوير فقط"],q:["How many shoot days?","Combien de jours de tournage ?","كم يوم تصوير؟"],d:["Ayoub films as Director of Photography and hands you the footage.","Ayoub filme en directeur photo et vous remet les images.","يصوّر أيوب كمدير تصوير ويسلّمك اللقطات."],u:[["day","days"],["jour","jours"],["يوم","أيام"]],p:4500,def:1,max:10,x:["drone","light"]},
 photo:{m:"f",n:["Photos","Photos","صور"],q:["How many photo sets?","Combien de séries photo ?","كم جلسة صور؟"],d:["20 edited photos per set, ready for web and print.","20 photos retouchées par série, prêtes pour le web et l’impression.","20 صورة معدّلة لكل جلسة، جاهزة للويب والطباعة."],u:[["set","sets"],["série","séries"],["جلسة","جلسات"]],p:2500,def:1,max:5,x:[]},
 edit:{m:"r",n:["Video editing","Montage vidéo","مونتاج الفيديو"],q:["How many videos to edit?","Combien de vidéos à monter ?","كم فيديو تريد مونتاجه؟"],d:["You send your footage, we cut it into a finished video with music.","Vous envoyez vos images, on les monte en vidéo finie avec musique.","ترسل لقطاتك ونحوّلها إلى فيديو جاهز مع الموسيقى."],u:[["video","videos"],["vidéo","vidéos"],["فيديو","فيديوهات"]],p:2000,def:1,max:10,x:["grade","sound","sub"]},
 grade:{m:"r",n:["Colour grading","Étalonnage","تدريج الألوان"],q:["How many videos to grade?","Combien de vidéos à étalonner ?","كم فيديو تريد تدريج ألوانه؟"],d:["A cinematic look on your finished edit.","Un rendu cinéma sur votre montage final.","لمسة سينمائية على مونتاجك النهائي."],u:[["video","videos"],["vidéo","vidéos"],["فيديو","فيديوهات"]],p:1200,def:1,max:10,x:[]},
 vfx:{m:"r",n:["VFX shots","Plans VFX","لقطات مؤثرات بصرية"],q:["How many VFX shots?","Combien de plans VFX ?","كم لقطة مؤثرات تحتاج؟"],d:["Clean-up, sky replacement, screen inserts, compositing.","Nettoyage, remplacement de ciel, incrustations, compositing.","تنظيف اللقطات، استبدال السماء، إدراج الشاشات، التركيب."],u:[["shot","shots"],["plan","plans"],["لقطة","لقطات"]],p:1500,def:3,max:30,x:[]},
 d3:{m:"r",n:["3D animation","Animation 3D","تحريك ثلاثي الأبعاد"],q:["How many 3D animations?","Combien d’animations 3D ?","كم تحريكاً ثلاثي الأبعاد؟"],d:["Your product or logo in 3D, up to 15 seconds each.","Votre produit ou logo en 3D, jusqu’à 15 secondes chacun.","منتجك أو شعارك بتقنية ثلاثية الأبعاد، حتى 15 ثانية لكل واحد."],u:[["animation","animations"],["animation","animations"],["تحريك","تحريكات"]],p:4000,def:1,max:6,x:["sound"]},
 mg:{m:"r",n:["Motion graphics","Motion design","موشن جرافيك"],q:["How many motion videos?","Combien de vidéos motion ?","كم فيديو موشن تحتاج؟"],d:["Animated titles, logo animation or an explainer video.","Titres animés, logo animé ou vidéo explicative.","عناوين متحركة، تحريك الشعار أو فيديو توضيحي."],u:[["video","videos"],["vidéo","vidéos"],["فيديو","فيديوهات"]],p:1500,def:1,max:10,x:["vo","sound"]}
};
const XT={mg:{n:["Motion graphics","Motion design","موشن جرافيك"],p:800},vfx:{n:["Visual effects","Effets visuels","مؤثرات بصرية"],p:1500},sub:{n:["Subtitles","Sous-titres","ترجمة مكتوبة"],p:300},drone:{n:["Drone shots","Plans drone","لقطات بالدرون"],p:1500},vo:{n:["Voice-over","Voix off","تعليق صوتي"],p:1200},light:{n:["Lighting kit","Kit lumière","معدات الإضاءة"],p:1000},grade:{n:["Colour grading","Étalonnage","تدريج الألوان"],p:800},sound:{n:["Sound design","Sound design","تصميم صوتي"],p:600}};
const ORDER=Object.keys(SV);
const myP=(()=>{try{return JSON.parse(store.get("atq:prices2")||"{}")}catch(e){return{}}})();
const stdPrice=k=>myP[k]??(SV[k]?SV[k].p:XT[k.slice(2)]?.p);   /* "x:mg" for extras */

/* ---------- words ---------- */
const W={
 en:{hi:"Hi {c}",hiNo:"Hello",intro:"Let’s plan your project. A few quick taps and you’ll see your price straight away.",time:"About 1 minute",start:"Let’s start",
  mode:"How can Ayoub help?",modeL:"Pick what fits your project.",mF:"Film it for me",mFd:"Ayoub comes to you and films: reels, brand films, photos. In Morocco and abroad.",mR:"Work on my footage",mRd:"Remote: you send the footage, Ayoub edits, grades or adds VFX and 3D. From anywhere.",remote:"Remote",
  what:"What do you need?",whatL:"Pick one or more.",from:"from {x}",xtra:"Add extras",per:"per {u}",
  when:"When do you need it?",whenO:["As soon as possible","Within a month","In 2 to 3 months","Not sure yet"],note:"Anything else Ayoub should know?",noteO:"optional",noteP:"Places, ideas, references, a link to your footage…",
  sum:"Your project",sumL:"Here’s your price. Send it to Ayoub and he’ll confirm the details with you.",sub:"Subtotal",disc:"Discount {n}%",total:"Total",dep:"{n}% to start",send:"Send to Ayoub",sendL:"Opens WhatsApp with your choices.",call:"Prefer to talk first? Book a call",change:"Change",
  back:"Back",next:"Continue",see:"See my price",pick:"Pick at least one to continue.",step:"Step {n}",
  thanks:"Thank you!",thanksL:"Your project is on its way to Ayoub on WhatsApp. He’ll reply with the next steps.",nextT:"What happens next",
  wa1:"Hi Ayoub, here is my project ({id}):",waT:"Total: {x}",waD:"To start: {x}",waW:"When: {x}",waN:"Note: {x}",waM:"Remote work (I send the footage)",waL:"My choices: {l}",
  none:"No project link here",noneL:"Ask Ayoub for your personal link, or write to him on WhatsApp.",goSite:"Visit the studio",
  steps:[["Discovery call","A short call to agree on the idea, the look and the dates."],["Pre-production","Moodboard, shot list and planning, all set before work starts."],["Filming or your footage","Ayoub films on location, or works from the footage you send."],["Edit, colour and VFX","You watch the first cut, send notes, and we finish the look."],["Delivery","Final files in every format you need, ready to post."]]},
 fr:{hi:"Bonjour {c}",hiNo:"Bonjour",intro:"Préparons votre projet. Quelques touches et vous voyez votre prix tout de suite.",time:"Environ 1 minute",start:"C’est parti",
  mode:"Comment Ayoub peut vous aider ?",modeL:"Choisissez ce qui correspond à votre projet.",mF:"Filmer pour moi",mFd:"Ayoub vient filmer chez vous : reels, films de marque, photos. Au Maroc et à l’étranger.",mR:"Travailler mes images",mRd:"À distance : vous envoyez vos images, Ayoub monte, étalonne ou ajoute VFX et 3D. De partout.",remote:"À distance",
  what:"De quoi avez-vous besoin ?",whatL:"Choisissez un ou plusieurs.",from:"dès {x}",xtra:"Ajouter des options",per:"par {u}",
  when:"Pour quand ?",whenO:["Dès que possible","D’ici un mois","Dans 2 à 3 mois","Je ne sais pas encore"],note:"Autre chose à dire à Ayoub ?",noteO:"facultatif",noteP:"Lieux, idées, références, lien vers vos images…",
  sum:"Votre projet",sumL:"Voici votre prix. Envoyez-le à Ayoub, il confirmera les détails avec vous.",sub:"Sous-total",disc:"Remise {n} %",total:"Total",dep:"{n} % pour démarrer",send:"Envoyer à Ayoub",sendL:"Ouvre WhatsApp avec vos choix.",call:"Envie d’en parler d’abord ? Réservez un appel",change:"Modifier",
  back:"Retour",next:"Continuer",see:"Voir mon prix",pick:"Choisissez au moins un élément.",step:"Étape {n}",
  thanks:"Merci !",thanksL:"Votre projet part chez Ayoub sur WhatsApp. Il vous répond avec la suite.",nextT:"La suite",
  wa1:"Bonjour Ayoub, voici mon projet ({id}) :",waT:"Total : {x}",waD:"Pour démarrer : {x}",waW:"Pour quand : {x}",waN:"Note : {x}",waM:"Travail à distance (j’envoie les images)",waL:"Mes choix : {l}",
  none:"Aucun lien de projet ici",noneL:"Demandez votre lien personnel à Ayoub, ou écrivez-lui sur WhatsApp.",goSite:"Voir le studio",
  steps:[["Appel découverte","Un court appel pour valider l’idée, le style et les dates."],["Pré-production","Moodboard, découpage et planning, tout est prêt avant de commencer."],["Tournage ou vos images","Ayoub filme sur place, ou travaille à partir de vos images."],["Montage, couleur et VFX","Vous voyez le premier montage, envoyez vos retours, on finalise."],["Livraison","Les fichiers finaux dans tous les formats utiles, prêts à publier."]]},
 ar:{hi:"مرحباً {c}",hiNo:"مرحباً",intro:"لنخطط لمشروعك. بضع لمسات وسترى السعر مباشرة.",time:"حوالي دقيقة واحدة",start:"لنبدأ",
  mode:"كيف يمكن لأيوب مساعدتك؟",modeL:"اختر ما يناسب مشروعك.",mF:"صوّر لي",mFd:"يأتي أيوب إليك ويصوّر: ريلز، أفلام للعلامات، صور. في المغرب وخارجه.",mR:"اشتغل على لقطاتي",mRd:"عن بُعد: ترسل اللقطات، ويقوم أيوب بالمونتاج أو الألوان أو المؤثرات والتحريك ثلاثي الأبعاد. من أي مكان.",remote:"عن بُعد",
  what:"ماذا تحتاج؟",whatL:"اختر واحداً أو أكثر.",from:"ابتداءً من {x}",xtra:"إضافات",per:"لكل {u}",
  when:"متى تحتاجه؟",whenO:["في أقرب وقت","خلال شهر","خلال شهرين إلى 3 أشهر","لست متأكداً بعد"],note:"هل هناك شيء آخر يجب أن يعرفه أيوب؟",noteO:"اختياري",noteP:"أماكن، أفكار، مراجع، رابط لقطاتك…",
  sum:"مشروعك",sumL:"هذا هو السعر. أرسله إلى أيوب وسيؤكد التفاصيل معك.",sub:"المجموع الفرعي",disc:"خصم {n}٪",total:"المجموع",dep:"{n}٪ للبدء",send:"أرسل إلى أيوب",sendL:"يفتح واتساب مع اختياراتك.",call:"تفضّل الحديث أولاً؟ احجز مكالمة",change:"تعديل",
  back:"رجوع",next:"متابعة",see:"اعرض السعر",pick:"اختر عنصراً واحداً على الأقل.",step:"الخطوة {n}",
  thanks:"شكراً لك!",thanksL:"مشروعك في طريقه إلى أيوب عبر واتساب. سيرد عليك بالخطوات التالية.",nextT:"الخطوات التالية",
  wa1:"مرحباً أيوب، هذا مشروعي ({id}):",waT:"المجموع: {x}",waD:"للبدء: {x}",waW:"متى: {x}",waN:"ملاحظة: {x}",waM:"عمل عن بُعد (سأرسل اللقطات)",waL:"اختياراتي: {l}",
  none:"لا يوجد رابط مشروع هنا",noneL:"اطلب رابطك الخاص من أيوب، أو راسله عبر واتساب.",goSite:"زيارة الاستوديو",
  steps:[["مكالمة التعارف","مكالمة قصيرة للاتفاق على الفكرة والأسلوب والمواعيد."],["ما قبل الإنتاج","لوحة الإلهام وقائمة اللقطات والتخطيط، كل شيء جاهز قبل البدء."],["التصوير أو لقطاتك","يصوّر أيوب في الموقع، أو يشتغل على اللقطات التي ترسلها."],["المونتاج والألوان والمؤثرات","تشاهد النسخة الأولى وترسل ملاحظاتك، ثم نُكمل اللمسة النهائية."],["التسليم","الملفات النهائية بكل الصيغ التي تحتاجها، جاهزة للنشر."]]}};
const tr=(l,k,v={})=>String(W[l][k]).replace(/\{(\w+)\}/g,(_,x)=>v[x]??"");
const LOC={en:"en-GB",fr:"fr-FR",ar:"ar-MA"};
function money(n,cur,l){const v=Math.round(n);if(cur==="MAD"){const s=new Intl.NumberFormat(LOC[l],{maximumFractionDigits:0}).format(v);return l==="ar"?s+" درهم":s+" DH"}
 try{return new Intl.NumberFormat(LOC[l],{style:"currency",currency:cur,maximumFractionDigits:0}).format(v)}catch(e){return v+" "+cur}}
const sN=(k,l)=>SV[k].n[LI[l]],xN=(k,l)=>XT[k].n[LI[l]],uN=(k,l,q)=>SV[k].u[LI[l]][q===1?0:1];

/* ---------- link ---------- */
const b64e=s=>{const b=new TextEncoder().encode(s);let x="";b.forEach(c=>x+=String.fromCharCode(c));return btoa(x).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")};
const b64d=s=>{s=s.replace(/-/g,"+").replace(/_/g,"/");const x=atob(s);return new TextDecoder().decode(Uint8Array.from(x,c=>c.charCodeAt(0)))};
function keyOf(){let k=store.get("atq:key");if(!k){const a=new Uint8Array(18);crypto.getRandomValues(a);k=[...a].map(x=>x.toString(36).padStart(2,"0")).join("").slice(0,24);store.set("atq:key",k)}return k}
const sign=pl=>SHA.hmac(keyOf(),pl).slice(0,16);
const BASE=()=>/atayknight\.com$/.test(location.hostname)?location.origin+"/quote/":location.href.split("#")[0];
const newId=()=>{const a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let s="";const r=new Uint8Array(4);crypto.getRandomValues(r);r.forEach(x=>s+=a[x%a.length]);return s};
/* the link carries: client name, offered services, their prices + extras' prices, discount, deposit, currency */
function packOffer(o){const pr={};o.s.forEach(k=>{pr[k]=stdPrice(k);SV[k].x.forEach(x=>pr["x:"+x]=stdPrice("x:"+x))});
 return b64e(JSON.stringify({v:2,id:o.id,c:o.c||undefined,s:o.s,pr,disc:o.disc||undefined,dep:+(myP.dep??50),cur:myP.cur||"MAD"}))}
function linkFor(o){const pl=packOffer(o);return BASE()+"#p="+pl+"&g="+sign(pl)}

/* ---------- theme ---------- */
function theme(t){if(!t){t=store.get("atay-theme");if(t!=="dark"&&t!=="light")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}de.setAttribute("data-theme",t)}
theme();
const ICON='<i class="q-ic" aria-hidden="true"></i>';
const MOON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="currentColor"/></svg>';
const WA_I='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z"/></svg>';
const langGuess=()=>{const s=(store.get("atay-lang")||navigator.language||"en").slice(0,2);return W[s]?s:"en"};

/* ======================================================================
   CLIENT FLOW
   ====================================================================== */
function flow(O,pl,g,selStr){
 let l=langGuess();const cur=O.cur||"MAD";const M=k=>money(k,cur,l);const T=(k,v)=>tr(l,k,v);
 const offered=O.s.filter(k=>SV[k]);const modes=[...new Set(offered.map(k=>SV[k].m))];
 const st={mode:modes.length===1?modes[0]:null,pick:[],q:{},x:{},when:-1,note:""};
 offered.forEach(k=>{st.q[k]=SV[k].def;st.x[k]=[]});
 const price=k=>+(O.pr[k]??stdPrice(k)),xp=x=>+(O.pr["x:"+x]??stdPrice("x:"+x));
 const mine=!!store.get("atq:key"),verified=mine?(g&&sign(pl)===g):null;
 if(selStr){try{const [m,items,w]=selStr.split("~");if(m)st.mode=m;items.split(",").filter(Boolean).forEach(s=>{const [k,q,xs]=s.split(":");if(!SV[k]||!offered.includes(k))return;st.pick.push(k);st.q[k]=Math.min(SV[k].max,Math.max(1,+q||1));st.x[k]=(xs||"").split("+").filter(x=>SV[k].x.includes(x))});st.when=+w;if(isNaN(st.when))st.when=-1}catch(e){}}
 /* steps are built from the answers so far */
 function steps(){const s=["hi"];if(modes.length>1)s.push("mode");s.push("what");st.pick.forEach(k=>s.push("q:"+k));s.push("when","sum");return s}
 let at=selStr&&st.pick.length?steps().length-1:0,dir=1;
 const avail=()=>offered.filter(k=>!st.mode||SV[k].m===st.mode);
 function calc(){let sub=0;const lines=st.pick.map(k=>{const q=st.q[k];const xs=st.x[k];let t=q*price(k);xs.forEach(x=>t+=q*xp(x));sub+=t;return{k,q,xs,t}});
  const disc=Math.round(sub*(+O.disc||0)/100),total=sub-disc,dep=Math.round(total*(+O.dep||0)/100);return{lines,sub,disc,total,dep}}
 app.className="w";
 function frame(){de.setAttribute("lang",l);de.setAttribute("dir",l==="ar"?"rtl":"ltr");
  app.innerHTML=`${mine?`<div class="q-badge ${verified?"ok":"bad"}">${verified?"✓ Your link, prices unchanged.":"⚠ The prices in this link were changed after you sent it."}</div>`:""}
  <header class="w-top"><a class="q-brand" href="/">${ICON}<b>Atay Studio</b></a><div class="q-tools"><div class="q-lang" role="group" aria-label="Language">${["en","fr","ar"].map(x=>`<button type="button" data-l="${x}" aria-pressed="${x===l}">${x==="ar"?"ع":x.toUpperCase()}</button>`).join("")}</div><button type="button" class="q-th" aria-label="Dark mode">${MOON}</button></div></header>
  <div class="w-prog" aria-hidden="true"><i></i></div>
  <main class="w-stage" aria-live="polite"></main>
  <nav class="w-nav"><button type="button" class="w-back">${l==="ar"?"→":"←"} <span>${T("back")}</span></button><div class="w-tot" hidden><span>${T("total")}</span><b></b></div><button type="button" class="w-next"></button></nav>`;
  draw()}
 function draw(){const S=steps();at=Math.max(0,Math.min(at,S.length-1));const id=S[at],stage=$(".w-stage");const C=calc();
  $(".w-prog i").style.width=(at/(S.length-1))*100+"%";
  let h="";
  if(id==="hi"){h=`<div class="w-hi"><img src="../img/portrait.webp" alt="" width="96" height="96" onerror="this.style.visibility='hidden'"><h1>${O.c?T("hi",{c:`<em>${esc(O.c)}</em>`}):T("hiNo")}</h1><p class="w-lead">${T("intro")}</p><p class="w-time">◷ ${T("time")}</p></div>`}
  if(id==="mode"){h=`<h2 class="w-h">${T("mode")}</h2><p class="w-l">${T("modeL")}</p><div class="w-modes">
    ${[["f","film2",T("mF"),T("mFd")],["r","remote",T("mR"),T("mRd")]].map(([m,ic,t,d])=>`<button type="button" class="w-mode${st.mode===m?" on":""}" data-mode="${m}" aria-pressed="${st.mode===m}">${svg(ic,"w-mi")}<b>${t}</b><span>${d}</span>${m==="r"?`<em class="w-tag">${T("remote")}</em>`:""}<i class="w-ck"></i></button>`).join("")}</div>`}
  if(id==="what"){h=`<h2 class="w-h">${T("what")}</h2><p class="w-l">${T("whatL")}</p><div class="w-tiles">${avail().map(k=>`<button type="button" class="w-tile${st.pick.includes(k)?" on":""}" data-k="${k}" aria-pressed="${st.pick.includes(k)}">${svg(k,"w-ti")}<b>${sN(k,l)}</b><span>${T("from",{x:M(price(k))})}${SV[k].m==="r"&&!st.mode?` · ${T("remote")}`:""}</span><i class="w-ck"></i></button>`).join("")}</div><p class="w-err" hidden>${T("pick")}</p>`}
  if(id.startsWith("q:")){const k=id.slice(2),q=st.q[k],mx=SV[k].max;
   h=`<div class="w-qh">${svg(k,"w-qi")}<div><h2 class="w-h">${SV[k].q[LI[l]]}</h2><p class="w-l">${SV[k].d[LI[l]]}</p></div></div>
    <div class="w-qty"><button type="button" class="w-st" data-d="-1" aria-label="−">−</button><output><b>${q}</b><span>${uN(k,l,q)}</span></output><button type="button" class="w-st" data-d="1" aria-label="+">+</button>
     <input type="range" min="1" max="${mx}" value="${q}" style="--f:${((q-1)/((mx-1)||1))*100}%" aria-label="${SV[k].q[LI[l]]}"><p class="w-each">${M(price(k))} ${T("per",{u:uN(k,l,1)})}</p></div>
    ${SV[k].x.length?`<h3 class="w-xh">${T("xtra")}</h3><div class="w-xs">${SV[k].x.map(x=>`<button type="button" class="w-x${st.x[k].includes(x)?" on":""}" data-x="${x}" aria-pressed="${st.x[k].includes(x)}"><i class="w-ck"></i><b>${xN(x,l)}</b><span>+${M(xp(x))} ${T("per",{u:uN(k,l,1)})}</span></button>`).join("")}</div>`:""}
    <div class="w-line"><span>${sN(k,l)}</span><b data-line>${M(C.lines.find(x=>x.k===k)?.t||0)}</b></div>`}
  if(id==="when"){h=`<h2 class="w-h">${T("when")}</h2><div class="w-opts">${W[l].whenO.map((o,i)=>`<button type="button" class="w-opt${st.when===i?" on":""}" data-w="${i}" aria-pressed="${st.when===i}"><i class="w-rd"></i>${o}</button>`).join("")}</div>
    <label class="w-note"><span>${T("note")} <em>${T("noteO")}</em></span><textarea rows="3" placeholder="${T("noteP")}">${esc(st.note)}</textarea></label>`}
  if(id==="sum"){h=`<h2 class="w-h">${T("sum")}</h2><p class="w-l">${T("sumL")}</p><div class="w-sum">
    <ul>${C.lines.map(L=>`<li>${svg(L.k,"w-si")}<div><b>${L.q} × ${sN(L.k,l)}</b>${L.xs.length?`<small>+ ${L.xs.map(x=>xN(x,l)).join(", ")}</small>`:""}</div><span>${M(L.t)}</span></li>`).join("")}</ul>
    ${+O.disc?`<div class="w-r"><span>${T("sub")}</span><b>${M(C.sub)}</b></div><div class="w-r w-dc"><span>${T("disc",{n:O.disc})}</span><b>−${M(C.disc)}</b></div>`:""}
    <div class="w-big"><span>${T("total")}</span><b data-total>${M(C.total)}</b></div>
    ${+O.dep?`<p class="w-dep">${T("dep",{n:O.dep})}: <b>${M(C.dep)}</b></p>`:""}
    <button type="button" class="w-send">${WA_I}<span>${T("send")}</span></button><p class="w-sl">${T("sendL")}</p>
    <a class="w-call" href="/#book">${T("call")}</a><button type="button" class="w-chg">${T("change")}</button></div>`}
  stage.innerHTML=`<div class="w-step" style="--dx:${dir*28}px">${id!=="hi"?`<p class="w-k">${T("step",{n:at,t:S.length-1})}</p>`:""}${h}</div>`;
  const nx=$(".w-next"),bk=$(".w-back"),tot=$(".w-tot");
  bk.style.visibility=at===0?"hidden":"visible";
  nx.hidden=id==="sum";nx.textContent=id==="hi"?T("start"):S[at+1]==="sum"?T("see"):T("next");
  nx.classList.toggle("dim",(id==="mode"&&!st.mode)||(id==="what"&&!st.pick.length));
  tot.hidden=!st.pick.length||id==="sum"||id==="hi";$("b",tot).textContent=M(C.total);
  const f=stage.querySelector("h1,h2");if(f&&!RM&&at>0){f.setAttribute("tabindex","-1");f.focus({preventScroll:true})}
  scrollTo({top:0,behavior:"instant"})}
 function go(d){const S=steps(),id=S[at];
  if(d>0&&id==="mode"&&!st.mode)return;
  if(d>0&&id==="what"&&!st.pick.length){$(".w-err").hidden=false;return}
  dir=d;at+=d;draw()}
 function refreshQ(k){const C=calc(),q=st.q[k],r=$(".w-qty input");$(".w-qty output b").textContent=q;$(".w-qty output span").textContent=uN(k,l,q);r.value=q;r.style.setProperty("--f",((q-1)/((SV[k].max-1)||1))*100+"%");
  $("[data-line]").textContent=M(C.lines.find(x=>x.k===k).t);$(".w-tot b").textContent=M(C.total);
  const o=$(".w-qty output b");if(!RM){o.classList.remove("pop");void o.offsetWidth;o.classList.add("pop")}}
 app.onclick=e=>{const t=e.target;
  if(t.closest(".w-next"))return go(1);if(t.closest(".w-back"))return go(-1);
  const lg=t.closest("[data-l]");if(lg){l=lg.dataset.l;store.set("atay-lang",l);frame();return}
  if(t.closest(".q-th")){const n=de.getAttribute("data-theme")==="dark"?"light":"dark";store.set("atay-theme",n);theme(n);return}
  const md=t.closest("[data-mode]");if(md){st.mode=md.dataset.mode;st.pick=st.pick.filter(k=>SV[k].m===st.mode);draw();setTimeout(()=>go(1),RM?0:260);return}
  const tl=t.closest("[data-k]");if(tl){const k=tl.dataset.k;st.pick=st.pick.includes(k)?st.pick.filter(x=>x!==k):[...st.pick,k];st.pick.sort((a,b)=>ORDER.indexOf(a)-ORDER.indexOf(b));draw();return}
  const sp=t.closest(".w-st");if(sp){const k=steps()[at].slice(2);st.q[k]=Math.max(1,Math.min(SV[k].max,st.q[k]+ +sp.dataset.d));refreshQ(k);return}
  const xx=t.closest("[data-x]");if(xx){const k=steps()[at].slice(2),x=xx.dataset.x;st.x[k]=st.x[k].includes(x)?st.x[k].filter(y=>y!==x):[...st.x[k],x];xx.classList.toggle("on");xx.setAttribute("aria-pressed",xx.classList.contains("on"));refreshQ(k);return}
  const w=t.closest("[data-w]");if(w){st.when=+w.dataset.w;$$(".w-opt").forEach(b=>{const on=+b.dataset.w===st.when;b.classList.toggle("on",on);b.setAttribute("aria-pressed",on)});return}
  if(t.closest(".w-chg")){dir=-1;at=steps().indexOf("what");draw();return}
  if(t.closest(".w-send"))return send()};
 app.oninput=e=>{if(e.target.matches(".w-qty input")){const k=steps()[at].slice(2);st.q[k]=+e.target.value;refreshQ(k)}if(e.target.matches(".w-note textarea"))st.note=e.target.value};
 addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.target.matches("textarea,button,a")&&!$(".w-next").hidden){e.preventDefault();go(1)}});
 function send(){const C=calc(),sel=(st.mode||"")+"~"+st.pick.map(k=>k+":"+st.q[k]+":"+st.x[k].join("+")).join(",")+"~"+st.when;
  const link=BASE()+"#p="+pl+(g?"&g="+g:"")+"&s="+encodeURIComponent(sel);
  const lines=C.lines.map(L=>"• "+L.q+" × "+sN(L.k,l)+(L.xs.length?" (+ "+L.xs.map(x=>xN(x,l)).join(", ")+")":"")+": "+M(L.t));
  const msg=[T("wa1",{id:O.id||""}),...(st.mode==="r"?[T("waM")]:[]),...lines,"",+O.disc?T("disc",{n:O.disc})+": −"+M(C.disc):null,T("waT",{x:M(C.total)}),+O.dep?T("waD",{x:M(C.dep)}):null,st.when>=0?T("waW",{x:W[l].whenO[st.when]}):null,st.note.trim()?T("waN",{x:st.note.trim()}):null,"",T("waL",{l:link})].filter(x=>x!==null).join("\n");
  window.open("https://wa.me/"+WA_NUM+"?text="+encodeURIComponent(msg),"_blank","noopener");
  const sh=document.createElement("div");sh.className="q-thx";sh.setAttribute("role","dialog");sh.setAttribute("aria-modal","true");
  sh.innerHTML=`<div class="q-tc" dir="${l==="ar"?"rtl":"ltr"}"><span class="q-ok">✓</span><h2>${T("thanks")}</h2><p>${T("thanksL")}</p><h3>${T("nextT")}</h3><ol>${W[l].steps.map(([a,b],i)=>`<li style="--d:${200+i*90}ms"><b>${a}</b><span>${b}</span></li>`).join("")}</ol><button type="button" class="q-close">OK</button></div>`;
  document.body.appendChild(sh);sh.addEventListener("click",e=>{if(e.target===sh||e.target.closest(".q-close"))sh.remove()});$(".q-close",sh).focus()}
 document.title=(O.c?O.c+" · ":"")+"Atay Studio";frame()}

/* ======================================================================
   LINK MAKER (Ayoub)
   ====================================================================== */
const hist=()=>{try{return JSON.parse(store.get("atq:hist2")||"[]")}catch(e){return[]}};
function maker(){de.setAttribute("dir","ltr");de.setAttribute("lang","en");document.title="New project link · Atay Studio";app.className="mk";
 const o={id:newId(),c:"",s:(()=>{try{return JSON.parse(store.get("atq:last")||"null")}catch(e){return null}})()||ORDER.slice(),disc:0};
 const tile=k=>`<button type="button" class="mk-t${o.s.includes(k)?" on":""}" data-k="${k}" aria-pressed="${o.s.includes(k)}">${svg(k,"mk-i")}<span>${SV[k].n[0]}</span><i class="w-ck"></i></button>`;
 app.innerHTML=`<header class="w-top"><span class="q-brand">${ICON}<b>Atay Studio</b></span><div class="q-tools"><button type="button" class="mk-l" data-open="hist">Sent <i class="e-hn"></i></button><button type="button" class="mk-l" data-open="prices">My prices</button></div></header>
 <div class="mk-wrap"><h1>New project link</h1><p class="mk-sub">Send it to a client. They answer a few quick questions and see their price.</p>
  <section class="mk-card"><label class="mk-f"><span>Who is it for?</span><input class="mk-c" placeholder="Client or contact name" autocomplete="off"></label>
   <div class="mk-f"><span>What can they choose?</span>
    <p class="mk-g">${svg("film2","mk-gi")} Filming</p><div class="mk-ts">${ORDER.filter(k=>SV[k].m==="f").map(tile).join("")}</div>
    <p class="mk-g">${svg("remote","mk-gi")} Remote work</p><div class="mk-ts">${ORDER.filter(k=>SV[k].m==="r").map(tile).join("")}</div></div>
   <div class="mk-f"><span>Discount</span><div class="mk-seg">${[0,5,10,15,20].map(d=>`<button type="button" data-d="${d}" aria-pressed="${d===0}">${d?d+"%":"None"}</button>`).join("")}</div></div></section>
  <div class="mk-act"><button type="button" class="mk-btn mk-pri" data-act="wa">${WA_I} Send on WhatsApp</button><button type="button" class="mk-btn" data-act="copy">Copy link</button><button type="button" class="mk-btn mk-gh" data-act="open">Preview</button></div>
 </div><div class="e-toast" role="status" aria-live="polite"></div><div class="e-modal" hidden></div>`;
 const toast=t=>{const el=$(".e-toast");el.textContent=t;el.classList.add("on");clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove("on"),2600)};
 const hn=()=>{$(".e-hn").textContent=hist().length||""};hn();
 const copy=t=>{if(navigator.clipboard&&isSecureContext)navigator.clipboard.writeText(t).catch(()=>fb(t));else fb(t)};
 const fb=t=>{const ta=document.createElement("textarea");ta.value=t;ta.style.cssText="position:fixed;opacity:0";document.body.appendChild(ta);ta.select();try{document.execCommand("copy")}catch(e){}ta.remove()};
 function make(){o.c=$(".mk-c").value.trim();if(!o.s.length){toast("Pick at least one service");return null}store.set("atq:last",JSON.stringify(o.s));
  const url=linkFor(o);const h=hist().filter(x=>x.id!==o.id);h.unshift({id:o.id,c:o.c||"(no name)",d:new Date().toISOString().slice(0,10),n:o.s.length,url});store.set("atq:hist2",JSON.stringify(h.slice(0,60)));hn();return url}
 const msg=url=>`${o.c?"Hi "+o.c+"! ":"Hi! "}Here is your project link from Atay Studio. Pick what you need and you'll see the price straight away:\n${url}`;
 app.onclick=e=>{const t=e.target;
  const k=t.closest(".mk-t");if(k){const x=k.dataset.k;o.s=o.s.includes(x)?o.s.filter(y=>y!==x):[...o.s,x];o.s.sort((a,b)=>ORDER.indexOf(a)-ORDER.indexOf(b));k.classList.toggle("on");k.setAttribute("aria-pressed",k.classList.contains("on"));return}
  const d=t.closest("[data-d]");if(d){o.disc=+d.dataset.d;$$(".mk-seg button").forEach(b=>b.setAttribute("aria-pressed",b===d));return}
  const a=t.closest("[data-act]");if(a){const url=make();if(!url)return;
   if(a.dataset.act==="copy"){copy(url);toast("Link copied")}
   if(a.dataset.act==="open")window.open(url,"_blank","noopener");
   if(a.dataset.act==="wa")window.open("https://wa.me/?text="+encodeURIComponent(msg(url)),"_blank","noopener");
   o.id=newId();return}
  const op=t.closest("[data-open]");if(op){op.dataset.open==="prices"?prices():sent()}};
 function sheet(html){const m=$(".e-modal");m.hidden=false;m.innerHTML=`<div class="e-mc" role="dialog" aria-modal="true">${html}</div>`;m.onclick=e=>{if(e.target===m||e.target.closest("[data-x]"))m.hidden=true};return m}
 function sent(){const h=hist();sheet(`<div class="e-mh"><b>Sent links</b><button type="button" class="e-ic" data-x aria-label="Close">×</button></div>
  ${h.length?`<ul class="e-hl">${h.map(x=>`<li><div><b>${esc(x.c)}</b><span>${esc(x.id)} · ${esc(x.d)} · ${x.n} service${x.n>1?"s":""}</span></div><a class="mk-btn mk-sm" href="${esc(x.url)}" target="_blank" rel="noopener">Open</a><button type="button" class="mk-btn mk-sm" data-cp="${esc(x.url)}">Copy</button></li>`).join("")}</ul>`:`<p class="mk-hint">Links you send or copy appear here.</p>`}`).addEventListener("click",e=>{const c=e.target.closest("[data-cp]");if(c){copy(c.dataset.cp);toast("Link copied")}})}
 function prices(){const row=(k,name,sub)=>`<label class="mk-pr"><span>${name}${sub?`<small>${sub}</small>`:""}</span><input type="number" min="0" step="50" data-p="${k}" value="${stdPrice(k)}"></label>`;
  const m=sheet(`<div class="e-mh"><b>My prices</b><button type="button" class="e-ic" data-x aria-label="Close">×</button></div><p class="mk-hint">Your standard rates. Every new link uses them. Links you already sent keep their prices.</p>
   <div class="mk-row"><label class="mk-pr"><span>Currency</span><select data-p="cur">${[["MAD","Dirham (DH)"],["EUR","Euro (€)"],["USD","Dollar ($)"]].map(([v,t])=>`<option value="${v}"${(myP.cur||"MAD")===v?" selected":""}>${t}</option>`).join("")}</select></label>
    <label class="mk-pr"><span>Deposit to start</span><select data-p="dep">${[0,30,40,50,60,100].map(v=>`<option value="${v}"${+(myP.dep??50)===v?" selected":""}>${v}%</option>`).join("")}</select></label></div>
   <h4>Filming</h4>${ORDER.filter(k=>SV[k].m==="f").map(k=>row(k,SV[k].n[0],"per "+SV[k].u[0][0])).join("")}
   <h4>Remote work</h4>${ORDER.filter(k=>SV[k].m==="r").map(k=>row(k,SV[k].n[0],"per "+SV[k].u[0][0])).join("")}
   <h4>Extras <small>(charged per reel, film, day or video)</small></h4>${Object.keys(XT).map(x=>row("x:"+x,XT[x].n[0])).join("")}
   <div class="mk-act"><button type="button" class="mk-btn mk-pri" data-save>Save my prices</button><button type="button" class="mk-btn mk-gh" data-reset>Original prices</button></div>
   <details class="mk-key"><summary>Checking links on another device</summary><p class="mk-hint">Links are signed with a private key kept in this browser. When a client sends their link back, open it here: a green line means the prices are yours. To check on another phone or computer, copy this key there.</p><code>${esc(keyOf())}</code><div class="mk-act"><button type="button" class="mk-btn mk-sm" data-ck>Copy key</button><button type="button" class="mk-btn mk-sm" data-pk>Paste a key</button></div></details>`);
  m.addEventListener("click",e=>{if(e.target.closest("[data-save]")){$$("[data-p]",m).forEach(i=>{const k=i.dataset.p;myP[k]=k==="cur"?i.value:+i.value});store.set("atq:prices2",JSON.stringify(myP));m.hidden=true;toast("Prices saved")}
   if(e.target.closest("[data-reset]")){Object.keys(myP).forEach(k=>delete myP[k]);store.set("atq:prices2","{}");m.hidden=true;toast("Original prices restored")}
   if(e.target.closest("[data-ck]")){copy(keyOf());toast("Key copied")}
   if(e.target.closest("[data-pk]")){const k=prompt("Paste the key from your other device:");if(k&&k.trim().length>=12){store.set("atq:key",k.trim());toast("Key updated");m.hidden=true}}})}
}

/* ---------- router ---------- */
function nothing(){const l=langGuess();de.setAttribute("dir",l==="ar"?"rtl":"ltr");app.className="w";
 app.innerHTML=`<div class="q-none">${ICON}<h1>${tr(l,"none")}</h1><p>${tr(l,"noneL")}</p><a class="w-send" href="/">${tr(l,"goSite")}</a></div>`}
function route(){const h=new URLSearchParams(location.hash.slice(1));
 if(h.has("edit"))return maker();
 if(h.has("p")){try{const pl=h.get("p"),O=JSON.parse(b64d(pl));if(O.v!==2||!Array.isArray(O.s))throw 0;return flow(O,pl,h.get("g"),h.get("s"))}catch(e){return nothing()}}
 nothing()}
addEventListener("hashchange",()=>location.reload());
route();
})();
