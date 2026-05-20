// 1. Storage Configuration & Helpers
const KEYS = {
  VOLUNTEERS: 'paws_volunteers',
  CONTACTS: 'paws_contacts',
  ADOPTIONS: 'paws_adoptions'
};
const memoryStorage = {};
let activeTab = 'volunteers';

function getStorageData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return memoryStorage[key] || [];
  }
}

function saveStorageData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    memoryStorage[key] = data;
  }
}

// 2. DRY Submission Manager
function addSubmission(key, entry, successMsg) {
  const data = getStorageData(key);
  entry.id = key.slice(5, 8) + '_' + Date.now(); // Short unique ID prefix
  entry.timestamp = new Date().toLocaleString();
  data.unshift(entry);
  saveStorageData(key, data);
  updateDashboard();
  showToast(successMsg, 'success');
}

// Global submit functions called by form-validation.js
window.saveVolunteerSubmission = (name, email, phone, availability, message) =>
  addSubmission(KEYS.VOLUNTEERS, { name, email, phone, availability, message }, 'Volunteer application submitted successfully!');

window.saveContactSubmission = (name, email, subject, message) =>
  addSubmission(KEYS.CONTACTS, { name, email, subject, message }, 'Your message has been sent!');

// 3. Dynamic Adoption Modal Form Flow
window.openAdoptionModal = function (petName, petType) {
  if (!document.getElementById('adopt-modal')) {
    const modal = document.createElement('div');
    modal.id = 'adopt-modal';
    modal.className = 'adopt-modal-overlay';
    modal.innerHTML = `
      <div class="adopt-modal-content">
        <div class="adopt-modal-header">
          <h2>🐾 Adopt <span id="adopt-pet-name"></span></h2>
          <button class="dashboard-close-btn" onclick="closeAdoptModal()">&times;</button>
        </div>
        <form id="adoptForm" onsubmit="submitAdoption(event)">
          <div class="adopt-modal-body">
            <input type="hidden" id="adopt-field-pet-name">
            <input type="hidden" id="adopt-field-pet-type">
            
            <div class="form-group"><label>Full Name</label><input type="text" name="name" required placeholder="John Doe"></div>
            <div class="form-group"><label>Email Address</label><input type="email" name="email" required placeholder="john@example.com"></div>
            <div class="form-group"><label>Phone Number</label><input type="tel" name="phone" required placeholder="+1 (234) 567-8900"></div>
            <div class="form-group"><label>Why do you want to adopt?</label><textarea name="message" rows="3" placeholder="Tell us why..."></textarea></div>
          </div>
          <div class="adopt-modal-footer">
            <button type="button" class="secondary-btn" onclick="closeAdoptModal()">Cancel</button>
            <button type="submit" class="primary-btn">Submit Request</button>
          </div>
        </form>
      </div>
    `;
    modal.onclick = (e) => e.target === modal && closeAdoptModal();
    document.body.appendChild(modal);
  }

  document.getElementById('adopt-pet-name').textContent = petName;
  document.getElementById('adopt-field-pet-name').value = petName;
  document.getElementById('adopt-field-pet-type').value = petType;
  document.getElementById('adopt-modal').classList.add('active');
};

window.closeAdoptModal = () => {
  const modal = document.getElementById('adopt-modal');
  if (modal) modal.classList.remove('active');
};

window.submitAdoption = function (e) {
  e.preventDefault();
  const form = e.target;
  const petName = document.getElementById('adopt-field-pet-name').value;
  const petType = document.getElementById('adopt-field-pet-type').value;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const message = form.message.value.trim();

  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 10) {
    return showToast('Please enter valid submission details.', 'error');
  }

  addSubmission(KEYS.ADOPTIONS, { petName, petType, adopterName: name, adopterEmail: email, adopterPhone: phone, message }, `Adoption request for ${petName} saved!`);
  form.reset();
  closeAdoptModal();
};

// 4. Custom Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container') || (() => {
    const c = document.createElement('div');
    c.id = 'toast-container';
    document.body.appendChild(c);
    return c;
  })();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// 5. Dashboard UI Manager
