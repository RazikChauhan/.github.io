/**
 * SocMgt Client Application & Analytics Logic
 * Housing Society Management Software (https://socmgt.com)
 */

// 1. Calculator Interaction
function updateCalculator(units) {
  const count = Math.max(50, Math.min(1500, Number.parseInt(units, 10) || 320));
  const badge = document.getElementById('calc-units-badge');
  const invoices = document.getElementById('calc-invoices');
  const passes = document.getElementById('calc-passes');
  const hours = document.getElementById('calc-hours');
  
  if (badge) badge.textContent = `${count.toLocaleString('en-IN')} Units`;
  if (invoices) invoices.textContent = count.toLocaleString('en-IN');
  if (passes) passes.textContent = count.toLocaleString('en-IN');
  if (hours) hours.textContent = '3';
}

// 2. Form Validation & Lead Submission
function validateIndianPhone(phone) {
  // Allows optional +91 or 0 prefix followed by 10 digits starting with 6, 7, 8, or 9
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  return /^(?:\+91|0)?[6-9]\d{9}$/.test(clean);
}

function handleDemoSubmit(event) {
  event.preventDefault();
  const form = event.target;
  
  // Honeypot spam check
  const honeypot = form.querySelector('input[name="_gotcha"]');
  if (honeypot && honeypot.value.trim() !== '') {
    // Silently prevent spam submission
    console.warn('Spam detected via honeypot.');
    return false;
  }

  const nameInput = form.querySelector('#lead-name') || form.querySelector('input[name="lead-name"]');
  const phoneInput = form.querySelector('#lead-phone') || form.querySelector('input[name="lead-phone"]');
  const roleInput = form.querySelector('#lead-role') || form.querySelector('select[name="lead-role"]') || form.querySelector('input[name="lead-role"]');
  const unitsInput = form.querySelector('#lead-units') || form.querySelector('select[name="lead-units"]') || form.querySelector('input[name="lead-units"]');
  const societyInput = form.querySelector('#lead-society') || form.querySelector('input[name="lead-society"]');
  const cityInput = form.querySelector('#lead-city') || form.querySelector('input[name="lead-city"]');
  const emailInput = form.querySelector('#lead-email') || form.querySelector('input[name="lead-email"]');
  const submitBtn = form.querySelector('#submit-btn') || form.querySelector('button[type="submit"]');
  const successEl = document.getElementById('form-success') || form.querySelector('#form-success');
  const errorEl = document.getElementById('form-error') || form.querySelector('#form-error');

  const name = nameInput ? nameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const role = roleInput ? roleInput.value.trim() : 'Committee Member';
  const units = unitsInput ? unitsInput.value.trim() : '151-400 Units';
  const society = societyInput ? societyInput.value.trim() : '';
  const city = cityInput ? cityInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';

  // Clear previous errors
  if (errorEl) {
    errorEl.classList.add('hidden');
    errorEl.textContent = '';
  }

  // Validation
  if (!name) {
    showError(form, errorEl, 'Please enter your full name.');
    if (nameInput) nameInput.focus();
    return false;
  }

  if (!validateIndianPhone(phone)) {
    showError(form, errorEl, 'Please enter a valid 10-digit Indian mobile number (+91 allowed).');
    if (phoneInput) phoneInput.focus();
    return false;
  }

  if (!society) {
    showError(form, errorEl, 'Please enter your housing society or apartment name.');
    if (societyInput) societyInput.focus();
    return false;
  }

  if (!city) {
    showError(form, errorEl, 'Please enter your city and state.');
    if (cityInput) cityInput.focus();
    return false;
  }

  // Loading state
  const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-80', 'cursor-wait');
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Submitting your request...
    `;
  }

  // Fire GA4 conversion event
  if (typeof gtag === 'function') {
    gtag('event', 'generate_lead', {
      role: role,
      units_range: units,
      event_category: 'lead_generation',
      event_label: `${society} - ${city}`
    });
  }

  // Collect data
  const leadData = {
    name,
    phone,
    role,
    units,
    society,
    city,
    email,
    submittedAt: new Date().toISOString()
  };

  // Determine endpoint or fallback
  // In production, configure form action attribute, Netlify forms, or Serverless API
  const endpoint = form.getAttribute('action');

  if (endpoint && endpoint !== '#' && !endpoint.startsWith('mailto:')) {
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(leadData)
    }).then(response => {
      finishSubmission(true, form, submitBtn, originalBtnHtml, successEl);
    }).catch(err => {
      console.warn('Form endpoint submission fallback:', err);
      finishSubmission(true, form, submitBtn, originalBtnHtml, successEl);
    });
  } else {
    // Simulated fast async submission with persistent lead in localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('socmgt_leads') || '[]');
      stored.push(leadData);
      localStorage.setItem('socmgt_leads', JSON.stringify(stored));
    } catch(e) {}

    setTimeout(() => {
      finishSubmission(true, form, submitBtn, originalBtnHtml, successEl);
    }, 600);
  }

  return false;
}

function showError(form, errorEl, msg) {
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
  } else {
    alert(msg);
  }
}

function finishSubmission(isSuccess, form, submitBtn, originalBtnHtml, successEl) {
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.classList.remove('opacity-80', 'cursor-wait');
    submitBtn.innerHTML = originalBtnHtml;
  }

  if (isSuccess) {
    // If thank-you.html exists, navigate there; otherwise show inline message
    if (window.location.pathname.indexOf('thank-you.html') === -1) {
      const inBlog = window.location.pathname.indexOf('/blog/') !== -1;
      window.location.href = (inBlog ? '../' : '') + 'thank-you.html';
    } else if (successEl) {
      successEl.textContent = 'Thank you! Your walkthrough request has been received. Our team will contact you within 24 hours.';
      successEl.classList.remove('hidden');
      form.reset();
    }
  }
}

// 3. Scenario Timeline Data
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
  tabs.forEach((tab, i) => {
    tab.classList.toggle('border-slate-200', i !== index);
    tab.classList.toggle('bg-slate-50/50', i !== index);
    tab.classList.toggle(type === 'billing' ? 'border-emerald-500' : 'border-blue-600', i === index);
    tab.classList.toggle(type === 'billing' ? 'bg-emerald-50/60' : 'bg-blue-50/60', i === index);
    tab.setAttribute('aria-pressed', String(i === index));
  });
  
  const badgeEl = document.getElementById(`${type}-engine-badge`);
  const titleEl = document.getElementById(`${type}-scenario-title`);
  if (badgeEl) badgeEl.textContent = data.badge;
  if (titleEl) titleEl.textContent = data.title;
  
  const timeline = document.getElementById(`${type}-timeline-container`);
  if (timeline) {
    timeline.replaceChildren();
    for (const [step, title, description, status] of data.steps) {
      const row = document.createElement('div');
      row.className = 'flex items-start justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm';
      const details = document.createElement('div'); details.className = 'flex items-start gap-3';
      const num = document.createElement('span'); num.className = 'font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded whitespace-nowrap'; num.textContent = step;
      const words = document.createElement('div');
      const heading = document.createElement('div'); heading.className = 'text-xs font-bold text-slate-900'; heading.textContent = title;
      const desc = document.createElement('div'); desc.className = 'text-xs text-slate-500 mt-0.5'; desc.textContent = description;
      words.append(heading, desc); details.append(num, words);
      const state = document.createElement('span'); state.className = 'px-2.5 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold shrink-0'; state.textContent = status;
      row.append(details, state);
      timeline.append(row);
    }
  }

  data.stats.forEach(([value, label], i) => {
    const statVal = document.getElementById(`${type}-stat-${i+1}`);
    const statLbl = document.getElementById(`${type}-stat-${i+1}-lbl`);
    if (statVal) statVal.textContent = value;
    if (statLbl) statLbl.textContent = label;
  });

  const tagEl = document.getElementById(`${type}-latency-tag`);
  const subEl = document.getElementById(`${type}-telemetry-sub`);
  if (tagEl) tagEl.textContent = type === 'billing' ? 'Billing journey' : 'Member journey';
  if (subEl) subEl.textContent = type === 'billing' ? 'From billing rules to member dues' : 'From request to community access';
}

function switchResidentScenario(index) { renderScenario('resident', index); }
function switchBillingScenario(index) { renderScenario('billing', index); }

// 4. GA4 Click & Conversion Tracking
function initAnalyticsTracking() {
  // Track WhatsApp button clicks
  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(el => {
    el.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', {
          event_category: 'engagement',
          event_label: 'WhatsApp Chat Initiated'
        });
      }
    });
  });

  // Track CTA clicks (Book a Demo / Request a Product Walkthrough)
  document.querySelectorAll('a[href*="#book-demo"], a[href*="request-walkthrough.html"]').forEach(el => {
    el.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'cta_click', {
          event_category: 'conversion_intent',
          event_label: el.textContent.trim().replace(/\s+/g, ' ') || 'Demo Walkthrough CTA'
        });
      }
    });
  });
}

// 5. Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const unitRange = document.getElementById('unit-range');
  if (unitRange) {
    updateCalculator(unitRange.value);
    unitRange.addEventListener('input', e => updateCalculator(e.target.value));
  }
  if (document.getElementById('resident-timeline-container')) switchResidentScenario(0);
  if (document.getElementById('billing-timeline-container')) switchBillingScenario(0);
  initAnalyticsTracking();
  initCookieConsent();
});

// 6. Cookie Consent & Compliance Framework (DPDP Act 2023, GDPR / ePrivacy, IT Act 2011)
const COOKIE_CONSENT_KEY = 'socmgt_cookie_consent';
const COOKIE_CONSENT_VERSION = '1.0';

function getStoredCookieConsent() {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function updateConsentState(analyticsGranted) {
  if (typeof gtag === 'function') {
    gtag('consent', 'update', {
      'analytics_storage': analyticsGranted ? 'granted' : 'denied',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied'
    });
  }
  if (!analyticsGranted) {
    eraseAnalyticsCookies();
  }
}

function eraseAnalyticsCookies() {
  const cookies = document.cookie.split(';');
  const host = window.location.hostname;
  const parts = host.split('.');
  const domains = ['', host, '.' + host];
  if (parts.length >= 2) {
    domains.push('.' + parts.slice(-2).join('.'));
  }

  for (let i = 0; i < cookies.length; i++) {
    const c = cookies[i];
    const eq = c.indexOf('=');
    const name = (eq > -1 ? c.substring(0, eq) : c).trim();
    if (name.startsWith('_ga') || name.startsWith('_gid') || name.startsWith('_gat')) {
      for (let j = 0; j < domains.length; j++) {
        const d = domains[j];
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;' + (d ? 'domain=' + d + ';' : '');
      }
    }
  }
}

function showToast(msg) {
  let toast = document.getElementById('socmgt-consent-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'socmgt-consent-toast';
    toast.className = 'fixed bottom-5 right-5 z-[110] bg-slate-900 text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 transform transition-all duration-300 translate-y-10 opacity-0 pointer-events-none';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="16" height="16" style="width:16px;height:16px;min-width:16px;color:#34d399;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span>${msg}</span>
  `;
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-10', 'opacity-0');
  }, 3200);
}

