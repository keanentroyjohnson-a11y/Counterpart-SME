/* ============================================================
   COUNTERPART SME EDITION
   The full Counterpart, with a curated library of twenty
   agreements, a guided start, documents saved to the user's
   account, electronic signing and renewal reminders.
   Loaded after the data and before app.js; app.js calls the
   SMEX hooks.
   ============================================================ */
const SME_IDS=[
 ["Before you start",["nda-m","nda-1"]],
 ["Selling and buying",["std-svc","std-goods","msa","supply","saas","dpa"]],
 ["People",["consult","empc","empset"]],
 ["Suppliers",["mkt","dev","subcon"]],
 ["Partners",["dist","ref"]],
 ["Owners and investment",["omsha","asa","ipassign"]],
 ["Changes and endings",["dterm"]]];
{
 const ag={}; (function walk(ns){ns.forEach(n=>{if(n.id)ag[n.id]=n;else walk(n.k)})})(TREE);
 TREE.splice(0,TREE.length,{n:"Essential agreements",k:SME_IDS.map(([n,ids])=>({n,k:ids.map(i=>ag[i])}))});
}

/* ---------------- guided start ---------------- */
const SME_NEEDS=[
 {id:"hire",t:"Hire someone",d:"An employee, consultant, agency, developer or subcontractor",o:[
  {t:"An employee",ag:"empc",side:"B"},{t:"A consultant or freelancer",ag:"consult",side:"B"},{t:"A marketing agency",ag:"mkt",side:"B"},{t:"A software developer",ag:"dev",side:"B"},{t:"A subcontractor for a customer project",ag:"subcon",side:"B"}]},
 {id:"sell",t:"Sell to customers",d:"Standard terms, services, products, software or data processing",o:[
  {t:"Standard terms for my services",ag:"std-svc",side:"S"},{t:"Standard terms for my products",ag:"std-goods",side:"S"},{t:"Services under a framework with statements of work",ag:"msa",side:"S"},{t:"Supplying products over time",ag:"supply",side:"S"},{t:"Software as a service",ag:"saas",side:"S"},{t:"Working as a consultant",ag:"consult",side:"S"},{t:"Working as a subcontractor",ag:"subcon",side:"S"},{t:"Processing personal data for a customer",ag:"dpa",side:"S"}]},
 {id:"buy",t:"Buy from a supplier",d:"Services, products, software or data processing",o:[
  {t:"Services from a supplier",ag:"msa",side:"B"},{t:"Products from a supplier",ag:"supply",side:"B"},{t:"A software subscription",ag:"saas",side:"B"},{t:"A supplier processing personal data for us",ag:"dpa",side:"B"}]},
 {id:"share",t:"Share confidential information",d:"Before a meeting, a pitch or a deal",o:[
  {t:"Both parties will disclose",ag:"nda-m",ask:{q:"Who is likely to disclose more?",ch:[["Mostly us (act as Discloser)","S"],["Mostly them (act as Recipient)","B"],["About the same","S"]]}},{t:"Only we will disclose",ag:"nda-1",side:"S"},{t:"Only they will disclose",ag:"nda-1",side:"B"}]},
 {id:"partner",t:"Grow through partners",d:"Distributors and introducers",o:[
  {t:"Appoint a distributor",ag:"dist",side:"S"},{t:"Become a distributor",ag:"dist",side:"B"},{t:"Pay an introducer",ag:"ref",side:"B"},{t:"Act as an introducer",ag:"ref",side:"S"}]},
 {id:"own",t:"Owners and investment",d:"Shareholders, early investment and IP ownership",o:[
  {t:"A shareholders' agreement",ag:"omsha",ask:{q:"Will you hold more than half of the shares?",ch:[["Yes (Majority Shareholder)","S"],["No, or exactly half (Minority Shareholder)","B"]]}},{t:"Raise early investment",ag:"asa",side:"S"},{t:"Invest in a start-up",ag:"asa",side:"B"},{t:"Take an assignment of IP created for us",ag:"ipassign",side:"B"}]},
 {id:"end",t:"End something",d:"An employee's exit or an existing contract",o:[
  {t:"Settle an employee's exit",ag:"empset",side:"B"},{t:"Leave employment on agreed terms",ag:"empset",side:"S"},{t:"Terminate a contract by agreement",ag:"dterm",ask:{q:"Under that contract, are you the Customer or the Supplier?",ch:[["Customer","B"],["Supplier","S"]]}}]}];
const SME_VALUES=[["none","No consideration"],["low","Under £10,000 a year"],["mid","£10,000 to £100,000 a year"],["high","£100,000 to £1 million a year"],["vhigh","Over £1 million a year"]];
const SME_LEVS=[["strong","Strong","The other side needs the deal more. Start from the strongest positions on your priorities."],["even","Balanced","Market positions, firmer where it matters to you."],["weak","Limited","You need the deal more. Market positions on your priorities, accommodating elsewhere."]];
const SME_PRI=[
 {id:"liab",t:"Limitation of liability and indemnities",fam:["lol","ind","war","war-s","lic-war","ipa-war","inv-war"]},
 {id:"pay",t:"Payment terms",fam:["pay","ref-fee","asa-price","gd-title"]},
 {id:"ip",t:"Ownership of intellectual property",fam:["ip","dev-acc"]},
 {id:"exit",t:"Termination and exit rights",fam:["term","tmb","emp-notice","jv-dead","jv-transfer","dt-rel"]},
 {id:"conf",t:"Confidentiality and data protection",fam:["conf","nda-def","nda-term","nda-return","dp"]},
 {id:"people",t:"Restrictive covenants and non-solicitation",fam:["nda-nonsol","emp-rc","dist-excl"]},
 {id:"control",t:"Control of decisions",fam:["sha-res","jv-board"]}];
const SME_TERMS=[[0,"No fixed term"],[6,"6 months"],[12,"1 year"],[24,"2 years"],[36,"3 years"],[60,"5 years"]];
const SME_NO_DATES=["nda-m","nda-1","ipassign","dterm","empset","asa","omsha"];
function smePicks(a,side,lev,pris,value){
  const fams=new Set(); SME_PRI.filter(p=>pris.includes(p.id)||(p.id==="liab"&&["high","vhigh"].includes(value))).forEach(p=>p.fam.forEach(f=>fams.add(f)));
  const picks={};
  negKeys(a).forEach(k=>{const r=ranked(k,side);let m=0;r.forEach((x,i)=>{if(Math.abs(x.o[1])<Math.abs(r[m].o[1]))m=i});
    const pri=fams.has(k);const pos=lev==="strong"?(pri?0:m):lev==="even"?(pri?Math.max(0,m-1):m):(pri?m:Math.min(r.length-1,m+1));
    picks[k]=r[pos].i});
  return picks;
}

