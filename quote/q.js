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
 event:'<path d="M4 7h16v3.5a2 2 0 0 0 0 4V18H4v-3.5a2 2 0 0 0 0-4z"/><path d="M9.5 7v11" stroke-dasharray="1.6 2"/>',
 sport:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5l4 2.9-1.5 4.6h-5L8 10.4z"/><path d="M12 3v4.5M21 10.4l-5 0M17.5 19.5l-3-4.5M6.5 19.5l3-4.5M3 10.4h5"/>',
 collab:'<path d="M4 5h16v11H9l-5 4z"/><path d="M12 7.6l1 2.2 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3z"/>',
 remote:'<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M9 10.5l2 2 4-4"/>'};
const svg=(k,c="")=>`<svg viewBox="0 0 24 24" class="${c}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k]}</svg>`;
/* m: "f" = filmed on location, "r" = remote (client sends footage) */
const SV={
 reel:{m:"f",n:["Social reels","Reels réseaux sociaux","ريلز للشبكات الاجتماعية"],q:["How many reels?","Combien de reels ?","كم ريل تحتاج؟"],d:["30 to 90 second vertical videos for Instagram and TikTok.","Vidéos verticales de 30 à 90 secondes pour Instagram et TikTok.","فيديوهات عمودية من 30 إلى 90 ثانية لإنستغرام وتيك توك."],u:[["reel","reels"],["reel","reels"],["ريل","ريلز"]],p:2500,def:3,max:12,x:["mg","vfx","sub"]},
 film:{m:"f",n:["Brand film","Film de marque","فيلم للعلامة"],q:["How many films?","Combien de films ?","كم فيلماً تحتاج؟"],d:["A 1 to 3 minute film that tells your story.","Un film de 1 à 3 minutes qui raconte votre histoire.","فيلم من دقيقة إلى 3 دقائق يحكي قصتك."],u:[["film","films"],["film","films"],["فيلم","أفلام"]],p:9000,def:1,max:3,x:["mg","vfx","drone","vo"]},
 shoot:{m:"f",n:["Filming only","Tournage seul","تصوير فقط"],q:["How many shoot days?","Combien de jours de tournage ?","كم يوم تصوير؟"],d:["Ayoub films as Director of Photography and hands you the footage.","Ayoub filme en directeur photo et vous remet les images.","يصوّر أيوب كمدير تصوير ويسلّمك اللقطات."],u:[["day","days"],["jour","jours"],["يوم","أيام"]],p:4500,def:1,max:10,x:["drone","light"]},
 event:{m:"f",n:["Event coverage","Couverture d’événement","تغطية الفعاليات"],q:["How many event days?","Combien de jours d’événement ?","كم يوم فعالية؟"],d:["Conferences, launches, festivals, weddings: a highlight film plus reels.","Conférences, lancements, festivals, mariages : un film résumé et des reels.","مؤتمرات، إطلاقات، مهرجانات، أعراس: فيلم ملخّص مع ريلز."],u:[["day","days"],["jour","jours"],["يوم","أيام"]],def:1,max:7,x:["drone","fast","mg"]},
 sport:{m:"f",n:["Sports content","Contenu sportif","محتوى رياضي"],q:["How many shoot days?","Combien de jours de tournage ?","كم يوم تصوير؟"],d:["Matches, tournaments, clubs and athletes: action footage, highlights and reels.","Matchs, tournois, clubs et athlètes : images d’action, résumés et reels.","مباريات، بطولات، أندية ورياضيون: لقطات حركة، ملخصات وريلز."],u:[["day","days"],["jour","jours"],["يوم","أيام"]],def:1,max:7,x:["drone","fast","mg"]},
 photo:{m:"f",n:["Photos","Photos","صور"],q:["How many photo sets?","Combien de séries photo ?","كم جلسة صور؟"],d:["20 edited photos per set, ready for web and print.","20 photos retouchées par série, prêtes pour le web et l’impression.","20 صورة معدّلة لكل جلسة، جاهزة للويب والطباعة."],u:[["set","sets"],["série","séries"],["جلسة","جلسات"]],p:2500,def:1,max:5,x:[]},
 edit:{m:"r",n:["Video editing","Montage vidéo","مونتاج الفيديو"],q:["How many videos to edit?","Combien de vidéos à monter ?","كم فيديو تريد مونتاجه؟"],d:["You send your footage, we cut it into a finished video with music.","Vous envoyez vos images, on les monte en vidéo finie avec musique.","ترسل لقطاتك ونحوّلها إلى فيديو جاهز مع الموسيقى."],u:[["video","videos"],["vidéo","vidéos"],["فيديو","فيديوهات"]],p:2000,def:1,max:10,x:["grade","sound","sub"]},
 grade:{m:"r",n:["Colour grading","Étalonnage","تدريج الألوان"],q:["How many videos to grade?","Combien de vidéos à étalonner ?","كم فيديو تريد تدريج ألوانه؟"],d:["A cinematic look on your finished edit.","Un rendu cinéma sur votre montage final.","لمسة سينمائية على مونتاجك النهائي."],u:[["video","videos"],["vidéo","vidéos"],["فيديو","فيديوهات"]],p:1200,def:1,max:10,x:[]},
 vfx:{m:"r",n:["VFX shots","Plans VFX","لقطات مؤثرات بصرية"],q:["How many VFX shots?","Combien de plans VFX ?","كم لقطة مؤثرات تحتاج؟"],d:["Clean-up, sky replacement, screen inserts, compositing.","Nettoyage, remplacement de ciel, incrustations, compositing.","تنظيف اللقطات، استبدال السماء، إدراج الشاشات، التركيب."],u:[["shot","shots"],["plan","plans"],["لقطة","لقطات"]],p:1500,def:3,max:30,x:[]},
 d3:{m:"r",n:["3D animation","Animation 3D","تحريك ثلاثي الأبعاد"],q:["How many 3D animations?","Combien d’animations 3D ?","كم تحريكاً ثلاثي الأبعاد؟"],d:["Your product or logo in 3D, up to 15 seconds each.","Votre produit ou logo en 3D, jusqu’à 15 secondes chacun.","منتجك أو شعارك بتقنية ثلاثية الأبعاد، حتى 15 ثانية لكل واحد."],u:[["animation","animations"],["animation","animations"],["تحريك","تحريكات"]],p:4000,def:1,max:6,x:["sound"]},
 mg:{m:"r",n:["Motion graphics","Motion design","موشن جرافيك"],q:["How many motion videos?","Combien de vidéos motion ?","كم فيديو موشن تحتاج؟"],d:["Animated titles, logo animation or an explainer video.","Titres animés, logo animé ou vidéo explicative.","عناوين متحركة، تحريك الشعار أو فيديو توضيحي."],u:[["video","videos"],["vidéo","vidéos"],["فيديو","فيديوهات"]],p:1500,def:1,max:10,x:["vo","sound"]}
};
const XT={mg:{n:["Motion graphics","Motion design","موشن جرافيك"],p:800},vfx:{n:["Visual effects","Effets visuels","مؤثرات بصرية"],p:1500},sub:{n:["Subtitles","Sous-titres","ترجمة مكتوبة"],p:300},drone:{n:["Drone shots","Plans drone","لقطات بالدرون"],p:1500},vo:{n:["Voice-over","Voix off","تعليق صوتي"],p:1200},light:{n:["Lighting kit","Kit lumière","معدات الإضاءة"],p:1000},grade:{n:["Colour grading","Étalonnage","تدريج الألوان"],p:800},sound:{n:["Sound design","Sound design","تصميم صوتي"],p:600},fast:{n:["Express delivery (48h)","Livraison express (48 h)","تسليم سريع (48 ساعة)"],p:0}};
const ORDER=Object.keys(SV);
/* ---------- prices per market (researched Oct 2026; Morocco in DH, Europe in €, USA in $) ---------- */
const PR={
 ma:{cur:"MAD",event:7000,sport:6000,reel:2500,film:12000,shoot:4500,photo:2500,edit:2000,grade:1500,vfx:1200,d3:6000,mg:2500,
  x:{fast:1000,mg:600,vfx:1200,sub:250,drone:1500,vo:1000,light:1000,grade:600,sound:600},pk:{event:12900,social:8900,launch:19900,edit:9900,vfx:13900}},
 eu:{cur:"EUR",event:1200,sport:1100,reel:450,film:2900,shoot:650,photo:450,edit:350,grade:300,vfx:250,d3:1200,mg:500,
  x:{fast:200,mg:120,vfx:250,sub:50,drone:300,vo:200,light:150,grade:120,sound:120},pk:{event:2390,social:1590,launch:4290,edit:1790,vfx:2890}},
 us:{cur:"USD",event:1500,sport:1400,reel:550,film:3500,shoot:850,photo:550,edit:450,grade:400,vfx:300,d3:1500,mg:600,
  x:{fast:250,mg:150,vfx:300,sub:60,drone:350,vo:250,light:200,grade:150,sound:150},pk:{event:2890,social:1890,launch:5190,edit:2290,vfx:3490}}};
let DEPOSIT=40;  /* % to start */
let SALE={pct:0,until:"",name:""},CLIENTS={};
/* welcome offer (after a booked call), Atay Circle loyalty tiers, business details for devis/factures */
let WELCOME={pct:20,on:1},TIERS=[{p:0,d:0},{p:2,d:5},{p:5,d:10},{p:10,d:15}],LOYAL={};
const TN=[["Member","Membre","عضو"],["Silver","Silver","فضي"],["Gold","Gold","ذهبي"],["Platinum","Platinum","بلاتيني"]];
const BIZ0={name:"Atay Studio",owner:"Ayoub Ouazzou",addr:"Marrakech, Maroc",ice:"",idf:"",rc:"",tel:"+212 6 99 14 62 14",mail:"atayknight@gmail.com",web:"atayknight.com",rib:"",tva:0};
let BIZ={...BIZ0};
/* names never go into the public price file: only a short one-way key */
const hk=s=>{let h1=0xdeadbeef^7,h2=0x41c6ce57^7;for(let i=0,c;i<s.length;i++){c=s.charCodeAt(i);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677)}h1=Math.imul(h1^(h1>>>16),2246822507);h1^=Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507);h2^=Math.imul(h1^(h1>>>13),3266489909);return(4294967296*(2097151&h2)+(h1>>>0)).toString(36)};
const ckey=n=>n.trim().toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[\s_]+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"");
const todayISO=()=>new Date().toISOString().slice(0,10);
const lkey=n=>{const k=ckey(n);return k?"k"+hk("atay:"+k):""};
const tierOf=p=>{let t=0;TIERS.forEach((x,i)=>{if(p>=+x.p)t=i});return t};
const WKEY="atay-welcome",CODE_RE=/^ATAY-[A-Z0-9]{4}$/;
const myWelcome=()=>{try{const w=JSON.parse(store.get(WKEY)||"null");return w&&CODE_RE.test(w.code)?w:null}catch(e){return null}};
const activeSale=()=>SALE&&+SALE.pct>0&&(!SALE.until||todayISO()<=SALE.until)?SALE:null;
function applyData(j){if(!j)return;if(j.deposit!=null)DEPOSIT=+j.deposit;["ma","eu","us"].forEach(m=>{if(!j[m])return;Object.keys(j[m]).forEach(k=>{if(k==="x"||k==="pk")Object.assign(PR[m][k],j[m][k]);else if(k!=="cur")PR[m][k]=j[m][k]})});SALE=j.sale||SALE;CLIENTS=j.clients||{};if(j.welcome)WELCOME=j.welcome;if(Array.isArray(j.tiers)&&j.tiers.length)TIERS=j.tiers;LOYAL=j.loyal||{};BIZ={...BIZ0,...(j.biz||{})}}
const snapshot=()=>JSON.parse(JSON.stringify({deposit:DEPOSIT,sale:SALE,clients:CLIENTS,welcome:WELCOME,tiers:TIERS,loyal:LOYAL,biz:BIZ,ma:PR.ma,eu:PR.eu,us:PR.us}));
const fmtD=(iso,l)=>{try{return new Intl.DateTimeFormat({en:"en-GB",fr:"fr-FR",ar:"ar-MA"}[l],{day:"numeric",month:"long"}).format(new Date(iso+"T12:00:00"))}catch(e){return iso}};
/* ready-made packages: i = [service, amount, extras] */
const PK={
 social:{m:"f",pop:1,mo:1,ic:"reel",i:[["reel",4,["sub","mg"]]],
  n:["Social Starter","Social Starter","باقة السوشيال"],
  b:[["4 reels every month, filmed and edited","1 shoot session a month","Subtitles and animated titles","Great for cafés, hotels, shops, brands"],["4 reels par mois, tournés et montés","1 séance de tournage par mois","Sous-titres et titres animés","Idéal pour cafés, hôtels, boutiques, marques"],["4 ريلز كل شهر، تصوير ومونتاج","جلسة تصوير واحدة في الشهر","ترجمة مكتوبة وعناوين متحركة","مثالية للمقاهي والفنادق والمتاجر والعلامات"]]},
 launch:{m:"f",ic:"film",i:[["film",1,["drone"]],["reel",4,[]],["photo",1,[]]],
  n:["Brand Launch","Lancement de marque","إطلاق العلامة"],
  b:[["1 brand film with drone shots","4 reels cut from the same shoot","20 edited photos","For a launch, a new season or an event"],["1 film de marque avec plans drone","4 reels issus du même tournage","20 photos retouchées","Pour un lancement, une saison ou un événement"],["فيلم للعلامة مع لقطات درون","4 ريلز من نفس التصوير","20 صورة معدّلة","لإطلاق جديد أو موسم أو حدث"]]},
 event:{m:"f",ic:"event",i:[["event",1,["drone","fast"]],["reel",3,[]]],
  n:["Event Day","Pack Événement","باقة الفعالية"],
  b:[["A full day filming your event","1 highlight film with drone shots","3 reels, delivered within 48 hours","For launches, festivals, sports days"],["Une journée complète de tournage","1 film résumé avec plans drone","3 reels livrés sous 48 h","Lancements, festivals, journées sportives"],["يوم كامل لتصوير فعاليتك","فيلم ملخّص مع لقطات درون","3 ريلز تُسلَّم خلال 48 ساعة","للإطلاقات والمهرجانات والأيام الرياضية"]]},
 edit:{m:"r",pop:1,ic:"edit",i:[["edit",5,["grade","sub"]]],
  n:["Edit Pack","Pack Montage","باقة المونتاج"],
  b:[["5 videos edited from your footage","Colour grading on every video","Subtitles included","Delivered in every format you need"],["5 vidéos montées à partir de vos images","Étalonnage sur chaque vidéo","Sous-titres inclus","Livré dans tous les formats utiles"],["5 فيديوهات من لقطاتك","تدريج الألوان لكل فيديو","الترجمة المكتوبة مشمولة","بكل الصيغ التي تحتاجها"]]},
 vfx:{m:"r",ic:"vfx",i:[["vfx",10,[]],["d3",1,[]]],
  n:["VFX & 3D Pack","Pack VFX & 3D","باقة المؤثرات و3D"],
  b:[["10 VFX shots: clean-up, sky, screens","1 3D animation of your product or logo","Ready for ads and social"],["10 plans VFX : nettoyage, ciel, écrans","1 animation 3D de votre produit ou logo","Prêt pour la pub et les réseaux"],["10 لقطات مؤثرات: تنظيف، سماء، شاشات","تحريك ثلاثي الأبعاد لمنتجك أو شعارك","جاهزة للإعلانات والشبكات"]]}};
