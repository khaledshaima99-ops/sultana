/* السلطانة — تفاعلات الموقع الثابت */
(function () {
  'use strict';

  var WHATSAPP = '905316458311';
  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('mainNav');
  var toTop = document.getElementById('toTop');

  function closeMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'فتح القائمة');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'فتح القائمة' : 'إغلاق القائمة');
      nav.classList.toggle('is-open', !open);
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  var ticking = false;
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-scrolled', y > 12);
    if (toTop) toTop.classList.toggle('is-visible', y > 420);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && items.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (item) { observer.observe(item); });
  } else {
    items.forEach(function (item) { item.classList.add('is-visible'); });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  var current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.main-nav a').forEach(function (link) {
    var target = (link.getAttribute('href') || '').toLowerCase();
    if (target === current || (current === '' && target === 'index.html')) link.classList.add('is-active');
  });

  var params = new URLSearchParams(location.search);
  var product = params.get('product');
  var context = document.getElementById('productContext');
  var productField = document.getElementById('productName');
  if (product) {
    if (context) { context.textContent = 'المنتج المطلوب: ' + product; context.hidden = false; }
    if (productField) {
      var options = Array.prototype.slice.call(productField.options);
      var match = options.filter(function (o) { return o.value === product || o.textContent === product; })[0];
      if (match) productField.value = match.value;
    }
  }

  var form = document.getElementById('orderForm');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var name = (document.getElementById('customerName') || {}).value || '';
      var phone = (document.getElementById('customerPhone') || {}).value || '';
      var item = (document.getElementById('productName') || {}).value || '';
      var qty = (document.getElementById('quantity') || {}).value || '1';
      var address = (document.getElementById('address') || {}).value || '';
      var notes = (document.getElementById('notes') || {}).value || '';
      var text = 'طلب من السلطانة\nالاسم: ' + name + '\nالهاتف: ' + phone +
        '\nالمنتج: ' + item + '\nالكمية: ' + qty + '\nالعنوان: ' + address +
        (notes ? '\nملاحظات: ' + notes : '');
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
    });
  }
})();
