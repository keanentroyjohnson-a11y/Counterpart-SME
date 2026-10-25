/* ============================================================
   SCHEDULES
   Every {SC:key} reference in the drafting resolves to a schedule here.
   Schedules with gen() are drafted; the rest appear as titled placeholders.
   Warranty markers: [[f:..]] full buyer form only, [[m:..]] and [[k:..]] market and
   seller forms, [[a:..]] seller form only, [[n:..]] full and market forms.
   ============================================================ */
const DPL_DEF="the UK GDPR, the Data Protection Act 2018, the Privacy and Electronic Communications (EC Directive) Regulations 2003 and all other legislation relating to the processing of personal data that applies in the United Kingdom, in each case as amended from time to time";
const UKGDPR_DEF="has the meaning given to it in section 3(10), as supplemented by section 205(4), of the Data Protection Act 2018";

/* ---------- SPA warranties ---------- */
const WAR_PARTS=[
{id:"A",t:"General",e:"Confirms the seller can sign, owns the shares outright, and that the company is properly constituted and solvent.",ps:[
 {t:"Capacity and authority",i:[
  "{S} has full power and authority to enter into and perform this Agreement and each other document to be executed by it at Completion, which constitute valid and binding obligations on {S} in accordance with their terms.",
  ["The execution and performance by {S} of this Agreement will not:",["breach any provision of its constitutional documents;","result in a breach of any law, regulation, order, judgment or decree of any court or governmental agency by which it is bound; or","require it to obtain any consent or approval of, or give any notice to or make any registration with, any governmental or other authority, other than as contemplated by the Conditions."]]]},
 {t:"The Shares and the Company",i:[
  "{S} is the sole legal and beneficial owner of the Shares, which comprise the whole of the allotted and issued share capital of the Company and are fully paid.",
  "There is no Encumbrance on, over or affecting the Shares, there is no agreement or commitment to give or create any Encumbrance over them, and no person has claimed to be entitled to one.",
  "No person has the right, or has claimed the right, to call for the allotment, issue, sale, transfer or conversion of any share or loan capital of the Company, whether under any option, right of pre-emption or otherwise.",
  "The Company has no subsidiaries and does not hold, and has not agreed to acquire, any share or other interest in any body corporate, partnership or joint venture.",
  "The particulars of the Company set out in {SC:co} are true and accurate."]},
 {t:"Constitution, records and filings",i:[
  "The copy of the articles of association of the Company annexed to the Disclosure Letter is complete and accurate, and the Company has at all times carried on its business in accordance with them.",
  "The statutory books of the Company, including all registers and minute books, have been properly kept [[m:in all material respects ]]and are in the possession of the Company, and no notice has been received alleging that any of them is incorrect or should be rectified.",
  "All returns, particulars, resolutions and other documents which the Company is required by law to file with or deliver to the Registrar of Companies have been correctly made up and duly filed or delivered.",
  "The Company has complied with its obligations under Part 21A of the Companies Act 2006, its register of people with significant control is complete and accurate, and each of its directors has complied with any applicable identity verification requirement under that Act."]},
 {t:"Insolvency",i:[
  ["In relation to the Company:",["no order has been made, petition presented or resolution passed for its winding up, and no meeting has been convened for that purpose;","no administrator, receiver or administrative receiver has been appointed, and no notice of intention to appoint an administrator has been given or filed;","it is not unable to pay its debts within the meaning of section 123 of the Insolvency Act 1986, and has not stopped or suspended payment of its debts as they fall due;","no moratorium under Part A1 of the Insolvency Act 1986 is in force, and no voluntary arrangement, restructuring plan or scheme of arrangement has been proposed; and","no event analogous to any of the above has occurred in any jurisdiction."]]]}]},
{id:"B",t:"Accounts and Finance",e:"Confirms the accounts are reliable and that nothing unusual has happened since they were drawn up.",ps:[
 {t:"Accounts",i:[
  ["The Accounts:",["have been prepared in accordance with the Companies Act 2006 and with accounting principles and practices generally accepted in the United Kingdom, including FRS 102, applied on a basis consistent with that used in the preceding three (3) financial years;","give a true and fair view of the assets, liabilities and state of affairs of the Company as at the Accounts Date and of its profits or losses for the financial year ended on that date; and","make full provision for, or disclose, all liabilities of the Company[[m: which are required to be provided for or disclosed in accordance with those principles]]."]],
  {x:"The unaudited management accounts of the Company for the period from the Accounts Date to [●] (the “Management Accounts”) have been prepared with due care, on a basis consistent with the Accounts, and give a true and fair view of the financial position and results of the Company for the periods to which they relate.",lv:[0]},
  {x:"The unaudited management accounts of the Company for the period from the Accounts Date to [●] (the “Management Accounts”) have been prepared with due care, on a basis consistent with the Accounts, and are not misleading in any material respect.",lv:[1]},
  {x:"The unaudited management accounts of the Company for the period from the Accounts Date to [●] (the “Management Accounts”) have been prepared in good faith and with reasonable care. {B} acknowledges that they have not been audited and that no other warranty is given as to their accuracy.",lv:[2]}]},
 {t:"Events since the Accounts Date",i:[
  ["Since the Accounts Date:",["the Company has carried on its business in the ordinary and usual course;","there has been no [[m:material ]]adverse change in the financial or trading position[[f: or prospects]] of the Company;","the Company has not declared, paid or made any dividend or other distribution;","the Company has not allotted, issued, redeemed or purchased any of its shares;","the Company has not incurred any borrowing, or acquired or disposed of any asset, other than in the ordinary course of business; and","no resolution of the members of the Company has been passed, other than resolutions relating to ordinary business at an annual general meeting."]]]},
 {t:"Borrowing, grants and guarantees",i:[
  "The total amount borrowed by the Company does not exceed any limit on its borrowing in its articles of association or in any agreement, and no event has occurred which entitles any lender to demand early repayment or to enforce any security.",
  "The Company is not party to, and is not liable under, any guarantee, indemnity or other arrangement under which it is responsible for the obligations of any other person.",
  "The Company has not received any grant, allowance or subsidy which is or may become repayable as a result of the sale of the Shares."]}]},
{id:"C",t:"Trading and Compliance",e:"Covers key contracts and customers, compliance with the law, financial crime, disputes, insurance and competition.",ps:[
 {t:"Material contracts",i:[
  "In this Schedule, “Material Contract” means any agreement to which the Company is a party which involves annual expenditure or receipts of more than £[●], is not in the ordinary course of business, cannot be terminated by the Company without penalty on three (3) months' notice or less, or restricts the freedom of the Company to carry on any business in any part of the world.",
  "Complete and accurate copies of each Material Contract are annexed to the Disclosure Letter. Each Material Contract is in full force and effect and is valid and binding on the parties to it.",
  "Neither the Company nor[[k:, so far as {S} is aware,]] any other party is in [[m:material ]]default under any Material Contract[[f:, and no circumstances exist which would give rise to such a default with the passage of time or the giving of notice]].",
  "No notice of termination of any Material Contract has been received or served by the Company, and no Material Contract may be terminated, or its terms varied, as a result of the sale of the Shares."]},
 {t:"Customers and suppliers",i:[
  "In the twelve (12) months before the date of this Agreement, no customer or supplier which accounted for more than five per cent (5%) of the turnover or purchases of the Company has ceased, or [[m:materially ]]reduced, its trading with the Company[[f:, or indicated an intention to do so]][[k:, or so far as {S} is aware indicated an intention to do so]]."]},
 {t:"Compliance with laws",i:[
  "The Company has conducted its business [[m:in all material respects ]]in accordance with all applicable laws and regulations of the United Kingdom and of every other jurisdiction in which it operates.",
  "The Company holds all licences, consents, permits and authorisations necessary to carry on its business [[m:in all material respects ]]as now carried on, each of which is in full force and effect, and [[k:so far as {S} is aware, ]]there are no circumstances which indicate that any of them is likely to be suspended, revoked or not renewed.",
  "The Company has not received any written notice from any governmental or regulatory authority alleging a breach of any law or regulation."]},
 {t:"Anti-bribery, financial crime and sanctions",i:[
  "Neither the Company nor any of its directors, employees or[[k:, so far as {S} is aware,]] agents has committed an offence under the Bribery Act 2010 or any other applicable anti-corruption law.",
  ["The Company has in place:",["adequate procedures designed to prevent persons associated with it from undertaking bribery, for the purposes of section 7(2) of the Bribery Act 2010;","reasonable prevention procedures for the purposes of section 45(2) of the Criminal Finances Act 2017; and","where applicable, reasonable fraud prevention procedures for the purposes of section 199 of the Economic Crime and Corporate Transparency Act 2023."]],
  "Neither the Company nor any of its directors is, or is owned or controlled by, a person designated under regulations made under the Sanctions and Anti-Money Laundering Act 2018, and the Company has not engaged in any dealing prohibited by such regulations.",
  "Where required by section 54 of the Modern Slavery Act 2015, the Company has published a slavery and human trafficking statement for each financial year."]},
 {t:"Litigation and investigations",i:[
  "The Company is not engaged in any litigation, arbitration, mediation, prosecution or other legal proceedings, and no such proceedings are pending or[[k:, so far as {S} is aware,]] threatened by or against the Company.",
  {x:"No facts or circumstances exist which are likely to give rise to any such proceedings.",lv:[0]},
  {x:"So far as {S} is aware, no facts or circumstances exist which are likely to give rise to any such proceedings.",lv:[1]},
  "The Company is not, and has not in the last three (3) years been, the subject of any investigation, inquiry or enforcement proceedings by any governmental, regulatory or other authority[[k:, and so far as {S} is aware none is pending or threatened]]."]},
 {t:"Insurance",i:[
  "The Company maintains, and has at all material times maintained, insurance against all risks normally insured against by companies carrying on a similar business, and details of all its current policies are set out in the Disclosure Letter.",
  "All premiums have been paid, no claim is outstanding, and nothing has been done or omitted which would make any policy void or voidable."]},
 {t:"Competition",i:[
  "[[n:The]][[a:So far as {S} is aware, the]] Company is not, and has not in the last five (5) years been, party to any agreement, arrangement or concerted practice, or engaged in any conduct, which infringes Chapter I or Chapter II of the Competition Act 1998 or any equivalent law in any other jurisdiction.",
  "The Company has not received any request for information or notice of investigation from the Competition and Markets Authority or any other competition authority."]}]},
{id:"D",t:"Assets and Property",opt:true,e:"Confirms the company owns what it uses, and covers its premises and environmental compliance.",ps:[
 {t:"Assets",i:[
  "The Company is the legal and beneficial owner of, and has good title to, all the assets included in the Accounts or acquired since the Accounts Date (other than those disposed of in the ordinary course of business), free from any Encumbrance.",
  "The assets of the Company comprise all the assets necessary to carry on its business [[m:in all material respects ]]as now carried on, and[[f: are in good repair and condition]][[k: are in reasonable repair and condition, fair wear and tear excepted]]."]},
 {t:"Property",i:[
  "The properties listed in the Disclosure Letter (the “Properties”) comprise all the land and buildings owned, occupied or otherwise used by the Company.",
  "The Company has good and marketable title to each of the Properties, free from any Encumbrance[[m: which would materially affect its use for its current purpose]].",
  "Where any Property is held under a lease, all rent has been paid, the Company has complied [[m:in all material respects ]]with its covenants, and no notice has been received alleging any breach[[f: or of any intention to forfeit the lease]].",
  "The current use of each Property is a lawful use for the purposes of the Town and Country Planning Act 1990[[k:, so far as {S} is aware]]."]},
 {t:"Environment",i:[
  "In this Schedule, “Environmental Laws” means all laws relating to the protection of human health or the environment, including the pollution of air, water or land and the handling and disposal of waste.",
  "The Company has complied [[m:in all material respects ]]with all Environmental Laws and holds, and has complied with, all permits required under them for the operation of its business.",
  "No Property is[[k:, so far as {S} is aware,]] contaminated land within the meaning of Part 2A of the Environmental Protection Act 1990, and the Company has not received any notice in relation to the contamination of any Property."]}]},
{id:"E",t:"Intellectual Property, IT and Data",opt:true,e:"Confirms the company owns or licenses its IP, its systems are adequate and secure, and personal data is handled lawfully.",ps:[
 {t:"Intellectual property",i:[
  "In this Schedule, “Company IPR” means the Intellectual Property Rights owned or used by the Company, and “Registered IPR” means any Company IPR which is registered or is the subject of an application for registration.",
  "Complete and accurate details of all Registered IPR are set out in the Disclosure Letter. All Registered IPR is subsisting[[f:, valid and enforceable]], and all renewal and application fees have been paid.",
  "The Company is the sole legal and beneficial owner of, or is validly licensed to use, all the Company IPR, which comprises all the Intellectual Property Rights necessary to carry on its business [[m:in all material respects ]]as now carried on.",
  "[[n:The]][[a:So far as {S} is aware, the]] activities of the Company do not infringe, and have not in the last six (6) years infringed, the Intellectual Property Rights of any third party, and[[k: so far as {S} is aware]] no third party is infringing any Company IPR.",
  "All Intellectual Property Rights created by any current or former employee, consultant or contractor in the course of work for the Company are owned by the Company, and all necessary assignments and waivers of moral rights have been obtained[[m: in respect of material Company IPR]].",
  "No software owned by the Company incorporates, or is distributed with, any open source software on terms which require the disclosure or licensing of the Company's proprietary source code to any third party."]},
 {t:"Information technology",i:[
  "In this Schedule, “IT Systems” means the computer systems, networks, hardware, software and related equipment owned or used by the Company.",
  "The IT Systems are owned by, or validly licensed to, the Company, and are adequate [[m:in all material respects ]]for the current needs of its business.",
  "In the last three (3) years there has been no failure or breakdown of, and no unauthorised access to or cyber attack on, any of the IT Systems[[m: which has caused material disruption to the business of the Company]].",
  "The Company has in place, and has tested within the last twelve (12) months, business continuity and disaster recovery plans appropriate to its business."]},
 {t:"Data protection",i:[
  "The Company has complied [[m:in all material respects ]]with the Data Protection Legislation.",
  "In the last three (3) years, the Company has not suffered any Personal Data Breach which it was required to notify to the Information Commissioner under Article 33 of the UK GDPR.",
  "The Company has not received any notice, complaint, request for information or enforcement notice from the Information Commissioner or any data subject alleging a breach of the Data Protection Legislation[[n:, and no claim for compensation has been made against it under Article 82 of the UK GDPR]].",
  "Where the Company engages any processor, it has entered into a written agreement with that processor containing the terms required by Article 28(3) of the UK GDPR."]}]},
{id:"F",t:"Employees and Pensions",opt:true,e:"Covers the workforce, employment law compliance, worker status and pension liabilities.",ps:[
 {t:"Employees",i:[
  "Complete and accurate details, on an anonymised basis, of the job title, date of commencement, notice period, salary and other benefits of each employee of the Company[[a: earning more than £[●] a year]] are set out in the Disclosure Letter.",
  "No employee of the Company earning more than £[●] a year has given or received notice of termination, and no offer of employment made by the Company is outstanding.",
  "The Company has complied [[m:in all material respects ]]with its obligations under all applicable employment legislation, including the Employment Rights Act 1996, the Equality Act 2010, the National Minimum Wage Act 1998 and the Working Time Regulations 1998, and with all collective agreements and codes of practice applicable to its employees.",
  "The Company has carried out all checks required by section 15 of the Immigration, Asylum and Nationality Act 2006 in relation to each of its employees.",
  "No employment tribunal claim or other dispute is outstanding between the Company and any current or former employee or worker[[k:, and so far as {S} is aware none is threatened]].",
  "The Company does not recognise any trade union and is not party to any collective agreement.",
  "The Company has correctly determined the employment status of each individual who provides services to it, including for the purposes of Chapter 10 of Part 2 of the Income Tax (Earnings and Pensions) Act 2003."]},
 {t:"Pensions",i:[
  "In this Schedule, “Pension Schemes” means the pension schemes described in the Disclosure Letter.",
  "Other than under the Pension Schemes, the Company is not under any obligation to provide or contribute towards any pension, retirement, death or ill-health benefits for any current or former employee.",
  "None of the Pension Schemes provides defined benefits, and the Company has never been an employer in relation to, or connected with or an associate of an employer in relation to, any occupational pension scheme which provides defined benefits.",
  "The Company has complied [[m:in all material respects ]]with its automatic enrolment and re-enrolment duties under Part 1 of the Pensions Act 2008.",
  "No contribution notice or financial support direction has been issued to the Company under sections 38 to 51 of the Pensions Act 2004, and no debt has arisen or may arise under section 75 of the Pensions Act 1995 in respect of the Company."]}]},
{id:"G",t:"Tax",e:"Confirms the company's tax affairs are in order. These warranties work alongside the tax covenant.",ps:[
 {t:"Tax",i:[
  "In this Schedule, “Tax Authority” means HM Revenue & Customs and any other authority competent to impose any liability to Tax.",
  "All returns, computations, notices and information which the Company is required to make or provide to any Tax Authority have been made or provided within the applicable time limits and are [[m:in all material respects ]]accurate and complete.",
  "All Tax which the Company has been liable to pay has been paid on or before the due date, and the Company has not paid, and is not liable to pay, any penalty, fine, surcharge or interest in respect of Tax.",
  "The Company is not, and has not in the last six (6) years been, the subject of any enquiry, investigation, audit or dispute by or with any Tax Authority[[k:, and so far as {S} is aware none is pending or threatened]].",
  "The Company has properly operated the PAYE system and has deducted and accounted for all Tax and national insurance contributions required to be deducted from any payment made by it.",
  "The Company is registered for VAT, has complied [[m:in all material respects ]]with the Value Added Tax Act 1994 and all regulations made under it, and is not, and has not been, a member of a VAT group under section 43 of that Act.",
  "The Company is, and has always been, resident for Tax purposes only in the United Kingdom, and does not have a permanent establishment outside the United Kingdom.",
  "All transactions between the Company and any person connected with it have been entered into on arm's length terms, and no adjustment could be made under Part 4 of the Taxation (International and Other Provisions) Act 2010.",
  "The Company has not been a party to any notifiable arrangements within the meaning of Part 7 of the Finance Act 2004, or to any transaction the main purpose, or one of the main purposes, of which was the avoidance of Tax.",
  "No charge to Tax will arise to the Company under section 179 of the Taxation of Chargeable Gains Act 1992 or section 780 of the Corporation Tax Act 2009 as a result of the sale of the Shares.",
  "The Company has not made any loan or advance, or agreed to release any debt, which is or would be chargeable under section 455 or section 464A of the Corporation Tax Act 2010.",
  "All documents in the possession or control of the Company which are necessary to establish its title to any asset, and which attract stamp duty, have been duly stamped."]}]},
{id:"H",t:"Information",e:"Warrants that everything the buyer was told is true and that nothing important was held back. Sellers almost always delete this.",ps:[
 {t:"Information",i:[
  {x:"All information contained in the Disclosure Letter, and all other information given by or on behalf of {S} to {B} or its advisers in the course of the negotiations leading to this Agreement, was when given, and is, true, accurate and complete.",lv:[0]},
  {x:"{S} is not aware of any fact or matter which has not been disclosed in writing to {B} and which, if disclosed, might reasonably be expected to affect the willingness of a buyer to purchase the Shares on the terms of this Agreement.",lv:[0]}]}]}
];
const WAR_INTRO=[
 null,
 "Where any Warranty is qualified by the expression “so far as {S} is aware” or any similar expression, that Warranty shall be deemed to refer to the actual knowledge of [●] and [●], having made due and careful enquiry of [●] and [●].",
 "Where any Warranty is qualified by the expression “so far as {S} is aware” or any similar expression, that Warranty shall be deemed to refer only to the actual knowledge of [●] at the date of this Agreement, without any obligation to make enquiry, and no other person's knowledge shall be imputed to {S}."
];
function lvText(x,lv){
  const on={f:lv===0,k:lv>=1,a:lv===2,m:lv>=1,n:lv<=1};
  const r=s=>s.replace(/\[\[([fkamn]):(.*?)\]\]/g,(q,t,v)=>on[t]?v:"").replace(/ {2,}/g," ").replace(/ ([,.;])/g,"$1");
  return typeof x==="string"?r(x):[r(x[0]),x[1].map(r)].concat(x[2]?[r(x[2])]:[]);
}
function warLevel(ctx){return ctx.picks["sch-war"]==null?1:ctx.picks["sch-war"]}
function genWar(ctx){
  const lv=warLevel(ctx), off=ctx.d.wpart||{}, B=[];
  if(WAR_INTRO[lv]) B.push({ph:"",t:"Interpretation"},{p:WAR_INTRO[lv],n:""});
  let pn=0;
  WAR_PARTS.forEach(part=>{
    if(part.opt&&off[part.id]) return;
    const out=[];
    part.ps.forEach(ps=>{
      const items=ps.i.filter(it=>!(it&&it.lv)||it.lv.includes(lv)).map(it=>lvText(it.x||it,lv));
      if(!items.length) return;
      pn++; out.push({ph:String(pn),t:ps.t}); items.forEach((it,i)=>out.push({p:it,n:pn+"."+(i+1)}));
    });
    if(out.length) B.push({h:"Part "+part.id,s:part.t,e:part.e},...out);
  });
  return B;
}
const sample=lv=>[WAR_PARTS[2].ps[0].i[2],WAR_PARTS[2].ps[4].i[0],WAR_PARTS[4].ps[0].i[3]].map(x=>lvText(x,lv));
C["sch-war"]={t:"Warranties",lt:"SPA Warranty Schedule",g:["warranties"],
 d:"The full set of warranties given by the seller about the company. The strength chosen here applies across the whole schedule.",
 n:"Warranties are given at signing and, if repeated, at completion. Qualifiers matter: “in all material respects” filters out trivial breaches, and “so far as the Seller is aware” means the buyer must also prove the seller knew. W&I insurers generally cover warranties in market form and exclude matters known to the buyer's deal team.",
 o:[
 ["Full buyer form",-2,sample(0),"Unqualified statements plus a general information warranty, so any inaccuracy can found a claim.","You warrant matters you could not know about, and the information warranty effectively puts the whole data room behind your signature."],
 ["Market form",0,sample(1),"The usual form: materiality qualifiers where sensible and awareness qualifiers on matters outside the seller's control. Acceptable to most W&I insurers.","A balanced form that buyers and insurers recognise, limiting claims to what actually matters."],
 ["Seller's limited form",2,sample(2),"Many warranties bite only if the seller knew, and awareness means actual knowledge without enquiry. Claims become very hard to prove.","Strong protection. You warrant only what you know and what is material, and information and management accounts are largely excluded."]]};