/* client's market from their timezone (Ayoub can force one with @ma / @eu / @us) */
const autoMarket=()=>{let z="";try{z=Intl.DateTimeFormat().resolvedOptions().timeZone||""}catch(e){}
 if(/^Africa\/(Casablanca|El_Aaiun)$/.test(z))return"ma";if(/^America\//.test(z)||/^Pacific\/Honolulu$/.test(z))return"us";return"eu"};

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
Object.assign(W.en,{gift:"🎁 {n}% off, just for you",saleG:"🎁 {x}: {n}% off{u}",until:" until {d}",dYou:"Your discount ({n}%)",dSale:"{x} ({n}%)",offer:"Special offer",waX:"Discount ({n}%): −{x}",mC:"Brand collaboration or something else",mCd:"A brand partnership, sponsored content, a music video, a documentary… Tell Ayoub the idea and get a custom quote.",cus:"What are you planning?",cusL:"Pick what fits, then tell Ayoub a bit more.",cusT:["Brand collaboration","Sponsored or creator content","Music video","Documentary","Something else"],cusN:"Your idea",cusP:"The brand, the idea, where and for whom…",quote:"Custom quote",quoteL:"Ayoub replies within 24 hours with a quote made for your project.",waC:"Project type: {x}",waI:"Idea: {x}",pack:"Start with a package?",packL:"Our most chosen bundles, or build your own.",own:"Build my own",ownD:"Pick exactly what you need, one by one.",save:"Save {n}%",mo:"/ month",pop:"Most chosen",waP:"Package: {x}"});
Object.assign(W.fr,{gift:"🎁 {n} % de remise, rien que pour vous",saleG:"🎁 {x} : −{n} %{u}",until:" jusqu’au {d}",dYou:"Votre remise ({n} %)",dSale:"{x} ({n} %)",offer:"Offre spéciale",waX:"Remise ({n} %) : −{x}",mC:"Collaboration de marque ou autre",mCd:"Partenariat de marque, contenu sponsorisé, clip, documentaire… Décrivez l’idée à Ayoub et recevez un devis sur mesure.",cus:"Que préparez-vous ?",cusL:"Choisissez ce qui correspond, puis dites-en un peu plus.",cusT:["Collaboration de marque","Contenu sponsorisé ou créateur","Clip musical","Documentaire","Autre chose"],cusN:"Votre idée",cusP:"La marque, l’idée, le lieu, le public…",quote:"Devis sur mesure",quoteL:"Ayoub vous répond sous 24 h avec un devis adapté à votre projet.",waC:"Type de projet : {x}",waI:"Idée : {x}",pack:"Commencer par un pack ?",packL:"Nos offres les plus choisies, ou composez la vôtre.",own:"Composer la mienne",ownD:"Choisissez exactement ce qu’il vous faut.",save:"−{n} %",mo:"/ mois",pop:"Le plus choisi",waP:"Pack : {x}"});
Object.assign(W.ar,{gift:"🎁 خصم {n}٪ خاص بك",saleG:"🎁 {x}: خصم {n}٪{u}",until:" حتى {d}",dYou:"خصمك ({n}٪)",dSale:"{x} ({n}٪)",offer:"عرض خاص",waX:"الخصم ({n}٪): −{x}",mC:"تعاون مع علامة أو شيء آخر",mCd:"شراكة مع علامة، محتوى مموّل، فيديو كليب، وثائقي… أخبر أيوب بالفكرة واحصل على عرض سعر خاص.",cus:"ماذا تخطط؟",cusL:"اختر ما يناسب، ثم أخبر أيوب بالمزيد.",cusT:["تعاون مع علامة تجارية","محتوى مموّل أو صنّاع محتوى","فيديو كليب","وثائقي","شيء آخر"],cusN:"فكرتك",cusP:"العلامة، الفكرة، المكان والجمهور…",quote:"عرض سعر خاص",quoteL:"يرد أيوب خلال 24 ساعة بعرض سعر مصمَّم لمشروعك.",waC:"نوع المشروع: {x}",waI:"الفكرة: {x}",pack:"تبدأ بباقة جاهزة؟",packL:"الباقات الأكثر طلباً، أو اصنع باقتك.",own:"أصنع باقتي",ownD:"اختر ما تحتاجه بالضبط، خطوة بخطوة.",save:"وفّر {n}٪",mo:"/ شهرياً",pop:"الأكثر طلباً",waP:"الباقة: {x}"});
Object.assign(W.en,{dTier:"{x} member ({n}%)",dWel:"Welcome offer ({n}%)",welOn:"Welcome offer unlocked",welOnL:"−{n}% on your first month, from your discovery call.",welT:"−{n}% on your first month",welTL:"Book a free 30-minute call first and the discount is applied to your price automatically.",welB:"Book a free call",code:"Already booked? Enter your code",codeOk:"Code applied: −{n}% on your first month",codeBad:"That code doesn’t look right. It looks like ATAY-7K2Q.",apply:"Apply",tierOn:"{x} member",tierOnL:"−{n}% on every project, thanks for working with us.",prog:"{p} projects together. {k} more to {x}: −{n}% on everything.",progT:"{p} projects together.",circle:"Atay Circle",circleL:"The more we work together, the better your price.",circleH:"How it works",cT:["New client","After {p} projects","After {p} projects","After {p} projects"],cD:["−{n}% on your first month after a discovery call","−{n}% on every project","−{n}% on every project and priority booking","−{n}% on every project and priority booking"],cNote:"Each project counts, and each month of a monthly package counts as one. Your level is linked to your name in your personal link.",first:"First month",then:"Then {x} / month",waWel:"Welcome offer: code {x} (booked a discovery call)",waTier:"Atay Circle: {x} member",devis:"Download quote (PDF)",fac:"Need an invoice for your company?",facH:"Request an invoice",facL:"Ayoub sends you an official invoice (facture) with your company details once the project is confirmed.",fCo:"Name or company",fIce:"ICE / tax ID (optional)",fAd:"Address",fEm:"Email",fSend:"Send the request on WhatsApp",waF:"Hi Ayoub, I need an invoice for quote {no}:",waFd:"Quote: {x}"});
Object.assign(W.fr,{dTier:"Membre {x} ({n} %)",dWel:"Offre de bienvenue ({n} %)",welOn:"Offre de bienvenue débloquée",welOnL:"−{n} % sur votre premier mois, grâce à votre appel découverte.",welT:"−{n} % sur votre premier mois",welTL:"Réservez d’abord un appel gratuit de 30 minutes : la remise s’applique automatiquement à votre prix.",welB:"Réserver un appel gratuit",code:"Déjà réservé ? Entrez votre code",codeOk:"Code appliqué : −{n} % sur votre premier mois",codeBad:"Ce code ne semble pas correct. Il ressemble à ATAY-7K2Q.",apply:"Appliquer",tierOn:"Membre {x}",tierOnL:"−{n} % sur chaque projet, merci de votre fidélité.",prog:"{p} projets ensemble. Encore {k} pour passer {x} : −{n} % sur tout.",progT:"{p} projets ensemble.",circle:"Atay Circle",circleL:"Plus on travaille ensemble, meilleur est votre prix.",circleH:"Comment ça marche",cT:["Nouveau client","Après {p} projets","Après {p} projets","Après {p} projets"],cD:["−{n} % sur le premier mois après un appel découverte","−{n} % sur chaque projet","−{n} % sur chaque projet et réservation prioritaire","−{n} % sur chaque projet et réservation prioritaire"],cNote:"Chaque projet compte, et chaque mois d’un pack mensuel compte pour un. Votre niveau est lié au nom de votre lien personnel.",first:"Premier mois",then:"Puis {x} / mois",waWel:"Offre de bienvenue : code {x} (appel découverte réservé)",waTier:"Atay Circle : membre {x}",devis:"Télécharger le devis (PDF)",fac:"Besoin d’une facture pour votre société ?",facH:"Demander une facture",facL:"Ayoub vous envoie une facture officielle à votre nom ou celui de votre société une fois le projet confirmé.",fCo:"Nom ou société",fIce:"ICE (facultatif)",fAd:"Adresse",fEm:"E-mail",fSend:"Envoyer la demande sur WhatsApp",waF:"Bonjour Ayoub, j’ai besoin d’une facture pour le devis {no} :",waFd:"Devis : {x}"});
Object.assign(W.ar,{dTier:"عضو {x} ({n}٪)",dWel:"عرض الترحيب ({n}٪)",welOn:"تم تفعيل عرض الترحيب",welOnL:"خصم {n}٪ على شهرك الأول، بفضل مكالمة التعارف.",welT:"خصم {n}٪ على شهرك الأول",welTL:"احجز أولاً مكالمة مجانية لمدة 30 دقيقة، وسيُطبَّق الخصم على سعرك تلقائياً.",welB:"احجز مكالمة مجانية",code:"حجزت مسبقاً؟ أدخل رمزك",codeOk:"تم تطبيق الرمز: خصم {n}٪ على شهرك الأول",codeBad:"الرمز غير صحيح. يشبه ATAY-7K2Q.",apply:"تطبيق",tierOn:"عضو {x}",tierOnL:"خصم {n}٪ على كل مشروع، شكراً لثقتك.",prog:"{p} مشاريع معاً. {k} أخرى للوصول إلى {x}: خصم {n}٪ على كل شيء.",progT:"{p} مشاريع معاً.",circle:"Atay Circle",circleL:"كلما اشتغلنا معاً أكثر، كان سعرك أفضل.",circleH:"كيف يعمل",cT:["عميل جديد","بعد {p} مشاريع","بعد {p} مشاريع","بعد {p} مشاريع"],cD:["خصم {n}٪ على الشهر الأول بعد مكالمة التعارف","خصم {n}٪ على كل مشروع","خصم {n}٪ على كل مشروع وأولوية في الحجز","خصم {n}٪ على كل مشروع وأولوية في الحجز"],cNote:"كل مشروع يُحتسب، وكل شهر من باقة شهرية يُحتسب كمشروع. مستواك مرتبط بالاسم في رابطك الخاص.",first:"الشهر الأول",then:"ثم {x} / شهرياً",waWel:"عرض الترحيب: الرمز {x} (حجزت مكالمة تعارف)",waTier:"Atay Circle: عضو {x}",devis:"تحميل عرض السعر (PDF)",fac:"تحتاج فاتورة لشركتك؟",facH:"طلب فاتورة",facL:"يرسل لك أيوب فاتورة رسمية باسمك أو باسم شركتك بعد تأكيد المشروع.",fCo:"الاسم أو الشركة",fIce:"ICE (اختياري)",fAd:"العنوان",fEm:"البريد الإلكتروني",fSend:"أرسل الطلب عبر واتساب",waF:"مرحباً أيوب، أحتاج فاتورة لعرض السعر {no}:",waFd:"عرض السعر: {x}"});
const tr=(l,k,v={})=>String(W[l][k]).replace(/\{(\w+)\}/g,(_,x)=>v[x]??"");
const LOC={en:"en-GB",fr:"fr-FR",ar:"ar-MA"};
function money(n,cur,l){const v=Math.round(n);if(cur==="MAD"){const s=new Intl.NumberFormat(LOC[l],{maximumFractionDigits:0}).format(v);return l==="ar"?s+" درهم":s+" DH"}
 try{return new Intl.NumberFormat(cur==="USD"&&l==="en"?"en-US":LOC[l],{style:"currency",currency:cur,maximumFractionDigits:0}).format(v)}catch(e){return v+" "+cur}}
const sN=(k,l)=>SV[k].n[LI[l]],xN=(k,l)=>XT[k].n[LI[l]],uN=(k,l,q)=>SV[k].u[LI[l]][q===1?0:1];

/* ---------- theme + icons ---------- */
function theme(t){if(!t){t=store.get("atay-theme");if(t!=="dark"&&t!=="light")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}de.setAttribute("data-theme",t)}
theme();
const ICON='<i class="q-ic" aria-hidden="true"></i>';
const DOC_I='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>';
const MOON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="currentColor"/></svg>';
const WA_I='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z"/></svg>';
const langGuess=()=>{const s=(store.get("atay-lang")||navigator.language||"en").slice(0,2);return W[s]?s:"en"};
const slug=n=>encodeURIComponent(n.trim().replace(/\s+/g,"-")).replace(/%2D/gi,"-");
const LINK=n=>"atayknight.com/p/"+(n.trim()?"#"+slug(n):"");

/* ======================================================================
   CLIENT FLOW   atayknight.com/quote/#Kenza
   ====================================================================== */
function flow(name,mk){
 let l=langGuess();const P=PR[mk]||PR.ma,cur=P.cur;const M=v=>money(v,cur,l),T=(k,v)=>tr(l,k,v);
 const price=k=>P[k],xp=x=>P.x[x];
 const st={mode:null,pk:null,pick:[],q:{},x:{},when:-1,note:"",ct:[],idea:""};ORDER.forEach(k=>{st.q[k]=SV[k].def;st.x[k]=[]});
 const LK=lkey(name),own=CLIENTS[LK]??CLIENTS[ckey(name)],myD=+own||0;
 const LY=name&&LOYAL[LK]||null,pts=LY?+LY.p||0:0,tier=tierOf(pts),tD=+((TIERS[tier]||{}).d)||0,nxt=TIERS[tier+1];
 const sale=activeSale(),saleD=sale?+sale.pct:0;
 let wel=myWelcome();const welD=()=>WELCOME.on&&+WELCOME.pct>0&&wel&&!pts?+WELCOME.pct:0;
 let DISC=0,DK="";const reDisc=()=>{const c=[[myD,"own"],[tD,"tier"],[saleD,"sale"],[welD(),"wel"]].filter(x=>x[0]>0).sort((a,b)=>b[0]-a[0])[0]||[0,""];DISC=c[0];DK=c[1]};reDisc();
 const dLabel=()=>DK==="own"?T("dYou",{n:DISC}):DK==="tier"?T("dTier",{x:TN[tier][LI[l]],n:DISC}):DK==="wel"?T("dWel",{n:DISC}):T("dSale",{x:(sale&&sale.name)||T("offer"),n:DISC});
 const firstMo=()=>DK==="wel"&&st.pk&&PK[st.pk]&&PK[st.pk].mo;
 const packs=m=>Object.keys(PK).filter(k=>PK[k].m===m);
 const pkVal=k=>PK[k].i.reduce((s,[sv,q,xs])=>s+q*(price(sv)+xs.reduce((a,x)=>a+xp(x),0)),0);
 const pkSave=k=>Math.round((1-P.pk[k]/pkVal(k))*100);
 function steps(){if(st.mode==="c")return["hi","mode","cus","when","sum"];const s=["hi","mode"];if(st.mode&&packs(st.mode).length)s.push("pack");
  if(st.pk&&st.pk!=="own"){s.push("when","sum");return s}
  s.push("what");st.pick.forEach(k=>s.push("q:"+k));s.push("when","sum");return s}
 let at=0,dir=1;
 const fin=(o,sub)=>{const d=Math.round(sub*DISC/100),total=sub-d;return{...o,sub,d,total,dep:Math.round(total*DEPOSIT/100)}};
 function calc(){if(st.mode==="c")return{custom:1,lines:[],total:0,dep:0};if(st.pk&&st.pk!=="own")return fin({pack:st.pk,lines:[]},P.pk[st.pk]);
  let total=0;const lines=st.pick.map(k=>{const q=st.q[k],xs=st.x[k];let t=q*price(k);xs.forEach(x=>t+=q*xp(x));total+=t;return{k,q,xs,t}});
  return fin({lines},total)}
 app.className="w";
 function frame(){de.setAttribute("lang",l);de.setAttribute("dir",l==="ar"?"rtl":"ltr");
  app.innerHTML=`<header class="w-top"><a class="q-brand" href="/">${ICON}<b>Atay Studio</b></a><div class="q-tools"><div class="q-lang" role="group" aria-label="Language">${["en","fr","ar"].map(x=>`<button type="button" data-l="${x}" aria-pressed="${x===l}">${x==="ar"?"ع":x.toUpperCase()}</button>`).join("")}</div><button type="button" class="q-th" aria-label="Dark mode">${MOON}</button></div></header>
  <div class="w-prog" aria-hidden="true"><i></i></div><main class="w-stage" aria-live="polite"></main>
  <nav class="w-nav"><button type="button" class="w-back">${l==="ar"?"→":"←"} <span>${T("back")}</span></button><div class="w-tot" hidden><span>${T("total")}</span><b></b></div><button type="button" class="w-next"></button></nav>`;
  draw()}
 const pkCard=k=>{const p=PK[k],sv=pkSave(k),on=st.pk===k;return `<button type="button" class="w-pk${on?" on":""}${p.pop?" pop":""}" data-pk="${k}" aria-pressed="${on}">
   ${p.pop?`<em class="w-pop">${T("pop")}</em>`:""}<div class="w-pkh">${svg(p.ic,"w-pki")}<b>${p.n[LI[l]]}</b></div>
   <ul>${p.b[LI[l]].map(x=>`<li>${x}</li>`).join("")}</ul>
   <div class="w-pkp"><span class="w-pkv">${M(P.pk[k])}${p.mo?` <small>${T("mo")}</small>`:""}</span>${sv>=5?`<s>${M(pkVal(k))}</s><em class="w-sv">${T("save",{n:sv})}</em>`:""}</div><i class="w-ck"></i></button>`};
 function draw(){const S=steps();at=Math.max(0,Math.min(at,S.length-1));const id=S[at],stage=$(".w-stage"),C=calc();
  $(".w-prog i").style.width=(at/(S.length-1))*100+"%";let h="";
  if(id==="hi"){const gift=DK==="own"?T("gift",{n:DISC}):DK==="sale"?T("saleG",{x:(sale&&sale.name)||T("offer"),n:DISC,u:sale&&sale.until?T("until",{d:fmtD(sale.until,l)}):""}):"";
   const welBox=DK==="wel"?`<div class="w-perk w-perk-on"><span class="w-pi">🎁</span><div><b>${T("welOn")}</b><p>${T("welOnL",{n:DISC})}</p><small>${esc(wel.code)}</small></div></div>`
    :(!pts&&WELCOME.on&&+WELCOME.pct>0&&DK!=="own")?`<div class="w-perk"><span class="w-pi">🎁</span><div><b>${T("welT",{n:WELCOME.pct})}</b><p>${T("welTL")}</p><a class="w-pb" href="/#book">${T("welB")}</a>
      <details class="w-code"><summary>${T("code")}</summary><div class="w-cf"><input class="w-ci" placeholder="ATAY-XXXX" autocapitalize="characters" autocomplete="off" spellcheck="false" maxlength="9"><button type="button" class="w-ca">${T("apply")}</button></div><p class="w-cm" hidden></p></details></div></div>`:"";
   const tierBox=pts?`<div class="w-perk w-tier t${tier}"><span class="w-pi">★</span><div><b>${T("tierOn",{x:TN[tier][LI[l]]})}</b><p>${tD?T("tierOnL",{n:tD}):""} ${nxt?T("prog",{p:pts,k:Math.max(1,nxt.p-pts),x:TN[tier+1][LI[l]],n:nxt.d}):T("progT",{p:pts})}</p></div></div>`:"";
   h=`<div class="w-hi"><img src="../img/portrait.webp" alt="" width="96" height="96" onerror="this.style.visibility='hidden'"><h1>${name?T("hi",{c:`<em>${esc(name)}</em>`}):T("hiNo")}</h1><p class="w-lead">${T("intro")}</p>${gift?`<p class="w-gift">${gift}</p>`:""}${tierBox}${welBox}<button type="button" class="w-circ">${T("circle")} · ${T("circleH")}</button><p class="w-time">◷ ${T("time")}</p></div>`}
  if(id==="mode")h=`<h2 class="w-h">${T("mode")}</h2><p class="w-l">${T("modeL")}</p><div class="w-modes">
    ${[["f","film2",T("mF"),T("mFd")],["r","remote",T("mR"),T("mRd")],["c","collab",T("mC"),T("mCd")]].map(([m,ic,t,d])=>`<button type="button" class="w-mode${st.mode===m?" on":""}" data-mode="${m}" aria-pressed="${st.mode===m}">${svg(ic,"w-mi")}<b>${t}</b><span>${d}</span>${m==="r"?`<em class="w-tag">${T("remote")}</em>`:""}<i class="w-ck"></i></button>`).join("")}</div>`;
  if(id==="pack")h=`<h2 class="w-h">${T("pack")}</h2><p class="w-l">${T("packL")}</p><div class="w-pks">${packs(st.mode).map(pkCard).join("")}
    <button type="button" class="w-pk w-own${st.pk==="own"?" on":""}" data-pk="own" aria-pressed="${st.pk==="own"}"><div class="w-pkh">${svg("mg","w-pki")}<b>${T("own")}</b></div><p>${T("ownD")}</p><i class="w-ck"></i></button></div>`;
  if(id==="cus")h=`<h2 class="w-h">${T("cus")}</h2><p class="w-l">${T("cusL")}</p><div class="w-chs">${W[l].cusT.map((c,i)=>`<button type="button" class="w-chip${st.ct.includes(i)?" on":""}" data-ct="${i}" aria-pressed="${st.ct.includes(i)}">${c}</button>`).join("")}</div>
    <label class="w-note"><span>${T("cusN")}</span><textarea class="w-idea" rows="4" placeholder="${T("cusP")}">${esc(st.idea)}</textarea></label>`;
  if(id==="what")h=`<h2 class="w-h">${T("what")}</h2><p class="w-l">${T("whatL")}</p><div class="w-tiles">${ORDER.filter(k=>SV[k].m===st.mode).map(k=>`<button type="button" class="w-tile${st.pick.includes(k)?" on":""}" data-k="${k}" aria-pressed="${st.pick.includes(k)}">${svg(k,"w-ti")}<b>${sN(k,l)}</b><span>${T("from",{x:M(price(k))})}</span><i class="w-ck"></i></button>`).join("")}</div><p class="w-err" hidden>${T("pick")}</p>`;
  if(id.startsWith("q:")){const k=id.slice(2),q=st.q[k],mx=SV[k].max;
   h=`<div class="w-qh">${svg(k,"w-qi")}<div><h2 class="w-h">${SV[k].q[LI[l]]}</h2><p class="w-l">${SV[k].d[LI[l]]}</p></div></div>
    <div class="w-qty"><button type="button" class="w-st" data-d="-1" aria-label="−">−</button><output><b>${q}</b><span>${uN(k,l,q)}</span></output><button type="button" class="w-st" data-d="1" aria-label="+">+</button>
     <input type="range" min="1" max="${mx}" value="${q}" style="--f:${((q-1)/((mx-1)||1))*100}%" aria-label="${SV[k].q[LI[l]]}"><p class="w-each">${M(price(k))} ${T("per",{u:uN(k,l,1)})}</p></div>
    ${SV[k].x.length?`<h3 class="w-xh">${T("xtra")}</h3><div class="w-xs">${SV[k].x.map(x=>`<button type="button" class="w-x${st.x[k].includes(x)?" on":""}" data-x="${x}" aria-pressed="${st.x[k].includes(x)}"><i class="w-ck"></i><b>${xN(x,l)}</b><span>+${M(xp(x))} ${T("per",{u:uN(k,l,1)})}</span></button>`).join("")}</div>`:""}
    <div class="w-line"><span>${sN(k,l)}</span><b data-line>${M(C.lines.find(x=>x.k===k)?.t||0)}</b></div>`}
  if(id==="when")h=`<h2 class="w-h">${T("when")}</h2><div class="w-opts">${W[l].whenO.map((o,i)=>`<button type="button" class="w-opt${st.when===i?" on":""}" data-w="${i}" aria-pressed="${st.when===i}"><i class="w-rd"></i>${o}</button>`).join("")}</div>
    <label class="w-note"><span>${T("note")} <em>${T("noteO")}</em></span><textarea rows="3" placeholder="${T("noteP")}">${esc(st.note)}</textarea></label>`;
  if(id==="sum"&&C.custom){h=`<h2 class="w-h">${T("sum")}</h2><div class="w-sum"><ul><li class="w-lp">${svg("collab","w-si")}<div><b>${st.ct.map(i=>W[l].cusT[i]).join(", ")||T("mC")}</b>${st.idea.trim()?`<small>${esc(st.idea.trim().slice(0,160))}</small>`:""}</div></li></ul>
    <div class="w-big"><span>${T("total")}</span><b class="w-cq">${T("quote")}</b></div><p class="w-dep">${T("quoteL")}</p>
    <button type="button" class="w-send">${WA_I}<span>${T("send")}</span></button><p class="w-sl">${T("sendL")}</p><a class="w-call" href="/#book">${T("call")}</a><button type="button" class="w-chg">${T("change")}</button></div>`}
  else if(id==="sum"){const p=C.pack&&PK[C.pack];
   h=`<h2 class="w-h">${T("sum")}</h2><p class="w-l">${T("sumL")}</p><div class="w-sum">
    <ul>${p?`<li class="w-lp">${svg(p.ic,"w-si")}<div><b>${p.n[LI[l]]}</b><small>${p.b[LI[l]].slice(0,3).join(" · ")}</small></div><span>${M(C.sub)}${p.mo?` ${T("mo")}`:""}</span></li>`:
     C.lines.map(L=>`<li>${svg(L.k,"w-si")}<div><b>${L.q} × ${sN(L.k,l)}</b>${L.xs.length?`<small>+ ${L.xs.map(x=>xN(x,l)).join(", ")}</small>`:""}</div><span>${M(L.t)}</span></li>`).join("")}</ul>
    ${C.d?`<div class="w-r"><span>${T("sub")}</span><b>${M(C.sub)}</b></div><div class="w-r w-dc"><span>${dLabel()}</span><b>−${M(C.d)}</b></div>`:""}
    <div class="w-big"><span>${firstMo()?T("first"):T("total")}</span><b data-total>${M(C.total)}${p&&p.mo&&!firstMo()?`<small> ${T("mo")}</small>`:""}</b></div>${firstMo()?`<p class="w-then">${T("then",{x:M(C.sub)})}</p>`:""}
    <p class="w-dep">${T("dep",{n:DEPOSIT})}: <b>${M(C.dep)}</b></p>
    <button type="button" class="w-send">${WA_I}<span>${T("send")}</span></button><p class="w-sl">${T("sendL")}</p>
    <div class="w-docs"><button type="button" class="w-dv">${DOC_I}<span>${T("devis")}</span></button><button type="button" class="w-fc">${T("fac")}</button></div>
    ${DK!=="wel"&&!pts&&WELCOME.on&&+WELCOME.pct>0?`<a class="w-call w-call-g" href="/#book">🎁 ${T("welT",{n:WELCOME.pct})} · ${T("welB")}</a>`:`<a class="w-call" href="/#book">${T("call")}</a>`}<button type="button" class="w-chg">${T("change")}</button></div>`}
  stage.innerHTML=`<div class="w-step" style="--dx:${dir*28}px">${id!=="hi"?`<p class="w-k">${T("step",{n:at})}</p>`:""}${h}</div>`;
  const nx=$(".w-next"),bk=$(".w-back"),tot=$(".w-tot");
  bk.style.visibility=at===0?"hidden":"visible";
  nx.hidden=id==="sum";nx.textContent=id==="hi"?T("start"):S[at+1]==="sum"?T("see"):T("next");
  nx.classList.toggle("dim",(id==="cus"&&!st.ct.length&&!st.idea.trim())||(id==="mode"&&!st.mode)||(id==="pack"&&!st.pk)||(id==="what"&&!st.pick.length));
  tot.hidden=!(C.total>0)||id==="sum"||id==="hi";$("b",tot).textContent=M(C.total);
  const f=stage.querySelector("h1,h2");if(f&&!RM&&at>0){f.setAttribute("tabindex","-1");f.focus({preventScroll:true})}
  scrollTo({top:0,behavior:"instant"})}
 function go(d){const id=steps()[at];
  if(d>0&&((id==="mode"&&!st.mode)||(id==="pack"&&!st.pk)||(id==="cus"&&!st.ct.length&&!st.idea.trim())))return;
  if(d>0&&id==="what"&&!st.pick.length){$(".w-err").hidden=false;return}
  dir=d;at+=d;draw()}
 function refreshQ(k){const C=calc(),q=st.q[k],r=$(".w-qty input");$(".w-qty output b").textContent=q;$(".w-qty output span").textContent=uN(k,l,q);r.value=q;r.style.setProperty("--f",((q-1)/((SV[k].max-1)||1))*100+"%");
  $("[data-line]").textContent=M(C.lines.find(x=>x.k===k).t);$(".w-tot b").textContent=M(C.total);
  const o=$(".w-qty output b");if(!RM){o.classList.remove("pop");void o.offsetWidth;o.classList.add("pop")}}
 const auto=()=>setTimeout(()=>go(1),RM?0:260);
 app.onclick=e=>{const t=e.target;
  if(t.closest(".w-next"))return go(1);if(t.closest(".w-back"))return go(-1);
  const lg=t.closest("[data-l]");if(lg){l=lg.dataset.l;store.set("atay-lang",l);frame();return}
  if(t.closest(".q-th")){const n=de.getAttribute("data-theme")==="dark"?"light":"dark";store.set("atay-theme",n);theme(n);return}
  const md=t.closest("[data-mode]");if(md){if(st.mode!==md.dataset.mode){st.mode=md.dataset.mode;st.pk=null;st.pick=[]}draw();auto();return}
  const ct=t.closest("[data-ct]");if(ct){const i=+ct.dataset.ct;st.ct=st.ct.includes(i)?st.ct.filter(x=>x!==i):[...st.ct,i];ct.classList.toggle("on");ct.setAttribute("aria-pressed",ct.classList.contains("on"));$(".w-next").classList.toggle("dim",!st.ct.length&&!st.idea.trim());return}
  const pk=t.closest("[data-pk]");if(pk){st.pk=pk.dataset.pk;draw();auto();return}
  const tl=t.closest("[data-k]");if(tl){const k=tl.dataset.k;st.pick=st.pick.includes(k)?st.pick.filter(x=>x!==k):[...st.pick,k];st.pick.sort((a,b)=>ORDER.indexOf(a)-ORDER.indexOf(b));draw();return}
  const sp=t.closest(".w-st");if(sp){const k=steps()[at].slice(2);st.q[k]=Math.max(1,Math.min(SV[k].max,st.q[k]+ +sp.dataset.d));refreshQ(k);return}
  const xx=t.closest("[data-x]");if(xx){const k=steps()[at].slice(2),x=xx.dataset.x;st.x[k]=st.x[k].includes(x)?st.x[k].filter(y=>y!==x):[...st.x[k],x];xx.classList.toggle("on");xx.setAttribute("aria-pressed",xx.classList.contains("on"));refreshQ(k);return}
  const w=t.closest("[data-w]");if(w){st.when=+w.dataset.w;$$(".w-opt").forEach(b=>{const on=+b.dataset.w===st.when;b.classList.toggle("on",on);b.setAttribute("aria-pressed",on)});return}
  if(t.closest(".w-chg")){dir=-1;at=steps().indexOf(st.mode==="c"?"cus":"pack");if(at<0)at=1;draw();return}
  if(t.closest(".w-send"))return send();
  if(t.closest(".w-ca")){const v=($(".w-ci").value||"").trim().toUpperCase().replace(/\s/g,"");const m=$(".w-cm");m.hidden=false;
   if(CODE_RE.test(v)){wel={code:v,d:todayISO(),n:name};store.set(WKEY,JSON.stringify(wel));reDisc();m.textContent=T("codeOk",{n:WELCOME.pct});m.className="w-cm ok";setTimeout(draw,900)}else{m.textContent=T("codeBad");m.className="w-cm bad"}return}
  if(t.closest(".w-circ"))return circleSheet(l);
  if(t.closest(".w-dv"))return showDoc(docData());
  if(t.closest(".w-fc"))return facSheet()};
 app.oninput=e=>{if(e.target.matches(".w-qty input")){const k=steps()[at].slice(2);st.q[k]=+e.target.value;refreshQ(k)}if(e.target.matches(".w-idea")){st.idea=e.target.value;$(".w-next").classList.toggle("dim",!st.ct.length&&!st.idea.trim());return}if(e.target.matches(".w-note textarea"))st.note=e.target.value};
 addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.matches(".w-ci")){e.preventDefault();$(".w-ca").click();return}if(e.key==="Enter"&&!e.target.matches("textarea,button,a,input")&&!$(".w-next").hidden&&!$(".dv")&&!$(".q-thx")){e.preventDefault();go(1)}});
 function send(){const C=calc(),p=C.pack&&PK[C.pack];
  if(C.custom){const msg=[T("wa1",{id:name||"—"}),st.ct.length?T("waC",{x:st.ct.map(i=>W[l].cusT[i]).join(", ")}):null,st.idea.trim()?T("waI",{x:st.idea.trim()}):null,st.when>=0?T("waW",{x:W[l].whenO[st.when]}):null,st.note.trim()?T("waN",{x:st.note.trim()}):null].filter(Boolean).join("\n");
   window.open("https://wa.me/"+WA_NUM+"?text="+encodeURIComponent(msg),"_blank","noopener");return thanks()}
  const body=p?[T("waP",{x:p.n[LI[l]]+" ("+M(C.total)+(p.mo?" "+T("mo"):"")+")"}),...p.b[LI[l]].slice(0,3).map(x=>"• "+x)]
   :C.lines.map(L=>"• "+L.q+" × "+sN(L.k,l)+(L.xs.length?" (+ "+L.xs.map(x=>xN(x,l)).join(", ")+")":"")+": "+M(L.t));
  const msg=[T("wa1",{id:name||"—"}).replace(" ()",""),...(st.mode==="r"?[T("waM")]:[]),...body,"",C.d?T("waX",{n:DISC,x:M(C.d)}):null,DK==="wel"?T("waWel",{x:wel.code}):null,pts?T("waTier",{x:TN[tier][LI[l]]}):null,firstMo()?T("first")+": "+M(C.total)+" · "+T("then",{x:M(C.sub)}):T("waT",{x:M(C.total)+(p&&p.mo?" "+T("mo"):"")}),T("waD",{x:M(C.dep)}),st.when>=0?T("waW",{x:W[l].whenO[st.when]}):null,st.note.trim()?T("waN",{x:st.note.trim()}):null].filter(x=>x!==null).join("\n");
  window.open("https://wa.me/"+WA_NUM+"?text="+encodeURIComponent(msg),"_blank","noopener");
  thanks()}
 function docData(){const C=calc(),p=C.pack&&PK[C.pack],dl=l==="en"&&mk!=="ma"?"en":"fr",di=LI[dl];
  const li=p?[{d:p.n[di]+(p.mo?(dl==="fr"?" (mensuel)":" (monthly)"):""),s:p.b[di].slice(0,3).join(" · "),q:1,u:P.pk[C.pack]}]
   :C.lines.flatMap(L=>[{d:sN(L.k,dl),s:SV[L.k].d[di],q:L.q,u:price(L.k)},...L.xs.map(x=>({d:"+ "+xN(x,dl)+" · "+sN(L.k,dl),q:L.q,u:xp(x)}))]);
  const r=Math.random().toString(36).slice(2,6).toUpperCase(),dt=todayISO();
  const dlab=DK==="own"?(dl==="fr"?"Remise client":"Client discount"):DK==="tier"?"Atay Circle · "+TN[tier][di]:DK==="wel"?(dl==="fr"?"Offre de bienvenue · premier mois":"Welcome offer · first month"):(sale&&sale.name)||(dl==="fr"?"Offre spéciale":"Special offer");
  return{t:"d",no:"DEV-"+dt.slice(2).replace(/-/g,"")+"-"+r,dt,l:dl,c:cur,cl:{n:name||""},li,dp:DISC,dlab,fm:firstMo()?1:0,dep:DEPOSIT,w:st.when>=0?W[dl].whenO[st.when]:"",nt:st.note.trim().slice(0,300),code:DK==="wel"?wel.code:""}}
 function facSheet(){const d=docData();const sh=document.createElement("div");sh.className="q-thx";sh.setAttribute("role","dialog");sh.setAttribute("aria-modal","true");
  sh.innerHTML=`<form class="q-tc w-fq" dir="${l==="ar"?"rtl":"ltr"}"><h2>${T("facH")}</h2><p>${T("facL")}</p>
   <label><span>${T("fCo")}</span><input name="co" required value="${esc(name)}" autocomplete="organization"></label><label><span>${T("fIce")}</span><input name="ice" inputmode="numeric"></label>
   <label><span>${T("fAd")}</span><input name="ad" autocomplete="street-address"></label><label><span>${T("fEm")}</span><input name="em" type="email" autocomplete="email"></label>
   <button type="submit" class="w-send">${WA_I}<span>${T("fSend")}</span></button><button type="button" class="q-close w-chg">${T("back")}</button></form>`;
  document.body.appendChild(sh);sh.addEventListener("click",e=>{if(e.target===sh||e.target.closest(".q-close"))sh.remove()});
  $("form",sh).addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.target),g=k=>(f.get(k)||"").toString().trim();
   d.cl={n:g("co"),ice:g("ice"),ad:g("ad"),em:g("em")};const link="https://atayknight.com/p/#doc="+encDoc(d);
   const msg=[T("waF",{no:d.no}),"👤 "+d.cl.n,d.cl.ice&&"ICE: "+d.cl.ice,d.cl.ad&&"📍 "+d.cl.ad,d.cl.em&&"✉️ "+d.cl.em,"",T("waFd",{x:link})].filter(Boolean).join("\n");
   window.open("https://wa.me/"+WA_NUM+"?text="+encodeURIComponent(msg),"_blank","noopener");sh.remove()});$("input",sh).focus()}
 function thanks(){
  const sh=document.createElement("div");sh.className="q-thx";sh.setAttribute("role","dialog");sh.setAttribute("aria-modal","true");
  sh.innerHTML=`<div class="q-tc" dir="${l==="ar"?"rtl":"ltr"}"><span class="q-ok">✓</span><h2>${T("thanks")}</h2><p>${T("thanksL")}</p><h3>${T("nextT")}</h3><ol>${W[l].steps.map(([a,b],i)=>`<li style="--d:${200+i*90}ms"><b>${a}</b><span>${b}</span></li>`).join("")}</ol><button type="button" class="q-close">OK</button></div>`;
  document.body.appendChild(sh);sh.addEventListener("click",e=>{if(e.target===sh||e.target.closest(".q-close"))sh.remove()});$(".q-close",sh).focus()}
 document.title=(name?name+" · ":"")+"Atay Studio";frame()}