/* ---------------- storage: the user's account, or this browser ---------------- */
const SME={mode:"local",uid:null,db:null,list:[],profile:{n:"",no:"",ad:""},ready:false,int:null,env:null,unsub:null};
const SME_LSK="counterpart.sme.records.v2";
const smeQ={}; function smeWrite(id,fn){smeQ[id]=(smeQ[id]||Promise.resolve()).then(fn).catch(e=>{if(e&&e.code==="quota_exceeded")toast("Your storage is full. Delete some documents and try again.");else toast("Could not save just now. Your changes are kept on this page.")});return smeQ[id]}
const smeUid=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);
const smeToday=()=>new Date().toISOString().slice(0,10);
const smeFmt=s=>{if(!s)return"";const d=new Date(s+(s.length===10?"T12:00:00":""));return isNaN(d)?s:d.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})};
const smeAddM=(s,n)=>{const d=new Date(s+"T12:00:00");d.setMonth(d.getMonth()+n);return d.toISOString().slice(0,10)};
const smeDays=s=>Math.round((new Date(s+"T12:00:00")-new Date(smeToday()+"T12:00:00"))/864e5);
const recSid=r=>"sme-"+r.id;
const smeRecOf=id=>SME.list.find(r=>r.id===id);
const recOfSid=sid=>sid&&sid.indexOf("sme-")===0?smeRecOf(sid.slice(4)):null;
const smeLocked=r=>r&&r.status&&r.status!=="draft";
const smeOther=s=>s==="B"?"S":"B";
const smeRole=(r,w)=>AG[r.ag].p[w==="B"?0:1];
const SME_ST={draft:["Draft","st-draft"],out:["Out for signature","st-out"],signed:["Signed","st-signed"]};
function smeLocalLoad(){try{const s=JSON.parse(localStorage.getItem(SME_LSK)||"null");if(s){SME.list=s.list||[];SME.profile=Object.assign(SME.profile,s.profile||{})}}catch(e){}}
function smeLocalSave(){try{localStorage.setItem(SME_LSK,JSON.stringify({list:SME.list,profile:SME.profile}))}catch(e){}}
function smeMount(){SME.list.forEach(r=>{ST.docs[recSid(r)]=r.state})}
function smeSave(r){
  r.updated=new Date().toISOString(); const i=SME.list.findIndex(x=>x.id===r.id); if(i<0)SME.list.unshift(r); else SME.list[i]=r;
  ST.docs[recSid(r)]=r.state;
  if(SME.mode==="account")return smeWrite(r.id,()=>SME.db.collection("data/users/"+SME.uid).doc(r.id).set(JSON.parse(JSON.stringify(r))));
  smeLocalSave(); return Promise.resolve();
}
let smeTimers={}; function smeSaveSoon(r){clearTimeout(smeTimers[r.id]);smeTimers[r.id]=setTimeout(()=>smeSave(r),700)}
function smeDelete(id){SME.list=SME.list.filter(r=>r.id!==id);delete ST.docs["sme-"+id];if(SME.mode==="account")return smeWrite(id,()=>SME.db.collection("data/users/"+SME.uid).doc(id).delete());smeLocalSave()}
function smeProfileSave(){if(SME.mode==="account")return smeWrite("profile",()=>SME.db.collection("data/users/"+SME.uid).doc("profile").set(Object.assign({},SME.profile)));smeLocalSave()}
async function smeInit(){
  smeLocalLoad(); smeMount();
  if(typeof window!=="undefined"&&window.claude&&window.claude.use){
    try{const [u,d]=await Promise.all([window.claude.use("user"),window.claude.use("db")]);const id=u&&d?await u.id():null;
      if(id){SME.mode="account";SME.uid=id;SME.db=d;SME.list=[];
        d.collection("data/users/"+id).onSnapshot(snap=>{
          const open=cur&&recOfSid(cur.sid), list=[];
          snap.docs.forEach(s=>{const v=s.data();if(!v)return;if(s.id==="profile"){SME.profile=Object.assign({n:"",no:"",ad:""},v);return}if(!v.ag)return;
            const r=JSON.parse(JSON.stringify(v)); if(open&&open.id===r.id){r.state=open.state} list.push(r)});
          SME.list=list;smeMount();SME.ready=true;
          if(["smedocs","home"].includes(view.v))render(true);
        },()=>{SME.mode="local";smeLocalLoad();smeMount();render(true)});
      }}catch(e){}
  }
  SME.ready=true; if(["smedocs","home"].includes(view.v))render(true);
}

/* ---------------- creating a saved document ---------------- */
function smeCreate(agId,state,extra){
  const r=Object.assign({id:"c"+smeUid(),ag:agId,title:AG[agId].n,state,dates:[],status:"draft",sigs:{},created:new Date().toISOString()},extra||{});
  smeSave(r); return r;
}
function smeFromInterview(){
  const i=SME.int, a=AG[i.ag], other=smeOther(i.side);
  const parties={B:{n:"",no:"",ad:""},S:{n:"",no:"",ad:""}}; parties[i.side]=Object.assign({},i.you); parties[other]=Object.assign({},i.them);
  const picks={B:{},S:{}}; picks[i.side]=smePicks(a,i.side,i.lev,i.pris,i.value);
  const dates=[];
  if(!SME_NO_DATES.includes(i.ag)){dates.push({id:smeUid(),label:"Start date",date:i.start});if(i.term){const end=smeAddM(i.start,i.term);dates.push({id:smeUid(),label:i.renew?"Renewal date":"Expiry date",date:end});if(i.notice)dates.push({id:smeUid(),label:"Last day to give notice",date:smeAddM(end,-i.notice)})}}
  if(i.you.n&&!SME.profile.n&&K[a.k].ind!==i.side){SME.profile={n:i.you.n,no:i.you.no,ad:i.you.ad};smeProfileSave()}
  const r=smeCreate(i.ag,{side:i.side,preset:"market",picks,parties},{dates,answers:{value:i.value,lev:i.lev,pris:i.pris}});
  SME.int=null; openAg(i.ag,null,recSid(r)); ST.sheet=true; refreshPanel(true); toast("Draft ready. Each position is explained in the panel.");
}

