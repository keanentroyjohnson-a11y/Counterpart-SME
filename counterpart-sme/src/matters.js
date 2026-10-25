/* ============================================================
   MATTERS: a deal workspace holding drafts, reviews, issues
   lists by round, a checklist and notes. Stored in this browser.
   ============================================================ */
const MX_STATUS=[["open","Open"],["agreed","Agreed"],["conceded","Conceded"]];
let MX_PENDING=null;
const mxAll=()=>(ST.matters=ST.matters||[]);
const mxGet=id=>mxAll().find(m=>m.id===id);
const mxId=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const mxToday=()=>new Date().toISOString().slice(0,10);
const mxDate=s=>s?new Date(s).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}):"";
const mxTouch=m=>{m.upd=new Date().toISOString();save()};
const mxDocSide=(ag,side)=>K[AG[ag].k].flip?(side==="B"?"S":"B"):side;
const mxDocAg=(m,x)=>Object.assign({},AG[x.ag],{sid:x.sid,mid:m.id});
function mxNew(f){
  const m={id:mxId("m"),name:f.name||"Untitled matter",type:f.type||"general",side:f.side||"S",client:f.client||"",cp:f.cp||"",notes:"",docs:[],reviews:[],rounds:[{n:1,date:mxToday(),items:[]}],check:[],upd:new Date().toISOString()};
  if(m.type==="carveout") m.check=SEP_CHECK.map(([label,ag])=>({label,ag,done:false,owner:"",note:""}));
  mxAll().unshift(m); save(); return m;
}
function mxAddDoc(m,ag){
  const x={id:mxId("d"),ag,label:AG[ag].n}; x.sid="md-"+x.id;
  const side=mxDocSide(ag,m.side), d=docState(x.sid), other=side==="B"?"S":"B";
  d.side=side; d.preset=prof().preset||"strong"; d.parties[side].n=m.client; if(!K[AG[ag].k].noCp) d.parties[other].n=m.cp;
  m.docs.push(x); mxTouch(m); return x;
}
const mxOpenIssues=m=>{const r=m.rounds[m.rounds.length-1];return r?r.items.filter(i=>i.status==="open").length:0};

/* ---------- reviews kept with a matter ---------- */
function mxSaveReview(m){
  if(!RV) return;
  RV.mid=m.id; saveRV();
  const e=m.reviews.find(r=>r.id===RV.id);
  if(e){e.name=RV.name;e.date=new Date().toISOString()} else m.reviews.push({id:RV.id,name:RV.name,date:new Date().toISOString(),side:RV.side,names:RV.names});
  mxTouch(m);
}
function mxAttachPending(){if(MX_PENDING&&RV){const m=mxGet(MX_PENDING);MX_PENDING=null;if(m){mxSaveReview(m);toast("Review saved to "+m.name)}}}
function mxSyncReview(){
  if(!RV||!RV.mid) return; const m=mxGet(RV.mid); if(!m) return;
  IDB.put("rvjson:"+RV.id,JSON.stringify(RV));
  const e=m.reviews.find(r=>r.id===RV.id); if(e){e.name=RV.name;e.date=new Date().toISOString()}
}
async function mxOpenReview(m,id){
  if(RV&&RV.id!==id&&RV.mid) IDB.put("rvjson:"+RV.id,JSON.stringify(RV));
  const j=await IDB.get("rvjson:"+id);
  if(!j){toast("This review is no longer stored in this browser.");return}
  RV=JSON.parse(j); RV.mid=m.id; RVBIN=RV.kind==="docx"?await IDB.get(RV.id):null; saveRV();
  view={v:"review",tab:"agreements",q:""}; RVSHOWLANDING=false; cur=null; sel=null; render();
}
function mxImportReview(m){
  if(!RV) return 0;
  const r=m.rounds[m.rounds.length-1], have=new Set(r.items.map(i=>i.ref+"|"+i.issue)); let n=0;
  const add=it=>{if(have.has(it.ref+"|"+it.issue))return;have.add(it.ref+"|"+it.issue);r.items.push(Object.assign({id:mxId("i"),status:"open"},it));n++};
  incoming().forEach(it=>add({ref:clauseRef(it.clause),by:"them",
    issue:it.commentOnly?(it.anchorText?"Comment on: “"+normP(it.anchorText).slice(0,200)+"”":"Comment"):[it.del?"Deleted: “"+normP(it.del)+"”":"",it.ins?"Inserted: “"+normP(it.ins)+"”":""].filter(Boolean).join(" "),
    theirs:it.comments.map(c=>c.text).join(" "),ours:""}));
  RV.clauses.filter(c=>c.cur||c.cmt).forEach(c=>add({ref:clauseRef(c),by:"us",issue:c.src?"We propose: "+c.src:"Comment",theirs:"",ours:c.cmt||""}));
  mxTouch(m); return n;
}

