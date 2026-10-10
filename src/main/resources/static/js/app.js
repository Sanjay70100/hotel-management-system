/**
 * GRANDSTAY ROYALE — LUXURY HOTEL MANAGEMENT SYSTEM
 * Dynamic Single Page Application Architecture
 */

// =============================================================================
// STATE & CONFIGURATION
// =============================================================================

const AppConfig = {
  getApiBase: () => localStorage.getItem('grandstay_api_url') || 'http://localhost:8080',
  setApiBase: (url) => localStorage.setItem('grandstay_api_url', url),
  getToken: () => localStorage.getItem('grandstay_jwt_token') || '',
  setToken: (token) => localStorage.setItem('grandstay_jwt_token', token),
  clearToken: () => {
    localStorage.removeItem('grandstay_jwt_token');
    localStorage.removeItem('grandstay_user');
  },
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem('grandstay_user') || 'null');
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem('grandstay_user', JSON.stringify(user)),
};

const AppState = {
  activeTab: 'dashboard',
  isOnline: false,
  usingDemoMode: false,
  rooms: [],
  guests: [],
  bookings: [],
  payments: [],
  staff: [],
  users: [],
  stats: {
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    maintenanceRooms: 0,
    totalGuests: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
  },
  filterRooms: 'ALL',
  filterBookings: 'ALL',
  filterStaff: 'ALL',
  searchQuery: '',
};

// =============================================================================
// SEED & DEMO DATA (Used for offline preview or 1-click seeding)
// =============================================================================

const DemoData = {
  rooms: [
    { id: 1, roomNumber: "101", roomType: "Deluxe King Suite", price: 6500.0, status: "AVAILABLE" },
    { id: 2, roomNumber: "102", roomType: "Deluxe Twin Suite", price: 6000.0, status: "OCCUPIED" },
    { id: 3, roomNumber: "201", roomType: "Executive Skyline Suite", price: 9500.0, status: "AVAILABLE" },
    { id: 4, roomNumber: "202", roomType: "Executive Skyline Suite", price: 9500.0, status: "OCCUPIED" },
    { id: 5, roomNumber: "301", roomType: "Grand Presidential Suite", price: 24000.0, status: "AVAILABLE" },
    { id: 6, roomNumber: "302", roomType: "Royal Penthouse Suite", price: 32000.0, status: "MAINTENANCE" },
    { id: 7, roomNumber: "401", roomType: "Standard Club Room", price: 4500.0, status: "AVAILABLE" },
    { id: 8, roomNumber: "402", roomType: "Standard Club Room", price: 4500.0, status: "OCCUPIED" }
  ],
  guests: [
    { id: 1, name: "Alexander Wright", email: "alex.wright@executive.com", phone: "9876543210", address: "42 Park Avenue, Mumbai" },
    { id: 2, name: "Dr. Evelyn Vance", email: "evelyn.vance@horizon.org", phone: "9823456789", address: "18 Jubilee Hills, Hyderabad" },
    { id: 3, name: "Rohit Malhotra", email: "rohit.m@technologies.in", phone: "9845123456", address: "88 Indiranagar, Bengaluru" },
    { id: 4, name: "Elena Rostova", email: "elena.rostova@luxurytravel.com", phone: "9811223344", address: "The Palm Jumeirah, Dubai" }
  ],
  bookings: [
    { id: 1, guestId: 1, roomId: 2, checkInDate: "2026-10-09", checkOutDate: "2026-10-14", numberOfGuests: 2, status: "CONFIRMED" },
    { id: 2, guestId: 2, roomId: 4, checkInDate: "2026-10-08", checkOutDate: "2026-10-12", numberOfGuests: 1, status: "CONFIRMED" },
    { id: 3, guestId: 3, roomId: 8, checkInDate: "2026-10-10", checkOutDate: "2026-10-15", numberOfGuests: 2, status: "CONFIRMED" },
    { id: 4, guestId: 4, roomId: 1, checkInDate: "2026-10-12", checkOutDate: "2026-10-18", numberOfGuests: 2, status: "CONFIRMED" }
  ],
  payments: [
    { id: 1, bookingId: 1, amount: 30000.0, paymentMethod: "CARD", paymentStatus: "PAID", paymentDate: "2026-10-09T14:30:00" },
    { id: 2, bookingId: 2, amount: 38000.0, paymentMethod: "UPI", paymentStatus: "PAID", paymentDate: "2026-10-08T11:15:00" },
    { id: 3, bookingId: 3, amount: 22500.0, paymentMethod: "NET_BANKING", paymentStatus: "PENDING", paymentDate: "2026-10-10T09:40:00" }
  ],
  staff: [
    { id: 1, name: "Marcus Sterling", email: "marcus.s@grandstay.com", phone: "9870011223", department: "Management", position: "General Manager" },
    { id: 2, name: "Priya Sharma", email: "priya.sharma@grandstay.com", phone: "9870022334", department: "Front Desk", position: "Front Office Director" },
    { id: 3, name: "Jean-Pierre Laurent", email: "jp.laurent@grandstay.com", phone: "9870033445", department: "Food & Beverage", position: "Executive Chef" },
    { id: 4, name: "Sunita Roy", email: "sunita.roy@grandstay.com", phone: "9870044556", department: "Housekeeping", position: "Executive Housekeeper" }
  ],
  users: [
    { id: 1, username: "admin", role: "ADMIN" },
    { id: 2, name: "frontdesk_staff", username: "staff_priya", role: "STAFF" }
  ]
};

// =============================================================================
// API CLIENT
// =============================================================================

