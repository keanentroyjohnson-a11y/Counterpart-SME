/* ============================================================
   GUIDANCE: English law in plain English
   b: paragraphs; {h:"..."} is a sub-heading; {k:"..."} is a key-point box
   ============================================================ */
const GUIDES = [
{id:"reading",t:"How to read a commercial agreement",cat:"Foundations",s:"The standard structure of an English law agreement, and where the commercial deal actually sits.",b:[
"Most agreements governed by English law follow the same pattern. They open with the date and the parties, then a short background section (the recitals), then the definitions, the operative clauses and the boilerplate, and they end with the signature blocks. Schedules at the back hold the deal-specific detail, such as prices, specifications or warranties.",
{h:"Where the deal lives"},
"The commercial bargain is in the operative clauses: what is supplied, the price, the promises each side makes, and what happens if things go wrong. The definitions matter just as much, because a single defined term can change the meaning of every clause that uses it. Always read a definition the first time you meet the capitalised word.",
{h:"Recitals and boilerplate"},
"Recitals explain the background and do not usually create obligations, though a court may use them to interpret an unclear clause. Boilerplate clauses at the end, such as entire agreement and notices, look routine but can decide a dispute. A termination notice sent to the wrong address can be invalid.",
{k:"When reviewing a draft, read the definitions, the liability clause and the termination clause first. Between them they decide most of the risk."}],c:["lol","tmb"]},

{id:"liability",t:"Limiting liability: caps, exclusions and the law that polices them",cat:"Risk",s:"How liability caps work, what cannot be excluded, and why consequential loss means less than people think.",b:[
"A limitation of liability clause sets the most a party can be made to pay. Most clauses combine three things: a list of liabilities that are never limited, a list of types of loss that cannot be claimed at all, and a financial cap on everything else.",
{h:"What you can never exclude"},
"Under the Unfair Contract Terms Act 1977, a business cannot exclude or limit liability for death or personal injury caused by negligence. Liability for a party's own fraud cannot be excluded either. Most clauses say this expressly, so that the rest of the clause is not attacked for overreaching.",
{h:"The reasonableness test"},
"Where one party deals on the other's written standard terms, any other exclusion or cap must be reasonable in the light of what the parties knew when they contracted. Courts look at bargaining strength, whether the cap relates to the contract value and whether insurance was available. Heavily negotiated clauses between sophisticated businesses are usually upheld.",
{h:"Consequential loss"},
"Under English law, indirect or consequential loss traditionally means only loss that does not arise naturally from the breach, the second limb of Hadley v Baxendale (1854). Excluding it therefore removes surprisingly little. If you want to exclude lost profits or lost data, you must name them expressly.",
{h:"Annual or aggregate caps"},
"A cap may apply per claim, per year or over the whole contract. An annual cap that resets each year gives the customer more protection over a long contract. Check whether the cap refers to charges paid or charges payable: in the first year, those figures can be very different.",
{k:"Read the cap together with the carve-outs. A low cap with uncapped data protection and confidentiality liability can be riskier for a supplier than a higher cap with none."}],c:["lol","ma-wlim"]},

{id:"indemnities",t:"Damages and indemnities: why the difference matters",cat:"Risk",s:"An indemnity is a promise to pay a defined loss. It works differently from a claim for breach of contract.",b:[
"When a party breaks a contract, the other party can claim damages. It must prove the breach, show that the breach caused its loss, show that the loss was not too remote, and show that it took reasonable steps to reduce the loss.",
"An indemnity is different. It is a promise to pay for a specified loss whenever it arises, whether or not there has been a breach. Depending on the wording, it may avoid arguments about remoteness and mitigation, and it can be drafted to cover legal costs in full.",
{h:"Why parties fight over indemnities"},
"Because an indemnity can be more valuable than a damages claim, the party giving it usually wants it capped, limited to specific risks such as third-party IP claims, and subject to a claims process. The process normally requires prompt notice, no admissions and handing over conduct of the claim.",
{h:"Common traps"},
"Courts construe indemnities strictly. An indemnity against a party's own negligence must say so clearly. An indemnity for losses arising from any breach of contract can effectively turn every breach into an uncapped debt, so check how it interacts with the liability cap.",
{k:"If you rely on an indemnity, diarise the notice requirements. Late notice is one of the most common reasons an indemnity claim fails."}],c:["ind","lol","ma-tax"]},

{id:"warranties",t:"Warranties, representations and disclosure",cat:"Risk",s:"What a warranty is, how it differs from a representation, and how disclosure reduces a seller's exposure.",b:[
"A warranty is a contractual promise that a statement of fact is true. If it is not, the other party can claim damages for the loss caused, measured by putting it in the position it would have been in had the statement been true.",
"A representation is a statement that persuades someone to enter into a contract. If it is false, the Misrepresentation Act 1967 may allow the innocent party to rescind the contract or claim damages on a different basis. Sellers in share sales therefore usually insist that statements are given as warranties only, and that an entire agreement clause excludes reliance on anything else.",
{h:"Disclosure"},
"In an acquisition, the seller reduces its exposure by disclosing exceptions to the warranties in a disclosure letter. A matter is only properly disclosed if it is disclosed fairly, with enough detail for a reasonable buyer to understand its nature and scope. Whether a buyer can claim for a problem it already knew about is not settled by English law, so the agreement should say expressly.",
{h:"Warranties in supply contracts"},
"In contracts for goods and services, statute implies terms about description, quality, fitness for purpose and reasonable care and skill. Between businesses, these can be excluded only where the exclusion is reasonable. The implied term that the seller has the right to sell the goods can never be excluded.",
{k:"For a buyer, warranties are only as good as the limitations clause allows. Always read them together."}],c:["ma-disc","ma-wlim","war","war-s","lic-war"]},

{id:"termination",t:"Ending a contract: termination rights",cat:"Risk",s:"When a contract can be ended, the meaning of material breach, and the ban on terminating for insolvency.",b:[
"At common law, a party can end a contract only for a repudiatory breach: one that goes to the root of the contract or shows that the other party no longer intends to perform. That is a high bar, so most contracts add express termination rights.",
{h:"Material breach"},
"Express rights usually allow termination for a material breach. Material means serious, but less serious than repudiatory. Courts look at the breach in the context of the whole contract. A cure period gives the breaching party a chance to put things right first.",
{h:"Termination for convenience"},
"A right to terminate for convenience lets a party leave without any breach. Suppliers often ask for a minimum term or a termination fee in return, to protect their investment in the relationship.",
{h:"The insolvency rule"},
"Since the Corporate Insolvency and Governance Act 2020, a supplier generally cannot terminate a contract for the supply of goods or services, or demand payment of old debts as a condition of continuing, because the customer has entered an insolvency procedure such as administration (Insolvency Act 1986, section 233B). Insolvency termination clauses still work in favour of customers.",
{h:"Getting the mechanics right"},
"Termination is often lost on technicalities. Follow the notice clause precisely, give the cure period in full and do not keep performing as if nothing had happened, which can amount to affirming the contract.",
{k:"Before terminating, check the notice clause, any cure period and whether termination triggers a fee or exit obligations."}],c:["tmb","term","susp","agency-comp"]},

{id:"penalties",t:"Penalties, termination fees and service credits",cat:"Risk",s:"When a payment triggered by breach is unenforceable, and how to draft fees and credits that work.",b:[
"English law will not enforce a penalty. Since Cavendish Square Holding v Makdessi [2015] UKSC 67, the test is whether a payment triggered by a breach imposes a detriment out of all proportion to any legitimate interest of the innocent party in performance. The old idea of a genuine pre-estimate of loss is no longer the test.",
{h:"What falls outside the rule"},
"The rule applies only to secondary obligations, triggered by breach. A fee payable for exercising a right, such as a fee to terminate for convenience, is a primary obligation and is generally outside the rule altogether.",
{h:"Service credits"},
"Service credits reduce the price when service levels are missed. Describing them as a price adjustment that reflects reduced value, and keeping them proportionate, helps them survive challenge. Say expressly whether they are the customer's only remedy.",
{h:"Late payment interest"},
"If a business contract has no substantial remedy for late payment, the Late Payment of Commercial Debts (Interest) Act 1998 implies interest at 8% above the Bank of England base rate. Agreeing a lower contractual rate is common, but the rate must still be a substantial remedy.",
{k:"Link any fixed payment on breach to a real commercial interest, and record that interest in the agreement."}],c:["term","sla","pay","price"]},

{id:"force-majeure",t:"Force majeure and frustration",cat:"Risk",s:"Relief for events outside a party's control depends entirely on what the contract says.",b:[
"English law has no general doctrine of force majeure. A party is excused from performing because of an outside event only if the contract says so, so the definition and the consequences need care.",
{h:"What a good clause covers"},
"A clause usually defines the qualifying events, requires the affected party to notify promptly and to mitigate, suspends the obligations affected, and allows termination if the event lasts too long. Customers often exclude supply chain failures and staff shortages, because the supplier should have planned for them.",
{h:"Reasonable endeavours to overcome"},
"In RTI v MUR Shipping [2024] UKSC 18, the Supreme Court held that a duty to use reasonable endeavours to overcome a force majeure event does not require a party to accept performance in a way the contract does not require, such as payment in a different currency.",
{h:"Frustration"},
"If there is no clause, the only fallback is frustration, which ends the contract automatically when an event makes performance impossible or radically different. Courts apply it narrowly. The Brexit vote did not frustrate a long lease (Canary Wharf v European Medicines Agency [2019] EWHC 335 (Ch)).",
{k:"Check whether payment obligations are suspended, and who carries the cost of the delay."}],c:["fm"]},

{id:"ip",t:"Who owns intellectual property created under a contract",cat:"Rights",s:"The default rules on ownership, and why written assignments and licences matter.",b:[
"The default rules surprise many clients. An employer owns copyright in work created by an employee in the course of employment (Copyright, Designs and Patents Act 1988, s.11(2)), and inventions are dealt with in a similar way under section 39 of the Patents Act 1977. But a contractor or consultancy owns what it creates unless the contract says otherwise, even if the client paid for it.",
{h:"Assignments"},
"To transfer copyright, there must be a written assignment signed by the owner (s.90(3)). A promise to assign in the future is not the same as an assignment now, so clauses usually assign future rights in present terms. Moral rights, such as the right to be named as author, cannot be assigned but can be waived.",
{h:"Background and foreground"},
"Suppliers bring their own tools, code and methods, called background IPR. A common compromise is that the customer owns what is created specifically for it, while the supplier keeps its background IPR and grants the customer a licence to use whatever is built into the deliverables.",
{h:"Licences"},
"An exclusive licence excludes everyone, including the owner. A sole licence excludes other licensees but not the owner. A non-exclusive licence excludes nobody. An exclusive licensee of a patent can sue infringers in its own name (Patents Act 1977, s.67).",
{k:"If ownership matters, never rely on the default rules. Put a written assignment in the agreement."}],c:["ip","lic-scope","lic-imp","lic-war","ind"]},

{id:"confidentiality",t:"Confidentiality and NDAs",cat:"Rights",s:"What a confidentiality agreement protects, and the points that are actually negotiated.",b:[
"Confidential information is partly protected by the law of confidence even without a contract, but a written agreement makes the scope, duration and remedies clear and much easier to enforce.",
{h:"The points that matter"},
"The negotiation usually turns on five points: how broadly confidential information is defined; who it can be shared with (the representatives); the standard exceptions, such as information already public; how long the obligations last; and what happens to the information when talks end.",
{h:"Remedies"},
"The main remedy for a threatened leak is an injunction, because damages often cannot repair the harm. Agreements usually record that damages may not be an adequate remedy, which supports an application to court.",
{h:"Extras in M&A"},
"Sellers often add a non-solicitation covenant to stop bidders poaching staff they meet, and sometimes a standstill to stop a bidder buying shares in a listed target. These are restrictions of trade and must be reasonable to be enforceable.",
{k:"Check that the agreement allows disclosure to financiers and advisers. A bidder that cannot share information with its bank cannot complete a deal."}],c:["nda-def","nda-term","nda-return","nda-nonsol","conf"]},

{id:"data",t:"Data protection in contracts",cat:"Rights",s:"Controllers and processors, the terms Article 28 requires, and international transfers.",b:[
"Under the UK GDPR, a controller decides why and how personal data is processed. A processor processes it on the controller's behalf. A supplier running a system for a customer is usually a processor.",
{h:"Article 28 terms"},
"A controller must only use processors that give sufficient guarantees, and the contract between them must contain the terms listed in Article 28(3) UK GDPR. They include processing only on documented instructions, confidentiality, security measures, controls on sub-processors, assistance with data subject rights, deletion or return of data at the end, and audit rights. A general promise to comply with the law does not meet the requirement.",
{h:"International transfers"},
"Personal data may leave the UK only to a country covered by UK adequacy regulations, or with appropriate safeguards such as the International Data Transfer Agreement or the UK Addendum to the EU standard contractual clauses.",
{h:"Liability and enforcement"},
"Data subjects can claim compensation from controllers and processors (Article 82). The Information Commissioner can fine up to £17.5 million or 4% of worldwide annual turnover, whichever is higher. Customers therefore often push for data protection liability to sit outside the cap. The UK regime has been amended by the Data (Use and Access) Act 2025.",
{k:"Identify the role of each party first. The right contract terms depend on whether a party is a controller, a processor or a joint controller."}],c:["dp","exit"]},

{id:"price-mechanisms",t:"Share sales: price, conditions and earn-outs",cat:"Corporate",s:"Completion accounts and locked boxes, conditions to completion, retentions and earn-outs.",b:[
"In a share sale, the headline price usually assumes a business that is cash free and debt free with a normal level of working capital. There are two main ways to make sure the buyer pays for what it actually gets.",
{h:"Completion accounts"},
"Accounts are drawn up after completion, and the price is adjusted for the actual net debt and working capital. This is accurate but slower, and disputes over the accounts are common. The party that prepares the first draft has an advantage.",
{h:"Locked box"},
"The price is fixed by reference to a balance sheet at a date before signing. No adjustment is made afterwards, so the buyer is protected by a promise that no value has leaked out to the seller since the locked box date. Sellers like the certainty. Buyers must review the leakage definitions closely.",
{h:"Conditions and walk-away rights"},
"Completion may depend on conditions such as merger control or National Security and Investment Act 2021 clearance. Notification is mandatory in 17 sensitive sectors, and a deal completed without the required clearance is void. A material adverse change clause lets a buyer walk away if the target deteriorates, and is fiercely negotiated.",
{h:"Retentions and earn-outs"},
"A retention holds back part of the price as security for claims. An earn-out makes part of the price depend on future performance. Earn-outs often lead to disputes, because the buyer controls the business that generates the numbers, so the operating rules need to be written down.",
{k:"A locked box shifts risk to the buyer from the locked box date. Check what happens to trading profits in the gap before completion."}],c:["ma-price","ma-mac","ma-esc","ma-earn"]},

{id:"carve-outs",t:"Carve-outs and transitional services",cat:"Corporate",s:"Why a sold business needs services from its former group, and how a TSA allocates the risk.",b:[
"When a business is carved out of a larger group, it often depends on group systems and people for IT, payroll, finance, HR and premises. It cannot replace them all on day one, so the seller agrees to keep providing them for a limited period under a transitional services agreement.",
{h:"The services schedule"},
"The schedule of services is the heart of a TSA. Anything not listed is usually not provided. Work through every function the business uses, including things that are easy to forget such as software licences, shared mailboxes and access to historic data.",
{h:"Standard and price"},
"Sellers are not service businesses, so they resist a high standard and usually price services at or near cost. The common compromise is the same standard as before completion, at cost plus a small margin, with price increases if the buyer overruns.",
{h:"Third-party consents"},
"Many contracts, particularly software licences, only permit use within the licensee's group. Once the business leaves the group, the vendor's consent is needed, and vendors often charge for it. Allocate this cost expressly.",
{h:"Exit"},
"Agree a migration plan and timetable. Reverse TSAs, where the sold business provides services back to the seller, are common and need the same care.",
{k:"Start the TSA schedule early in the deal. It takes longer than the agreement itself."}],c:["tsa-scope","tsa-term","tsa-price","tsa-consent"]},

{id:"covenants",t:"Restrictive covenants: what courts will enforce",cat:"Corporate",s:"Non-competes, non-solicits and how English courts decide whether they are enforceable.",b:[
"A covenant that restricts someone from competing or from soliciting customers or staff is a restraint of trade. It is void unless it protects a legitimate interest, such as goodwill, customer connections or confidential information, and goes no further than reasonably necessary to do so.",
{h:"Business sales and employment"},
"Courts are more generous where restrictions are given by a seller on the sale of a business, because the buyer has paid for the goodwill. Employee restrictions are scrutinised more closely, particularly non-competes. Restrictions are judged as at the date they were agreed, not when they are enforced.",
{h:"Over-wide covenants"},
"A court will not rewrite a covenant to make it reasonable. It may remove words that can be cut out without changing the meaning of the rest (Tillman v Egon Zehnder [2019] UKSC 32). Drafting each restriction as a separate obligation helps.",
{h:"Practical drafting"},
"Tie restrictions to the employee's actual role, the clients they actually dealt with and a recent period, typically the last twelve months. Reduce post-employment restrictions by any period of garden leave. The government has consulted on reforming non-competes in employment contracts, so check the current position before relying on one.",
{k:"A shorter covenant that a court will enforce is worth more than a long one that it will not."}],c:["ma-rc","emp-rc","nda-nonsol","sha-res","sha-drag","sha-pre","emp-notice"]},

{id:"competition",t:"Competition law in commercial agreements",cat:"Rights",s:"Which restrictions in distribution and licensing agreements are lawful.",b:[
"The Competition Act 1998 prohibits agreements that restrict competition. Many restrictions in supply and distribution agreements are permitted under the Vertical Agreements Block Exemption Order 2022, provided the parties' market shares do not exceed 30%.",
{h:"Hardcore restrictions"},
"Some restrictions remove the benefit of the exemption entirely. They include fixing the price at which a distributor resells, and most restrictions on where or to whom a distributor may sell. A supplier may restrict active selling into territories reserved to other exclusive distributors, but generally cannot restrict passive sales made in response to unsolicited requests.",
{h:"Licensing"},
"In technology licensing, obligations to assign or exclusively license improvements back to the licensor, and restrictions on challenging the validity of the licensed rights, attract particular scrutiny.",
{h:"Consequences"},
"Restrictions that infringe the prohibition are void, and the Competition and Markets Authority can fine businesses up to 10% of worldwide turnover.",
{k:"Never include resale price maintenance. Recommended or maximum resale prices are generally acceptable."}],c:["dist-excl","lic-imp"]},

{id:"property",t:"Commercial leases: rent, repair, breaks and renewal",cat:"Property",s:"The clauses that decide the cost and flexibility of a commercial lease.",b:[
"A commercial lease is a long-term commitment, and its cost depends as much on the repair, review and alienation clauses as on the headline rent.",
{h:"Rent review"},
"Reviews may be to open market rent or by reference to an index such as CPI or RPI. Upward-only open market reviews remain common in England and mean the rent never falls. Indexed reviews are predictable but compound over time.",
{h:"Repair"},
"A full repairing lease makes the tenant responsible for the whole building. A covenant to put the premises into repair can require the tenant to improve them beyond their original condition. A schedule of condition limits the tenant to returning the premises as it found them. Damages for disrepair are capped at the fall in value of the landlord's interest (Landlord and Tenant Act 1927, s.18).",
{h:"Break clauses"},
"Courts apply break conditions strictly. A small arrear or failure to give vacant possession can defeat a break. A tenant has no automatic right to a refund of rent paid in advance for the period after the break date unless the lease provides one (Marks and Spencer v BNP Paribas [2015] UKSC 72).",
{h:"Security of tenure"},
"Under Part II of the Landlord and Tenant Act 1954, a business tenant can usually renew its lease at the end of the term. The parties can contract out, but only by completing the statutory notice and declaration before the tenant is committed.",
{h:"Formalities"},
"A lease for more than three years must be made by deed. A lease for more than seven years must be registered at HM Land Registry and must start with the prescribed clauses.",
{k:"For a tenant, the break conditions and the repair standard are often worth more negotiating time than the rent."}],c:["ls-rent","ls-break","ls-repair","ls-alien","ls-1954"]},

{id:"finance",t:"Loan agreements: covenants, defaults and prepayment",cat:"Finance",s:"How a facility agreement protects the lender, and where a borrower should push back.",b:[
"Most UK facility agreements are based on Loan Market Association documents. The commercial negotiation focuses on the financial covenants, the events of default and the cost of repaying early.",
{h:"Financial covenants"},
"Maintenance covenants require the borrower to stay within financial ratios, such as leverage, tested every quarter. Headroom between the covenant level and the business plan matters as much as the ratio itself. An equity cure lets shareholders inject money to fix a breach.",
{h:"Events of default"},
"An event of default lets the lender cancel the facility and demand immediate repayment. Borrowers negotiate grace periods, materiality thresholds and minimum amounts for cross-default. A material adverse change event of default gives the lender a broad discretion and is often resisted.",
{h:"Interest and prepayment"},
"Sterling loans now usually reference SONIA, the overnight rate published by the Bank of England, compounded over each interest period. Lenders seek prepayment fees to protect their expected return, ranging from a small soft call to a full make-whole payment.",
{k:"Model the covenants against a downside case before signing. Defaults are usually triggered by a tight covenant, not a missed payment."}],c:["fin-cov","fin-eod","fin-prepay"]},

{id:"disputes",t:"Governing law, courts and arbitration",cat:"Disputes",s:"Choosing English law, choosing a forum, and making sure a judgment can be enforced.",b:[
"The governing law decides how the contract is interpreted. The jurisdiction or arbitration clause decides where disputes are heard. They are separate choices, and both should be made expressly.",
{h:"English courts"},
"An exclusive jurisdiction clause in favour of the English courts gives certainty. English judgments can be enforced in many countries under the Hague Choice of Court Convention 2005 and, from 1 July 2025, the Hague Judgments Convention 2019. Enforcement elsewhere depends on local law, so check where the other party's assets are.",
{h:"Arbitration"},
"Arbitration is private, the parties choose the tribunal, and awards can be enforced in over 170 countries under the New York Convention. It is often preferred where the other party is overseas. Under the Arbitration Act 2025, the law of the seat governs the arbitration agreement unless the parties expressly agree otherwise.",
{h:"Asymmetric clauses"},
"An asymmetric clause limits one party to the English courts while allowing the other to sue anywhere. They are common in finance and are upheld by the English courts, but courts in some other countries have questioned them.",
{h:"Before going to court"},
"Escalation and mediation clauses encourage settlement. English courts can now order parties to engage in mediation or other dispute resolution (Churchill v Merthyr Tydfil County Borough Council [2023] EWCA Civ 1416).",
{k:"Choose the forum by asking where you would need to enforce a judgment, not where it would be convenient to sue."}],c:["gl","dr"]},

{id:"boilerplate",t:"Boilerplate clauses: what they actually do",cat:"Foundations",s:"The standard clauses at the end of every agreement, and when they make a difference.",b:[
"Boilerplate clauses are rarely negotiated, but they regularly decide disputes.",
{h:"Entire agreement"},
"Confirms that the written agreement is the whole deal, so that earlier emails and discussions cannot add terms. Combined with a non-reliance statement, it also helps exclude claims for misrepresentation, although liability for fraud can never be excluded.",
{h:"Variation"},
"Requires changes to be in writing and signed. The Supreme Court has confirmed that such a clause is effective, so an oral agreement to vary will not usually bind the parties (Rock Advertising v MWB Business Exchange Centres [2018] UKSC 24).",
{h:"Third party rights"},
"Under the Contracts (Rights of Third Parties) Act 1999, a third party can enforce a term that purports to benefit it. Most agreements exclude this, then give rights expressly to anyone who should have them, such as group companies under an indemnity.",
{h:"Notices"},
"Sets out how formal notices must be served and when they are treated as received. Many termination disputes turn on whether a notice was validly served, so follow the clause exactly.",
{h:"Severance and counterparts"},
"Severance keeps the rest of the agreement alive if one provision is invalid. Counterparts allows each party to sign a separate copy.",
{k:"Check the notices clause before any important deadline. Email is valid only if the clause allows it."}],c:["asg"]},

{id:"endeavours",t:"Best, all reasonable and reasonable endeavours",cat:"Foundations",s:"How much effort each endeavours obligation requires under English law.",b:[
"Endeavours clauses are used when a party cannot guarantee a result but commits to trying. The wording sets how hard it must try.",
{h:"Best endeavours"},
"The most onerous. A party must take all the reasonable steps it can to achieve the objective, and may have to act against its own commercial interests, although not to the point of ruin.",
{h:"All reasonable endeavours"},
"A middle standard. It may require some sacrifice of a party's own commercial interests (Rhodia International Holdings v Huntsman International [2007] EWHC 292 (Comm)), but less than best endeavours.",
{h:"Reasonable endeavours"},
"The lightest standard. A party can balance the objective against its own commercial interests and need take only one reasonable course of action.",
{k:"The meaning depends on context, so where it matters, list the specific steps a party must take or need not take."}],c:["tsa-scope","sla"]},

{id:"execution",t:"Signing agreements and deeds",cat:"Foundations",s:"How agreements and deeds are validly signed under English law, including electronic signatures.",b:[
"A simple contract needs an offer, acceptance, consideration and an intention to create legal relations. It can usually be signed in any way, including electronically.",
{h:"Deeds"},
"A deed does not need consideration, has a twelve-year limitation period instead of six (Limitation Act 1980, ss.5 and 8), and is required for some documents, including leases of more than three years and powers of attorney. An individual's signature on a deed must be witnessed.",
{h:"Companies"},
"A company can sign a document by two authorised signatories (two directors, or a director and the company secretary), or by one director in the presence of a witness (Companies Act 2006, s.44).",
{h:"Electronic signatures"},
"Electronic signatures are valid under English law for most documents, as the Law Commission confirmed in 2019. Some registries, such as HM Land Registry, have their own requirements. Witnessed deeds still need the witness to be physically present.",
{k:"For a deed, check that it states on its face that it is executed as a deed and that every signature is properly witnessed."}],c:[]}
];