/* ---------- pages ---------- */
function mattersHTML(){
  const ms=mxAll();
  return `<section class="hero wrap mx-hero"><div class="hero-in"><p class="kicker">Matters</p><h1>Every deal in one place.</h1>
   <p class="lede">Keep the drafts, reviews, issues lists and notes for a transaction or contract negotiation together, and check the documents against each other. Carve-out matters also come with a separation checklist.</p></div></section>
  <div class="wrap mx"><section class="cat"><h2><span>New matter</span></h2>
   <div class="mx-new">
    <label><span>Matter name</span><input id="mxn-name" placeholder="For example, Project Atlas or Acme supply contract"></label>
    <label><span>Type</span><select id="mxn-type"><option value="general">General</option><option value="carveout">Carve-out or separation</option></select></label>
    <label><span>We act for the</span><select id="mxn-side"><option value="B">Buy side (buyer, customer, investor)</option><option value="S">Sell side (seller, supplier, company)</option></select></label>
    <label><span>Client</span><input id="mxn-client" placeholder="Company name"></label>
    <label><span>Counterparty</span><input id="mxn-cp" placeholder="Company name"></label>
    <button class="btn silver" data-act="mxcreate">Create matter</button></div>
   <p class="mx-hint">Matters are stored in this browser only. Check your firm's policy before recording client names. To open a matter a colleague shared with you, <label class="lnk bk-file">import the matter file<input type="file" id="mx-imp" accept=".json,application/json" hidden></label>.</p></section>
  <section class="cat"><h2><span>Your matters</span><small>${ms.length}</small></h2>
   ${ms.length?`<div class="mx-list">${ms.map(m=>{const ck=m.check.length,done=m.check.filter(c=>c.done).length;return `<button class="mx-card" data-act="mxopen" data-id="${m.id}">
    <span class="mx-k">${m.type==="carveout"?"Carve-out":"General"} · Acting for the ${m.side==="B"?"buyer":"seller"}</span>
    <b>${esc(m.name)}</b><span class="mx-p">${esc([m.client,m.cp].filter(Boolean).join(" and ")||"No parties recorded")}</span>
    <span class="mx-st"><span>${m.docs.length} draft${m.docs.length===1?"":"s"}</span><span>${m.reviews.length} review${m.reviews.length===1?"":"s"}</span><span>${mxOpenIssues(m)} open issue${mxOpenIssues(m)===1?"":"s"}</span>${ck?`<span>Checklist ${done}/${ck}</span>`:""}</span>
    <span class="mx-u">Updated ${mxDate(m.upd)}</span></button>`}).join("")}</div>`:`<p class="pg-d">No matters yet. Create one above to keep a deal's documents together.</p>`}</section></div>`;
}
function matterHTML(){
  const m=mxGet(view.mid); if(!m) return `<div class="wrap mx"><p class="pg-d">This matter no longer exists.</p></div>`;
  const tab=view.mt||"docs", ck=m.check.length, done=m.check.filter(c=>c.done).length;
  const tabs=[["docs","Documents"],["issues","Issues"+(mxOpenIssues(m)?" ("+mxOpenIssues(m)+")":"")],["check","Checklist"+(ck?" ("+done+"/"+ck+")":"")],["cx","Consistency"],["notes","Notes"]];
  return `<div class="tools wrap"><div class="tools-in">
    <button class="back" data-act="matters">‹ Matters</button>
    <div class="tt"><span class="crumb">${m.type==="carveout"?"Carve-out":"General"} matter · Acting for the ${m.side==="B"?"buyer":"seller"}</span><h1>${esc(m.name)}</h1></div>
    <div class="ctrl"><button class="btn ghost" data-act="mxshare">Share as a file</button><button class="btn ghost" data-act="mxsum">Export summary (Word)</button><button class="lnk" data-act="mxdel">Delete matter</button></div></div></div>
  <div class="tabs wrap"><div class="tabs-in">${tabs.map(([k,l])=>`<button data-act="mxtab" data-t="${k}" class="${tab===k?"on":""}">${esc(l)}</button>`).join("")}</div></div>
  <div class="wrap mx">${tab==="docs"?mxDocsHTML(m):tab==="issues"?mxIssuesHTML(m):tab==="check"?mxCheckHTML(m):tab==="cx"?mxCxHTML(m):mxNotesHTML(m)}</div>`;
}
function mxAgOptions(){
  const out=[];(function walk(nodes,trail){nodes.forEach(n=>{if(n.id)out.push(`<option value="${n.id}">${esc(trail.slice(-1)[0]+": "+n.n)}</option>`);else walk(n.k,trail.concat(n.n))})})(TREE,[]);return out.join("");
}
function mxDocsHTML(m){
  const rows=m.docs.map(x=>{const a=mxDocAg(m,x),bm=build(a),s=stats(bm),pg=dealProgress(bm);return `<tr><td><button class="lnk" data-act="mxdoc" data-id="${x.id}">${esc(x.label)}</button>${x.label!==AG[x.ag].n?`<small>${esc(AG[x.ag].n)}</small>`:""}</td><td>${esc(a.p[bm.side==="B"?0:1])}</td><td><span class="mk r${s.band}"><i></i>${RISK[s.band]}</span></td><td>${pg.done} of ${pg.total}</td><td class="mx-act"><button class="lnk" data-act="mxdoc" data-id="${x.id}">Open</button><button class="lnk" data-act="mxdocdel" data-id="${x.id}">Remove</button></td></tr>`}).join("");
  const rv=m.reviews.map(r=>`<tr><td><button class="lnk" data-act="mxrv" data-id="${r.id}">${esc(r.name)}</button>${RV&&RV.id===r.id?`<small>Open in Review a draft</small>`:""}</td><td>${esc(r.names?(r.side==="B"?r.names[0]:r.names[1]):"")}</td><td>${mxDate(r.date)}</td><td class="mx-act"><button class="lnk" data-act="mxrv" data-id="${r.id}">Open</button><button class="lnk" data-act="mxrvdel" data-id="${r.id}">Remove</button></td></tr>`).join("");
  const canSave=RV&&!m.reviews.find(r=>r.id===RV.id);
  return `<section class="cat"><h2><span>Drafts</span><small>${m.docs.length}</small></h2>
   ${m.docs.length?`<div class="tw dark"><table class="itbl mxt"><thead><tr><th>Document</th><th>Acting for</th><th>Overall risk</th><th>Deal details</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`:`<p class="pg-d">No drafts yet.</p>`}
   <div class="mx-add"><select id="mx-ag" aria-label="Agreement to add">${mxAgOptions()}</select><button class="btn silver" data-act="mxadddoc">Start a draft</button></div>
   <p class="mx-hint">Each draft in a matter is a separate copy, starting from your side with the client and counterparty names filled in.</p></section>
  <section class="cat"><h2><span>Reviews</span><small>${m.reviews.length}</small></h2>
   ${m.reviews.length?`<div class="tw dark"><table class="itbl mxt"><thead><tr><th>Document</th><th>Acting for</th><th>Last saved</th><th></th></tr></thead><tbody>${rv}</tbody></table></div>`:`<p class="pg-d">No reviews yet.</p>`}
   <div class="mx-add">${canSave?`<button class="btn ghost" data-act="mxrvsave">Save the open review (${esc(RV.name)}) to this matter</button>`:""}<button class="btn silver" data-act="mxrvnew">Review a new draft for this matter</button></div></section>`;
}
function mxIssuesHTML(m){
  const ri=Math.min(view.mr==null?m.rounds.length-1:view.mr,m.rounds.length-1), r=m.rounds[ri], last=ri===m.rounds.length-1;
  const cnt=k=>r.items.filter(i=>i.status===k).length;
  const ta=(i,f,v,ph)=>`<textarea data-mi="${ri}:${i}:${f}" rows="3" placeholder="${ph}">${esc(v||"")}</textarea>`;
  return `<section class="cat"><div class="mx-rounds">${m.rounds.map((x,i)=>`<button data-act="mxround" data-i="${i}" class="${i===ri?"on":""}">Round ${x.n}<small>${mxDate(x.date)}</small></button>`).join("")}<button class="lnk" data-act="mxnewround">+ New round</button></div>
   <div class="mx-chips">${MX_STATUS.map(([k,l])=>`<span class="mx-chip s-${k}"><b>${cnt(k)}</b> ${l}</span>`).join("")}
    <span class="mx-sp"></span>${last&&RV?`<button class="btn ghost" data-act="mximport">Import from the open review</button>`:""}<button class="btn ghost" data-act="mxround-x">Export round (Word)</button></div>
   ${r.items.length?`<div class="tw dark"><table class="itbl mxi"><thead><tr><th>No.</th><th>Clause</th><th>Issue</th><th>Raised by</th><th>Their position</th><th>Our response</th><th>Status</th><th></th></tr></thead><tbody>
    ${r.items.map((it,i)=>`<tr class="s-${it.status}"><td>${i+1}</td><td><input data-mi="${ri}:${i}:ref" value="${esc(it.ref||"")}" placeholder="Clause"></td><td>${ta(i,"issue",it.issue,"The point")}</td>
     <td><select data-mi="${ri}:${i}:by"><option value="them"${it.by==="them"?" selected":""}>${esc(m.cp||"Counterparty")}</option><option value="us"${it.by==="us"?" selected":""}>Us</option></select></td>
     <td>${ta(i,"theirs",it.theirs,"Their position or comment")}</td><td>${ta(i,"ours",it.ours,"Our response")}</td>
     <td><select data-mi="${ri}:${i}:status" class="mx-ss">${MX_STATUS.map(([k,l])=>`<option value="${k}"${it.status===k?" selected":""}>${l}</option>`).join("")}</select></td>
     <td><button class="lnk" data-act="mxitemdel" data-r="${ri}" data-i="${i}" aria-label="Delete issue ${i+1}">×</button></td></tr>`).join("")}</tbody></table></div>`:`<p class="pg-d">No issues in this round yet. Add one, or import the changes and comments from the open review.</p>`}
   <div class="mx-add"><button class="btn silver" data-act="mxitemadd" data-r="${ri}">Add issue</button></div>
   <p class="mx-hint">A new round carries forward every open issue, with the responses so far. Agreed and conceded points stay in the round where they closed.</p></section>`;
}
function mxCheckHTML(m){
  return `<section class="cat"><div class="tw dark"><table class="itbl mxc"><thead><tr><th></th><th>Item</th><th>Document</th><th>Owner</th><th>Note</th><th></th></tr></thead><tbody>
   ${m.check.map((c,i)=>{const dd=c.ag&&m.docs.find(x=>x.ag===c.ag);return `<tr class="${c.done?"done":""}"><td><input type="checkbox" data-mc="${i}:done" ${c.done?"checked":""} aria-label="Done"></td><td>${esc(c.label)}</td>
    <td>${c.ag&&AG[c.ag]?(dd?`<button class="lnk" data-act="mxdoc" data-id="${dd.id}">Open draft</button>`:`<button class="lnk" data-act="mxckdoc" data-i="${i}">Start ${esc(AG[c.ag].n)}</button>`):""}</td>
    <td><input data-mc="${i}:owner" value="${esc(c.owner)}" placeholder="Who"></td><td><input data-mc="${i}:note" value="${esc(c.note)}" placeholder="Optional"></td>
    <td><button class="lnk" data-act="mxckdel" data-i="${i}" aria-label="Remove item">×</button></td></tr>`}).join("")}
   </tbody></table></div>
   <div class="mx-add"><input id="mx-ck" placeholder="Add a checklist item"><button class="btn silver" data-act="mxckadd">Add</button>${m.type==="carveout"||m.check.length?"":`<button class="btn ghost" data-act="mxckseed">Add the separation checklist</button>`}</div></section>`;
}
function mxNotesHTML(m){
  return `<section class="cat"><div class="mx-meta">
   <label><span>Matter name</span><input data-mx="name" value="${esc(m.name)}"></label>
   <label><span>Client</span><input data-mx="client" value="${esc(m.client)}"></label>
   <label><span>Counterparty</span><input data-mx="cp" value="${esc(m.cp)}"></label></div>
   <label class="mx-notes"><span>Notes</span><textarea data-mx="notes" rows="14" placeholder="Deal terms, people, timetable, open questions">${esc(m.notes)}</textarea></label>
   <p class="mx-hint">Notes save as you type. Changing the client or counterparty here does not change drafts already started.</p></section>`;
}