/* ---------- TSA services catalogue ---------- */
const TSA_SVC=[
 {tw:"Information technology",id:"IT-01",n:"End-user computing",d:"Provision and support of laptops, desktops, mobile devices and standard productivity software (including email and calendar) for users in the Business.",mg:"Users moved to the Recipient's own devices, email tenancy and productivity licences"},
 {tw:"Information technology",id:"IT-02",n:"IT service desk",d:"First and second-line IT support for users in the Business during normal business hours on Business Days, through the Provider's existing service desk, using its existing priority definitions.",mg:"Recipient's service desk live, with users and open tickets transferred"},
 {tw:"Information technology",id:"IT-03",n:"Network and connectivity",d:"Continued access to the Provider's wide area network, internet gateways, remote access and site connectivity at the premises used by the Business.",mg:"Business sites connected to the Recipient's network and removed from the Provider's"},
 {tw:"Information technology",id:"IT-04",n:"Hosting and infrastructure",d:"Hosting of the applications and data used by the Business in the Provider's data centres and cloud tenancies, including back-up and restore.",mg:"Applications and data re-hosted and Provider back-ups of Business data deleted"},
 {tw:"Information technology",id:"IT-05",n:"Business applications",d:"Continued access to, and support of, the enterprise resource planning, customer relationship management and other applications used by the Business at Completion, as listed in the annex to this Schedule.",mg:"Replacement applications live and historic data migrated"},
 {tw:"Information technology",id:"IT-06",n:"Cyber security",d:"Security monitoring, identity and access management, endpoint protection and incident response for systems used by the Business, to the standard applied to the Provider's retained business.",mg:"Recipient's security operations in place and Provider access credentials revoked"},
 {tw:"Information technology",id:"IT-07",n:"Data separation and extraction",d:"Logical separation of the data of the Business from the Provider's data, and its extraction and transfer to the Recipient in an agreed format.",mg:"All Business data transferred, verified and deleted from Provider systems"},
 {tw:"Finance",id:"FIN-01",n:"Accounts payable",d:"Processing of supplier invoices and payments from the Business's own bank accounts, on the Recipient's instructions.",mg:"Supplier master data and open items transferred to the Recipient's finance system"},
 {tw:"Finance",id:"FIN-02",n:"Accounts receivable and credit control",d:"Invoicing of customers of the Business, cash allocation and credit control, with receipts paid into the Business's own bank accounts.",mg:"Customer ledger and open items transferred"},
 {tw:"Finance",id:"FIN-03",n:"General ledger and reporting",d:"Maintenance of the general ledger of the Business, month-end close and the production of monthly management accounts in the format used before Completion.",mg:"First month-end close completed on the Recipient's ledger"},
 {tw:"Finance",id:"FIN-04",n:"Tax compliance support",d:"Provision of data and reasonable assistance to enable the Recipient to prepare and submit its own VAT and corporation tax returns.",mg:"Recipient's first VAT return submitted without Provider data"},
 {tw:"People",id:"HR-01",n:"Payroll",d:"Monthly payroll processing for employees of the Business, including calculation of PAYE and national insurance contributions and Real Time Information submissions to HM Revenue & Customs on the Recipient's behalf.",mg:"First payroll run on the Recipient's payroll, with year-to-date figures transferred"},
 {tw:"People",id:"HR-02",n:"Benefits administration",d:"Administration of employee benefits for employees of the Business, to the extent the relevant benefit providers consent, until replacement arrangements are in place.",mg:"Replacement benefit and pension arrangements in place for all employees"},
 {tw:"People",id:"HR-03",n:"HR information system",d:"Continued access to the Provider's HR information system and the employment records of employees of the Business.",mg:"Employee records transferred to the Recipient's HR system"},
 {tw:"Premises and procurement",id:"FAC-01",n:"Shared premises",d:"Continued use of space at the Provider's premises identified in the annex to this Schedule, under a licence which does not create a tenancy.",mg:"Business relocated and the licence ended"},
 {tw:"Premises and procurement",id:"PRC-01",n:"Procurement",d:"Continued access to the Provider's group purchasing arrangements and supplier contracts, to the extent those contracts permit.",mg:"Replacement supplier contracts signed"},
 {tw:"Premises and procurement",id:"LEG-01",n:"Company secretarial",d:"Maintenance of the statutory registers of the companies transferred under the SPA and the making of filings at Companies House, on the Recipient's instructions.",mg:"Registers and Companies House authentication codes handed over",off:true}
];
const TSA_CAP=[24,24,6], TSA_DEF=[24,12,6], TSA_CHG=["At cost","Cost plus 5%","Cost plus 10%"];
function tsaSvcState(ctx){
  const st=ctx.d.tsvc||(ctx.d.tsvc={}), ti=ctx.picks["tsa-term"]==null?1:ctx.picks["tsa-term"], cap=TSA_CAP[ti], def=TSA_DEF[ti];
  return TSA_SVC.map(s=>{const x=st[s.id]||{};const on=x.on==null?!s.off:x.on;const mo=Math.min(x.m||def,cap);return Object.assign({},s,{on,mo,cap})});
}
const mword=n=>({3:"Three (3)",6:"Six (6)",9:"Nine (9)",12:"Twelve (12)",18:"Eighteen (18)",24:"Twenty-four (24)"}[n]||n)+" months";
function genTsvc(ctx){
  const rows=[], svcs=tsaSvcState(ctx).filter(s=>s.on), pi=ctx.picks["tsa-price"]==null?1:ctx.picks["tsa-price"];
  let tw=null;
  svcs.forEach(s=>{if(s.tw!==tw){tw=s.tw;rows.push({group:tw})} rows.push([s.id,s.n,s.d,mword(s.mo),"£[●] a month ("+TSA_CHG[pi].toLowerCase()+", under {R:tsa-price})"])});
  return [
   {h:"Part 1",s:"General"},
   {p:"Part 2 of this Schedule describes each Service, the Service Period for which it is to be provided and the basis on which it is charged. Part 3 lists services which are excluded from this Agreement.",n:"1.1"},
   {p:"Each party shall appoint a service manager for each service area in Part 2. The service managers shall meet at least monthly to review the performance of the Services and progress against the Migration Plan, and any issue they cannot resolve shall be referred for resolution under {R:dr}.",n:"1.2"},
   {p:"No change to the scope of any Service shall be effective unless agreed in writing by the service managers of both parties.",n:"1.3"},
   {p:"Where a Service involves {S} acting on the instructions of {B}, including making payments, submitting returns or processing payroll, {S} acts as {B}'s agent and {B} remains responsible for the underlying legal obligation.",n:"1.4"},
   {h:"Part 2",s:"The Services"},
   svcs.length?{tbl:{cols:["Ref","Service","Description","Service Period","Charges"],w:[9,16,43,14,18],rows}}:{p:"[No Services selected.]",n:""},
   {h:"Part 3",s:"Excluded Services"},
   {p:["The following are not Services and shall not be provided under this Agreement:",["legal, tax, accounting or other professional advice;","insurance cover of any kind, including under any group insurance policy of {S} or any member of its group;","treasury, cash management, banking or financing services, including access to any cash pooling arrangement;","the statutory audit of the accounts of {B} or any member of its group;","any service which {S} would require a regulatory authorisation to provide and does not hold; and","any strategic, management or decision-making function for the Business."]],n:"3.1"}
  ];
}
function genMig(ctx){
  const svcs=tsaSvcState(ctx).filter(s=>s.on);
  return [
   {p:"{B} shall lead the migration of each Service to its own systems or to a replacement provider, and {S} shall provide the assistance described in this Agreement.",n:"1"},
   {p:"Each party shall appoint a migration lead, who shall attend the monthly service management meetings described in {SC:tsvc}.",n:"2"},
   {p:"The milestones below may be updated by written agreement between the migration leads. A failure to meet a target date shall not of itself extend any Service Period.",n:"3"},
   svcs.length?{tbl:{cols:["Ref","Service","Migration milestone","Lead","Target date"],w:[9,18,41,16,16],rows:svcs.map(s=>[s.id,s.n,s.mg,"{B}, with {S}'s assistance","By the end of month "+s.mo+" after Completion"])}}:{p:"[No Services selected.]",n:""}
  ];
}
C["tsa-omit"]={t:"Omitted Services",g:["carve-outs"],
 d:"What happens if a service the business relied on before completion was left out of the services schedule.",
 n:"An omitted services provision (sometimes called a wrap or sweep-up clause) is among the most negotiated terms in a TSA, because no services schedule is ever complete on day one.",
 o:[
 ["Provided on request",-2,["If, within six (6) months after the Effective Date, {B} notifies {S} of any service which was provided to the Business by {S} or any member of its group during the twelve (12) months before Completion and which is not described in {SC:tsvc} (an “Omitted Service”), {S} shall provide that Omitted Service from the date of the notice, and it shall be treated as a Service for all purposes of this Agreement.","The Charges and Service Period for an Omitted Service shall be determined on the same basis as for the most comparable Service."],
  "Anything the business relied on before completion is covered, even if nobody thought to list it.","An open-ended commitment to services you may not have priced or planned for."],
 ["Good faith, if reasonably able",0,["If, within three (3) months after the Effective Date, {B} identifies any service which was provided to the Business during the twelve (12) months before Completion and which is not described in {SC:tsvc} (an “Omitted Service”), {B} may request it in writing.","{S} shall consider each request in good faith and, if it is reasonably able to provide the Omitted Service using its existing resources and without breaching any agreement with a third party, shall provide it on terms, including Charges, agreed between the parties acting reasonably."],
  "The market position. A route to plug gaps, though not a guarantee.","You help where you reasonably can, on terms you agree."],
 ["Listed services only",2,["{S} shall have no obligation to provide any service which is not described in {SC:tsvc}. Any request by {B} for an additional service may be agreed or refused at {S}'s absolute discretion."],
  "Any gap in the schedule is your problem from day one.","Complete certainty about what you must provide."]]};