/* ---------------- screens ---------------- */
function smeNav(){
  const v=view.v, tab=v==="home"?view.tab:v==="review"?"review":v==="clause"?"clauses":v==="guide"?"guidance":v==="smedocs"||v==="smesign"||(v==="doc"&&cur&&recOfSid(cur.sid))?"docs":v==="smeint"?"start":"agreements";
  const items=[["start","Get started","smestart"],["agreements","Agreements","home"],["review","Review a draft","home"],["docs","Your documents","smedocs"],["clauses","Clause library","home"],["guidance","Guidance","home"]];
  return `<header class="bar wrap"><button class="brand" data-act="home" data-tab="agreements" aria-label="Counterpart SME home"><span class="wm">Counterpart</span><span class="sub">SME</span></button>
  <nav class="nav">${items.map(([t,l,a])=>`<button data-act="${a}" data-tab="${t}" class="${tab===t?"on":""}">${l}</button>`).join("")}</nav>
  <button class="gear" data-act="settings" aria-label="Settings"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg><span>Settings</span></button></header>`;
}
function smeUpcoming(){const out=[];SME.list.forEach(r=>(r.dates||[]).forEach(d=>{if(d.date&&smeDays(d.date)>=0&&d.label!=="Start date")out.push({r,d})}));return out.sort((x,y)=>x.d.date.localeCompare(y.d.date))}
function smeCards(list){return `<div class="mx-list">${list.map(r=>{const s=SME_ST[r.status]||SME_ST.draft,o=r.state.parties[smeOther(r.state.side)].n,nd=(r.dates||[]).filter(d=>d.date&&smeDays(d.date)>=0&&d.label!=="Start date").sort((a,b)=>a.date.localeCompare(b.date))[0];
  return `<button class="mx-card" data-act="smeopen" data-id="${r.id}"><span class="mx-k"><i class="chip ${s[1]}">${s[0]}</i> Acting for the ${esc(smeRole(r,r.state.side))}</span><b>${esc(r.title)}</b><span class="mx-p">${o?esc(o):"Counterparty not named yet"}</span>${nd?`<span class="mx-st"><span>${esc(nd.label)}: ${esc(smeFmt(nd.date))}</span></span>`:""}<span class="mx-u">Updated ${esc(smeFmt((r.updated||"").slice(0,10)))}</span></button>`}).join("")}</div>`}
