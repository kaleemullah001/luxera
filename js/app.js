/**
 * ============================================================
 *  LUXÉRA — MAIN APP LOGIC
 *  Handles storefront rendering, dashboard, drag & drop,
 *  product management, and local storage persistence.
 * ============================================================
 */

// ── State ──────────────────────────────────────────────────
let products = loadProducts();
let dragSrc  = null;

// ── Persistence ────────────────────────────────────────────
function loadProducts() {
  try {
    const saved = localStorage.getItem('luxera_products');
    return saved ? JSON.parse(saved) : [...PRODUCTS_DATA];
  } catch (e) {
    return [...PRODUCTS_DATA];
  }
}

function persistProducts() {
  try {
    localStorage.setItem('luxera_products', JSON.stringify(products));
  } catch (e) { /* storage unavailable */ }
}

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  renderStore();
  renderOverview();
});

// ── View switching ─────────────────────────────────────────
function switchView(view, btn) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + view).classList.add('active');
  if (btn) {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
  }
  if (view === 'dash') renderOverview();
}

function scrollToProducts() {
  document.getElementById('products-anchor').scrollIntoView({ behavior: 'smooth' });
}

// ── Dashboard page switching ───────────────────────────────
function switchDash(el, page) {
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');

  document.querySelectorAll('.dash-page').forEach(p => p.style.display = 'none');
  const target = document.getElementById('dash-' + page);
  if (target) target.style.display = 'block';

  if (page === 'manage')    renderManage();
  if (page === 'arrange')   renderArrange();
  if (page === 'analytics') renderAnalytics();
  if (page === 'overview')  renderOverview();
}

