/* ============================================================
   AGREEMENT KINDS: structure, recitals, core definitions
   ============================================================ */
const ED = "the date of this Agreement";
const K = {
services:{D:"the Deliverables",first:"S",tail:["dr","gl"],
 rec:["{S} carries on the business of providing [●] services.","{B} wishes to engage {S} to provide the Services, and {S} has agreed to do so, on the terms of this Agreement."],
 defs:{"Effective Date":ED,"Services":"the services to be provided by {S} under this Agreement, as described in {SC:svc} and each Statement of Work","Statement of Work":"a statement of work agreed and signed by both parties in the form set out in {SC:sow}","Deliverables":"all documents, products and materials developed by {S} or its agents, subcontractors or personnel as part of, or in relation to, the Services, in any form","Specification":"the description or specification of the Deliverables set out or referred to in the relevant Statement of Work","Charges":"the charges payable by {B} for the Services, as set out in {SC:chg}","Initial Term":"the period of [three (3)] years from the Effective Date"},
 order:["*dur","*svc","war-s","pay","ip","ind","lol","conf","dp","fm","tmb","term","asg"]},
goods:{D:"the Goods",first:"S",tail:["dr","gl"],
 rec:["{S} manufactures and supplies [●].","{B} wishes to purchase, and {S} has agreed to supply, the Goods on the terms of this Agreement."],
 defs:{"Effective Date":ED,"Goods":"the goods described in {SC:goods}, and any goods supplied under an Order","Order":"an order for Goods submitted by {B} in accordance with this Agreement","Specification":"the specification for the Goods set out in {SC:goods}, as amended in writing by agreement between the parties","Delivery Point":"the location specified in the relevant Order","Charges":"the price of the Goods, as set out in {SC:prices}","Initial Term":"the period of [two (2)] years from the Effective Date"},
 order:["*dur","*supply","*deliv","gd-title","war","pay","ind","lol","fm","conf","tmb","term","asg"]},
saas:{D:"the Service",first:"S",tail:["dr","gl"],
 rec:["{S} has developed and makes available the Service on a software-as-a-service basis.","{B} wishes to use the Service in its business operations, and {S} has agreed to provide it on the terms of this Agreement."],
 defs:{"Effective Date":ED,"Service":"the online software service described in the Order Form and the Documentation","Order Form":"the order form signed by both parties setting out the subscription to the Service, the Charges and the Initial Term","Documentation":"the user documentation for the Service made available by {S}, as updated from time to time","Authorised Users":"those employees, agents and independent contractors of {B} authorised by {B} to use the Service, up to the number set out in the Order Form","Subscription Term":"the Initial Term together with any subsequent renewal period","Customer Data":"the data input by {B}, the Authorised Users or {S} on {B}'s behalf for the purpose of using the Service","Charges":"the subscription fees payable by {B} for the Service, as set out in the Order Form","Initial Term":"the initial subscription term set out in the Order Form"},
 order:["*dur","*grant","*cust","sla","susp","pay","price","dp","ind","lol","conf","exit","tmb","term","asg"]},
licence:{D:"the Licensed IPR",first:"S",tail:["dr","gl"],
 rec:["{S} owns, or is otherwise entitled to license, the Licensed IPR.","{B} wishes to obtain, and {S} has agreed to grant, a licence of the Licensed IPR on the terms of this Agreement."],
 defs:{"Effective Date":ED,"Licensed IPR":"the [patents, trade marks, know-how and other] Intellectual Property Rights listed in {SC:lipr}","Licensed Products":"any product made, used or sold by or on behalf of {B} which, but for this Agreement, would infringe any of the Licensed IPR","Field":"[●]","Territory":"[the United Kingdom]","Term":"the period from the Effective Date until the expiry of the last of the Licensed IPR to expire, unless terminated earlier in accordance with this Agreement","Royalties":"[●] per cent. of the Net Sales Value of all Licensed Products","Net Sales Value":"the gross amount invoiced by or on behalf of {B} for Licensed Products, less VAT, trade discounts actually given and amounts credited for returns","Quarter":"each period of three (3) months ending on 31 March, 30 June, 30 September or 31 December","Charges":"the Royalties and all other sums payable by {B} under this Agreement"},
 order:["lic-scope","*roy","lic-imp","lic-war","ind","lol","conf","tmb","asg"]},
distribution:{D:"the Products",first:"S",tail:["dr","gl"],
 rec:["{S} manufactures and sells the Products.","{S} wishes to appoint {B} as its distributor of the Products in the Territory, and {B} wishes to accept that appointment, on the terms of this Agreement."],
 defs:{"Effective Date":ED,"Products":"the products listed in {SC:products}, as amended by {S} from time to time on written notice to {B}","Territory":"[the United Kingdom]","Specification":"{S}'s published specification for each Product at the time of its sale to {B}","Charges":"the price payable by {B} for the Products, calculated in accordance with {SC:prices}","Initial Term":"the period of [three (3)] years from the Effective Date"},
 order:["*dur","dist-excl","*supply-d","*dob","gd-title","war","pay","ind","lol","tmb","term","asg"]},
agency:{D:"the Products",first:"B",tail:["dr","gl"],
 rec:["{B} manufactures and sells the Products.","{B} wishes to appoint {S} as its commercial agent for the Products in the Territory, and {S} wishes to accept that appointment, on the terms of this Agreement."],
 defs:{"Effective Date":ED,"Products":"the products listed in {SC:products}","Territory":"[the United Kingdom]","Customers":"customers and prospective customers for the Products in the Territory","Commission":"the commission payable to {S} at the rates set out in {SC:commission}","Regulations":"the Commercial Agents (Council Directive) Regulations 1993","Initial Term":"the period of [two (2)] years from the Effective Date"},
 order:["*dur","*appt-a","*comm","tmb","agency-comp","conf","asg"]},
spa:{T:"the Company",first:"S",tail:["dr","gl"],
 rec:["The Company is a private company limited by shares incorporated in England and Wales.","{S} is the legal and beneficial owner of the Shares and has agreed to sell, and {B} has agreed to buy, the Shares on the terms of this Agreement."],
 defs:{"Company":"[●] Limited, a company incorporated in England and Wales with registered number [●]","Shares":"all the issued shares in the capital of the Company","Business":"the business carried on by the Company at the date of this Agreement","Completion":"completion of the sale and purchase of the Shares in accordance with this Agreement","Completion Date":"the date falling [five (5)] Business Days after the date on which the last of the Conditions is satisfied or waived, or such other date as the parties may agree in writing","Encumbrance":"any mortgage, charge, pledge, lien, option, restriction, right of first refusal, right of pre-emption, third-party right or interest, or other encumbrance or security interest of any kind","Warranties":"the warranties set out in {SC:war}","Disclosure Letter":"the letter of the same date as this Agreement from {S} to {B}, including the documents annexed to it","Claim":"a claim by {B} for breach of any of the Warranties","Accounts":"the audited accounts of the Company for the financial year ended on the Accounts Date","Accounts Date":"[●]","Tax":"all forms of taxation, duties, imposts and levies, wherever chargeable, together with all related penalties, fines and interest"},
 order:["*sale","*cons","ma-price","ma-mac","*compl","ma-esc","*war-ma","ma-disc","ma-wlim","ma-tax","ma-rc","conf"],
 note:"The Schedules referred to (Conditions, Completion deliverables, Warranties, Completion Accounts) are placeholders for the deal-specific detail."},
apa:{T:"the Business",first:"S",tail:["dr","gl"],
 rec:["{S} carries on the Business.","{S} has agreed to sell, and {B} has agreed to buy, the Business and the Assets as a going concern on the terms of this Agreement."],
 defs:{"Business":"the business of [●] carried on by {S} at the date of this Agreement","Assets":"the property, rights and assets of {S} used in the Business and listed in {SC:assets}, excluding the Excluded Assets","Excluded Assets":"the assets listed in {SC:excl}","Excluded Liabilities":"all liabilities of {S} other than those expressly assumed by {B} under this Agreement","Employees":"the employees of {S} listed in {SC:emps}","Completion":"completion of the sale and purchase of the Business and the Assets in accordance with this Agreement","Completion Date":"the date falling [five (5)] Business Days after the date on which the last of the Conditions is satisfied or waived, or such other date as the parties may agree in writing","Encumbrance":"any mortgage, charge, pledge, lien, option, restriction, right of first refusal, right of pre-emption, third-party right or interest, or other encumbrance or security interest of any kind","Warranties":"the warranties set out in {SC:war}","Disclosure Letter":"the letter of the same date as this Agreement from {S} to {B}, including the documents annexed to it","Claim":"a claim by {B} for breach of any of the Warranties","Accounts":"the audited accounts of {S} for the financial year ended on the Accounts Date","Accounts Date":"[●]"},
 order:["*sale-a","*cons-a","ma-price","ma-mac","*compl","*tupe","ma-esc","*war-ma","ma-disc","ma-wlim","ma-rc","conf"],
 note:"VAT on a business sale may be avoided under the transfer of a going concern rules, which have strict conditions. The Schedules are placeholders."},
tsa:{first:"S",tail:["dr","gl"],
 rec:["Under the SPA, [●] has agreed to sell the Business to [●].","Before Completion, {S} and members of its group provided certain services to the Business. {B} requires those services to continue for a limited period after Completion while it puts in place its own arrangements.","{S} has agreed to provide the Services on the terms of this Agreement."],
 defs:{"SPA":"the agreement for the sale and purchase of [●] dated [●] between [●] and [●]","Business":"the business transferred under the SPA","Completion":"completion of the sale and purchase under the SPA","Effective Date":"the date of Completion","Services":"the transitional services described in {SC:tsvc}","Service Period":"in respect of each Service, the period for which it is to be provided under {R:tsa-term}","Charges":"the charges for the Services calculated in accordance with {R:tsa-price}","Migration Plan":"the plan for the migration of each Service to {B} or a replacement provider set out in {SC:mig}, as amended by written agreement"},
 order:["tsa-scope","tsa-term","tsa-price","tsa-consent","*migr","lol","dp","conf","tmb"],
 note:"List every service the business actually receives in the services schedule. In carve-outs, gaps in the schedule cause more disputes than any clause."},
sha:{first:"B",tail:["gl"],
 rec:["The Company is a private company limited by shares incorporated in England and Wales.","{B} has agreed to subscribe for the Investor Shares, and the parties have agreed to regulate their relationship as shareholders in the Company on the terms of this Agreement."],
 defs:{"Company":"[●] Limited, a company incorporated in England and Wales with registered number [●]","Shares":"shares of any class in the capital of the Company","Investor Shares":"the [Series A preferred] shares in the capital of the Company held by {B}","Board":"the board of directors of the Company","Articles":"the articles of association of the Company from time to time"},
 order:["*board","*info","sha-res","sha-pre","sha-drag","*conflict","conf"],
 note:"In practice the Company is usually also a party, so that it can give the information and consent undertakings directly."},
nda:{first:"S",tail:["gl"],
 rec:["The parties wish to enter into discussions in relation to the Proposed Transaction.","{S} is willing to disclose Confidential Information to {B} for the Purpose on the terms of this Agreement."],
 defs:{"Purpose":"the evaluation and negotiation of the Proposed Transaction","Proposed Transaction":"the proposed [acquisition of [●]]","Representatives":"in relation to a party, its group companies and its and their directors, officers, employees, professional advisers and actual or prospective financiers"},
 order:["nda-def","*use","*excl","nda-term","nda-return","nda-nonsol","*rem","*nowar"],
 note:"For a mutual agreement, choose the side your client is more likely to be on. The obligations in a true mutual form apply equally to both."},
lease:{first:"S",tail:["gl"],deed:true,doc:"Lease",
 rec:[],
 defs:{"Premises":"the premises known as [●], as more particularly described in {SC:premises}","Term":"the term of [ten (10)] years from and including the Term Commencement Date","Term Commencement Date":"[●]","Rent":"£[●] a year (exclusive of VAT), subject to review in accordance with this Lease","Permitted Use":"{U}","Quarter Days":"25 March, 24 June, 29 September and 25 December"},
 order:["*demise","*rentpay","ls-rent","*use-l","ls-repair","ls-alien","ls-break","ls-1954"],
 note:"A lease for more than seven years must be registered at HM Land Registry and must begin with the prescribed clauses (LR1 to LR14) required by rule 58A of the Land Registration Rules 2003. A lease for more than three years must be made by deed."},
loan:{first:"B",tail:["gl"],
 rec:[],
 defs:{"Facility":"the term loan facility made available under this Agreement","Loan":"the loan made, or to be made, under the Facility, or the principal amount outstanding of that loan","Finance Document":"this Agreement, any fee letter and any other document designated as such by {S} and {B}","Margin":"[●] per cent. per annum","Compounded Reference Rate":"the rate calculated in accordance with {SC:rate} by reference to SONIA (the Sterling Overnight Index Average)","Interest Period":"each period of [three (3)] months, the first beginning on the date of utilisation","Termination Date":"{TD}","Group":"{B} and each of its subsidiaries"},
 order:["*fac","*util","*int","*repay","fin-prepay","fin-cov","fin-eod"],
 note:"Based on Loan Market Association conventions. A full facility agreement also contains detailed representations, information undertakings and general undertakings."},
emp:{first:"B",tail:["gl"],ind:"S",
 rec:[],
 defs:{"Employment":"the employment of {S} by {B} under this Agreement","Group Company":"{B}, any subsidiary or holding company of {B}, and any subsidiary of any such holding company","Termination Date":"the date on which the Employment terminates","Confidential Information":"information in whatever form relating to the business, customers, products, finances, plans or employees of {B} or any Group Company which is confidential or which {S} is told or ought reasonably to know is confidential"},
 order:["*appt-e","*pay-e","*hours","*hol","*conf-e","emp-notice","emp-rc"],
 note:"An employee must receive a written statement of the particulars required by section 1 of the Employment Rights Act 1996 on or before their first day of work."},
dpa:{first:"B",tail:["gl"],
 rec:["The parties have entered into the Main Agreement, under which {S} processes Personal Data on behalf of {B}.","This Agreement sets out the terms on which {S} shall process that Personal Data, as required by Article 28 of the UK GDPR."],
 defs:{"Effective Date":ED,"Main Agreement":"the agreement dated [●] between the parties for the provision of [●]","Customer Data":"the Personal Data processed by {S} on behalf of {B} under the Main Agreement","Charges":"the charges payable under the Main Agreement","Services":"the services provided under the Main Agreement"},
 order:["*scope-d","dp","*intl","exit","lol","conf"]}
};

