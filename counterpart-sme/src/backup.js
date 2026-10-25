/* ============================================================
   BACKUP AND SHARING: download everything (or one matter) as a
   file, and restore or import it in any browser.
   ============================================================ */
const bkB64=buf=>{const u=new Uint8Array(buf);let s="";for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s)};
const bkUnB64=s=>{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u.buffer};
const bkStamp=()=>new Date().toISOString().slice(0,10);
async function bkPackReviews(ids){
  const out={};
  for(const id of ids){const json=await IDB.get("rvjson:"+id),bin=await IDB.get(id);if(json||bin)out[id]={json,bin:bin?bkB64(bin):null}}
  return out;
}
async function bkUnpackReviews(revs,rename){
  for(const id of Object.keys(revs||{})){const r=revs[id],nid=rename?rename(id):id;
    if(r.json){const j=JSON.parse(r.json);j.id=nid;await IDB.put("rvjson:"+nid,JSON.stringify(j))}
    if(r.bin) await IDB.put(nid,bkUnB64(r.bin));}
}
async function bkBackup(){
  const ids=new Set(); mxAll().forEach(m=>m.reviews.forEach(r=>ids.add(r.id)));
  if(RV){ids.add(RV.id); await IDB.put("rvjson:"+RV.id,JSON.stringify(RV)); if(RVBIN) await IDB.put(RV.id,RVBIN)}
  const data={app:"Counterpart",kind:"backup",v:1,at:new Date().toISOString(),st:ST,current:RV?RV.id:null,reviews:await bkPackReviews([...ids])};
  return saveFile("Counterpart backup "+bkStamp()+".json",new Blob([JSON.stringify(data)],{type:"application/json"}));
}
async function bkExportMatter(m){
  const docs={}; m.docs.forEach(x=>{if(ST.docs[x.sid])docs[x.sid]=ST.docs[x.sid]});
  if(RV&&RV.mid===m.id) await IDB.put("rvjson:"+RV.id,JSON.stringify(RV));
  const data={app:"Counterpart",kind:"matter",v:1,at:new Date().toISOString(),from:prof().name||"",matter:m,docs,reviews:await bkPackReviews(m.reviews.map(r=>r.id))};
  return saveFile(safeName(m.name)+" (Counterpart matter).json",new Blob([JSON.stringify(data)],{type:"application/json"}));
}
async function bkRestore(data){
  ST=Object.assign({docs:{},pe:false},data.st||{}); save();
  await bkUnpackReviews(data.reviews);
  RV=null;RVBIN=null;
  if(data.current){const j=await IDB.get("rvjson:"+data.current);if(j){RV=JSON.parse(j);RVBIN=RV.kind==="docx"?await IDB.get(RV.id):null}}
  if(RV) saveRV(); else try{localStorage.removeItem("counterpart.review.v1")}catch(e){}
  applyMode();
}
async function bkImportMatter(data){
  const m=JSON.parse(JSON.stringify(data.matter)), map={};
  m.id=mxId("m"); if(mxAll().some(x=>x.name===m.name)) m.name+=" (imported)";
  m.docs.forEach(x=>{const old=x.sid;x.id=mxId("d");x.sid="md-"+x.id;if(data.docs&&data.docs[old])ST.docs[x.sid]=data.docs[old]});
  m.reviews.forEach(r=>{map[r.id]=mxId("r");r.id=map[r.id]});
  await bkUnpackReviews(data.reviews,id=>map[id]||id);
  m.upd=new Date().toISOString(); mxAll().unshift(m); save(); return m;
}
function bkRead(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(d.app!=="Counterpart")throw 0;res(d)}catch(e){rej(e)}};r.onerror=rej;r.readAsText(file)})}
function bkSettingsHTML(){
  return `<div class="set-sec"><h3>Your data</h3><p class="hint">Everything is kept in this browser. Download a backup to keep it safe or move it to another computer, then restore it there. Backups include client names and uploaded documents, so store them as you would the documents themselves.</p>
   <div class="bk-row"><button class="btn ghost" data-act="bkdown">Download a backup</button><label class="btn ghost bk-file">Restore from a backup<input type="file" id="bk-file" accept=".json,application/json" hidden></label></div>
   <p class="hint bk-warn" id="bk-msg"></p></div>`;
}
let BK_PENDING=null;
function bkClick(t){
  switch(t.dataset.act){
    case "bkdown": bkBackup(); return true;
    case "bkgo": {const d=BK_PENDING;BK_PENDING=null;if(!d)return true;bkRestore(d).then(()=>{modal.hidden=true;view={v:"home",tab:"agreements",q:""};cur=null;sel=null;render();toast("Backup restored")}).catch(()=>toast("The backup could not be restored."));return true}
    case "mxshare": {const m=mxGet(view.mid);if(m)bkExportMatter(m);return true}
  }
  return false;
}
function bkChange(e){
  if(e.target.id==="bk-file"&&e.target.files[0]){
    bkRead(e.target.files[0]).then(d=>{
      const msg=document.getElementById("bk-msg");
      if(d.kind==="matter"){bkImportMatter(d).then(m=>{modal.hidden=true;view={v:"matter",mid:m.id,mt:"docs",tab:view.tab,q:""};render();toast("Matter imported")});return}
      BK_PENDING=d; const n=(d.st&&d.st.matters||[]).length;
      msg.innerHTML=`This replaces everything in this browser with the backup from ${esc(new Date(d.at).toLocaleString("en-GB"))} (${n} matter${n===1?"":"s"}). <button class="lnk" data-act="bkgo">Replace and restore</button>`;
    }).catch(()=>toast("That file is not a Counterpart backup."));
    e.target.value=""; return true;
  }
  if(e.target.id==="mx-imp"&&e.target.files[0]){
    bkRead(e.target.files[0]).then(d=>{if(d.kind!=="matter")throw 0;return bkImportMatter(d)}).then(m=>{view={v:"matter",mid:m.id,mt:"docs",tab:view.tab,q:""};render();toast("Matter imported")}).catch(()=>toast("That file is not a Counterpart matter."));
    e.target.value=""; return true;
  }
  return false;
}