/* ---------- Word exports ---------- */
const mxStatusLabel=s=>(MX_STATUS.find(x=>x[0]===s)||["",""])[1];
function mxRoundBlocks(m,r){
  return [{p:"Issues List",style:"Title"},{p:m.name+" · Round "+r.n,align:"center",bold:true},{p:"Prepared for the "+(m.side==="B"?"buyer":"seller")+(m.client?" ("+m.client+")":"")+" on "+mxDate(new Date().toISOString())+".",align:"center",italic:true},
   r.items.length?{tbl:{cols:["No.","Clause","Issue","Raised by","Their position","Our response","Status"],w:[5,13,24,10,19,19,10],rows:r.items.map((it,i)=>[String(i+1),it.ref||"",it.issue||"",it.by==="us"?"Us":(m.cp||"Counterparty"),it.theirs||"",it.ours||"",mxStatusLabel(it.status)])}}:{p:"No issues recorded."}];
}
function mxSummaryBlocks(m){
  const r=m.rounds[m.rounds.length-1], open=r.items.filter(i=>i.status==="open");
  const B=[{p:m.name,style:"Title"},{p:"Matter summary · "+mxDate(new Date().toISOString()),align:"center",italic:true},
   {tbl:{cols:["Item","Details"],w:[30,70],rows:[["Type",m.type==="carveout"?"Carve-out":"General"],["Acting for","The "+(m.side==="B"?"buyer":"seller")+(m.client?" ("+m.client+")":"")],["Counterparty",m.cp||"[●]"]]}},
   {p:"Documents",style:"Label"}];
  if(m.docs.length) B.push({tbl:{cols:["Document","Agreement","Overall risk","Deal details"],w:[34,34,16,16],rows:m.docs.map(x=>{const bm=build(mxDocAg(m,x)),pg=dealProgress(bm);return [x.label,AG[x.ag].n,RISK[stats(bm).band],pg.done+" of "+pg.total]})}}); else B.push({p:"No drafts."});
  if(m.reviews.length) B.push({p:"Reviews",style:"Label"},{tbl:{cols:["Document","Last saved"],w:[70,30],rows:m.reviews.map(x=>[x.name,mxDate(x.date)])}});
  B.push({p:"Open issues (round "+r.n+")",style:"Label"});
  B.push(open.length?{tbl:{cols:["No.","Clause","Issue","Our response"],w:[6,18,44,32],rows:open.map((it,i)=>[String(i+1),it.ref||"",it.issue||"",it.ours||""])}}:{p:"No open issues."});
  if(m.check.length) B.push({p:"Checklist",style:"Label"},{tbl:{cols:["Item","Owner","Status","Note"],w:[46,16,12,26],rows:m.check.map(c=>[c.label,c.owner,c.done?"Done":"Open",c.note])}});
  if(m.notes.trim()) {B.push({p:"Notes",style:"Label"}); m.notes.split(/\n+/).filter(Boolean).forEach(l=>B.push({p:l}))}
  return B;
}