const smeStore=()=>SME.mode==="account"?`<span class="sv ok">Saved to your account</span>`:`<span class="sv">Saved in this browser only</span>`;
function smeHome(list,ph){
  const up=smeUpcoming().slice(0,4), recent=SME.list.slice().sort((a,b)=>(b.updated||"").localeCompare(a.updated||"")).slice(0,3);
  return `<section class="hero wrap"><div class="hero-in">
    <p class="kicker">Agreements · Clauses · Guidance · For growing businesses</p>
    <h1>Draft with precision. <em>Understand every position.</em></h1>
    <p class="lede">The essential English law agreements for a growing business. Answer a few questions and get a complete draft with every negotiable clause set for your side, each position ranked by risk and explained. Then sign it online, keep it in your account and get reminded before it renews.</p>
    <div class="hero-cta"><button class="btn silver" data-act="smestart">Get started</button><button class="btn ghost" data-act="home" data-tab="agreements" data-scroll="1">Browse agreements</button><button class="btn ghost" data-act="home" data-tab="review">Review a draft</button></div>
    <div class="counts"><span><b>${ALL.length}</b> agreements</span><span><b>${Object.keys(USED).length}</b> negotiable clauses</span><span><b>${Object.keys(USED).reduce((s,k)=>s+C[k].o.length,0)}</b> drafting options</span><span><b>${GUIDES.length}</b> guides</span></div>
  </div></section>
  ${up.length||recent.length?`<div class="wrap sme-top">${up.length?`<section class="cat"><h2><span>Coming up</span></h2><div class="due">${up.map(({r,d})=>{const n=smeDays(d.date);return `<button class="due-r${n<=30?" soon":""}" data-act="smeopen" data-id="${r.id}" data-dates="1"><b>${esc(smeFmt(d.date))}</b><span>${esc(d.label)} · ${esc(r.title)}${r.state.parties[smeOther(r.state.side)].n?" with "+esc(r.state.parties[smeOther(r.state.side)].n):""}</span><em>${n===0?"Today":n===1?"Tomorrow":"In "+n+" days"}</em></button>`}).join("")}</div></section>`:""}
   ${recent.length?`<section class="cat"><h2><span>Recent documents</span></h2>${smeCards(recent)}</section>`:""}</div>`:""}
  <div class="tabs wrap"><div class="tabs-in">${[["agreements","Agreements"],["clauses","Clause library"],["guidance","Guidance"],["playbook","Playbook"]].map(([t,l])=>`<button data-act="tab" data-tab="${t}" class="${view.tab===t?"on":""}">${l}</button>`).join("")}
    ${ph?`<div class="search"><input id="q" type="search" value="${esc(view.q)}" placeholder="${ph.replace("share purchase or lease","services or confidentiality")}" aria-label="Search" autocomplete="off"></div>`:""}</div></div>
  <div class="wrap home-list" id="list">${list}</div>`;
}
function smeDocs(){
  const list=SME.list.slice().sort((a,b)=>(b.updated||"").localeCompare(a.updated||""));
  return `<section class="hero wrap mx-hero"><div class="hero-in"><p class="kicker">Your documents · ${smeStore()}</p><h1>Every agreement in one place.</h1>
   <p class="lede">Drafts, documents out for signature and signed agreements, with their renewal and notice dates.</p>
   <div class="hero-cta"><button class="btn silver" data-act="smestart">New document</button><button class="btn ghost" data-act="smesign">Sign a document sent to you</button></div></div></section>
  <div class="wrap mx">${SME.ready?list.length?`<section class="cat"><h2><span>All documents</span><small>${list.length}</small></h2>${smeCards(list)}</section>`:`<section class="cat"><p class="pg-d">No documents yet. Use Get started, or open any agreement from the library, and it is saved here.</p></section>`:`<p class="pg-d">Loading your documents…</p>`}
  ${SME.mode==="local"?`<p class="mx-hint">Open Counterpart SME in Claude, signed in, to keep your documents in your account and reach them from any device.</p>`:""}</div>`;
}
function smeSteps(n){const names=["Need","Agreement","Parties","Leverage","Priorities","Term"];return `<ol class="steps">${names.map((x,i)=>`<li class="${i<n?"done":i===n?"on":""}"><span>${i+1}</span>${esc(x)}</li>`).join("")}</ol>`}
function smeInt(){
  const i=SME.int, s=i.step; let body="";
  const nav=(next,label)=>`<div class="wiz-nav">${s>0?`<button class="btn ghost" data-act="smeback">Back</button>`:"<span></span>"}${next?`<button class="btn silver" data-act="${next}">${label||"Continue"}</button>`:""}</div>`;
  if(s===0) body=`<h2>What do you need to do?</h2><p class="wiz-d">We will choose the agreement, your side and a starting position for every negotiable clause. You can change any of them in the drafting panel.</p><div class="tiles">${SME_NEEDS.map(n=>`<button class="tile${i.need===n.id?" on":""}" data-act="smeneed" data-n="${n.id}"><b>${esc(n.t)}</b><span>${esc(n.d)}</span></button>`).join("")}</div>${nav()}`;
  else if(s===1){const n=SME_NEEDS.find(x=>x.id===i.need),o=i.opt!=null?n.o[i.opt]:null;
    body=`<h2>${esc(n.t)}</h2><p class="wiz-d">Choose the arrangement.</p><div class="opts-l">${n.o.map((x,k)=>`<button class="opt-l${i.opt===k?" on":""}" data-act="smeopt" data-k="${k}"><b>${esc(x.t)}</b><span>${esc(AG[x.ag].n)}${x.side?` · acting for the ${esc(AG[x.ag].p[x.side==="B"?0:1])} (${x.side==="B"?"buy side":"sell side"})`:""}</span></button>`).join("")}</div>
    ${o&&o.ask?`<div class="ask"><h3>${esc(o.ask.q)}</h3><div class="chips">${o.ask.ch.map(([t],k)=>`<button class="pill${i.askK===k?" on":""}" data-act="smeask" data-k="${k}">${esc(t)}</button>`).join("")}</div></div>`:""}${nav(i.ag&&i.side?"smenext":null)}`}
  else if(s===2){const a=AG[i.ag],kd=K[a.k],yi=kd.ind===i.side,ti=kd.ind===smeOther(i.side);
    const f=(w,k,ph,lab)=>`<label class="fld"><span>${esc(lab)}</span><input id="si-${w}-${k}" data-si="${w}.${k}" value="${esc(i[w][k]||"")}" placeholder="${esc(ph)}"></label>`;
    const box=(w,ind,lab)=>`<fieldset class="pf"><legend>${esc(lab)}</legend>${ind?f(w,"n","Full name","Full name")+f(w,"ad","Address","Address"):f(w,"n","[COMPANY NAME] LIMITED","Company name")+f(w,"no","Company number","Company number")+f(w,"ad","Registered office","Registered office")}</fieldset>`;
    body=`<h2>Parties</h2><p class="wiz-d">These complete the parties clause. Leave anything not yet known blank: it stays as [●].</p><div class="pp">${box("you",yi,"You, the "+AG[i.ag].p[i.side==="B"?0:1])}${box("them",ti,"The "+AG[i.ag].p[i.side==="B"?1:0])}</div>${nav("smenext")}`}
  else if(s===3) body=`<h2>Value and leverage</h2><h3 class="q">Approximate value</h3><div class="chips">${SME_VALUES.map(([v,t])=>`<button class="pill${i.value===v?" on":""}" data-act="smeval" data-v="${v}">${esc(t)}</button>`).join("")}</div>
    <h3 class="q">Your negotiating position</h3><div class="opts-l three">${SME_LEVS.map(([v,t,d])=>`<button class="opt-l${i.lev===v?" on":""}" data-act="smelev" data-v="${v}"><b>${esc(t)}</b><span>${esc(d)}</span></button>`).join("")}</div>${nav("smenext")}`;
  else if(s===4){const keys=new Set(negKeys(AG[i.ag])),rel=SME_PRI.filter(p=>p.fam.some(f=>keys.has(f)));
    body=`<h2>Priorities</h2><p class="wiz-d">Choose up to three. These clauses start from a firmer position for you; the rest start at market standard. A high-value deal also treats liability as a priority.</p><div class="opts-l">${rel.map(p=>`<button class="opt-l chk${i.pris.includes(p.id)?" on":""}" data-act="smepri" data-p="${p.id}" aria-pressed="${i.pris.includes(p.id)}"><b>${esc(p.t)}</b><span>${esc(p.fam.filter(f=>keys.has(f)).map(f=>famTitle(f)).join(", "))}</span></button>`).join("")}</div>${nav("smenext")}`}
  else body=SME_NO_DATES.includes(i.ag)?`<h2>Ready to draft</h2><p class="wiz-d">This agreement has no renewal or notice dates to track. You can add your own key dates to the saved document.</p>${nav("smemake","Create the draft")}`:
    `<h2>Term and key dates</h2><p class="wiz-d">Used for your reminders. Check that the term and notice clauses in the draft match.</p><div class="pp">
    <label class="fld"><span>Start date</span><input type="date" id="si-start" data-si="start" value="${esc(i.start)}"></label>
    <label class="fld"><span>Initial term</span><select id="si-term" data-si="term">${SME_TERMS.map(([v,t])=>`<option value="${v}"${+i.term===v?" selected":""}>${t}</option>`).join("")}</select></label>
    <label class="fld"><span>Notice period</span><select id="si-notice" data-si="notice">${[[0,"None"],[1,"1 month"],[3,"3 months"],[6,"6 months"]].map(([v,t])=>`<option value="${v}"${+i.notice===v?" selected":""}>${t}</option>`).join("")}</select></label>
    <label class="fld"><span>At the end of the term</span><select id="si-renew" data-si="renew"><option value="1"${i.renew?" selected":""}>Continues until terminated on notice</option><option value="0"${i.renew?"":" selected"}>Expires</option></select></label></div>${nav("smemake","Create the draft")}`;
  return `<div class="wrap sme wiz">${smeSteps(s)}<section class="wiz-card">${body}</section></div>`;
}
const smeNewInt=need=>({step:need?1:0,need:need||null,opt:null,side:null,ag:null,askK:null,you:Object.assign({n:"",no:"",ad:""},SME.profile),them:{n:"",no:"",ad:""},value:"mid",lev:"even",pris:[],start:smeToday(),term:12,renew:true,notice:3});

/* ---------------- toolbar, dates and signing ---------------- */
function smeToolbar(a){
  const r=recOfSid(a.sid); if(!r) return "";
  const s=SME_ST[r.status]||SME_ST.draft;
  return `<span class="chip ${s[1]}">${s[0]}</span><button class="btn ghost" data-act="smedates">Key dates</button><button class="btn ghost" data-act="smesigndlg">Sign</button>${r.status==="draft"?`<button class="lnk" data-act="smedel">Delete</button>`:""}`;
}
function smeDatesDlg(r){const ds=(r.dates||[]).slice().sort((a,b)=>(a.date||"").localeCompare(b.date||""));
  return `<div class="dlg wide" role="dialog" aria-modal="true" aria-labelledby="sd-h"><p class="kicker">${esc(r.title)}</p><h2 id="sd-h">Key dates</h2><p class="dlg-d">Renewal, expiry and notice dates. Add them to your calendar for a reminder a week before and on the day.</p>
   <div class="dl">${ds.map(d=>`<div class="dl-r"><input id="dl-${d.id}-l" data-dl="${d.id}:label" value="${esc(d.label)}" aria-label="Event"><input type="date" id="dl-${d.id}-d" data-dl="${d.id}:date" value="${esc(d.date||"")}" aria-label="Date"><span class="dl-n">${d.date?(smeDays(d.date)<0?"Passed":smeDays(d.date)===0?"Today":"In "+smeDays(d.date)+" days"):""}</span><button class="lnk" data-act="smedldel" data-d="${d.id}" aria-label="Remove">×</button></div>`).join("")||`<p class="pg-d">No dates yet.</p>`}</div>
   <div class="dlg-f"><button class="btn ghost" data-act="smedladd">Add a date</button>${ds.length?`<button class="btn ghost" data-act="smeics">Add to calendar</button>`:""}<button class="btn silver" data-act="closemodal">Done</button></div></div>`}
