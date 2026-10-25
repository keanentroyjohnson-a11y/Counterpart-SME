/* ============================================================
   WORD ENGINE
   readDocx: paragraphs with Word numbering, tracked changes and comments.
   buildDocx: a fresh document from simple paragraph and table blocks.
   redlineDocx: writes changes into the ORIGINAL file as tracked changes
   with comments, so the rest of its formatting is untouched.
   ============================================================ */
const WNS="http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const W14NS="http://schemas.microsoft.com/office/word/2010/wordml";
const W15NS="http://schemas.microsoft.com/office/word/2012/wordml";
const RELNS="http://schemas.openxmlformats.org/package/2006/relationships";
const CTNS="http://schemas.openxmlformats.org/package/2006/content-types";
const xesc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,"");
const wAttr=(el,n)=>el.getAttributeNS(WNS,n)||el.getAttribute("w:"+n)||"";
const kids=(el,n)=>Array.from(el.childNodes).filter(c=>c.nodeType===1&&c.localName===n);
const kid=(el,n)=>kids(el,n)[0]||null;
const isoNow=()=>new Date().toISOString().replace(/\.\d+Z$/,"Z");

/* ---------- numbering ---------- */
function toRoman(n){const m=[[1000,"m"],[900,"cm"],[500,"d"],[400,"cd"],[100,"c"],[90,"xc"],[50,"l"],[40,"xl"],[10,"x"],[9,"ix"],[5,"v"],[4,"iv"],[1,"i"]];let s="";m.forEach(([v,r])=>{while(n>=v){s+=r;n-=v}});return s}
function fmtNum(n,f){
  if(f==="lowerLetter")return String.fromCharCode(96+((n-1)%26+1)).repeat(Math.floor((n-1)/26)+1);
  if(f==="upperLetter")return String.fromCharCode(64+((n-1)%26+1)).repeat(Math.floor((n-1)/26)+1);
  if(f==="lowerRoman")return toRoman(n); if(f==="upperRoman")return toRoman(n).toUpperCase();
  if(f==="decimalZero")return(n<10?"0":"")+n; if(f==="none"||f==="bullet")return""; return String(n);
}
function makeNumberer(numbering,styles){
  const abs={},nums={},sty={};
  if(numbering){
    Array.from(numbering.getElementsByTagNameNS(WNS,"abstractNum")).forEach(a=>{const lv={};kids(a,"lvl").forEach(l=>{const g=(n)=>{const e=kid(l,n);return e?wAttr(e,"val"):""};lv[+wAttr(l,"ilvl")]={fmt:g("numFmt")||"decimal",text:g("lvlText"),start:+(g("start")||1)}});abs[wAttr(a,"abstractNumId")]=lv});
    Array.from(numbering.getElementsByTagNameNS(WNS,"num")).forEach(n=>{const a=kid(n,"abstractNumId");nums[wAttr(n,"numId")]=a?wAttr(a,"val"):null});
  }
  if(styles) Array.from(styles.getElementsByTagNameNS(WNS,"style")).forEach(s=>{const id=wAttr(s,"styleId"),pPr=kid(s,"pPr"),np=pPr&&kid(pPr,"numPr"),bo=kid(s,"basedOn"),nm=kid(s,"name");
    sty[id]={numId:np&&kid(np,"numId")?wAttr(kid(np,"numId"),"val"):null,ilvl:np&&kid(np,"ilvl")?+wAttr(kid(np,"ilvl"),"val"):null,based:bo?wAttr(bo,"val"):null,name:nm?wAttr(nm,"val"):id}});
  const styleNum=id=>{let d=0;while(id&&sty[id]&&d<10){if(sty[id].numId)return sty[id];id=sty[id].based;d++}return null};
  const counters={};
  return {styleName:id=>sty[id]?sty[id].name:id||"",
    label(p){
      const pPr=kid(p,"pPr"); if(!pPr) return null;
      const ps=kid(pPr,"pStyle"), sid=ps?wAttr(ps,"val"):null, np=kid(pPr,"numPr");
      let numId=null,ilvl=null;
      if(np){const a=kid(np,"numId"),b=kid(np,"ilvl");numId=a?wAttr(a,"val"):null;ilvl=b?+wAttr(b,"val"):null}
      const sn=styleNum(sid); if(!numId&&sn){numId=sn.numId} if(ilvl==null) ilvl=sn&&sn.ilvl!=null?sn.ilvl:0;
      if(!numId||numId==="0") return null;
      const aid=nums[numId]; const lv=abs[aid]; if(!lv||!lv[ilvl]) return {lvl:ilvl,text:""};
      const c=counters[aid]||(counters[aid]=[]);
      c[ilvl]=c[ilvl]==null?lv[ilvl].start:c[ilvl]+1; for(let i=ilvl+1;i<10;i++)c[i]=null;
      const text=(lv[ilvl].text||"").replace(/%(\d)/g,(m,k)=>{const L=+k-1;const v=c[L]==null?(lv[L]?lv[L].start:1):c[L];return fmtNum(v,lv[L]?lv[L].fmt:"decimal")});
      return {lvl:ilvl,text:lv[ilvl].fmt==="bullet"?"":text.trim()};
    }};
}

