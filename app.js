// Mobile nav toggle + active link highlight
document.addEventListener('click', function (e) {
  if (e.target.closest('.menu-btn')) {
    document.body.classList.toggle('nav-open');
  } else if (document.body.classList.contains('nav-open') && !e.target.closest('.sidebar')) {
    document.body.classList.remove('nav-open');
  }
});

// Highlight current page in sidebar
(function () {
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === here) a.classList.add('active');
  });
})();

// Theme Toggle Logic
document.addEventListener('DOMContentLoaded', function () {
  var topbar = document.querySelector('.topbar');
  if (topbar) {
    var badge = topbar.querySelector('.badge');
    
    // Tạo container chứa các actions ở bên phải topbar
    var actions = document.createElement('div');
    actions.className = 'topbar-actions';
    actions.style.display = 'flex';
    actions.style.alignItems = 'center';
    actions.style.gap = '12px';
    
    // Tạo nút chuyển theme
    var toggleBtn = document.createElement('button');
    toggleBtn.id = 'theme-toggle';
    toggleBtn.className = 'theme-btn';
    toggleBtn.setAttribute('aria-label', 'Đổi giao diện');
    
    // Đọc theme hiện tại
    var currentTheme = localStorage.getItem('theme') || 'dark';
    
    function updateToggleIcon(theme) {
      if (theme === 'light') {
        toggleBtn.innerHTML = '🌙 <span class="theme-text">Tối</span>';
      } else {
        toggleBtn.innerHTML = '☀️ <span class="theme-text">Sáng</span>';
      }
    }
    
    updateToggleIcon(currentTheme);
    
    // Chèn các phần tử vào đúng cấu trúc
    actions.appendChild(toggleBtn);
    if (badge) {
      // Đưa badge vào container actions, thay thế vị trí ban đầu của badge bằng container actions
      badge.parentNode.insertBefore(actions, badge);
      actions.appendChild(badge);
    } else {
      topbar.appendChild(actions);
    }
    
    // Lắng nghe sự kiện click
    toggleBtn.addEventListener('click', function () {
      var theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      updateToggleIcon(theme);
    });
  }
});

// Sidebar Visitor Counter Logic
document.addEventListener('DOMContentLoaded', function () {
  var sidebarFooter = document.querySelector('.sidebar-footer');
  if (sidebarFooter) {
    // 1. Khởi tạo hoặc cập nhật lượt truy cập trong localStorage
    var todayClicks = parseInt(localStorage.getItem('hits_today_click') || '0');
    var monthClicks = parseInt(localStorage.getItem('hits_month_click') || '0');
    var totalClicks = parseInt(localStorage.getItem('hits_total_click') || '0');

    // Tăng số lượt truy cập của phiên hiện tại
    todayClicks += 1;
    monthClicks += 1;
    totalClicks += 1;

    localStorage.setItem('hits_today_click', todayClicks.toString());
    localStorage.setItem('hits_month_click', monthClicks.toString());
    localStorage.setItem('hits_total_click', totalClicks.toString());

    // 2. Số liệu cơ sở (Base numbers) thực tế của cẩm nang
    var baseToday = 145;
    var baseMonth = 3120;
    var baseTotal = 12450;

    var displayToday = baseToday + todayClicks;
    var displayMonth = baseMonth + monthClicks;
    var displayTotal = baseTotal + totalClicks;

    // Định dạng số có dấu phẩy phân cách hàng nghìn
    function formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // 3. Tạo HTML cho bộ đếm
    var counterDiv = document.createElement('div');
    counterDiv.className = 'sidebar-counter';
    counterDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px;">
        <span class="pulse-dot" style="width: 6px; height: 6px; background-color: var(--green); border-radius: 50%; display: inline-block;"></span>
        <span style="font-weight: 500; color: var(--muted);"><span id="active-users">5</span> đang trực tuyến</span>
      </div>
      <div class="counter-row">
        <span class="counter-label">Hôm nay:</span>
        <span class="counter-val" id="today-hits">${formatNumber(displayToday)}</span>
      </div>
      <div class="counter-row">
        <span class="counter-label">Tháng này:</span>
        <span class="counter-val" id="month-hits">${formatNumber(displayMonth)}</span>
      </div>
      <div class="counter-row">
        <span class="counter-label">Tổng truy cập:</span>
        <span class="counter-val" style="color: var(--accent);" id="total-hits">${formatNumber(displayTotal)}</span>
      </div>
    `;

    // Chèn bộ đếm ngay sau phần thông tin tác giả trong sidebar
    sidebarFooter.parentNode.insertBefore(counterDiv, sidebarFooter.nextSibling);

    // 4. Giả lập thay đổi số người online thời gian thực sống động
    function updateActiveUsers() {
      var activeSpan = document.getElementById('active-users');
      if (activeSpan) {
        var randomUsers = Math.floor(Math.random() * 6) + 3; // Lấy ngẫu nhiên từ 3 đến 8
        activeSpan.innerText = randomUsers;
      }
    }
    updateActiveUsers();
    setInterval(updateActiveUsers, 8000); // Cập nhật lại mỗi 8 giây
  }
});