function smeSigP(r,w){const s=(r.sigs||{})[w],p=r.state.parties[w];return `<div class="sg-p${s?" done":""}"><span class="kicker">${esc(smeRole(r,w))}${w===r.state.side?" (you)":""}</span><b>${esc(p.n||"Name not completed")}</b>${s?`${s.img?`<img src="${esc(s.img)}" alt="Signature of ${esc(s.name)}">`:""}<span>Signed by ${esc(s.name)} on ${esc(new Date(s.at).toLocaleString("en-GB"))}${s.manual?" (outside Counterpart)":""}</span>`:`<span>Not signed</span>`}</div>`}
function smePad(){return `<div class="pad"><div class="pad-tabs"><button class="pill on" data-act="smepadmode" data-m="draw">Draw</button><button class="pill" data-act="smepadmode" data-m="type">Type</button></div>
 <label class="fld"><span>Full name of signatory</span><input id="sg-name" autocomplete="name"></label>
 <canvas id="sg-pad" width="640" height="180" aria-label="Signature pad"></canvas><div class="pad-f"><button class="lnk" data-act="smepadclear">Clear</button></div>
 <label class="agree"><input type="checkbox" id="sg-ok"><span>I agree to sign electronically, and intend this to be my signature on this document.</span></label></div>`}
function smeSignDlg(r){
  const you=r.state.side, them=smeOther(you), sg=r.sigs||{}, deed=!!K[AG[r.ag].k].deed, pg=dealProgress(build(Object.assign({},AG[r.ag],{sid:recSid(r)})));
  let b=`<div class="sg">${smeSigP(r,you)}${smeSigP(r,them)}</div>`;
  if(deed) b=`<div class="law"><span>Deed</span>A deed must be signed in the physical presence of a witness, who also signs. Export it to Word, sign on paper, then record the signatures here.</div>${b}<div class="dlg-f"><button class="btn ghost" data-act="bexport">Export to Word</button>${r.status!=="signed"?`<button class="btn silver" data-act="smemanual">Record a signature</button>`:""}</div>`;
  else if(r.status==="draft") b=`<p class="dlg-d">Preparing the document locks the drafting and records a SHA-256 fingerprint of the text, so both parties sign the same version.</p>
   ${pg.done<pg.total?`<div class="law"><span>Deal details</span>${pg.total-pg.done} blanks are still open. <button class="lnk inline" data-act="deal">Complete them first</button></div>`:""}${b}
   <div class="dlg-f"><button class="btn ghost" data-act="closemodal">Not yet</button><button class="btn silver" data-act="smeprep">Prepare for signing</button></div>`;
  else if(r.status==="out"){
    if(!sg[you]) b+=`<div class="sg-form"><h3>Sign for the ${esc(smeRole(r,you))}</h3>${smePad()}<div class="mx-add"><button class="btn silver" data-act="smesignme">Sign</button></div></div>`;
    if(!sg[them]) b+=`<div class="sg-inv"><h3>Signature of the ${esc(smeRole(r,them))}</h3>${SME.mode==="account"&&r.envId?`<ol class="howto"><li>Share this page with them as a Contributor from the Share menu. They need a Claude account.</li><li>They open it, choose <b>Your documents</b>, then <b>Sign a document sent to you</b>, and enter this code:</li></ol><div class="code"><code>${esc(r.envId)}</code><button class="btn ghost sm" data-act="smecopy">Copy code</button></div><p class="mx-hint">Anyone with access to this page and the code can read and sign the document. Keep the code private.</p>`:`<p class="dlg-d">Online signing by the other party needs the page opened in Claude. Otherwise send the Word file and record their signature.</p>`}
     <div class="mx-add"><button class="btn ghost" data-act="bexport">Export to Word</button><button class="btn ghost" data-act="smemanual">Record their signature</button></div></div>`;
    b+=`<div class="dlg-f"><button class="lnk" data-act="smeunprep">Cancel signing and unlock</button><button class="btn silver" data-act="closemodal">Done</button></div>`;
  } else b+=`<div class="law ok"><span>Signed</span>Both parties have signed. Export to Word for the signed copy with its electronic signature certificate.</div><div class="dlg-f"><button class="btn silver" data-act="bexport">Export signed copy</button></div>`;
  return `<div class="dlg wide" role="dialog" aria-modal="true" aria-labelledby="sg-h"><p class="kicker">${esc(r.title)}</p><h2 id="sg-h">Signing</h2>${b}<p class="disc">Electronic signatures are valid for most commercial contracts in England and Wales. Deeds and documents registered at HM Land Registry have their own signing rules.</p></div>`;
}
let SMEPAD={mode:"draw",drawn:false};
function smePadInit(){const c=document.getElementById("sg-pad");if(!c)return;SMEPAD={mode:"draw",drawn:false};const x=c.getContext("2d");x.lineWidth=2.4;x.lineCap="round";x.strokeStyle="#1A1415";let down=false;
  const pt=e=>{const r=c.getBoundingClientRect();return [(e.clientX-r.left)*c.width/r.width,(e.clientY-r.top)*c.height/r.height]};
  c.onpointerdown=e=>{if(SMEPAD.mode!=="draw")return;down=true;c.setPointerCapture(e.pointerId);const [a,b]=pt(e);x.beginPath();x.moveTo(a,b)};
  c.onpointermove=e=>{if(!down)return;const [a,b]=pt(e);x.lineTo(a,b);x.stroke();SMEPAD.drawn=true};c.onpointerup=()=>{down=false}}