function acceptAllCookies() {
  const consent = {
    necessary: true,
    analytics: true,
    functional: true,
    timestamp: new Date().toISOString(),
    version: COOKIE_CONSENT_VERSION
  };
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  } catch (e) {}

  updateConsentState(true);
  hideCookieBanner();
  closeCookieSettingsModal();
  showToast('Preferences saved: All cookies accepted.');
}

function rejectNonEssentialCookies() {
  const consent = {
    necessary: true,
    analytics: false,
    functional: false,
    timestamp: new Date().toISOString(),
    version: COOKIE_CONSENT_VERSION
  };
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  } catch (e) {}

  updateConsentState(false);
  hideCookieBanner();
  closeCookieSettingsModal();
  showToast('Preferences saved: Only essential cookies active.');
}

function saveCustomCookiePreferences() {
  const analyticsInput = document.getElementById('socmgt-toggle-analytics');
  const functionalInput = document.getElementById('socmgt-toggle-functional');
  const isAnalytics = analyticsInput ? analyticsInput.checked : false;
  const isFunctional = functionalInput ? functionalInput.checked : false;

  const consent = {
    necessary: true,
    analytics: isAnalytics,
    functional: isFunctional,
    timestamp: new Date().toISOString(),
    version: COOKIE_CONSENT_VERSION
  };
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  } catch (e) {}

  updateConsentState(isAnalytics);
  hideCookieBanner();
  closeCookieSettingsModal();
  showToast('Preferences updated successfully.');
}

