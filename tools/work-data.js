// Prints the project list (from public/index.html) as JSON for the /work/ page.
const fs=require("fs"),vm=require("vm"),path=require("path");
const s=fs.readFileSync(path.join(__dirname,"../public/index.html"),"utf8");
const pick=(a,b)=>{const i=s.indexOf(a);return s.slice(i,s.indexOf(b,i)+b.length)};
const P=pick("const P=[","\n];"),CL=s.slice(s.indexOf("const CLIPS={"),s.indexOf("\n",s.indexOf("const CLIPS={")));
const ctx={};vm.runInNewContext(P.replace("const P=","P=")+"\n"+CL.replace("const CLIPS=","CLIPS="),ctx);
const slugs={};for(const m of s.matchAll(/<a href="work\/([^"]+)\/" data-pj="([^"]+)">/g))slugs[m[2]]=m[1];
const out=ctx.P.map(p=>({...p,clip:(ctx.CLIPS[p.id]||[])[0]||null,n:(ctx.CLIPS[p.id]||[]).length,slug:slugs[String(p.id)]}));
process.stdout.write(JSON.stringify(out));
