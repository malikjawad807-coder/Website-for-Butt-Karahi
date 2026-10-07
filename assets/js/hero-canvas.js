/**
 * BUTT KARAHI - HIGH-PERFORMANCE HERO SCROLLYTELLING ENGINE
 * Features:
 * - 240 frames interactive canvas scrub (1920x1080)
 * - Pinned sticky viewport with 60fps lerp frame interpolation
 * - Dynamic story slide transitions tied to scroll milestones
 * - Autoplay video mode toggle (watch like a video or scrub via scroll)
 * - Intelligent progressive frame buffer & Retina display support
 */

(function () {
  'use strict';

  const TOTAL_FRAMES = 240;
  const FRAME_PREFIX = 'ezgif-frame-';
  const PRIMARY_PATH = 'assets/frames/';
  const FALLBACK_PATH = './';

  // DOM Elements
  const wrapper = document.getElementById('hero-scroll-wrapper');
  const stage = document.getElementById('hero-sticky-stage');
  const canvas = document.getElementById('hero-canvas');
  const loader = document.getElementById('hero-loader');
  const loaderBar = document.getElementById('loader-bar-fill');
  const loaderText = document.getElementById('loader-text');
  const progressBar = document.getElementById('hero-scrub-progress');
  const frameCounter = document.getElementById('hero-frame-counter');
  const playToggleBtn = document.getElementById('hero-play-toggle');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const slides = document.querySelectorAll('.hero-slide');

  if (!canvas || !wrapper) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  const frames = new Array(TOTAL_FRAMES);

  let loadedCount = 0;
  let currentFrame = 0;
  let targetFrame = 0;
  let isAutoplaying = false;
  let autoplayInterval = null;
  let rafId = null;
  let isLoaded = false;

  // Format frame filename with 3 digits padding (001, 002, ... 240)
  function getFrameUrl(index) {
    const padded = String(index + 1).padStart(3, '0');
    return `${PRIMARY_PATH}${FRAME_PREFIX}${padded}.jpg`;
  }

  function getFallbackFrameUrl(index) {
    const padded = String(index + 1).padStart(3, '0');
    return `${FALLBACK_PATH}${FRAME_PREFIX}${padded}.jpg`;
  }

  // Resize canvas for device pixel ratio and full viewport coverage
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    renderFrame(Math.round(currentFrame));
  }

  // Draw frame with object-fit: cover logic
  function renderFrame(index) {
    const img = frames[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    // Calculate aspect ratio cover
    const hRatio = canvasWidth / imgWidth;
    const vRatio = canvasHeight / imgHeight;
    const ratio = Math.max(hRatio, vRatio);

    const renderWidth = imgWidth * ratio;
    const renderHeight = imgHeight * ratio;
    const offsetX = (canvasWidth - renderWidth) / 2;
    const offsetY = (canvasHeight - renderHeight) / 2;

    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

    if (frameCounter) {
      frameCounter.textContent = `${index + 1} / ${TOTAL_FRAMES}`;
    }
  }

  // Preload frames in chunks
  function preloadFrames() {
    // 1. Load first frame immediately
    const firstImg = new Image();
    firstImg.src = getFrameUrl(0);
    firstImg.onload = () => {
      frames[0] = firstImg;
      loadedCount++;
      renderFrame(0);
      loadRemainingFrames();
    };
    firstImg.onerror = () => {
      // Try fallback path if assets/frames not loaded
      firstImg.src = getFallbackFrameUrl(0);
      firstImg.onload = () => {
        frames[0] = firstImg;
        loadedCount++;
        renderFrame(0);
        loadRemainingFrames();
      };
    };
  }

  function loadRemainingFrames() {
    let index = 1;
    const batchSize = 12;

    function loadNextBatch() {
      const end = Math.min(index + batchSize, TOTAL_FRAMES);
      for (let i = index; i < end; i++) {
        const frameIdx = i;
        const img = new Image();
        img.src = getFrameUrl(frameIdx);

        img.onload = () => {
          frames[frameIdx] = img;
          loadedCount++;
          updateLoaderProgress();
        };

        img.onerror = () => {
          img.src = getFallbackFrameUrl(frameIdx);
          img.onload = () => {
            frames[frameIdx] = img;
            loadedCount++;
            updateLoaderProgress();
          };
          img.onerror = () => {
            // If individual frame fails, reuse previous frame to avoid black screen
            frames[frameIdx] = frames[frameIdx - 1] || frames[0];
            loadedCount++;
            updateLoaderProgress();
          };
        };
      }

      index = end;
      if (index < TOTAL_FRAMES) {
        setTimeout(loadNextBatch, 20);
      }
    }

    loadNextBatch();
  }

  function updateLoaderProgress() {
    const percent = Math.round((loadedCount / TOTAL_FRAMES) * 100);
    if (loaderBar) loaderBar.style.width = `${percent}%`;
    if (loaderText) loaderText.textContent = `Warming the Karahi... ${percent}%`;

    // Once at least 25% loaded, unlock interactive experience
    if (loadedCount >= Math.floor(TOTAL_FRAMES * 0.25) && !isLoaded) {
      isLoaded = true;
      if (loader) {
        loader.classList.add('loaded');
      }
    }
  }

  // Calculate scroll progress through the pinned wrapper
  function updateScroll() {
    if (isAutoplaying) return;

    const rect = wrapper.getBoundingClientRect();
    const scrollDistance = wrapper.offsetHeight - window.innerHeight;

    if (scrollDistance <= 0) return;

    // How far we've scrolled inside wrapper
    const scrolledInside = -rect.top;
    const progress = Math.min(Math.max(scrolledInside / scrollDistance, 0), 1);

    targetFrame = progress * (TOTAL_FRAMES - 1);

    if (progressBar) {
      progressBar.style.width = `${(progress * 100).toFixed(1)}%`;
    }

    updateStorySlides(progress);
  }

  // Update story overlay slides based on scroll progress
  function updateStorySlides(progress) {
    if (!slides.length) return;

    // Slide 1: 0.00 -> 0.22
    // Slide 2: 0.26 -> 0.50
    // Slide 3: 0.54 -> 0.78
    // Slide 4: 0.82 -> 1.00
    let activeIndex = -1;

    if (progress <= 0.22) {
      activeIndex = 0;
    } else if (progress >= 0.26 && progress <= 0.50) {
      activeIndex = 1;
    } else if (progress >= 0.54 && progress <= 0.78) {
      activeIndex = 2;
    } else if (progress >= 0.82) {
      activeIndex = 3;
    }

    slides.forEach((slide, idx) => {
      if (idx === activeIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }

  // 60fps Render Loop with linear interpolation
  function loop() {
    if (!isAutoplaying) {
      const diff = targetFrame - currentFrame;
      if (Math.abs(diff) > 0.01) {
        currentFrame += diff * 0.18; // smooth lerp
        renderFrame(Math.round(currentFrame));
      }
    }
    rafId = requestAnimationFrame(loop);
  }

  // Autoplay video mode toggle
  function toggleAutoplay() {
    isAutoplaying = !isAutoplaying;

    if (isAutoplaying) {
      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'inline-block';
      if (playToggleBtn) {
        playToggleBtn.classList.add('playing');
        playToggleBtn.title = 'Pause Video Mode';
      }

      autoplayInterval = setInterval(() => {
        currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
        targetFrame = currentFrame;
        renderFrame(Math.round(currentFrame));

        const progress = currentFrame / (TOTAL_FRAMES - 1);
        if (progressBar) progressBar.style.width = `${(progress * 100).toFixed(1)}%`;
        updateStorySlides(progress);
      }, 1000 / 24); // 24 fps smooth cinema playback
    } else {
      if (playIcon) playIcon.style.display = 'inline-block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (playToggleBtn) {
        playToggleBtn.classList.remove('playing');
        playToggleBtn.title = 'Play as Video';
      }
      clearInterval(autoplayInterval);
      updateScroll();
    }
  }

  // Event Listeners
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', () => {
    resizeCanvas();
    updateScroll();
  }, { passive: true });

  if (playToggleBtn) {
    playToggleBtn.addEventListener('click', toggleAutoplay);
  }

  // Init
  resizeCanvas();
  preloadFrames();
  updateScroll();
  rafId = requestAnimationFrame(loop);

  // Safety timer: ensure loader hides even on slow connections after 3.5s
  setTimeout(() => {
    if (loader && !loader.classList.contains('loaded')) {
      loader.classList.add('loaded');
      renderFrame(0);
    }
  }, 3500);

})();