async function apiRequest(endpoint, options = {}) {
  const baseUrl = AppConfig.getApiBase();
  const token = AppConfig.getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401 || response.status === 403) {
      if (!endpoint.includes('/api/auth/login')) {
        console.warn('Authentication token expired or unauthorized.');
      }
    }

    if (!response.ok) {
      let errorMsg = `HTTP Error ${response.status}`;
      try {
        const errJson = await response.json();
        errorMsg = errJson.message || JSON.stringify(errJson);
      } catch {
        errorMsg = await response.text() || errorMsg;
      }
      throw new Error(errorMsg);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    throw error;
  }
}

// =============================================================================
// NOTIFICATIONS / TOASTS
// =============================================================================

function showToast(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  toast.innerHTML = `
    <div class="toast-icon">${iconMap[type] || 'ℹ'}</div>
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-message">${escapeHtml(message)}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 300);
  }, 4200);
}

function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

// =============================================================================
// AUTHENTICATION CONTROLLER
// =============================================================================

async function handleLogin(username, password) {
  try {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (data.token) {
      AppConfig.setToken(data.token);
      AppConfig.setUser({
        id: data.id,
        username: data.username,
        role: data.role,
      });

      showToast('Welcome Back', `Logged in successfully as ${data.username} (${data.role})`, 'success');
      closeModal('login-modal');
      updateAuthUI();
      await fetchAllData();
      return true;
    }
  } catch (err) {
    // If backend is offline or credentials failed
    if (!AppState.isOnline) {
      // Allow demo login
      if (username === 'admin' && password === 'admin123') {
        AppConfig.setToken('demo_admin_jwt_token_sample');
        AppConfig.setUser({ id: 1, username: 'admin', role: 'ADMIN' });
        showToast('Demo Mode Activated', 'Logged in as Admin (Demo Session)', 'info');
        closeModal('login-modal');
        updateAuthUI();
        await fetchAllData();
        return true;
      }
    }
    showToast('Authentication Failed', err.message || 'Invalid username or password', 'error');
    throw err;
  }
}

function handleLogout() {
  AppConfig.clearToken();
  updateAuthUI();
  showToast('Logged Out', 'You have been signed out of GrandStay Royale', 'info');
  // Re-fetch data or switch to demo
  fetchAllData();
}

function updateAuthUI() {
  const user = AppConfig.getUser();
  const userNameElem = document.getElementById('header-user-name');
  const userRoleElem = document.getElementById('header-user-role');
  const userAvatarElem = document.getElementById('header-user-avatar');

  if (user && userNameElem && userRoleElem) {
    userNameElem.textContent = user.username;
    userRoleElem.textContent = user.role;
    if (userAvatarElem) {
      userAvatarElem.textContent = user.username.substring(0, 2).toUpperCase();
    }
  } else if (userNameElem && userRoleElem) {
    userNameElem.textContent = 'Guest / Demo';
    userRoleElem.textContent = 'OPERATOR';
    if (userAvatarElem) {
      userAvatarElem.textContent = 'GS';
    }
  }
}

// =============================================================================
// BACKEND SYNC & HEALTH CHECK
// =============================================================================

async function checkBackendHealth() {
  const pill = document.getElementById('connection-status-pill');
  const text = document.getElementById('connection-status-text');

  try {
    const res = await fetch(`${AppConfig.getApiBase()}/v3/api-docs`, { method: 'GET' });
    if (res.ok || res.status === 401 || res.status === 403) {
      AppState.isOnline = true;
      AppState.usingDemoMode = false;
      if (pill) {
        pill.className = 'connection-pill online';
      }
      if (text) text.textContent = 'Spring Boot (Live)';
      return true;
    }
  } catch {
    // API not reachable
  }

  AppState.isOnline = false;
  AppState.usingDemoMode = true;
  if (pill) {
    pill.className = 'connection-pill demo';
  }
  if (text) text.textContent = 'Demo Mode (Offline)';
  return false;
}

// =============================================================================
// DATA FETCHING & SYNC
// =============================================================================

async function fetchAllData() {
  const isOnline = await checkBackendHealth();

  if (isOnline) {
    try {
      // 1. Fetch Admin Dashboard Stats
      try {
        const stats = await apiRequest('/api/admin/dashboard');
        AppState.stats = stats;
      } catch (err) {
        console.warn('Dashboard stats requires Admin role or failed:', err);
      }

      // 2. Fetch Rooms
      const rooms = await apiRequest('/api/rooms');
      AppState.rooms = rooms || [];

      // 3. Fetch Guests
      const guests = await apiRequest('/api/guests');
      AppState.guests = guests || [];

      // 4. Fetch Bookings
      const bookings = await apiRequest('/api/bookings');
      AppState.bookings = bookings || [];

      // 5. Fetch Payments
      try {
        const payments = await apiRequest('/api/payments');
        AppState.payments = payments || [];
      } catch {
        AppState.payments = [];
      }

      // 6. Fetch Staff
      try {
        const staff = await apiRequest('/api/staff');
        AppState.staff = staff || [];
      } catch {
        AppState.staff = [];
      }

      // 7. Fetch Users (if admin)
      try {
        const users = await apiRequest('/api/users');
        AppState.users = users || [];
      } catch {
        AppState.users = [];
      }

      recalculateMetrics();
      renderAllViews();
      return;
    } catch (err) {
      console.warn('Live API request encountered error, falling back to cached/demo data:', err);
    }
  }

  // Fallback to Demo Data
  AppState.rooms = [...DemoData.rooms];
  AppState.guests = [...DemoData.guests];
  AppState.bookings = [...DemoData.bookings];
  AppState.payments = [...DemoData.payments];
  AppState.staff = [...DemoData.staff];
  AppState.users = [...DemoData.users];

  recalculateMetrics();
  renderAllViews();
}

function recalculateMetrics() {
  const rooms = AppState.rooms;
  const available = rooms.filter(r => r.status === 'AVAILABLE').length;
  const occupied = rooms.filter(r => r.status === 'OCCUPIED').length;
  const maintenance = rooms.filter(r => r.status === 'MAINTENANCE').length;

  const totalRevenue = AppState.payments
    .filter(p => p.paymentStatus === 'PAID')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  AppState.stats = {
    totalRooms: rooms.length,
    availableRooms: available,
    occupiedRooms: occupied,
    maintenanceRooms: maintenance,
    totalGuests: AppState.guests.length,
    totalBookings: AppState.bookings.length,
    confirmedBookings: AppState.bookings.filter(b => b.status === 'CONFIRMED').length,
    cancelledBookings: AppState.bookings.filter(b => b.status === 'CANCELLED').length,
    totalRevenue: totalRevenue || AppState.stats.totalRevenue || 0,
  };
}

// =============================================================================
// SEED LIVE BACKEND UTILITY
// =============================================================================

async function seedBackendWithSampleData() {
  if (!AppState.isOnline) {
    showToast('Cannot Seed', 'Backend server is offline. Please launch Spring Boot on port 8080.', 'error');
    return;
  }

  showToast('Seeding Database', 'Creating luxury sample rooms, guests, bookings, and staff...', 'info');

  try {
    // 1. Seed Rooms
    for (const room of DemoData.rooms) {
      try {
        await apiRequest('/api/rooms', {
          method: 'POST',
          body: JSON.stringify({
            roomNumber: room.roomNumber,
            roomType: room.roomType,
            price: room.price,
            status: room.status,
          }),
        });
      } catch (e) {
        console.warn(`Room ${room.roomNumber} may already exist:`, e.message);
      }
    }

    // 2. Seed Guests
    const createdGuests = [];
    for (const guest of DemoData.guests) {
      try {
        const res = await apiRequest('/api/guests', {
          method: 'POST',
          body: JSON.stringify({
            name: guest.name,
            email: guest.email,
            phone: guest.phone,
            address: guest.address,
          }),
        });
        createdGuests.push(res);
      } catch (e) {
        console.warn(`Guest ${guest.name} error:`, e.message);
      }
    }

    // 3. Seed Staff
    for (const member of DemoData.staff) {
      try {
        await apiRequest('/api/staff', {
          method: 'POST',
          body: JSON.stringify({
            name: member.name,
            email: member.email,
            phone: member.phone,
            department: member.department,
            position: member.position,
          }),
        });
      } catch (e) {
        console.warn(`Staff ${member.name} error:`, e.message);
      }
    }

    showToast('Success!', 'Sample hotel data has been populated into your PostgreSQL database!', 'success');
    await fetchAllData();
  } catch (err) {
    showToast('Seeding Incomplete', err.message, 'error');
  }
}

// =============================================================================
// RENDERERS: VIEWS & COMPONENTS
// =============================================================================

function renderAllViews() {
  renderDashboard();
  renderRooms();
  renderBookings();
  renderGuests();
  renderPayments();
  renderStaff();
  renderUsers();
}

// 1. DASHBOARD VIEW
function renderDashboard() {
  const { totalRooms, availableRooms, occupiedRooms, totalGuests, totalBookings, totalRevenue } = AppState.stats;

  // Stat values
  const revElem = document.getElementById('stat-total-revenue');
  const occElem = document.getElementById('stat-occupancy-rate');
  const bookElem = document.getElementById('stat-total-bookings');
  const guestElem = document.getElementById('stat-total-guests');

  if (revElem) revElem.textContent = formatCurrency(totalRevenue);
  if (bookElem) bookElem.textContent = totalBookings;
  if (guestElem) guestElem.textContent = totalGuests;

  const rate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  if (occElem) occElem.textContent = `${rate}%`;

  // Occupancy Banner
  const occBarFill = document.getElementById('occupancy-bar-fill');
  const occBannerPct = document.getElementById('occupancy-banner-percentage');
  const occAvailableTxt = document.getElementById('occupancy-available-count');
  const occOccupiedTxt = document.getElementById('occupancy-occupied-count');
  const occMaintTxt = document.getElementById('occupancy-maintenance-count');

  if (occBarFill) occBarFill.style.width = `${rate}%`;
  if (occBannerPct) occBannerPct.textContent = `${rate}% Occupied`;
  if (occAvailableTxt) occAvailableTxt.textContent = `${availableRooms} Available`;
  if (occOccupiedTxt) occOccupiedTxt.textContent = `${occupiedRooms} Occupied`;
  if (occMaintTxt) occMaintTxt.textContent = `${AppState.stats.maintenanceRooms || 0} Maintenance`;

  // Mini Room Floor Matrix
  const floorMatrix = document.getElementById('dashboard-floor-matrix');
  if (floorMatrix) {
    if (AppState.rooms.length === 0) {
      floorMatrix.innerHTML = `<div style="grid-column: 1/-1; padding: 20px; text-align: center; color: var(--text-tertiary);">No rooms configured yet.</div>`;
    } else {
      floorMatrix.innerHTML = AppState.rooms.map(room => {
        const statusClass = room.status.toLowerCase();
        return `
          <div class="floor-room-tile ${statusClass}" title="Room ${escapeHtml(room.roomNumber)} - ${escapeHtml(room.roomType)} (${room.status})" onclick="switchTab('rooms')">
            <span class="room-tile-num">${escapeHtml(room.roomNumber)}</span>
            <span class="room-tile-badge">${room.status.substring(0, 3)}</span>
          </div>
        `;
      }).join('');
    }
  }

  // Recent Bookings Table
  const recentTable = document.getElementById('dashboard-recent-bookings');
  if (recentTable) {
    const recent = [...AppState.bookings].slice(0, 5);
    if (recent.length === 0) {
      recentTable.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-tertiary); padding: 24px;">No reservations found.</td></tr>`;
    } else {
      recentTable.innerHTML = recent.map(booking => {
        const guest = AppState.guests.find(g => g.id === booking.guestId) || { name: `Guest #${booking.guestId}` };
        const room = AppState.rooms.find(r => r.id === booking.roomId) || { roomNumber: `#${booking.roomId}`, roomType: 'Suite' };
        return `
          <tr>
            <td><strong>#BKG-${booking.id}</strong></td>
            <td>
              <div style="font-weight: 600; color: var(--text-primary);">${escapeHtml(guest.name)}</div>
              <div style="font-size: 0.76rem; color: var(--text-tertiary);">${escapeHtml(guest.phone || '')}</div>
            </td>
            <td>
              <span class="badge badge-occupied">Room ${escapeHtml(room.roomNumber)}</span>
              <div style="font-size: 0.74rem; color: var(--text-tertiary); margin-top: 2px;">${escapeHtml(room.roomType)}</div>
            </td>
            <td>${formatDate(booking.checkInDate)} → ${formatDate(booking.checkOutDate)}</td>
            <td>${booking.numberOfGuests} Guests</td>
            <td><span class="badge badge-${booking.status.toLowerCase()}">${booking.status}</span></td>
          </tr>
        `;
      }).join('');
    }
  }
}