/* ---------- events ---------- */
function mxClick(t){
  const act=t.dataset.act, m=view.mid&&mxGet(view.mid);
  switch(act){
    case "matters": view={v:"matters",tab:view.tab,q:""}; cur=null; sel=null; modal.hidden=true; render(); return true;
    case "mxopen": view={v:"matter",mid:t.dataset.id,mt:view.v==="matter"?view.mt:"docs",tab:view.tab,q:""}; cur=null; sel=null; modal.hidden=true; render(); return true;
    case "mxcreate": {const g=id=>document.getElementById(id).value.trim(); const n=mxNew({name:g("mxn-name"),type:g("mxn-type"),side:g("mxn-side"),client:g("mxn-client"),cp:g("mxn-cp")}); view={v:"matter",mid:n.id,mt:n.type==="carveout"?"check":"docs",tab:view.tab,q:""}; render(); toast("Matter created"); return true}
    case "mxtab": view.mt=t.dataset.t; render(true); return true;
    case "mxdel": if(t.dataset.confirm!=="1"){t.dataset.confirm="1";t.textContent="Click again to delete this matter and its drafts";return true}
      m.docs.forEach(x=>delete ST.docs[x.sid]); m.reviews.forEach(r=>IDB.del("rvjson:"+r.id)); if(RV&&RV.mid===m.id){delete RV.mid;saveRV()}
      ST.matters=mxAll().filter(x=>x!==m); save(); view={v:"matters",tab:view.tab,q:""}; render(); toast("Matter deleted"); return true;
    case "mxadddoc": {const ag=document.getElementById("mx-ag").value; const x=mxAddDoc(m,ag); openAg(ag,null,x.sid,m.id); toast("Drafting for the "+AG[ag].p[docState(x.sid).side==="B"?0:1]); return true}
    case "mxckdoc": {const c=m.check[+t.dataset.i]; const x=mxAddDoc(m,c.ag); openAg(c.ag,null,x.sid,m.id); return true}
    case "mxdoc": {const x=m.docs.find(d=>d.id===t.dataset.id); if(x) openAg(x.ag,null,x.sid,m.id); return true}
    case "mxdocdel": if(t.dataset.confirm!=="1"){t.dataset.confirm="1";t.textContent="Click again to remove";return true}
      {const x=m.docs.find(d=>d.id===t.dataset.id); delete ST.docs[x.sid]; m.docs=m.docs.filter(d=>d!==x); mxTouch(m); render(true); return true}
    case "mxrv": if(RV&&!RV.mid&&RV.id!==t.dataset.id&&t.dataset.confirm!=="1"){t.dataset.confirm="1";t.textContent="This replaces the unsaved review that is open. Click again";return true}
      mxOpenReview(m,t.dataset.id); return true;
    case "mxrvdel": if(t.dataset.confirm!=="1"){t.dataset.confirm="1";t.textContent="Click again to remove";return true}
      {const id=t.dataset.id; IDB.del("rvjson:"+id); if(RV&&RV.id===id){delete RV.mid;saveRV()}else IDB.del(id); m.reviews=m.reviews.filter(r=>r.id!==id); mxTouch(m); render(true); return true}
    case "mxrvsave": mxSaveReview(m); IDB.put("rvjson:"+RV.id,JSON.stringify(RV)); render(true); toast("Review saved to the matter"); return true;
    case "mxrvnew": MX_PENDING=m.id; view={v:"review",tab:view.tab,q:""}; RVSHOWLANDING=true; cur=null; sel=null; render(); return true;
    case "mxround": view.mr=+t.dataset.i; render(true); return true;
    case "mxnewround": {const p=m.rounds[m.rounds.length-1]; m.rounds.push({n:p.n+1,date:mxToday(),items:p.items.filter(i=>i.status==="open").map(i=>Object.assign({},i,{id:mxId("i")}))}); view.mr=m.rounds.length-1; mxTouch(m); render(true); toast("Round "+(p.n+1)+" started"); return true}
    case "mximport": {const n=mxImportReview(m); render(true); toast(n?n+" issue"+(n===1?"":"s")+" imported":"Nothing new to import"); return true}
    case "mxitemadd": m.rounds[+t.dataset.r].items.push({id:mxId("i"),ref:"",issue:"",by:"them",theirs:"",ours:"",status:"open"}); mxTouch(m); render(true); {const x=document.querySelectorAll(".mxi tbody tr");const l=x[x.length-1];const i=l&&l.querySelector("input");i&&i.focus()} return true;
    case "mxitemdel": m.rounds[+t.dataset.r].items.splice(+t.dataset.i,1); mxTouch(m); render(true); return true;
    case "mxround-x": {const r=m.rounds[Math.min(view.mr==null?m.rounds.length-1:view.mr,m.rounds.length-1)]; buildDocx(mxRoundBlocks(m,r),{title:"Issues list"}).then(b=>saveFile(safeName(m.name+" issues list round "+r.n)+".docx",b)); return true}
    case "mxcx-x": buildDocx(mxCxBlocks(m),{title:"Consistency report"}).then(b=>saveFile(safeName(m.name+" consistency report")+".docx",b)); return true;
    case "mxcxfix": mxCxFix(m,t.dataset.f); render(true); toast(t.dataset.f==="side"?"Drafts switched to the matter's side":"Names updated in every draft"); return true;
    case "mxsum": buildDocx(mxSummaryBlocks(m),{title:m.name}).then(b=>saveFile(safeName(m.name+" matter summary")+".docx",b)); return true;
    case "mxckadd": {const v=document.getElementById("mx-ck").value.trim(); if(!v) return true; m.check.push({label:v,ag:"",done:false,owner:"",note:""}); mxTouch(m); render(true); return true}
    case "mxckdel": m.check.splice(+t.dataset.i,1); mxTouch(m); render(true); return true;
    case "mxckseed": m.check=m.check.concat(SEP_CHECK.map(([label,ag])=>({label,ag,done:false,owner:"",note:""}))); mxTouch(m); render(true); return true;
  }
  return false;
}
function mxInput(e){
  const ds=e.target.dataset||{}, m=view.mid&&mxGet(view.mid); if(!m) return false;
  if(ds.mx){m[ds.mx]=e.target.value; mxTouch(m); return true}
  if(ds.mi&&e.target.tagName!=="SELECT"){const [r,i,f]=ds.mi.split(":"); m.rounds[+r].items[+i][f]=e.target.value; mxTouch(m); return true}
  if(ds.mc&&e.target.type!=="checkbox"){const [i,f]=ds.mc.split(":"); m.check[+i][f]=e.target.value; mxTouch(m); return true}
  return false;
}
function mxChange(e){
  const ds=e.target.dataset||{}, m=view.mid&&mxGet(view.mid); if(!m) return false;
  if(ds.mi&&e.target.tagName==="SELECT"){const [r,i,f]=ds.mi.split(":"); m.rounds[+r].items[+i][f]=e.target.value; mxTouch(m); render(true); return true}
  if(ds.mc&&e.target.type==="checkbox"){const [i]=ds.mc.split(":"); m.check[+i].done=e.target.checked; mxTouch(m); render(true); return true}
  return false;
}

