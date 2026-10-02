/* iArtbook 介绍站 · 交互脚本（原生 JS，零依赖） */
(function () {
  'use strict';

  /* ---------- 移动端导航折叠 ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('nav--open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    /* 点击链接后收起 */
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('nav--open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- data-link 统一绑定：读 SITE_LINKS 赋 href ---------- */
  var links = window.SITE_LINKS || {};
  document.querySelectorAll('[data-link]').forEach(function (el) {
    var key = el.getAttribute('data-link');
    var url = links[key];
    if (url) {
      el.setAttribute('href', url);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener nofollow');
    }
  });

  /* ---------- 右下角浮动按钮：返回顶部 ---------- */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    var onScroll = function () {
      if (window.scrollY > 420) {
        toTop.classList.add('is-visible');
      } else {
        toTop.classList.remove('is-visible');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 滚动渐显（prefers-reduced-motion 时由 CSS 关闭） ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('reveal--in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('reveal--in'); });
  }

  /* ---------- 数字滚动（静态兜底：无 JS 或减少动态时直接显示终值） ---------- */
  var nums = document.querySelectorAll('[data-count]');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (nums.length && 'IntersectionObserver' in window && !reduce) {
    var run = function (el) {
      var end = parseInt(el.getAttribute('data-count'), 10) || 0;
      var t0 = null;
      var step = function (ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / 900, 1);
        el.textContent = Math.round(end * (0.2 + 0.8 * p));
        if (p < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          run(e.target);
          io2.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { io2.observe(el); });
  }
})();