function smePadTyped(){const c=document.getElementById("sg-pad"),x=c.getContext("2d"),n=document.getElementById("sg-name").value.trim();x.clearRect(0,0,c.width,c.height);if(!n)return;x.fillStyle="#1A1415";x.font="italic 52px 'Snell Roundhand','Brush Script MT','Segoe Script',cursive";x.textBaseline="middle";x.fillText(n,24,95);SMEPAD.drawn=true}
function smePadRead(){const n=(document.getElementById("sg-name")||{}).value||"",ok=(document.getElementById("sg-ok")||{}).checked;
  if(!n.trim()){toast("Enter the signatory's full name");return null}if(SMEPAD.mode==="type")smePadTyped();if(!SMEPAD.drawn){toast("Draw or type the signature");return null}if(!ok){toast("Confirm consent to sign electronically");return null}
  return {name:n.trim(),img:document.getElementById("sg-pad").toDataURL("image/png"),at:new Date().toISOString(),method:SMEPAD.mode==="type"?"typed":"drawn",consent:true}}
async function smeSha(t){try{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}catch(e){let h=0;for(let i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))|0;return "x"+(h>>>0).toString(16)}}
function smeShowDlg(html){modal.innerHTML=html;modal.hidden=false;smePadInit()}
async function smePrep(r){
  const m=build(Object.assign({},AG[r.ag],{sid:recSid(r)})),text=docText(m),hash=await smeSha(text);
  r.status="out";r.sigs={};r.hash=hash;r.envId=null;
  if(SME.mode==="account"){const env=smeUid()+smeUid();
    try{await SME.db.doc("sign/"+env).set({title:r.title,text,hash,created:new Date().toISOString(),roles:{B:{label:smeRole(r,"B"),name:r.state.parties.B.n},S:{label:smeRole(r,"S"),name:r.state.parties.S.n}},ownerRole:r.state.side,sigs:{}});r.envId=env}catch(e){toast("Online signing is unavailable; you can still sign and record the other party's signature.")}}
  await smeSave(r);smeWatch(r);render(true);smeShowDlg(smeSignDlg(r));
}
function smeWatch(r){if(SME.unsub){SME.unsub();SME.unsub=null}if(SME.mode!=="account"||!r||!r.envId||r.status!=="out")return;
  SME.unsub=SME.db.doc("sign/"+r.envId).onSnapshot(s=>{const v=s.data();if(!v)return;const x=smeRecOf(r.id);if(!x||x.status!=="out")return;const th=smeOther(x.state.side),got=(v.sigs||{})[th];
    if(got&&!(x.sigs||{})[th]){x.sigs=Object.assign({},x.sigs,{[th]:got});if(x.sigs[x.state.side])x.status="signed";smeSave(x);toast("The other party has signed");if(!modal.hidden&&modal.querySelector("#sg-h"))smeShowDlg(smeSignDlg(x));if(view.v==="doc")render(true)}},()=>{})}
async function smeSignMine(r){const s=smePadRead();if(!s)return;s.uid=SME.uid;s.hash=r.hash;r.sigs=Object.assign({},r.sigs,{[r.state.side]:s});if(r.sigs[smeOther(r.state.side)])r.status="signed";
  if(SME.mode==="account"&&r.envId){try{await SME.db.doc("sign/"+r.envId).update({sigs:{[r.state.side]:s}})}catch(e){}}
  await smeSave(r);toast("Signed");render(true);smeShowDlg(smeSignDlg(r))}
function smeCert(title,hash,parts){
  const B=[{p:"Electronic Signature Certificate",style:"Heading1",pageBreak:true},{p:"Document: "+title},{p:"Document fingerprint (SHA-256): "+hash}];
  B.push({tbl:{cols:["Party","Signed by","Date and time (UTC)","Method"],w:[24,26,28,22],rows:parts.map(([l,s])=>[l,s?s.name:"Not signed",s?new Date(s.at).toISOString().replace("T"," ").slice(0,19):"",s?(s.manual?"Signed outside Counterpart":"Electronic signature, "+(s.method||"drawn")+", consent recorded"):""])}});
  B.push({p:"Each signatory confirmed that they agreed to sign electronically and intended their electronic signature to be their signature on this document. The fingerprint identifies the exact text signed: any change to the text produces a different fingerprint.",italic:true});return B;
}
async function smeExport(r,notes){
  const m=build(Object.assign({},AG[r.ag],{sid:recSid(r)})),x=builderBlocks(m,notes&&r.status==="draft");
  if(Object.keys(r.sigs||{}).length){["B","S"].forEach(w=>{const s=r.sigs[w];if(s)x.B.push({p:`Signed for the ${smeRole(r,w)} by ${s.name} on ${new Date(s.at).toLocaleString("en-GB")}${s.manual?"":" by electronic signature"}.`})});x.B.push(...smeCert(r.title,r.hash||await smeSha(docText(m)),["B","S"].map(w=>[smeRole(r,w),r.sigs[w]])))}
  const b=await buildDocx(x.B,{comments:x.comments,title:r.title,author:prof().name||SME.profile.n||"Counterpart SME"});
  return saveFile(safeName(r.title+(r.state.parties[smeOther(r.state.side)].n?" - "+r.state.parties[smeOther(r.state.side)].n:"")+(r.status==="signed"?" (signed)":""))+".docx",b);
}
function smeIcs(r){
  const e2=s=>String(s).replace(/[\\;,]/g,m=>"\\"+m).replace(/\n/g,"\\n"),now=new Date().toISOString().replace(/[-:]/g,"").slice(0,15)+"Z",o=r.state.parties[smeOther(r.state.side)].n;
  const L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Counterpart SME//EN","CALSCALE:GREGORIAN"];
  (r.dates||[]).filter(d=>d.date).forEach(d=>{const de=new Date(d.date+"T12:00:00");de.setDate(de.getDate()+1);
    L.push("BEGIN:VEVENT","UID:"+r.id+"-"+d.id+"@counterpart-sme","DTSTAMP:"+now,"DTSTART;VALUE=DATE:"+d.date.replace(/-/g,""),"DTEND;VALUE=DATE:"+de.toISOString().slice(0,10).replace(/-/g,""),"SUMMARY:"+e2(d.label+": "+r.title+(o?" with "+o:"")),"DESCRIPTION:"+e2("Reminder from Counterpart SME."),
      "BEGIN:VALARM","TRIGGER:-P7D","ACTION:DISPLAY","DESCRIPTION:"+e2(d.label+" in one week"),"END:VALARM","BEGIN:VALARM","TRIGGER:PT9H","ACTION:DISPLAY","DESCRIPTION:"+e2(d.label+" today"),"END:VALARM","END:VEVENT")});
  L.push("END:VCALENDAR");return L.join("\r\n");
}
/* counterparty signing with a code */
function smeSignPage(){
  const E=SME.env;
  if(E&&E.v){const v=E.v,role=smeOther(v.ownerRole),mine=(v.sigs||{})[role];
    return `<div class="tools wrap"><div class="tools-in"><button class="back" data-act="smesign">‹ Another code</button><div class="tt"><span class="crumb">Signing for the ${esc(v.roles[role].label)}</span><h1>${esc(v.title)}</h1></div></div></div>
    <div class="wrap sme"><section class="cat">${E.ok?`<div class="law ok"><span>Verified</span>The text matches the fingerprint recorded when the document was prepared for signing.</div>`:`<div class="law"><span>Warning</span>The text does not match the version prepared for signing. Do not sign; contact the other party.</div>`}
     <article class="paper plain">${v.text.split(/\n{2,}/).map(p=>`<p>${esc(p).replace(/\n/g,"<br>")}</p>`).join("")}</article>
     ${mine?`<div class="law ok"><span>Signed</span>You signed on ${esc(new Date(mine.at).toLocaleString("en-GB"))}.</div><div class="mx-add"><button class="btn ghost" data-act="smeenvword">Download a copy</button></div>`:E.ok?`<div class="sg-form"><h3>Sign for the ${esc(v.roles[role].label)}${v.roles[role].name?" ("+esc(v.roles[role].name)+")":""}</h3>${smePad()}<div class="mx-add"><button class="btn silver" data-act="smesignenv">Sign</button></div></div>`:""}</section></div>`}
  return `<div class="wrap sme wiz"><section class="wiz-card"><h2>Sign a document sent to you</h2><p class="wiz-d">Enter the signing code you were given. You can read the whole document before signing.</p>
   ${SME.mode==="account"?`<div class="pp"><label class="fld"><span>Signing code</span><input id="env-code" autocomplete="off" spellcheck="false"></label></div><div class="wiz-nav"><button class="btn ghost" data-act="smedocs">Back</button><button class="btn silver" data-act="smeloadenv">Open document</button></div>`:`<p class="pg-d">Signing with a code needs Counterpart SME opened in Claude, signed in.</p>`}</section></div>`;
}
async function smeLoadEnv(code){code=String(code||"").trim();if(!/^[a-z0-9]{8,40}$/.test(code)){toast("That code is not valid");return}
  try{const s=await SME.db.doc("sign/"+code).get();if(!s.exists){toast("No document found. Check the code, and that this page has been shared with you.");return}
    const v=JSON.parse(JSON.stringify(s.data()));SME.env={code,v,ok:(await smeSha(v.text))===v.hash};render()}catch(e){toast("Could not open that document")}}