// ══════════════════════════════════════════════════════════
//  STOREFRONT
// ══════════════════════════════════════════════════════════
function renderStore(filter = 'all') {
  const grid     = document.getElementById('store-grid');
  const counter  = document.getElementById('prod-count');
  if (!grid) return;

  const filtered = filter === 'all'
    ? products.filter(p => p.live !== false)
    : products.filter(p => p.cat === filter && p.live !== false);

  if (counter) counter.textContent = filtered.length + ' product' + (filtered.length !== 1 ? 's' : '');

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;padding:3rem;text-align:center;color:var(--text-dim);font-size:12px;letter-spacing:1px">
      No products in this category yet.
    </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-img">
        <div class="product-img-inner">${p.emoji || '🛍️'}</div>
        ${p.badge ? `<div class="product-badge">${escHtml(p.badge)}</div>` : ''}
        <div class="product-overlay">
          <button class="overlay-btn" onclick="goToProduct('${escAttr(p.link)}')">Buy Now →</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-brand">${escHtml(p.brand)}</div>
        <div class="product-name">${escHtml(p.name)}</div>
        <div class="product-desc">${escHtml(p.desc)}</div>
        <div class="product-footer">
          <div class="product-price">${escHtml(p.price)}</div>
          <div class="product-rating">
            <span class="stars">★★★★★</span>
            ${p.rating || '4.9'}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function goToProduct(url) {
  if (url && url.startsWith('http')) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

function filterCat(btn, cat) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderStore(cat);
}

// ══════════════════════════════════════════════════════════
//  DASHBOARD — OVERVIEW
// ══════════════════════════════════════════════════════════
function renderOverview() {
  const totalEl = document.getElementById('stat-total');
  if (totalEl) totalEl.textContent = products.length;

  // Weekly clicks mini-chart
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const vals = [312, 445, 380, 521, 490, 610, 533];
  const max  = Math.max(...vals);
  const chart = document.getElementById('mini-chart');
  if (chart) {
    chart.innerHTML = days.map((d, i) => `
      <div class="bar" style="height:${Math.round(vals[i] / max * 100)}%" title="${vals[i]} clicks">
        <span class="bar-label">${d}</span>
      </div>`).join('');
  }

  // Top products list
  const clicks = [892, 741, 603, 489, 320];
  const topEl  = document.getElementById('top-list');
  if (topEl) {
    topEl.innerHTML = products.slice(0, 5).map((p, i) => `
      <div class="top-item">
        <span class="top-rank">${i + 1}</span>
        <span class="top-item-name">${escHtml(p.name)}</span>
        <div class="top-bar-bg">
          <div class="top-bar-fill" style="width:${Math.round(clicks[i] / 892 * 100)}%"></div>
        </div>
        <span class="top-clicks">${clicks[i]}</span>
      </div>`).join('');
  }

  // Recent activity
  const rec = document.getElementById('recent-list');
  if (rec) {
    const events = [
      { t: '2 min ago',  e: `Click on ${products[0]?.name || 'product'} → affiliate link` },
      { t: '11 min ago', e: `Click on ${products[1]?.name || 'product'} → affiliate link` },
      { t: '34 min ago', e: 'New product added via dashboard' },
      { t: '1 hr ago',   e: `Click on ${products[3]?.name || 'product'} → affiliate link` },
      { t: '3 hr ago',   e: 'Product order rearranged via Drag & Arrange' },
    ];
    rec.innerHTML = `<div style="display:flex;flex-direction:column;gap:4px">` +
      events.map(ev => `
        <div style="display:flex;gap:1rem;align-items:center;padding:10px 12px;background:var(--dark2);border:1px solid var(--border)">
          <span style="font-size:9px;color:var(--text-dim);white-space:nowrap;min-width:72px">${ev.t}</span>
          <span style="font-size:11px;color:var(--text-muted)">${ev.e}</span>
        </div>`).join('') + `</div>`;
  }
}

// ══════════════════════════════════════════════════════════
//  DASHBOARD — ADD PRODUCT
// ══════════════════════════════════════════════════════════
function clearForm() {
  ['f-brand','f-name','f-price','f-cat','f-desc','f-link','f-commission','f-emoji','f-badge','f-rating'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  resetUploadZone();
  hideMsg('save-msg');
}

function saveProduct() {
  const brand = val('f-brand');
  const name  = val('f-name');

  if (!brand || !name) {
    alert('Please fill in at least Brand Name and Product Name.');
    return;
  }

  const price = val('f-price');
  const newP  = {
    id:         Date.now(),
    brand,
    name,
    price:      price ? '$' + price.replace(/^\$/, '') : '—',
    cat:        val('f-cat') || 'accessories',
    desc:       val('f-desc') || 'Premium luxury product.',
    link:       val('f-link') || '#',
    commission: val('f-commission') || '5',
    emoji:      val('f-emoji') || '🛍️',
    badge:      val('f-badge') || '',
    rating:     val('f-rating') || '4.9',
    live:       true
  };

  products.push(newP);
  persistProducts();
  renderStore();
  showMsg('save-msg');
  clearForm();
}

// ══════════════════════════════════════════════════════════
//  DASHBOARD — MANAGE PRODUCTS
// ══════════════════════════════════════════════════════════
function renderManage() {
  const tbody = document.getElementById('manage-tbody');
  if (!tbody) return;
  tbody.innerHTML = products.map(p => `
    <tr>
      <td><div class="table-thumb">${p.emoji || '🛍️'}</div></td>
      <td>
        <div class="table-name">${escHtml(p.name)}</div>
        <div style="font-size:9px;color:var(--text-dim);margin-top:2px">${escHtml(p.brand)}</div>
      </td>
      <td style="text-transform:capitalize">${escHtml(p.cat)}</td>
      <td>${escHtml(p.price)}</td>
      <td>${escHtml(p.commission || '—')}%</td>
      <td><span class="status-dot live"></span>Live</td>
      <td><a class="table-link" href="${escAttr(p.link)}" target="_blank" rel="noopener">View ↗</a></td>
      <td>
        <div class="action-btns">
          <button class="action-btn" onclick="editProduct(${p.id})">Edit</button>
          <button class="action-btn danger" onclick="deleteProduct(${p.id})">Remove</button>
        </div>
      </td>
    </tr>`).join('');
}

function editProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  setVal('f-brand',      p.brand);
  setVal('f-name',       p.name);
  setVal('f-price',      p.price.replace('$', ''));
  setVal('f-cat',        p.cat);
  setVal('f-desc',       p.desc);
  setVal('f-link',       p.link);
  setVal('f-commission', p.commission);
  setVal('f-emoji',      p.emoji);
  setVal('f-badge',      p.badge);
  setVal('f-rating',     p.rating);
  // Remove old entry so save replaces it
  products = products.filter(x => x.id !== id);
  persistProducts();
  switchDash(document.querySelectorAll('.sidebar-item')[1], 'add');
}

function deleteProduct(id) {
  if (!confirm('Remove this product from your store?')) return;
  products = products.filter(p => p.id !== id);
  persistProducts();
  renderManage();
  renderStore();
}

// ══════════════════════════════════════════════════════════
//  DASHBOARD — DRAG & ARRANGE
// ══════════════════════════════════════════════════════════
function renderArrange() {
  const list = document.getElementById('drag-list');
  if (!list) return;
  list.innerHTML = products.map((p, i) => `
    <div class="drag-item"
      draggable="true"
      data-index="${i}"
      ondragstart="dragStart(event, ${i})"
      ondragover="dragOver(event)"
      ondrop="dropItem(event, ${i})"
      ondragend="dragEnd(event)">
      <span class="drag-handle">⠿</span>
      <span class="drag-emoji">${p.emoji || '🛍️'}</span>
      <div class="drag-info">
        <div class="drag-name">${escHtml(p.name)}</div>
        <div class="drag-cat">${escHtml(p.cat)}</div>
      </div>
      <div class="drag-price">${escHtml(p.price)}</div>
    </div>`).join('');
  renderPreview();
}

function renderPreview() {
  const area = document.getElementById('preview-items');
  if (!area) return;
  area.innerHTML = products.slice(0, 5).map(p => `
    <div class="mini-product">
      <div class="mini-img">${p.emoji || '🛍️'}</div>
      <div>
        <div class="mini-name">${escHtml(p.name)}</div>
        <div class="mini-price">${escHtml(p.price)}</div>
      </div>
    </div>`).join('');
}

function dragStart(e, i) {
  dragSrc = i;
  e.currentTarget.classList.add('dragging');
}
function dragEnd(e) {
  e.currentTarget.classList.remove('dragging');
}
function dragOver(e) {
  e.preventDefault();
}
function dropItem(e, targetIdx) {
  e.preventDefault();
  if (dragSrc === null || dragSrc === targetIdx) return;
  const arr = [...products];
  const [moved] = arr.splice(dragSrc, 1);
  arr.splice(targetIdx, 0, moved);
  products = arr;
  dragSrc  = null;
  renderArrange();
}
function saveOrder() {
  persistProducts();
  renderStore();
  showMsg('order-msg');
}

// ══════════════════════════════════════════════════════════
//  DASHBOARD — ANALYTICS
// ══════════════════════════════════════════════════════════
function renderAnalytics() {
  const days  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const vals  = [430, 580, 512, 720, 668, 830, 711];
  const max   = Math.max(...vals);
  const chart = document.getElementById('big-chart');
  if (chart) {
    chart.innerHTML = days.map((d, i) => `
      <div class="bar" style="height:${Math.round(vals[i] / max * 100)}%" title="${vals[i]} clicks">
        <span class="bar-label">${d}</span>
      </div>`).join('');
  }

  const clicks = [892, 741, 603, 489, 320, 270, 198, 120];
  const top2   = document.getElementById('top-list2');
  if (top2) {
    top2.innerHTML = products.map((p, i) => `
      <div class="top-item">
        <span class="top-rank">${i + 1}</span>
        <span class="top-item-name">${escHtml(p.name)}</span>
        <div class="top-bar-bg">
          <div class="top-bar-fill" style="width:${Math.round((clicks[i] || 80) / 892 * 100)}%"></div>
        </div>
        <span class="top-clicks">${clicks[i] || 80}</span>
      </div>`).join('');
  }
}

// ══════════════════════════════════════════════════════════
//  SETTINGS
// ══════════════════════════════════════════════════════════
function saveSettings() {
  showMsg('settings-msg');
}

// ══════════════════════════════════════════════════════════
//  FILE UPLOAD (drop zone)
// ══════════════════════════════════════════════════════════
function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('dropzone').classList.add('drag-over');
}
function handleDragLeave() {
  document.getElementById('dropzone').classList.remove('drag-over');
}
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('dropzone').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) showFileUploaded(file.name);
}
function triggerUpload() {
  document.getElementById('file-input').click();
}
function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) showFileUploaded(file.name);
}
function showFileUploaded(name) {
  setInner('upload-icon',  '✅');
  setInner('upload-title', 'Uploaded: ' + name);
  setInner('upload-sub',   'Click to replace');
}
function resetUploadZone() {
  setInner('upload-icon',  '🖼️');
  setInner('upload-title', 'Drag & Drop Product Image');
  setInner('upload-sub',   'or click to browse files');
}

// ══════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════
function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
function setVal(id, v) {
  const el = document.getElementById(id);
  if (el) el.value = v || '';
}
function setInner(id, html) {
  const el = document.getElementById(id);
  if (el) el.textContent = html;
}
function showMsg(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}
function hideMsg(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}
function escHtml(str) {
  return String(str || '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}
function escAttr(str) {
  return String(str || '').replace(/"/g, '&quot;');
}