/* ============================================================
   AGREEMENT TREE
   A(id, name, buy-side party, sell-side party, kind, description, extra)
   ============================================================ */
const A=(id,n,b,s,k,d,x)=>Object.assign({id,n,p:[b,s],k,d},x||{});
const SVC_O=K.services.order;
const TREE=[
{n:"Corporate and M&A",k:[
 {n:"Share and business sales",k:[
  A("spa","Share Purchase Agreement","Buyer","Seller","spa","Sale of the entire issued share capital of a private company, with warranties, tax covenant and price mechanics."),
  A("spa-earn","Share Purchase Agreement with Earn-out","Buyer","Seller","spa","Share sale in which part of the price depends on the target's performance after completion.",{o:["*sale","*cons","ma-price","ma-earn","ma-mac","*compl","ma-esc","*war-ma","ma-disc","ma-wlim","ma-tax","ma-rc","conf"]}),
  A("carve-spa","Carve-out Share Purchase Agreement","Buyer","Seller","spa","Sale of a subsidiary separated from a wider group, usually signed alongside a TSA."),
  A("apa","Asset Purchase Agreement","Buyer","Seller","apa","Purchase of a business and selected assets as a going concern, with employees transferring under TUPE."),
  A("bta","Business Transfer Agreement","Transferee","Transferor","apa","Transfer of a business as a going concern, often within a group before a sale.")]},
 {n:"Carve-out support",k:[
  A("tsa","Transitional Services Agreement","Recipient","Provider","tsa","Seller continues to provide IT, finance and other services to the sold business for a limited period."),
  A("ltsa","Long-term Services Agreement","Customer","Supplier","services","Ongoing services between the seller's group and the sold business after the transition period."),
  A("licback","IP Licence-back Agreement","Licensee","Licensor","licence","Licenses back intellectual property that both the retained and the sold business continue to need."),
  A("ttml","Transitional Trade Mark Licence","Licensee","Licensor","licence","Allows the sold business to keep using the seller's brand for a limited period while it rebrands.")]},
 {n:"Investment",k:[
  A("sha","Shareholders' Agreement","Investor","Founder","sha","Governs the relationship between an investor and the founder of a private company.")]},
 {n:"Confidentiality",k:[
  A("nda-ma","M&A Confidentiality Agreement","Bidder","Seller","nda","Signed by a potential buyer before it is given access to information about a target."),
  A("nda-1","One-way Confidentiality Agreement","Recipient","Discloser","nda","Only one party discloses confidential information."),
  A("nda-m","Mutual Confidentiality Agreement","Recipient","Discloser","nda","Both parties expect to share confidential information.")]}
]},
{n:"Commercial",k:[
 {n:"Goods",k:[
  A("supply","Supply of Goods Agreement","Buyer","Seller","goods","Long-term supply of products on agreed terms."),
  A("framework","Framework Purchase Agreement","Buyer","Seller","goods","Umbrella terms for orders placed over time, with no minimum commitment."),
  A("manuf","Manufacturing Agreement","Customer","Manufacturer","goods","Contract manufacture of products to the customer's specification.")]},
 {n:"Services",k:[
  A("msa","Master Services Agreement","Customer","Supplier","services","Framework terms under which individual statements of work are agreed."),
  A("consult","Consultancy Agreement","Client","Consultant","services","Engagement of a consultancy firm on a project or ongoing basis."),
  A("psa","Professional Services Agreement","Client","Provider","services","Advisory or project-based professional services."),
  A("facm","Facilities Management Agreement","Customer","Contractor","services","Cleaning, maintenance and other building services."),
  A("mkt","Marketing Services Agreement","Client","Agency","services","Creative, media and digital marketing services.")]},
 {n:"Routes to market",k:[
  A("dist","Distribution Agreement","Distributor","Supplier","distribution","A distributor buys products and resells them in its territory."),
  A("resell","Reseller Agreement","Reseller","Vendor","distribution","A reseller buys and resells a vendor's products."),
  A("agency","Commercial Agency Agreement","Principal","Agent","agency","An agent negotiates sales of goods on behalf of a principal.")]},
 {n:"Outsourcing",k:[
  A("bpo","Business Process Outsourcing Agreement","Customer","Supplier","services","Transfers a business function, such as payroll or customer service, to a provider.",{o:SVC_O.concat(["exit"])}),
  A("ito","IT Outsourcing Agreement","Customer","Supplier","services","Transfers the running of IT infrastructure or applications to a provider.",{o:SVC_O.concat(["exit"])})]}
]},
{n:"Technology and data",k:[
 {n:"Software and cloud",k:[
  A("saas","SaaS Subscription Agreement","Customer","Supplier","saas","Subscription access to cloud-hosted software."),
  A("hosting","Cloud Hosting Agreement","Customer","Provider","saas","Hosting and infrastructure services."),
  A("swlic","Software Licence Agreement","Licensee","Licensor","licence","Licence to install and use software on the licensee's own systems."),
  A("dev","Software Development Agreement","Customer","Developer","services","Bespoke software developed to the customer's requirements.",{o:["*dur","*svc","dev-acc","war-s","pay","ip","ind","lol","conf","dp","fm","tmb","term","asg"]}),
  A("support","Support and Maintenance Agreement","Customer","Supplier","services","Bug fixing, updates and helpdesk support for existing systems.")]},
 {n:"Data",k:[
  A("dpa","Data Processing Agreement","Controller","Processor","dpa","Article 28 terms for a processor handling personal data on a controller's behalf.")]}
]},
{n:"Intellectual property",k:[
 {n:"Licensing",k:[
  A("patlic","Patent Licence","Licensee","Licensor","licence","Rights to make, use and sell products protected by patents."),
  A("tmlic","Trade Mark Licence","Licensee","Licensor","licence","Rights to use a brand on products or services."),
  A("khlic","Know-how Licence","Licensee","Licensor","licence","Rights to use confidential technical knowledge.")]}
]},
{n:"Finance",k:[
 {n:"Lending",k:[
  A("loan","Term Loan Facility Agreement","Borrower","Lender","loan","Bilateral sterling term loan, repaid at the end of its term.",{TD:"the date falling [five (5)] years after the date of this Agreement"}),
  A("bridge","Bridge Facility Agreement","Borrower","Lender","loan","Short-term funding pending a refinancing or disposal.",{TD:"the date falling [twelve (12)] months after the date of this Agreement"})]}
]},
{n:"Real estate",k:[
 {n:"Leases",k:[
  A("office","Office Lease","Tenant","Landlord","lease","Lease of office premises.",{U:"use as offices within Class E(g)(i) of the Town and Country Planning (Use Classes) Order 1987"}),
  A("retail","Retail Lease","Tenant","Landlord","lease","Lease of a shop or other retail unit.",{U:"use for the display or retail sale of goods, other than hot food, within Class E(a) of the Town and Country Planning (Use Classes) Order 1987"}),
  A("indl","Industrial Lease","Tenant","Landlord","lease","Lease of a warehouse or industrial unit.",{U:"use for storage or distribution within Class B8 of the Town and Country Planning (Use Classes) Order 1987"})]}
]},
{n:"Employment",k:[
 {n:"Contracts of employment",k:[
  A("exec","Executive Service Agreement","Employer","Executive","emp","Contract for a director or senior executive."),
  A("empc","Employment Contract","Employer","Employee","emp","Contract of employment for an employee.")]}
]}
];