/* ============================================================
   CROSS-DOCUMENT CONSISTENCY: parties, shared defined terms,
   deal facts, documents referred to, and blanks, across every
   draft and saved review in a matter.
   ============================================================ */
const CX_TERMS=["Completion","Business Day","Effective Date","Purchaser","Seller Group","Target Group","Intellectual Property Rights","Confidential Information","Territory"];
const CX_RV={};
const cxNormName=s=>String(s||"").toLowerCase().replace(/\b(limited|ltd|plc|llp|inc|gmbh|bv|b\.v|sa|s\.a)\b\.?/g,"").replace(/[^a-z0-9]+/g," ").trim();
const cxCmp=s=>s.replace(/\b(clause|Schedule|paragraph|Part) \d+(\.\d+)*/g,"$1 #").replace(/the Main Agreement/g,"the SPA").toLowerCase();
const cxNorm=s=>String(s||"").replace(/\s+/g," ").replace(/[“”]/g,'"').replace(/[‘’]/g,"'").trim().replace(/[;.]$/,"");
const cxGeneric=n=>!n||/^(buyer|seller|customer|supplier|recipient|provider|party [ab12])$/i.test(n.trim());
function cxLoadReviews(m){
  const need=m.reviews.filter(r=>!(r.id in CX_RV)); if(!need.length) return false;
  need.forEach(r=>{CX_RV[r.id]=null; IDB.get("rvjson:"+r.id).then(j=>{try{CX_RV[r.id]=j?JSON.parse(j):false}catch(e){CX_RV[r.id]=false} if(view.v==="matter"&&view.mt==="cx")render(true)})});
  return true;
}
function cxSources(m){
  const out=[];
  m.docs.filter(x=>AG[x.ag]).forEach(x=>{
    const a=mxDocAg(m,x), bm=build(a), cx={a,nums:bm.nums,fill:bm.d.fill};
    const role=w=>"the "+a.p[w==="B"?0:1], nm=w=>bm.d.parties[w].n;
    const unrole=s=>["B","S"].reduce((t,w)=>t.split(role(w)).join(nm(w)||"[party]"),s);
    const defs={}; Object.keys(bm.defs).forEach(k=>{const raw=cxNorm(tok(defBody(k,bm.defs[k]),cx,false));defs[k]={raw,cmp:cxNorm(unrole(raw))}});
    out.push({id:x.id,label:x.label,src:"draft",x,k:a.k,a,t:docText(bm),defs,date:(bm.d.fill||{})["@date"]||"",
      parties:["B","S"].map(w=>({w,role:a.p[w==="B"?0:1],n:nm(w),no:bm.d.parties[w].no,client:w===bm.side})),
      side:bm.side,expSide:mxDocSide(x.ag,m.side),blanks:dealProgress(bm)});
  });
  m.reviews.forEach(r=>{const R=CX_RV[r.id]; if(!R) return;
    const t=(R.paras||[]).map(p=>p.t||"").join("\n"), defs={};
    (R.paras||[]).forEach(p=>{const mm=(p.t||"").match(/^(?:\d+(?:\.\d+)*\s+)?[“"]([^”"]{2,60})[”"]\s+((?:means|has the meaning)\b.*)$/);if(mm&&!defs[mm[1]]){const raw=cxNorm(mm[2]);defs[mm[1]]={raw,cmp:raw}}});
    const names=R.names||r.names||[];
    out.push({id:r.id,label:r.name,src:"review",k:/share purchase|asset purchase|business transfer/i.test(r.name+" "+t.slice(0,400))?"spa":"",t,defs,date:"",
      parties:[0,1].map(i=>({w:i?"S":"B",role:i?"Seller side":"Buyer side",n:cxGeneric(names[i])?"":names[i],no:"",client:(R.side||r.side)===(i?"S":"B")})),blanks:null});
  });
  return out;
}
function consistency(m){
  const S=cxSources(m), F=[];
  const add=(sev,area,title,detail,rows,fix)=>F.push({sev,area,title,detail,rows:rows||[],fix});
  /* parties */
  const clientRows=[],cpRows=[],blankRows=[],sideRows=[];
  S.forEach(s=>s.parties.forEach(p=>{
    if(s.src==="draft"&&p.client===false&&K[s.k].noCp) return;
    const want=p.client?m.client:m.cp;
    if(!p.n){if(s.src==="draft")blankRows.push([s.label,p.role+(p.client?" (your client)":"")]);return}
    if(want&&p.n!==want)(p.client?clientRows:cpRows).push([s.label,p.role+": "+p.n+(cxNormName(p.n)===cxNormName(want)?"  (spelling or suffix differs)":"")]);
  }));
  if(clientRows.length) add(clientRows.some(r=>!/spelling/.test(r[1]))?"high":"check","Parties","Your client is named differently","The matter records the client as “"+m.client+"”.",clientRows,"names");
  if(cpRows.length) add(cpRows.some(r=>!/spelling/.test(r[1]))?"high":"check","Parties","The counterparty is named differently","The matter records the counterparty as “"+m.cp+"”.",cpRows,"names");
  {const by={}; S.forEach(s=>s.parties.forEach(p=>{if(!p.n||!p.no)return;const k=cxNormName(p.n);(by[k]=by[k]||[]).push([s.label,p.n+": "+p.no])}));
   Object.values(by).forEach(rows=>{if(new Set(rows.map(r=>r[1].split(": ").pop().replace(/\s/g,""))).size>1) add("high","Parties","Different company numbers for the same company","",rows)});}
  S.filter(s=>s.src==="draft"&&s.side!==s.expSide).forEach(s=>sideRows.push([s.label,"Drafted for the "+s.a.p[s.side==="B"?0:1]+"; the matter suggests the "+s.a.p[s.expSide==="B"?0:1]]));
  if(sideRows.length) add("high","Parties","A draft may be on the wrong side","Each draft's risk ratings depend on the side chosen.",sideRows,"side");
  if(blankRows.length) add("info","Parties","Party names not filled in","",blankRows,"names");
  /* shared defined terms */
  const terms={}; S.forEach(s=>Object.keys(s.defs).forEach(t=>(terms[t]=terms[t]||[]).push(s)));
  Object.keys(terms).sort((a,b)=>(CX_TERMS.includes(b)-CX_TERMS.includes(a))||a.localeCompare(b)).forEach(t=>{
    const ss=terms[t]; if(ss.length<2) return; if(t==="SPA"||t==="Main Agreement") return; const vals=new Set(ss.map(s=>cxCmp(s.defs[t].cmp))); if(vals.size<2) return;
    add(CX_TERMS.includes(t)?"check":"info","Defined terms","“"+t+"” is defined differently",CX_TERMS.includes(t)?"A deal-wide term. Unless the difference is deliberate, align the definitions.":"May be deliberate, as each document has its own scope.",ss.map(s=>[s.label,s.defs[t].raw]));
  });
  /* deal facts */
  const fact=(title,re,sev,detail)=>{const rows=[];S.forEach(s=>{const mm=s.t.match(re);if(mm)rows.push([s.label,cxNorm(mm[1])])});const vals=new Set(rows.map(r=>r[1].toLowerCase()).filter(v=>!/^\[●\]$/.test(v)));if(rows.length>1&&vals.size>1)add(sev,"Deal facts",title,detail,rows);return rows};
  fact("The main agreement's date differs",/[“"](?:SPA|Main Agreement)[”"]\s+means\b[^\n]*?\bdated\s+(.+?)\s+between/,"high","Every document that refers to the main agreement should give the same date.");
  fact("Governing law differs",/governed by(?: and construed in accordance with)? the laws? of ([^.,;\n]+)/i,"info","Expected for local transfer agreements. Check the rest are intended.");
  {const rows=S.filter(s=>s.date).map(s=>[s.label,s.date]); if(new Set(rows.map(r=>r[1])).size>1) add("info","Deal facts","Documents are dated differently","Fine where documents are signed on different days, for example at signing and at completion.",rows)}
  /* documents referred to */
  const has=k=>S.some(s=>s.k===k||(k==="spa"&&s.k==="apa"));
  const refs=[["the SPA|the Main Agreement","spa","The main sale agreement is referred to but is not in this matter"],["Transitional Services Agreement","tsa","A transitional services agreement is referred to but is not in this matter"]];
  refs.forEach(([re,k,title])=>{const by=S.filter(s=>s.k!==k&&new RegExp(re).test(s.t)); if(by.length&&!has(k)) add("check","Documents",title,"Add the draft, or save a review of the other side's draft, so it can be checked too.",by.map(s=>[s.label,"Refers to it"]))});
  /* blanks */
  const bl=S.filter(s=>s.blanks&&s.blanks.done<s.blanks.total).map(s=>[s.label,(s.blanks.total-s.blanks.done)+" of "+s.blanks.total+" blanks still open"]);
  if(bl.length) add("info","Blanks","Blanks still to fill","Use Deal details in each draft.",bl);
  const ord={high:0,check:1,info:2}; F.sort((a,b)=>ord[a.sev]-ord[b.sev]);
  return {S,F};
}
const CX_SEV={high:"Fix",check:"Check",info:"Note"};
function mxCxHTML(m){
  const loading=cxLoadReviews(m)||m.reviews.some(r=>CX_RV[r.id]===null);
  const {S,F}=consistency(m), n=k=>F.filter(f=>f.sev===k).length;
  if(S.length<2&&!loading) return `<section class="cat"><p class="pg-d">Add at least two drafts or saved reviews to this matter to check them against each other.</p></section>`;
  return `<section class="cat"><p class="pg-d">Checks ${S.length} document${S.length===1?"":"s"} against each other: party names and numbers, deal-wide defined terms, the main agreement's date, governing law, documents referred to but missing, and blanks.${loading?" Loading saved reviews…":""}</p>
   <div class="mx-chips">${["high","check","info"].map(k=>`<span class="mx-chip cx-${k}"><b>${n(k)}</b> ${CX_SEV[k]}</span>`).join("")}<span class="mx-sp"></span><button class="btn ghost" data-act="mxcx-x">Export report (Word)</button></div>
   ${F.length?F.map((f,i)=>`<div class="cx-f cx-${f.sev}"><div class="cx-h"><span class="cx-s">${CX_SEV[f.sev]}</span><span class="cx-a">${esc(f.area)}</span><b>${esc(f.title)}</b>${f.fix==="names"&&(m.client||m.cp)?`<button class="lnk" data-act="mxcxfix" data-f="names">Use the matter's names in every draft</button>`:f.fix==="side"?`<button class="lnk" data-act="mxcxfix" data-f="side">Switch these drafts to the matter's side</button>`:""}</div>
     ${f.detail?`<p class="cx-d">${esc(f.detail)}</p>`:""}${f.rows.length?`<div class="cx-rows">${f.rows.map(r=>`<div><span>${esc(r[0])}</span><span>${hl(r[1])}</span></div>`).join("")}</div>`:""}</div>`).join(""):`<p class="pg-d">No inconsistencies found.</p>`}
   <p class="mx-hint">Defined terms are compared after party labels are replaced with the names entered, so “the Seller” in one document and “the Provider” in another match when they are the same company.</p></section>`;
}
function mxCxBlocks(m){
  const {S,F}=consistency(m);
  const B=[{p:"Consistency Report",style:"Title"},{p:m.name,align:"center",bold:true},{p:"Checked "+mxDate(new Date().toISOString())+" across "+S.length+" documents: "+S.map(s=>s.label).join(", ")+".",align:"center",italic:true}];
  if(!F.length) B.push({p:"No inconsistencies found."});
  F.forEach((f,i)=>{B.push({p:(i+1)+". "+CX_SEV[f.sev]+": "+f.title,style:"Label"}); if(f.detail)B.push({p:f.detail}); if(f.rows.length)B.push({tbl:{cols:["Document","Detail"],w:[30,70],rows:f.rows}})});
  return B;
}
function mxCxFix(m,what){
  m.docs.forEach(x=>{if(!AG[x.ag])return; const d=docState(x.sid), exp=mxDocSide(x.ag,m.side);
    if(what==="side"&&d.side!==exp){d.side=exp;d.picks={B:{},S:{}}}
    if(what==="names"){const o=d.side==="B"?"S":"B"; if(m.client)d.parties[d.side].n=m.client; if(m.cp&&!K[AG[x.ag].k].noCp)d.parties[o].n=m.cp}});
  mxTouch(m);
}
