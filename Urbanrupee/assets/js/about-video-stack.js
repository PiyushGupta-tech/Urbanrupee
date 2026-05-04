/**
 * About page — horizontal slide between two videos inside [data-ur-video-stack].
 * Switching: swipe / horizontal drag on [data-ur-video-stage] (no arrow buttons).
 */
(function () {
  'use strict';

  var SLIDE_MS = 520;
  var SWIPE_MIN_PX = 48;

  function playClip(v) {
    try {
      v.muted = true;
      v.setAttribute('playsinline', '');
    } catch (e) {}
    var p = v.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function () {
        v.addEventListener(
          'canplay',
          function once() {
            v.removeEventListener('canplay', once);
            v.play().catch(function () {});
          },
          { once: true }
        );
        try {
          v.load();
        } catch (e2) {}
      });
    }
  }

  function pauseClip(v) {
    try {
      v.pause();
    } catch (e) {}
  }

  function applySlide(track, videos, index) {
    var i = index === 1 ? 1 : 0;
    if (i === 1) {
      track.classList.add('ur-about-video-stack__track--slide-1');
    } else {
      track.classList.remove('ur-about-video-stack__track--slide-1');
    }
    videos.forEach(function (v, n) {
      if (n === i) playClip(v);
      else pauseClip(v);
    });
  }

  function init() {
    var root = document.querySelector('[data-ur-video-stack]');
    if (!root || root.getAttribute('data-ur-video-stack-init') === '1') return;

    var track = root.querySelector('[data-ur-video-track]');
    var stage = root.querySelector('[data-ur-video-stage]');
    if (!track || !stage) return;

    var videos = Array.prototype.slice.call(track.querySelectorAll('.ur-about-video-stack__video'));
    if (videos.length < 2) return;

    root.setAttribute('data-ur-video-stack-init', '1');

    var index = 0;
    var gate = false;
    var startX = null;
    var startY = null;
    var startId = null;

    videos.forEach(function (v, n) {
      if (n !== 0) {
        v.removeAttribute('autoplay');
        pauseClip(v);
      }
    });
    applySlide(track, videos, 0);

    function step(delta) {
      index = (index + delta + videos.length) % videos.length;
      applySlide(track, videos, index);
    }

    function armGate() {
      if (gate) return;
      gate = true;
      window.setTimeout(function () {
        gate = false;
      }, SLIDE_MS + 60);
    }

    function onPointerDown(ev) {
      if (ev.button !== 0 && ev.button !== undefined) return;
      startX = ev.clientX;
      startY = ev.clientY;
      startId = ev.pointerId;
      try {
        stage.setPointerCapture(ev.pointerId);
      } catch (e) {}
    }

    function onPointerUp(ev) {
      if (startX == null || startId !== ev.pointerId) return;
      var dx = ev.clientX - startX;
      var dy = ev.clientY - startY;
      startX = null;
      startY = null;
      startId = null;
      try {
        stage.releasePointerCapture(ev.pointerId);
      } catch (e2) {}

      if (Math.abs(dx) < SWIPE_MIN_PX) return;
      if (Math.abs(dx) < Math.abs(dy)) return;
      if (gate) return;

      armGate();
      step(dx < 0 ? 1 : -1);
    }

    function onPointerCancel(ev) {
      if (startId !== ev.pointerId) return;
      startX = null;
      startY = null;
      startId = null;
      try {
        stage.releasePointerCapture(ev.pointerId);
      } catch (e3) {}
    }

    stage.addEventListener('pointerdown', onPointerDown);
    stage.addEventListener('pointerup', onPointerUp);
    stage.addEventListener('pointercancel', onPointerCancel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