// 2. ROOMS VIEW
function renderRooms() {
  const container = document.getElementById('rooms-grid-container');
  if (!container) return;

  let filtered = [...AppState.rooms];
  if (AppState.filterRooms !== 'ALL') {
    filtered = filtered.filter(r => r.status === AppState.filterRooms);
  }

  if (AppState.searchQuery) {
    const q = AppState.searchQuery.toLowerCase();
    filtered = filtered.filter(r => 
      (r.roomNumber && r.roomNumber.toLowerCase().includes(q)) ||
      (r.roomType && r.roomType.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
        <h4 style="font-size: 1.15rem; color: var(--text-secondary); margin-bottom: 8px;">No rooms match your filter</h4>
        <p style="color: var(--text-tertiary); font-size: 0.88rem; margin-bottom: 20px;">Try changing filter options or create a new room suite.</p>
        <button class="btn btn-primary" onclick="openModal('add-room-modal')">+ Add Room</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(room => {
    const statusClass = room.status.toLowerCase();
    return `
      <div class="room-card">
        <div class="room-card-image-wrap">
          <img src="/assets/suite.jpg" alt="${escapeHtml(room.roomType)}" class="room-card-image" onerror="this.style.display='none'" />
          <div class="room-badge-overlay">
            <span class="badge badge-${statusClass}">${room.status}</span>
          </div>
          <div class="room-price-overlay">
            ${formatCurrency(room.price)}<span style="font-size: 0.75rem; font-weight: normal; color: var(--text-tertiary);"> / night</span>
          </div>
        </div>

        <div class="room-card-body">
          <div class="room-card-header">
            <div class="room-number">Suite ${escapeHtml(room.roomNumber)}</div>
          </div>
          <div class="room-type">${escapeHtml(room.roomType)}</div>

          <div class="room-card-footer">
            <div style="display: flex; gap: 6px; align-items: center;">
              <select class="form-control" style="height: 32px; padding: 0 8px; font-size: 0.78rem; width: auto;" onchange="changeRoomStatus(${room.id}, this.value)">
                <option value="AVAILABLE" ${room.status === 'AVAILABLE' ? 'selected' : ''}>Available</option>
                <option value="OCCUPIED" ${room.status === 'OCCUPIED' ? 'selected' : ''}>Occupied</option>
                <option value="MAINTENANCE" ${room.status === 'MAINTENANCE' ? 'selected' : ''}>Maintenance</option>
              </select>
            </div>

            <div style="display: flex; gap: 8px;">
              <button class="btn btn-sm btn-secondary" onclick="openEditRoomModal(${room.id})" title="Edit Room">✏️</button>
              <button class="btn btn-sm btn-danger" onclick="deleteRoom(${room.id})" title="Delete Room">🗑️</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 3. BOOKINGS VIEW
function renderBookings() {
  const tbody = document.getElementById('bookings-table-body');
  if (!tbody) return;

  let filtered = [...AppState.bookings];
  if (AppState.filterBookings !== 'ALL') {
    filtered = filtered.filter(b => b.status === AppState.filterBookings);
  }

  if (AppState.searchQuery) {
    const q = AppState.searchQuery.toLowerCase();
    filtered = filtered.filter(b => {
      const g = AppState.guests.find(x => x.id === b.guestId);
      const r = AppState.rooms.find(x => x.id === b.roomId);
      return (
        (g && g.name.toLowerCase().includes(q)) ||
        (r && r.roomNumber.toLowerCase().includes(q)) ||
        String(b.id).includes(q)
      );
    });
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-tertiary); padding: 40px;">No reservations found matching criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(booking => {
    const guest = AppState.guests.find(g => g.id === booking.guestId) || { name: `Guest #${booking.guestId}` };
    const room = AppState.rooms.find(r => r.id === booking.roomId) || { roomNumber: `#${booking.roomId}`, roomType: 'Suite' };
    const statusClass = booking.status.toLowerCase();

    return `
      <tr>
        <td><strong>#BKG-${booking.id}</strong></td>
        <td>
          <div style="font-weight: 600; color: var(--text-primary);">${escapeHtml(guest.name)}</div>
          <div style="font-size: 0.76rem; color: var(--text-tertiary);">${escapeHtml(guest.phone || '')}</div>
        </td>
        <td>
          <span class="badge badge-occupied">Suite ${escapeHtml(room.roomNumber)}</span>
          <div style="font-size: 0.74rem; color: var(--text-tertiary); margin-top: 2px;">${escapeHtml(room.roomType)}</div>
        </td>
        <td>
          <div>${formatDate(booking.checkInDate)}</div>
          <div style="font-size: 0.74rem; color: var(--text-tertiary);">Check-in</div>
        </td>
        <td>
          <div>${formatDate(booking.checkOutDate)}</div>
          <div style="font-size: 0.74rem; color: var(--text-tertiary);">Check-out</div>
        </td>
        <td><span class="badge badge-${statusClass}">${booking.status}</span></td>
        <td>
          <div style="display: flex; gap: 6px;">
            ${booking.status !== 'CANCELLED' ? `
              <button class="btn btn-sm btn-secondary" onclick="openPaymentForBooking(${booking.id})" title="Take Payment">💳</button>
              <button class="btn btn-sm btn-danger" onclick="cancelBooking(${booking.id})" title="Cancel Booking">Cancel</button>
            ` : '<span style="color: var(--text-tertiary); font-size: 0.8rem;">Cancelled</span>'}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 4. GUESTS VIEW
function renderGuests() {
  const tbody = document.getElementById('guests-table-body');
  if (!tbody) return;

  let filtered = [...AppState.guests];
  if (AppState.searchQuery) {
    const q = AppState.searchQuery.toLowerCase();
    filtered = filtered.filter(g =>
      (g.name && g.name.toLowerCase().includes(q)) ||
      (g.email && g.email.toLowerCase().includes(q)) ||
      (g.phone && g.phone.includes(q))
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-tertiary); padding: 40px;">No registered guests found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(guest => {
    const guestBookings = AppState.bookings.filter(b => b.guestId === guest.id).length;
    return `
      <tr>
        <td><strong>#GST-${guest.id}</strong></td>
        <td>
          <div style="font-weight: 600; color: var(--text-primary); font-size: 0.95rem;">${escapeHtml(guest.name)}</div>
          <span class="badge badge-confirmed" style="margin-top: 4px; font-size: 0.68rem;">VIP Guest</span>
        </td>
        <td>${escapeHtml(guest.email)}</td>
        <td>${escapeHtml(guest.phone)}</td>
        <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(guest.address || 'Not specified')}</td>
        <td>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-sm btn-primary" onclick="openCreateReservationForGuest(${guest.id})">+ Book Suite</button>
            <button class="btn btn-sm btn-danger" onclick="deleteGuest(${guest.id})">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 5. PAYMENTS VIEW
function renderPayments() {
  const tbody = document.getElementById('payments-table-body');
  if (!tbody) return;

  if (AppState.payments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-tertiary); padding: 40px;">No payments recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = AppState.payments.map(p => {
    const booking = AppState.bookings.find(b => b.id === p.bookingId);
    const guest = booking ? AppState.guests.find(g => g.id === booking.guestId) : null;
    const guestName = guest ? guest.name : (p.bookingId ? `Booking #${p.bookingId}` : 'Walk-in');

    return `
      <tr>
        <td><strong>#TXN-${p.id}</strong></td>
        <td>#BKG-${p.bookingId} (${escapeHtml(guestName)})</td>
        <td style="font-weight: 700; color: var(--gold-300);">${formatCurrency(p.amount)}</td>
        <td><span class="badge badge-occupied">${p.paymentMethod}</span></td>
        <td><span class="badge badge-${(p.paymentStatus || 'pending').toLowerCase()}">${p.paymentStatus}</span></td>
        <td>${p.paymentDate ? formatDate(p.paymentDate) : 'Recently'}</td>
      </tr>
    `;
  }).join('');
}

// 6. STAFF VIEW
function renderStaff() {
  const container = document.getElementById('staff-grid-container');
  if (!container) return;

  let filtered = [...AppState.staff];
  if (AppState.filterStaff !== 'ALL') {
    filtered = filtered.filter(s => s.department === AppState.filterStaff);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-tertiary);">
        No staff members registered in this department.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(member => {
    return `
      <div class="stat-card" style="position: relative;">
        <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 14px;">
          <div class="user-avatar" style="width: 46px; height: 46px; font-size: 1.1rem;">
            ${escapeHtml(member.name.substring(0, 2).toUpperCase())}
          </div>
          <div>
            <div style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700;">${escapeHtml(member.name)}</div>
            <div style="color: var(--gold-400); font-size: 0.82rem; font-weight: 600;">${escapeHtml(member.position)}</div>
          </div>
        </div>

        <div style="font-size: 0.82rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 6px;">
          <div>🏢 <strong>Department:</strong> ${escapeHtml(member.department)}</div>
          <div>✉️ <strong>Email:</strong> ${escapeHtml(member.email)}</div>
          <div>📞 <strong>Phone:</strong> ${escapeHtml(member.phone)}</div>
        </div>

        <div style="margin-top: 18px; padding-top: 12px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: flex-end;">
          <button class="btn btn-sm btn-danger" onclick="deleteStaff(${member.id})">Remove</button>
        </div>
      </div>
    `;
  }).join('');
}

// 7. USERS VIEW
function renderUsers() {
  const tbody = document.getElementById('users-table-body');
  if (!tbody) return;

  if (AppState.users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-tertiary); padding: 30px;">User accounts require Admin privilege or server connection.</td></tr>`;
    return;
  }

  tbody.innerHTML = AppState.users.map(u => {
    return `
      <tr>
        <td><strong>#USR-${u.id}</strong></td>
        <td style="font-weight: 600;">${escapeHtml(u.username)}</td>
        <td><span class="badge ${u.role === 'ADMIN' ? 'badge-confirmed' : 'badge-occupied'}">${u.role}</span></td>
        <td>
          ${u.username !== 'admin' ? `
            <button class="btn btn-sm btn-danger" onclick="deleteUserAccount(${u.id})">Delete</button>
          ` : '<span style="color: var(--gold-400); font-size: 0.78rem; font-weight: 700;">PRIMARY ROOT</span>'}
        </td>
      </tr>
    `;
  }).join('');
}

// =============================================================================
// ACTIONS: ROOMS, BOOKINGS, GUESTS, PAYMENTS
// =============================================================================

async function changeRoomStatus(roomId, newStatus) {
  if (AppState.isOnline) {
    try {
      await apiRequest(`/api/rooms/${roomId}/status?status=${encodeURIComponent(newStatus)}`, {
        method: 'PUT',
      });
      showToast('Status Updated', `Room #${roomId} is now ${newStatus}`, 'success');
    } catch (err) {
      showToast('Error', err.message, 'error');
    }
  } else {
    const room = AppState.rooms.find(r => r.id === roomId);
    if (room) {
      room.status = newStatus;
      showToast('Updated (Demo)', `Room #${roomId} status changed to ${newStatus}`, 'info');
    }
  }

  const room = AppState.rooms.find(r => r.id === roomId);
  if (room) room.status = newStatus;
  recalculateMetrics();
  renderAllViews();
}

async function handleCreateRoom(event) {
  event.preventDefault();
  const form = event.target;
  const roomData = {
    roomNumber: form.roomNumber.value.trim(),
    roomType: form.roomType.value.trim(),
    price: parseFloat(form.price.value),
    status: form.status.value,
  };

  if (AppState.isOnline) {
    try {
      const created = await apiRequest('/api/rooms', {
        method: 'POST',
        body: JSON.stringify(roomData),
      });
      AppState.rooms.push(created);
      showToast('Room Created', `Room ${roomData.roomNumber} added to inventory`, 'success');
    } catch (err) {
      showToast('Failed to Create Room', err.message, 'error');
      return;
    }
  } else {
    const newId = (AppState.rooms.length ? Math.max(...AppState.rooms.map(r => r.id)) : 0) + 1;
    AppState.rooms.push({ id: newId, ...roomData });
    showToast('Room Added (Demo)', `Room ${roomData.roomNumber} created in local demo state`, 'info');
  }

  closeModal('add-room-modal');
  form.reset();
  recalculateMetrics();
  renderAllViews();
}

async function deleteRoom(roomId) {
  if (!confirm(`Are you sure you want to delete this room?`)) return;

  if (AppState.isOnline) {
    try {
      await apiRequest(`/api/rooms/${roomId}`, { method: 'DELETE' });
      showToast('Deleted', 'Room removed successfully', 'success');
    } catch (err) {
      showToast('Delete Failed', err.message, 'error');
      return;
    }
  }

  AppState.rooms = AppState.rooms.filter(r => r.id !== roomId);
  recalculateMetrics();
  renderAllViews();
}

// GUEST ACTIONS
async function handleCreateGuest(event) {
  event.preventDefault();
  const form = event.target;
  const guestData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    address: form.address.value.trim(),
  };

  if (!/^[0-9]{10}$/.test(guestData.phone)) {
    showToast('Invalid Phone', 'Phone number must contain exactly 10 digits', 'error');
    return;
  }

  if (AppState.isOnline) {
    try {
      const created = await apiRequest('/api/guests', {
        method: 'POST',
        body: JSON.stringify(guestData),
      });
      AppState.guests.push(created);
      showToast('Guest Registered', `Profile created for ${guestData.name}`, 'success');
    } catch (err) {
      showToast('Registration Error', err.message, 'error');
      return;
    }
  } else {
    const newId = (AppState.guests.length ? Math.max(...AppState.guests.map(g => g.id)) : 0) + 1;
    AppState.guests.push({ id: newId, ...guestData });
    showToast('Guest Added (Demo)', `Profile created for ${guestData.name}`, 'info');
  }

  closeModal('add-guest-modal');
  form.reset();
  recalculateMetrics();
  renderAllViews();
}

async function deleteGuest(guestId) {
  if (!confirm('Are you sure you want to remove this guest profile?')) return;

  if (AppState.isOnline) {
    try {
      await apiRequest(`/api/guests/${guestId}`, { method: 'DELETE' });
      showToast('Deleted', 'Guest profile removed', 'success');
    } catch (err) {
      showToast('Error', err.message, 'error');
      return;
    }
  }

  AppState.guests = AppState.guests.filter(g => g.id !== guestId);
  recalculateMetrics();
  renderAllViews();
}

// BOOKING ACTIONS
function openCreateReservationModal() {
  const guestSelect = document.getElementById('booking-guest-select');
  const roomSelect = document.getElementById('booking-room-select');

  if (guestSelect) {
    guestSelect.innerHTML = AppState.guests.map(g => `
      <option value="${g.id}">${escapeHtml(g.name)} (${g.phone})</option>
    `).join('') || '<option value="">No guests registered yet</option>';
  }

  if (roomSelect) {
    const avail = AppState.rooms.filter(r => r.status === 'AVAILABLE');
    roomSelect.innerHTML = (avail.length ? avail : AppState.rooms).map(r => `
      <option value="${r.id}">Suite ${escapeHtml(r.roomNumber)} - ${escapeHtml(r.roomType)} (${formatCurrency(r.price)}/night)</option>
    `).join('') || '<option value="">No rooms available</option>';
  }

  // Pre-fill dates
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
  const inElem = document.getElementById('booking-checkin');
  const outElem = document.getElementById('booking-checkout');
  if (inElem) inElem.value = today;
  if (outElem) outElem.value = nextWeek;

  openModal('create-booking-modal');
}

function openCreateReservationForGuest(guestId) {
  openCreateReservationModal();
  const guestSelect = document.getElementById('booking-guest-select');
  if (guestSelect) guestSelect.value = guestId;
}

async function handleCreateBooking(event) {
  event.preventDefault();
  const form = event.target;
  const bookingData = {
    guestId: parseInt(form.guestId.value),
    roomId: parseInt(form.roomId.value),
    checkInDate: form.checkInDate.value,
    checkOutDate: form.checkOutDate.value,
    numberOfGuests: parseInt(form.numberOfGuests.value),
    status: 'CONFIRMED',
  };

  if (!bookingData.guestId || !bookingData.roomId) {
    showToast('Missing details', 'Please select a guest and room suite', 'error');
    return;
  }

  if (AppState.isOnline) {
    try {
      const created = await apiRequest('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
      AppState.bookings.push(created);
      showToast('Reservation Confirmed', `Booking #BKG-${created.id} confirmed!`, 'success');
    } catch (err) {
      showToast('Booking Error', err.message, 'error');
      return;
    }
  } else {
    const newId = (AppState.bookings.length ? Math.max(...AppState.bookings.map(b => b.id)) : 0) + 1;
    AppState.bookings.push({ id: newId, ...bookingData });
    showToast('Reservation Confirmed (Demo)', `Booking #BKG-${newId} confirmed!`, 'info');
  }

  // Mark room as occupied
  changeRoomStatus(bookingData.roomId, 'OCCUPIED');

  closeModal('create-booking-modal');
  form.reset();
  recalculateMetrics();
  renderAllViews();
}

async function cancelBooking(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking?')) return;

  if (AppState.isOnline) {
    try {
      await apiRequest(`/api/bookings/${bookingId}`, { method: 'DELETE' });
      showToast('Cancelled', `Booking #BKG-${bookingId} has been cancelled`, 'success');
    } catch (err) {
      showToast('Error', err.message, 'error');
      return;
    }
  }

  const b = AppState.bookings.find(x => x.id === bookingId);
  if (b) {
    b.status = 'CANCELLED';
    // Make room available again
    changeRoomStatus(b.roomId, 'AVAILABLE');
  }

  recalculateMetrics();
  renderAllViews();
}

// PAYMENT ACTIONS
function openPaymentForBooking(bookingId) {
  const booking = AppState.bookings.find(b => b.id === bookingId);
  const room = booking ? AppState.rooms.find(r => r.id === booking.roomId) : null;
  const inputBookingId = document.getElementById('payment-booking-id');
  const inputAmount = document.getElementById('payment-amount');

  if (inputBookingId) inputBookingId.value = bookingId;
  if (inputAmount && room) {
    inputAmount.value = room.price || 5000;
  }

  openModal('add-payment-modal');
}

async function handleCreatePayment(event) {
  event.preventDefault();
  const form = event.target;
  const paymentData = {
    bookingId: parseInt(form.bookingId.value),
    amount: parseFloat(form.amount.value),
    paymentMethod: form.paymentMethod.value,
    paymentStatus: form.paymentStatus.value,
  };

  if (AppState.isOnline) {
    try {
      const created = await apiRequest('/api/payments', {
        method: 'POST',
        body: JSON.stringify(paymentData),
      });
      AppState.payments.push(created);
      showToast('Payment Recorded', `Amount of ${formatCurrency(paymentData.amount)} processed via ${paymentData.paymentMethod}`, 'success');
    } catch (err) {
      showToast('Payment Error', err.message, 'error');
      return;
    }
  } else {
    const newId = (AppState.payments.length ? Math.max(...AppState.payments.map(p => p.id)) : 0) + 1;
    AppState.payments.push({ id: newId, ...paymentData, paymentDate: new Date().toISOString() });
    showToast('Payment Recorded (Demo)', `Amount of ${formatCurrency(paymentData.amount)} saved`, 'info');
  }

  closeModal('add-payment-modal');
  form.reset();
  recalculateMetrics();
  renderAllViews();
}

// STAFF ACTIONS
async function handleCreateStaff(event) {
  event.preventDefault();
  const form = event.target;
  const staffData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    department: form.department.value.trim(),
    position: form.position.value.trim(),
  };

  if (AppState.isOnline) {
    try {
      const created = await apiRequest('/api/staff', {
        method: 'POST',
        body: JSON.stringify(staffData),
      });
      AppState.staff.push(created);
      showToast('Staff Added', `${staffData.name} appointed as ${staffData.position}`, 'success');
    } catch (err) {
      showToast('Error', err.message, 'error');
      return;
    }
  } else {
    const newId = (AppState.staff.length ? Math.max(...AppState.staff.map(s => s.id)) : 0) + 1;
    AppState.staff.push({ id: newId, ...staffData });
    showToast('Staff Added (Demo)', `${staffData.name} added`, 'info');
  }

  closeModal('add-staff-modal');
  form.reset();
  renderStaff();
}

async function deleteStaff(staffId) {
  if (!confirm('Remove this staff profile?')) return;
  if (AppState.isOnline) {
    try {
      await apiRequest(`/api/staff/${staffId}`, { method: 'DELETE' });
      showToast('Removed', 'Staff member deleted', 'success');
    } catch (err) {
      showToast('Error', err.message, 'error');
      return;
    }
  }
  AppState.staff = AppState.staff.filter(s => s.id !== staffId);
  renderStaff();
}

// USER ACCOUNT ACTIONS
async function handleCreateUser(event) {
  event.preventDefault();
  const form = event.target;
  const userData = {
    username: form.username.value.trim(),
    password: form.password.value,
    role: form.role.value,
  };

  if (AppState.isOnline) {
    try {
      const created = await apiRequest('/api/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      AppState.users.push(created);
      showToast('User Created', `Account @${userData.username} (${userData.role}) is ready`, 'success');
    } catch (err) {
      showToast('Failed to Create User', err.message, 'error');
      return;
    }
  } else {
    const newId = (AppState.users.length ? Math.max(...AppState.users.map(u => u.id)) : 0) + 1;
    AppState.users.push({ id: newId, username: userData.username, role: userData.role });
    showToast('User Added (Demo)', `User @${userData.username} registered`, 'info');
  }

  closeModal('add-user-modal');
  form.reset();
  renderUsers();
}

async function deleteUserAccount(userId) {
  if (!confirm('Delete this system login account?')) return;
  if (AppState.isOnline) {
    try {
      await apiRequest(`/api/users/${userId}`, { method: 'DELETE' });
      showToast('User Deleted', 'Account removed successfully', 'success');
    } catch (err) {
      showToast('Error', err.message, 'error');
      return;
    }
  }
  AppState.users = AppState.users.filter(u => u.id !== userId);
  renderUsers();
}

// =============================================================================
// UI CONTROLS & NAVIGATION
// =============================================================================

function switchTab(tabId) {
  AppState.activeTab = tabId;

  // Nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tabId);
  });

  // Panes
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === `tab-${tabId}`);
  });

  // Mobile sidebar close
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.classList.remove('mobile-open');

  // Trigger re-renders
  if (tabId === 'rooms') renderRooms();
  if (tabId === 'reservations') renderBookings();
  if (tabId === 'guests') renderGuests();
  if (tabId === 'billing') renderPayments();
  if (tabId === 'staff') renderStaff();
  if (tabId === 'users') renderUsers();
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('grandstay_theme', next);
  showToast('Theme Changed', `Switched to ${next === 'dark' ? 'Obsidian Night' : 'Ivory Pearl'} mode`, 'info');
}

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.classList.toggle('mobile-open');
}

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', async () => {
  // Theme restoration
  const savedTheme = localStorage.getItem('grandstay_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Settings base URL setup
  const apiInput = document.getElementById('settings-api-url');
  if (apiInput) apiInput.value = AppConfig.getApiBase();

  // Navigation click listeners
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = item.dataset.tab;
      if (tab) switchTab(tab);
    });
  });

  // Filter Pills (Rooms)
  document.querySelectorAll('#rooms-filter-pills .filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#rooms-filter-pills .filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      AppState.filterRooms = pill.dataset.filter;
      renderRooms();
    });
  });

  // Filter Pills (Bookings)
  document.querySelectorAll('#bookings-filter-pills .filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#bookings-filter-pills .filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      AppState.filterBookings = pill.dataset.filter;
      renderBookings();
    });
  });

  // Filter Pills (Staff)
  document.querySelectorAll('#staff-filter-pills .filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#staff-filter-pills .filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      AppState.filterStaff = pill.dataset.filter;
      renderStaff();
    });
  });

  // Global Search input
  const searchInput = document.getElementById('global-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value.trim();
      if (AppState.activeTab === 'rooms') renderRooms();
      else if (AppState.activeTab === 'reservations') renderBookings();
      else if (AppState.activeTab === 'guests') renderGuests();
    });
  }

  // Ticking Clock
  setInterval(() => {
    const clock = document.getElementById('hero-clock');
    if (clock) {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  }, 1000);

  // Setup form submit handlers
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const u = loginForm.username.value.trim();
      const p = loginForm.password.value;
      await handleLogin(u, p);
    });
  }

  const roomForm = document.getElementById('form-add-room');
  if (roomForm) roomForm.addEventListener('submit', handleCreateRoom);

  const guestForm = document.getElementById('form-add-guest');
  if (guestForm) guestForm.addEventListener('submit', handleCreateGuest);

  const bookingForm = document.getElementById('form-create-booking');
  if (bookingForm) bookingForm.addEventListener('submit', handleCreateBooking);

  const paymentForm = document.getElementById('form-add-payment');
  if (paymentForm) paymentForm.addEventListener('submit', handleCreatePayment);

  const staffForm = document.getElementById('form-add-staff');
  if (staffForm) staffForm.addEventListener('submit', handleCreateStaff);

  const userForm = document.getElementById('form-add-user');
  if (userForm) userForm.addEventListener('submit', handleCreateUser);

  // Settings Save
  const saveSettingsBtn = document.getElementById('btn-save-settings');
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
      const urlInput = document.getElementById('settings-api-url');
      if (urlInput) {
        AppConfig.setApiBase(urlInput.value.trim());
        showToast('Configuration Saved', 'API Base URL updated', 'success');
        checkBackendHealth();
        fetchAllData();
      }
    });
  }

  // Test Ping Button
  const pingBtn = document.getElementById('btn-test-ping');
  if (pingBtn) {
    pingBtn.addEventListener('click', async () => {
      const start = Date.now();
      const online = await checkBackendHealth();
      const latency = Date.now() - start;
      if (online) {
        showToast('Backend Online', `Spring Boot server responded in ${latency}ms at ${AppConfig.getApiBase()}`, 'success');
      } else {
        showToast('Connection Offline', `Unable to connect to ${AppConfig.getApiBase()}. Is Spring Boot running?`, 'error');
      }
    });
  }

  // Seed Button
  const seedBtn = document.getElementById('btn-seed-data');
  if (seedBtn) seedBtn.addEventListener('click', seedBackendWithSampleData);

  // Initial load
  updateAuthUI();
  await fetchAllData();
});