/* ---------- registry ---------- */
const listify=xs=>xs.map((x,i)=>x+(i<xs.length-2?";":i===xs.length-2?"; and":"."));
const SCHED={
 co:{t:"Particulars of the Company",e:"The key corporate details of the target, which the buyer checks against Companies House.",kinds:["spa"],always:true,gen:()=>[{tbl:{cols:["Item","Particulars"],w:[34,66],rows:[["Name","[●] Limited"],["Registered number","[●]"],["Date and place of incorporation","[●], England and Wales"],["Registered office","[●]"],["Directors","[●]"],["Secretary","[●]"],["Issued share capital","£[●] divided into [●] ordinary shares of £[●] each"],["Registered and beneficial owner of the Shares","{S}"],["Accounting reference date","[●]"],["Auditors","[●]"]]}}]},
 cond:{t:"Conditions",e:"The regulatory approvals that must be obtained before the deal can complete, and how the parties go about getting them.",kinds:["spa","apa"],df:{"Long Stop Date":"[●], or such later date as the parties may agree in writing"},gen:()=>[
  {p:"In this Schedule, “Transaction” means the sale and purchase under this Agreement.",n:"1"},
  {p:["Completion is conditional on:",["if the Transaction is a notifiable acquisition within the meaning of section 6 of the National Security and Investment Act 2021, the Secretary of State having either notified {B} that no further action will be taken under that Act in relation to the Transaction or, if a call-in notice has been given, having given a final notification, or made a final order permitting the Transaction to proceed on terms acceptable to {B} acting reasonably, under section 26 of that Act;","if the Competition and Markets Authority has requested a merger notice or opened a merger inquiry in relation to the Transaction, the Competition and Markets Authority having decided not to make a reference under section 33 of the Enterprise Act 2002, or having accepted undertakings in lieu of a reference on terms acceptable to {B} acting reasonably;","[any other regulatory or third-party consent required for the Transaction]; and","no order or judgment of any court or governmental authority having been made which prohibits the Transaction."]],n:"2"},
  {p:"Where the Transaction is a notifiable acquisition, {B} shall submit a mandatory notice under section 14 of the National Security and Investment Act 2021 within ten (10) Business Days after the date of this Agreement. Each party shall promptly provide such information and assistance as the other reasonably requests for that purpose.",n:"3"},
  {p:"Each party shall notify the other promptly on becoming aware that any Condition has been satisfied, or is unlikely to be satisfied by the Long Stop Date.",n:"4"},
  {p:"{B} may waive the Conditions in paragraphs 2(c) and 2(d) by notice to {S}. The Conditions in paragraphs 2(a) and 2(b) may not be waived.",n:"5"},
  {p:"If any Condition has not been satisfied, or waived, by 5.00 pm on the Long Stop Date, either party may terminate this Agreement by notice to the other, and no party shall have any claim against the other under it, save in respect of any prior breach.",n:"6"}]},
 compl:{t:"Completion Arrangements",e:"The documents each side must hand over at completion. The buyer's lawyers will tick these off on the day.",kinds:["spa"],gen:ctx=>{
  const carve=ctx.a.id==="carve-spa", esc=[0,1].includes(ctx.picks["ma-esc"]);
  const s=["a stock transfer form in respect of the Shares, duly executed by {S} in favour of {B} or its nominee, together with the share certificates for the Shares or an indemnity in the agreed form for any lost certificate","the written resignation of each director and the company secretary of the Company, in the agreed form, each acknowledging that he or she has no claim against the Company","the statutory registers and minute books of the Company, written up to Completion, together with its certificate of incorporation and any certificates of incorporation on change of name","a certified copy of the minutes of a meeting of the directors of the Company approving the registration of the transfer of the Shares (subject only to stamping), appointing the persons nominated by {B} as directors, and revoking all existing bank mandates","deeds of release, in the agreed form, of any Encumbrance over the Shares or the assets of the Company, together with the relevant forms for filing at Companies House","the resignation of the auditors of the Company, accompanied by a statement under section 519 of the Companies Act 2006","the authentication code used to file documents electronically at Companies House on behalf of the Company"];
  if(carve) s.push("the transitional services agreement in the agreed form between {S} and the Company (the “Transitional Services Agreement”), duly executed by {S}","evidence that all balances between the Company and the members of {S}'s retained group have been settled, and that the Company has been released from all guarantees and security given for the obligations of any member of that group");
  s.push("a certificate signed by {S} confirming that the Warranties are true and accurate at Completion");
  const b=[esc?"pay the Consideration, less the Retention Amount, to the client account of {S}'s solicitors, details of which {S} shall give to {B} not less than five (5) Business Days before Completion":"pay the Consideration to the client account of {S}'s solicitors, details of which {S} shall give to {B} not less than five (5) Business Days before Completion"];
  if(esc) b.push("pay the Retention Amount into the Escrow Account in accordance with the Escrow Agreement");
  b.push("deliver to {S} a certified copy of the minutes of a meeting of the directors of {B} authorising the execution and performance of this Agreement");
  if(carve) b.push("procure that the Company executes the Transitional Services Agreement");
  return [{h:"Part 1",s:"Obligations of the "+ctx.a.p[1]},{p:["At Completion, {S} shall deliver, or procure the delivery, to {B} of:",listify(s)],n:"1"},{h:"Part 2",s:"Obligations of the "+ctx.a.p[0]},{p:["At Completion, {B} shall:",listify(b)],n:"2"}];}},
 war:{t:"Warranties",e:"The seller's statements about the company. Choose the strength and the parts included in the drafting panel.",kinds:["spa"],fam:"sch-war",df:{"Intellectual Property Rights":IPR_DEF,"Data Protection Legislation":DPL_DEF,"UK GDPR":UKGDPR_DEF,"Personal Data Breach":"has the meaning given to it in the UK GDPR"},gen:genWar},
 tsvc:{t:"The Services",e:"The catalogue of transitional services. Tick the services the business needs and set how long each is required in the drafting panel.",kinds:["tsa"],edit:true,gen:genTsvc},
 mig:{t:"Migration Plan",e:"How and when each service moves to the buyer's own systems. It updates automatically from the services schedule.",kinds:["tsa"],gen:genMig},
 notices:{t:"Notice Details",e:"Where formal notices must be sent. Get this right: a termination notice sent to the wrong place may be invalid.",always:false,gen:ctx=>{const kd=K[ctx.a.k],ws=[kd.first,kd.first==="B"?"S":"B"];return [{p:"For the purposes of {R:*notice}, the addresses and email addresses of the parties are:",n:""},{tbl:{cols:["Party","Address","Email","For the attention of"],w:[20,36,24,20],rows:ws.map(w=>[ctx.a.p[w==="B"?0:1],(ctx.d.parties[w].ad||"[●]"),"[●]","[●]"])}}]}},
 proc:{t:"Details of Processing",e:"The details Article 28(3) of the UK GDPR requires the contract to record.",kinds:["dpa"],gen:()=>[{tbl:{cols:["Item","Details"],w:[34,66],rows:[["Subject matter","The provision of the Services under the Main Agreement"],["Duration","The term of the Main Agreement, and any period after it until the Customer Data has been deleted or returned"],["Nature and purpose of processing","[●]"],["Types of personal data","[Names, business contact details, ●]"],["Special category data","[None] [●]"],["Categories of data subjects","[employees, customers, ●]"],["Approved sub-processors","[●]"]]}}]},
 sec:{t:"Security Measures",e:"The technical and organisational security measures the processor must maintain, as Article 32 of the UK GDPR requires."},
 credits:{t:"Service Credits",e:"How service credits are calculated for each shortfall below the availability target."},
 targets:{t:"Minimum Purchase Targets",e:"The minimum the distributor must buy in each year to keep exclusivity."},
 acc:{t:"Completion Accounts",e:"The accounting policies and pro forma statement used to prepare the completion accounts. Set out a policy hierarchy: specific policies first, then those used in the last accounts, then FRS 102."},
 leak:{t:"Permitted Leakage",e:"The payments the seller may take out of the company after the locked box date without breaching the leakage covenant."},
 earn:{t:"Earn-out",e:"How the earn-out is measured, calculated, reported and paid, including any dispute procedure."},
 omr:{t:"Rent Review",e:"How the open market rent is assessed: the assumptions and disregards, and the role of the independent surveyor."},
 prices:{t:"Prices",e:"The price list, discounts and any price change mechanism."},
 appo:{t:"Apportionment of the Consideration",e:"How the price is split between the assets. This matters for tax, including capital allowances and stamp duty land tax."},
 svc:{t:"The Services",e:"A description of the services and any service levels."},
 sow:{t:"Form of Statement of Work",e:"The template used to agree each project under the framework."},
 chg:{t:"Charges",e:"The rates, fees and invoicing arrangements."},
 goods:{t:"The Goods and the Specification",e:"A description of the goods and their technical specification."},
 lipr:{t:"The Licensed IPR",e:"The patents, trade marks and other rights licensed, with registration numbers where relevant."},
 products:{t:"The Products",e:"The products covered by the agreement."},
 commission:{t:"Commission",e:"The commission rates and how they are calculated."},
 assets:{t:"The Assets",e:"The assets being sold, such as goodwill, equipment, stock, contracts and intellectual property."},
 excl:{t:"Excluded Assets",e:"The assets the seller keeps, typically cash, tax refunds and assets used in its other businesses."},
 emps:{t:"Employees",e:"The employees who transfer to the buyer under TUPE."},
 premises:{t:"The Premises",e:"A description of the premises, with a plan."},
 rights:{t:"Rights Granted",e:"The rights the tenant has over neighbouring land, such as access, parking and services."},
 reserv:{t:"Rights Reserved",e:"The rights the landlord keeps over the premises, such as entry for repairs."},
 purpose:{t:"Purpose",e:"What the borrower may use the loan for."},
 cps:{t:"Conditions Precedent",e:"The documents and evidence the lender needs before the loan can be drawn."},
 rate:{t:"Compounded Reference Rate",e:"The methodology for compounding SONIA over each interest period, usually in the Loan Market Association form."}
};
Object.assign(K.spa,{sch:["co","cond","compl","war","acc","leak","earn"],fam:["sch-war"],note:"The particulars, conditions, completion and warranty schedules are drafted in full. The accounts and earn-out schedules hold deal-specific figures and are left for you to complete."});
Object.assign(K.apa,{sch:["assets","excl","appo","emps","cond","compl","war","acc","leak"],note:"VAT on a business sale may be avoided under the transfer of a going concern rules, which have strict conditions. The conditions schedule is drafted; asset-specific schedules are left for you to complete."});
Object.assign(K.tsa,{sch:["tsvc","mig","sec"],note:"Tick every service the business actually receives in the services schedule. In carve-outs, gaps in the schedule cause more disputes than any clause, which is why the omitted services clause matters."});
K.services.sch=["svc","sow","chg"]; K.goods.sch=["goods","prices"]; K.licence.sch=["lipr"]; K.distribution.sch=["products","prices","targets"]; K.agency.sch=["products","commission"]; K.lease.sch=["premises","rights","reserv","omr"]; K.loan.sch=["purpose","cps","rate"]; K.dpa.sch=["proc","sec"];
K.spa.defs["agreed form"]="in relation to a document, the form of that document agreed between the parties and initialled by or on their behalf for the purpose of identification";
{const o=K.tsa.order; o.splice(o.indexOf("tsa-scope")+1,0,"tsa-omit");}
GUIDES.find(g=>g.id==="warranties").c.push("sch-war");
GUIDES.find(g=>g.id==="carve-outs").c.push("tsa-omit");
