/* ============================================================
   CONTENT QUALITY, PLAYBOOK, VERSION COMPARISON, HEALTH CHECK
   ============================================================ */

/* ---------- authorities: statutes link to legislation.gov.uk, cases to BAILII ---------- */
const LEGX=p=>"https://www.legislation.gov.uk/"+p;
const BAILII=p=>"https://www.bailii.org/"+p+".html";
const AUTH=[
 ["Unfair Contract Terms Act 1977","ukpga/1977/50"],["Sale of Goods Act 1979","ukpga/1979/54"],["Supply of Goods and Services Act 1982","ukpga/1982/29"],
 ["Late Payment of Commercial Debts (Interest) Act 1998","ukpga/1998/20"],["Contracts (Rights of Third Parties) Act 1999","ukpga/1999/31"],["Misrepresentation Act 1967","ukpga/1967/7"],
 ["Corporate Insolvency and Governance Act 2020","ukpga/2020/12"],["Insolvency Act 1986","ukpga/1986/45"],["Copyright, Designs and Patents Act 1988","ukpga/1988/48"],["Patents Act 1977","ukpga/1977/37"],["Trade Marks Act 1994","ukpga/1994/26"],["Statute of Frauds 1677",null],["Law of Property Act 1925","ukpga/Geo5/15-16/20"],["Income Tax Act 2007","ukpga/2007/3"],["Housing Grants, Construction and Regeneration Act 1996","ukpga/1996/53"],["Income Tax (Earnings and Pensions) Act 2003","ukpga/2003/1"],["Health and Safety at Work etc. Act 1974","ukpga/1974/37"],["Digital Markets, Competition and Consumers Act 2024",null],["Law of Property (Miscellaneous Provisions) Act 1994","ukpga/1994/36"],
 ["Data Protection Act 2018","ukpga/2018/12"],["UK GDPR","eur/2016/679"],["Data (Use and Access) Act 2025",null],["Privacy and Electronic Communications (EC Directive) Regulations 2003","uksi/2003/2426"],
 ["Vertical Agreements Block Exemption",null,"Competition Act 1998 (Vertical Agreements Block Exemption) Order 2022"],["Competition Act 1998","ukpga/1998/41"],["Enterprise Act 2002","ukpga/2002/40"],
 ["National Security and Investment Act 2021","ukpga/2021/25"],["Companies Act 2006","ukpga/2006/46"],["Bribery Act 2010","ukpga/2010/23"],["Criminal Finances Act 2017","ukpga/2017/22"],
 ["Economic Crime and Corporate Transparency Act 2023","ukpga/2023/56"],["Sanctions and Anti-Money Laundering Act 2018","ukpga/2018/13"],["Modern Slavery Act 2015","ukpga/2015/30"],
 ["Employment Rights Act 1996","ukpga/1996/18"],["Equality Act 2010","ukpga/2010/15"],["National Minimum Wage Act 1998","ukpga/1998/39"],["Working Time Regulations 1998","uksi/1998/1833"],
 ["Immigration, Asylum and Nationality Act 2006","ukpga/2006/13"],["Transfer of Undertakings (Protection of Employment) Regulations 2006","uksi/2006/246",null,/TUPE/],
 ["Pensions Act 1995","ukpga/1995/26"],["Pensions Act 2004","ukpga/2004/35"],["Pensions Act 2008","ukpga/2008/30"],["Income Tax (Earnings and Pensions) Act 2003","ukpga/2003/1"],
 ["Taxation of Chargeable Gains Act 1992","ukpga/1992/12"],["Corporation Tax Act 2009","ukpga/2009/4"],["Corporation Tax Act 2010","ukpga/2010/4"],["Taxation (International and Other Provisions) Act 2010","ukpga/2010/8"],
 ["Finance Act 2004","ukpga/2004/12"],["Value Added Tax Act 1994","ukpga/1994/23"],["Environmental Protection Act 1990","ukpga/1990/43"],["Town and Country Planning (Use Classes) Order 1987","uksi/1987/764"],
 ["Town and Country Planning Act 1990","ukpga/1990/8"],["Landlord and Tenant Act 1927","ukpga/Geo5/17-18/36"],["Landlord and Tenant Act 1954","ukpga/Eliz2/2-3/56"],["Landlord and Tenant Act 1988","ukpga/1988/26"],
 ["Land Registration Rules 2003","uksi/2003/1417"],["Limitation Act 1980","ukpga/1980/58"],["Commercial Agents (Council Directive) Regulations 1993","uksi/1993/3053"],["Arbitration Act 2025",null]
].map(([t,p,title,re])=>({t:title||t,kind:"Legislation",url:p?LEGX(p):"https://www.legislation.gov.uk/all?title="+encodeURIComponent((title||t).replace(/ \d{4}$/,"")),re:re||new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"))}));
const CASES=[
 ["Walford v Miles [1992] UKHL 12","uk/cases/UKHL/1992/12",/Walford v Miles/],["Interfoto Picture Library v Stiletto Visual Programmes [1987] EWCA Civ 6","ew/cases/EWCA/Civ/1987/6",/Interfoto/],
 ["Bank of Credit and Commerce International SA v Ali [2001] UKHL 8","uk/cases/UKHL/2001/8",/Ali \[2001\]/],
 ["Cavendish Square Holding v Makdessi [2015] UKSC 67","uk/cases/UKSC/2015/67",/Makdessi/],["RTI v MUR Shipping [2024] UKSC 18","uk/cases/UKSC/2024/18",/MUR Shipping/],
 ["Marks and Spencer v BNP Paribas [2015] UKSC 72","uk/cases/UKSC/2015/72",/BNP Paribas/],["Rock Advertising v MWB Business Exchange Centres [2018] UKSC 24","uk/cases/UKSC/2018/24",/Rock Advertising/],
 ["Tillman v Egon Zehnder [2019] UKSC 32","uk/cases/UKSC/2019/32",/Egon Zehnder/],["Churchill v Merthyr Tydfil County Borough Council [2023] EWCA Civ 1416","ew/cases/EWCA/Civ/2023/1416",/Merthyr Tydfil/],
 ["Infiniteland v Artisan [2005] EWCA Civ 758","ew/cases/EWCA/Civ/2005/758",/Infiniteland/],["Canary Wharf v European Medicines Agency [2019] EWHC 335 (Ch)","ew/cases/EWHC/Ch/2019/335",/European Medicines Agency/],
 ["Rhodia International Holdings v Huntsman International [2007] EWHC 292 (Comm)","ew/cases/EWHC/Comm/2007/292",/Rhodia/],["HIH Casualty v Chase Manhattan [2003] UKHL 6","uk/cases/UKHL/2003/6",/HIH Casualty/],
 ["Eurocopy v Teesdale [1992] BCLC 1067",null,/Eurocopy/],["Hadley v Baxendale (1854) 9 Exch 341",null,/Hadley v Baxendale/]
].map(([t,p,re])=>({t,kind:"Case",url:p?BAILII(p):null,re}));
const flatAll=x=>typeof x==="string"?x:Array.isArray(x)?x.map(flatAll).join(" "):x&&typeof x==="object"?Object.values(x).map(flatAll).join(" "):"";
function textOf(k){
  if(C[k]){const f=C[k];return [f.n||"",f.d||"",flatAll(f.pre||[]),f.o.map(o=>flatAll(o[2])+" "+flatAll(o[5]||{})).join(" "),flatAll(f.df||{}),k==="sch-war"?flatAll(WAR_PARTS)+" "+flatAll(SCHED.war.df):"",k==="ma-mac"?"Enterprise Act 2002 National Security and Investment Act 2021":""].join(" ")}
  if(F[k]) return flatAll(F[k].p)+" "+(F[k].e||"");
  if(GUIDE[k]) return flatAll(GUIDE[k].b)+" "+GUIDE[k].s;
  return "";
}
function sourcesOf(k){const t=textOf(k);const out=[];AUTH.concat(CASES).forEach(x=>{if(x.re.test(t)&&!out.includes(x))out.push(x)});return out}

/* ---------- review status and law watch ---------- */
const QA_BASE={date:"2026-10-24",by:"Counterpart (drafted with AI)"};
const WATCH={
 "emp-rc":"The government has consulted on limiting non-compete clauses in employment contracts. Check whether a statutory limit has been introduced before relying on a non-compete.",
 "emp-notice":"Employment law reforms from the Employment Rights Bill are being introduced in stages. Check the current position on notice, dismissal protection and day-one rights.",
 "dp":"The Data (Use and Access) Act 2025 amends the UK GDPR and the Data Protection Act 2018, with provisions commencing in stages. Check commencement before relying on the detail.",
 "data":"The Data (Use and Access) Act 2025 amends the UK GDPR and the Data Protection Act 2018, with provisions commencing in stages.",
 "gl":"The Arbitration Act 2025 changed the default law governing arbitration agreements. Check commencement and the transitional rules for agreements made earlier.",
 "disputes":"The Arbitration Act 2025 changed the default law governing arbitration agreements. Check commencement and the transitional rules.",
 "ma-mac":"The sectors subject to mandatory notification under the National Security and Investment Act 2021 are reviewed periodically. Check the current list and guidance.",
 "dist-excl":"The Vertical Agreements Block Exemption Order 2022 is due to expire on 31 May 2028. Check for any replacement before relying on it for agreements running beyond that date.",
 "ls-rent":"The government has announced plans to ban upward-only rent review clauses in new commercial leases. Check whether the ban is in force.",
 "property":"The government has announced plans to ban upward-only rent reviews in new commercial leases, and the Law Commission has been reviewing Part 2 of the Landlord and Tenant Act 1954. Check the current position.",
 "ls-1954":"The Law Commission has been reviewing the business tenancy regime in Part 2 of the Landlord and Tenant Act 1954. Check for reform.",
 "covenants":"The government has consulted on limiting non-compete clauses in employment contracts. Check the current position."
};
const qaRec=k=>(ST.qa||{})[k]||null;
const fmtD=d=>{const x=new Date(d);return isNaN(x)?"":x.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})};
function qaStatus(k){const r=qaRec(k);
  if(r&&r.flag) return {st:"flag",label:"Flagged for update",r};
  if(!r||!r.date) return {st:"draft",label:"Not yet reviewed by a lawyer",r:null};
  return (Date.now()-Date.parse(r.date))/864e5>365?{st:"due",label:"Review due",r}:{st:"ok",label:"Reviewed",r};
}
function qaBoxHTML(k){
  const s=qaStatus(k), src=sourcesOf(k), w=WATCH[k];
  return `<div class="qa" id="qa-${k}"><div class="qa-h"><span class="qa-st qa-${s.st}">${s.label}</span>
    <span class="qa-d">Drafted ${fmtD(QA_BASE.date)}${s.r&&s.r.date?` · Last reviewed ${fmtD(s.r.date)}${s.r.by?" by "+esc(s.r.by):""}`:" · Never reviewed"}</span></div>
    ${s.r&&s.r.flag?`<p class="qa-w"><b>Flag.</b> ${esc(s.r.flag)}</p>`:""}${s.r&&s.r.note?`<p class="qa-n">${esc(s.r.note)}</p>`:""}
    ${w?`<p class="qa-w"><b>Law changing.</b> ${esc(w)}</p>`:""}
    <details class="qa-src"${src.length&&src.length<5?" open":""}><summary>Sources (${src.length})</summary>${src.length?`<ul>${src.map(a=>`<li>${a.url?`<a href="${a.url}" target="_blank" rel="noopener">${esc(a.t)}</a>`:esc(a.t)}<small>${a.kind}</small></li>`).join("")}</ul>`:`<p class="qa-n">No statute or case is cited. The drafting reflects market practice.</p>`}</details>
    <div class="qa-a"><button class="btn ghost" data-act="qamark" data-k="${k}">${s.st==="ok"?"Mark reviewed again":"Mark as reviewed"}</button><button class="lnk" data-act="qaflag" data-k="${k}">${s.r&&s.r.flag?"Edit flag":"Flag for update"}</button></div></div>`;
}
function qaFlagDialog(k){
  const r=qaRec(k)||{}, name=C[k]?famTitle(k):F[k]?F[k].t:GUIDE[k]?GUIDE[k].t:k;
  return `<div class="dlg" role="dialog" aria-modal="true" aria-labelledby="qf-h"><p class="kicker">${esc(name)}</p><h2 id="qf-h">Review note</h2>
   <label class="fld"><span>Flag for update (leave empty to clear)</span><textarea id="qf-flag" rows="3" placeholder="For example: check the cap wording against our 2026 group policy">${esc(r.flag||"")}</textarea></label>
   <label class="fld"><span>Review note</span><textarea id="qf-note" rows="2" placeholder="For example: checked against the current UCTA position">${esc(r.note||"")}</textarea></label>
   <div class="dlg-f"><button class="btn ghost" data-act="closemodal">Cancel</button><button class="btn silver" data-act="qaflagsave" data-k="${k}">Save</button></div></div>`;
}
const QA_ITEMS=()=>Object.keys(C).map(k=>({k,t:famTitle(k),type:"Clause",cat:(GUIDE[C[k].g[0]]||{}).cat||"Other"}))
  .concat(Object.keys(F).map(k=>({k,t:F[k].t,type:"Standard clause",cat:BOIL.includes(k)?"Boilerplate":"Standard"})))
  .concat(GUIDES.map(g=>({k:g.id,t:g.t,type:"Guide",cat:g.cat})));
function qualityHTML(){
  const items=QA_ITEMS(), f=view.qf||"all", cnt={draft:0,ok:0,due:0,flag:0};
  items.forEach(i=>cnt[qaStatus(i.k).st]++);
  const shown=items.filter(i=>f==="all"||qaStatus(i.k).st===f||(f==="watch"&&WATCH[i.k]));
  return `<section class="cat"><div class="qa-top"><p class="pg-d">Everything in Counterpart was drafted with AI on ${fmtD(QA_BASE.date)}. Review each item against its sources, then mark it as reviewed. Your sign-offs are saved in this browser, and a review falls due again after twelve months.</p>
    <div class="qa-sum"><span><b>${cnt.ok}</b> reviewed</span><span><b>${cnt.draft}</b> not yet reviewed</span><span><b>${cnt.due}</b> due</span><span><b>${cnt.flag}</b> flagged</span><span><b>${items.filter(i=>WATCH[i.k]).length}</b> law changing</span></div>
    <div class="cctl"><div class="chips">${[["all","Everything"],["draft","Not reviewed"],["due","Review due"],["flag","Flagged"],["watch","Law changing"],["ok","Reviewed"]].map(([v,l])=>`<button class="chip${f===v?" on":""}" data-act="qafilter" data-v="${v}">${l}</button>`).join("")}</div><div class="exp"><button class="btn ghost" data-act="qaexport">Export review log (Word)</button></div></div></div>
    <div class="tw dark"><table class="itbl qtbl"><thead><tr><th>Item</th><th>Type</th><th>Status</th><th>Last reviewed</th><th>Sources</th><th></th></tr></thead><tbody>
    ${shown.map(i=>{const s=qaStatus(i.k);return `<tr><td><button class="lnk" data-act="${i.type==="Guide"?"guide":i.type==="Clause"?"clause":"qaopen"}" data-${i.type==="Guide"?"g":"k"}="${i.k}">${esc(i.t)}</button>${WATCH[i.k]?`<small class="qa-wt">Law changing</small>`:""}${s.r&&s.r.flag?`<small class="qa-wt">${esc(s.r.flag)}</small>`:""}</td><td>${i.type}<small>${esc(i.cat)}</small></td><td><span class="qa-st qa-${s.st}">${s.label}</span></td><td>${s.r&&s.r.date?fmtD(s.r.date)+`<small>${esc(s.r.by||"")}</small>`:"Never"}</td><td>${sourcesOf(i.k).length}</td><td><button class="btn ghost sm" data-act="qamark" data-k="${i.k}">Mark reviewed</button></td></tr>`}).join("")}
    </tbody></table></div></section>`;
}
async function qaExport(){
  const items=QA_ITEMS();
  const B=[{p:"Content Review Log",style:"Title"},{p:`Generated ${fmtD(new Date().toISOString())}. All content was drafted with AI on ${fmtD(QA_BASE.date)}.`,align:"center"},
    {tbl:{cols:["Item","Type","Status","Last reviewed","By","Sources","Notes"],w:[24,11,13,11,11,18,12],rows:items.map(i=>{const s=qaStatus(i.k);return [i.t,i.type,s.label,s.r&&s.r.date?fmtD(s.r.date):"Never",s.r&&s.r.by||"",sourcesOf(i.k).map(a=>a.t).join("; "),[s.r&&s.r.flag?"Flag: "+s.r.flag:"",s.r&&s.r.note||"",WATCH[i.k]?"Law changing":""].filter(Boolean).join(" ")]})}}];
  return saveFile("Counterpart content review log.docx",await buildDocx(B,{title:"Content review log"}));
}

/* ---------- playbook ---------- */
const pbAll=()=>ST.pb||(ST.pb={B:{},S:{}});
const pbOf=(k,side)=>{const p=pbAll()[side]&&pbAll()[side][k];return p&&(p.p!=null||p.f!=null||p.w!=null)?p:null};
const riskAt=(k,i,side)=>riskOf(C[k].o[i][1],side);
function pbDefaultsFor(k,side){
  const rs=ranked(k,side);let m=rs[0];rs.forEach(x=>{if(Math.abs(x.o[1])<Math.abs(m.o[1]))m=x});
  const mi=rs.indexOf(m), w=rs[Math.min(rs.length-1,mi+1)];
  return {p:rs[0].i,f:m.i,w:w.i,n:""};
}
function pbLevel(k,risk,side){
  const p=pbOf(k,side);if(!p||risk==null)return null;
  const r=x=>x==null?null:riskAt(k,x,side);
  const rp=r(p.p),rf=r(p.f),rw=r(p.w);
  if(rp!=null&&risk<=rp) return "pref";
  if(rf!=null&&risk<=rf) return "fall";
  if(rw!=null&&risk<=rw) return "walk";
  if(rw!=null) return "out";
  return null;
}
const PB_LABEL={pref:"Within preferred",fall:"At fallback",walk:"At walk-away",out:"Outside walk-away"};
function pbTag(k,i,side){
  const p=pbOf(k,side);if(!p)return"";
  if(p.p===i) return `<em class="t pbp">Your preferred</em>`;
  if(p.f===i) return `<em class="t pbf">Your fallback</em>`;
  if(p.w===i) return `<em class="t pbw">Your walk-away</em>`;
  return pbLevel(k,riskAt(k,i,side),side)==="out"?`<em class="t pbo">Outside your playbook</em>`:"";
}
function playbookContext(keys,side,partyLabel){
  const lines=[];keys.forEach(k=>{const p=pbOf(k,side);if(!p)return;const a=x=>x==null?"not set":C[k].o[x][0].replace(/\{B\}/g,"buyer").replace(/\{S\}/g,"seller");
    lines.push(`${famTitle(k)}: preferred ${a(p.p)}; fallback ${a(p.f)}; walk-away ${a(p.w)}${p.n?". Note: "+p.n:""}`)});
  return lines.length?`\nThe ${partyLabel}'s negotiation playbook (treat anything riskier than the walk-away as unacceptable and say so in the ask):\n`+lines.join("\n"):"";
}
function playbookHTML(){
  const side=ST.pbSide||"B", groups={}, pb=pbAll()[side]||{}, set=Object.keys(C).filter(k=>pbOf(k,side)).length;
  Object.keys(C).forEach(k=>{const cat=(GUIDE[C[k].g[0]]||{}).cat||"Other";(groups[cat]=groups[cat]||[]).push(k)});
  const sel=(k,f,v)=>`<select id="pb-${k}-${f}" data-pb="${k}:${f}" aria-label="${f==="p"?"Preferred":f==="f"?"Fallback":"Walk-away"} position for ${esc(famTitle(k))}"><option value="">Not set</option>${ranked(k,side).map((x,ri)=>`<option value="${x.i}"${v===x.i?" selected":""}>${ri+1}. ${esc(L(x.o[0],{p:["Buyer","Seller"]}))} · ${RISK[x.r]}</option>`).join("")}</select>`;
  return `<section class="cat"><p class="pg-d">Set your positions for each clause: what you open with, what you will fall back to, and the furthest you will go. Reviews flag anything outside your walk-away, Claude is told your positions, and new drafts can start from your preferred positions.</p>
   <div class="cctl"><div class="seg" role="group" aria-label="Acting for"><span class="seg-l">Acting for</span>${["B","S"].map(s=>`<button data-act="pbside" data-side="${s}" aria-pressed="${side===s}"><small>${s==="B"?"Buy side":"Sell side"}</small>${s==="B"?"Buyer, customer, licensee":"Seller, supplier, licensor"}</button>`).join("")}</div>
    <div class="exp"><button class="btn ghost" data-act="pbfill">Fill suggested positions</button><button class="btn ghost" data-act="pbexport">Export playbook (Word)</button>${set?`<button class="lnk" data-act="pbclear">Clear this side</button>`:""}</div></div>
   <p class="svc-count"><b>${set}</b> of ${Object.keys(C).length} clauses set for the ${side==="B"?"buy":"sell"} side</p></section>
   ${["Risk","Rights","Commercial","Corporate","Employment","Property","Finance","Disputes","Foundations"].filter(c=>groups[c]).map(cat=>`<section class="cat"><h2><span>${esc(cat)}</span></h2><div class="tw dark"><table class="itbl pbtbl"><thead><tr><th>Clause</th><th>Preferred</th><th>Fallback</th><th>Walk-away</th><th>Note</th></tr></thead><tbody>
    ${groups[cat].sort((x,y)=>famTitle(x).localeCompare(famTitle(y))).map(k=>{const p=pb[k]||{};const bad=p.p!=null&&p.w!=null&&riskAt(k,p.p,side)>riskAt(k,p.w,side)||p.f!=null&&p.w!=null&&riskAt(k,p.f,side)>riskAt(k,p.w,side);
      return `<tr><td><button class="lnk" data-act="clause" data-k="${k}">${esc(famTitle(k))}</button>${bad?`<small class="qa-wt">Walk-away is less risky than an earlier position</small>`:""}</td><td>${sel(k,"p",p.p)}</td><td>${sel(k,"f",p.f)}</td><td>${sel(k,"w",p.w)}</td><td><input id="pbn-${k}" data-pbn="${k}" value="${esc(p.n||"")}" placeholder="Optional"></td></tr>`}).join("")}
   </tbody></table></div></section>`).join("")}`;
}
async function pbExport(){
  const side=ST.pbSide||"B", nm=x=>x==null?"":L(C[x.k].o[x.i][0],{p:["Buyer","Seller"]});
  const rows=Object.keys(C).filter(k=>pbOf(k,side)).sort((x,y)=>famTitle(x).localeCompare(famTitle(y))).map(k=>{const p=pbOf(k,side);return [famTitle(k),nm({k,i:p.p}),nm({k,i:p.f}),nm({k,i:p.w}),p.n||""]});
  const B=[{p:"Negotiation Playbook",style:"Title"},{p:`Positions when acting for the ${side==="B"?"buy side":"sell side"}. ${fmtD(new Date().toISOString())}.`,align:"center"},
    rows.length?{tbl:{cols:["Clause","Preferred","Fallback","Walk-away","Note"],w:[20,20,20,20,20],rows}}:{p:"No positions have been set yet."}];
  return saveFile(`Counterpart playbook (${side==="B"?"buy side":"sell side"}).docx`,await buildDocx(B,{title:"Negotiation playbook"}));
}

/* ---------- version comparison ---------- */
function untrackedChanges(ours,theirs){
  const A=[],B=[],Bi=[];
  ours.forEach(p=>{const t=normP(p.t);if(t)A.push(t)});
  theirs.forEach((p,i)=>{const t=normP(p.o!=null?p.o:p.t);if(t){B.push(t);Bi.push(i)}});
  const ops=paraDiff(A,B), items=[];let last=Bi[0]||0;
  ops.forEach(o=>{
    if(o.op==="eq"){last=Bi[o.b];return}
    if(o.op==="chg"){const d=wordDiff(A[o.a],B[o.b]);items.push({pi:Bi[o.b],kind:"chg",ours:A[o.a],del:d.filter(x=>x.op==="del").map(x=>x.t.trim()).join(" … "),ins:d.filter(x=>x.op==="ins").map(x=>x.t.trim()).join(" … ")});last=Bi[o.b]}
    else if(o.op==="ins"){items.push({pi:Bi[o.b],kind:"ins",ours:"",del:"",ins:B[o.b]});last=Bi[o.b]}
    else items.push({pi:last,kind:"del",ours:A[o.a],del:A[o.a],ins:""});
  });
  return {items,a:A};
}
function comparisonBlocks(){
  const A=RV.cmp.a, idx=[], Ccur=[];RV.paras.forEach((p,i)=>{const t=normP(p.t);if(t){Ccur.push(t);idx.push(i)}});
  const untr=new Set(RV.cmp.items.map(x=>x.pi)), B=[], comments=[];let cid=1;
  const note=(b,pi)=>{if(untr.has(pi)){const id=cid++;b.cs=[id];b.ce=[id];comments.push({id,text:"This change was not shown as a tracked change in the returned draft.",author:"Counterpart"})}};
  B.push({p:"Comparison: "+safeName(RV.cmp.oursName)+" against "+safeName(RV.name),bold:true,align:"center"});
  paraDiff(A,Ccur).forEach(o=>{let b;
    if(o.op==="eq") b={p:A[o.a]};
    else if(o.op==="chg"){b={p:wordDiff(A[o.a],Ccur[o.b]).map(x=>[x.t,{ins:x.op==="ins",del:x.op==="del"}])};note(b,idx[o.b])}
    else if(o.op==="del") b={p:[[A[o.a],{del:true}]],pdel:true};
    else {b={p:[[Ccur[o.b],{ins:true}]],pins:true};note(b,idx[o.b])}
    B.push(b)});
  return {B,comments};
}

/* ---------- document health check ---------- */
const DEF_MEANS=/[“"]([A-Z][A-Za-z0-9&'’\- ]{0,58}[A-Za-z0-9])[”"]\s+(?:means|shall mean|has the meaning|includes|is defined)/g;
const DEF_INLINE=/\((?:the |each |together |collectively |each a |each an |a |an )?(?:the )?[“"]([A-Z][A-Za-z0-9&'’\- ]{0,58}[A-Za-z0-9])[”"]\)/g;
const HC_STOP=new Set("This That These Those The A An Any Each Such No All If In On Of For And Or But Subject Without Notwithstanding Save Where When Whereas Provided England Wales Scotland United Kingdom London English January February March April May June July August September October November December Monday Tuesday Wednesday Thursday Friday Saturday Sunday Agreement Clause Clauses Schedule Schedules Part Paragraph Article Section Annex Appendix Act Regulations Order Rules Court Courts Secretary State HM Revenue Customs Companies House Registrar Information Commissioner Bank England CEDR LCIA Business Days".split(" "));
function health(){
  const ps=RV.paras, texts=ps.map(p=>p.t), all=texts.join("\n");
  const defs={};
  texts.forEach((t,i)=>{let m;DEF_MEANS.lastIndex=0;while((m=DEF_MEANS.exec(t)))(defs[m[1]]=defs[m[1]]||[]).push(i);DEF_INLINE.lastIndex=0;while((m=DEF_INLINE.exec(t)))(defs[m[1]]=defs[m[1]]||[]).push(i)});
  const esc2=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  const unused=[],dupes=[];
  Object.keys(defs).forEach(term=>{const n=(all.match(new RegExp("(?<![A-Za-z])"+esc2(term)+"(?:s|es)?(?![A-Za-z])","g"))||[]).length;
    if(n-defs[term].length<=0) unused.push({term,pi:defs[term][0]});
    if(new Set(defs[term]).size>1) dupes.push({term,pi:defs[term][1]})});
  const known=new Set(Object.keys(defs)), cand={};
  texts.forEach((t,i)=>{let m;const re=/\b(?:the|a|an|any|each|such|that|this|no|every|all|relevant)\s+((?:[A-Z][a-z]+)(?:\s(?:[A-Z][a-z]+|of|and)){0,3})/g;
    while((m=re.exec(t))){let term=m[1].replace(/\s(?:of|and)$/,"").trim();const first=term.split(" ")[0];
      const after=t.slice(m.index+m[0].length);
      if(/^\s+(?:Act|Regulations|Order|Rules|Directive|Code|Convention)\b/.test(after)||/(?:Act|Authority|Commissioner|Council|Court|Office|Bank|Exchange)$/.test(term))continue;
      const forms=[term,term.replace(/s$/,""),term+"s",term+"es",term.replace(/y$/,"ies")];
      if(HC_STOP.has(term)||HC_STOP.has(first)||forms.some(f=>known.has(f))||[...known].some(k=>k.startsWith(term+" ")||term.startsWith(k+" ")))continue;
      if(/^(Buyer|Seller|Customer|Supplier|Company|Parties|Party)$/.test(term))continue;
      const c=cand[term]||(cand[term]={term,n:0,pi:i});c.n++}});
  const undefinedTerms=Object.values(cand).filter(c=>c.n>=2).sort((x,y)=>y.n-x.n).slice(0,25);
  const nums=new Set();ps.forEach(p=>{const n=(p.hasNum&&p.num?p.num:(p.t.match(/^(\d+(?:\.\d+)*)\.?\s/)||[])[1]||"").replace(/\.$/,"");if(n&&/^\d/.test(n)){nums.add(n);nums.add(n.split(".")[0])}});
  const schNums=new Set();RV.clauses.filter(c=>c.kind==="sch").forEach(c=>{const m=c.title.match(/schedule\s+(\d+)/i);if(m)schNums.add(m[1])});
  const xrefs=[];
  if(nums.size>3) texts.forEach((t,i)=>{let m;const re=/\b[Cc]lauses?\s+(\d+(?:\.\d+)*)(?:\([a-z]+\))?/g;while((m=re.exec(t))){if(!nums.has(m[1]))xrefs.push({ref:m[0],pi:i,why:"No clause "+m[1]+" was found in this document"})}});
  texts.forEach((t,i)=>{let m;const re=/\bSchedule\s+(\d+)\b/g;while((m=re.exec(t))){if(schNums.size&&!schNums.has(m[1]))xrefs.push({ref:m[0],pi:i,why:"No Schedule "+m[1]+" was found in this document"})}});
  const blanks=[];texts.forEach((t,i)=>{let m;const re=/\[(?:\s*|[●•]|_+|x+|X+|\.{2,}|…|\*+|TBC|TBD|tbc|tbd|insert[^\]]{0,60}|date|name|amount|address|number)\]|\bTBC\b|\bTBD\b/g;while((m=re.exec(t)))blanks.push({ref:m[0],pi:i,ctx:t.slice(Math.max(0,m.index-50),m.index+60)})});
  const roles=["Buyer","Purchaser","Seller","Vendor","Customer","Client","Supplier","Provider","Licensee","Licensor"].filter(r=>known.has(r));
  const parties=[];[["Buyer","Purchaser"],["Seller","Vendor"],["Customer","Client"],["Supplier","Provider"]].forEach(([x,y])=>{const def=known.has(x)?x:known.has(y)?y:null;if(!def)return;const other=def===x?y:x;
    if(!known.has(other)){const n=(all.match(new RegExp("\\bthe "+other+"\\b","g"))||[]).length;if(n){const pi=texts.findIndex(t=>new RegExp("\\bthe "+other+"\\b").test(t));parties.push({ref:"the "+other,pi,why:`Used ${n} time${n===1?"":"s"}, but the document defines “${def}”`})}}});
  const total=unused.length+dupes.length+xrefs.length+blanks.length+parties.length;
  return {unused,dupes,undefinedTerms,xrefs,blanks,parties,total,defCount:Object.keys(defs).length};
}
function healthHTML(){
  const h=health(), row=(ref,pi,why)=>{const c=clauseOfPara(pi);return `<tr><td>${esc(ref)}</td><td><button class="lnk" data-act="rvjump" data-id="${c?c.id:""}">${esc(clauseRef(c))}</button></td><td>${esc(why||"")}</td></tr>`};
  const sec=(t,d,rows)=>`<section class="hsec"><h3>${t} <span class="hcount">${rows.length}</span></h3><p class="hint">${d}</p>${rows.length?`<div class="tw dark"><table class="itbl htbl"><thead><tr><th>Item</th><th>Where</th><th>Detail</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>`:`<p class="hok">Nothing found.</p>`}</section>`;
  return `<div class="page wrap"><div class="page-in wide"><button class="back" data-act="rvtab" data-tab="doc">‹ Back to the review</button>
   <p class="kicker">${esc(safeName(RV.name))}</p><h1 class="pg-t">Document health check</h1>
   <p class="pg-d">${h.total} issue${h.total===1?"":"s"} found across ${h.defCount} defined terms, cross-references and blanks. These are checks on the text, so confirm each one before changing the draft.</p>
   ${sec("Blanks to complete","Placeholders such as [●], [insert], TBC and TBD still in the text.",h.blanks.map(b=>row(b.ref,b.pi,"…"+normP(b.ctx)+"…")))}
   ${sec("Broken cross-references","References to clauses or schedules that do not appear in this document.",h.xrefs.map(x=>row(x.ref,x.pi,x.why)))}
   ${sec("Defined but never used","Terms that are defined but not used anywhere else.",h.unused.map(x=>row("“"+x.term+"”",x.pi,"Defined, then not used")))}
   ${sec("Defined more than once","Terms defined in more than one place, which can create inconsistent meanings.",h.dupes.map(x=>row("“"+x.term+"”",x.pi,"Defined again here")))}
   ${sec("Inconsistent party names","A party referred to by a name the document does not define.",h.parties.map(x=>row(x.ref,x.pi,x.why)))}
   ${sec("Possibly undefined terms","Capitalised terms used as defined terms but not defined. Some may be proper names or defined in another document.",h.undefinedTerms.map(x=>row(x.term,x.pi,`Used ${x.n} times`)))}
  </div></div>`;
}