async function smeSignEnv(){const s=smePadRead();if(!s)return;const v=SME.env.v,role=smeOther(v.ownerRole);s.uid=SME.uid;s.hash=v.hash;
  try{await SME.db.doc("sign/"+SME.env.code).update({sigs:{[role]:s}});v.sigs=Object.assign({},v.sigs,{[role]:s});toast("Signed");render(true)}catch(e){toast("Your signature could not be saved. Ask the sender to share the page with you as a Contributor.")}}
async function smeEnvWord(){const v=SME.env.v,B=[{p:v.title,style:"Title"}];v.text.split(/\n{2,}/).forEach(p=>B.push({p:p.replace(/\n/g," ")}));B.push(...smeCert(v.title,v.hash,["B","S"].map(w=>[v.roles[w].label,(v.sigs||{})[w]])));return saveFile(safeName(v.title)+" (signed copy).docx",await buildDocx(B,{title:v.title}))}

/* ---------------- hooks called by app.js ---------------- */
const LOCKED_ACTS=["use","preset","side","brevert","dquse","dqclear","pkside","pkpreset"];
var SMEX={
 views:{smeint:()=>smeInt(),smedocs:()=>smeDocs(),smesign:()=>smeSignPage()},
 header:()=>smeNav(),
 home:(list,ph)=>smeHome(list,ph),
 toolbar:a=>smeToolbar(a),
 rec:a=>recOfSid(a.sid),
 boot(){ if(!ST.mode)ST.mode="dark"; smeInit(); },
 afterSave(){ const r=cur&&recOfSid(cur.sid); if(r)smeSaveSoon(r); },
 started(c){ if(c.sid&&recOfSid(c.sid))return false; const st=JSON.parse(JSON.stringify(docState(c.id))); delete ST.docs[c.id]; save();
   const other=smeOther(st.side); if(SME.profile.n&&K[c.k].ind!==st.side&&!st.parties[st.side].n)st.parties[st.side]=Object.assign({},SME.profile);
   const r=smeCreate(c.id,st); openAg(c.id,null,recSid(r)); toast("Saved to Your documents"); return true; },
 click(t,e){
  const a=t.dataset.act, r=cur&&recOfSid(cur.sid), i=SME.int;
  if(r&&smeLocked(r)&&LOCKED_ACTS.includes(a)){toast("This document is locked for signing. Cancel signing to make changes.");return true}
  if(a==="bexportgo"&&r){const n=(document.getElementById("bx-notes")||{}).checked;modal.hidden=true;smeExport(r,n).catch(()=>toast("The Word file could not be created."));return true}
  if(a==="bexport"&&r&&Object.keys(r.sigs||{}).length){smeExport(r,false).catch(()=>toast("The Word file could not be created."));return true}
  switch(a){
   case "smestart": SME.int=smeNewInt();view={v:"smeint",tab:view.tab,q:""};cur=null;sel=null;modal.hidden=true;render();return true;
   case "smedocs": view={v:"smedocs",tab:view.tab,q:""};cur=null;sel=null;modal.hidden=true;render();return true;
   case "smesign": SME.env=null;view={v:"smesign",tab:view.tab,q:""};cur=null;sel=null;modal.hidden=true;render();return true;
   case "smeneed": i.need=t.dataset.n;i.opt=null;i.ag=null;i.side=null;i.askK=null;i.step=1;render();return true;
   case "smeopt": {const o=SME_NEEDS.find(n=>n.id===i.need).o[+t.dataset.k];i.opt=+t.dataset.k;i.ag=o.ag;i.side=o.side||null;i.askK=null;render(true);return true}
   case "smeask": {const o=SME_NEEDS.find(n=>n.id===i.need).o[i.opt];i.askK=+t.dataset.k;i.side=o.ask.ch[i.askK][1];render(true);return true}
   case "smenext": i.step=Math.min(5,i.step+1);render();return true;
   case "smeback": i.step=Math.max(0,i.step-1);render();return true;
   case "smeval": i.value=t.dataset.v;render(true);return true;
   case "smelev": i.lev=t.dataset.v;render(true);return true;
   case "smepri": {const p=t.dataset.p;if(i.pris.includes(p))i.pris=i.pris.filter(x=>x!==p);else if(i.pris.length<3)i.pris.push(p);else toast("Choose up to three");render(true);return true}
   case "smemake": smeFromInterview();return true;
   case "smeopen": {const x=smeRecOf(t.dataset.id);if(!x)return true;openAg(x.ag,null,recSid(x));smeWatch(x);if(t.dataset.dates)smeShowDlg(smeDatesDlg(x));return true}
   case "smedates": smeShowDlg(smeDatesDlg(r));return true;
   case "smedladd": r.dates=(r.dates||[]).concat([{id:smeUid(),label:"Key date",date:smeToday()}]);smeSave(r);smeShowDlg(smeDatesDlg(r));return true;
   case "smedldel": r.dates=(r.dates||[]).filter(d=>d.id!==t.dataset.d);smeSave(r);smeShowDlg(smeDatesDlg(r));return true;
   case "smeics": saveFile(safeName(r.title)+" key dates.ics",new Blob([smeIcs(r)],{type:"text/calendar"}));return true;
   case "smesigndlg": smeWatch(r);smeShowDlg(smeSignDlg(r));return true;
   case "smeprep": smePrep(r);return true;
   case "smesignme": smeSignMine(r);return true;
   case "smeunprep": if(t.dataset.confirm!=="1"){t.dataset.confirm="1";t.textContent="Click again: signatures will be cleared";return true}
     (async()=>{if(SME.mode==="account"&&r.envId){try{await SME.db.doc("sign/"+r.envId).delete()}catch(_){}}r.status="draft";r.sigs={};r.envId=null;r.hash=null;await smeSave(r);render(true);smeShowDlg(smeSignDlg(r))})();return true;
   case "smecopy": navigator.clipboard.writeText(r.envId).then(()=>toast("Code copied"),()=>toast("Select the code and copy it"));return true;
   case "smemanual": {const w=!(r.sigs||{})[smeOther(r.state.side)]?smeOther(r.state.side):r.state.side;
     smeShowDlg(`<div class="dlg" role="dialog" aria-modal="true"><h2>Record a signature</h2><p class="dlg-d">For a document signed on paper or in another system. Keep the signed original.</p><div class="pp"><label class="fld"><span>Party</span><select id="mn-w">${["B","S"].filter(x=>!(r.sigs||{})[x]).map(x=>`<option value="${x}"${x===w?" selected":""}>${esc(smeRole(r,x))}</option>`).join("")}</select></label><label class="fld"><span>Signed by</span><input id="mn-n"></label><label class="fld"><span>Date signed</span><input type="date" id="mn-d" value="${smeToday()}"></label></div><div class="dlg-f"><button class="btn ghost" data-act="smesigndlg">Back</button><button class="btn silver" data-act="smemnsave">Record</button></div></div>`);return true}
   case "smemnsave": (async()=>{const w=document.getElementById("mn-w").value,n=document.getElementById("mn-n").value.trim(),d=document.getElementById("mn-d").value;if(!n){toast("Enter who signed");return}
     if(r.status==="draft"){r.status="out";r.hash=await smeSha(docText(build(Object.assign({},AG[r.ag],{sid:recSid(r)}))))}r.sigs=Object.assign({},r.sigs,{[w]:{name:n,at:new Date(d+"T12:00:00").toISOString(),manual:true}});if(r.sigs.B&&r.sigs.S)r.status="signed";await smeSave(r);render(true);smeShowDlg(smeSignDlg(r))})();return true;
   case "smepadmode": SMEPAD.mode=t.dataset.m;modal.querySelectorAll('[data-act="smepadmode"]').forEach(b=>b.classList.toggle("on",b===t));{const c=document.getElementById("sg-pad");c.getContext("2d").clearRect(0,0,c.width,c.height);SMEPAD.drawn=false;if(SMEPAD.mode==="type")smePadTyped()}return true;
   case "smepadclear": {const c=document.getElementById("sg-pad");c.getContext("2d").clearRect(0,0,c.width,c.height);SMEPAD.drawn=false;return true}
   case "smeloadenv": smeLoadEnv(document.getElementById("env-code").value);return true;
   case "smesignenv": smeSignEnv();return true;
   case "smeenvword": smeEnvWord().catch(()=>toast("The Word file could not be created."));return true;
   case "smedel": if(t.dataset.confirm!=="1"){t.dataset.confirm="1";t.textContent="Click again to delete";return true}smeDelete(r.id);view={v:"smedocs",tab:view.tab,q:""};cur=null;render();toast("Document deleted");return true;
  }
  if(a==="settings"){setTimeout(()=>{const f=modal.querySelector(".dlg-f");if(f&&!modal.querySelector("#bp-n"))f.insertAdjacentHTML("beforebegin",`<div class="set-sec"><h3>Your business</h3><p class="hint">Used for your party details in new documents. ${SME.mode==="account"?"Saved to your account.":"Saved in this browser."}</p><div class="pp"><label class="fld"><span>Company name</span><input id="bp-n" value="${esc(SME.profile.n||"")}"></label><label class="fld"><span>Company number</span><input id="bp-no" value="${esc(SME.profile.no||"")}"></label><label class="fld wide"><span>Registered office</span><input id="bp-ad" value="${esc(SME.profile.ad||"")}"></label></div></div>`)},0);return false}
  if(a==="stsave"&&document.getElementById("bp-n")){SME.profile={n:document.getElementById("bp-n").value.trim(),no:document.getElementById("bp-no").value.trim(),ad:document.getElementById("bp-ad").value.trim()};smeProfileSave();return false}
  return false;
 },
 input(e){
  const ds=e.target.dataset||{}, i=SME.int, r=cur&&recOfSid(cur.sid);
  if(ds.si&&i){const [w,k]=ds.si.split(".");if(k)i[w][k]=e.target.value;else i[w]=w==="term"||w==="notice"?+e.target.value:w==="renew"?e.target.value==="1":e.target.value;return true}
  if(e.target.id==="sg-name"){if(SMEPAD.mode==="type")smePadTyped();return true}
  if(ds.dl&&r){const [id,f]=ds.dl.split(":"),d=(r.dates||[]).find(x=>x.id===id);if(d){d[f]=e.target.value;smeSaveSoon(r)}return true}
  if(r&&smeLocked(r)&&(ds.pf||ds.fi!=null||ds.fd||ds.bek)){toast("This document is locked for signing.");return true}
  return false;
 },
 change(e){
  const ds=e.target.dataset||{}, r=cur&&recOfSid(cur.sid);
  if(ds.si&&SME.int){const w=ds.si,v=e.target.value;SME.int[w]=w==="term"||w==="notice"?+v:w==="renew"?v==="1":v;return true}
  if(ds.dl)return true;
  if(r&&smeLocked(r)&&(e.target.id==="edt"||ds.sv||ds.svm||ds.wp)){e.target.checked=!e.target.checked;toast("This document is locked for signing.");return true}
  return false;
 }
};
