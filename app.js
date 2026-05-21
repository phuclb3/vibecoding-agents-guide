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