function initDashboard() {
  if (document.getElementById('dashboard-trigger')) return;

  // Floating trigger button
  const trigger = document.createElement('button');
  trigger.id = 'dashboard-trigger';
  trigger.className = 'dashboard-trigger-btn';
  trigger.innerHTML = '📋 <span class="badge" id="dashboard-badge" style="display:none">0</span>';
  trigger.onclick = toggleDashboardModal;
  document.body.appendChild(trigger);

  // Modal Overlay
  const modal = document.createElement('div');
  modal.id = 'dashboard-modal';
  modal.className = 'dashboard-modal-overlay';
  modal.innerHTML = `
    <div class="dashboard-modal-content">
      <div class="dashboard-modal-header">
        <h2>🐾 Submissions Dashboard</h2>
        <button class="dashboard-close-btn" onclick="toggleDashboardModal()">&times;</button>
      </div>
      <div class="dashboard-tabs">
        <button class="tab-btn active" onclick="switchTab(this, 'volunteers')">Volunteers</button>
        <button class="tab-btn" onclick="switchTab(this, 'contacts')">Contacts</button>
        <button class="tab-btn" onclick="switchTab(this, 'adoptions')">Adoptions</button>
      </div>
      <div class="dashboard-tab-content" id="dashboard-tab-content"></div>
      <div class="dashboard-modal-footer">
        <button class="secondary-btn" onclick="clearActiveTab()">Clear Tab</button>
        <button class="primary-btn" onclick="exportStorageData()">Export (JSON)</button>
      </div>
    </div>
  `;
  modal.onclick = (e) => e.target === modal && toggleDashboardModal();
  document.body.appendChild(modal);
  updateBadge();
}

window.toggleDashboardModal = function () {
  const modal = document.getElementById('dashboard-modal');
  modal.classList.toggle('active');
  if (modal.classList.contains('active')) renderActiveTab();
};

window.switchTab = function (btn, tabName) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeTab = tabName;
  renderActiveTab();
};

function renderActiveTab() {
  const container = document.getElementById('dashboard-tab-content');
  if (!container) return;

  const key = KEYS[activeTab.toUpperCase()];
  const data = getStorageData(key);

  if (data.length === 0) {
    container.innerHTML = `<div class="empty-state">No submissions found in this tab.</div>`;
    return;
  }

  container.innerHTML = data.map(item => {
    let title = '', details = '';

    if (activeTab === 'volunteers') {
      title = item.name;
      details = `<p>📧 ${item.email} | 📞 ${item.phone}</p><p><strong>Availability:</strong> ${item.availability}</p>`;
    } else if (activeTab === 'contacts') {
      title = item.name;
      details = `<p>📧 ${item.email}</p><p><strong>Subject:</strong> ${item.subject}</p>`;
    } else if (activeTab === 'adoptions') {
      title = `Adopt ${item.petName} (${item.petType})`;
      details = item.adopterName
        ? `<p>👤 <strong>Adopter:</strong> ${item.adopterName}</p><p>📧 ${item.adopterEmail} | 📞 ${item.adopterPhone}</p>`
        : `<p>Request to adopt a friendly <strong>${item.petType}</strong>.</p>`;
    }

    return `
      <div class="dashboard-card ${activeTab === 'adoptions' ? 'pet-adoption-card' : ''}">
        <div class="card-header">
          <strong>${escapeHTML(title)}</strong>
          <span class="timestamp">${item.timestamp}</span>
        </div>
        <div class="card-details">
          ${details}
          ${item.message ? `<p class="message">"${escapeHTML(item.message)}"</p>` : ''}
        </div>
        <button class="delete-item-btn" onclick="deleteItem('${key}', '${item.id}')">&times;</button>
      </div>
    `;
  }).join('');
}

// 6. Global Action Helpers
window.deleteItem = function (key, id) {
  const data = getStorageData(key).filter(item => item.id !== id);
  saveStorageData(key, data);
  updateDashboard();
  showToast('Submission removed!', 'info');
};

window.clearActiveTab = function () {
  const key = KEYS[activeTab.toUpperCase()];
  if (getStorageData(key).length === 0) return showToast('Nothing to clear!', 'info');
  if (confirm('Are you sure you want to clear all submissions in this tab?')) {
    saveStorageData(key, []);
    updateDashboard();
    showToast('Tab cleared successfully!', 'success');
  }
};

window.exportStorageData = function () {
  const allData = { volunteers: getStorageData(KEYS.VOLUNTEERS), contacts: getStorageData(KEYS.CONTACTS), adoptions: getStorageData(KEYS.ADOPTIONS) };
  const downloadAnchor = document.createElement('a');
  downloadAnchor.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData, null, 2));
  downloadAnchor.download = "pawshome_submissions_export.json";
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('Submissions exported as JSON!', 'success');
};

function updateDashboard() {
  updateBadge();
  if (document.getElementById('dashboard-modal').classList.contains('active')) renderActiveTab();
}

function updateBadge() {
  const badge = document.getElementById('dashboard-badge');
  if (!badge) return;
  const total = getStorageData(KEYS.VOLUNTEERS).length + getStorageData(KEYS.CONTACTS).length + getStorageData(KEYS.ADOPTIONS).length;
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

// Initialize Dashboard UI
document.addEventListener('DOMContentLoaded', initDashboard);
