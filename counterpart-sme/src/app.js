/* ============================================================
   INDEX
   ============================================================ */
Object.assign(C.war,{lt:"Warranties: goods and products"});
Object.assign(C["war-s"],{lt:"Warranties: services"});
Object.assign(C["tsa-price"],{lt:"TSA Charges"});
Object.assign(C["tsa-scope"],{lt:"TSA Service Standard"});
Object.assign(C["tsa-term"],{lt:"TSA Service Period"});
Object.assign(C["dist-excl"],{lt:"Distributor Appointment and Exclusivity"});
Object.assign(C["nda-def"],{lt:"Definition of Confidential Information"});
Object.assign(C["nda-term"],{lt:"Duration of Confidentiality"});
Object.assign(C["lic-war"],{lt:"Licensor's Warranties"});

const AG={}, PATH={};
(function idx(nodes,trail){nodes.forEach(n=>{if(n.id){AG[n.id]=n;PATH[n.id]=trail}else idx(n.k,trail.concat(n.n))})})(TREE,[]);
const ALL=Object.values(AG);
const GUIDE={}; GUIDES.forEach(g=>GUIDE[g.id]=g);
const orderOf=a=>a.o||K[a.k].order;
/* an agreement may refine its kind: own recitals, extra or replacement definitions, schedules and drafting note */
const recOf=a=>a.rec||K[a.k].rec, schOf=a=>a.sch||K[a.k].sch||[], noteOf=a=>a.note||K[a.k].note;
const fullOrder=a=>["*defs"].concat(orderOf(a),K[a.k].boil||BOIL,K[a.k].tail);
const negKeys=a=>fullOrder(a).filter(k=>C[k]).concat(K[a.k].fam||[]);
const USED={}; ALL.forEach(a=>negKeys(a).forEach(k=>{(USED[k]=USED[k]||[]).push(a.id)}));
const RISK=["","Low risk","Low to moderate","Balanced","Moderate to high","High risk"];
const riskOf=(lean,side)=>side==="B"?lean+3:3-lean;
const ranked=(k,side)=>C[k].o.map((o,i)=>({o,i,r:riskOf(o[1],side)})).sort((x,y)=>x.r-y.r||x.i-y.i);
function presetPick(k,side,preset){
  const r=ranked(k,side);
  if(preset==="playbook"){const p=typeof pbOf==="function"&&pbOf(k,side);if(p&&p.p!=null)return p.p;preset="market"}
  if(preset==="strong") return r[0].i;
  if(preset==="soft") return r[r.length-1].i;
  let best=r[0]; r.forEach(x=>{if(Math.abs(x.o[1])<Math.abs(best.o[1]))best=x}); return best.i;
}
const famTitle=k=>C[k].lt||C[k].t;
const guidesFor=keys=>{const s=[];keys.forEach(k=>{const g=(C[k]&&C[k].g)||(F[k]&&F[k].g)||[];g.forEach(x=>{if(GUIDE[x]&&!s.includes(x))s.push(x)})});return s};

/* ============================================================
   STATE
   ============================================================ */
let ST={docs:{},pe:false};
try{const s=JSON.parse(localStorage.getItem("counterpart.v2")||"null");if(s&&s.docs)ST=Object.assign(ST,s)}catch(e){}
const save=()=>{try{localStorage.setItem("counterpart.v2",JSON.stringify(ST))}catch(e){} if(typeof SMEX!=="undefined")SMEX.afterSave()};
function docState(id){
  if(!ST.docs[id]) ST.docs[id]={side:null,preset:"strong",picks:{B:{},S:{}},parties:{B:{n:"",no:"",ad:""},S:{n:"",no:"",ad:""}}};
  return ST.docs[id];
}
function picksFor(a){
  const d=docState(a.sid||a.id), side=d.side||"B", p=d.picks[side];
  negKeys(a).forEach(k=>{if(p[k]==null||!C[k].o[p[k]]) p[k]=presetPick(k,side,d.preset)});
  return p;
}
let view={v:"home",tab:"agreements",q:""}, cur=null, sel=null, clauseCtx={k:null,ag:null,side:"B"};

/* ============================================================
   TEXT
   ============================================================ */
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const PH=/\[(?:[^\[\]]|\[[^\]]*\])*\]/g;
function tok(s,cx,cap){
  const a=cx.a, kd=K[a.k];
  s=s.replace(/\{SC:([a-z]+)\}/g,(m,k)=>cx.nums&&cx.nums["§"+k]?"Schedule "+cx.nums["§"+k]:"the relevant Schedule");
  s=s.replace(/\{R:([^}]+)\}/g,(m,k)=>cx.nums&&cx.nums[k]?"clause "+cx.nums[k]:"this Agreement");
  s=s.replace(/\{N\}/g,cx.num!=null?String(cx.num):"[●]");
  s=s.replace(/\{D\}/g,kd.D||"the Deliverables").replace(/\{T\}/g,kd.T||"the Company").replace(/\{U\}/g,a.U||"[●]").replace(/\{TD\}/g,a.TD||"[●]");
  s=s.replace(/\{B\}/g,a.ref?a.ref[0]:"the "+a.p[0]).replace(/\{S\}/g,a.ref?a.ref[1]:"the "+a.p[1]);
  if(kd.doc) s=s.replace(/this Agreement/g,"this "+kd.doc).replace(/This Agreement/g,"This "+kd.doc);
  if(cap!==false) s=s.replace(/(^|[.!?]\s+)the /g,(m,p)=>p+"The ");
  return fillPH(s,cx);
}
/* ---------- deal details: each blank is keyed by the words before it, so the same blank in the same wording is filled once ---------- */
let COLLECT=null;
const phKey=(str,off,m,cx)=>(cx.cell?cx.cell+"|":"")+str.slice(Math.max(0,off-40),off).replace(/\s+/g," ")+m;
function fillPH(s,cx){
  if(!cx||!(cx.fill||COLLECT)) return s;
  return s.replace(PH,(m,off,str)=>{const k=phKey(str,off,m,cx);
    if(COLLECT) COLLECT.push({k,ph:m,u:cx.u||"",lab:cx.lab||"",pre:str.slice(Math.max(0,off-110),off),post:str.slice(off+m.length,off+m.length+60)});
    const v=cx.fill&&cx.fill[k]; return v?(cx.mark?"\u0001"+v+"\u0002":v):m});
}
const cellCx=(cx,b,ri,ci)=>Object.assign({},cx,{cell:"T:"+b.tbl.cols.join("/")+"#"+ri+"."+ci});
const markFV=h=>h.replace(/\u0001([^\u0002]*)\u0002/g,'<span class="fv">$1</span>');
const dated=(m,ph)=>{const v=m.d.fill&&m.d.fill["@date"];return v?esc(v):ph};
const H=(s,cx,cap)=>esc(tok(s,cx,cap)).replace(PH,m=>`<span class="ph">${m}</span>`);
const L=(s,a)=>s.replace(/\{B\}/g,a.p[0]).replace(/\{S\}/g,a.p[1]);
const letter=i=>"("+String.fromCharCode(97+i)+")";

const INTERP=["Clause and Schedule headings shall not affect the interpretation of this Agreement.","Unless the context otherwise requires, words in the singular include the plural and words in the plural include the singular.","A reference to a statute or statutory provision is a reference to it as amended, extended or re-enacted from time to time, and includes all subordinate legislation made under it.","Any words following the terms including, include, in particular, for example or any similar expression are illustrative and shall not limit the sense of the words preceding those terms.","A reference to writing or written includes email.","The Schedules form part of this Agreement and shall have effect as if set out in full in the body of this Agreement."];
const BD={"Business Day":"a day other than a Saturday, Sunday or public holiday in England, when banks in London are open for business"};

/* ============================================================
   MODEL
   ============================================================ */
const flat=p=>typeof p==="string"?p:[p[0]].concat(p[1],p[2]?[p[2]]:[]).join(" ");
function schedBlocks(key,ctx){const s=SCHED[key];return s&&s.gen&&(!s.kinds||s.kinds.includes(ctx.a.k))?s.gen(ctx):null}
const flatBlocks=bs=>bs.map(b=>b.p?flat(b.p):b.tbl?b.tbl.rows.map(r=>Array.isArray(r)?r.join(" "):"").join(" "):"").join(" ");
function build(a,opt){
  const d=docState(a.sid||a.id), side=d.side||"B", picks=picksFor(a), order=fullOrder(a), nums={}, kd=K[a.k];
  order.forEach((k,i)=>nums[k]=i+1);
  const defs=Object.assign({},BD);
  order.forEach(k=>{if(C[k]){Object.assign(defs,C[k].df||{});const o=C[k].o[picks[k]];if(o[5])Object.assign(defs,o[5])}});
  Object.values(SCHED).forEach(x=>{if(x.df)Object.keys(x.df).forEach(t=>{if(!(t in defs))defs[t]=x.df[t]})});
  Object.assign(defs,kd.defs,a.defs||{});
  const cl=order.map((k,i)=>{
    const n=i+1;
    if(C[k]){const f=C[k],o=f.o[picks[k]];return {k,n,t:f.t,neg:true,o,oi:picks[k],paras:(f.pre||[]).concat(o[2]),r:riskOf(o[1],side)}}
    return {k,n,t:F[k].t,neg:false,paras:F[k].p};
  });
  if(d.edits&&!(opt&&opt.raw)) cl.forEach(c=>{const e=d.edits[c.k];if(e&&c.k!=="*defs"){c.paras=e.slice();c.edited=true}});
  /* schedules referenced by the draft, and definitions it actually uses (directly, through a kept definition or a schedule) */
  const body=cl.filter(c=>c.k!=="*defs").map(c=>c.paras.map(flat).join(" ")).join(" ")+" "+recOf(a).join(" ");
  const re=t=>new RegExp("(^|[^A-Za-z])"+t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"(?!(?:[a-rt-z]|s[a-z]))");
  const ctx={a,d,picks,side}, keep=new Set(), schSet=new Set(), disc=[], gens={}, queue=[body];
  const addSch=k=>{if(schSet.has(k))return;schSet.add(k);disc.push(k);const g=schedBlocks(k,ctx);gens[k]=g;if(g)queue.push(flatBlocks(g))};
  schOf(a).forEach(k=>{const x=SCHED[k];if(x&&x.always&&(!x.kinds||x.kinds.includes(a.k)))addSch(k)});
  while(queue.length){const txt=queue.pop();
    Object.keys(defs).forEach(t=>{if(!keep.has(t)&&re(t).test(txt)){keep.add(t);queue.push(defs[t])}});
    (txt.match(/\{SC:[a-z]+\}/g)||[]).forEach(x=>addSch(x.slice(4,-1)));
  }
  Object.keys(defs).forEach(t=>{if(!keep.has(t))delete defs[t]});
  const pref=schOf(a).filter(k=>schSet.has(k));
  const list=pref.concat(disc.filter(k=>!pref.includes(k)&&k!=="notices"),schSet.has("notices")?["notices"]:[]);
  list.forEach((k,i)=>nums["§"+k]=i+1);
  const sc=list.map((k,i)=>{
    const x=SCHED[k]||{t:"[Schedule]",e:""}, fam=x.fam&&(!x.kinds||x.kinds.includes(a.k))?x.fam:null, o=fam?C[fam].o[picks[fam]]:null;
    return {k:fam||"§"+k,key:k,n:i+1,t:x.t,e:x.e,sch:true,neg:!!fam,o,oi:fam?picks[fam]:null,r:fam?riskOf(o[1],side):null,blocks:gens[k],edit:!!(x.edit&&gens[k])};
  });
  return {a,d,side,picks,order,nums,defs,cl,sc,all:cl.concat(sc)};
}
const defList=m=>Object.keys(m.defs).sort((x,y)=>x.localeCompare(y)).map(t=>[t,m.defs[t]]);
const defBody=(t,v)=>(/^has /.test(v)?"":"means ")+v;
function stats(m){
  const n=m.all.filter(c=>c.neg), counts=[0,0,0,0,0,0]; n.forEach(c=>counts[c.r]++);
  const avg=n.length?n.reduce((s,c)=>s+c.r,0)/n.length:0;
  return {n,counts,avg,band:Math.max(1,Math.round(avg))};
}