/* ---------- reading ---------- */
function bodyParas(doc){
  return Array.from(doc.getElementsByTagNameNS(WNS,"p")).filter(p=>{let e=p.parentNode;while(e&&e.nodeType===1){if(e.localName==="p"||e.localName==="txbxContent")return false;e=e.parentNode}return true});
}
async function readDocx(buf){
  const zip=await JSZip.loadAsync(buf);
  const xml=async p=>{const f=zip.file(p);return f?new DOMParser().parseFromString(await f.async("string"),"application/xml"):null};
  const doc=await xml("word/document.xml"); if(!doc) throw new Error("This file is not a Word document.");
  const numr=makeNumberer(await xml("word/numbering.xml"),await xml("word/styles.xml"));
  const cdoc=await xml("word/comments.xml"), cex=await xml("word/commentsExtended.xml");
  const active=new Set(), anchors={}, paras=[];
  bodyParas(doc).forEach((p,pi)=>{
    const segs=[]; let bold=null;
    const push=(t,k,meta)=>{if(!t)return;const last=segs[segs.length-1],c=[...active].join(",");
      if(last&&last.k===k&&last.a===(meta&&meta.a||"")&&last.c===c)last.t+=t;else segs.push({t,k,a:meta&&meta.a||"",d:meta&&meta.d||"",c});
      active.forEach(id=>{const A=anchors[id]||(anchors[id]={pi,t:""});if(k!=="del"||!A.t)A.t+=t})};
    const walk=(el,k,meta)=>{Array.from(el.childNodes).forEach(n=>{if(n.nodeType!==1)return;const ln=n.localName;
      if(ln==="pPr"||ln==="rPr"||ln==="txbxContent"||ln==="drawing"||ln==="pict"||ln==="instrText"||ln==="delInstrText")return;
      if(ln==="ins"||ln==="moveTo")return walk(n,"ins",{a:wAttr(n,"author"),d:wAttr(n,"date")});
      if(ln==="del"||ln==="moveFrom")return walk(n,"del",{a:wAttr(n,"author"),d:wAttr(n,"date")});
      if(ln==="commentRangeStart"){active.add(wAttr(n,"id"));return}
      if(ln==="commentRangeEnd"){const id=wAttr(n,"id");active.delete(id);if(!anchors[id])anchors[id]={pi,t:""};return}
      if(ln==="commentReference"){const id=wAttr(n,"id");if(!anchors[id])anchors[id]={pi,t:""};return}
      if(ln==="r"&&bold===null){const rp=kid(n,"rPr");bold=!!(rp&&kid(rp,"b")&&wAttr(kid(rp,"b"),"val")!=="0"&&wAttr(kid(rp,"b"),"val")!=="false")}
      if(ln==="t"||ln==="delText")return push(n.textContent,k,meta);
      if(ln==="tab"||ln==="ptab")return push(" ",k,meta);
      if(ln==="br"||ln==="cr")return push(" ",k,meta);
      if(ln==="noBreakHyphen")return push("-",k,meta);
      walk(n,k,meta);
    })};
    walk(p,"n",null);
    const cur=segs.filter(s=>s.k!=="del").map(s=>s.t).join("").replace(/\s+/g," ").trim();
    const orig=segs.filter(s=>s.k!=="ins").map(s=>s.t).join("").replace(/\s+/g," ").trim();
    const lab=numr.label(p), pPr=kid(p,"pPr"), ps=pPr&&kid(pPr,"pStyle");
    let inTbl=false;{let e=p.parentNode;while(e&&e.nodeType===1){if(e.localName==="tbl"){inTbl=true;break}e=e.parentNode}}
    paras.push({t:cur,o:orig,segs,num:lab?lab.text:"",lvl:lab?lab.lvl:null,hasNum:!!lab,style:ps?numr.styleName(wAttr(ps,"val")):"",bold:!!bold,inTbl,rev:segs.some(s=>s.k!=="n")});
  });
  /* comments and replies */
  const comments=[];
  if(cdoc){
    const byPara={};
    Array.from(cdoc.getElementsByTagNameNS(WNS,"comment")).forEach(c=>{
      const ps=kids(c,"p"), text=ps.map(p=>Array.from(p.getElementsByTagNameNS(WNS,"t")).map(t=>t.textContent).join("")).join("\n").trim();
      const last=ps[ps.length-1], pid=last?(last.getAttributeNS(W14NS,"paraId")||last.getAttribute("w14:paraId")):"";
      const o={id:wAttr(c,"id"),author:wAttr(c,"author"),date:wAttr(c,"date"),text,parent:null,done:false,anchor:anchors[wAttr(c,"id")]||null};
      comments.push(o); if(pid) byPara[pid]=o;
    });
    if(cex) Array.from(cex.getElementsByTagNameNS(W15NS,"commentEx")).forEach(e=>{const g=n=>e.getAttributeNS(W15NS,n)||e.getAttribute("w15:"+n);const o=byPara[g("paraId")];if(!o)return;const par=byPara[g("paraIdParent")];if(par)o.parent=par.id;o.done=g("done")==="1"});
  }
  return {paras,comments};
}