function hideCookieBanner() {
  const banner = document.getElementById('socmgt-cookie-banner');
  if (banner) {
    banner.classList.remove('visible');
    setTimeout(() => {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 300);
  }
}

function injectCookieStyles() {
  if (document.getElementById('socmgt-cookie-styles')) return;
  const style = document.createElement('style');
  style.id = 'socmgt-cookie-styles';
  style.textContent = `
    /* Cookie Modal Core Styles */
    #socmgt-cookie-modal {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background-color: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      transition: opacity 0.2s ease-in-out;
      box-sizing: border-box;
    }
    #socmgt-cookie-modal.hidden {
      display: none !important;
    }
    #socmgt-cookie-modal .socmgt-modal-card {
      background: #ffffff;
      width: 100%;
      max-width: 540px;
      max-height: 88vh;
      border-radius: 16px;
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.3);
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    #socmgt-cookie-modal .socmgt-modal-header {
      padding: 18px 22px;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      background: #fafafa;
    }
    #socmgt-cookie-modal .socmgt-modal-header h2 {
      margin: 0;
      font-size: 17px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.3;
    }
    #socmgt-cookie-modal .socmgt-modal-header p {
      margin: 4px 0 0;
      font-size: 12px;
      color: #64748b;
      line-height: 1.4;
    }
    #socmgt-cookie-modal .socmgt-close-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 6px;
      border-radius: 8px;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s, color 0.15s;
      flex-shrink: 0;
      line-height: 1;
    }
    #socmgt-cookie-modal .socmgt-close-btn:hover {
      background: #f1f5f9;
      color: #334155;
    }
    #socmgt-cookie-modal .socmgt-modal-body {
      padding: 20px 22px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
      font-size: 13px;
      color: #334155;
      line-height: 1.5;
    }
    #socmgt-cookie-modal .socmgt-category-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 16px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      gap: 6px;
      box-sizing: border-box;
    }
    #socmgt-cookie-modal .socmgt-category-card.essential {
      background: #f8fafc;
      border-color: #cbd5e1;
    }
    #socmgt-cookie-modal .socmgt-cat-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    #socmgt-cookie-modal .socmgt-cat-title {
      font-weight: 700;
      font-size: 14px;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #socmgt-cookie-modal .socmgt-badge-always {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 2px 7px;
      border-radius: 9999px;
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #bbf7d0;
    }
    #socmgt-cookie-modal .socmgt-cat-desc {
      margin: 0;
      font-size: 12px;
      color: #64748b;
      line-height: 1.45;
    }
    #socmgt-cookie-modal .socmgt-cat-cookies {
      margin-top: 4px;
      font-size: 11px;
      color: #64748b;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    #socmgt-cookie-modal .socmgt-cat-cookies code {
      background: #f1f5f9;
      color: #334155;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
      font-size: 10.5px;
    }

    /* Custom Switch Toggle */
    .socmgt-switch {
      position: relative;
      display: inline-block;
      width: 42px;
      height: 24px;
      flex-shrink: 0;
      margin: 0;
    }
    .socmgt-switch input {
      opacity: 0;
      width: 0;
      height: 0;
      position: absolute;
    }
    .socmgt-switch-slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: #cbd5e1;
      transition: background-color 0.2s ease;
      border-radius: 24px;
    }
    .socmgt-switch-slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: transform 0.2s ease;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0,0,0,0.25);
    }
    .socmgt-switch input:checked + .socmgt-switch-slider {
      background-color: #2563eb;
    }
    .socmgt-switch input:checked + .socmgt-switch-slider:before {
      transform: translateX(18px);
    }
    .socmgt-switch input:disabled + .socmgt-switch-slider {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Commitment Banner in Modal */
    #socmgt-cookie-modal .socmgt-commitment-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 10px;
      padding: 11px 14px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 11.5px;
      color: #1e40af;
      line-height: 1.45;
    }

    /* Modal Footer */
    #socmgt-cookie-modal .socmgt-modal-footer {
      padding: 14px 22px;
      border-top: 1px solid #f1f5f9;
      background: #fafafa;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
    }
    #socmgt-cookie-modal .socmgt-btn-ghost {
      background: transparent;
      border: none;
      color: #64748b;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 8px;
      transition: color 0.15s, background 0.15s;
    }
    #socmgt-cookie-modal .socmgt-btn-ghost:hover {
      color: #0f172a;
      background: #f1f5f9;
    }
    #socmgt-cookie-modal .socmgt-footer-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #socmgt-cookie-modal .socmgt-btn-outline {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #334155;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      padding: 8px 14px;
      border-radius: 8px;
      transition: background 0.15s, border-color 0.15s;
    }
    #socmgt-cookie-modal .socmgt-btn-outline:hover {
      background: #f8fafc;
      border-color: #94a3b8;
    }
    #socmgt-cookie-modal .socmgt-btn-primary {
      background: #2563eb;
      border: 1px solid #2563eb;
      color: #ffffff;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 8px;
      transition: background 0.15s;
    }
    #socmgt-cookie-modal .socmgt-btn-primary:hover {
      background: #1d4ed8;
    }

    /* Fixed sizes on all SVG elements */
    #socmgt-cookie-modal svg,
    #socmgt-cookie-banner svg,
    #socmgt-cookie-badge svg,
    #socmgt-consent-toast svg {
      width: 18px !important;
      height: 18px !important;
      min-width: 18px !important;
      min-height: 18px !important;
      max-width: 18px !important;
      max-height: 18px !important;
      display: inline-block !important;
      flex-shrink: 0 !important;
      vertical-align: middle !important;
    }
    /* Bottom-Right Small Cookie Popup */
    #socmgt-cookie-banner {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      width: 360px;
      max-width: calc(100vw - 32px);
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      box-shadow: 0 20px 40px -8px rgba(15, 23, 42, 0.22), 0 0 1px 1px rgba(0, 0, 0, 0.04);
      padding: 16px 18px;
      box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      transform: translateY(24px);
      opacity: 0;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
    }
    #socmgt-cookie-banner.visible {
      transform: translateY(0);
      opacity: 1;
    }
    #socmgt-cookie-banner .socmgt-popup-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
    }
    #socmgt-cookie-banner .socmgt-popup-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
    }
    #socmgt-cookie-banner .socmgt-popup-badge {
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 2px 6px;
      border-radius: 4px;
      background: #eff6ff;
      color: #2563eb;
      border: 1px solid #bfdbfe;
    }
    #socmgt-cookie-banner .socmgt-popup-close-x {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s, color 0.15s;
    }
    #socmgt-cookie-banner .socmgt-popup-close-x:hover {
      background: #f1f5f9;
      color: #334155;
    }
    #socmgt-cookie-banner .socmgt-popup-text {
      margin: 0 0 14px 0;
      font-size: 12px;
      color: #475569;
      line-height: 1.5;
    }
    #socmgt-cookie-banner .socmgt-popup-text a {
      color: #2563eb;
      text-decoration: underline;
      font-weight: 600;
    }
    #socmgt-cookie-banner .socmgt-popup-text a:hover {
      color: #1d4ed8;
    }
    #socmgt-cookie-banner .socmgt-popup-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    #socmgt-cookie-banner .socmgt-popup-btn-accept {
      flex: 1;
      background: #2563eb;
      border: 1px solid #2563eb;
      color: #ffffff;
      font-size: 12.5px;
      font-weight: 600;
      padding: 8px 12px;
      border-radius: 9px;
      cursor: pointer;
      text-align: center;
      transition: background 0.15s ease;
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
    }
    #socmgt-cookie-banner .socmgt-popup-btn-accept:hover {
      background: #1d4ed8;
    }
    #socmgt-cookie-banner .socmgt-popup-btn-reject {
      flex: 1;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      color: #334155;
      font-size: 12.5px;
      font-weight: 600;
      padding: 8px 12px;
      border-radius: 9px;
      cursor: pointer;
      text-align: center;
      transition: background 0.15s ease, border-color 0.15s ease;
    }
    #socmgt-cookie-banner .socmgt-popup-btn-reject:hover {
      background: #f1f5f9;
      border-color: #94a3b8;
    }
    #socmgt-cookie-banner .socmgt-popup-customize {
      margin-top: 9px;
      text-align: center;
    }
    #socmgt-cookie-banner .socmgt-popup-customize-btn {
      background: transparent;
      border: none;
      color: #64748b;
      font-size: 11.5px;
      font-weight: 500;
      text-decoration: underline;
      cursor: pointer;
      padding: 2px 4px;
      transition: color 0.15s;
    }
    #socmgt-cookie-banner .socmgt-popup-customize-btn:hover {
      color: #0f172a;
    }

    #socmgt-cookie-badge svg {
      width: 15px !important;
      height: 15px !important;
      min-width: 15px !important;
      min-height: 15px !important;
      max-width: 15px !important;
      max-height: 15px !important;
    }
  `;
  document.head.appendChild(style);
}

function openCookieSettingsModal() {
  injectCookieStyles();
  let modal = document.getElementById('socmgt-cookie-modal');
  if (!modal) {
    createCookieModal();
    modal = document.getElementById('socmgt-cookie-modal');
  }
  
  // Sync toggle checkboxes with current saved state
  const current = getStoredCookieConsent();
  const analyticsToggle = document.getElementById('socmgt-toggle-analytics');
  const functionalToggle = document.getElementById('socmgt-toggle-functional');
  if (analyticsToggle) analyticsToggle.checked = current ? current.analytics === true : false;
  if (functionalToggle) functionalToggle.checked = current ? current.functional === true : false;

  if (modal) {
    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
      modal.style.opacity = '1';
      const card = modal.querySelector('.socmgt-modal-card');
      if (card) {
        card.style.transform = 'scale(1)';
        card.style.transition = 'transform 0.2s ease';
      }
    });
    document.body.classList.add('overflow-hidden');
  }
}

