/**
 * BUTT KARAHI - GLOBAL APP LOGIC
 * Includes:
 * - Mobile Navigation & Header Scroll State
 * - Interactive Reviews Carousel
 * - FAQ Accordion
 * - Cart Management & Realtime Ordering Flow
 * - Location & Fulfillment Selectors
 * - AI Online Waiter Chatbot Assistant
 * - Toast Notification System
 */

(function () {
  'use strict';

  // State Management
  const state = {
    cart: JSON.parse(localStorage.getItem('bk_cart') || '[]'),
    location: localStorage.getItem('bk_location') || 'Winston Churchill',
    fulfillment: localStorage.getItem('bk_fulfillment') || 'pickup',
    discountApplied: false,
    discountCode: 'BUTT10',
    discountPercent: 0.10
  };

  // Locations Data
  const LOCATIONS = {
    'Winston Churchill': {
      name: 'Butt Karahi - Winston Churchill',
      address: '3015 Winston Churchill Blvd #7, Mississauga, ON L5L 2V8',
      phone: '(905) 484-5677',
      hours: 'Mon-Sun: 12:00 PM - 11:30 PM'
    },
    'Ridgeway Plaza': {
      name: 'Butt Karahi - Ridgeway Plaza',
      address: '3960 Eglinton Ave W #415, Mississauga, ON L5M 2R9',
      phone: '(905) 607-2629',
      hours: 'Mon-Sun: 12:00 PM - 2:00 AM (Late Night)'
    },
    'Pickering': {
      name: 'Butt Karahi - Pickering',
      address: '820 Kingston Rd, Pickering, ON L1V 1A8',
      phone: '(905) 839-3002',
      hours: 'Mon-Sun: 12:00 PM - 11:00 PM'
    }
  };

  // ==========================================================================
  // HEADER & NAVIGATION
  // ==========================================================================
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const expanded = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', expanded);
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
      }
    });
  }

  // ==========================================================================
  // TOAST NOTIFICATIONS
  // ==========================================================================
  function showToast(message, icon = '✓') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const iconSpan = document.createElement('span');
    iconSpan.style.color = 'var(--gold-400)';
    iconSpan.textContent = icon;
    
    const textSpan = document.createElement('span');
    textSpan.textContent = message;
    
    toast.appendChild(iconSpan);
    toast.appendChild(textSpan);
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==========================================================================
  // REVIEWS CAROUSEL
  // ==========================================================================
  const reviewTrack = document.querySelector('.reviews-track');
  const reviewCards = document.querySelectorAll('.review-card');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (reviewTrack && reviewCards.length) {
    let currentIndex = 0;
    const total = reviewCards.length;

    // Create dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToReview(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateCarousel() {
      const cardWidth = reviewCards[0].offsetWidth + 28; // gap
      reviewTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

      const dots = document.querySelectorAll('.carousel-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    function goToReview(index) {
      currentIndex = (index + total) % total;
      updateCarousel();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToReview(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToReview(currentIndex + 1));

    // Auto rotate every 6s
    let autoInterval = setInterval(() => goToReview(currentIndex + 1), 6000);

    reviewTrack.addEventListener('mouseenter', () => clearInterval(autoInterval));
    reviewTrack.addEventListener('mouseleave', () => {
      autoInterval = setInterval(() => goToReview(currentIndex + 1), 6000);
    });
  }

  // ==========================================================================
  // FAQ ACCORDION
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach((other) => other.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });

  // ==========================================================================
  // CART & ORDERING STATE
  // ==========================================================================
  function saveCart() {
    localStorage.setItem('bk_cart', JSON.stringify(state.cart));
    updateCartUI();
  }

  function updateCartUI() {
    // 1. Update Cart Badge Count
    const badges = document.querySelectorAll('.cart-badge');
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    badges.forEach((b) => (b.textContent = totalCount));

    // 2. Render Cart Items inside Cart Sidebar & Cart Modal
    const cartContainers = document.querySelectorAll('.cart-items-container');
    cartContainers.forEach((container) => {
      if (state.cart.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted);">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🛍️</div>
            <p>Your order is currently empty</p>
            <p style="font-size: 0.8rem; margin-top: 0.3rem;">Add delicious Karahis and fresh Naans to start!</p>
          </div>
        `;
      } else {
        container.innerHTML = state.cart
          .map(
            (item, index) => `
          <div class="cart-item-row">
            <div>
              <div class="cart-item-name">${escapeHtml(item.name)}</div>
              <div style="font-size: 0.8rem; color: var(--gold-400); font-weight: 700;">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
            <div class="cart-qty-stepper">
              <button class="qty-btn" onclick="window.ButtKarahi.updateItemQty(${index}, -1)">−</button>
              <span style="font-size: 0.85rem; font-weight: 700; min-width: 16px; text-align: center;">${item.quantity}</span>
              <button class="qty-btn" onclick="window.ButtKarahi.updateItemQty(${index}, 1)">+</button>
            </div>
          </div>
        `
          )
          .join('');
      }
    });

    // 3. Compute Totals
    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = state.discountApplied ? subtotal * state.discountPercent : 0;
    const discountedSubtotal = Math.max(0, subtotal - discount);
    const tax = discountedSubtotal * 0.13; // 13% Ontario HST
    const deliveryFee = state.fulfillment === 'delivery' && state.cart.length > 0 ? 4.99 : 0;
    const finalTotal = discountedSubtotal > 0 ? discountedSubtotal + tax + deliveryFee : 0;

    // Update Totals Display
    const subtotalEls = document.querySelectorAll('.cart-subtotal-val');
    subtotalEls.forEach((el) => (el.textContent = `$${subtotal.toFixed(2)}`));

    const taxEls = document.querySelectorAll('.cart-tax-val');
    taxEls.forEach((el) => (el.textContent = `$${tax.toFixed(2)}`));

    const discountEls = document.querySelectorAll('.cart-discount-val');
    discountEls.forEach((el) => (el.textContent = `-$${discount.toFixed(2)}`));

    const totalEls = document.querySelectorAll('.cart-total-val');
    totalEls.forEach((el) => (el.textContent = `$${finalTotal.toFixed(2)}`));

    const deliveryFeeRows = document.querySelectorAll('.delivery-fee-row');
    deliveryFeeRows.forEach((row) => {
      row.style.display = state.fulfillment === 'delivery' ? 'flex' : 'none';
    });
  }

  function addItemToCart(name, price, portion = 'Full') {
    const existing = state.cart.find((i) => i.name === name);
    if (existing) {
      existing.quantity++;
    } else {
      state.cart.push({ name, price: parseFloat(price), portion, quantity: 1 });
    }
    saveCart();
    showToast(`Added ${name} to order!`, '🛒');
  }

  function updateItemQty(index, change) {
    if (!state.cart[index]) return;
    state.cart[index].quantity += change;
    if (state.cart[index].quantity <= 0) {
      state.cart.splice(index, 1);
      showToast('Item removed from order', 'ℹ️');
    }
    saveCart();
  }

  function applyPromoCode(code) {
    if (code.trim().toUpperCase() === state.discountCode) {
      state.discountApplied = true;
      saveCart();
      showToast('10% Exclusive Web Discount Applied!', '🎉');
      return true;
    } else {
      showToast('Invalid promo code. Try BUTT10', '⚠️');
      return false;
    }
  }

  // ==========================================================================
  // LOCATION & FULFILLMENT SELECTORS
  // ==========================================================================
  const locationModal = document.getElementById('location-modal');
  const locationTriggers = document.querySelectorAll('.location-select-trigger');
  const locationDisplays = document.querySelectorAll('.current-location-text');

  function setLocation(locKey) {
    if (LOCATIONS[locKey]) {
      state.location = locKey;
      localStorage.setItem('bk_location', locKey);
      locationDisplays.forEach((el) => (el.textContent = locKey));
      if (locationModal) locationModal.classList.remove('open');
      showToast(`Selected location: ${locKey}`, '📍');
    }
  }

  if (locationTriggers.length && locationModal) {
    locationTriggers.forEach((btn) => {
      btn.addEventListener('click', () => locationModal.classList.add('open'));
    });
  }

  const fulfillmentBtns = document.querySelectorAll('.fulfillment-toggle-btn');
  fulfillmentBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      state.fulfillment = type;
      localStorage.setItem('bk_fulfillment', type);
      fulfillmentBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-type') === type));
      saveCart();
      showToast(`Order fulfillment set to ${type.toUpperCase()}`, '🚗');
    });
  });

  // Modal Close buttons
  document.querySelectorAll('.modal-close-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-backdrop').forEach((m) => m.classList.remove('open'));
    });
  });

  // ==========================================================================
  // AI ONLINE WAITER CHATBOT
  // ==========================================================================
  const waiterTrigger = document.querySelector('.online-waiter-trigger');
  const waiterWindow = document.querySelector('.waiter-chat-window');
  const waiterClose = document.querySelector('.waiter-close-btn');
  const waiterForm = document.querySelector('.waiter-chat-form');
  const waiterInput = document.querySelector('.waiter-chat-input');
  const waiterMessages = document.querySelector('.waiter-chat-messages');

  const WAITER_KNOWLEDGE = [
    {
      keywords: ['recommend', 'best', 'signature', 'popular', 'famous'],
      reply: 'Our crown jewels are the Butt Special Goat Karahi and Chicken Tikka Karahi, simmered in pure desi ghee over high heat! Pair it with freshly baked Til Wala Naan and Char-grilled Seekh Kebabs.'
    },
    {
      keywords: ['halal', 'zabiha', 'meat'],
      reply: '100% strictly Halal! All our meats are freshly cut and hand-slaughtered Zabiha Halal, adhering to the highest standards since 1975.'
    },
    {
      keywords: ['spice', 'spicy', 'mild', 'hot'],
      reply: 'All our Karahis can be tailored from Mild, Medium to Lahori Hot! If you enjoy authentic Lahori zest, we recommend Medium-Hot with fresh ginger slivers and green chilies.'
    },
    {
      keywords: ['location', 'where', 'address', 'hours', 'mississauga', 'pickering'],
      reply: 'We have 3 flagship GTA locations: 1) Winston Churchill (Erin Mills), 2) Ridgeway Plaza (open late till 2 AM!), and 3) Pickering on Kingston Rd. Which one are you closest to?'
    },
    {
      keywords: ['vegetarian', 'veg', 'paneer', 'daal'],
      reply: 'We offer exquisite vegetarian Lahori specialties including Daal Channa Karahi, Paneer Karahi, Palak Paneer, and Khoya Wale Channay with fresh Tandoori Roti!'
    },
    {
      keywords: ['catering', 'party', 'wedding', 'tray'],
      reply: 'We cater weddings, corporate gatherings, and family parties with generous celebration platters and party trays. Visit our Franchising or Catering page to inquire!'
    },
    {
      keywords: ['discount', 'deal', 'promo', 'code', 'coupon'],
      reply: 'Use promo code "BUTT10" at checkout for an exclusive 10% off your direct website order!'
    }
  ];

  if (waiterTrigger && waiterWindow) {
    waiterTrigger.addEventListener('click', () => {
      waiterWindow.classList.toggle('open');
      if (waiterWindow.classList.contains('open') && waiterInput) {
        waiterInput.focus();
      }
    });

    if (waiterClose) {
      waiterClose.addEventListener('click', () => waiterWindow.classList.remove('open'));
    }

    if (waiterForm && waiterInput && waiterMessages) {
      waiterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = waiterInput.value.trim();
        if (!query) return;

        // Append user bubble
        appendChatBubble(query, 'user');
        waiterInput.value = '';

        // Generate response
        setTimeout(() => {
          const lower = query.toLowerCase();
          const match = WAITER_KNOWLEDGE.find((item) =>
            item.keywords.some((kw) => lower.includes(kw))
          );
          const reply = match
            ? match.reply
            : "Welcome to Butt Karahi! We're proud to serve authentic Lahori taste. Feel free to ask about our famous Goat Karahi, BBQ Seekh Kebabs, spice levels, or locations!";
          appendChatBubble(reply, 'bot');
        }, 500);
      });
    }
  }

  function appendChatBubble(text, sender) {
    if (!waiterMessages) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.textContent = text;
    waiterMessages.appendChild(bubble);
    waiterMessages.scrollTop = waiterMessages.scrollHeight;
  }

  // Security Helper: escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Expose global methods
  window.ButtKarahi = {
    addItemToCart,
    updateItemQty,
    setLocation,
    applyPromoCode,
    showToast,
    checkout: function () {
      if (state.cart.length === 0) {
        showToast('Please add items to your cart first!', '⚠️');
        return;
      }
      showToast('Proceeding to secure checkout...', '🔒');
      setTimeout(() => {
        alert(
          `Thank you for dining with Butt Karahi!\n\nOrder for: ${state.location}\nType: ${state.fulfillment.toUpperCase()}\nItems: ${state.cart.length}\nTotal: $${(
            state.cart.reduce((s, i) => s + i.price * i.quantity, 0) * 1.13
          ).toFixed(2)}\n\nOrder submitted successfully!`
        );
        state.cart = [];
        saveCart();
      }, 600);
    }
  };

  // Initial State Hydration
  locationDisplays.forEach((el) => (el.textContent = state.location));
  updateCartUI();

})();
