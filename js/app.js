// Workflow interactions for the SocMgt product page.
function updateCalculator(units) {
  const count = Math.max(50, Math.min(1500, Number.parseInt(units, 10) || 320));
  document.getElementById('calc-units-badge').textContent = `${count.toLocaleString()} Units`;
  document.getElementById('calc-invoices').textContent = count.toLocaleString();
  document.getElementById('calc-passes').textContent = count.toLocaleString();
  const hours = document.getElementById('calc-hours');
  if (hours) hours.textContent = '3';
}

function handleDemoSubmit(event) {
  event.preventDefault();
  const field = id => (document.getElementById(id)?.value || '').trim();
  const subject = `SocMgt product walkthrough request — ${field('lead-society')}`;
  const body = [
    'Hello SocMgt,', '', 'Please contact me about a product walkthrough.', '',
    `Name: ${field('lead-name')}`, `Phone: ${field('lead-phone')}`,
    `Role: ${field('lead-role')}`, `Community: ${field('lead-society')}`,
    `City: ${field('lead-city')}`, `Units: ${field('lead-units')}`
  ].join('\n');
  const success = document.getElementById('form-success');
  success.textContent = 'Your email draft is ready. Send it from your email app to complete the request.';
  success.classList.remove('hidden');
  window.location.href = `mailto:info@socmgt.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const residentScenarios = [
  {title:'QR-based member registration', badge:'MEMBER ONBOARDING', steps:[
    ['Step 1','A community shares its registration QR','The link opens the member form with that community selected.','Open'],
    ['Step 2','A member submits a request','The member supplies their details and the unit they belong to.','Submitted'],
    ['Step 3','A community admin reviews it','The admin checks the request before granting account access.','Review']
  ], stats:[['Request','Member submits'],['Review','Admin checks'],['Access','After approval']]},
  {title:'Linked properties', badge:'ONE ACCOUNT, MULTIPLE UNITS', steps:[
    ['Step 1','Open linked properties','An owner sees the units connected to their account.','View'],
    ['Step 2','Select a unit','The selected unit becomes the context for its dues and requests.','Select'],
    ['Step 3','Switch when needed','Move to another linked property without creating another account.','Switch']
  ], stats:[['Account','One login'],['Units','Linked records'],['Context','Selected unit']]},
  {title:'Family and emergency contacts', badge:'HOUSEHOLD RECORDS', steps:[
    ['Step 1','Open the unit profile','See the household details your role is allowed to manage.','View'],
    ['Step 2','Add a family member','Record the relationship and contact information.','Save'],
    ['Step 3','Choose account access','If permitted, the community can send a separate invitation.','Invite']
  ], stats:[['Family','Unit-linked'],['Contacts','Available'],['Login','If enabled']]},
  {title:'Occupancy updates', badge:'MEMBER RECORDS', steps:[
    ['Step 1','Review the existing unit record','Check the current owner, tenant and resident information.','Review'],
    ['Step 2','Update dates and details','Record occupancy changes under the community rules.','Update'],
    ['Step 3','Confirm role access','An admin reviews who should be able to see that property.','Confirm']
  ], stats:[['Unit','Property'],['People','Linked'],['Roles','Reviewed']]}
];

const billingScenarios = [
  {title:'Set billing rules and generate bills', badge:'MAINTENANCE BILLING', steps:[
    ['Step 1','Set community billing rules','Choose a billing period, due date and applicable charges.','Configure'],
    ['Step 2','Review the units to bill','Apply fixed, area-based, parking or other charges where relevant.','Review'],
    ['Step 3','Generate unit-level bills','Members can see the bill details in their property context.','Generate']
  ], stats:[['Rules','Set by community'],['Bills','Issued to units'],['Dues','Track balances']]},
  {title:'Record payments and receipts', badge:'PAYMENT RECORDS', steps:[
    ['Step 1','Open an outstanding bill','Check the unit, amount due and billing period.','Open'],
    ['Step 2','Record a verified payment','A permitted user posts the amount and reference.','Record'],
    ['Step 3','Review the remaining balance','The member sees payment history and any outstanding amount.','Review']
  ], stats:[['Bill','Unit-level'],['Paid','Recorded'],['Balance','Visible']]},
  {title:'Manage partial and overdue dues', badge:'OUTSTANDING DUES', steps:[
    ['Step 1','See the payment status','An admin reviews the bill and any partial payments.','Review'],
    ['Step 2','Apply community rules','Due dates, grace periods and any penalties follow the configured policy.','Apply'],
    ['Step 3','Follow up on the balance','The outstanding amount remains visible until it is settled.','Follow up']
  ], stats:[['Partial','Supported'],['Rules','Configurable'],['Dues','Visible']]},
  {title:'Review expenses and reports', badge:'COMMUNITY FINANCES', steps:[
    ['Step 1','Record an expense','Enter the vendor, category, amount and supporting document.','Record'],
    ['Step 2','Route for approval','Committee or treasurer approval follows the community threshold rules.','Approve'],
    ['Step 3','Review financial activity','Compare collections, outstanding dues and expenses in reports.','Review']
  ], stats:[['Expense','Documented'],['Approval','Role-based'],['Report','Reviewable']]}
];

function renderScenario(type, index) {
  const data = (type === 'billing' ? billingScenarios : residentScenarios)[index];
  if (!data) return;
  const tabs = document.querySelectorAll(`.scenario-${type}-tab`);
  tabs.forEach((tab,i) => {
    tab.classList.toggle('border-slate-200',i !== index);
    tab.classList.toggle('bg-slate-50/50',i !== index);
    tab.classList.toggle(type === 'billing' ? 'border-emerald-500':'border-blue-600',i === index);
    tab.classList.toggle(type === 'billing' ? 'bg-emerald-50/60':'bg-blue-50/60',i === index);
    tab.setAttribute('aria-pressed',String(i === index));
  });
  document.getElementById(`${type}-engine-badge`).textContent = data.badge;
  document.getElementById(`${type}-scenario-title`).textContent = data.title;
  const timeline = document.getElementById(`${type}-timeline-container`);
  timeline.replaceChildren();
  for (const [step,title,description,status] of data.steps) {
    const row = document.createElement('div');
    row.className = 'flex items-start justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm';
    const details = document.createElement('div'); details.className = 'flex items-start gap-3';
    const num = document.createElement('span'); num.className = 'font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded whitespace-nowrap'; num.textContent = step;
    const words = document.createElement('div');
    const heading = document.createElement('div'); heading.className = 'text-xs font-bold text-slate-900'; heading.textContent = title;
    const desc = document.createElement('div'); desc.className = 'text-xs text-slate-500 mt-0.5'; desc.textContent = description;
    words.append(heading,desc); details.append(num,words);
    const state = document.createElement('span'); state.className = 'px-2.5 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold shrink-0'; state.textContent = status;
    row.append(details,state);timeline.append(row);
  }
  data.stats.forEach(([value,label],i) => {
    document.getElementById(`${type}-stat-${i+1}`).textContent=value;
    document.getElementById(`${type}-stat-${i+1}-lbl`).textContent=label;
  });
  document.getElementById(`${type}-latency-tag`).textContent=type === 'billing' ? 'Billing journey' : 'Member journey';
  document.getElementById(`${type}-telemetry-sub`).textContent=type === 'billing' ? 'From billing rules to member dues' : 'From request to community access';
}
function switchResidentScenario(index) {renderScenario('resident',index)}
function switchBillingScenario(index) {renderScenario('billing',index)}
document.addEventListener('DOMContentLoaded',()=>{
  if (document.getElementById('unit-range')) updateCalculator(document.getElementById('unit-range').value);
  if (document.getElementById('resident-timeline-container')) switchResidentScenario(0);
  if (document.getElementById('billing-timeline-container')) switchBillingScenario(0);
});
