/* ============================================================
   AUTHENTIC MOTORS — Garage Manager
   App logic
   ============================================================ */

(function () {
  'use strict';

  const GARAGE_PHONE = '916363230778'; // country code + number, no symbols

  /* ---------------------------------------------------------
     1. SPA NAVIGATION
     --------------------------------------------------------- */

  const pages = document.querySelectorAll('.page');
  const navButtons = document.querySelectorAll('.nav-item[data-target], .bnav-item[data-target]');

  function goToPage(target) {
    pages.forEach((p) => p.classList.toggle('active', p.id === target));
    navButtons.forEach((b) => b.classList.toggle('active', b.dataset.target === target));
    document.querySelector('.content')?.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => goToPage(btn.dataset.target));
  });

  document.getElementById('btnNewJobCard')?.addEventListener('click', () => goToPage('jobcards'));
  document.getElementById('btnShareDashboard')?.addEventListener('click', () => goToPage('billing'));

  /* Settings / Logout are placeholders in this static demo */
  document.querySelector('[data-action="settings"]')?.addEventListener('click', () => {
    alert('Settings is not wired up in this preview.');
  });
  document.querySelector('[data-action="logout"]')?.addEventListener('click', () => {
    alert('You have been logged out (demo only).');
  });

  /* ---------------------------------------------------------
     2. TODAY'S DATE CHIP
     --------------------------------------------------------- */

  const dateChip = document.getElementById('todayDate');
  if (dateChip) {
    const today = new Date();
    dateChip.textContent = today.toLocaleDateString('en-IN', {
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
    });
  }

  /* ---------------------------------------------------------
     3. DASHBOARD — ACTIVE VEHICLES
     --------------------------------------------------------- */

  const CAR_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11"/><rect x="3" y="11" width="18" height="7" rx="2"/><circle cx="7.5" cy="18" r="1.5"/><circle cx="16.5" cy="18" r="1.5"/></svg>';

  const activeVehicles = [
    { no: 'OD 11 AB 4521', name: 'Debasis Nayak', service: 'General Service', status: 'active', time: '10:15 AM' },
    { no: 'OD 05 CT 7890', name: 'Priyanka Behera', service: 'Oil Change', status: 'complete', time: '09:40 AM' },
    { no: 'OD 02 GH 3345', name: 'Suresh Patra', service: 'Brake Service', status: 'pending', time: '11:05 AM' },
    { no: 'OD 14 KL 6672', name: 'Anita Das', service: 'AC Service', status: 'active', time: '12:30 PM' },
    { no: 'OD 07 MN 2210', name: 'Rajesh Mallick', service: 'Wheel Alignment', status: 'complete', time: '01:15 PM' },
    { no: 'OD 09 PQ 8834', name: 'Sunita Jena', service: 'Periodic Service', status: 'active', time: '02:00 PM' },
  ];

  const STATUS_LABEL = { active: 'In Service', pending: 'Pending', complete: 'Completed' };
  const STATUS_CLASS = { active: 'pill-active', pending: 'pill-pending', complete: 'pill-complete' };

  const tbody = document.getElementById('activeVehiclesBody');
  const mobileList = document.getElementById('activeVehiclesMobile');

  activeVehicles.forEach((v) => {
    // Desktop table row
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${v.no}</strong></td>
      <td>${v.name}</td>
      <td>${v.service}</td>
      <td><span class="pill ${STATUS_CLASS[v.status]}">${STATUS_LABEL[v.status]}</span></td>
      <td>${v.time}</td>
    `;
    tbody?.appendChild(tr);

    // Mobile card
    const card = document.createElement('div');
    card.className = 'veh-card neu-raised-sm';
    card.innerHTML = `
      <span class="veh-card-icon">${CAR_ICON}</span>
      <div class="veh-card-body">
        <div class="veh-card-top">
          <strong>${v.no}</strong>
          <span class="pill ${STATUS_CLASS[v.status]}">${STATUS_LABEL[v.status]}</span>
        </div>
        <p class="veh-card-meta">${v.name} · ${v.service}</p>
        <p class="veh-card-time">In: ${v.time}</p>
      </div>
    `;
    mobileList?.appendChild(card);
  });

  /* ---------------------------------------------------------
     4. JOB CARDS — dynamic services / parts list
     --------------------------------------------------------- */

  const TRASH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>';

  const jcList = document.getElementById('jcItemList');
  const jcEmptyState = document.getElementById('jcEmptyState');
  const jcNameInput = document.getElementById('jcItemName');
  const jcAmountInput = document.getElementById('jcItemAmount');
  const jcSubtotalEl = document.getElementById('jcSubtotal');
  const jcItemCountEl = document.getElementById('jcItemCount');

  let jcItems = [];

  function renderJobCardItems() {
    jcList.querySelectorAll('.item-row').forEach((el) => el.remove());
    jcEmptyState.hidden = jcItems.length > 0;

    jcItems.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = 'item-row neu-raised-sm';
      li.innerHTML = `
        <span class="item-row-name">${item.name}</span>
        <span class="item-row-right">
          <span class="item-row-amount">₹ ${item.amount.toLocaleString('en-IN')}</span>
          <button class="icon-trash" aria-label="Remove ${item.name}" data-idx="${idx}">${TRASH_ICON}</button>
        </span>
      `;
      jcList.appendChild(li);
    });

    const subtotal = jcItems.reduce((sum, i) => sum + i.amount, 0);
    jcSubtotalEl.textContent = `₹ ${subtotal.toLocaleString('en-IN')}`;
    jcItemCountEl.textContent = `${jcItems.length} item${jcItems.length === 1 ? '' : 's'}`;
  }

  document.getElementById('jcAddItem')?.addEventListener('click', () => {
    const name = jcNameInput.value.trim();
    const amount = parseFloat(jcAmountInput.value);
    if (!name || isNaN(amount) || amount < 0) {
      jcNameInput.focus();
      return;
    }
    jcItems.push({ name, amount });
    jcNameInput.value = '';
    jcAmountInput.value = '';
    jcNameInput.focus();
    renderJobCardItems();
  });

  jcList?.addEventListener('click', (e) => {
    const btn = e.target.closest('.icon-trash');
    if (!btn) return;
    jcItems.splice(Number(btn.dataset.idx), 1);
    renderJobCardItems();
  });

  document.getElementById('jcSaveCard')?.addEventListener('click', () => {
    const vehicleNo = document.getElementById('jcVehicleNo').value.trim();
    if (!vehicleNo) {
      alert('Please enter a vehicle number before saving.');
      document.getElementById('jcVehicleNo').focus();
      return;
    }
    alert(`Job card saved for ${vehicleNo}.`);
  });

  renderJobCardItems();

  /* ---------------------------------------------------------
     5. HISTORY — search + timeline
     --------------------------------------------------------- */

  const CLOCK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 8v4l3 2"/></svg>';

  const historyRecords = [
    { vehicle: 'OD 11 AB 4521', name: 'Debasis Nayak', phone: '9861234501', service: 'General Service', date: '18 Apr 2025', amount: 2450 },
    { vehicle: 'OD 05 CT 7890', name: 'Priyanka Behera', phone: '9437765412', service: 'Oil Change', date: '15 Apr 2025', amount: 1200 },
    { vehicle: 'OD 02 GH 3345', name: 'Suresh Patra', phone: '9556678123', service: 'Brake Pad Replacement', date: '10 Apr 2025', amount: 3600 },
    { vehicle: 'OD 14 KL 6672', name: 'Anita Das', phone: '9078912233', service: 'AC Gas Refill', date: '02 Apr 2025', amount: 1800 },
    { vehicle: 'OD 07 MN 2210', name: 'Rajesh Mallick', phone: '9337456781', service: 'Wheel Alignment & Balancing', date: '27 Mar 2025', amount: 950 },
    { vehicle: 'OD 09 PQ 8834', name: 'Sunita Jena', phone: '9668823456', service: 'Periodic Service', date: '19 Mar 2025', amount: 4200 },
  ];

  const timelineEl = document.getElementById('historyTimeline');
  const historyEmptyEl = document.getElementById('historyEmpty');
  const historySearchInput = document.getElementById('historySearch');

  function renderHistory(filter = '') {
    const q = filter.trim().toLowerCase();
    timelineEl.innerHTML = '';

    const matches = historyRecords.filter((r) =>
      r.vehicle.toLowerCase().replace(/\s+/g, '').includes(q.replace(/\s+/g, '')) ||
      r.phone.includes(q)
    );

    historyEmptyEl.hidden = matches.length > 0;

    matches.forEach((r) => {
      const li = document.createElement('li');
      li.className = 'timeline-item neu-raised-sm';
      li.innerHTML = `
        <span class="timeline-icon">${CLOCK_ICON}</span>
        <div class="timeline-body">
          <div class="timeline-top">
            <strong>${r.vehicle}</strong>
            <span class="timeline-date">${r.date}</span>
          </div>
          <p class="timeline-meta">${r.name} · ${r.phone}</p>
          <div class="timeline-bottom">
            <span class="pill pill-muted">${r.service}</span>
            <span class="timeline-amount">₹ ${r.amount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      `;
      timelineEl.appendChild(li);
    });
  }

  historySearchInput?.addEventListener('input', (e) => renderHistory(e.target.value));
  renderHistory();

  /* ---------------------------------------------------------
     6. BILLING — tax calculation + WhatsApp share
     --------------------------------------------------------- */

  const billParts = document.getElementById('billParts');
  const billLabor = document.getElementById('billLabor');
  const billTax = document.getElementById('billTax');
  const sumSubtotal = document.getElementById('sumSubtotal');
  const sumTax = document.getElementById('sumTax');
  const sumTotal = document.getElementById('sumTotal');

  let currentTotal = 0;

  function formatINR(n) {
    return `₹ ${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  }

  function recalcBill() {
    const parts = Math.max(0, parseFloat(billParts.value) || 0);
    const labor = Math.max(0, parseFloat(billLabor.value) || 0);
    const taxPct = Math.max(0, parseFloat(billTax.value) || 0);

    const subtotal = parts + labor;
    const taxAmount = subtotal * (taxPct / 100);
    const total = subtotal + taxAmount;

    sumSubtotal.textContent = formatINR(subtotal);
    sumTax.textContent = `${formatINR(taxAmount)} (${taxPct}%)`;
    sumTotal.textContent = formatINR(total);

    currentTotal = Math.round(total * 100) / 100;
  }

  [billParts, billLabor, billTax].forEach((el) => el?.addEventListener('input', recalcBill));
  recalcBill();

  function shareInvoiceToWhatsApp() {
    const amountText = currentTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    const message =
      `Hello from AUTHENTIC MOTORS! Your vehicle service is complete. ` +
      `Total Amount: \u20B9${amountText}. Thank you for choosing us.`;
    const url = `https://wa.me/${GARAGE_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
  }

  document.getElementById('btnShareBilling')?.addEventListener('click', shareInvoiceToWhatsApp);

  /* ---------------------------------------------------------
     7. INVENTORY
     --------------------------------------------------------- */

  const BOX_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3.5 7.5 8.5-4 8.5 4-8.5 4-8.5-4Z"/><path d="M3.5 7.5v9l8.5 4 8.5-4v-9"/><path d="M12 11.5v9"/></svg>';

  let inventoryParts = [
    { name: 'Engine Oil 5W-30', unit: 'litres', stock: 24, low: 10 },
    { name: 'Brake Pads (Front)', unit: 'pairs', stock: 16, low: 5 },
    { name: 'Air Filter', unit: 'pcs', stock: 30, low: 8 },
    { name: 'Oil Filter', unit: 'pcs', stock: 40, low: 10 },
    { name: 'Brake Fluid DOT 4', unit: 'bottles', stock: 18, low: 6 },
    { name: 'Spark Plugs', unit: 'pcs', stock: 60, low: 12 },
    { name: 'Clutch Plate', unit: 'pcs', stock: 4, low: 5 },
    { name: '12V Battery', unit: 'pcs', stock: 10, low: 4 },
  ];

  const inventoryGrid = document.getElementById('inventoryGrid');

  function renderInventory() {
    inventoryGrid.innerHTML = '';
    inventoryParts.forEach((part, idx) => {
      const card = document.createElement('div');
      card.className = 'inv-card neu-raised';
      const isLow = part.stock <= part.low;
      card.innerHTML = `
        <div class="inv-card-top">
          <span class="inv-icon">${BOX_ICON}</span>
          <div>
            <p class="inv-name">${part.name}</p>
            <p class="inv-stock">In stock: <strong class="${isLow ? 'inv-low' : ''}">${part.stock} ${part.unit}</strong>${isLow ? ' · Low' : ''}</p>
          </div>
        </div>
        <div class="inv-update-row">
          <input class="neu-inset" type="number" min="0" placeholder="New qty" data-idx="${idx}" id="inv-input-${idx}">
          <button class="inv-update-btn" data-idx="${idx}">Update Stock</button>
        </div>
      `;
      inventoryGrid.appendChild(card);
    });
  }

  inventoryGrid?.addEventListener('click', (e) => {
    const btn = e.target.closest('.inv-update-btn');
    if (!btn) return;
    const idx = Number(btn.dataset.idx);
    const input = document.getElementById(`inv-input-${idx}`);
    const newQty = parseInt(input.value, 10);
    if (isNaN(newQty) || newQty < 0) {
      input.focus();
      return;
    }
    inventoryParts[idx].stock = newQty;
    renderInventory();
  });

  renderInventory();
})();