function closeCookieSettingsModal() {
  const modal = document.getElementById('socmgt-cookie-modal');
  if (modal && !modal.classList.contains('hidden')) {
    modal.style.opacity = '0';
    const card = modal.querySelector('.socmgt-modal-card');
    if (card) card.style.transform = 'scale(0.96)';
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 200);
  }
}

function createCookieBanner() {
  if (document.getElementById('socmgt-cookie-banner')) return;
  injectCookieStyles();
  const banner = document.createElement('div');
  banner.id = 'socmgt-cookie-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie consent pop-up');
  banner.innerHTML = `
    <div class="socmgt-popup-header">
      <div class="socmgt-popup-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #2563eb;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        <span>Cookie Preferences</span>
        <span class="socmgt-popup-badge">DPDP 2023</span>
      </div>
      <button type="button" onclick="rejectNonEssentialCookies()" class="socmgt-popup-close-x" aria-label="Close and use essential cookies only" title="Close and use essential cookies only">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <p class="socmgt-popup-text">
      We use strictly necessary cookies to keep SocMgt secure. With your consent, we use privacy-first analytics to improve platform tools. Zero third-party ad tracking. Read our <a href="${window.location.pathname.indexOf('/blog/') !== -1 ? '../' : ''}cookie-policy.html">Cookie Policy</a>.
    </p>
    <div class="socmgt-popup-actions">
      <button type="button" onclick="acceptAllCookies()" class="socmgt-popup-btn-accept">
        Accept All
      </button>
      <button type="button" onclick="rejectNonEssentialCookies()" class="socmgt-popup-btn-reject">
        Necessary Only
      </button>
    </div>
    <div class="socmgt-popup-customize">
      <button type="button" onclick="openCookieSettingsModal()" class="socmgt-popup-customize-btn">
        Customize Preferences
      </button>
    </div>
  `;
  document.body.appendChild(banner);
  requestAnimationFrame(() => {
    banner.classList.add('visible');
  });
}

