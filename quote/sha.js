/* SHA-256 + HMAC in plain JS (works on http, where WebCrypto is unavailable) */
const SHA=(()=>{const P=[];for(let n=2;P.length<64;n++){if(P.every(p=>n%p))P.push(n)}
 const fr=x=>((x-Math.floor(x))*4294967296)>>>0;const K=P.map(p=>fr(Math.cbrt(p))),H0=P.slice(0,8).map(p=>fr(Math.sqrt(p)));
 const r=(x,n)=>(x>>>n)|(x<<(32-n));
 function sha256(m){const l=m.length,bl=((l+9+63)>>6)<<6,b=new Uint8Array(bl);b.set(m);b[l]=0x80;const dv=new DataView(b.buffer);dv.setUint32(bl-4,(l*8)>>>0);dv.setUint32(bl-8,Math.floor(l/536870912));
  const h=H0.slice(),w=new Uint32Array(64);
  for(let o=0;o<bl;o+=64){for(let i=0;i<16;i++)w[i]=dv.getUint32(o+i*4);
   for(let i=16;i<64;i++){const a=w[i-15],c=w[i-2];w[i]=(w[i-16]+(r(a,7)^r(a,18)^(a>>>3))+w[i-7]+(r(c,17)^r(c,19)^(c>>>10)))>>>0}
   let [A,B,C,D,E,F,G,Hh]=h;
   for(let i=0;i<64;i++){const t1=(Hh+(r(E,6)^r(E,11)^r(E,25))+((E&F)^(~E&G))+K[i]+w[i])>>>0,t2=((r(A,2)^r(A,13)^r(A,22))+((A&B)^(A&C)^(B&C)))>>>0;
    Hh=G;G=F;F=E;E=(D+t1)>>>0;D=C;C=B;B=A;A=(t1+t2)>>>0}
   h[0]=(h[0]+A)>>>0;h[1]=(h[1]+B)>>>0;h[2]=(h[2]+C)>>>0;h[3]=(h[3]+D)>>>0;h[4]=(h[4]+E)>>>0;h[5]=(h[5]+F)>>>0;h[6]=(h[6]+G)>>>0;h[7]=(h[7]+Hh)>>>0}
  const out=new Uint8Array(32),ov=new DataView(out.buffer);h.forEach((x,i)=>ov.setUint32(i*4,x));return out}
 const te=new TextEncoder();
 function hmac(key,msg){let k=te.encode(key);if(k.length>64)k=sha256(k);const kp=new Uint8Array(64);kp.set(k);
  const ip=kp.map(x=>x^0x36),op=kp.map(x=>x^0x5c),m=te.encode(msg);
  const inner=new Uint8Array(64+m.length);inner.set(ip);inner.set(m,64);const ih=sha256(inner);
  const outer=new Uint8Array(96);outer.set(op);outer.set(ih,64);return [...sha256(outer)].map(x=>x.toString(16).padStart(2,"0")).join("")}
 return {sha256:s=>[...sha256(te.encode(s))].map(x=>x.toString(16).padStart(2,"0")).join(""),hmac}})();
if(typeof module!=="undefined")module.exports=SHA;