/* ======================================================================
   DEVIS / FACTURE   atayknight.com/p/#doc=…   (branded A4, print or save as PDF)
   ====================================================================== */
const encDoc=o=>{const b=new TextEncoder().encode(JSON.stringify(o));let x="";b.forEach(c=>x+=String.fromCharCode(c));return btoa(x).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")};
const decDoc=t=>{const x=atob(t.replace(/-/g,"+").replace(/_/g,"/"));return JSON.parse(new TextDecoder().decode(Uint8Array.from(x,c=>c.charCodeAt(0))))};
const DW={fr:{d:"Devis",f:"Facture",no:"N°",dt:"Date",val:"Valable jusqu’au",to:"Client",from:"Prestataire",desc:"Désignation",q:"Qté",u:"Prix unitaire",a:"Montant",sub:"Sous-total",tot:"Total",ht:"Total HT",tva:"TVA {n} %",ttc:"Total TTC",fm:"Total premier mois",then:"Puis {x} / mois",dep:"Acompte à la commande ({n} %)",paid:"Déjà réglé",due:"Reste à payer",when:"Délai souhaité",note:"Notes",terms:"Conditions",t1:"Acompte de {n} % à la commande, solde à la livraison des fichiers finaux.",t2:"Devis valable 30 jours à compter de sa date.",t3:"Paiement par virement bancaire.",sign:"Bon pour accord · date, nom et signature",pay:"Règlement",rib:"RIB",ice:"ICE",idf:"IF",rc:"RC",thx:"Merci pour votre confiance.",code:"Code de bienvenue",print:"Enregistrer en PDF",back:"Retour",mkF:"Créer la facture",save:"Enregistrer le client",due2:"À régler à réception."},
 en:{d:"Quote",f:"Invoice",no:"No.",dt:"Date",val:"Valid until",to:"Client",from:"From",desc:"Description",q:"Qty",u:"Unit price",a:"Amount",sub:"Subtotal",tot:"Total",ht:"Total excl. VAT",tva:"VAT {n}%",ttc:"Total incl. VAT",fm:"First month total",then:"Then {x} / month",dep:"Deposit to start ({n}%)",paid:"Already paid",due:"Balance due",when:"Timing",note:"Notes",terms:"Terms",t1:"{n}% deposit to start, balance on delivery of the final files.",t2:"This quote is valid for 30 days from its date.",t3:"Payment by bank transfer.",sign:"Accepted · date, name and signature",pay:"Payment",rib:"Bank account",ice:"ICE",idf:"Tax ID",rc:"RC",thx:"Thank you for your trust.",code:"Welcome code",print:"Save as PDF",back:"Back",mkF:"Make the invoice",save:"Save client",due2:"Payable on receipt."}};
const isAyoub=()=>!!store.get("atq:gh");
function docTotals(o){const sub=o.li.reduce((a,x)=>a+(+x.q||0)*(+x.u||0),0),d=Math.round(sub*(+o.dp||0)/100),tot=sub-d,tva=+BIZ.tva||0,tv=Math.round(tot*tva/100);
 return{sub,d,tot,tva,tv,ttc:tot+tv,dep:Math.round((tot+tv)*(+o.dep||0)/100),paid:+o.pd||0}}
function docHTML(o){const w=DW[o.l]||DW.fr,l=o.l==="en"?"en":"fr",M=v=>money(v,o.c,l),X=docTotals(o),B=BIZ,f=o.t==="f";
 const addD=(iso,n)=>{const d=new Date(iso+"T12:00:00");d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
 const fd=iso=>{try{return new Intl.DateTimeFormat(l==="en"?"en-GB":"fr-FR",{day:"numeric",month:"long",year:"numeric"}).format(new Date(iso+"T12:00:00"))}catch(e){return iso}};
 const ids=[B.ice&&w.ice+" "+B.ice,B.idf&&w.idf+" "+B.idf,B.rc&&w.rc+" "+B.rc].filter(Boolean).join(" · ");
 const tr=(k,v)=>w[k].replace(/\{(\w+)\}/g,(_,x)=>v[x]);
 return `<article class="dv-page" lang="${l}">
 <header class="dv-hd"><div class="dv-br"><i class="dv-lg"></i><div><b>${esc(B.name)}</b><span>${esc(B.owner)}</span></div></div>
  <div class="dv-tt"><h1>${f?w.f:w.d}</h1><dl><div><dt>${w.no}</dt><dd>${esc(o.no)}</dd></div><div><dt>${w.dt}</dt><dd>${fd(o.dt)}</dd></div>${f?"":`<div><dt>${w.val}</dt><dd>${fd(addD(o.dt,30))}</dd></div>`}</dl></div></header>
 <section class="dv-pt"><div><h4>${w.from}</h4><b>${esc(B.name)}</b><p>${esc(B.owner)}<br>${esc(B.addr)}<br>${esc(B.tel)} · ${esc(B.mail)}${ids?`<br><small>${esc(ids)}</small>`:""}</p></div>
  <div><h4>${w.to}</h4><b>${esc(o.cl.n||"—")}</b><p>${[o.cl.ad,o.cl.em,o.cl.ice&&"ICE "+o.cl.ice].filter(Boolean).map(esc).join("<br>")}</p></div></section>
 <table class="dv-tb"><thead><tr><th>${w.desc}</th><th>${w.q}</th><th>${w.u}</th><th>${w.a}</th></tr></thead><tbody>
  ${o.li.map(x=>`<tr><td><b>${esc(x.d)}</b>${x.s?`<small>${esc(x.s)}</small>`:""}</td><td>${+x.q}</td><td>${M(+x.u)}</td><td>${M((+x.q)*(+x.u))}</td></tr>`).join("")}</tbody></table>
 <div class="dv-bt"><div class="dv-nt">${o.w?`<p><b>${w.when}${o.l==="en"?":":" :"}</b> ${esc(o.w)}</p>`:""}${o.nt?`<p><b>${w.note}${o.l==="en"?":":" :"}</b> ${esc(o.nt)}</p>`:""}${o.code?`<p><b>${w.code}${o.l==="en"?":":" :"}</b> ${esc(o.code)}</p>`:""}</div>
  <dl class="dv-sum">${X.d?`<div><dt>${w.sub}</dt><dd>${M(X.sub)}</dd></div><div class="dv-dc"><dt>${esc(o.dlab||"")} (−${o.dp} %)</dt><dd>−${M(X.d)}</dd></div>`:""}
   ${X.tva?`<div><dt>${w.ht}</dt><dd>${M(X.tot)}</dd></div><div><dt>${tr("tva",{n:X.tva})}</dt><dd>${M(X.tv)}</dd></div>`:""}
   <div class="dv-tot"><dt>${o.fm?w.fm:X.tva?w.ttc:w.tot}</dt><dd>${M(X.ttc)}</dd></div>${o.fm?`<p class="dv-then">${tr("then",{x:M(X.sub)})}</p>`:""}
   ${f?`<div><dt>${w.paid}</dt><dd>${M(X.paid)}</dd></div><div class="dv-due"><dt>${w.due}</dt><dd>${M(Math.max(0,X.ttc-X.paid))}</dd></div>`:`<div class="dv-dep"><dt>${tr("dep",{n:o.dep})}</dt><dd>${M(X.dep)}</dd></div>`}</dl></div>
 <section class="dv-tm"><div><h4>${f?w.pay:w.terms}</h4><p>${f?w.due2:tr("t1",{n:o.dep})}${f?"":"<br>"+w.t2}<br>${w.t3}${B.rib?`<br><b>${w.rib}${o.l==="en"?":":" :"}</b> ${esc(B.rib)}`:""}</p></div>${f?"":`<div class="dv-sg"><h4>${w.sign}</h4><i></i></div>`}</section>
 <footer class="dv-ft"><span>${w.thx}</span><span>${esc(B.web)} · ${esc(B.tel)}</span></footer></article>`}
function showDoc(o,standalone){const w=DW[o.l]||DW.fr;let doc={...o};
 const ov=document.createElement("div");ov.className="dv";ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");
 const bar=()=>`<div class="dv-bar">${standalone?`<a class="dv-b" href="/">${ICON}</a>`:`<button type="button" class="dv-b" data-dv="x">← ${w.back}</button>`}<span class="dv-sp"></span>
  ${isAyoub()&&doc.t!=="f"?`<button type="button" class="dv-b" data-dv="f">${w.mkF}</button>`:""}${isAyoub()?`<button type="button" class="dv-b" data-dv="s">${w.save}</button>`:""}<button type="button" class="dv-b dv-pri" data-dv="p">${DOC_I}${w.print}</button></div>`;
 const paint=()=>{ov.innerHTML=bar()+`<div class="dv-sc"><div class="dv-fit">${docHTML(doc)}</div></div>`;fit()};
 const fit=()=>{const sc=$(".dv-sc",ov),pg=$(".dv-page",ov),fw=$(".dv-fit",ov);if(!pg)return;const k=Math.min(1,(sc.clientWidth-24)/pg.offsetWidth);fw.style.transform=`scale(${k})`;fw.style.height=pg.offsetHeight*k+"px";fw.style.width=pg.offsetWidth*k+"px"};
 document.body.appendChild(ov);document.documentElement.classList.add("dv-open");paint();addEventListener("resize",fit);
 const close=()=>{ov.remove();document.documentElement.classList.remove("dv-open");removeEventListener("resize",fit)};
 ov.addEventListener("click",e=>{const b=e.target.closest("[data-dv]");if(!b)return;const a=b.dataset.dv;
  if(a==="x")return close();
  if(a==="p"){const t=document.title;document.title=doc.no+" · "+BIZ.name;print();document.title=t;return}
  if(a==="f"){const y=new Date().getFullYear(),c=(+store.get("atq:fa"+y)||0)+1,dep=docTotals(doc).dep;
   const no=prompt(doc.l==="en"?"Invoice number":"Numéro de facture","FA-"+y+"-"+String(c).padStart(3,"0"));if(!no)return;
   const pd=prompt(doc.l==="en"?"Amount already paid":"Montant déjà réglé",String(dep));store.set("atq:fa"+y,String(c));
   doc={...doc,t:"f",no:no.trim(),dt:todayISO(),pd:Math.max(0,+String(pd||0).replace(/[^\d.]/g,"")||0)};paint();return}
  if(a==="s"){crmAdd({n:doc.cl.n,co:"",em:doc.cl.em||"",ad:doc.cl.ad||"",ice:doc.cl.ice||""},doc.t==="f"?{d:doc.dt,t:doc.no,a:docTotals(doc).ttc,c:doc.c}:null).then(m=>alert(m));return}});
 if(!standalone)$(".dv-b",ov).focus()}
function circleSheet(l){const T=(k,v)=>tr(l,k,v),sh=document.createElement("div");sh.className="q-thx";sh.setAttribute("role","dialog");sh.setAttribute("aria-modal","true");
 sh.innerHTML=`<div class="q-tc w-cc" dir="${l==="ar"?"rtl":"ltr"}"><span class="q-ok">★</span><h2>${T("circle")}</h2><p>${T("circleL")}</p><ol class="w-tl">
  ${TIERS.map((x,i)=>`<li class="t${i}"><b>${TN[i][LI[l]]}</b><span>${W[l].cT[i].replace("{p}",x.p)}</span><em>${W[l].cD[i].replace("{n}",i?x.d:WELCOME.pct)}</em></li>`).join("")}</ol>
  <p class="w-cn">${T("cNote")}</p><button type="button" class="q-close">OK</button></div>`;
 document.body.appendChild(sh);sh.addEventListener("click",e=>{if(e.target===sh||e.target.closest(".q-close"))sh.remove()});$(".q-close",sh).focus()}

/* ======================================================================
   LINK MAKER (Ayoub)   atayknight.com/quote/#edit
   Prices, offers and client discounts live in quote/prices.json on GitHub.
   Saving writes that file with Ayoub's own GitHub key (kept only in his browser).
   ====================================================================== */
const hist=()=>{try{return JSON.parse(store.get("atq:hist3")||"[]")}catch(e){return[]}};
const GH={repo:"atayknight/atay",branch:"gh-pages",path:"quote/prices.json"};
const b64u=s=>btoa(unescape(encodeURIComponent(s))),u64=s=>decodeURIComponent(escape(atob(s.replace(/\s/g,""))));
async function publish(change,why){const tok=store.get("atq:gh");if(!tok)throw new Error("token");
 const api=`https://api.github.com/repos/${GH.repo}/contents/${GH.path}`,h={Authorization:"Bearer "+tok,Accept:"application/vnd.github+json"};
 const r=await fetch(api+"?ref="+GH.branch+"&t="+Date.now(),{headers:h,cache:"no-store"});
 if(r.status===401||r.status===403)throw new Error("auth");
 let sha,cur=snapshot();if(r.ok){const j=await r.json();sha=j.sha;try{cur=JSON.parse(u64(j.content))}catch(e){}}else if(r.status!==404)throw new Error("net");
 change(cur);
 const w=await fetch(api,{method:"PUT",headers:{...h,"Content-Type":"application/json"},body:JSON.stringify({message:why,content:b64u(JSON.stringify(cur,null,1)+"\n"),branch:GH.branch,sha})});
 if(w.status===401||w.status===403||w.status===404)throw new Error("auth");if(!w.ok)throw new Error("net");applyData(cur);return cur}

/* ---------- private client list (Atay Circle) ----------
   Lives in a PRIVATE GitHub repo (atayknight/atay-clients · clients.json), read and written with Ayoub's key.
   Until that repo exists it is kept in this browser only. The public site only ever gets "k…" keys and a project count. */
const CRM={repo:"atayknight/atay-clients",branch:"main",path:"clients.json"};
async function crmGet(){const tok=store.get("atq:gh");const local=()=>{try{return JSON.parse(store.get("atq:crm")||"null")||{clients:[]}}catch(e){return{clients:[]}}};
 if(!tok)return{data:local(),where:"local"};
 try{const r=await fetch(`https://api.github.com/repos/${CRM.repo}/contents/${CRM.path}?ref=${CRM.branch}&t=${Date.now()}`,{headers:{Authorization:"Bearer "+tok,Accept:"application/vnd.github+json"},cache:"no-store"});
  if(r.ok){const j=await r.json();return{data:JSON.parse(u64(j.content)),sha:j.sha,where:"gh"}}
  if(r.status===404){const rr=await fetch(`https://api.github.com/repos/${CRM.repo}`,{headers:{Authorization:"Bearer "+tok,Accept:"application/vnd.github+json"},cache:"no-store"});
   if(rr.ok)return{data:local(),where:"gh-new"}}
 }catch(e){}
 return{data:local(),where:"local"}}
async function crmPut(box,why){store.set("atq:crm",JSON.stringify(box.data));
 if(box.where==="gh"||box.where==="gh-new"){const tok=store.get("atq:gh");
  const w=await fetch(`https://api.github.com/repos/${CRM.repo}/contents/${CRM.path}`,{method:"PUT",headers:{Authorization:"Bearer "+tok,Accept:"application/vnd.github+json","Content-Type":"application/json"},body:JSON.stringify({message:why,content:b64u(JSON.stringify(box.data,null,1)+"\n"),branch:CRM.branch,sha:box.sha})});
  if(w.ok){const j=await w.json();box.sha=j.content&&j.content.sha;box.where="gh"}else throw new Error("crm")}
 /* publish only anonymous keys + project counts so client links show the right level */
 const map={};box.data.clients.forEach(c=>{const k=lkey(c.n);if(k&&(c.pr||[]).length)map[k]={p:c.pr.length}});
 if(store.get("atq:gh"))await publish(d=>{d.loyal=map},"Update Atay Circle levels");else LOYAL=map}
async function crmAdd(c,pr){const box=await crmGet(),k=ckey(c.n||"");if(!k)return"Add a name first";
 let x=box.data.clients.find(y=>ckey(y.n)===k);if(!x){x={id:Date.now().toString(36),n:c.n.trim(),co:c.co||"",ph:c.ph||"",em:c.em||"",ad:c.ad||"",ice:c.ice||"",note:"",since:todayISO(),pr:[]};box.data.clients.push(x)}
 else["em","ad","ice","co","ph"].forEach(f=>{if(c[f]&&!x[f])x[f]=c[f]});
 if(pr&&!x.pr.some(p=>p.t===pr.t))x.pr.push(pr);
 try{await crmPut(box,"Client: "+x.n);return box.where==="gh"?`${x.n} saved to your clients.`:`${x.n} saved on this device. Set up the private client file to see it everywhere.`}catch(e){return"Saved on this device, but GitHub said no. Check the client file setup."}}
function maker(){de.setAttribute("dir","ltr");de.setAttribute("lang","en");document.title="Client link · Atay Studio";app.className="mk";
 let mkt="",disc=0;
 const DSEG=[0,5,10,15,20];
 app.innerHTML=`<header class="w-top"><span class="q-brand">${ICON}<b>Atay Studio</b></span><div class="q-tools mk-tools"><button type="button" class="mk-l" data-open="crm">Clients</button><button type="button" class="mk-l" data-open="doc">Quote / invoice</button><button type="button" class="mk-l" data-open="hist">Sent <i class="e-hn"></i></button><button type="button" class="mk-l" data-open="prices">Prices &amp; offers</button></div></header>
 <div class="mk-wrap"><h1>Client link</h1><p class="mk-sub">Type the client’s name and send. They pick a package or build their own, and see the price.</p>
  <div class="mk-sale" hidden></div>
  <section class="mk-card"><label class="mk-f"><span>Client name</span><input class="mk-c" placeholder="e.g. Kenza" autocomplete="off" autocapitalize="words"></label>
   <div class="mk-f"><span>Discount for this client</span><div class="mk-seg mk-ds">${DSEG.map(d=>`<button type="button" data-d="${d}" aria-pressed="${d===0}">${d?d+"%":"None"}</button>`).join("")}<input class="mk-dn" type="number" min="0" max="90" placeholder="Other %" aria-label="Other discount"></div>
    <p class="mk-hint mk-dh">Saved with the client’s name, so the link stays short.</p></div>
   <p class="mk-link"><span>Their link</span><b>atayknight.com/p/</b></p>
   <details class="mk-more"><summary>Prices shown</summary><div class="mk-seg">${[["","Auto"],["ma","Morocco DH"],["eu","Europe €"],["us","USA $"]].map(([v,t])=>`<button type="button" data-m="${v}" aria-pressed="${v===""}">${t}</button>`).join("")}</div>
    <p class="mk-hint">Auto shows DH to clients in Morocco, € in Europe and the rest of the world, $ in the Americas.</p></details></section>
  <div class="mk-act"><button type="button" class="mk-btn mk-pri" data-act="wa">${WA_I} Send on WhatsApp</button><button type="button" class="mk-btn" data-act="copy">Copy link</button><button type="button" class="mk-btn mk-gh" data-act="open">Preview</button></div>
  <p class="mk-gh-st"></p>
 </div><div class="e-toast" role="status" aria-live="polite"></div><div class="e-modal" hidden></div>`;
 const inp=$(".mk-c"),url=()=>"https://"+LINK(inp.value)+(mkt&&inp.value.trim()?"@"+mkt:mkt?"#@"+mkt:"");
 const setDisc=d=>{disc=Math.max(0,Math.min(90,+d||0));$$(".mk-ds button").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.d===disc&&(DSEG.includes(disc))));if(!DSEG.includes(disc))$(".mk-dn").value=disc;else $(".mk-dn").value=""};
 const showLink=()=>{$(".mk-link b").textContent=url().replace("https://","");const k=lkey(inp.value),v=CLIENTS[k]??CLIENTS[ckey(inp.value)];if(k&&v!=null&&!inp._touchedDisc)setDisc(v)};
 inp.addEventListener("input",()=>{inp._touchedDisc=false;showLink()});
 const toast=(t,ms)=>{const el=$(".e-toast");el.textContent=t;el.classList.add("on");clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove("on"),ms||2800)};
 const hn=()=>{$(".e-hn").textContent=hist().length||""};hn();
 const ghState=()=>{$(".mk-gh-st").innerHTML=store.get("atq:gh")?`<span class="mk-dot ok"></span>GitHub connected: price changes and discounts save to your site. <button type="button" class="mk-a" data-open="gh">Change</button>`:`<span class="mk-dot"></span>To save price changes and discounts, <button type="button" class="mk-a" data-open="gh">connect GitHub</button> once.`};ghState();
 const saleBox=()=>{const s=activeSale(),b=$(".mk-sale");b.hidden=!s;if(s)b.innerHTML=`🎁 Offer on now: <b>${s.pct}% off</b>${s.until?" until "+fmtD(s.until,"en"):""}. Clients see it unless they have their own discount.`};saleBox();
 const copy=t=>{if(navigator.clipboard&&isSecureContext)navigator.clipboard.writeText(t).catch(()=>fb(t));else fb(t)};
 const fb=t=>{const ta=document.createElement("textarea");ta.value=t;ta.style.cssText="position:fixed;opacity:0";document.body.appendChild(ta);ta.select();try{document.execCommand("copy")}catch(e){}ta.remove()};
 function remember(u){const n=inp.value.trim()||"(no name)";const h=hist().filter(x=>x.url!==u);h.unshift({c:n,d:new Date().toISOString().slice(0,10),url:u,disc});store.set("atq:hist3",JSON.stringify(h.slice(0,80)));hn()}
 const msg=u=>{const n=inp.value.trim();return `${n?"Hi "+n+"! ":"Hi! "}Here is your project link from Atay Studio. Pick a package or build your own, and you'll see the price straight away:\n${u}`};
 const errMsg=e=>e.message==="token"?"Connect GitHub first to save it":e.message==="auth"?"GitHub said no: check your key in “connect GitHub”":"Couldn’t reach GitHub. Try again in a moment";
 async function saveDisc(){const k=lkey(inp.value),old=ckey(inp.value);if(!k){if(disc){toast("Add the client’s name to give a discount");return false}return true}
  if((CLIENTS[k]??CLIENTS[old]??0)===disc)return true;
  try{const nm=JSON.parse(store.get("atq:names")||"{}");nm[k]=inp.value.trim();store.set("atq:names",JSON.stringify(nm))}catch(e){}
  if(!store.get("atq:gh")){connect("To save a client discount, connect GitHub once.");return false}
  toast("Saving the discount…",8000);
  try{await publish(d=>{d.clients=d.clients||{};delete d.clients[old];if(disc)d.clients[k]=disc;else delete d.clients[k]},`Discount for ${inp.value.trim()}: ${disc}%`);toast(disc?`${disc}% saved for ${inp.value.trim()}. Live in about a minute.`:"Discount removed");return true}
  catch(e){toast(errMsg(e));return false}}
 app.onclick=async e=>{const t=e.target;
  const m=t.closest("[data-m]");if(m){mkt=m.dataset.m;$$("[data-m]").forEach(b=>b.setAttribute("aria-pressed",b===m));showLink();return}
  const d=t.closest(".mk-ds [data-d]");if(d){inp._touchedDisc=true;setDisc(d.dataset.d);return}
  const a=t.closest("[data-act]");if(a){const u=url();const w=a.dataset.act==="wa"||a.dataset.act==="open"?window.open("about:blank","_blank"):null;
   const ok=await saveDisc();if(!ok){if(w)w.close();return}remember(u);
   if(a.dataset.act==="copy"){copy(u);toast("Link copied")}
   if(a.dataset.act==="open"&&w)w.location=u;
   if(a.dataset.act==="wa"&&w)w.location="https://wa.me/?text="+encodeURIComponent(msg(u));return}
  const op=t.closest("[data-open]");if(op){const k=op.dataset.open;k==="prices"?prices():k==="gh"?connect():k==="crm"?clients():k==="doc"?docMaker():sent()}};
 app.addEventListener("input",e=>{if(e.target.matches(".mk-dn")){inp._touchedDisc=true;disc=Math.max(0,Math.min(90,+e.target.value||0));$$(".mk-ds button").forEach(b=>b.setAttribute("aria-pressed",false))}});
 function sheet(html){const md=$(".e-modal");md.hidden=false;md.innerHTML=`<div class="e-mc" role="dialog" aria-modal="true">${html}</div>`;md.onclick=e=>{if(e.target===md||e.target.closest("[data-x]"))md.hidden=true};const mc=md.firstElementChild;mc.close=()=>{md.hidden=true};return mc}
 function sent(){const h=hist();sheet(`<div class="e-mh"><b>Sent links</b><button type="button" class="e-ic" data-x aria-label="Close">×</button></div>
  ${h.length?`<ul class="e-hl">${h.map(x=>`<li><div><b>${esc(x.c)}${x.disc?` <em class="mk-pill">−${x.disc}%</em>`:""}</b><span>${esc(x.d)} · ${esc(x.url.replace("https://",""))}</span></div><button type="button" class="mk-btn mk-sm" data-cp="${esc(x.url)}">Copy</button></li>`).join("")}</ul>`:`<p class="mk-hint">Links you send or copy appear here.</p>`}`).addEventListener("click",e=>{const c=e.target.closest("[data-cp]");if(c){copy(c.dataset.cp);toast("Link copied")}})}
 function connect(why){const has=!!store.get("atq:gh");
  const m=sheet(`<div class="e-mh"><b>Connect GitHub</b><button type="button" class="e-ic" data-x aria-label="Close">×</button></div>
   ${why?`<p class="mk-warn">${esc(why)}</p>`:""}<p class="mk-hint">Your prices live in a small file on your website. A GitHub key lets this page update that file for you. The key stays only in this browser. Do this once on each device you use.</p>
   <ol class="mk-steps"><li>Open <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">GitHub → New fine-grained token</a> (signed in as atayknight).</li>
   <li>Name it <b>Atay prices</b>, expiration <b>1 year</b>.</li><li>Repository access: <b>Only select repositories</b> → <b>atay</b> and <b>atay-clients</b>.</li>
   <li>Permissions → Repository → <b>Contents: Read and write</b>.</li><li>Generate, copy the key and paste it here.</li></ol>
   <label class="mk-pr mk-key2"><span>GitHub key</span><input type="text" class="mk-tok" name="gh-key-x" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-1p-ignore data-lpignore="true" style="-webkit-text-security:disc;font-family:var(--mono)" placeholder="${has?"Saved. Paste a new one to replace it":"github_pat_…"}" autocomplete="off"></label>
   <div class="mk-act"><button type="button" class="mk-btn mk-pri" data-save>Save and test</button>${has?`<button type="button" class="mk-btn mk-gh" data-forget>Disconnect</button>`:""}</div>`);
  m.addEventListener("click",async e=>{if(e.target.closest("[data-forget]")){store.set("atq:gh","");try{localStorage.removeItem("atq:gh")}catch(_){ }m.close();ghState();toast("Disconnected");return}
   if(!e.target.closest("[data-save]"))return;const v=$(".mk-tok",m).value.replace(/\s+/g,"");if(v.length<20){toast("Paste the whole key (it starts with github_pat_)");return}
   toast("Testing the key…",8000);let r;
   try{r=await fetch(`https://api.github.com/repos/${GH.repo}`,{headers:{Authorization:"Bearer "+v,Accept:"application/vnd.github+json"},cache:"no-store"})}catch(_){toast("Couldn’t reach GitHub. Check your internet and try again.",6000);return}
   if(r.status===401){toast("GitHub doesn’t recognise this key. Copy it again with the copy button and paste it whole.",7000);return}
   if(r.status===404||r.status===403){toast("This key can’t see the atay repository. In the key settings, add atay under Repository access.",7000);return}
   const j=r.ok?await r.json().catch(()=>null):null;
   if(j&&j.permissions&&j.permissions.push===false){toast("This key can only read. Set Contents to Read and write.",7000);return}
   if(!r.ok){toast("GitHub answered "+r.status+". Try again in a moment.",6000);return}
   store.set("atq:gh",v);m.close();ghState();toast("Connected. You can now save prices, discounts and clients.",4000)})}
 async function clients(){const m=sheet(`<div class="e-mh"><b>Clients · Atay Circle</b><button type="button" class="e-ic" data-x aria-label="Close">×</button></div><p class="mk-hint">Loading…</p>`);
  const box=await crmGet();let q="";
  const tot=c=>{const o={};(c.pr||[]).forEach(p=>o[p.c]=(o[p.c]||0)+(+p.a||0));return Object.entries(o).map(([c,a])=>money(a,c,"en")).join(" + ")||"—"};
  const paint=()=>{const L=box.data.clients.filter(c=>!q||(c.n+" "+(c.co||"")).toLowerCase().includes(q)).sort((a,b)=>(b.pr||[]).length-(a.pr||[]).length);
   m.innerHTML=`<div class="e-mh"><b>Clients · Atay Circle</b><button type="button" class="e-ic" data-x aria-label="Close">×</button></div>
   ${box.where==="local"?`<div class="mk-warn">Saved in this browser only. To keep your client list private and on every device: <a href="https://github.com/new?name=atay-clients&visibility=private&description=Atay%20Studio%20clients%20(private)" target="_blank" rel="noopener">create a private repo named atay-clients</a>, then add it to your “Atay prices” key (<a href="https://github.com/settings/personal-access-tokens" target="_blank" rel="noopener">GitHub keys</a> → Repository access → add atay-clients). Reopen this panel after.</div>`:`<p class="mk-hint">🔒 Private: stored in your private GitHub repo atay-clients. Client links only see a level, never names or amounts.</p>`}
   <div class="mk-cr"><input class="mk-q" placeholder="Search a client" value="${esc(q)}"><button type="button" class="mk-btn mk-pri mk-sm" data-c="new">+ Client</button></div>
   <div class="mk-tl">${TIERS.map((x,i)=>`<span class="mk-tg t${i}">${TN[i][0]} ${i?`· ${x.p}+ projects · −${x.d}%`:`· welcome −${WELCOME.pct}%`}</span>`).join("")}</div>
   <ul class="mk-crm">${L.map(c=>{const n=(c.pr||[]).length,t=tierOf(n),nx=TIERS[t+1];return `<li data-id="${c.id}"><div class="mk-ch"><b>${esc(c.n)}</b>${c.co?`<span>${esc(c.co)}</span>`:""}<em class="mk-tg t${t}">${TN[t][0]}</em></div>
    <p>${n} project${n===1?"":"s"} · ${tot(c)}${nx?` · ${Math.max(0,nx.p-n)} to ${TN[t+1][0]}`:""}${c.ph?` · ${esc(c.ph)}`:""}${c.em?` · ${esc(c.em)}`:""}</p>
    ${(c.pr||[]).length?`<ol>${c.pr.slice().reverse().slice(0,4).map(p=>`<li>${esc(p.d)} · ${esc(p.t)} · ${money(+p.a||0,p.c,"en")}</li>`).join("")}</ol>`:""}
    <div class="mk-ca"><button type="button" class="mk-btn mk-sm mk-pri" data-c="pr">+ Project</button><button type="button" class="mk-btn mk-sm" data-c="link">Send link</button><button type="button" class="mk-btn mk-sm mk-gh" data-c="ed">Edit</button></div></li>`}).join("")||`<li class="mk-hint">No clients yet. Add one, or open a client’s invoice request and tap “Save client”.</li>`}</ul>`;
   $(".mk-q",m).addEventListener("input",e=>{q=e.target.value.toLowerCase();const p=e.target.selectionStart;paint();const i=$(".mk-q",m);i.focus();i.setSelectionRange(p,p)})};
  const form=(c)=>{const isNew=!c;c=c||{n:"",co:"",ph:"",em:"",ad:"",ice:"",note:""};
   m.innerHTML=`<div class="e-mh"><b>${isNew?"New client":esc(c.n)}</b><button type="button" class="e-ic" data-c="list" aria-label="Back">←</button></div>
   <div class="mk-biz">${[["n","Name (as in their link)"],["co","Company"],["ph","Phone / WhatsApp"],["em","Email"],["ad","Address"],["ice","ICE"]].map(([k,t])=>`<label class="mk-pr"><span>${t}</span><input data-f="${k}" value="${esc(c[k]||"")}"></label>`).join("")}</div>
   <label class="mk-pr"><span>Notes</span><textarea data-f="note" rows="3">${esc(c.note||"")}</textarea></label>
   ${!isNew&&(c.pr||[]).length?`<h4>Projects</h4><ul class="e-hl">${c.pr.map((p,i)=>`<li><div><b>${esc(p.t)}</b><span>${esc(p.d)} · ${money(+p.a||0,p.c,"en")}</span></div><button type="button" class="mk-btn mk-sm" data-rp="${i}">Remove</button></li>`).join("")}</ul>`:""}
   <div class="mk-act"><button type="button" class="mk-btn mk-pri" data-c="save">Save</button>${!isNew?`<button type="button" class="mk-btn mk-gh" data-c="del">Delete client</button>`:""}</div>`;m._cur=c;m._new=isNew};
  const prForm=c=>{m.innerHTML=`<div class="e-mh"><b>New project · ${esc(c.n)}</b><button type="button" class="e-ic" data-c="list" aria-label="Back">←</button></div>
   <div class="mk-biz"><label class="mk-pr"><span>What</span><input data-p="t" placeholder="e.g. Social Starter, November"></label><label class="mk-pr"><span>Date</span><input type="date" data-p="d" value="${todayISO()}"></label>
   <label class="mk-pr"><span>Amount</span><input type="number" min="0" data-p="a"></label><label class="mk-pr"><span>Currency</span><select data-p="c"><option>MAD</option><option>EUR</option><option>USD</option></select></label></div>
   <p class="mk-hint">Each project moves the client toward the next Atay Circle level. A monthly package: add one per month.</p><div class="mk-act"><button type="button" class="mk-btn mk-pri" data-c="prsave">Add project</button></div>`;m._cur=c};
  const save=async why=>{toast("Saving…",8000);try{await crmPut(box,why);toast(box.where==="gh"?"Saved. Client levels update on your site in about a minute.":"Saved on this device.")}catch(e){toast("Saved on this device. GitHub said no for the private file.")}};
  m.addEventListener("click",async e=>{const b=e.target.closest("[data-c],[data-rp]");if(!b)return;const li=e.target.closest("[data-id]"),c=li?box.data.clients.find(x=>x.id===li.dataset.id):m._cur;
   const a=b.dataset.c;
   if(b.dataset.rp!=null){c.pr.splice(+b.dataset.rp,1);await save("Remove project");form(c);return}
   if(a==="list")return paint();if(a==="new")return form(null);if(a==="ed")return form(c);if(a==="pr")return prForm(c);
   if(a==="link"){m.close();inp.value=c.n;inp._touchedDisc=false;showLink();inp.focus();return}
   if(a==="save"){const v={};$$("[data-f]",m).forEach(i=>v[i.dataset.f]=i.value.trim());if(!v.n){toast("Add a name");return}
    if(m._new){if(box.data.clients.some(x=>ckey(x.n)===ckey(v.n))){toast("That name is already in your clients");return}box.data.clients.push({id:Date.now().toString(36),since:todayISO(),pr:[],...v})}else Object.assign(c,v);
    await save("Client: "+v.n);paint();return}
   if(a==="del"){if(!confirm("Delete "+c.n+" and their projects from your list?"))return;box.data.clients=box.data.clients.filter(x=>x!==c);await save("Remove client");paint();return}
   if(a==="prsave"){const v={};$$("[data-p]",m).forEach(i=>v[i.dataset.p]=i.value.trim());if(!v.t||!(+v.a>=0)){toast("Add what and the amount");return}
    c.pr=c.pr||[];c.pr.push({d:v.d||todayISO(),t:v.t,a:+v.a||0,c:v.c});const n=c.pr.length,t=tierOf(n);await save("Project for "+c.n);paint();
    if(TIERS[t].p===n&&t>0)toast(`🎉 ${c.n} is now ${TN[t][0]}: −${TIERS[t].d}% on their next projects.`,5000)}});
  paint()}
 function docMaker(){const m=sheet(`<div class="e-mh"><b>Quote / invoice</b><button type="button" class="e-ic" data-x aria-label="Close">×</button></div>
   <p class="mk-hint">For custom projects. Client quotes from their link are made automatically, and invoice requests reach you on WhatsApp with a link to the filled-in quote.</p>
   <div class="mk-seg mk-dt"><button type="button" data-t="d" aria-pressed="true">Devis</button><button type="button" data-t="f" aria-pressed="false">Facture</button></div>
   <div class="mk-biz"><label class="mk-pr"><span>Client or company</span><input data-o="n"></label><label class="mk-pr"><span>ICE</span><input data-o="ice"></label><label class="mk-pr"><span>Address</span><input data-o="ad"></label><label class="mk-pr"><span>Email</span><input data-o="em"></label>
   <label class="mk-pr"><span>Currency</span><select data-o="c"><option>MAD</option><option>EUR</option><option>USD</option></select></label><label class="mk-pr"><span>Language</span><select data-o="l"><option value="fr">Français</option><option value="en">English</option></select></label></div>
   <h4>Lines</h4><div class="mk-lines"></div><button type="button" class="mk-btn mk-sm" data-ln>+ Line</button>
   <div class="mk-row3"><label class="mk-pr"><span>Discount %</span><input type="number" min="0" max="90" data-o="dp" value="0"></label><label class="mk-pr"><span>Deposit %</span><input type="number" min="0" max="100" data-o="dep" value="${DEPOSIT}"></label><label class="mk-pr mk-fo"><span>Already paid</span><input type="number" min="0" data-o="pd" value="0"></label></div>
   <div class="mk-act mk-stick"><button type="button" class="mk-btn mk-pri" data-mk>Create</button></div>`);
  let t="d";const addLn=()=>{const d=document.createElement("div");d.className="mk-ln";d.innerHTML=`<input placeholder="Description" data-l="d"><input type="number" min="1" value="1" data-l="q" aria-label="Qty"><input type="number" min="0" placeholder="Unit price" data-l="u" aria-label="Unit price">`;$(".mk-lines",m).appendChild(d)};addLn();addLn();
  const fo=()=>$$(".mk-fo",m).forEach(x=>x.hidden=t!=="f");fo();
  m.addEventListener("click",e=>{const b=e.target.closest("[data-t]");if(b){t=b.dataset.t;$$("[data-t]",m).forEach(x=>x.setAttribute("aria-pressed",x===b));fo();return}
   if(e.target.closest("[data-ln]"))return addLn();
   if(!e.target.closest("[data-mk]"))return;const o={};$$("[data-o]",m).forEach(i=>o[i.dataset.o]=i.value.trim());
   const li=$$(".mk-ln",m).map(r=>({d:$('[data-l="d"]',r).value.trim(),q:+$('[data-l="q"]',r).value||1,u:+$('[data-l="u"]',r).value||0})).filter(x=>x.d);
   if(!li.length){toast("Add at least one line");return}
   const y=new Date().getFullYear(),dt=todayISO();let no;
   if(t==="f"){const c=(+store.get("atq:fa"+y)||0)+1;store.set("atq:fa"+y,String(c));no="FA-"+y+"-"+String(c).padStart(3,"0")}else no="DEV-"+dt.slice(2).replace(/-/g,"")+"-"+Math.random().toString(36).slice(2,6).toUpperCase();
   m.close();showDoc({t,no,dt,l:o.l,c:o.c,cl:{n:o.n,ice:o.ice,ad:o.ad,em:o.em},li,dp:+o.dp||0,dlab:o.l==="en"?"Discount":"Remise",dep:+o.dep||0,pd:+o.pd||0})})}
 function prices(){const mk=["ma","eu","us"],D=snapshot();
  const cell=(m,path)=>{const v=path.split(".").reduce((o,k)=>o&&o[k],D[m]);return `<td><input type="number" min="0" step="10" data-mk="${m}" data-p="${path}" value="${v??""}" aria-label="${m} ${path}"></td>`};
  const row=(name,path)=>`<tr><td>${name}</td>${mk.map(m=>cell(m,path)).join("")}</tr>`;
  const cl=Object.entries(D.clients||{});let NM={};try{NM=JSON.parse(store.get("atq:names")||"{}")}catch(e){}
  const s=D.sale||{};
  const m=sheet(`<div class="e-mh"><b>Prices &amp; offers</b><button type="button" class="e-ic" data-x aria-label="Close">×</button></div>
   <h4>Offer for everyone</h4><p class="mk-hint">A discount on every client link, for example during Ramadan or a launch. Leave it at 0 for no offer. A client’s own discount replaces it.</p>
   <div class="mk-row3"><label class="mk-pr"><span>Discount %</span><input type="number" min="0" max="90" data-sale="pct" value="${s.pct||0}"></label><label class="mk-pr"><span>Ends on <small>optional</small></span><input type="date" data-sale="until" value="${esc(s.until||"")}"></label><label class="mk-pr"><span>Name <small>optional</small></span><input type="text" data-sale="name" placeholder="e.g. Ramadan offer" value="${esc(s.name||"")}"></label></div>
   ${cl.length?`<h4>Client discounts</h4><ul class="e-hl mk-cl">${cl.map(([k,v])=>`<li><div><b>${esc(NM[k]||(/^k[0-9a-z]+$/.test(k)?"Client "+k.slice(1,6):k.replace(/-/g," ")))}</b></div><em class="mk-pill">−${v}%</em><button type="button" class="mk-btn mk-sm" data-rm="${esc(k)}">Remove</button></li>`).join("")}</ul>`:""}
   <h4>Welcome offer <small>after a booked call</small></h4><p class="mk-hint">New clients who book a discovery call get this discount on their first month. They see it on the Book a call section and it is applied in their price.</p>
   <div class="mk-row3"><label class="mk-pr"><span>Discount %</span><input type="number" min="0" max="90" data-wel value="${(D.welcome||WELCOME).on?(D.welcome||WELCOME).pct:0}"></label></div>
   <h4>Atay Circle <small>loyalty levels</small></h4><p class="mk-hint">Clients move up after a number of projects (each month of a monthly package counts as one). Log projects in Clients.</p>
   <div class="mk-tw"><table class="mk-tb mk-ed mk-tier"><thead><tr><th></th><th>After projects</th><th>Discount %</th></tr></thead><tbody>${(D.tiers||TIERS).slice(1).map((x,i)=>`<tr><td>${TN[i+1][0]}</td><td><input type="number" min="1" data-tp="${i+1}" value="${x.p}"></td><td><input type="number" min="0" max="90" data-td="${i+1}" value="${x.d}"></td></tr>`).join("")}</tbody></table></div>
   <h4>Your business details <small>on quotes and invoices</small></h4><p class="mk-hint">Shown on every devis and facture. This file is public, so only add what you would print on an invoice.</p>
   <div class="mk-biz">${[["name","Business name"],["owner","Your name"],["addr","Address"],["tel","Phone"],["mail","Email"],["ice","ICE"],["idf","IF (identifiant fiscal)"],["rc","RC or auto-entrepreneur no."],["rib","RIB (bank account)"],["tva","VAT % (0 if not charged)"]].map(([k,t])=>`<label class="mk-pr"><span>${t}</span><input type="${k==="tva"?"number":"text"}" data-biz="${k}" value="${esc((D.biz||BIZ)[k]??"")}"></label>`).join("")}</div>
   <h4>Deposit to start</h4><label class="mk-pr"><span>% of the total</span><input type="number" min="0" max="100" data-dep value="${D.deposit}"></label>
   <h4>Prices</h4><p class="mk-hint">Morocco in DH, Europe in €, USA in $. Packages show their saving against the single prices automatically.</p>
   <div class="mk-tw"><table class="mk-tb mk-ed"><thead><tr><th></th><th>DH</th><th>€</th><th>$</th></tr></thead><tbody>
   <tr class="mk-th"><td colspan="4">Packages</td></tr>${Object.keys(PK).map(k=>row(PK[k].n[0]+(PK[k].mo?" /month":""),"pk."+k)).join("")}
   <tr class="mk-th"><td colspan="4">Filming</td></tr>${ORDER.filter(k=>SV[k].m==="f").map(k=>row(SV[k].n[0]+" /"+SV[k].u[0][0],k)).join("")}
   <tr class="mk-th"><td colspan="4">Remote</td></tr>${ORDER.filter(k=>SV[k].m==="r").map(k=>row(SV[k].n[0]+" /"+SV[k].u[0][0],k)).join("")}
   <tr class="mk-th"><td colspan="4">Extras</td></tr>${Object.keys(XT).map(x=>row(XT[x].n[0],"x."+x)).join("")}
   </tbody></table></div>
   <div class="mk-act mk-stick"><button type="button" class="mk-btn mk-pri" data-save>Save and publish</button></div>`);
  const rmd=new Set();
  m.addEventListener("click",async e=>{const rm=e.target.closest("[data-rm]");if(rm){rmd.add(rm.dataset.rm);rm.closest("li").remove();return}
   if(!e.target.closest("[data-save]"))return;
   if(!store.get("atq:gh")){connect("To publish prices, connect GitHub once.");return}
   const sale={pct:+($('[data-sale="pct"]',m).value)||0,until:$('[data-sale="until"]',m).value||"",name:$('[data-sale="name"]',m).value.trim()};
   const dep=Math.max(0,Math.min(100,+$("[data-dep]",m).value||0));
   const vals=$$("[data-mk]",m).map(i=>[i.dataset.mk,i.dataset.p,+i.value]).filter(x=>x[2]>0);
   toast("Publishing…",9000);
   const wel=Math.max(0,Math.min(90,+$("[data-wel]",m).value||0));
   const tiers=[{p:0,d:0},...[1,2,3].map(i=>({p:Math.max(1,+$(`[data-tp="${i}"]`,m).value||1),d:Math.max(0,Math.min(90,+$(`[data-td="${i}"]`,m).value||0))}))];
   const biz={};$$("[data-biz]",m).forEach(i=>biz[i.dataset.biz]=i.dataset.biz==="tva"?Math.max(0,+i.value||0):i.value.trim());
   try{await publish(d=>{d.welcome={pct:wel,on:wel>0?1:0};d.tiers=tiers;d.biz=biz;d.sale=sale;d.deposit=dep;d.clients=d.clients||{};rmd.forEach(k=>delete d.clients[k]);
     vals.forEach(([mk,p,v])=>{d[mk]=d[mk]||JSON.parse(JSON.stringify(PR[mk]));const ks=p.split(".");let o=d[mk];for(let i=0;i<ks.length-1;i++)o=o[ks[i]]=o[ks[i]]||{};o[ks.at(-1)]=v})},"Update prices and offers");
    m.close();saleBox();toast("Published. Live on your site in about a minute.",4000)}catch(err){toast(errMsg(err))}})}
}

/* ---------- router ---------- */
function route(){let h=decodeURIComponent(location.hash.slice(1)||"");
 if(h==="edit")return maker();
 if(/^doc=/.test(location.hash.slice(1))){try{const o=decDoc(location.hash.slice(5));theme();app.className="dv-solo";document.title=o.no+" · Atay Studio";return showDoc(o,true)}catch(e){}}
 let name="",mk="";
 if(/^p=/.test(h)){/* older long links: keep the name */try{const o=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(new URLSearchParams(location.hash.slice(1)).get("p").replace(/-/g,"+").replace(/_/g,"/")),c=>c.charCodeAt(0))));name=o.c||""}catch(e){}}
 else{const m=h.match(/@(ma|eu|us)$/);if(m){mk=m[1];h=h.slice(0,-3)}name=h.replace(/[-_]+/g," ").trim().slice(0,60)}
 flow(name,mk||autoMarket())}
addEventListener("hashchange",()=>location.reload());
fetch("/quote/prices.json?t="+Date.now(),{cache:"no-store"}).then(r=>r.ok?r.json():null).catch(()=>null).then(j=>{applyData(j);route()});
})();