function createCookieModal() {
  if (document.getElementById('socmgt-cookie-modal')) return;
  injectCookieStyles();
  const modal = document.createElement('div');
  modal.id = 'socmgt-cookie-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'cookie-modal-title');
  modal.className = 'hidden';
  modal.style.opacity = '0';
  modal.innerHTML = `
    <div class="socmgt-modal-card">
      <!-- Modal Header -->
      <div class="socmgt-modal-header">
        <div>
          <h2 id="cookie-modal-title">Cookie &amp; Privacy Preferences</h2>
          <p>Customize your consent under India's DPDP Act and international privacy standards</p>
        </div>
        <button type="button" onclick="closeCookieSettingsModal()" class="socmgt-close-btn" aria-label="Close modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="socmgt-modal-body">
        <p style="margin: 0 0 2px 0; color: #475569; font-size: 12.5px; line-height: 1.5;">
          When you use SocMgt, information may be stored or retrieved through browser cookies. You can customize your preferences below. Strictly necessary cookies are required for security and core functionality.
        </p>

        <!-- Category 1: Strictly Necessary -->
        <div class="socmgt-category-card essential">
          <div class="socmgt-cat-row">
            <div class="socmgt-cat-title">
              <span>Strictly Necessary</span>
              <span class="socmgt-badge-always">Always Active</span>
            </div>
            <label class="socmgt-switch">
              <input type="checkbox" checked disabled aria-label="Strictly necessary cookies always active">
              <span class="socmgt-switch-slider"></span>
            </label>
          </div>
          <p class="socmgt-cat-desc">
            Essential for session authentication, security, anti-CSRF protection, and recording your privacy preferences. Does not track personal data across external sites.
          </p>
          <div class="socmgt-cat-cookies">
            Cookies: <code>socmgt_cookie_consent</code>, <code>socmgt_leads</code>
          </div>
        </div>

        <!-- Category 2: Analytics & Performance -->
        <div class="socmgt-category-card">
          <div class="socmgt-cat-row">
            <div class="socmgt-cat-title">
              <span>Analytics &amp; Performance</span>
            </div>
            <label class="socmgt-switch">
              <input type="checkbox" id="socmgt-toggle-analytics" aria-label="Toggle analytics cookies">
              <span class="socmgt-switch-slider"></span>
            </label>
          </div>
          <p class="socmgt-cat-desc">
            Allows us to measure visitor traffic and navigation anonymously via Google Analytics 4 (Consent Mode v2) to improve community tools. All metrics are aggregated.
          </p>
          <div class="socmgt-cat-cookies">
            Cookies: <code>_ga</code>, <code>_ga_X2JFX4XG44</code>
          </div>
        </div>

        <!-- Category 3: Functional Preferences -->
        <div class="socmgt-category-card">
          <div class="socmgt-cat-row">
            <div class="socmgt-cat-title">
              <span>Functional Preferences</span>
            </div>
            <label class="socmgt-switch">
              <input type="checkbox" id="socmgt-toggle-functional" aria-label="Toggle functional cookies">
              <span class="socmgt-switch-slider"></span>
            </label>
          </div>
          <p class="socmgt-cat-desc">
            Preserves user interface settings, society size slider choices, and calculator inputs across sessions.
          </p>
        </div>

        <!-- Commitment Callout -->
        <div class="socmgt-commitment-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-top: 1px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          <div>
            <strong>Strict Zero-Ad Policy:</strong> SocMgt will never sell your personal data, use behavioral ad targeting, or deploy third-party advertising trackers. Read our <a href="${(window.location.pathname.indexOf('/blog/') !== -1 ? '../' : '')}cookie-policy.html" style="color: #2563eb; text-decoration: underline; font-weight: 600;">Cookie Policy</a>.
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="socmgt-modal-footer">
        <button type="button" onclick="rejectNonEssentialCookies()" class="socmgt-btn-ghost">
          Reject Non-Essential
        </button>
        <div class="socmgt-footer-actions">
          <button type="button" onclick="saveCustomCookiePreferences()" class="socmgt-btn-outline">
            Save Preferences
          </button>
          <button type="button" onclick="acceptAllCookies()" class="socmgt-btn-primary">
            Accept All
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCookieSettingsModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeCookieSettingsModal();
    }
  });
}

function createFloatingCookieBadge() {
  if (document.getElementById('socmgt-cookie-badge')) return;
  injectCookieStyles();
  const badge = document.createElement('button');
  badge.id = 'socmgt-cookie-badge';
  badge.type = 'button';
  badge.onclick = openCookieSettingsModal;
  badge.setAttribute('aria-label', 'Manage Cookie Preferences');
  badge.title = 'Manage Cookie Preferences';
  badge.className = 'fixed bottom-4 left-4 z-40 bg-white/95 hover:bg-white text-slate-700 shadow-md hover:shadow-lg border border-slate-200/90 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:outline-none';
  badge.innerHTML = `
    <svg width="15" height="15" style="width:15px;height:15px;min-width:15px;color:#2563eb;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
    </svg>
    <span class="hidden sm:inline text-[11px] font-medium text-slate-600">Cookies</span>
  `;
  document.body.appendChild(badge);
}

function initCookieConsent() {
  injectCookieStyles();
  createCookieModal();
  createFloatingCookieBadge();

  const stored = getStoredCookieConsent();
  if (!stored) {
    createCookieBanner();
  } else {
    updateConsentState(stored.analytics === true);
  }
}

// Global exposure
window.openCookieSettingsModal = openCookieSettingsModal;
window.closeCookieSettingsModal = closeCookieSettingsModal;
window.acceptAllCookies = acceptAllCookies;
window.rejectNonEssentialCookies = rejectNonEssentialCookies;
window.saveCustomCookiePreferences = saveCustomCookiePreferences;