/* ---------- document HTML ---------- */
function subHTML(p,cx,label){
  let body;
  if(typeof p==="string") body=`<p>${H(p,cx)}</p>`;
  else body=`<p>${H(p[0],cx)}</p><div class="items">${p[1].map((it,i)=>`<div class="it"><span class="il">${letter(i)}</span><span>${H(it,cx,false)}</span></div>`).join("")}</div>${p[2]?`<p class="tail">${H(p[2],cx,false)}</p>`:""}`;
  return `<div class="sub${label?"":" solo"}">${label?`<span class="sn">${label}</span>`:""}<div class="st">${body}</div></div>`;
}
function partyLine(m,w){
  const a=m.a, kd=K[a.k], pr=m.d.parties[w], label=a.p[w==="B"?0:1];
  const v=(x,ph)=>x?esc(x):`<span class="ph">${ph}</span>`;
  if(kd.ind===w) return `<b>${v(pr.n,"[FULL NAME]")}</b> of ${v(pr.ad,"[address]")} (the “<b>${esc(label)}</b>”)`;
  return `<b>${v(pr.n,"[COMPANY NAME] LIMITED")}</b>, a company incorporated and registered in England and Wales with company number ${v(pr.no,"[number]")} whose registered office is at ${v(pr.ad,"[address]")} (the “<b>${esc(label)}</b>”)`;
}
function sigBlock(m,w){
  const a=m.a, kd=K[a.k], pr=m.d.parties[w], nm=pr.n?esc(pr.n):`<span class="ph">[NAME]</span>`;
  if(kd.ind===w) return `<div class="sig"><div class="sig-l">Signed by ${nm}</div><div class="sig-r"><span class="line"></span></div></div>`;
  if(kd.deed) return `<div class="sig"><div class="sig-l">Executed as a deed by ${nm} acting by <span class="ph">[●]</span>, a director, in the presence of:<div class="wit">Witness signature<span class="line"></span>Witness name<span class="line"></span>Witness address<span class="line"></span></div></div><div class="sig-r"><span class="line"></span>Director</div></div>`;
  return `<div class="sig"><div class="sig-l">Signed by <span class="ph">[NAME OF DIRECTOR]</span>, director, for and on behalf of ${nm}</div><div class="sig-r"><span class="line"></span>Director</div></div>`;
}
function docHTML(m){
  const a=m.a, kd=K[a.k], word=(kd.doc||"Agreement").toUpperCase(), first=kd.first, second=first==="B"?"S":"B";
  const fill=m.d.fill, cx={a,nums:m.nums,fill,mark:true};
  let h=`<header class="cover"><div class="cv-kicker">Draft for discussion · Prepared for the ${esc(m.side==="B"?a.p[0]:a.p[1])}</div><h2 class="cv-title">${esc(a.n)}</h2><div class="cv-rule"></div><p class="cv-date">THIS ${word} is dated ${dated(m,'<span class="ph">[●]</span>')}</p></header>`;
  h+=`<h4 class="sec">Parties</h4><div class="parties"><div class="pt"><span class="pn">(1)</span><span>${partyLine(m,first)}; and</span></div><div class="pt"><span class="pn">(2)</span><span>${partyLine(m,second)}.</span></div></div>`;
  if(recOf(a).length) h+=`<h4 class="sec">Background</h4><div class="recs">${recOf(a).map((r,i)=>`<div class="pt"><span class="pn">(${String.fromCharCode(65+i)})</span><span>${H(r,cx)}</span></div>`).join("")}</div>`;
  h+=`<h4 class="sec">Agreed terms</h4>`;
  m.cl.forEach(c=>{
    const cxx={a,nums:m.nums,num:c.n,fill,mark:true};
    let body="";
    if(c.k==="*defs"){
      body+=`<div class="sub"><span class="sn">1.1</span><div class="st"><p>${H("In this Agreement, the following definitions apply:",cxx)}</p><div class="defs">${defList(m).map(([t,v])=>`<p class="def"><b>“${esc(t)}”</b> ${H(defBody(t,v),cxx,false)};</p>`).join("")}</div></div></div>`;
      body+=INTERP.map((p,i)=>subHTML(p,cxx,"1."+(i+2))).join("");
    } else if(ST.ed){
      body=`<div class="ed" contenteditable="true" spellcheck="true" data-bek="${c.k}" aria-label="Edit clause ${c.n}">${clauseLines(c,{a,nums:m.nums,num:c.n}).map(l=>`<div>${esc(l)}</div>`).join("")}</div>`;
    } else if(c.edited){
      body=c.paras.map(l=>editedLineHTML(fillPH(l,cxx))).join("");
    } else {
      const multi=c.paras.length>1;
      body=c.paras.map((p,i)=>subHTML(p,cxx,multi?c.n+"."+(i+1):"")).join("");
    }
    const plain=c.neg?C[c.k].d:F[c.k].e;
    h+=`<section class="cl${c.neg?" neg r"+c.r:""}${sel===c.k?" on":""}" data-k="${c.k}" id="cl-${c.k}" tabindex="0">
      <h3><span class="cn">${c.n}.</span><span class="ctt">${esc(tok(c.t,cxx))}</span>${c.neg?`<span class="mk"><i></i>${RISK[c.r]}<em>${C[c.k].o.length} options</em></span>`:""}${c.edited?`<span class="mk chg">Edited</span>`:""}</h3>
      ${ST.pe?`<p class="pe"><span>In plain English</span>${esc(plain)}</p>`:""}${body}</section>`;
  });
  h+=`<p class="exec">${H(kd.deed?"This Agreement has been executed as a deed and is delivered and takes effect on the date stated at the beginning of it.":"This Agreement has been entered into on the date stated at the beginning of it.",cx)}</p>`;
  m.sc.forEach(c=>{
    const cxx={a,nums:m.nums,num:null,fill,mark:true};
    const mk=c.neg?`<span class="mk"><i></i>${RISK[c.r]}<em>${C[c.k].o.length} options</em></span>`:c.edit?`<span class="mk ed">Editable</span>`:c.blocks?"":`<span class="mk todo">To complete</span>`;
    h+=`<section class="cl sch${c.neg?" neg r"+c.r:""}${sel===c.k?" on":""}" data-k="${c.k}" id="cl-${c.k}" tabindex="0">
      <div class="sch-h"><span class="sch-n">Schedule ${c.n}</span><h3>${esc(c.t)}</h3>${mk}</div>
      ${ST.pe&&c.e?`<p class="pe"><span>In plain English</span>${esc(c.e)}</p>`:""}
      ${c.blocks?blocksHTML(c.blocks,cxx):`<div class="todo-b"><span class="ph">[To be completed]</span> ${esc(c.e)}</div>`}</section>`;
  });
  h+=`<h4 class="sec sig-sec">Execution</h4><div class="sigs">${sigBlock(m,first)}${sigBlock(m,second)}</div>`;
  return markFV(h);
}
const numLabel=n=>n&&/^\d+$/.test(n)?n+".":n||"";
function blocksHTML(bs,cx){return bs.map(b=>{
  if(b.h) return `<div class="sp-h"><span>${esc(b.h)}</span>${esc(tok(b.s,cx))}</div>${ST.pe&&b.e?`<p class="pe"><span>In plain English</span>${esc(b.e)}</p>`:""}`;
  if(b.ph!=null) return `<div class="sub pht"><span class="sn">${b.ph?esc(b.ph)+".":""}</span><div class="st"><p>${esc(b.t)}</p></div></div>`;
  if(b.p) return subHTML(b.p,cx,numLabel(b.n));
  if(b.tbl) return `<div class="tw"><table class="tbl"><colgroup>${b.tbl.w.map(w=>`<col style="width:${w}%">`).join("")}</colgroup><thead><tr>${b.tbl.cols.map(c=>`<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${b.tbl.rows.map((r,ri)=>Array.isArray(r)?`<tr>${r.map((c,ci)=>`<td>${H(c,cellCx(cx,b,ri,ci))}</td>`).join("")}</tr>`:`<tr class="grp"><td colspan="${b.tbl.cols.length}">${esc(r.group)}</td></tr>`).join("")}</tbody></table></div>`;
  return "";
}).join("")}
/* ---------- plain text export ---------- */
function plainPara(p,cx,label){
  const ind="      ";
  if(typeof p==="string") return (label?label+"  ":"")+tok(p,cx);
  return (label?label+"  ":"")+tok(p[0],cx)+"\n"+p[1].map((it,i)=>ind+letter(i)+" "+tok(it,cx,false)).join("\n")+(p[2]?"\n"+ind+tok(p[2],cx,false):"");
}
function docText(m){
  const a=m.a, kd=K[a.k], word=(kd.doc||"Agreement").toUpperCase(), first=kd.first, second=first==="B"?"S":"B", fill=m.d.fill, cx={a,nums:m.nums,fill,u:"Background"};
  const strip=s=>s.replace(/<[^>]+>/g,"").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"');
  let t=`${a.n.toUpperCase()}\n\nTHIS ${word} is dated ${strip(dated(m,"[●]"))}\n\nPARTIES\n\n(1) ${strip(partyLine(m,first))}; and\n(2) ${strip(partyLine(m,second))}.\n\n`;
  if(recOf(a).length) t+="BACKGROUND\n\n"+recOf(a).map((r,i)=>`(${String.fromCharCode(65+i)}) ${tok(r,cx)}`).join("\n")+"\n\n";
  t+="AGREED TERMS\n\n";
  m.cl.forEach(c=>{
    const cxx={a,nums:m.nums,num:c.n,fill,u:c.k==="*defs"?"Definitions":c.n+". "+tok(c.t,{a})};
    t+=`${c.n}. ${tok(c.t,cxx).toUpperCase()}\n\n`;
    if(c.k==="*defs"){
      t+="1.1  "+tok("In this Agreement, the following definitions apply:",cxx)+"\n\n"+defList(m).map(([k,v])=>`      “${k}” ${tok(defBody(k,v),Object.assign({},cxx,{lab:"“"+k+"”"}),false)};`).join("\n\n")+"\n\n";
      t+=INTERP.map((p,i)=>`1.${i+2}  ${tok(p,cxx)}`).join("\n\n")+"\n\n";
    } else if(c.edited){
      t+=c.paras.map(l=>fillPH(l,cxx)).join("\n\n")+"\n\n";
    } else {
      const multi=c.paras.length>1;
      t+=c.paras.map((p,i)=>plainPara(p,cxx,multi?c.n+"."+(i+1):"")).join("\n\n")+"\n\n";
    }
  });
  t+=tok(kd.deed?"This Agreement has been executed as a deed and is delivered and takes effect on the date stated at the beginning of it.":"This Agreement has been entered into on the date stated at the beginning of it.",cx);
  const cx0=cx;
  m.sc.forEach(c=>{
    t+=`\n\n\nSCHEDULE ${c.n}\n${c.t.toUpperCase()}\n\n`;
    if(!c.blocks){t+="[To be completed]";return}
    const cx=Object.assign({},cx0,{u:"Schedule "+c.n+". "+c.t});
    t+=c.blocks.map(b=>b.h?`${b.h.toUpperCase()}\n${tok(b.s,cx).toUpperCase()}`:b.ph!=null?`${b.ph?b.ph+". ":""}${b.t.toUpperCase()}`:b.p?plainPara(b.p,cx,numLabel(b.n)):b.tbl?[b.tbl.cols.join(" | ")].concat(b.tbl.rows.map((r,ri)=>Array.isArray(r)?r.map((x,ci)=>tok(x,cellCx(cx,b,ri,ci))).join(" | "):r.group.toUpperCase())).join("\n"):"").join("\n\n");
  });
  t+="\n\n\nEXECUTION\n\n"+[first,second].map(w=>{const pr=m.d.parties[w],nm=pr.n||"the "+a.p[w==="B"?0:1];return kd.ind===w?`Signed by ${nm}\n\n..............................`:kd.deed?`Executed as a deed by ${nm} acting by [●], a director, in the presence of:\n\n.............................. Director\n\nWitness signature ..............................\nWitness name ..............................\nWitness address ..............................`:`Signed by [NAME OF DIRECTOR], director, for and on behalf of ${nm}\n\n.............................. Director`}).join("\n\n\n");
  return t;
}

/* ---------- editing and Word export for the builder ---------- */
const LINE_LAB=/^(\d+(?:\.\d+)+|\([a-z]{1,4}\))\s+/;
const hl=s=>esc(s).replace(PH,m=>`<span class="ph">${m}</span>`);
function clauseLines(c,cxx){
  if(c.edited) return c.paras.map(l=>fillPH(l,cxx));
  const multi=c.paras.length>1, out=[];
  c.paras.forEach((p,i)=>{const lab=multi?c.n+"."+(i+1):"";
    if(typeof p==="string") out.push((lab?lab+" ":"")+tok(p,cxx));
    else{out.push((lab?lab+" ":"")+tok(p[0],cxx));p[1].forEach((it,j)=>out.push(letter(j)+" "+tok(it,cxx,false)));if(p[2])out.push(tok(p[2],cxx,false))}});
  return out;
}
function editedLineHTML(t){
  const m=t.match(LINE_LAB);
  if(!m) return `<div class="sub solo"><div class="st"><p>${hl(t)}</p></div></div>`;
  return m[1][0]==="("?`<div class="sub solo"><div class="st"><div class="items"><div class="it"><span class="il">${esc(m[1])}</span><span>${hl(t.slice(m[0].length))}</span></div></div></div></div>`:`<div class="sub"><span class="sn">${esc(m[1])}</span><div class="st"><p>${hl(t.slice(m[0].length))}</p></div></div>`;
}
function commitBuilderEdit(el){
  const k=el.dataset.bek, d=docState(cur.sid||cur.id), lines=el.innerText.split("\n").map(x=>x.replace(/\s+/g," ").trim()).filter(Boolean);
  const raw=build(cur,{raw:true}), c=raw.cl.find(x=>x.k===k); if(!c) return;
  const lib=clauseLines(c,{a:raw.a,nums:raw.nums,num:c.n});
  d.edits=d.edits||{};
  if(!lines.length||lines.join("\n")===lib.join("\n")) delete d.edits[k]; else d.edits[k]=lines;
  save();
}
const lineBlock=l=>{const m=l.match(LINE_LAB);if(!m)return{p:l,ind:[720,0]};return{p:l.slice(m[0].length),label:m[1],ind:m[1][0]==="("?[1440,720]:[720,720]}};
function builderBlocks(m,notes){
  const a=m.a, kd=K[a.k], word=(kd.doc||"Agreement").toUpperCase(), first=kd.first, second=first==="B"?"S":"B", fill=m.d.fill, cx={a,nums:m.nums,fill}, you=m.side==="B"?a.p[0]:a.p[1];
  const strip=s=>s.replace(/<[^>]+>/g,"").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"');
  const B=[], comments=[]; let cid=1;
  const note=(b,text)=>{if(!notes)return;const id=cid++;b.cs=[id];b.ce=[id];comments.push({id,text})};
  B.push({p:a.n,style:"Title"},{p:`THIS ${word} is dated ${strip(dated(m,"[●]"))}`},{p:"Parties",style:"Label"},
    {p:strip(partyLine(m,first))+"; and",label:"(1)",ind:[720,720]},{p:strip(partyLine(m,second))+".",label:"(2)",ind:[720,720]});
  if(recOf(a).length){B.push({p:"Background",style:"Label"});recOf(a).forEach((r,i)=>B.push({p:tok(r,cx),label:"("+String.fromCharCode(65+i)+")",ind:[720,720]}))}
  B.push({p:"Agreed terms",style:"Label"});
  m.cl.forEach(c=>{const cxx={a,nums:m.nums,num:c.n,fill}, hb={p:tok(c.t,cxx),style:"Heading1",label:c.n+"."};
    if(c.neg) note(hb,`${RISK[c.r]} for the ${you}. Position: ${L(c.o[0],a)}. ${m.side==="B"?c.o[3]:c.o[4]}`+(c.edited?" This clause has been edited from the library wording.":""));
    else if(c.edited) note(hb,"This clause has been edited from the library wording.");
    B.push(hb);
    if(c.k==="*defs"){B.push({p:tok("In this Agreement, the following definitions apply:",cxx),label:"1.1",ind:[720,720]});defList(m).forEach(([t,v])=>B.push({p:[[`“${t}”`,{b:true}],[" "+tok(defBody(t,v),cxx,false)+";",{}]],ind:[720,0]}));INTERP.forEach((p,i)=>B.push({p:tok(p,cxx),label:"1."+(i+2),ind:[720,720]}));return}
    clauseLines(c,cxx).forEach(l=>B.push(lineBlock(l)));
  });
  B.push({p:tok(kd.deed?"This Agreement has been executed as a deed and is delivered and takes effect on the date stated at the beginning of it.":"This Agreement has been entered into on the date stated at the beginning of it.",cx),italic:true});
  m.sc.forEach(c=>{
    B.push({p:"Schedule "+c.n,style:"Heading2",pageBreak:true});const tb={p:c.t,style:"Heading2"};
    if(c.neg) note(tb,`${RISK[c.r]} for the ${you}. Position: ${L(c.o[0],a)}. ${m.side==="B"?c.o[3]:c.o[4]}`);
    B.push(tb);
    if(!c.blocks){B.push({p:"[To be completed] "+c.e});return}
    c.blocks.forEach(b=>{
      if(b.h) B.push({p:b.h+"  "+tok(b.s,cx),style:"Heading2"});
      else if(b.ph!=null) B.push({p:b.t,label:b.ph?b.ph+".":"",style:b.ph?"Heading1":"Label"});
      else if(b.p){const lab=numLabel(b.n);
        if(typeof b.p==="string") B.push({p:tok(b.p,cx),label:lab||undefined,ind:[720,lab?720:0]});
        else{B.push({p:tok(b.p[0],cx),label:lab||undefined,ind:[720,lab?720:0]});b.p[1].forEach((it,j)=>B.push({p:tok(it,cx,false),label:letter(j),ind:[1440,720]}));if(b.p[2])B.push({p:tok(b.p[2],cx,false),ind:[720,0]})}}
      else if(b.tbl) B.push({tbl:{cols:b.tbl.cols,w:b.tbl.w,rows:b.tbl.rows.map((r,ri)=>Array.isArray(r)?r.map((x,ci)=>tok(x,cellCx(cx,b,ri,ci))):r)}});
    });
  });
  B.push({p:"Execution",style:"Label",pageBreak:true});
  [first,second].forEach(w=>{const pr=m.d.parties[w],nm=pr.n||("the "+a.p[w==="B"?0:1]);
    if(kd.ind===w) B.push({p:`Signed by ${nm}`},{p:"........................................"});
    else if(kd.deed) B.push({p:`Executed as a deed by ${nm} acting by [●], a director, in the presence of:`},{p:"........................................  Director"},{p:"Witness signature ........................................"},{p:"Witness name ........................................"},{p:"Witness address ........................................"});
    else B.push({p:`Signed by [NAME OF DIRECTOR], director, for and on behalf of ${nm}`},{p:"........................................  Director"});
    B.push({p:""});
  });
  return {B,comments};
}

/* ---------- deal details questionnaire ---------- */
function blanksOf(m){
  let got; COLLECT=[]; try{docText(m)}finally{got=COLLECT;COLLECT=null}
  const seen={},out=[]; got.forEach(x=>{if(seen[x.k]){seen[x.k].n++;return}const y=Object.assign({n:1},x);seen[x.k]=y;out.push(y)}); return out;
}
function dealProgress(m){const b=blanksOf(m),f=m.d.fill||{},done=b.filter(x=>f[x.k]).length+(f["@date"]?1:0);return {done,total:b.length+1,b}}
const phHint=ph=>{const x=ph.slice(1,-1).replace(/[\[\]●]/g,"").trim();return x.length>1?x:""};

/* ============================================================
   SHARED UI PIECES
   ============================================================ */
const meter=r=>`<span class="meter" aria-hidden="true">${[1,2,3,4,5].map(n=>`<i class="${n<=r?"f":""}"></i>`).join("")}</span>`;
function optionCard(k,x,rank,a,side,opts){
  const o=x.o, you=side==="B"?a.p[0]:a.p[1], them=side==="B"?a.p[1]:a.p[0];
  const why=side==="B"?o[3]:o[4], other=side==="B"?o[4]:o[3];
  const cx={a,nums:opts.nums,num:opts.num};
  const wording=(C[k].pre&&opts.full?[]:[]).concat(o[2]);
  return `<div class="opt r${x.r}${opts.current?" cur":""}">
    <div class="o-top"><span class="o-rank">${rank}</span><div class="o-h"><span class="o-label">${esc(L(o[0],a))}</span>
      <span class="o-tags">${rank===1?`<em class="t best">Strongest for the ${esc(you)}</em>`:""}${o[1]===0?`<em class="t mkt">Market standard</em>`:""}${opts.current?`<em class="t now">In your draft</em>`:""}${typeof pbTag==="function"?pbTag(k,x.i,side):""}</span></div>
      <span class="o-risk">${meter(x.r)}<span>${RISK[x.r]}</span></span></div>
    <p class="o-why"><b>For the ${esc(you)}.</b> ${esc(why)}</p>
    <p class="o-other"><b>How the ${esc(them)} sees it.</b> ${esc(other)}</p>
    ${opts.open?`<div class="wording">${wording.map((p,i)=>subHTML(p,cx,"")).join("")}</div>`:`<details class="wd"><summary>Read the wording</summary><div class="wording">${wording.map(p=>subHTML(p,cx,"")).join("")}</div></details>`}
    ${opts.act?`<div class="o-act">${opts.current?`<span class="in">Currently in the draft</span>`:`<button class="btn silver" data-act="use" data-k="${k}" data-i="${x.i}">Use this wording</button>`}</div>`:""}
    ${opts.copy?`<div class="o-act"><button class="btn ghost" data-act="copyopt" data-k="${k}" data-i="${x.i}">Copy wording</button></div>`:""}
  </div>`;
}
const guideLinks=ids=>ids.length?`<div class="glinks">${ids.map(id=>`<button class="gl" data-act="guide" data-g="${id}"><span>${esc(GUIDE[id].cat)}</span>${esc(GUIDE[id].t)}</button>`).join("")}</div>`:"";

/* ============================================================
   HEADER
   ============================================================ */
/* ---------- settings: appearance and profile ---------- */
const prof=()=>Object.assign({name:"",role:"",org:"",side:"",use:""},ST.profile||{});
function applyMode(){
  if(typeof document==="undefined"||!document.documentElement||!document.documentElement.dataset)return;
  const m=ST.mode||"dark", root=document.documentElement;let light=m==="light";
  if(m==="system"){const host=root.dataset.theme;light=host?host==="light":!!(window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches)}
  root.dataset.mode=light?"light":"dark";
}
try{matchMedia("(prefers-color-scheme: light)").addEventListener("change",applyMode)}catch(e){}
try{new MutationObserver(()=>{if(ST.mode==="system")applyMode()}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]})}catch(e){}
function profileContext(){const p=prof(),b=[];if(p.role||p.org)b.push(`The user is ${p.role||"a lawyer"}${p.org?" at "+p.org:""}.`);if(p.use)b.push("How they use these agreements: "+p.use);return b.join("\n")}
function settingsHTML(){const p=prof(),m=ST.mode||"dark";
  return `<div class="dlg set" role="dialog" aria-modal="true" aria-labelledby="st-h"><p class="kicker">Settings</p><h2 id="st-h">Your preferences</h2><p class="dlg-d">Saved in this browser only.</p>
  <div class="set-sec"><h3>Appearance</h3><div class="opts" role="group" aria-label="Appearance">${[["dark","Dark"],["light","Light"],["system","Match my device"]].map(([v,l])=>`<button data-act="stmode" data-v="${v}" aria-pressed="${m===v}">${l}</button>`).join("")}</div></div>
  <div class="set-sec"><h3>About you</h3><p class="hint">Your name goes on tracked changes and comments in Word exports. Your role and how you use these agreements give Claude context when it reviews or redrafts.</p>
   <div class="fld2"><label class="fld"><span>Name</span><input id="st-name" value="${esc(p.name)}" placeholder="For example: A Patel"></label><label class="fld"><span>Role</span><input id="st-role" value="${esc(p.role)}" placeholder="For example: Senior Associate, Corporate and Commercial"></label></div>
   <div class="fld2"><label class="fld"><span>Organisation</span><input id="st-org" value="${esc(p.org)}" placeholder="For example: a mid-sized City firm, or an in-house legal team"></label><label class="fld"><span>You usually act for</span><select id="st-side"><option value="">It varies</option><option value="B"${p.side==="B"?" selected":""}>The buy side (buyer, customer, licensee, tenant)</option><option value="S"${p.side==="S"?" selected":""}>The sell side (seller, supplier, licensor, landlord)</option></select></label></div>
   <label class="fld"><span>What you use these agreements for</span><textarea id="st-use" rows="4" placeholder="For example: Commercial contracts and mid-market M&A for technology and services clients. We act on both sides, usually for the customer or the buyer.">${esc(p.use)}</textarea></label></div>
  ${bkSettingsHTML()}
  <div class="dlg-f"><button class="btn ghost" data-act="closemodal">Cancel</button><button class="btn silver" data-act="stsave">Save settings</button></div></div>`}
function header(){
  if(typeof SMEX!=="undefined") return SMEX.header();
  const tab=view.v==="home"?view.tab:view.v==="review"?"review":view.v==="matters"||view.v==="matter"||(view.v==="doc"&&cur&&cur.mid)?"matters":view.v==="clause"?"clauses":view.v==="guide"?"guidance":"agreements";
  return `<header class="bar wrap"><button class="brand" data-act="home" data-tab="agreements" aria-label="Counterpart home"><span class="wm">Counterpart</span><span class="sub">English law</span></button>
  <nav class="nav">${[["agreements","Agreements"],["review","Review a draft"],["playbook","Playbook"],["clauses","Clause library"],["guidance","Guidance"],["matters","Matters"]].map(([t,l])=>`<button data-act="${t==="matters"?"matters":"home"}" data-tab="${t}" class="${tab===t?"on":""}">${l}</button>`).join("")}</nav>
  <button class="gear" data-act="settings" aria-label="Settings"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg><span>Settings</span></button></header>`;
}

/* ============================================================
   HOME
   ============================================================ */
const match=(q,...xs)=>!q||xs.join(" ").toLowerCase().includes(q);
function listHTML(){
  if(view.tab==="playbook") return playbookHTML();
  if(view.tab==="quality") return qualityHTML();
  const q=view.q.toLowerCase();
  const nG=GUIDES.length, nC=Object.keys(C).length;
  let list="";
  if(view.tab==="agreements"){
    TREE.forEach(cat=>{
      const subs=cat.k.map(sc=>{const items=sc.k.filter(a=>match(q,a.n,a.d,a.p.join(" "),cat.n,sc.n));return items.length?`<div class="branch"><h3>${esc(sc.n)}</h3><ul>${items.map(a=>`<li><button class="ag" data-act="open" data-id="${a.id}"><span class="ag-n">${esc(a.n)}</span><span class="ag-p">${esc(a.p[0])} <i>and</i> ${esc(a.p[1])}</span><span class="ag-d">${esc(a.d)}</span><span class="ag-c">${negKeys(a).length} negotiable clauses</span></button></li>`).join("")}</ul></div>`:""}).join("");
      if(subs) list+=`<section class="cat"><h2><span>${esc(cat.n)}</span></h2><div class="branches">${subs}</div></section>`;
    });
  } else if(view.tab==="clauses"){
    const groups={};
    Object.keys(C).forEach(k=>{const g=GUIDE[C[k].g[0]]; const cat=g?g.cat:"Other"; if(match(q,famTitle(k),C[k].d,cat))(groups[cat]=groups[cat]||[]).push(k)});
    ["Risk","Rights","Corporate","Property","Finance","Disputes","Foundations"].forEach(cat=>{const ks=groups[cat];if(!ks)return;
      list+=`<section class="cat"><h2><span>${esc(cat)}</span></h2><div class="clist">${ks.sort((x,y)=>famTitle(x).localeCompare(famTitle(y))).map(k=>`<button class="ci" data-act="clause" data-k="${k}"><span class="ci-t">${esc(famTitle(k))}</span><span class="ci-d">${esc(C[k].d)}</span><span class="ci-m">${C[k].o.length} drafting options · used in ${(USED[k]||[]).length} agreement${(USED[k]||[]).length===1?"":"s"}</span></button>`).join("")}</div></section>`});
  } else {
    const cats=[...new Set(GUIDES.map(g=>g.cat))];
    cats.forEach(cat=>{const gs=GUIDES.filter(g=>g.cat===cat&&match(q,g.t,g.s,g.b.filter(x=>typeof x==="string").join(" ")));if(!gs.length)return;
      list+=`<section class="cat"><h2><span>${esc(cat)}</span></h2><div class="glist">${gs.map(g=>`<button class="gi" data-act="guide" data-g="${g.id}"><span class="gi-t">${esc(g.t)}</span><span class="gi-s">${esc(g.s)}</span><span class="gi-m">Read the guide</span></button>`).join("")}</div></section>`});
  }
  if(!list) list=`<p class="none">Nothing matches “${esc(view.q)}”. Try a broader term, such as “liability” or “lease”.</p>`;
  return list;
}
function homeHTML(){
  const nG=GUIDES.length, nC=Object.keys(C).length, list=listHTML();
  const ph={agreements:"Search agreements, for example share purchase or lease",clauses:"Search clauses, for example indemnity or break",guidance:"Search guidance, for example penalties or deeds"}[view.tab];
  if(typeof SMEX!=="undefined") return SMEX.home(list,ph);
  return `<section class="hero wrap"><div class="hero-in">
    <p class="kicker">Agreements · Clauses · Guidance</p>
    <h1>Draft with precision. <em>Understand every position.</em></h1>
    <p class="lede">Build a complete English law agreement clause by clause. Each negotiable clause offers alternative drafting, ranked by the risk it carries for your client, with the law explained in plain English. Or upload a draft you are negotiating and review it clause by clause.</p>
    <div class="hero-cta"><button class="btn silver" data-act="home" data-tab="agreements" data-scroll="1">Build an agreement</button><button class="btn ghost" data-act="home" data-tab="review">Review a draft</button></div>
    <div class="counts"><span><b>${ALL.length}</b> agreements</span><span><b>${nC}</b> negotiable clauses</span><span><b>${Object.values(C).reduce((s,c)=>s+c.o.length,0)}</b> drafting options</span><span><b>${nG}</b> guides</span></div>
  </div></section>
  <div class="tabs wrap"><div class="tabs-in">${[["agreements","Agreements"],["clauses","Clause library"],["guidance","Guidance"],["playbook","Playbook"],["quality","Content review"]].map(([t,l])=>`<button data-act="tab" data-tab="${t}" class="${view.tab===t?"on":""}">${l}</button>`).join("")}
    ${ph?`<div class="search"><input id="q" type="search" value="${esc(view.q)}" placeholder="${ph}" aria-label="Search" autocomplete="off"></div>`:""}</div></div>
  <div class="wrap home-list" id="list">${list}</div>`;
}

/* ============================================================
   BUILDER
   ============================================================ */
function builderHTML(){
  const a=cur, m=build(a), side=m.side;
  return `<div class="tools wrap"><div class="tools-in">
    ${typeof SMEX!=="undefined"&&a.sid&&SMEX.rec(a)?`<button class="back" data-act="smedocs">‹ Your documents</button>`:a.mid&&mxGet(a.mid)?`<button class="back" data-act="mxopen" data-id="${a.mid}">‹ ${esc(mxGet(a.mid).name)}</button>`:`<button class="back" data-act="home" data-tab="agreements">‹ Library</button>`}
    <div class="tt"><span class="crumb">${a.mid&&mxGet(a.mid)?"Matter  /  "+esc(mxGet(a.mid).name):esc(PATH[a.id].join("  /  "))}</span><h1>${esc(a.n)}</h1></div>
    <div class="ctrl">
      <div class="seg" role="group" aria-label="Acting for"><span class="seg-l">Acting for</span>${["B","S"].map(s=>`<button data-act="side" data-side="${s}" aria-pressed="${side===s}"><small>${s==="B"?"Buy side":"Sell side"}</small>${esc(a.p[s==="B"?0:1])}</button>`).join("")}</div>
      <label class="tog"><input type="checkbox" id="pe" ${ST.pe?"checked":""}><span class="sw"></span>Plain English notes</label>
      <label class="tog"><input type="checkbox" id="edt" ${ST.ed?"checked":""}><span class="sw"></span>Edit text</label>
      ${typeof SMEX!=="undefined"?SMEX.toolbar(a):""}<button class="btn ghost" data-act="deal">Deal details</button>
      <button class="btn silver" data-act="bexport">Export to Word</button>
      <button class="btn ghost" data-act="copydoc">Copy text</button>
      <button class="btn ghost only-m" data-act="summary">Summary</button>
    </div></div></div>
  <div class="studio wrap"><div class="desk"><article class="paper" id="paper">${docHTML(m)}</article></div>
  <aside class="panel${sel!==null||ST.sheet?" open":""}" id="panel" aria-label="Drafting panel">${panelHTML(m)}</aside></div>`;
}
function panelHTML(m){
  const a=m.a, side=m.side, you=side==="B"?a.p[0]:a.p[1];
  if(sel && !m.all.find(x=>x.k===sel) && !F[sel]) sel=null;
  if(sel && sel[0]==="§") return schPanel(m,m.all.find(x=>x.k===sel));
  if(sel && C[sel]){
    const c=m.all.find(x=>x.k===sel), f=C[sel], rs=ranked(sel,side);
    return `<div class="p-head"><button class="p-back" data-act="unsel">‹ Summary</button><button class="p-x only-m" data-act="closep" aria-label="Close">×</button></div>
    <div class="p-body"><p class="p-k">${c.sch?"Schedule":"Clause"} ${c.n} · Negotiable</p><h2 class="p-t">${esc(f.t)}</h2>
    <p class="p-d">${esc(f.d)}</p>${c.edited?`<div class="law"><span>Edited by you</span>This clause uses your own wording. Choosing an option below replaces it. <button class="lnk" data-act="brevert" data-k="${sel}">Revert to the library wording</button></div>`:""}${f.n?`<div class="law"><span>The law</span>${esc(f.n)}</div>`:""}
    <p class="p-sub">Drafting options, ranked for the ${esc(you)}</p>
    ${rs.map((x,ri)=>optionCard(sel,x,ri+1,a,side,{act:true,current:x.i===c.oi,nums:m.nums,num:c.sch?null:c.n})).join("")}
    ${sel==="sch-war"?`<p class="p-sub">Parts included</p><div class="wparts">${WAR_PARTS.map(p=>`<label class="wp${p.opt?"":" fixed"}"><input type="checkbox" id="wp-${p.id}" data-wp="${p.id}" ${(m.d.wpart||{})[p.id]&&p.opt?"":"checked"} ${p.opt?"":"disabled"}><span>Part ${p.id}: ${esc(p.t)}<small>${esc(p.e)}${p.id==="H"?" Appears only in the full buyer form.":p.opt?"":" Always included."}</small></span></label>`).join("")}</div>`:""}
    <p class="p-sub">Sources and review</p>${qaBoxHTML(sel)}
    ${f.g&&f.g.length?`<p class="p-sub">Guidance</p>${guideLinks(f.g.filter(g=>GUIDE[g]))}`:""}
    <button class="lnk" data-act="clause" data-k="${sel}">Open in the clause library ›</button></div>`;
  }
  if(sel && F[sel]){
    const c=m.cl.find(x=>x.k===sel), f=F[sel];
    return `<div class="p-head"><button class="p-back" data-act="unsel">‹ Summary</button><button class="p-x only-m" data-act="closep" aria-label="Close">×</button></div>
    <div class="p-body"><p class="p-k">Clause ${c.n} · Standard clause</p><h2 class="p-t">${esc(f.t)}</h2>
    <p class="p-d">${esc(f.e)}</p>${c.edited?`<div class="law"><span>Edited by you</span>This clause uses your own wording. <button class="lnk" data-act="brevert" data-k="${sel}">Revert to the library wording</button></div>`:`<div class="law"><span>Drafting</span>This is standard wording without alternative positions. Turn on Edit text to change it for your deal.</div>`}
    <p class="p-sub">Sources and review</p>${qaBoxHTML(sel)}
    ${guideLinks(guidesFor([sel]).length?guidesFor([sel]):["boilerplate"].filter(()=>BOIL.includes(sel)))}</div>`;
  }
  const s=stats(m), kd=K[a.k], parties=[kd.first,kd.first==="B"?"S":"B"];
  return `<div class="p-head"><span class="p-k">Summary</span><button class="p-x only-m" data-act="closep" aria-label="Close">×</button></div>
  <div class="p-body">
    <div class="pos r${s.band}"><div class="pos-n"><b>${s.avg.toFixed(1)}</b><span>/ 5</span></div><div class="pos-t"><span>Overall risk to the ${esc(you)}</span><b>${RISK[s.band]}</b></div></div>
    <div class="dist" aria-hidden="true">${[1,2,3,4,5].map(r=>s.counts[r]?`<i class="r${r}" style="flex:${s.counts[r]}"></i>`:"").join("")}</div>
    <p class="p-sub">Deal details</p>${dealSumHTML(m)}
    <p class="p-sub">Start every clause from</p>
    <div class="presets">${[["strong","Strongest for my client"],["market","Market standard"],["soft","Most accommodating"],["playbook","My playbook"]].map(([p,l])=>`<button data-act="preset" data-p="${p}" class="${m.d.preset===p?"on":""}">${l}</button>`).join("")}</div>
    <p class="p-sub">Negotiable clauses</p>
    <div class="nlist">${s.n.map(c=>`<button class="nrow r${c.r}" data-act="sel" data-k="${c.k}"><span class="nn">${c.sch?"S"+c.n:c.n}</span><span class="nt">${esc(C[c.k].t)}<small>${esc(L(c.o[0],a))}</small></span><span class="nr">${RISK[c.r]}</span></button>`).join("")}</div>
    <p class="p-sub">Schedules</p>
    <div class="nlist">${m.sc.map(c=>`<button class="nrow${c.neg?" r"+c.r:""}" data-act="sel" data-k="${c.k}"><span class="nn">${c.n}</span><span class="nt">${esc(c.t)}<small>${c.neg?esc(L(c.o[0],a)):c.edit?"Editable":c.blocks?"Drafted":"To complete"}</small></span><span class="nr">${c.neg?RISK[c.r]:c.blocks?"":"Open"}</span></button>`).join("")}</div>
    <p class="p-sub">Parties</p>
    ${parties.map(w=>{const pr=m.d.parties[w],lab=a.p[w==="B"?0:1],ind=kd.ind===w;return `<fieldset class="pf"><legend>${esc(lab)} <small>${w==="B"?"buy side":"sell side"}</small></legend>
      <input id="pn-${w}" data-pf="${w}:n" value="${esc(pr.n)}" placeholder="${ind?"Full name":"Company name"}" aria-label="${esc(lab)} name">
      ${ind?"":`<input id="pno-${w}" data-pf="${w}:no" value="${esc(pr.no)}" placeholder="Company number" aria-label="${esc(lab)} company number">`}
      <input id="pad-${w}" data-pf="${w}:ad" value="${esc(pr.ad)}" placeholder="${ind?"Address":"Registered office"}" aria-label="${esc(lab)} address"></fieldset>`}).join("")}
    ${noteOf(a)?`<div class="law"><span>Drafting note</span>${esc(noteOf(a))}</div>`:""}
    <p class="p-sub">Guidance for this agreement</p>${guideLinks(guidesFor(m.order).slice(0,6))}
    <p class="disc">A drafting aid reflecting English law market practice. It is not legal advice, and the positions should be weighed against the deal, the parties' bargaining strength and the full documentation.</p>
  </div>`;
}

let DEALKEYS=[];
function dealHTML(){
  const m=build(cur), a=m.a, kd=K[a.k], f=m.d.fill||{}, pg=dealProgress(m), only=!!ST.dealOnly, parties=[kd.first,kd.first==="B"?"S":"B"];
  DEALKEYS=pg.b.map(x=>x.k);
  const groups=[]; pg.b.forEach((x,i)=>{if(only&&f[x.k])return;let g=groups.find(g=>g.u===x.u);if(!g)groups.push(g={u:x.u,rows:[]});g.rows.push([x,i])});
  const snip=x=>{const pre=x.pre.replace(/^\S*\s/,"").replace(/^[^A-Za-z(£“]+/,""),post=x.post.replace(/\s\S*$/,"");return `<span class="dq-c">${x.lab?`<b>${esc(x.lab)}</b> `:""}${x.pre.length>=110?"… ":""}${hl(pre)}<mark>${esc(x.ph)}</mark>${hl(post)}${x.post.length>=60?" …":""}</span>`};
  const pr=pg.total?Math.round(pg.done/pg.total*100):0;
  return `<div class="dlg set deal" role="dialog" aria-modal="true" aria-labelledby="dq-h"><p class="kicker">${esc(a.n)}</p><h2 id="dq-h">Deal details</h2>
  <p class="dlg-d">Fill in each blank once. A blank that appears in the same wording elsewhere in the agreement is filled everywhere, and the answers carry into the Word export. Leave a box empty to keep the [●].</p>
  <div class="dq-top"><div class="dq-pg"><span><b id="dq-done">${pg.done}</b> of ${pg.total} filled</span><div class="dq-bar"><i id="dq-bar" style="width:${pr}%"></i></div></div>
  <label class="tog"><input type="checkbox" id="dq-only" ${only?"checked":""}><span class="sw"></span>Unfilled only</label></div>
  <div class="dq-body">
  <h3 class="dq-g">Date and parties</h3>
  <div class="dq-r"><span class="dq-c">THIS ${esc((kd.doc||"Agreement").toUpperCase())} is dated <mark>[●]</mark></span><input data-fd="@date" value="${esc(f["@date"]||"")}" placeholder="Usually left blank until signing" aria-label="Date of the agreement"></div>
  <div class="dq-pp">${parties.map(w=>{const p=m.d.parties[w],lab=a.p[w==="B"?0:1],ind=kd.ind===w;return `<fieldset class="pf"><legend>${esc(lab)}</legend>
    <input data-pf="${w}:n" value="${esc(p.n)}" placeholder="${ind?"Full name":"Company name"}" aria-label="${esc(lab)} name">
    ${ind?"":`<input data-pf="${w}:no" value="${esc(p.no)}" placeholder="Company number" aria-label="${esc(lab)} company number">`}
    <input data-pf="${w}:ad" value="${esc(p.ad)}" placeholder="${ind?"Address":"Registered office"}" aria-label="${esc(lab)} address"></fieldset>`}).join("")}</div>
  ${groups.map(g=>`<h3 class="dq-g">${esc(g.u||"Other")}</h3>${g.rows.map(([x,i])=>{const h=phHint(x.ph);return `<div class="dq-r">${snip(x)}<div class="dq-in"><input data-fi="${i}" value="${esc(f[x.k]||"")}" placeholder="${h?esc(h):"Enter"}" aria-label="Value for blank">${h&&!f[x.k]?`<button class="lnk" data-act="dquse" data-i="${i}" data-v="${esc(h)}">Use “${esc(h.length>28?h.slice(0,28)+"…":h)}”</button>`:""}${x.n>1?`<small>Appears ${x.n} times</small>`:""}</div></div>`}).join("")}`).join("")}
  ${!groups.length&&only?`<p class="dlg-d">Every blank is filled.</p>`:""}
  </div>
  <div class="dlg-f"><button class="btn ghost" data-act="dqclear">Clear all</button><button class="btn silver" data-act="closemodal">Done</button></div></div>`;
}
function dealSet(k,v){const d=docState(cur.sid||cur.id);d.fill=d.fill||{};if(v&&v.trim())d.fill[k]=v;else delete d.fill[k];save();
  const m=build(cur),pg=dealProgress(m),p=document.getElementById("paper");if(p)p.innerHTML=docHTML(m);
  const dn=document.getElementById("dq-done"),br=document.getElementById("dq-bar");if(dn){dn.textContent=pg.done;br.style.width=Math.round(pg.done/pg.total*100)+"%"}
  const sm=document.getElementById("deal-sum");if(sm)sm.outerHTML=dealSumHTML(m,pg)}
function dealSumHTML(m,pg){pg=pg||dealProgress(m);const left=pg.total-pg.done;return `<div class="deal-sum" id="deal-sum"><div class="dq-pg"><span><b>${pg.done}</b> of ${pg.total} blanks filled</span><div class="dq-bar"><i style="width:${Math.round(pg.done/pg.total*100)}%"></i></div></div><button class="btn ${left?"silver":"ghost"} sm" data-act="deal">${pg.done?"Edit deal details":"Fill in deal details"}</button></div>`}

function schPanel(m,c){
  const head=`<div class="p-head"><button class="p-back" data-act="unsel">‹ Summary</button><button class="p-x only-m" data-act="closep" aria-label="Close">×</button></div>`;
  let h=`<div class="p-body"><p class="p-k">Schedule ${c.n} · ${c.edit?"Editable":c.blocks?"Drafted":"To complete"}</p><h2 class="p-t">${esc(c.t)}</h2><p class="p-d">${esc(c.e)}</p>`;
  if(c.key==="tsvc"){
    const svcs=tsaSvcState({a:m.a,d:m.d,picks:m.picks}), ti=m.picks["tsa-term"], cap=TSA_CAP[ti], on=svcs.filter(s=>s.on).length;
    h+=`<div class="law"><span>Service periods</span>Clause ${m.nums["tsa-term"]} allows up to ${cap} months for each service, defaulting to ${TSA_DEF[ti]}. Choose a different Service Period option to change the limit.</div>`;
    h+=`<p class="svc-count"><b>${on}</b> of ${svcs.length} services selected</p>`;
    [...new Set(svcs.map(s=>s.tw))].forEach(tw=>{
      h+=`<p class="p-sub">${esc(tw)}</p>`+svcs.filter(s=>s.tw===tw).map(s=>`<div class="svr${s.on?"":" off"}"><label><input type="checkbox" id="sv-${s.id}" data-sv="${s.id}" ${s.on?"checked":""}><span><b>${s.id}</b>${esc(s.n)}</span></label><select id="svm-${s.id}" data-svm="${s.id}" aria-label="Service period for ${esc(s.n)}" ${s.on?"":"disabled"}>${[3,6,9,12,18,24].filter(x=>x<=cap).map(x=>`<option value="${x}" ${x===s.mo?"selected":""}>${x} months</option>`).join("")}</select></div>`).join("");
    });
    h+=`<div class="law"><span>Watch for</span>Group insurance, banking and cash pooling usually stop at completion and cannot be provided under a TSA, so they are listed as excluded. Software licences often need the vendor's consent before the provider can extend them to the business.</div>`;
  } else if(c.key==="mig"){
    h+=`<div class="law"><span>How it works</span>A milestone is added for every service selected in ${esc("Schedule "+m.nums["§tsvc"])}, with a target date at the end of that service's period.</div>`;
  } else if(!c.blocks){
    h+=`<div class="law"><span>Deal-specific</span>This schedule holds the commercial detail of your deal, so it is left as a titled placeholder. Copy the agreement and complete it once the terms are agreed.</div>`;
  }
  return head+h+`</div>`;
}

/* ============================================================
   CLAUSE LIBRARY PAGE
   ============================================================ */
function clauseHTML(){
  const k=clauseCtx.k, f=C[k], used=USED[k]||[];
  if(!clauseCtx.ag||!used.includes(clauseCtx.ag)) clauseCtx.ag=used[0];
  const a=AG[clauseCtx.ag], side=clauseCtx.side, you=side==="B"?a.p[0]:a.p[1];
  const m=build(a), num=m.nums[k];
  const rs=ranked(k,side);
  return `<div class="page wrap"><div class="page-in">
    <button class="back" data-act="home" data-tab="clauses">‹ Clause library</button>
    <p class="kicker">Negotiable clause</p><h1 class="pg-t">${esc(famTitle(k))}</h1><p class="pg-d">${esc(f.d)}</p>
    ${f.n?`<div class="law big"><span>The law</span>${esc(f.n)}</div>`:""}
    ${f.pre?`<div class="pre"><p class="p-sub">Included in every option</p><div class="wording">${f.pre.map(p=>subHTML(p,{a,nums:m.nums,num},"")).join("")}</div></div>`:""}
    <div class="cctl"><label class="selwrap"><span>Shown as it reads in</span><select id="cag">${used.map(id=>`<option value="${id}" ${id===a.id?"selected":""}>${esc(AG[id].n)}</option>`).join("")}</select></label>
      <div class="seg" role="group" aria-label="Acting for"><span class="seg-l">Acting for</span>${["B","S"].map(s=>`<button data-act="cside" data-side="${s}" aria-pressed="${side===s}"><small>${s==="B"?"Buy side":"Sell side"}</small>${esc(a.p[s==="B"?0:1])}</button>`).join("")}</div></div>
    <p class="p-sub">Drafting options, ranked for the ${esc(you)}</p>
    <div class="olist">${rs.map((x,ri)=>optionCard(k,x,ri+1,a,side,{open:true,copy:true,nums:m.nums,num})).join("")}</div>
    <p class="p-sub">Sources and review</p>${qaBoxHTML(k)}
    ${f.g&&f.g.length?`<p class="p-sub">Guidance</p>${guideLinks(f.g.filter(g=>GUIDE[g]))}`:""}
    <p class="p-sub">Used in</p><div class="used">${used.map(id=>`<button class="chip" data-act="open" data-id="${id}" data-focus="${k}">${esc(AG[id].n)}</button>`).join("")}</div>
  </div></div>`;
}

/* ============================================================
   GUIDE PAGE
   ============================================================ */
function guideHTML(){
  const g=GUIDE[view.g];
  const body=g.b.map(x=>typeof x==="string"?`<p>${esc(x)}</p>`:x.h?`<h3>${esc(x.h)}</h3>`:`<div class="kp"><span>Key point</span>${esc(x.k)}</div>`).join("");
  const rel=g.c.filter(k=>C[k]);
  const more=GUIDES.filter(x=>x.cat===g.cat&&x.id!==g.id).slice(0,4);
  return `<div class="page wrap"><div class="page-in guide">
    <button class="back" data-act="home" data-tab="guidance">‹ Guidance</button>
    <p class="kicker">${esc(g.cat)}</p><h1 class="pg-t">${esc(g.t)}</h1><p class="pg-d">${esc(g.s)}</p>
    <article class="sheet">${body}</article>
    ${rel.length?`<p class="p-sub">Clauses this guide covers</p><div class="used">${rel.map(k=>`<button class="chip" data-act="clause" data-k="${k}">${esc(famTitle(k))}</button>`).join("")}</div>`:""}
    ${more.length?`<p class="p-sub">More in ${esc(g.cat)}</p>${guideLinks(more.map(x=>x.id))}`:""}
    <p class="p-sub">Sources and review</p>${qaBoxHTML(g.id)}
    <p class="disc">General information on English law, not legal advice on any particular matter.</p>
  </div></div>`;
}

/* ============================================================
   PICKER
   ============================================================ */
let pick={side:null,preset:"strong"};
function pickerHTML(){
  const a=cur;
  return `<div class="dlg" role="dialog" aria-modal="true" aria-labelledby="pk-h">
    <p class="kicker">${esc(a.n)}</p><h2 id="pk-h">Who are you acting for?</h2>
    <p class="dlg-d">Every negotiable clause will be ranked by the risk it carries for your client.</p>
    <div class="pk-sides">${["B","S"].map(s=>`<button data-act="pkside" data-side="${s}" class="${pick.side===s?"on":""}"><small>${s==="B"?"Buy side":"Sell side"}</small><b>${esc(a.p[s==="B"?0:1])}</b><span>${s==="B"?"Receives the shares, goods, services, rights or funding.":"Provides them."}</span></button>`).join("")}</div>
    <p class="p-sub">Start the first draft from</p>
    <div class="presets">${[["strong","Strongest for my client","An opening draft"],["market","Market standard","A balanced draft"],["soft","Most accommodating","Concede where possible"],["playbook","My playbook","Your preferred positions"]].map(([p,l,d])=>`<button data-act="pkpreset" data-p="${p}" class="${pick.preset===p?"on":""}">${l}<small>${d}</small></button>`).join("")}</div>
    <div class="dlg-f"><button class="btn ghost" data-act="pkcancel">Back to library</button><button class="btn silver" data-act="pkgo" ${pick.side?"":"disabled"}>Build the draft</button></div>
  </div>`;
}

/* ============================================================
   RENDER & EVENTS
   ============================================================ */
const app=document.getElementById("app"), modal=document.getElementById("modal");
function render(keepScroll){
  const y=window.scrollY;
  let h=header();
  if(view.v==="home") h+=homeHTML();
  else if(view.v==="doc") h+=builderHTML();
  else if(view.v==="clause") h+=clauseHTML();
  else if(view.v==="guide") h+=guideHTML();
  else if(view.v==="review") h+=reviewHTML();
  else if(view.v==="matters") h+=mattersHTML();
  else if(view.v==="matter") h+=matterHTML();
  else if(typeof SMEX!=="undefined"&&SMEX.views[view.v]) h+=SMEX.views[view.v]();
  app.innerHTML=h;
  document.body.dataset.view=view.v;
  if(keepScroll) window.scrollTo(0,y); else window.scrollTo(0,0);
}
function rerenderDoc(){
  const m=build(cur);
  const paper=document.getElementById("paper"), panel=document.getElementById("panel");
  if(!paper){render(true);return}
  paper.innerHTML=docHTML(m);
  const ps=panel.scrollTop; panel.innerHTML=panelHTML(m); panel.scrollTop=ps;
  panel.classList.toggle("open",sel!==null||!!ST.sheet);
}
function refreshPanel(resetScroll){
  const m=build(cur), panel=document.getElementById("panel");
  panel.innerHTML=panelHTML(m); if(resetScroll) panel.scrollTop=0;
  panel.classList.toggle("open",sel!==null||!!ST.sheet);
  document.querySelectorAll(".cl").forEach(el=>el.classList.toggle("on",el.dataset.k===sel));
}
function openAg(id,focus,sid,mid){
  if(!AG[id]) return;
  cur=sid?Object.assign({},AG[id],{sid,mid}):AG[id]; sel=focus&&C[focus]?focus:null; ST.sheet=false; view={v:"doc",tab:view.tab,q:view.q};
  const d=docState(cur.sid||id);
  render();
  if(!d.side){pick={side:prof().side||null,preset:"strong"};modal.innerHTML=pickerHTML();modal.hidden=false;const b=modal.querySelector("button");b&&b.focus()}
  else if(sel) setTimeout(()=>{const el=document.getElementById("cl-"+sel);el&&el.scrollIntoView({block:"center"})},30);
}
function setSide(s){
  const d=docState(cur.sid||cur.id); d.side=s; save(); rerenderDoc();
  document.querySelectorAll('[data-act="side"]').forEach(b=>b.setAttribute("aria-pressed",b.dataset.side===s));
}
function applyPreset(p){
  const d=docState(cur.sid||cur.id); d.preset=p; d.picks[d.side||"B"]={}; save(); rerenderDoc();
}
function rerenderQA(){if(view.v==="doc")rerenderDoc();else if(view.v==="review")refreshRv();else if(view.v==="home"){const l=document.getElementById("list");if(l)l.innerHTML=listHTML()}else render(true)}
function flash(k){const el=document.getElementById("cl-"+k);if(el){el.classList.remove("flash");void el.offsetWidth;el.classList.add("flash")}}

document.addEventListener("click",e=>{
  const t=e.target.closest("[data-act]");
  if(t&&typeof SMEX!=="undefined"&&SMEX.click(t,e)) return;
  if(t&&rvClick(t,e)) return;
  if(t&&mxClick(t)) return;
  if(t&&bkClick(t)) return;
  const rc=!t&&view.v==="review"&&e.target.closest(".rvc");
  if(rc){if(e.target.closest("[data-rek]"))return;RV.sel=rc.dataset.rk;refreshRvPanel();document.querySelectorAll(".rvc").forEach(el=>el.classList.toggle("on",el.dataset.rk===RV.sel));return}
  const cl=!t&&e.target.closest(".cl");
  if(cl&&view.v==="doc"){sel=cl.dataset.k; refreshPanel(true); return}
  if(!t) {if(e.target===modal&&view.v!=="doc"){modal.hidden=true}return}
  const act=t.dataset.act;
  switch(act){
    case "home": if(t.dataset.tab==="review"){view={v:"review",tab:view.tab,q:""};RVSHOWLANDING=false;cur=null;sel=null;modal.hidden=true;render();break}
      view={v:"home",tab:t.dataset.tab||"agreements",q:""}; cur=null; sel=null; modal.hidden=true; render(); if(t.dataset.scroll){const l=document.querySelector(".tabs");l&&l.scrollIntoView({block:"start"})} break;
    case "tab": view.tab=t.dataset.tab; view.q=""; render(true); break;
    case "open": openAg(t.dataset.id,t.dataset.focus); break;
    case "clause": clauseCtx={k:t.dataset.k,ag:cur&&USED[t.dataset.k]&&USED[t.dataset.k].includes(cur.id)?cur.id:null,side:cur?(docState(cur.sid||cur.id).side||"B"):clauseCtx.side||"B"}; view={v:"clause",tab:"clauses",q:""}; render(); break;
    case "guide": view={v:"guide",tab:"guidance",q:"",g:t.dataset.g}; render(); break;
    case "side": setSide(t.dataset.side); break;
    case "cside": clauseCtx.side=t.dataset.side; render(true); break;
    case "preset": applyPreset(t.dataset.p); break;
    case "sel": sel=t.dataset.k; refreshPanel(true); {const el=document.getElementById("cl-"+sel); el&&el.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"})} break;
    case "unsel": sel=null; refreshPanel(true); break;
    case "summary": ST.sheet=true; sel=null; refreshPanel(true); break;
    case "closep": ST.sheet=false; sel=null; refreshPanel(true); break;
    case "use": {const d=docState(cur.sid||cur.id); d.picks[d.side||"B"][t.dataset.k]=+t.dataset.i; const had=d.edits&&d.edits[t.dataset.k]; if(had) delete d.edits[t.dataset.k]; save(); rerenderDoc(); flash(t.dataset.k); toast(had?"Library wording replaced your edits":"Clause updated in the draft"); break}
    case "brevert": {const d=docState(cur.sid||cur.id); if(d.edits) delete d.edits[t.dataset.k]; save(); rerenderDoc(); flash(t.dataset.k); toast("Reverted to the library wording"); break}
    case "bexport": modal.innerHTML=`<div class="dlg" role="dialog" aria-modal="true" aria-labelledby="bx-h"><p class="kicker">${esc(cur.n)}</p><h2 id="bx-h">Export to Word</h2><p class="dlg-d">A .docx file with your current drafting, including any edits, the schedules and the signature blocks.</p><label class="wp"><input type="checkbox" id="bx-notes"><span>Add explanatory comments<small>Each negotiable clause gets a Word comment with its risk rating and the reason for it. These are for you: delete them before sending the draft.</small></span></label><div class="dlg-f"><button class="btn ghost" data-act="closemodal">Cancel</button><button class="btn silver" data-act="bexportgo">Download Word file</button></div></div>`; modal.hidden=false; break;
    case "deal": modal.innerHTML=dealHTML(); modal.hidden=false; {const i=modal.querySelector("[data-fi],[data-fd]");i&&i.focus()} break;
    case "dquse": {const i=+t.dataset.i; dealSet(DEALKEYS[i],t.dataset.v); const inp=modal.querySelector(`[data-fi="${i}"]`); if(inp)inp.value=t.dataset.v; t.remove(); break}
    case "dqclear": {const d=docState(cur.sid||cur.id); d.fill={}; save(); modal.innerHTML=dealHTML(); rerenderDoc(); break}
    case "bexportgo": {const notes=document.getElementById("bx-notes").checked; modal.hidden=true; const r=builderBlocks(build(cur),notes); buildDocx(r.B,{comments:r.comments,title:cur.n,author:prof().name||"Counterpart"}).then(b=>saveFile(safeName(cur.n)+".docx",b)).catch(()=>toast("The Word file could not be created.")); break}
    case "copydoc": copy(docText(build(cur)),"Agreement copied as text"); break;
    case "copyopt": {const a=AG[clauseCtx.ag], m=build(a), k=t.dataset.k, o=C[k].o[+t.dataset.i], cx={a,nums:m.nums,num:m.nums[k]}; copy((C[k].pre||[]).concat(o[2]).map(p=>plainPara(p,cx,"")).join("\n\n"),"Wording copied"); break}
    case "pkside": pick.side=t.dataset.side; modal.innerHTML=pickerHTML(); break;
    case "pkpreset": pick.preset=t.dataset.p; modal.innerHTML=pickerHTML(); break;
    case "pkcancel": modal.hidden=true; view={v:"home",tab:"agreements",q:""}; cur=null; render(); break;
    case "pkgo": {const d=docState(cur.sid||cur.id); d.side=pick.side; d.preset=pick.preset; d.picks={B:{},S:{}}; save(); modal.hidden=true; if(typeof SMEX!=="undefined"&&SMEX.started(cur))break; render(); break}
    case "closemodal": modal.hidden=true; break;
    case "qamark": {ST.qa=ST.qa||{};const old=ST.qa[t.dataset.k]||{};ST.qa[t.dataset.k]={date:new Date().toISOString().slice(0,10),by:prof().name||"You",note:old.note||"",flag:""};save();rerenderQA();toast(prof().name?"Marked as reviewed":"Marked as reviewed. Add your name in Settings to sign it off.");break}
    case "qaflag": modal.innerHTML=qaFlagDialog(t.dataset.k); modal.hidden=false; break;
    case "qaflagsave": {ST.qa=ST.qa||{};const k=t.dataset.k,r=ST.qa[k]||{};r.flag=(document.getElementById("qf-flag").value||"").trim();r.note=(document.getElementById("qf-note").value||"").trim();ST.qa[k]=r;save();modal.hidden=true;rerenderQA();toast("Saved");break}
    case "qafilter": view.qf=t.dataset.v; document.getElementById("list").innerHTML=listHTML(); break;
    case "qaexport": qaExport(); break;
    case "qaopen": {const k=t.dataset.k;modal.innerHTML=`<div class="dlg wide"><p class="kicker">Standard clause</p><h2>${esc(F[k].t)}</h2><p class="dlg-d">${esc(F[k].e)}</p><div class="wording">${F[k].p.map(p=>`<p>${esc(flatAll(p).replace(/\{[A-Z:a-z*-]+\}/g,"[party]"))}</p>`).join("")}</div>${qaBoxHTML(k)}<div class="dlg-f"><button class="btn silver" data-act="closemodal">Done</button></div></div>`;modal.hidden=false;break}
    case "pbside": ST.pbSide=t.dataset.side; save(); document.getElementById("list").innerHTML=listHTML(); break;
    case "pbfill": {const side=ST.pbSide||"B",pb=pbAll();pb[side]=pb[side]||{};let n=0;Object.keys(C).forEach(k=>{if(!pbOf(k,side)){pb[side][k]=pbDefaultsFor(k,side);n++}});save();document.getElementById("list").innerHTML=listHTML();toast(n?`Suggested positions added for ${n} clauses. Adjust any you disagree with.`:"Every clause already has positions");break}
    case "pbclear": if(t.dataset.confirm!=="1"){t.dataset.confirm="1";t.textContent="Click again to clear this side";break} pbAll()[ST.pbSide||"B"]={}; save(); document.getElementById("list").innerHTML=listHTML(); toast("Playbook cleared for this side"); break;
    case "pbexport": pbExport(); break;
    case "settings": modal.innerHTML=settingsHTML(); modal.hidden=false; {const f=document.getElementById("st-name"); f&&f.focus()} break;
    case "stmode": ST.mode=t.dataset.v; save(); applyMode(); modal.querySelectorAll('[data-act="stmode"]').forEach(b=>b.setAttribute("aria-pressed",b.dataset.v===ST.mode)); break;
    case "stsave": {const g=id=>(document.getElementById(id).value||"").trim(); ST.profile={name:g("st-name"),role:g("st-role"),org:g("st-org"),side:document.getElementById("st-side").value,use:g("st-use")}; save(); modal.hidden=true; if(typeof RV!=="undefined"&&RV&&!RV.author&&ST.profile.name){RV.author=ST.profile.name;saveRV()} render(true); toast("Settings saved"); break}
  }
});
document.addEventListener("keydown",e=>{
  if(e.key==="Enter"&&e.target.classList&&e.target.classList.contains("rvc")&&view.v==="review"){RV.sel=e.target.dataset.rk;refreshRvPanel();return}
  if(e.key==="Enter"&&e.target.classList&&e.target.classList.contains("cl")&&view.v==="doc"){sel=e.target.dataset.k;refreshPanel(true)}
  if(e.key==="Escape"&&!modal.hidden&&!modal.querySelector('[data-act="pkgo"]')) modal.hidden=true;
});
document.addEventListener("input",e=>{
  if(typeof SMEX!=="undefined"&&SMEX.input(e)) return;
  if(rvInput(e)) return;
  if(mxInput(e)) return;
  if(e.target.id==="q"){view.q=e.target.value; document.getElementById("list").innerHTML=listHTML()}
  if(e.target.dataset&&e.target.dataset.pbn){const k=e.target.dataset.pbn,side=ST.pbSide||"B",pb=pbAll();pb[side]=pb[side]||{};(pb[side][k]=pb[side][k]||{}).n=e.target.value;save();return}
  if(e.target.dataset&&e.target.dataset.pf){const [w,f]=e.target.dataset.pf.split(":"); docState(cur.sid||cur.id).parties[w][f]=e.target.value; save(); document.getElementById("paper").innerHTML=docHTML(build(cur)); if(!modal.hidden){const o=document.querySelector(`#panel [data-pf="${w}:${f}"]`);if(o&&o!==e.target)o.value=e.target.value}}
  if(e.target.dataset&&e.target.dataset.fi!=null){dealSet(DEALKEYS[+e.target.dataset.fi],e.target.value);return}
  if(e.target.dataset&&e.target.dataset.fd){dealSet(e.target.dataset.fd,e.target.value);return}
});
document.addEventListener("change",e=>{
  if(typeof SMEX!=="undefined"&&SMEX.change(e)) return;
  if(rvChange(e)) return;
  if(mxChange(e)) return;
  if(bkChange(e)) return;
  if(e.target.id==="edt"){ST.ed=e.target.checked; save(); document.getElementById("paper").innerHTML=docHTML(build(cur)); if(ST.ed) toast("Click into any clause to edit it. Changes save when you click away."); return}
  if(e.target.id==="pe"){ST.pe=e.target.checked; save(); document.getElementById("paper").innerHTML=docHTML(build(cur))}
  if(e.target.id==="dq-only"){ST.dealOnly=e.target.checked; save(); const b=modal.querySelector(".dq-body"),y=b?b.scrollTop:0; modal.innerHTML=dealHTML(); const nb=modal.querySelector(".dq-body"); if(nb)nb.scrollTop=y; return}
  if(e.target.id==="cag"){clauseCtx.ag=e.target.value; render(true)}
  if(e.target.dataset&&e.target.dataset.pb){const [k,f]=e.target.dataset.pb.split(":"),side=ST.pbSide||"B",pb=pbAll();pb[side]=pb[side]||{};const r=pb[side][k]||(pb[side][k]={});r[f]=e.target.value===""?null:+e.target.value;save();const y=window.scrollY;document.getElementById("list").innerHTML=listHTML();window.scrollTo(0,y);return}
  const ds=e.target.dataset||{};
  if(ds.sv||ds.svm){const d=docState(cur.sid||cur.id); d.tsvc=d.tsvc||{}; const id=ds.sv||ds.svm, x=d.tsvc[id]||(d.tsvc[id]={}); if(ds.sv) x.on=e.target.checked; else x.m=+e.target.value; save(); rerenderDoc()}
  if(ds.wp){const d=docState(cur.sid||cur.id); d.wpart=d.wpart||{}; d.wpart[ds.wp]=!e.target.checked; save(); rerenderDoc()}
});

document.addEventListener("focusout",e=>{if(e.target.dataset&&e.target.dataset.bek&&cur){commitBuilderEdit(e.target);const m=build(cur),p=document.getElementById("panel");if(p){p.innerHTML=panelHTML(m)}const sec=e.target.closest(".cl");if(sec){const c=m.cl.find(x=>x.k===e.target.dataset.bek);const h=sec.querySelector("h3");if(h&&c){const has=!!h.querySelector(".mk.chg");if(c.edited&&!has)h.insertAdjacentHTML("beforeend",'<span class="mk chg">Edited</span>');if(!c.edited&&has)h.querySelector(".mk.chg").remove()}}}});

/* copy with fallback */
function copy(text,msg){
  const fallback=()=>{modal.innerHTML=`<div class="dlg"><h2>Copy the text</h2><p class="dlg-d">Your browser blocked automatic copying. The text is selected below.</p><textarea class="fb" readonly>${esc(text)}</textarea><div class="dlg-f"><button class="btn silver" data-act="closemodal">Done</button></div></div>`;modal.hidden=false;const ta=modal.querySelector("textarea");ta.focus();ta.select()};
  try{navigator.clipboard.writeText(text).then(()=>toast(msg),fallback)}catch(e){fallback()}
}
let tt; function toast(m){const t=document.getElementById("toast");t.textContent=m;t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,2000)}

/* boot */
(function(){
  if(typeof SMEX!=="undefined")SMEX.boot();
  applyMode();
  const h=(location.hash||"").slice(1);
  if(AG[h]) return openAg(h);
  if(h.indexOf("clause.")===0&&C[h.slice(7)]){clauseCtx={k:h.slice(7),ag:null,side:"B"};view={v:"clause",tab:"clauses",q:""};return render()}
  if(h.indexOf("guide.")===0&&GUIDE[h.slice(6)]){view={v:"guide",tab:"guidance",q:"",g:h.slice(6)};return render()}
  if(h==="review"){view={v:"review",tab:"agreements",q:""};return render()}
  if(h==="matters"){view={v:"matters",tab:"agreements",q:""};return render()}
  if(["agreements","clauses","guidance","playbook","quality"].includes(h)) view.tab=h;
  render();
})();