/* ---------- diffs ---------- */
const wtok=s=>s.match(/\s+|[A-Za-z0-9À-ɏ’'‘-]+|[^\sA-Za-z0-9]/g)||[];
function lcsOps(a,b,eq){
  const n=a.length,m=b.length;
  if(n*m>400000) return [...a.map(x=>({op:"del",v:x})),...b.map(x=>({op:"ins",v:x}))];
  const D=Array.from({length:n+1},()=>new Uint16Array(m+1));
  for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)D[i][j]=eq(a[i],b[j])?D[i+1][j+1]+1:Math.max(D[i+1][j],D[i][j+1]);
  const out=[];let i=0,j=0;
  while(i<n&&j<m){if(eq(a[i],b[j])){out.push({op:"eq",v:a[i],w:b[j]});i++;j++}else if(D[i+1][j]>=D[i][j+1])out.push({op:"del",v:a[i++]});else out.push({op:"ins",v:b[j++]})}
  while(i<n)out.push({op:"del",v:a[i++]});while(j<m)out.push({op:"ins",v:b[j++]});
  return out;
}
function wordDiff(a,b){
  const ops=lcsOps(wtok(a),wtok(b),(x,y)=>x===y).map(o=>({op:o.op,t:o.op==="eq"?o.w:o.v}));
  const words=s=>(s.match(/[A-Za-z0-9\u00C0-\u024F]+/g)||[]).length;
  const kept=ops.filter(o=>o.op==="eq").reduce((n,o)=>n+words(o.t),0), longest=Math.max(words(a),words(b));
  /* little in common: show one clean replacement, as a lawyer would mark it up */
  if(longest>6&&kept/longest<0.4) return [a?{op:"del",t:a}:null,b?{op:"ins",t:b}:null].filter(Boolean);
  /* fold short runs of matching words that sit between two changes into the change */
  for(let i=1;i<ops.length-1;i++){if(ops[i].op==="eq"&&ops[i-1].op!=="eq"&&ops[i+1].op!=="eq"){let j=i,w=0;while(j<ops.length&&ops[j].op==="eq"){w+=words(ops[j].t);j++}
    if(j<ops.length&&w<=2&&ops[j].op!=="eq"){const t=ops.slice(i,j).map(o=>o.t).join("");ops.splice(i,j-i,{op:"del",t},{op:"ins",t});i++}}}
  const out=[];let i=0;
  while(i<ops.length){
    if(ops[i].op==="eq"){const l=out[out.length-1];if(l&&l.op==="eq")l.t+=ops[i].t;else out.push({op:"eq",t:ops[i].t});i++;continue}
    let dd="",nn="";while(i<ops.length&&ops[i].op!=="eq"){if(ops[i].op==="del")dd+=ops[i].t;else nn+=ops[i].t;i++}
    if(dd)out.push({op:"del",t:dd});if(nn)out.push({op:"ins",t:nn});
  }
  return out;
}
const normP=s=>s.replace(/\s+/g," ").trim();
/* paragraph-level diff: [{op:"eq"|"chg"|"del"|"ins", a?:index in old, b?:index in new}] */
function paraDiff(oldP,newP){
  const ops=lcsOps(oldP.map((x,i)=>({x:normP(x),i})),newP.map((x,i)=>({x:normP(x),i})),(p,q)=>p.x===q.x);
  const out=[];let dels=[],inss=[];
  const flush=()=>{const k=Math.min(dels.length,inss.length);for(let i=0;i<k;i++)out.push({op:"chg",a:dels[i],b:inss[i]});dels.slice(k).forEach(a=>out.push({op:"del",a}));inss.slice(k).forEach(b=>out.push({op:"ins",b}));dels=[];inss=[]};
  ops.forEach(o=>{if(o.op==="eq"){flush();out.push({op:"eq",a:o.v.i,b:o.w.i})}else if(o.op==="del")dels.push(o.v.i);else inss.push(o.v.i)});
  flush();return out;
}

/* ---------- writing: shared parts ---------- */
const STYLES_XML=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="${WNS}"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Century Gothic" w:hAnsi="Century Gothic" w:eastAsia="Century Gothic" w:cs="Century Gothic"/><w:sz w:val="20"/><w:szCs w:val="22"/><w:lang w:val="en-GB"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="160" w:line="264" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:jc w:val="center"/><w:spacing w:before="240" w:after="360"/></w:pPr><w:rPr><w:b/><w:caps/><w:spacing w:val="20"/><w:sz w:val="32"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="120"/><w:ind w:left="720" w:hanging="720"/><w:jc w:val="left"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:caps/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="120"/><w:jc w:val="center"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:caps/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Label"><w:name w:val="Section Label"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="120"/><w:jc w:val="left"/></w:pPr><w:rPr><w:b/><w:caps/><w:spacing w:val="10"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="TableText"><w:name w:val="Table Text"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:before="40" w:after="40"/><w:jc w:val="left"/></w:pPr><w:rPr><w:sz w:val="20"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="CommentText"><w:name w:val="annotation text"/><w:basedOn w:val="Normal"/><w:pPr><w:jc w:val="left"/></w:pPr><w:rPr><w:sz w:val="20"/></w:rPr></w:style>
<w:style w:type="character" w:styleId="CommentReference"><w:name w:val="annotation reference"/><w:rPr><w:sz w:val="16"/></w:rPr></w:style>
<w:style w:type="table" w:styleId="Grid"><w:name w:val="Table Grid"/><w:tblPr><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tblBorders><w:tblCellMar><w:left w:w="100" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>
</w:styles>`;
function commentXML(c){
  const paras=String(c.text||"").split(/\n+/).filter(Boolean);
  return `<w:comment w:id="${c.id}" w:author="${xesc(c.author||"Counterpart")}" w:date="${c.date||isoNow()}" w:initials="${xesc((c.author||"CP").split(/\s+/).map(x=>x[0]).join("").slice(0,3))}">${(paras.length?paras:[""]).map((t,i)=>`<w:p><w:pPr><w:pStyle w:val="CommentText"/></w:pPr>${i===0?`<w:r><w:rPr><w:rStyle w:val="CommentReference"/></w:rPr><w:annotationRef/></w:r>`:""}<w:r><w:t xml:space="preserve">${xesc(t)}</w:t></w:r></w:p>`).join("")}</w:comment>`;
}
let REVID=7000;
const revAttrs=(author,date)=>`w:id="${++REVID}" w:author="${xesc(author)}" w:date="${date}"`;
const runXML=(t,rPr,del)=>{if(!t)return"";return `<w:r>${rPr||""}${del?`<w:delText xml:space="preserve">${xesc(t)}</w:delText>`:`<w:t xml:space="preserve">${xesc(t)}</w:t>`}</w:r>`};
function diffRunsXML(oldT,newT,rPr,author,date){
  return wordDiff(oldT,newT).map(o=>o.op==="eq"?runXML(o.t,rPr):o.op==="del"?`<w:del ${revAttrs(author,date)}>${runXML(o.t,rPr,true)}</w:del>`:`<w:ins ${revAttrs(author,date)}>${runXML(o.t,rPr)}</w:ins>`).join("");
}

/* ---------- writing: a fresh document ----------
   blocks: {p:"text"|[[text,{b,i,ins,del}]...], style, label, ind:[left,hanging], align, bold, caps, pageBreak, keepNext, cs:[ids], ce:[ids]}
           {tbl:{cols, rows:[[...]|{group}], w:[%]}}  */
function blockXML(b,author,date){
  if(b.tbl){
    const total=9026, ws=b.tbl.w.map(x=>Math.round(total*x/100));
    const cell=(t,i,hdr,span)=>`<w:tc><w:tcPr><w:tcW w:w="${span?total:ws[i]}" w:type="dxa"/>${span?`<w:gridSpan w:val="${b.tbl.cols.length}"/>`:""}${hdr||span?`<w:shd w:val="clear" w:color="auto" w:fill="${hdr?"E7E8EA":"F2F3F4"}"/>`:""}</w:tcPr><w:p><w:pPr><w:pStyle w:val="TableText"/></w:pPr><w:r>${hdr||span?"<w:rPr><w:b/></w:rPr>":""}<w:t xml:space="preserve">${xesc(t)}</w:t></w:r></w:p></w:tc>`;
    return `<w:tbl><w:tblPr><w:tblStyle w:val="Grid"/><w:tblW w:w="${total}" w:type="dxa"/><w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid>${ws.map(w=>`<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid>
      <w:tr><w:trPr><w:tblHeader/></w:trPr>${b.tbl.cols.map((c,i)=>cell(c,i,true)).join("")}</w:tr>
      ${b.tbl.rows.map(r=>Array.isArray(r)?`<w:tr>${r.map((c,i)=>cell(c,i)).join("")}</w:tr>`:`<w:tr>${cell(r.group,0,false,true)}</w:tr>`).join("")}</w:tbl><w:p/>`;
  }
  const ppr=[];
  if(b.style) ppr.push(`<w:pStyle w:val="${b.style}"/>`);
  if(b.keepNext) ppr.push("<w:keepNext/>");
  if(b.pageBreak) ppr.push("<w:pageBreakBefore/>");
  if(b.ind) ppr.push(`<w:ind w:left="${b.ind[0]}" w:hanging="${b.ind[1]||0}"/>`);
  if(b.align) ppr.push(`<w:jc w:val="${b.align}"/>`);
  if(b.pins) ppr.push(`<w:rPr><w:ins ${revAttrs(author,date)}/></w:rPr>`);
  if(b.pdel) ppr.push(`<w:rPr><w:del ${revAttrs(author,date)}/></w:rPr>`);
  const base=(b.bold?"<w:b/>":"")+(b.caps?"<w:caps/>":"")+(b.italic?"<w:i/>":"")+(b.color?`<w:color w:val="${b.color}"/>`:"")+(b.size?`<w:sz w:val="${b.size}"/>`:"");
  const rp=x=>{const s=base+(x&&x.b?"<w:b/>":"")+(x&&x.i?"<w:i/>":"");return s?`<w:rPr>${s}</w:rPr>`:""};
  let runs="";
  if(b.label) runs+=b.pins?`<w:ins ${revAttrs(author,date)}>${runXML(b.label,rp())}<w:r>${rp()}<w:tab/></w:r></w:ins>`:`${runXML(b.label,rp())}<w:r>${rp()}<w:tab/></w:r>`;
  const parts=typeof b.p==="string"?[[b.p,{}]]:(b.p||[]);
  parts.forEach(([t,x])=>{x=x||{};
    if(x.ins) runs+=`<w:ins ${revAttrs(author,date)}>${runXML(t,rp(x))}</w:ins>`;
    else if(x.del) runs+=`<w:del ${revAttrs(author,date)}>${runXML(t,rp(x),true)}</w:del>`;
    else runs+=runXML(t,rp(x));
  });
  const cs=(b.cs||[]).map(id=>`<w:commentRangeStart w:id="${id}"/>`).join("");
  const ce=(b.ce||[]).map(id=>`<w:commentRangeEnd w:id="${id}"/><w:r><w:rPr><w:rStyle w:val="CommentReference"/></w:rPr><w:commentReference w:id="${id}"/></w:r>`).join("");
  return `<w:p>${ppr.length?`<w:pPr>${ppr.join("")}</w:pPr>`:""}${cs}${runs}${ce}</w:p>`;
}
async function buildDocx(blocks,opts){
  opts=opts||{}; const author=opts.author||"Counterpart", date=isoNow(), comments=opts.comments||[];
  const zip=new JSZip();
  const body=blocks.map(b=>blockXML(b,author,date)).join("");
  zip.file("[Content_Types].xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="${CTNS}"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>${comments.length?`<Override PartName="/word/comments.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml"/>`:""}<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`);
  zip.file("_rels/.rels",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="${RELNS}"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`);
  zip.file("docProps/core.xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xesc(opts.title||"Agreement")}</dc:title><dc:creator>Counterpart</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${date}</dcterms:created></cp:coreProperties>`);
  zip.file("word/_rels/document.xml.rels",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="${RELNS}"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>${comments.length?`<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments" Target="comments.xml"/>`:""}</Relationships>`);
  zip.file("word/settings.xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="${WNS}">${opts.track?"<w:trackRevisions/>":""}<w:defaultTabStop w:val="720"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>`);
  zip.file("word/styles.xml",STYLES_XML);
  if(comments.length) zip.file("word/comments.xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:comments xmlns:w="${WNS}">${comments.map(commentXML).join("")}</w:comments>`);
  zip.file("word/document.xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="${WNS}"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`);
  return zip.generateAsync({type:"blob",mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
}

/* ---------- writing: redline into the original file ----------
   edits: [{pis:[paragraph indices of the clause body], newBody:[strings], comment:{text}|null, anchorPi}] */
const LABEL_RE=/^\s*(\(?[0-9]+(\.[0-9]+)*\.?\)?|\([a-z]{1,4}\)|\([ivxl]+\)|[a-z]\))\s+/i;
async function redlineDocx(buf,edits,opts){
  opts=opts||{}; const author=opts.author||"Counterpart", date=isoNow();
  const zip=await JSZip.loadAsync(buf.slice(0));
  const parse=s=>new DOMParser().parseFromString(s,"application/xml");
  const doc=parse(await zip.file("word/document.xml").async("string"));
  const paras=bodyParas(doc), read=await readDocx(buf.slice(0));
  const frag=s=>{const d=parse(`<x xmlns:w="${WNS}">${s}</x>`);return Array.from(d.documentElement.childNodes).map(n=>doc.importNode(n,true))};
  const firstRPr=p=>{const r=p.getElementsByTagNameNS(WNS,"r")[0];const rp=r&&kid(r,"rPr");if(!rp)return"";const c=rp.cloneNode(true);Array.from(c.childNodes).forEach(n=>{if(n.nodeType===1&&/^(ins|del|rPrChange|rStyle)$/.test(n.localName))c.removeChild(n)});return new XMLSerializer().serializeToString(c).replace(/ xmlns:w="[^"]*"/,"")};
  const keepers=p=>Array.from(p.getElementsByTagNameNS(WNS,"*")).filter(n=>/^(commentRangeStart|commentRangeEnd|bookmarkStart|bookmarkEnd)$/.test(n.localName)||(n.localName==="r"&&kid(n,"commentReference")));
  const markPara=(p,kind)=>{let pPr=kid(p,"pPr");if(!pPr){pPr=doc.createElementNS(WNS,"w:pPr");p.insertBefore(pPr,p.firstChild)}
    let rPr=kid(pPr,"rPr");if(!rPr){rPr=doc.createElementNS(WNS,"w:rPr");const before=kid(pPr,"sectPr")||kid(pPr,"pPrChange");pPr.insertBefore(rPr,before||null)}
    Array.from(rPr.childNodes).forEach(n=>{if(n.nodeType===1&&(n.localName==="ins"||n.localName==="del"))rPr.removeChild(n)});
    const m=doc.createElementNS(WNS,"w:"+kind);m.setAttributeNS(WNS,"w:id",String(++REVID));m.setAttributeNS(WNS,"w:author",author);m.setAttributeNS(WNS,"w:date",date);rPr.insertBefore(m,rPr.firstChild)};
  const rebuild=(p,oldT,newT)=>{
    const rPr=firstRPr(p), keep=keepers(p).map(n=>n.parentNode.removeChild(n));
    Array.from(p.childNodes).forEach(n=>{if(!(n.nodeType===1&&n.localName==="pPr"))p.removeChild(n)});
    const starts=keep.filter(n=>/Start$/.test(n.localName)), ends=keep.filter(n=>!/Start$/.test(n.localName));
    starts.forEach(n=>p.appendChild(n)); frag(diffRunsXML(oldT,newT,rPr,author,date)).forEach(n=>p.appendChild(n)); ends.forEach(n=>p.appendChild(n));
  };
  let cdoc=null, cid=0, revised=0;
  const cf=zip.file("word/comments.xml");
  if(cf){cdoc=parse(await cf.async("string"));Array.from(cdoc.getElementsByTagNameNS(WNS,"comment")).forEach(c=>{cid=Math.max(cid,+wAttr(c,"id")+1)})}
  cid=Math.max(cid,100);
  const newComments=[];
  edits.forEach(e=>{
    const disp=i=>(read.paras[i].hasNum&&read.paras[i].num?read.paras[i].num+" ":"")+read.paras[i].t;
    const oldBody=e.pis.map(disp), ops=paraDiff(oldBody,e.newBody);
    if(ops.every(o=>o.op==="eq")&&!e.comment) return;
    let anchor=e.pis.length?paras[e.pis[0]]:paras[e.anchorPi], firstTouched=null, lastTouched=null;
    let lastOrig=null;
    ops.forEach(o=>{
      if(o.op==="eq"){anchor=paras[e.pis[o.a]];lastOrig=e.pis[o.a];return}
      if(o.op==="chg"||o.op==="del"){const pi=e.pis[o.a],p=paras[pi],rp=read.paras[pi];if(rp.rev)revised++;
        let nt=o.op==="chg"?e.newBody[o.b]:"";if(rp.hasNum)nt=nt.replace(LABEL_RE,"");
        rebuild(p,rp.t,nt);if(o.op==="del")markPara(p,"del");anchor=p;lastOrig=pi;firstTouched=firstTouched||p;lastTouched=p;return}
      if(o.op==="ins"){const src=paras[lastOrig!=null?lastOrig:(e.pis.length?e.pis[0]:e.anchorPi)];const np=doc.createElementNS(WNS,"w:p");
        const sp=src&&kid(src,"pPr");if(sp){const c=sp.cloneNode(true);Array.from(c.childNodes).forEach(n=>{if(n.nodeType===1&&/^(sectPr|pPrChange)$/.test(n.localName))c.removeChild(n)});np.appendChild(c)}
        const srcHasNum=src&&read.paras[paras.indexOf(src)]&&read.paras[paras.indexOf(src)].hasNum;
        let nt=e.newBody[o.b];if(srcHasNum)nt=nt.replace(LABEL_RE,"");
        frag(`<w:ins ${revAttrs(author,date)}>${runXML(nt,src?firstRPr(src):"")}</w:ins>`).forEach(n=>np.appendChild(n));
        markPara(np,"ins");anchor.parentNode.insertBefore(np,anchor.nextSibling);anchor=np;firstTouched=firstTouched||np;lastTouched=np}
    });
    if(e.comment&&e.comment.text){
      const id=cid++;const fp=firstTouched||paras[e.anchorPi!=null?e.anchorPi:e.pis[0]], lp=lastTouched||fp;
      if(fp&&lp){const pPr=kid(fp,"pPr");const s=doc.createElementNS(WNS,"w:commentRangeStart");s.setAttributeNS(WNS,"w:id",String(id));fp.insertBefore(s,pPr?pPr.nextSibling:fp.firstChild);
        const en=doc.createElementNS(WNS,"w:commentRangeEnd");en.setAttributeNS(WNS,"w:id",String(id));lp.appendChild(en);
        frag(`<w:r><w:rPr><w:rStyle w:val="CommentReference"/></w:rPr><w:commentReference w:id="${id}"/></w:r>`).forEach(n=>lp.appendChild(n));
        newComments.push({id,author,date,text:e.comment.text})}
    }
  });
  const ser=x=>{const t=new XMLSerializer().serializeToString(x);return /^<\?xml/.test(t)?t:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'+t};
  zip.file("word/document.xml",ser(doc));
  if(newComments.length){
    if(cdoc){const root=cdoc.documentElement;newComments.forEach(c=>{const d=parse(`<x xmlns:w="${WNS}">${commentXML(c)}</x>`);root.appendChild(cdoc.importNode(d.documentElement.firstChild,true))});zip.file("word/comments.xml",ser(cdoc))}
    else{
      zip.file("word/comments.xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:comments xmlns:w="${WNS}">${newComments.map(commentXML).join("")}</w:comments>`);
      const rf="word/_rels/document.xml.rels";let rels=await zip.file(rf).async("string");
      if(!/comments\.xml/.test(rels))rels=rels.replace("</Relationships>",`<Relationship Id="rIdCp${Date.now()%100000}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments" Target="comments.xml"/></Relationships>`);zip.file(rf,rels);
      let ct=await zip.file("[Content_Types].xml").async("string");
      if(!/\/word\/comments\.xml/.test(ct))ct=ct.replace("</Types>",`<Override PartName="/word/comments.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml"/></Types>`);zip.file("[Content_Types].xml",ct);
    }
  }
  const blob=await zip.generateAsync({type:"blob",mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
  return {blob,revised};
}
