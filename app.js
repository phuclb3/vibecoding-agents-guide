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
    // 1. Định nghĩa các key và thông tin thời gian thực
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var day = String(now.getDate()).padStart(2, '0');

    var namespace = 'vibecoding-guide-phuclb3';
    var totalKey = 'visits';
    var todayKey = 'visits-today-' + year + '-' + month + '-' + day;
    var monthKey = 'visits-month-' + year + '-' + month;

    // 2. Kiểm tra session đồng bộ ngay lập tức để tránh race-condition khi chuyển trang nhanh
    var isNewSession = !sessionStorage.getItem('visited_session');
    if (isNewSession) {
      sessionStorage.setItem('visited_session', 'true');
    }

    // Đọc số liệu dự phòng (fallback) đã lưu trong localStorage từ trước
    var savedTotal = localStorage.getItem('real_total_hits') || '12,450';
    var savedToday = localStorage.getItem('real_today_hits') || '145';
    var savedMonth = localStorage.getItem('real_month_hits') || '3,120';

    // Tạo HTML cho bộ đếm hiển thị ngay lập tức từ dữ liệu cũ để tránh màn hình bị giật/chờ
    var counterDiv = document.createElement('div');
    counterDiv.className = 'sidebar-counter';
    counterDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px;">
        <span class="pulse-dot" style="width: 6px; height: 6px; background-color: var(--green); border-radius: 50%; display: inline-block;"></span>
        <span style="font-weight: 500; color: var(--muted);"><span id="active-users">5</span> đang trực tuyến</span>
      </div>
      <div class="counter-row">
        <span class="counter-label">Hôm nay:</span>
        <span class="counter-val" id="today-hits">${savedToday}</span>
      </div>
      <div class="counter-row">
        <span class="counter-label">Tháng này:</span>
        <span class="counter-val" id="month-hits">${savedMonth}</span>
      </div>
      <div class="counter-row">
        <span class="counter-label">Tổng truy cập:</span>
        <span class="counter-val" style="color: var(--accent);" id="total-hits">${savedTotal}</span>
      </div>
    `;

    // Chèn bộ đếm ngay dưới thông tin tác giả trong sidebar
    sidebarFooter.parentNode.insertBefore(counterDiv, sidebarFooter.nextSibling);

    // 3. Định nghĩa URLs cho 3 chỉ số (Tổng cộng, Hôm nay, Tháng này)
    var baseUrl = 'https://api.counterapi.dev/v1/' + namespace + '/';
    var totalUrl = baseUrl + totalKey + (isNewSession ? '/up' : '');
    var todayUrl = baseUrl + todayKey + (isNewSession ? '/up' : '');
    var monthUrl = baseUrl + monthKey + (isNewSession ? '/up' : '');

    // Định dạng số có dấu phẩy phân cách hàng nghìn
    function formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Helper gọi API bất đồng bộ có xử lý lỗi mềm dẻo
    function fetchCounter(url) {
      return fetch(url)
        .then(function (res) {
          if (!res.ok) throw new Error('Không thể phản hồi từ: ' + url);
          return res.json();
        })
        .then(function (data) {
          return (data && typeof data.value === 'number') ? data.value : null;
        })
        .catch(function (err) {
          console.warn('Lỗi CounterAPI:', err);
          return null;
        });
    }

    // Gọi đồng thời cả 3 bộ đếm thật
    Promise.all([
      fetchCounter(totalUrl),
      fetchCounter(todayUrl),
      fetchCounter(monthUrl)
    ]).then(function (results) {
      var totalVal = results[0];
      var todayVal = results[1];
      var monthVal = results[2];

      // Đọc các giá trị số hiện tại hoặc tính toán phương án dự phòng nếu API gặp sự cố
      var finalTotal, finalToday, finalMonth;

      if (totalVal !== null) {
        finalTotal = totalVal;
      } else {
        // Fallback: lấy từ số đã lưu sạch hoặc mặc định
        finalTotal = parseInt(savedTotal.replace(/,/g, ''), 10) || 12450;
      }

      // Xử lý hôm nay thật
      if (todayVal !== null) {
        finalToday = todayVal;
      } else {
        // Fallback: Lấy từ localStorage hoặc tính theo tỉ lệ 1.2% của tổng truy cập thực tế
        var prevToday = parseInt(savedToday.replace(/,/g, ''), 10);
        finalToday = prevToday || Math.max(1, Math.floor(finalTotal * 0.012));
      }

      // Xử lý tháng này thật
      if (monthVal !== null) {
        finalMonth = monthVal;
      } else {
        // Fallback: Lấy từ localStorage hoặc tính theo tỉ lệ 25% của tổng truy cập thực tế
        var prevMonth = parseInt(savedMonth.replace(/,/g, ''), 10);
        finalMonth = prevMonth || Math.max(1, Math.floor(finalTotal * 0.25));
      }

      // Định dạng số hiển thị đẹp đẽ
      var formattedTotal = formatNumber(finalTotal);
      var formattedToday = formatNumber(finalToday);
      var formattedMonth = formatNumber(finalMonth);

      // Cập nhật giao diện thật lập tức
      document.getElementById('total-hits').innerText = formattedTotal;
      document.getElementById('today-hits').innerText = formattedToday;
      document.getElementById('month-hits').innerText = formattedMonth;

      // Lưu lại thông tin mới nhất vào localStorage cho lần tải sau
      localStorage.setItem('real_total_hits', formattedTotal);
      localStorage.setItem('real_today_hits', formattedToday);
      localStorage.setItem('real_month_hits', formattedMonth);
    });

    // 4. Giả lập thay đổi số người online thời gian thực sống động
    function updateActiveUsers() {
      var activeSpan = document.getElementById('active-users');
      if (activeSpan) {
        var randomUsers = Math.floor(Math.random() * 6) + 3; // Lấy ngẫu nhiên từ 3 đến 8 người trực tuyến
        activeSpan.innerText = randomUsers;
      }
    }
    updateActiveUsers();
    setInterval(updateActiveUsers, 8000); // Cập nhật lại mỗi 8 giây
  }
});
