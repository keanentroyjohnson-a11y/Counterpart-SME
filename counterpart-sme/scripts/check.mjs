// Builds every guided-start route at every negotiating position and checks the drafts.
import { readFileSync } from "node:fs";
import { FILES } from "./files.mjs";
const stub=()=>({hidden:true,innerHTML:"",dataset:{},classList:{toggle(){},add(){},remove(){}},querySelector:()=>null,querySelectorAll:()=>[],scrollTop:0,focus(){},insertAdjacentHTML(){}});
globalThis.document={getElementById:()=>stub(),addEventListener(){},querySelectorAll:()=>[],body:{dataset:{}},documentElement:{dataset:{}}};
globalThis.window={scrollY:0,scrollTo(){}};globalThis.localStorage={getItem:()=>null,setItem(){}};globalThis.location={hash:""};
globalThis.matchMedia=()=>({matches:false,addEventListener(){}});globalThis.setTimeout=()=>0;globalThis.clearTimeout=()=>{};globalThis.MutationObserver=function(){this.observe=()=>{}};
const src=FILES.map(f=>readFileSync(f,"utf8")).join("\n")+`
let bad=[], n=0;
SME_IDS.forEach(([g,ids])=>ids.forEach(id=>{if(!AG[id])bad.push("missing "+id)}));
if(ALL.length!==20) bad.push("library should hold 20 agreements, holds "+ALL.length);
SME_NEEDS.forEach(nd=>nd.o.forEach(o=>{ for(const side of (o.ask?o.ask.ch.map(c=>c[1]):[o.side])) for(const lev of ["strong","even","weak"]) {
  const a=AG[o.ag]; const st={side,preset:"market",picks:{B:{},S:{}},parties:{B:{n:"A Ltd",no:"",ad:""},S:{n:"B Ltd",no:"",ad:""}}};
  st.picks[side]=smePicks(a,side,lev,SME_PRI.map(p=>p.id).slice(0,3),"vhigh");
  const r=smeCreate(o.ag,st,{dates:[{id:"d1",label:"Renewal date",date:"2027-01-01"}]}); n++;
  const m=build(Object.assign({},a,{sid:recSid(r)})); const t=docText(m)+docHTML(m);
  const x=t.match(/\\{[A-Z]+(:[^}]*)?\\}|undefined|NaN|the relevant Schedule|\\[Schedule\\]/g); if(x) bad.push(o.ag+" "+side+" "+lev+" "+x.join(","));
  smeSignDlg(r); smeDatesDlg(r); smeIcs(r); smeToolbar(Object.assign({},a,{sid:recSid(r)}));
}}));
SME.int=smeNewInt(); for(let s=0;s<6;s++){SME.int.step=s;SME.int.need="hire";SME.int.opt=0;SME.int.ag="empc";SME.int.side="B";smeInt()}
smeDocs(); smeHome("",""); smeSignPage();
console.log(bad.length?bad.join("\\n"):"ALL CLEAN"); console.log("agreements",ALL.length,"guided routes checked",n); if(bad.length) process.exitCode=1;
`;
(0,eval)(src);
